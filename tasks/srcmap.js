/* eslint-env node, es6 */
'use strict';
const fs                = require('fs');
const path              = require('path');
const convert           = require('convert-source-map');
const SourceMapConsumer = require('source-map').SourceMapConsumer;
const SourceNode        = require('source-map').SourceNode;

///////////////////////////////////////////////////////////////////////
// exports methods:

// get sourceNode from inline-source-map file
function getNodeFromScriptFile(scriptfile) {
    if (fs.existsSync(scriptfile)) {
        return SourceNode.fromStringWithSourceMap(
            getScriptFromFile(scriptfile),
            new SourceMapConsumer(getMapFromScriptFile(scriptfile))
        );
    } else {
        return new SourceNode();
    }
}

// get sourceNode from script and map files
function getNodeFromFiles(scriptFile, mapFile) {
    if (fs.existsSync(scriptFile) && fs.existsSync(mapFile)) {
        return SourceNode.fromStringWithSourceMap(
            getScriptFromFile(scriptFile),
            new SourceMapConsumer(getMapFromMapFile(mapFile))
        );
    } else {
        return new SourceNode();
    }
}

// get sourceNode from code
function getNodeFromCode(code) {
    if (/^\/\/[@#]\s+sourceMappingURL=(.+)/gm.test(code)) {
        return SourceNode.fromStringWithSourceMap(
            convertCode2Script(code),
            new SourceMapConsumer(convert.fromComment(code).toObject())
        );
    } else {
        let node = new SourceNode();
        node.add(convertCode2Script(code));
        return node;
    }
}

// get code with inline-source-map from file SourceNode
function getCodeFromNode(node, renameSources) {
    let code_map = getCodeMap(node);
    let rename = renameSources;
    let i, n;
    let objMap = code_map.map.toJSON();

    if (rename) {
        if ('string' === typeof rename) {
            for (i = 0, n = objMap.sources.length; i < n; i++) {
                objMap.sources[i] = rename + objMap.sources[i];
            }
        } else if ('function' === typeof rename) {
            for (i = 0, n = objMap.sources.length; i < n; i++) {
                objMap.sources[i] = rename(objMap.sources[i]);
            }
        } else {
            console.warn('unexpected type of rename: ' + typeof rename);
        }
    }

    return node.toString().replace(/\r\n/gm, '\n') +
        convert.fromObject(objMap)
            .toComment()
            .replace(/charset=utf\-8;/gm, '')
            .replace('data:application/json;', 'data:application/json;charset=utf-8;');
}

// separate source script and map from file
function separateScriptAndMapFromScriptFile(scriptFile, mapPath) {
    let node = getNodeFromScriptFile(scriptFile);
    mapPath = mapPath || path.basename(scriptFile, '.js') + '.map';
    return {
        script: node.toString().replace(/\r\n/gm, '\n') + '//# sourceMappingURL=' + mapPath,
        map: JSON.stringify(getCodeMap(node).map.toJSON()),
    };
}

///////////////////////////////////////////////////////////////////////
// private methods:

// // get sourceMap object from inline-source-map file
function getMapFromScriptFile(scriptFile) {
    let code = fs.readFileSync(scriptFile).toString();
    return convert.fromComment(code).toObject();
}

function getMapFromMapFile(mapFile) {
    let json = fs.readFileSync(mapFile).toString();
    return JSON.parse(json);
}

// get code from file
function getScriptFromFile(scriptFile) {
    let code = fs.readFileSync(scriptFile).toString();
    return convertCode2Script(code);
}

// convert to script (non including source-map)
function convertCode2Script(code) {
    // clean source code comment
    return code
        .replace(/\/\/\/ <reference path="[\s\S]*?>/gm, '')
        .replace(/^\/\/[@#]\s+sourceMappingURL=(.+)/gm, '');
}

// get code map with path from node
function getCodeMap(node) {
    let code_map = node.toStringWithSourceMap();

    // patch
    node.walkSourceContents(function (sourceFile, sourceContent) {
        if (!code_map.map._sources.has(sourceFile)) {
            code_map.map._sources.add(sourceFile);
        }
    });

    return code_map;
}

module.exports = {
    getNodeFromScriptFile: getNodeFromScriptFile,
    getNodeFromFiles: getNodeFromFiles,
    getNodeFromCode: getNodeFromCode,
    getCodeFromNode: getCodeFromNode,
    separateScriptAndMapFromScriptFile: separateScriptAndMapFromScriptFile,
};

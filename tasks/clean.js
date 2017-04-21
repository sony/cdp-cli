'use strict';
const fs        = require('fs-extra');
const path      = require('path');
const glob      = require('glob');
const config    = require('../project.config.js');

const SRC_DIR       = path.join(process.cwd(), config.dir.src);
const BUILT_DIR     = path.join(process.cwd(), config.dir.built);
const COVERAGE_DIR  = path.join(process.cwd(), config.dir.doc, 'reports', 'coverage');
const TYPEDOC_DIR   = path.join(process.cwd(), config.dir.doc, 'typedoc');
const TEST_DIR      = path.join(process.cwd(), config.dir.test, 'jasmine');

function main() {
    const removeGeneratedFiles = (root) => {
        console.log("root: " + root);
        let files = glob.sync('{*.js,*.map}', {
            cwd: root,
            nodir: true,
        });

        files.forEach(function (file) {
            fs.unlinkSync(path.join(root, file));
            console.log('removed: ' + file);
        });
    };

    fs.removeSync(TYPEDOC_DIR);
    fs.removeSync(COVERAGE_DIR);

    if (SRC_DIR !== BUILT_DIR) {
        fs.removeSync(BUILT_DIR);
    } else {
        removeGeneratedFiles(BUILT_DIR);
    }

    removeGeneratedFiles(TEST_DIR);
}

main();

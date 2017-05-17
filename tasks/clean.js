/* eslint-env node, es6 */
'use strict';
const del       = require('del');
const path      = require('path');
const config    = require('../project.config.js');

const COVERAGE_DIR  = path.join(process.cwd(), config.dir.doc, 'reports', 'coverage');
const TYPEDOC_DIR   = path.join(process.cwd(), config.dir.doc, 'typedoc');
const TEST_DIR      = path.join(process.cwd(), config.dir.test, 'jasmine');

function safeExec(src) {
    try {
        require(src);
    } catch (error) {
        // noop.
    }
}

function main() {
    del.sync(TYPEDOC_DIR);
    del.sync(COVERAGE_DIR);
    del.sync(['**/*.js', '**/*.map'], { cwd: TEST_DIR });
    safeExec('./build-ts-clean.js');
}

main();

'use strict';
const fs        = require('fs-extra');
const path      = require('path');
const config    = require('../project.config.js');

const DIST_DIR  = path.join(process.cwd(), config.dir.pkg);
const BUILT_DIR = path.join(process.cwd(), config.dir.built);

function clean() {
    fs.removeSync(DIST_DIR);
    fs.removeSync(BUILT_DIR);
}

function main() {
    clean();
}

main();

'use strict';
const fs        = require('fs-extra');
const path      = require('path');
const config    = require('../project.config.js');

function remove() {
    const modules = config.libmodules.modules;
    const srcLocation = 'node_modules';

    modules.forEach((module) => {
        const src = path.join(process.cwd(), srcLocation, module);
        if (fs.existsSync(src)) {
            fs.removeSync(src);
        }
    });
}

function link() {
    const modules = config.libmodules.modules;
    const srcLocation = config.libmodules.root;
    const dstLocation = 'node_modules';

    modules.forEach((module) => {
        const linkType = 'win32' === process.platform ? 'junction' : 'dir';
        const src = path.join(process.cwd(), srcLocation, module);
        if (fs.existsSync(src)) {
            const dst = path.join(process.cwd(), dstLocation, module);
            console.log('src:' + src);
            console.log('dst:' + dst);
            fs.symlinkSync(src, dst, linkType);
        }
    });
}

function main() {
    remove();
    link();
}

main();

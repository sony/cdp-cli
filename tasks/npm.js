'use strict';
const spawn = require('child_process').spawn;

// command
function command(commandString, shouldEnd) {
    let args = commandString.trim().split(' ');
    let cmd = args.shift() + ((process.platform === 'win32') ? '.cmd' : '');
    let child = spawn(cmd, args);
    child.stdout.pipe(process.stdout, { end: shouldEnd });
    child.stderr.pipe(process.stderr, { end: shouldEnd });
    process.stdin.pipe(child.stdin);
}

// npm operation
function npm(operation) {
    return new Promise((resolve, reject) => {
        console.log('*** Start npm ' + operation + ' ***');

        let npmcmd = (process.platform === 'win32' ? 'npm.cmd' : 'npm');
        let _npm;

        try {
            _npm = spawn(npmcmd, operation.trim().split(' '), { cwd: process.cwd(), stdio: 'inherit' });
        } catch (error) {
            reject('error: ' + error);
        }

        _npm
            .on('error', (error) => {
                reject('error: ' + error);
            })
            .on('close', (code) => {
                if (0 === code) {
                    console.log('*** End npm ' + operation + ' ***\n');
                    resolve();
                } else {
                    reject('*** Faild npm ' + operation + ' *** : error code = ' + code + '\n');
                }
            });
    });
}

function handleError(msg) {
    console.log(msg);
    process.exit(1);
}

function main () {
    if (process.platform === 'win32') {
        command('start-ssh-agent', true);
    }

    let operations = ['install'];
    if (0 <= process.argv.slice(2/*node npm.js*/).join(';').indexOf('--update')) {
        operations = ['update --save', 'update --save-dev'];
    }

    const proc = () => {
        let operation = operations.shift();
        if (!operation) {
            process.exit(0);
        } else {
            npm(operation)
                .then(() => {
                    setTimeout(proc);
                })
                .catch((error) => {
                    handleError(error);
                });
        }
    };

    setTimeout(proc);
}

main();

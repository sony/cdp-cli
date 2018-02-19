import * as os from "os";
import { spawn, SpawnOptions } from "child_process";
import { Spinner } from "cli-spinner";
import * as which from "which";
import * as deepExtend from "deep-extend";

import {
    assert,
} from "./settings";

export {
    deepExtend,
};

///////////////////////////////////////////////////////////////////////
// exports methods:

/**
 * Handle command line error and kill process.
 * When the application received error from cli, please call this method.
 *
 * @param {String} error  error information.
 */
export function handleError(error: string): void {
    assert(false, error);
}

//___________________________________________________________________________________________________________________//

/**
 * Get spinner instance.
 * CLI helper.
 *
 * @param  {String}  [format]  spinner format string.
 * @param  {Number}  [index]   spinner index defined by cli-spinner. (default: random [0-29])
 * @return {Spinner} cli-spinner instance.
 */
export function getSpinner(format?: string, index?: number): { start: () => void; stop: (clean?: boolean) => void; } {
    const spinners = [
        "|/-\\",
        "┤┘┴└├┌┬┐",
        "◢◣◤◥",
        "▌▀▐▄",
        "▉▊▋▌▍▎▏▎▍▌▋▊▉",
        "▁▃▄▅▆▇█▇▆▅▄▃",
        "☱☲☴",
        ".oO@*",
        "◐◓◑◒",
        ////
        "◡◡ ⊙⊙ ◠◠",
        "■□▪▫",
        "←↖↑↗→↘↓↙",
        ".oO°Oo.",
    ];
    const fmt = format || "%s";
    const spinner = new Spinner(fmt);
    const idx = (null != index && 0 <= index && index < 14) ? index : Math.floor(Math.random() * 10);
    spinner.setSpinnerString(spinners[idx]);
    return spinner;
}

//___________________________________________________________________________________________________________________//

/**
 * @interface ExecCommandOptions
 * @brief execCommand() に指定するオプション
 */
export interface ExecCommandOptions extends SpawnOptions {
    spinner?: {
        format?: string;    // ex) "%s"
        index?: number;     // 0 - 9 の数値を指定
    };
    stdout?: (data: string) => void;
    stderr?: (data: string) => void;
}

/**
 * Execute command line by spawn.
 * call spawn. if error occured, cui is killed proccess.
 *
 * @param   {String}               command    main command. ex) "cordova"
 * @param   {String[]}             args       command args. ex) ["plugin", "add", pluginName]
 * @param   {ExecCommandOptions}   [options]  cli-spinner"s options.
 * @returns {Number} error code
 */
export function execCommand(command: string, args: string[], options?: ExecCommandOptions): Promise<number> {
    return new Promise((resolve, reject) => {
        const opt: ExecCommandOptions = deepExtend({}, {
            stdio: "inherit",
            spinner: { format: "%s" },
            stdout: (data: string): void => { /* noop */ },
            stderr: (data: string): void => { /* noop */ },
        }, options);

        // on win32, command and args need to be quoted if containing spaces
        const quoteIfNeeded = (str: string): string => {
            if ("win32" === os.platform() && str.includes(" ")) {
                str = "\"" + str + "\"";
                opt.shell = true;
            }
            return str;
        };

        which(command, (error, resolvedCommand) => {
            if (error) {
                handleError(JSON.stringify(error));
            }

            const spinner = opt.spinner ? getSpinner(opt.spinner.format, opt.spinner.index) : null;
            if (spinner) {
                spinner.start();
            }

            resolvedCommand = quoteIfNeeded(resolvedCommand);
            args = args.map(quoteIfNeeded);
            const child = spawn(resolvedCommand, args, opt)
                .on("error", handleError)
                .on("close", (code) => {
                    if (spinner) {
                        spinner.stop(true);
                    }
                    resolve(code);
                });

            if ("pipe" === opt.stdio) {
                child.stdout.on("data", (data) => {
                    opt.stdout(data.toString());
                });
                child.stderr.on("data", (data) => {
                    opt.stderr(data.toString());
                });
            }
        });
    });
}


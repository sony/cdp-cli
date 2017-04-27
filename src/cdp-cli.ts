/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as chalk from "chalk";
import {
    CommandParser,
    ICommandLineInfo,
} from "./command-parser";
import {
    PromptApp,
    PromptBase,
} from "./prompt-app";
import { PromptModule } from "./prompt-module";

function getInquirer(cmdInfo: ICommandLineInfo): PromptBase {
    switch (cmdInfo.target) {
        case "app":
            return new PromptApp();
        case "module":
            return new PromptModule();
        default:
            console.error(chalk.red("unsupported target: " + cmdInfo.target));
            process.exit(1);
    }
}

export function main() {
    process.title = "cdp";
    const cmdInfo = CommandParser.parse(process.argv);
    const inquirer = getInquirer(cmdInfo);

    inquirer.prompting(cmdInfo)
        .then(() => {
            console.log("call cdp-lib");
        })
        .catch((reason: any) => {
            if ("string" !== typeof reason) {
                reason = JSON.stringify(reason);
            }
            console.error(chalk.red(reason));
        })
        .then(() => {
            console.log("always");
        });
}

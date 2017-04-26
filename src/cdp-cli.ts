/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as chalk from "chalk";
import {
    CommandParser,
    ICommandLineInfo,
} from "./command-parser";
import {
    InquirerApp,
    InquirerBase,
} from "./inquirer-app";
import { InquirerModule } from "./inquirer-module";

function getInquirer(cmdInfo: ICommandLineInfo): InquirerBase {
    switch (cmdInfo.target) {
        case "app":
            return new InquirerApp();
        case "module":
            return new InquirerModule();
        default:
            console.error(chalk.red("unsupported target: " + cmdInfo.target));
            process.exit(1);
    }
}

export function main() {
    process.title = "cdp";
    const cmdInfo = CommandParser.parse(process.argv);
    const inquirer = getInquirer(cmdInfo);

    inquirer.inquire(cmdInfo)
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

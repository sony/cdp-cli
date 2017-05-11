import {
    default as CDPLib,
    Utils,
} from "cdp-lib";
import {
    CommandParser,
    ICommandLineInfo,
} from "./command-parser";
import {
    PromptBase,
} from "./prompt-base";
import {
    PromptLibrary,
} from "./prompt-library";
import {
    PromptMobileApp,
} from "./prompt-mobile";
import {
    PromptDesktopApp,
} from "./prompt-desktop";
import {
    PromptWebApp,
} from "./prompt-web";

const chalk = Utils.chalk;

function getInquirer(cmdInfo: ICommandLineInfo): PromptBase {
    switch (cmdInfo.action) {
        case "create":
            break;
        default:
            console.error(chalk.red(cmdInfo.action + " command: under construction."));
            process.exit(1);
    }

    switch (cmdInfo.target) {
        case "library":
            return new PromptLibrary();
        case "mobile":
            return new PromptMobileApp();
        case "desktop":
            return new PromptDesktopApp();
        case "web":
            return new PromptWebApp();
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
        .then((config) => {
            console.log(cmdInfo.cliOptions.config);
            // execute
            CDPLib.execute(config);
        })
        .catch((reason: any) => {
            if ("string" !== typeof reason) {
                reason = JSON.stringify(reason);
            }
            console.error(chalk.red(reason));
        })
        .then(() => {
            // NOTE: es6 promise's always block.
        });
}

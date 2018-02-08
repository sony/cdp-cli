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
import {
    default as CDPDoc,
} from "./cdp-doc";

const chalk = Utils.chalk;

function getCreateInquirer(cmdInfo: ICommandLineInfo): PromptBase {
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

function inquireCreate(cmdInfo: ICommandLineInfo): void {
    const inquirer = getCreateInquirer(cmdInfo);

        inquirer.prompting(cmdInfo)
            .then((config) => {
                // execute
                return CDPLib.execute(config);
            })
            .then(() => {
                console.log(chalk.green(inquirer.lang.finished[cmdInfo.action]));
            })
            .catch((reason: any) => {
                if ("string" !== typeof reason) {
                    if (null != reason.message) {
                        reason = reason.message;
                    } else {
                        reason = JSON.stringify(reason);
                    }
                }
                console.error(chalk.red(reason));
            })
            .then(() => {
                // NOTE: es6 promise's always block.
            });
}

function browseDoc(prt: string): void {
    CDPDoc.execute(prt).then((resolve) => {
        console.log("Automaticaly web browser opened and you can browse cdp documents.");
        console.log("To quit browsing, press Ctrl + C.");
    })
    .catch((reject) => {
        console.log("Default port 8080 is already used. Please use another port, for example $ cdp doc -p 3000");
    });
}

export function main() {
    process.title = "cdp";
    const cmdInfo = CommandParser.parse(process.argv);
    const prt: string = cmdInfo.cliOptions.port;

    switch (cmdInfo.action) {
        case "create":
            inquireCreate(cmdInfo);
            break;
        case "doc":
            browseDoc(prt);
            break;
        default:
            console.error(chalk.red(cmdInfo.action + " command: under construction."));
            process.exit(1);
    }
}

/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import { CommandParser } from "./command-parser";

export function main() {
    process.title = "cdp";
    const cmdlineInfo = CommandParser.parse(process.argv);

    console.log("action: " + cmdlineInfo.action);
    console.log("target: " + cmdlineInfo.target);
}

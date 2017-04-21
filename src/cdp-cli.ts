import { fs } from "./utils";

/**
 * @class CDPLib
 * @brief CDP boilerplate 生成機能を提供するクラス
 */
export class CDPLib {
    /**
     * main command
     */
    public static execute(options: any): void {
        if (fs.existsSync("package.json")) {
            console.log("ok");
        } else {
            console.log("ng");
        }
    }
}

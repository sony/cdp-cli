import * as Utils from "./utils";

/**
 * @class CdpDoc
 * @brief TODO:
 */
export default class CDPDoc {

    ///////////////////////////////////////////////////////////////////////
    // pubic methods:

    /**
     * main command
     */
    public static execute(prt: string): Promise<void> {
        return Utils.launchLocalServer(prt)
        .then(() => {
            return Utils.launchBrowser(prt);
        });
    }
}

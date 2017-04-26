/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as inquirer from "inquirer";
import * as chalk from "chalk";
import {
    InquirerBase,
    ICommandLineInfo,
} from "./inquirer-base";

export { InquirerBase };

/**
 * @class InquirerApp
 * @brief アプリ用 Inquire クラス
 */
export class InquirerApp extends InquirerBase {

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * エントリ
     */
    public inquire(cmdInfo: ICommandLineInfo): Promise<any> {
        return new Promise((resolve, reject) => {
            reject("app inquirer, under construction.");
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods

    /**
     * プロジェクト設定項目の取得
     */
    get questions(): Object[] {
        // TODO:
        return [];
    }

    /**
     * プロジェクト設定の確認
     *
     * @returns {TODO} 設定値を返却
     */
    confirmSettings(): any {
        // TODO: show
        return null;
    }
}

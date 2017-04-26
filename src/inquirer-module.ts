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
 * @class InquirerModule
 * @brief モジュール用 Inquire クラス
 */
export class InquirerModule extends InquirerBase {

    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods

    /**
     * プロジェクト設定項目の取得
     */
    get questions(): Object[] {
        // TODO:
        return [
            {
                type: "input",
                name: "projectName",
                message: "TODO: プロジェクト名",
                default: this.answers.projectName || "CoolProjectName",
            },
        ];
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

    ///////////////////////////////////////////////////////////////////////
    // private methods
}

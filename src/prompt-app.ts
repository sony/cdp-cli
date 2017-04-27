/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as inquirer from "inquirer";
import * as chalk from "chalk";
import {
    PromptBase,
    ICommandLineInfo,
} from "./prompt-base";

export { PromptBase };

/**
 * @class PromptApp
 * @brief アプリ用 Inquire クラス
 */
export class PromptApp extends PromptBase {

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * エントリ
     */
    public prompting(cmdInfo: ICommandLineInfo): Promise<any> {
        return new Promise((resolve, reject) => {
            reject("app prompting, under construction.");
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods

    /**
     * プロジェクト設定項目の取得
     */
    get questions(): inquirer.Questions {
        // TODO:
        return [];
    }

    /**
     * プロジェクト設定の確認
     *
     * @returns {TODO} 設定値を返却
     */
    displaySettingsByAnswers(answers: inquirer.Answers): any {
        // TODO: show
        return null;
    }
}

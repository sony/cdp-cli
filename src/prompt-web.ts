/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as inquirer from "inquirer";
import * as chalk from "chalk";
import {
    IProjectConfigration,
    IWebAppConfigration,
} from "cdp-lib";
import {
    PromptBase,
    IAnswerSchema,
} from "./prompt-base";

/**
 * @class PromptWebApp
 * @brief ウェブアプリ用 Inquire クラス
 */
export class PromptWebApp extends PromptBase {

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * エントリ
     */
    public prompting(cmdInfo: any): Promise<IProjectConfigration> {
        return new Promise((resolve, reject) => {
            reject("web app prompting, under construction.");
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
     * @param  {IAnswerSchema} answers 回答結果
     * @return {IProjectConfigration} 設定値を返却
     */
    displaySettingsByAnswers(answers: IAnswerSchema): IProjectConfigration {
        // TODO: show
        return null;
    }
}

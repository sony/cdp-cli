/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as inquirer from "inquirer";
import * as chalk from "chalk";
import {
    IProjectConfigration,
    IMobileAppConfigration,
} from "cdp-lib";
import {
    PromptBase,
    ICommandLineInfo,
} from "./prompt-base";

/**
 * @class PromptMobileApp
 * @brief モバイルアプリ用 Inquire クラス
 */
export class PromptMobileApp extends PromptBase {

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * エントリ
     */
    public prompting(cmdInfo: ICommandLineInfo): Promise<IProjectConfigration> {
        return new Promise((resolve, reject) => {
            reject("mobile app prompting, under construction.");
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
     * @returns {IProjectConfigration} 設定値を返却
     */
    displaySettingsByAnswers(answers: inquirer.Answers): IProjectConfigration {
        // TODO: show
        return null;
    }
}

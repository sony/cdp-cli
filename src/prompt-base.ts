/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as inquirer from "inquirer";
import {
    IBoilerplateOptions,
    Utils,
} from "cdp-lib";
import { ICommandLineInfo } from "./command-parser";

export { ICommandLineInfo };

const _ = Utils._;


/**
 * @class PromptBase
 * @brief Prompt のベースクラス
 */
export abstract class PromptBase {

    private _cmdInfo: ICommandLineInfo;
    private _answers: inquirer.Answers = {};
    private _locale = {};

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * エントリ
     */
    public prompting(cmdInfo: ICommandLineInfo): Promise<any> {
        this._cmdInfo = cmdInfo;
        return new Promise((resolve, reject) => {
            this.showPrologue();
            this.inquireLanguage()
                .then(() => {
                    return this.inquire();
                })
                .then((settings: any) => {
                    resolve(settings);
                })
                .catch((reason: any) => {
                    reject(reason);
                });
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // abstruct methods

    /**
     * プロジェクト設定項目の取得
     */
    abstract get questions(): inquirer.Questions;

    /**
     * プロジェクト設定の確認
     *
     * @returns {TODO} 設定値を返却
     */
    abstract displaySettingsByAnswers(answers: inquirer.Answers): any;

    ///////////////////////////////////////////////////////////////////////
    // protected methods

    /**
     * ローカライズリソースにアクセス
     * ex) this.lang.projectName.message
     *
     * @return {Object} リソースオブジェクト
     */
    protected get lang(): any {
        return this._locale;
    }

    /**
     * 設定値にアクセス
     *
     * @return {Object} Answer オブジェクト
     */
    protected get answers(): inquirer.Answers {
        return this._answers;
    }

    /**
     * Welcome 表示
     */
    protected showPrologue(): void {
        // TODO:
    }

    /**
     * Answer オブジェクト の更新
     *
     * @return {Object} Answer オブジェクト
     */
    protected updateAnswers(update: inquirer.Answers): inquirer.Answers {
        return _.merge(this._answers, update);
    }

    /**
     * プロジェクト設定
     * 分岐が必要な場合はオーバーライドすること
     */
    protected inquireSettings(): Promise<inquirer.Answers> {
        return new Promise((resolve, reject) => {
            inquirer.prompt(this.questions)
                .then((answers) => {
                    resolve(answers);
                })
                .catch((reason: any) => {
                    reject(reason);
                });
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    /**
     * ローカライズリソースのロード
     */
    private loadLanguage(locale: string): void {
        this._locale = JSON.parse(fs.readFileSync(
            path.join(this._cmdInfo.pkgDir, "res/locales/messages." + locale + ".json"), "utf8").toString()
        );
    }

    /**
     * 言語選択
     */
    private inquireLanguage(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const question = [
                {
                    type: "list",
                    name: "language",
                    message: "Please choose your preferred language.",
                    choices: [
                        {
                            name: "English/英語",
                            value: "en-US",
                        },
                        {
                            name: "Japanese/日本語",
                            value: "ja-JP",
                        }
                    ],
                    default: 0,
                }
            ];
            inquirer.prompt(question)
                .then((answer) => {
                    this.loadLanguage(answer.language);
                    resolve();
                })
                .catch((reason: any) => {
                    reject(reason);
                });
        });
    }

    /**
     * 設定確認
     */
    private confirmSettings(): Promise<any> {
        return new Promise((resolve, reject) => {
            const settings = this.displaySettingsByAnswers(this._answers);
            console.log("check: " + this.lang.common.confirm.message);
            const question = [
                {
                    type: "confirm",
                    name: "confirmation",
                    message: this.lang.common.confirm.message,
                    default: true,
                }
            ];
            inquirer.prompt(question)
                .then((answer) => {
                    if (answer.confirmation) {
                        resolve(settings);
                    } else {
                        reject();
                    }
                })
                .catch((reason: any) => {
                    reject(reason);
                });
        });
    }

    /**
     * 設定
     */
    private inquire(): Promise<any> {
        return new Promise((resolve, reject) => {
            const proc = () => {
                this.inquireSettings()
                    .then((answers) => {
                        this.updateAnswers(answers);
                        this.confirmSettings()
                            .then((settings) => {
                                resolve(settings);
                            })
                            .catch(() => {
                                setTimeout(proc);
                            });
                    })
                    .catch((reason: any) => {
                        reject(reason);
                    });
            };
            setTimeout(proc);
        });
    }
}

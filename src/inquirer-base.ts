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
 * @class InquirerBase
 * @brief Inquire のベースクラス
 */
export abstract class InquirerBase {

    private _cmdInfo: ICommandLineInfo;
    private _answers: inquirer.Answers = {};
    private _locale = {};

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * エントリ
     */
    public inquire(cmdInfo: ICommandLineInfo): Promise<any> {
        this._cmdInfo = cmdInfo;
        return new Promise((resolve, reject) => {
            this.showPrologue();
            this.setLanguage()
                .then(() => {
                    return this.prompting();
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
    abstract get questions(): Object[];

    /**
     * プロジェクト設定の確認
     *
     * @returns {TODO} 設定値を返却
     */
    abstract confirmSettings(): any;

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
    protected setSettings(): Promise<inquirer.Answers> {
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
     * Welcome 表示
     */
    private showPrologue(): void {
        // TODO:
    }

    /**
     * ローカライズリソースのロード
     */
    private loadLanguage(locale: string): void {
        this._locale = JSON.parse(fs.readFileSync(
            path.join(this._cmdInfo.pkgDir, "res/locales/messages." + locale + ".json"), "utf8").toString()
        );
    }

    /**
     * Welcome 表示
     */
    private setLanguage(): Promise<void> {
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
    private confirm(): Promise<any> {
        return new Promise((resolve, reject) => {
            const settings = this.confirmSettings();
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
     * 設定プロンプト
     */
    private prompting(): Promise<any> {
        return new Promise((resolve, reject) => {
            const proc = () => {
                this.setSettings()
                    .then((answers) => {
                        this.updateAnswers(answers);
                        this.confirm()
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

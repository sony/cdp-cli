/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as inquirer from "inquirer";
import {
    IProjectConfigration,
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
    public prompting(cmdInfo: ICommandLineInfo): Promise<IProjectConfigration> {
        this._cmdInfo = cmdInfo;
        return new Promise((resolve, reject) => {
            this.showPrologue();
            this.inquireLanguage()
                .then(() => {
                    return this.inquire();
                })
                .then((settings: IProjectConfigration) => {
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
     * @returns {IProjectConfigration} 設定値を返却
     */
    abstract displaySettingsByAnswers(answers: inquirer.Answers): IProjectConfigration;

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
        console.log("\n" + chalk.gray("================================================================"));
        this.say("Welcome to CDP Boilerplate Generator!");
        console.log("\n" + chalk.gray("================================================================") + "\n");
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
    private confirmSettings(): Promise<IProjectConfigration> {
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
    private inquire(): Promise<IProjectConfigration> {
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

    /**
     * Like cowsay
     * https://en.wikipedia.org/wiki/Cowsay
     */
    private say(message: string): void {
        const GREETING =
            "\n  ≡     " + chalk.cyan("∧＿∧") + "    ／￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣" +
            "\n    ≡ " + chalk.cyan("（ ´∀｀）") + "＜  " + chalk.yellow(message) +
            "\n  ≡   " + chalk.cyan("（  つ＝つ") + "  ＼＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿" +
            "\n    ≡  " + chalk.cyan("｜ ｜ |") + "＼" +
            "\n    ≡ " + chalk.cyan("（_＿）＿）") + "＼" +
            "\n  ≡  " + chalk.red("◎") + "￣￣￣￣" + chalk.red("◎");
            console.log(GREETING);
    }
}

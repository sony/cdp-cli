import * as path from "path";
import * as inquirer from "inquirer";
import {
    IProjectConfigration,
    ICompileConfigration,
    Utils,
} from "cdp-lib";
import { ICommandLineInfo } from "./command-parser";

const fs    = Utils.fs;
const chalk = Utils.chalk;
const _     = Utils._;

/**
 * @interface IAnswerSchema
 * @brief Answer オブジェクトのスキーマ定義インターフェイス
 */
export interface IAnswerSchema
    extends inquirer.Answers, IProjectConfigration, ICompileConfigration {
    // 共通拡張定義
    extraSettings: "recommended" | "custom";
}

//___________________________________________________________________________________________________________________//

/**
 * @class PromptBase
 * @brief Prompt のベースクラス
 */
export abstract class PromptBase {

    private _cmdInfo: ICommandLineInfo;
    private _answers = <IAnswerSchema>{};
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

    /**
     * Like cowsay
     * https://en.wikipedia.org/wiki/Cowsay
     */
    public say(message: string): void {
        const GREETING =
            "\n  ≡     " + chalk.cyan("∧＿∧") + "    ／￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣" +
            "\n    ≡ " + chalk.cyan("（ ´∀｀）") + "＜  " + chalk.yellow(message) +
            "\n  ≡   " + chalk.cyan("（  つ") + "＝" + chalk.cyan("つ") + "  ＼＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿" +
            "\n    ≡  " + chalk.cyan("｜ ｜ |") + "＼" +
            "\n    ≡ " + chalk.cyan("（_＿）＿）") + "＼" +
            "\n  ≡   " + chalk.red("◎") + "￣￣￣￣" + chalk.red("◎");
        console.log(GREETING);
    }

    /**
     * ローカライズリソースにアクセス
     * ex) this.lang.prompt.projectName.message
     *
     * @return {Object} リソースオブジェクト
     */
    public get lang(): any {
        return this._locale;
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
     * @param  {IAnswerSchema} answers 回答結果
     * @return {IProjectConfigration} 設定値を返却
     */
    abstract displaySettingsByAnswers(answers: IAnswerSchema): IProjectConfigration;

    ///////////////////////////////////////////////////////////////////////
    // protected methods

    /**
     * 設定値にアクセス
     *
     * @return {Object} Answer オブジェクト
     */
    protected get answers(): IAnswerSchema {
        return this._answers;
    }

    /**
     * Prologue コメントの設定
     */
    protected get prologueComment(): string {
        return "Welcome to CDP Boilerplate Generator!";
    }

    /**
     * Welcome 表示
     */
    protected showPrologue(): void {
        console.log("\n" + chalk.gray("================================================================"));
        this.say(this.prologueComment);
        console.log("\n" + chalk.gray("================================================================") + "\n");
    }

    /**
     * Answer オブジェクト の更新
     *
     * @return {Object} Answer オブジェクト
     */
    protected updateAnswers(update: IAnswerSchema): IAnswerSchema {
        return _.merge(this._answers, update);
    }

    /**
     * プロジェクト設定
     * 分岐が必要な場合はオーバーライドすること
     */
    protected inquireSettings(): Promise<IAnswerSchema> {
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

    /**
     * setting から 設定説明の作成
     *
     * @param  {Object} config 設定
     * @param  {String} itemName 設定項目名
     * @return {String} 説明文
     */
    protected config2description(config: Object, itemName: string, color: string = "cyan"): string {
        const item = this.lang.settings[itemName];
        if (null == item) {
            console.error(chalk.red("error. item not found. item name: " + itemName));
            process.exit(1);
        }

        const prop: string = (() => {
            if (item.props) {
                return item.props[config[itemName]];
            } else if ("boolean" === typeof config[itemName]) {
                return item.bool[config[itemName] ? "yes" : "no"];
            } else {
                return config[itemName];
            }
        })();

        return item.label + chalk[color](prop);
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    /**
     * ローカライズリソースのロード
     */
    private loadLanguage(locale: string): void {
        try {
            this._locale = JSON.parse(fs.readFileSync(
                path.join(this._cmdInfo.pkgDir, "res/locales/messages." + locale + ".json"), "utf8").toString()
            );
        } catch (error) {
            throw Error("Language resource JSON parse error" + error.message);
        }
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
            console.log("\n" + chalk.gray("================================================================") + "\n");
            const settings = this.displaySettingsByAnswers(this._answers);
            console.log("\n" + chalk.gray("================================================================") + "\n");
            console.log("check: " + this.lang.prompt.common.confirm.message);
            const question = [
                {
                    type: "confirm",
                    name: "confirmation",
                    message: this.lang.prompt.common.confirm.message,
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
     * command line 情報を Conficuration に反映
     *
     * @param  {IProjectConfiguration} config 設定
     * @return {IProjectConfiguration} command line を反映させた config 設定
     */
    private reflectCommandInfo(config: IProjectConfigration): IProjectConfigration {
        config.action = this._cmdInfo.action;

        (<ICompileConfigration>config).minify = this._cmdInfo.cliOptions.minify;

        config.settings = {
            force: this._cmdInfo.cliOptions.force,
            verbose: this._cmdInfo.cliOptions.verbose,
            silent: this._cmdInfo.cliOptions.silent,
            libPath: path.join(this._cmdInfo.pkgDir, "node_modules", "cdp-lib"),
            targetDir: this._cmdInfo.cliOptions.targetDir,
            lang: this.lang.type,
        };

        return config;
    }

    /**
     * 設定インタラクション
     */
    private inquire(): Promise<IProjectConfigration> {
        return new Promise((resolve, reject) => {
            const proc = () => {
                this.inquireSettings()
                    .then((answers) => {
                        this.updateAnswers(answers);
                        this.confirmSettings()
                            .then((config) => {
                                resolve(this.reflectCommandInfo(config));
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

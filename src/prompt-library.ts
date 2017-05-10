import * as inquirer from "inquirer";
import {
    IProjectConfigration,
    ILibraryConfigration,
    Utils,
} from "cdp-lib";
import {
    PromptBase,
    IAnswerSchema,
} from "./prompt-base";
import defaultConfig from "./default-config";

const $             = Utils.$;
const chalk         = Utils.chalk;
const semverRegex   = Utils.semverRegex;
const libConfig = defaultConfig.library;

/**
 * @class PromptLibrary
 * @brief ライブラリモジュール用 Inquire クラス
 */
export class PromptLibrary extends PromptBase {

    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods

    /**
     * プロジェクト設定項目の取得
     */
    get questions(): inquirer.Questions {
        return [
            // project common settnigs (IProjectConfigration)
            {
                type: "input",
                name: "projectName",
                message: this.lang.prompt.common.projectName.message,
                default: this.answers.projectName || "CoolProjectName",
            },
            {
                type: "input",
                name: "version",
                message: this.lang.prompt.common.version.message,
                default: this.answers.version || "0.0.1",
                filter: (value) => {
                    if (semverRegex().test(value)) {
                        return semverRegex().exec(value)[0];
                    } else {
                        return value;
                    }
                },
                validate: (value) => {
                    if (semverRegex().test(value)) {
                        return true;
                    } else {
                        return this.lang.prompt.common.version.invalidMessage;
                    }
                },
            },
            {
                type: "list",
                name: "license",
                message: this.lang.prompt.common.license.message,
                choices: [
                    {
                        name: this.lang.prompt.common.license.choices.apache2,
                        value: "Apache-2.0",
                    },
                    {
                        name: this.lang.prompt.common.license.choices.mit,
                        value: "MIT",
                    },
                    {
                        name: this.lang.prompt.common.license.choices.proprietary,
                        value: "NONE",
                    }
                ],
                default: this.answers.license || "NONE",
            },
            // library settnigs (ICompileConfigration)
            {
                type: "list",
                name: "webpackTarget",
                message: this.lang.prompt.library.webpackTarget.message,
                choices: [
                    {
                        name: this.lang.prompt.common.webpackTarget.choices.browser,
                        value: "web",
                    },
                    {
                        name: this.lang.prompt.common.webpackTarget.choices.node,
                        value: "node",
                    },
                    new inquirer.Separator(),
                    {
                        name: this.lang.prompt.common.webpackTarget.choices.electron + this.LIMITATION(),
                        value: "electron",
                    },
                    {
                        name: this.lang.prompt.common.webpackTarget.choices.electronRenderer + this.LIMITATION(),
                        value: "electron-renderer",
                    }
                ],
                filter: (value) => {
                    if (libConfig.ELECTRON_AVAILABLE) {
                        return value;
                    } else if ("electron" === value) {
                        return "node";
                    } else if ("electron-renderer" === value) {
                        return "web";
                    } else {
                        return value;
                    }
                },
                default: this.answers.webpackTarget || "web",
            },
            // base structure
            {
                type: "list",
                name: "baseStructure",
                message: this.lang.prompt.common.baseStructure.message,
                choices: [
                    {
                        name: this.lang.prompt.common.baseStructure.choices.recommended,
                        value: "recommended",
                    },
                    {
                        name: this.lang.prompt.common.baseStructure.choices.custom,
                        value: "custom",
                    },
                ],
                default: this.answers.baseStructure || "recommended",
            },
            // library settnigs (custom: moduleSystem)
            {
                type: "list",
                name: "moduleSystem",
                message: this.lang.prompt.common.moduleSystem.message,
                choices: [
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.none,
                        value: "none",
                    },
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.commonjs,
                        value: "commonjs",
                    },
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.umd,
                        value: "umd",
                    },
                ],
                default: ("amd" !== this.answers.moduleSystem) ? (this.answers.moduleSystem || "commonjs") : "commonjs",
                when: (answers: IAnswerSchema) => {
                    return "custom" === answers.baseStructure && /^(node|electron)$/i.test(answers.webpackTarget);
                },
            },
            {
                type: "list",
                name: "moduleSystem",
                message: this.lang.prompt.common.moduleSystem.message,
                choices: [
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.none,
                        value: "none",
                    },
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.amd,
                        value: "amd",
                    },
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.umd,
                        value: "umd",
                    },
                ],
                default: ("commonjs" !== this.answers.moduleSystem) ? (this.answers.moduleSystem || "amd") : "amd",
                when: (answers: IAnswerSchema) => {
                    return "custom" === answers.baseStructure && "web" === answers.webpackTarget;
                },
            },
            {
                type: "list",
                name: "moduleSystem",
                message: this.lang.prompt.common.moduleSystem.message,
                choices: [
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.none,
                        value: "none",
                    },
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.commonjs,
                        value: "commonjs",
                    },
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.amd,
                        value: "amd",
                    },
                    {
                        name: this.lang.prompt.common.moduleSystem.choices.umd,
                        value: "umd",
                    },
                ],
                default: this.answers.moduleSystem || "commonjs",
                when: (answers: IAnswerSchema) => {
                    return "custom" === answers.baseStructure && "electron-renderer" === answers.webpackTarget;
                },
            },
            // library settnigs (custom: tsTranspileTarget)
            {
                type: "list",
                name: "tsTranspileTarget",
                message: this.lang.prompt.common.tsTranspileTarget.message,
                choices: [
                    {
                        name: this.lang.prompt.common.tsTranspileTarget.choices.es5,
                        value: "es5",
                    },
                    {
                        name: this.lang.prompt.common.tsTranspileTarget.choices.es2015,
                        value: "es2015",
                    },
                ],
                default: this.answers.tsTranspileTarget || ("web" === this.answers.webpackTarget ? "es5" : "es2015"),
                when: (answers: IAnswerSchema) => {
                    return "custom" === answers.baseStructure;
                },
            },
            // library settnigs (custom: supportCSS)
            {
                type: "confirm",
                name: "supportCSS",
                message: this.lang.prompt.library.supportCSS.message,
                default: this.answers.supportCSS || false,
                when: (answers: IAnswerSchema) => {
                    return "custom" === answers.baseStructure;
                },
            },
        ];
    }

    /**
     * プロジェクト設定の確認
     *
     * @param  {IAnswerSchema} answers 回答結果
     * @return {IProjectConfigration} 設定値を返却
     */
    displaySettingsByAnswers(answers: IAnswerSchema): IProjectConfigration {
        const config: ILibraryConfigration = (() => {
            switch (answers.webpackTarget) {
                case "web":
                    return $.extend({}, libConfig.browser, answers);
                case "node":
                    return $.extend({}, libConfig.node, answers);
                case "electron":
                    return $.extend({}, libConfig.electron, answers);
                case "electron-renderer":
                    return $.extend({}, libConfig.electron, answers);
                default:
                    console.error(chalk.red("unsupported target: " + answers.webpackTarget));
                    process.exit(1);
            }
        })();

        const items = [
            { name: "baseStructure",        recommend: false    },
            { name: "projectName",          recommend: false    },
            { name: "version",              recommend: false    },
            { name: "license",              recommend: false    },
            { name: "webpackTarget",        recommend: false    },
            { name: "moduleSystem",         recommend: true     },
            { name: "tsTranspileTarget",    recommend: true     },
            { name: "supportCSS",           recommend: true     },
        ];

        try {
            items.forEach((item) => {
                const color = (item.recommend && "recommended" === answers.baseStructure) ? "yellow" : undefined;
                console.log(this.config2description(config, item.name, color));
            });
        } catch (error) {
            console.error(chalk.red("error: " + JSON.stringify(error, null, 4)));
            process.exit(1);
        }

        return config;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods:

    /**
     * electron が有効出ない場合の補足文字を取得
     */
    private LIMITATION(): string {
        return libConfig.ELECTRON_AVAILABLE ? "" : " " + this.lang.prompt.common.stilNotAvailable;
    }
}

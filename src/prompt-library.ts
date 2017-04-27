/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import * as inquirer from "inquirer";
import * as chalk from "chalk";
import * as semverRegex from "semver-regex";
import {
    IProjectConfigration,
    ILibraryConfigration,
} from "cdp-lib";
import {
    PromptBase,
    ICommandLineInfo,
} from "./prompt-base";

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
        // TODO:
        return [
            // project common settnigs (IProjectConfigration)
            {
                type: "input",
                name: "projectName",
                message: this.lang.common.projectName.message,
                default: this.answers.projectName || "CoolProjectName",
            },
            {
                type: "input",
                name: "version",
                message: this.lang.common.version.message,
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
                        return this.lang.common.version.invalidMessage;
                    }
                },
            },
            {
                type: "list",
                name: "license",
                message: this.lang.common.license.message,
                choices: [
                    {
                        name: this.lang.common.license.choices.apache2,
                        value: "Apache-2.0",
                    },
                    {
                        name: this.lang.common.license.choices.mit,
                        value: "MIT",
                    },
                    {
                        name: this.lang.common.license.choices.proprietary,
                        value: "NONE",
                    }
                ],
                default: "NONE",
            },
            // library settnigs (ICompileConfigration)
            {
                type: "list",
                name: "webpackTarget",
                message: this.lang.library.webpackTarget.message,
                choices: [
                    {
                        name: this.lang.common.webpackTarget.choices.node,
                        value: "node",
                    },
                    new inquirer.Separator(),
                    {
                        name: this.lang.common.webpackTarget.choices.web,
                        value: "web",
                    },
                    {
                        name: this.lang.common.webpackTarget.choices.electron,
                        value: "electron",
                    },
                    {
                        name: this.lang.common.webpackTarget.choices.electronRenderer,
                        value: "electron-renderer",
                    }
                ],
                filter: (value) => {
                    if ("node" !== value) {
                        return "node";
                    } else {
                        return value;
                    }
                },
                default: "node",
            },
            // TODO: when を使って moduleSystem
        ];
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

    ///////////////////////////////////////////////////////////////////////
    // private methods
}

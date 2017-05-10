﻿/*!
 * cdp-cli.js 0.0.2
 *
 * Date: 2017-05-10T07:40:43.630Z
 */

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/     // The module cache
/******/     var installedModules = {};
/******/
/******/     // The require function
/******/     function __webpack_require__(moduleId) {
/******/
/******/         // Check if module is in cache
/******/         if(installedModules[moduleId]) {
/******/             return installedModules[moduleId].exports;
/******/         }
/******/         // Create a new module (and put it into the cache)
/******/         var module = installedModules[moduleId] = {
/******/             i: moduleId,
/******/             l: false,
/******/             exports: {}
/******/         };
/******/
/******/         // Execute the module function
/******/         modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/         // Flag the module as loaded
/******/         module.l = true;
/******/
/******/         // Return the exports of the module
/******/         return module.exports;
/******/     }
/******/
/******/
/******/     // expose the modules object (__webpack_modules__)
/******/     __webpack_require__.m = modules;
/******/
/******/     // expose the module cache
/******/     __webpack_require__.c = installedModules;
/******/
/******/     // identity function for calling harmony imports with the correct context
/******/     __webpack_require__.i = function(value) { return value; };
/******/
/******/     // define getter function for harmony exports
/******/     __webpack_require__.d = function(exports, name, getter) {
/******/         if(!__webpack_require__.o(exports, name)) {
/******/             Object.defineProperty(exports, name, {
/******/                 configurable: false,
/******/                 enumerable: true,
/******/                 get: getter
/******/             });
/******/         }
/******/     };
/******/
/******/     // getDefaultExport function for compatibility with non-harmony modules
/******/     __webpack_require__.n = function(module) {
/******/         var getter = module && module.__esModule ?
/******/             function getDefault() { return module['default']; } :
/******/             function getModuleExports() { return module; };
/******/         __webpack_require__.d(getter, 'a', getter);
/******/         return getter;
/******/     };
/******/
/******/     // Object.prototype.hasOwnProperty.call
/******/     __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/     // __webpack_public_path__
/******/     __webpack_require__.p = "";
/******/
/******/     // Load entry module and return exports
/******/     return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("cdp-lib");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(2);
const inquirer = __webpack_require__(3);
const cdp_lib_1 = __webpack_require__(0);
const fs = cdp_lib_1.Utils.fs;
const chalk = cdp_lib_1.Utils.chalk;
const _ = cdp_lib_1.Utils._;
//___________________________________________________________________________________________________________________//
/**
 * @class PromptBase
 * @brief Prompt のベースクラス
 */
class PromptBase {
    constructor() {
        this._answers = {};
        this._locale = {};
    }
    ///////////////////////////////////////////////////////////////////////
    // public methods
    /**
     * エントリ
     */
    prompting(cmdInfo) {
        this._cmdInfo = cmdInfo;
        return new Promise((resolve, reject) => {
            this.showPrologue();
            this.inquireLanguage()
                .then(() => {
                return this.inquire();
            })
                .then((settings) => {
                resolve(settings);
            })
                .catch((reason) => {
                reject(reason);
            });
        });
    }
    /**
     * Like cowsay
     * https://en.wikipedia.org/wiki/Cowsay
     */
    say(message) {
        const GREETING = "\n  ≡     " + chalk.cyan("∧＿∧") + "    ／￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣" +
            "\n    ≡ " + chalk.cyan("（ ´∀｀）") + "＜  " + chalk.yellow(message) +
            "\n  ≡   " + chalk.cyan("（  つ") + "＝" + chalk.cyan("つ") + "  ＼＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿" +
            "\n    ≡  " + chalk.cyan("｜ ｜ |") + "＼" +
            "\n    ≡ " + chalk.cyan("（_＿）＿）") + "＼" +
            "\n  ≡   " + chalk.red("◎") + "￣￣￣￣" + chalk.red("◎");
        console.log(GREETING);
    }
    ///////////////////////////////////////////////////////////////////////
    // protected methods
    /**
     * ローカライズリソースにアクセス
     * ex) this.lang.prompt.projectName.message
     *
     * @return {Object} リソースオブジェクト
     */
    get lang() {
        return this._locale;
    }
    /**
     * 設定値にアクセス
     *
     * @return {Object} Answer オブジェクト
     */
    get answers() {
        return this._answers;
    }
    /**
     * Prologue コメントの設定
     */
    get prologueComment() {
        return "Welcome to CDP Boilerplate Generator!";
    }
    /**
     * Welcome 表示
     */
    showPrologue() {
        console.log("\n" + chalk.gray("================================================================"));
        this.say(this.prologueComment);
        console.log("\n" + chalk.gray("================================================================") + "\n");
    }
    /**
     * Answer オブジェクト の更新
     *
     * @return {Object} Answer オブジェクト
     */
    updateAnswers(update) {
        return _.merge(this._answers, update);
    }
    /**
     * プロジェクト設定
     * 分岐が必要な場合はオーバーライドすること
     */
    inquireSettings() {
        return new Promise((resolve, reject) => {
            inquirer.prompt(this.questions)
                .then((answers) => {
                resolve(answers);
            })
                .catch((reason) => {
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
    config2description(config, itemName, color = "cyan") {
        const item = this.lang.settings[itemName];
        if (null == item) {
            console.error(chalk.red("error. item not found. item name: " + itemName));
            process.exit(1);
        }
        const prop = (() => {
            if (item.props) {
                return item.props[config[itemName]];
            }
            else if ("boolean" === typeof config[itemName]) {
                return item.bool[config[itemName] ? "yes" : "no"];
            }
            else {
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
    loadLanguage(locale) {
        this._locale = JSON.parse(fs.readFileSync(path.join(this._cmdInfo.pkgDir, "res/locales/messages." + locale + ".json"), "utf8").toString());
    }
    /**
     * 言語選択
     */
    inquireLanguage() {
        return new Promise((resolve, reject) => {
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
                .catch((reason) => {
                reject(reason);
            });
        });
    }
    /**
     * 設定確認
     */
    confirmSettings() {
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
                }
                else {
                    reject();
                }
            })
                .catch((reason) => {
                reject(reason);
            });
        });
    }
    /**
     * 設定
     */
    inquire() {
        return new Promise((resolve, reject) => {
            const proc = () => {
                this.inquireSettings()
                    .then((answers) => {
                    this.updateAnswers(answers);
                    this.confirmSettings()
                        .then((settings) => {
                        settings.logOptions = {
                            force: this._cmdInfo.cliOptions.force,
                            verbose: this._cmdInfo.cliOptions.verbose,
                            silent: this._cmdInfo.cliOptions.silent,
                        };
                        resolve(settings);
                    })
                        .catch(() => {
                        setTimeout(proc);
                    });
                })
                    .catch((reason) => {
                    reject(reason);
                });
            };
            setTimeout(proc);
        });
    }
}
exports.PromptBase = PromptBase;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("inquirer");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const command_parser_1 = __webpack_require__(5);
const prompt_library_1 = __webpack_require__(8);
const prompt_mobile_1 = __webpack_require__(9);
const prompt_desktop_1 = __webpack_require__(7);
const prompt_web_1 = __webpack_require__(10);
const chalk = cdp_lib_1.Utils.chalk;
function getInquirer(cmdInfo) {
    switch (cmdInfo.action) {
        case "create":
            break;
        default:
            console.error(chalk.red(cmdInfo.action + " command: under construction."));
            process.exit(1);
    }
    switch (cmdInfo.target) {
        case "library":
            return new prompt_library_1.PromptLibrary();
        case "mobile":
            return new prompt_mobile_1.PromptMobileApp();
        case "desktop":
            return new prompt_desktop_1.PromptDesktopApp();
        case "web":
            return new prompt_web_1.PromptWebApp();
        default:
            console.error(chalk.red("unsupported target: " + cmdInfo.target));
            process.exit(1);
    }
}
function main() {
    process.title = "cdp";
    const cmdInfo = command_parser_1.CommandParser.parse(process.argv);
    const inquirer = getInquirer(cmdInfo);
    inquirer.prompting(cmdInfo)
        .then((config) => {
        // execute
        cdp_lib_1.default.execute(config);
    })
        .catch((reason) => {
        if ("string" !== typeof reason) {
            reason = JSON.stringify(reason);
        }
        console.error(chalk.red(reason));
    })
        .then(() => {
        // NOTE: es6 promise's always block.
    });
}
exports.main = main;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(2);
const commander = __webpack_require__(11);
const cdp_lib_1 = __webpack_require__(0);
const fs = cdp_lib_1.Utils.fs;
const chalk = cdp_lib_1.Utils.chalk;
//___________________________________________________________________________________________________________________//
/**
 * @class CommandParser
 * @brief コマンドラインパーサー
 */
class CommandParser {
    ///////////////////////////////////////////////////////////////////////
    // public static methods
    /**
     * コマンドラインのパース
     *
     * @param  {String} argv       引数を指定
     * @param  {Object} [options]  オプションを指定
     * @returns {ICommandLineInfo}
     */
    static parse(argv, options) {
        const cmdline = {
            pkgDir: this.getPackageDirectory(argv),
        };
        const pkg = JSON.parse(fs.readFileSync(path.join(cmdline.pkgDir, "package.json"), "utf8").toString());
        commander
            .version(pkg.version)
            .option("-f, --force", "Continue execution even if in error situation")
            .option("-t, --targetdir <path>", "Specify project target directory")
            .option("-c, --config <path>", "Specify config file path")
            .option("-v, --verbose", "Show debug messages.")
            .option("-s, --silent", "Run as silent mode.");
        commander
            .command("init")
            .description("init project")
            .action(() => {
            cmdline.action = "init";
        })
            .on("--help", () => {
            console.log(chalk.green("  Examples:"));
            console.log("");
            console.log(chalk.green("    $ cdp init"));
            console.log("");
        });
        commander
            .command("create <target>")
            .description("create boilerplate for 'library, module' | 'mobile, app' | 'desktop' | 'web'")
            .action((target) => {
            if (/^(module|app|library|mobile|desktop|web)$/i.test(target)) {
                cmdline.action = "create";
                cmdline.target = target;
                if ("module" === cmdline.target) {
                    cmdline.target = "library";
                }
                else if ("app" === cmdline.target) {
                    cmdline.target = "mobile";
                }
            }
            else {
                console.log(chalk.red.underline("  unsupported target: " + target));
                this.showHelp();
            }
        })
            .on("--help", () => {
            console.log(chalk.green("  Examples:"));
            console.log("");
            console.log(chalk.green("    $ cdp create library"));
            console.log(chalk.green("    $ cdp create mobile"));
            console.log(chalk.green("    $ cdp create app -c setting.json"));
            console.log("");
        });
        commander
            .command("*", null, { noHelp: true })
            .action((cmd) => {
            console.log(chalk.red.underline("  unsupported command: " + cmd));
            this.showHelp();
        });
        commander.parse(argv);
        if (argv.length <= 2) {
            this.showHelp();
        }
        cmdline.cliOptions = this.toCommandLineOptions(commander);
        return cmdline;
    }
    ///////////////////////////////////////////////////////////////////////
    // private static methods
    /**
     * CLI のインストールディレクトリを取得
     *
     * @param  {String[]} argv 引数
     * @return {String} インストールディレクトリ
     */
    static getPackageDirectory(argv) {
        const execDir = path.dirname(argv[1]);
        return path.join(execDir, "..");
    }
    /**
     * CLI option を ICommandLineOptions に変換
     *
     * @param  {Object} commander parse 済み comannder インスタンス
     * @return {ICommandLineOptions} option オブジェクト
     */
    static toCommandLineOptions(commander) {
        return {
            force: !!commander.force,
            targetdir: commander.targetdir,
            config: commander.config,
            verbose: !!commander.verbose,
            silent: !!commander.silent,
        };
    }
    /**
     * ヘルプ表示して終了
     */
    static showHelp() {
        const inform = (text) => {
            return chalk.green(text);
        };
        commander.outputHelp(inform);
        process.exit(1);
    }
}
exports.CommandParser = CommandParser;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ブラウザ環境で動作するライブラリの既定値
 */
const libraryOnBrowser = {
    // ICompileConfigration
    tsTranspileTarget: "es5",
    moduleSystem: "umd",
    webpackTarget: "web",
    supportCSS: false,
};
/**
 * Node.js 環境で動作するライブラリの既定値
 */
const libraryOnNode = {
    // ICompileConfigration
    tsTranspileTarget: "es2015",
    moduleSystem: "commonjs",
    webpackTarget: "node",
    supportCSS: false,
};
/**
 * electron 環境で動作するライブラリの既定値
 */
const libraryOnElectron = {
    // ICompileConfigration
    tsTranspileTarget: "es2015",
    moduleSystem: "commonjs",
    webpackTarget: "electron",
    supportCSS: false,
};
/**
 * ブラウザ(cordova)環境で動作するモバイルアプリケーションの既定値
 */
const mobileOnBrowser = {
    // ICompileConfigration
    tsTranspileTarget: "es5",
    moduleSystem: "amd",
    webpackTarget: "web",
    supportCSS: true,
};
/**
 * ブラウザ環境で動作するデスクトップアプリケーションの既定値
 */
const desktopOnBrowser = {
    // ICompileConfigration
    tsTranspileTarget: "es5",
    moduleSystem: "amd",
    webpackTarget: "web",
    supportCSS: true,
};
/**
 *  electron 環境で動作するデスクトップアプリケーションの既定値
 */
const desktopOnElectron = {
    // ICompileConfigration
    tsTranspileTarget: "es2015",
    moduleSystem: "commonjs",
    webpackTarget: "electron-renderer",
    supportCSS: true,
};
/**
 * ブラウザ環境で動作するウェブアプリケーションの既定値
 */
const webOnBrowser = {
    // ICompileConfigration
    tsTranspileTarget: "es5",
    moduleSystem: "amd",
    webpackTarget: "web",
    supportCSS: true,
};
//___________________________________________________________________________________________________________________//
exports.default = {
    library: {
        browser: libraryOnBrowser,
        node: libraryOnNode,
        electron: libraryOnElectron,
        ELECTRON_AVAILABLE: false,
    },
    mobile: {
        browser: mobileOnBrowser,
    },
    desctop: {
        browser: desktopOnBrowser,
        electron: desktopOnElectron,
    },
    web: {
        browser: webOnBrowser,
    },
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(1);
const chalk = cdp_lib_1.Utils.chalk;
/**
 * @class PromptDesktopApp
 * @brief デスクトップアプリ用 Inquire クラス
 */
class PromptDesktopApp extends prompt_base_1.PromptBase {
    ///////////////////////////////////////////////////////////////////////
    // public methods
    /**
     * エントリ
     */
    prompting(cmdInfo) {
        return new Promise((resolve, reject) => {
            reject("desktop app prompting, under construction.");
        });
    }
    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods
    /**
     * プロジェクト設定項目の取得
     */
    get questions() {
        // TODO:
        return [];
    }
    /**
     * プロジェクト設定の確認
     *
     * @param  {IAnswerSchema} answers 回答結果
     * @return {IProjectConfigration} 設定値を返却
     */
    displaySettingsByAnswers(answers) {
        // TODO: show
        return null;
    }
}
exports.PromptDesktopApp = PromptDesktopApp;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __webpack_require__(3);
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(1);
const default_config_1 = __webpack_require__(6);
const $ = cdp_lib_1.Utils.$;
const chalk = cdp_lib_1.Utils.chalk;
const semverRegex = cdp_lib_1.Utils.semverRegex;
const libConfig = default_config_1.default.library;
/**
 * @class PromptLibrary
 * @brief ライブラリモジュール用 Inquire クラス
 */
class PromptLibrary extends prompt_base_1.PromptBase {
    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods
    /**
     * プロジェクト設定項目の取得
     */
    get questions() {
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
                    }
                    else {
                        return value;
                    }
                },
                validate: (value) => {
                    if (semverRegex().test(value)) {
                        return true;
                    }
                    else {
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
                    }
                    else if ("electron" === value) {
                        return "node";
                    }
                    else if ("electron-renderer" === value) {
                        return "web";
                    }
                    else {
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
                when: (answers) => {
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
                when: (answers) => {
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
                when: (answers) => {
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
                when: (answers) => {
                    return "custom" === answers.baseStructure;
                },
            },
            // library settnigs (custom: supportCSS)
            {
                type: "confirm",
                name: "supportCSS",
                message: this.lang.prompt.library.supportCSS.message,
                default: this.answers.supportCSS || false,
                when: (answers) => {
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
    displaySettingsByAnswers(answers) {
        const config = (() => {
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
            { name: "baseStructure", recommend: false },
            { name: "projectName", recommend: false },
            { name: "version", recommend: false },
            { name: "license", recommend: false },
            { name: "webpackTarget", recommend: false },
            { name: "moduleSystem", recommend: true },
            { name: "tsTranspileTarget", recommend: true },
            { name: "supportCSS", recommend: true },
        ];
        try {
            items.forEach((item) => {
                const color = (item.recommend && "recommended" === answers.baseStructure) ? "yellow" : undefined;
                console.log(this.config2description(config, item.name, color));
            });
        }
        catch (error) {
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
    LIMITATION() {
        return libConfig.ELECTRON_AVAILABLE ? "" : " " + this.lang.prompt.common.stilNotAvailable;
    }
}
exports.PromptLibrary = PromptLibrary;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(1);
const chalk = cdp_lib_1.Utils.chalk;
/**
 * @class PromptMobileApp
 * @brief モバイルアプリ用 Inquire クラス
 */
class PromptMobileApp extends prompt_base_1.PromptBase {
    ///////////////////////////////////////////////////////////////////////
    // public methods
    /**
     * エントリ
     */
    prompting(cmdInfo) {
        return new Promise((resolve, reject) => {
            reject("mobile app prompting, under construction.");
        });
    }
    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods
    /**
     * プロジェクト設定項目の取得
     */
    get questions() {
        // TODO:
        return [];
    }
    /**
     * プロジェクト設定の確認
     *
     * @param  {IAnswerSchema} answers 回答結果
     * @return {IProjectConfigration} 設定値を返却
     */
    displaySettingsByAnswers(answers) {
        // TODO: show
        return null;
    }
}
exports.PromptMobileApp = PromptMobileApp;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(1);
const chalk = cdp_lib_1.Utils.chalk;
/**
 * @class PromptWebApp
 * @brief ウェブアプリ用 Inquire クラス
 */
class PromptWebApp extends prompt_base_1.PromptBase {
    ///////////////////////////////////////////////////////////////////////
    // public methods
    /**
     * エントリ
     */
    prompting(cmdInfo) {
        return new Promise((resolve, reject) => {
            reject("web app prompting, under construction.");
        });
    }
    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods
    /**
     * プロジェクト設定項目の取得
     */
    get questions() {
        // TODO:
        return [];
    }
    /**
     * プロジェクト設定の確認
     *
     * @param  {IAnswerSchema} answers 回答結果
     * @return {IProjectConfigration} 設定値を返却
     */
    displaySettingsByAnswers(answers) {
        // TODO: show
        return null;
    }
}
exports.PromptWebApp = PromptWebApp;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmYwYzg0N2Y1NWQ0ZTZiMTc5ZWIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9IiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWJhc2UudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifSIsImNkcDovLy9jZHAtY2xpL2NkcC1jbGkudHMiLCJjZHA6Ly8vY2RwLWNsaS9jb21tYW5kLXBhcnNlci50cyIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWRlc2t0b3AudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtbGlicmFyeS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1tb2JpbGUudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtd2ViLnRzIiwid2VicGFjazovLy9leHRlcm5hbC8ge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlD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ZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMmYwYzg0N2Y1NWQ0ZTZiMTc5ZWIiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjZHAtbGliXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn1cbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSUNvbXBpbGVDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQgeyBJQ29tbWFuZExpbmVJbmZvIH0gZnJvbSBcIi4vY29tbWFuZC1wYXJzZXJcIjtcclxuXHJcbmNvbnN0IGZzICAgID0gVXRpbHMuZnM7XHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcbmNvbnN0IF8gICAgID0gVXRpbHMuXztcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElBbnN3ZXJTY2hlbWFcclxuICogQGJyaWVmIEFuc3dlciDjgqrjg5bjgrjjgqfjgq/jg4jjga7jgrnjgq3jg7zjg57lrprnvqnjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFuc3dlclNjaGVtYVxyXG4gICAgZXh0ZW5kcyBpbnF1aXJlci5BbnN3ZXJzLCBJUHJvamVjdENvbmZpZ3JhdGlvbiwgSUNvbXBpbGVDb25maWdyYXRpb24ge1xyXG4gICAgLy8g5YWx6YCa5ouh5by15a6a576pXHJcbiAgICBiYXNlU3RydWN0dXJlOiBcInJlY29tbWVuZGVkXCIgfCBcImN1c3RvbVwiO1xyXG59XHJcblxyXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRCYXNlXHJcbiAqIEBicmllZiBQcm9tcHQg44Gu44OZ44O844K544Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbztcclxuICAgIHByaXZhdGUgX2Fuc3dlcnMgPSA8SUFuc3dlclNjaGVtYT57fTtcclxuICAgIHByaXZhdGUgX2xvY2FsZSA9IHt9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbyk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICB0aGlzLl9jbWRJbmZvID0gY21kSW5mbztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQcm9sb2d1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmlucXVpcmVMYW5ndWFnZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5xdWlyZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChzZXR0aW5nczogSVByb2plY3RDb25maWdyYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpa2UgY293c2F5XHJcbiAgICAgKiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db3dzYXlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNheShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBHUkVFVElORyA9XHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICAgIFwiICsgY2hhbGsuY3lhbihcIuKIp++8v+KIp1wiKSArIFwiICAgIO+8j++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iCDCtOKIgO+9gO+8iVwiKSArIFwi77ycICBcIiArIGNoYWxrLnllbGxvdyhtZXNzYWdlKSArXHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICBcIiArIGNoYWxrLmN5YW4oXCLvvIggIOOBpFwiKSArIFwi77ydXCIgKyBjaGFsay5jeWFuKFwi44GkXCIpICsgXCIgIO+8vO+8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhICBcIiArIGNoYWxrLmN5YW4oXCLvvZwg772cIHxcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iF/vvL/vvInvvL/vvIlcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gIOKJoSAgIFwiICsgY2hhbGsucmVkKFwi4peOXCIpICsgXCLvv6Pvv6Pvv6Pvv6NcIiArIGNoYWxrLnJlZChcIuKXjlwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhHUkVFVElORyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBhYnN0cmFjdCBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucztcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGFic3RyYWN0IGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb247XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByb3RlY3RlZCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg63jg7zjgqvjg6njgqTjgrrjg6rjgr3jg7zjgrnjgavjgqLjgq/jgrvjgrlcclxuICAgICAqIGV4KSB0aGlzLmxhbmcucHJvbXB0LnByb2plY3ROYW1lLm1lc3NhZ2VcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOODquOCveODvOOCueOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGxhbmcoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6a5YCk44Gr44Ki44Kv44K744K5XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBnZXQgYW5zd2VycygpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYW5zd2VycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb2xvZ3VlIOOCs+ODoeODs+ODiOOBruioreWumlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHByb2xvZ3VlQ29tbWVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIldlbGNvbWUgdG8gQ0RQIEJvaWxlcnBsYXRlIEdlbmVyYXRvciFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlbGNvbWUg6KGo56S6XHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzaG93UHJvbG9ndWUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpKTtcclxuICAgICAgICB0aGlzLnNheSh0aGlzLnByb2xvZ3VlQ29tbWVudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIIOOBruabtOaWsFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlQW5zd2Vycyh1cGRhdGU6IElBbnN3ZXJTY2hlbWEpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gXy5tZXJnZSh0aGlzLl9hbnN3ZXJzLCB1cGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6aXHJcbiAgICAgKiDliIblspDjgYzlv4XopoHjgarloLTlkIjjga/jgqrjg7zjg5Djg7zjg6njgqTjg4njgZnjgovjgZPjgahcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGlucXVpcmVTZXR0aW5ncygpOiBQcm9taXNlPElBbnN3ZXJTY2hlbWE+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQodGhpcy5xdWVzdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXR0aW5nIOOBi+OCiSDoqK3lrproqqzmmI7jga7kvZzmiJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZyDoqK3lrppcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaXRlbU5hbWUg6Kit5a6a6aCF55uu5ZCNXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOiqrOaYjuaWh1xyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29uZmlnMmRlc2NyaXB0aW9uKGNvbmZpZzogT2JqZWN0LCBpdGVtTmFtZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nID0gXCJjeWFuXCIpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmxhbmcuc2V0dGluZ3NbaXRlbU5hbWVdO1xyXG4gICAgICAgIGlmIChudWxsID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvci4gaXRlbSBub3QgZm91bmQuIGl0ZW0gbmFtZTogXCIgKyBpdGVtTmFtZSkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwcm9wOiBzdHJpbmcgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9wcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucHJvcHNbY29uZmlnW2l0ZW1OYW1lXV07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJib29sZWFuXCIgPT09IHR5cGVvZiBjb25maWdbaXRlbU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5ib29sW2NvbmZpZ1tpdGVtTmFtZV0gPyBcInllc1wiIDogXCJub1wiXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWdbaXRlbU5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgKyBjaGFsa1tjb2xvcl0ocHJvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844Kr44Op44Kk44K644Oq44K944O844K544Gu44Ot44O844OJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZExhbmd1YWdlKGxvY2FsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoXHJcbiAgICAgICAgICAgIHBhdGguam9pbih0aGlzLl9jbWRJbmZvLnBrZ0RpciwgXCJyZXMvbG9jYWxlcy9tZXNzYWdlcy5cIiArIGxvY2FsZSArIFwiLmpzb25cIiksIFwidXRmOFwiKS50b1N0cmluZygpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiogOiqnumBuOaKnlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlucXVpcmVMYW5ndWFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbiA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImxhbmd1YWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQbGVhc2UgY2hvb3NlIHlvdXIgcHJlZmVycmVkIGxhbmd1YWdlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJFbmdsaXNoL+iLseiqnlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZW4tVVNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJKYXBhbmVzZS/ml6XmnKzoqp5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImphLUpQXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGlucXVpcmVyLnByb21wdChxdWVzdGlvbilcclxuICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRMYW5ndWFnZShhbnN3ZXIubGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOioreWumueiuuiqjVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNvbmZpcm1TZXR0aW5ncygpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5kaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnModGhpcy5fYW5zd2Vycyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrOiBcIiArIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmNvbmZpcm0ubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY29uZmlybVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiY29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uY29uZmlybS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGlucXVpcmVyLnByb21wdChxdWVzdGlvbilcclxuICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5zd2VyLmNvbmZpcm1hdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqK3lrppcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlKCk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnF1aXJlU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXJzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQW5zd2VycyhhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHNldHRpbmdzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MubG9nT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy5mb3JjZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyYm9zZTogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnZlcmJvc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbGVudDogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnNpbGVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1iYXNlLnRzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpbnF1aXJlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiaW5xdWlyZXJcIixcImNvbW1vbmpzMlwiOlwiaW5xdWlyZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtcclxuICAgIGRlZmF1bHQgYXMgQ0RQTGliLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIENvbW1hbmRQYXJzZXIsXHJcbiAgICBJQ29tbWFuZExpbmVJbmZvLFxyXG59IGZyb20gXCIuL2NvbW1hbmQtcGFyc2VyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRMaWJyYXJ5LFxyXG59IGZyb20gXCIuL3Byb21wdC1saWJyYXJ5XCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRNb2JpbGVBcHAsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LW1vYmlsZVwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0RGVza3RvcEFwcCxcclxufSBmcm9tIFwiLi9wcm9tcHQtZGVza3RvcFwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0V2ViQXBwLFxyXG59IGZyb20gXCIuL3Byb21wdC13ZWJcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG5mdW5jdGlvbiBnZXRJbnF1aXJlcihjbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvKTogUHJvbXB0QmFzZSB7XHJcbiAgICBzd2l0Y2ggKGNtZEluZm8uYWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChjbWRJbmZvLmFjdGlvbiArIFwiIGNvbW1hbmQ6IHVuZGVyIGNvbnN0cnVjdGlvbi5cIikpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChjbWRJbmZvLnRhcmdldCkge1xyXG4gICAgICAgIGNhc2UgXCJsaWJyYXJ5XCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0TGlicmFyeSgpO1xyXG4gICAgICAgIGNhc2UgXCJtb2JpbGVcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRNb2JpbGVBcHAoKTtcclxuICAgICAgICBjYXNlIFwiZGVza3RvcFwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdERlc2t0b3BBcHAoKTtcclxuICAgICAgICBjYXNlIFwid2ViXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0V2ViQXBwKCk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJ1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgY21kSW5mby50YXJnZXQpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIHByb2Nlc3MudGl0bGUgPSBcImNkcFwiO1xyXG4gICAgY29uc3QgY21kSW5mbyA9IENvbW1hbmRQYXJzZXIucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuICAgIGNvbnN0IGlucXVpcmVyID0gZ2V0SW5xdWlyZXIoY21kSW5mbyk7XHJcblxyXG4gICAgaW5xdWlyZXIucHJvbXB0aW5nKGNtZEluZm8pXHJcbiAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAvLyBleGVjdXRlXHJcbiAgICAgICAgICAgIENEUExpYi5leGVjdXRlKGNvbmZpZyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChcInN0cmluZ1wiICE9PSB0eXBlb2YgcmVhc29uKSB7XHJcbiAgICAgICAgICAgICAgICByZWFzb24gPSBKU09OLnN0cmluZ2lmeShyZWFzb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKHJlYXNvbikpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBOT1RFOiBlczYgcHJvbWlzZSdzIGFsd2F5cyBibG9jay5cclxuICAgICAgICB9KTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NkcC1jbGkudHMiLCJpbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCAqIGFzIGNvbW1hbmRlciBmcm9tIFwiY29tbWFuZGVyXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcImNkcC1saWJcIjtcclxuXHJcbmNvbnN0IGZzICAgID0gVXRpbHMuZnM7XHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJQ29tbWFuZExpbmVPcHRpb25zXHJcbiAqIEBicmllZiAgICAg44Kz44Oe44Oz44OJ44Op44Kk44Oz55So44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElDb21tYW5kTGluZU9wdGlvbnMge1xyXG4gICAgZm9yY2U6IGJvb2xlYW47ICAgICAvLyDjgqjjg6njg7zntpnntprnlKhcclxuICAgIHRhcmdldGRpcjogc3RyaW5nOyAgLy8g5L2c5qWt44OH44Kj44Os44Kv44OI44Oq5oyH5a6aXHJcbiAgICBjb25maWc6IHN0cmluZzsgICAgIC8vIOOCs+ODs+ODleOCo+OCsOODleOCoeOCpOODq+aMh+WumlxyXG4gICAgdmVyYm9zZTogYm9vbGVhbjsgICAvLyDoqbPntLDjg63jgrBcclxuICAgIHNpbGVudDogYm9vbGVhbjsgICAgLy8gc2lsZW50IG1vZGVcclxufVxyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lSW5mb1xyXG4gKiBAYnJpZWYgICAgIOOCs+ODnuODs+ODieODqeOCpOODs+aDheWgseagvOe0jeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgIHBrZ0Rpcjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIENMSSDjgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6pcclxuICAgIGFjdGlvbjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCouOCr+OCt+ODp+ODs+WumuaVsFxyXG4gICAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgICAgLy8g44Kz44Oe44Oz44OJ44K/44O844Ky44OD44OIXHJcbiAgICBpbnN0YWxsZWREaXI6IHN0cmluZzsgICAgICAgICAgICAgICAvLyBDTEkg44Kk44Oz44K544OI44O844OrXHJcbiAgICBjbGlPcHRpb25zOiBJQ29tbWFuZExpbmVPcHRpb25zOyAgICAvLyDjgrPjg57jg7Pjg4njg6njgqTjg7PjgafmuKHjgZXjgozjgZ/jgqrjg5fjgrfjg6fjg7NcclxufVxyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29tbWFuZFBhcnNlclxyXG4gKiBAYnJpZWYg44Kz44Oe44Oz44OJ44Op44Kk44Oz44OR44O844K144O8XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29tbWFuZFBhcnNlciB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gu44OR44O844K5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBhcmd2ICAgICAgIOW8leaVsOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBbb3B0aW9uc10gIOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMge0lDb21tYW5kTGluZUluZm99XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2UoYXJndjogc3RyaW5nW10sIG9wdGlvbnM/OiBhbnkpOiBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgICAgICBjb25zdCBjbWRsaW5lID0gPElDb21tYW5kTGluZUluZm8+e1xyXG4gICAgICAgICAgICBwa2dEaXI6IHRoaXMuZ2V0UGFja2FnZURpcmVjdG9yeShhcmd2KSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHBrZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihjbWRsaW5lLnBrZ0RpciwgXCJwYWNrYWdlLmpzb25cIiksIFwidXRmOFwiKS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC52ZXJzaW9uKHBrZy52ZXJzaW9uKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLWYsIC0tZm9yY2VcIiwgXCJDb250aW51ZSBleGVjdXRpb24gZXZlbiBpZiBpbiBlcnJvciBzaXR1YXRpb25cIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi10LCAtLXRhcmdldGRpciA8cGF0aD5cIiwgXCJTcGVjaWZ5IHByb2plY3QgdGFyZ2V0IGRpcmVjdG9yeVwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLWMsIC0tY29uZmlnIDxwYXRoPlwiLCBcIlNwZWNpZnkgY29uZmlnIGZpbGUgcGF0aFwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXYsIC0tdmVyYm9zZVwiLCBcIlNob3cgZGVidWcgbWVzc2FnZXMuXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItcywgLS1zaWxlbnRcIiwgXCJSdW4gYXMgc2lsZW50IG1vZGUuXCIpXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCJpbml0XCIpXHJcbiAgICAgICAgICAgIC5kZXNjcmlwdGlvbihcImluaXQgcHJvamVjdFwiKVxyXG4gICAgICAgICAgICAuYWN0aW9uKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNtZGxpbmUuYWN0aW9uID0gXCJpbml0XCI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIi0taGVscFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgRXhhbXBsZXM6XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgaW5pdFwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcImNyZWF0ZSA8dGFyZ2V0PlwiKVxyXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJjcmVhdGUgYm9pbGVycGxhdGUgZm9yICdsaWJyYXJ5LCBtb2R1bGUnIHwgJ21vYmlsZSwgYXBwJyB8ICdkZXNrdG9wJyB8ICd3ZWInXCIpXHJcbiAgICAgICAgICAgIC5hY3Rpb24oKHRhcmdldDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoL14obW9kdWxlfGFwcHxsaWJyYXJ5fG1vYmlsZXxkZXNrdG9wfHdlYikkL2kudGVzdCh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kbGluZS5hY3Rpb24gPSBcImNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcIm1vZHVsZVwiID09PSBjbWRsaW5lLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLnRhcmdldCA9IFwibGlicmFyeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJhcHBcIiA9PT0gY21kbGluZS50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSBcIm1vYmlsZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkLnVuZGVybGluZShcIiAgdW5zdXBwb3J0ZWQgdGFyZ2V0OiBcIiArIHRhcmdldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKFwiLS1oZWxwXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICBFeGFtcGxlczpcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgbGlicmFyeVwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgbW9iaWxlXCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBhcHAgLWMgc2V0dGluZy5qc29uXCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiKlwiLCBudWxsLCB7IG5vSGVscDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICAuYWN0aW9uKChjbWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZC51bmRlcmxpbmUoXCIgIHVuc3VwcG9ydGVkIGNvbW1hbmQ6IFwiICsgY21kKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXIucGFyc2UoYXJndik7XHJcblxyXG4gICAgICAgIGlmIChhcmd2Lmxlbmd0aCA8PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNtZGxpbmUuY2xpT3B0aW9ucyA9IHRoaXMudG9Db21tYW5kTGluZU9wdGlvbnMoY29tbWFuZGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNtZGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIENMSSDjga7jgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6rjgpLlj5blvpdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmdbXX0gYXJndiDlvJXmlbBcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ30g44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44OqXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFBhY2thZ2VEaXJlY3RvcnkoYXJndjogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGV4ZWNEaXIgPSBwYXRoLmRpcm5hbWUoYXJndlsxXSk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihleGVjRGlyLCBcIi4uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ0xJIG9wdGlvbiDjgpIgSUNvbW1hbmRMaW5lT3B0aW9ucyDjgavlpInmj5tcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbW1hbmRlciBwYXJzZSDmuIjjgb8gY29tYW5uZGVyIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICogQHJldHVybiB7SUNvbW1hbmRMaW5lT3B0aW9uc30gb3B0aW9uIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyB0b0NvbW1hbmRMaW5lT3B0aW9ucyhjb21tYW5kZXI6IGFueSk6IElDb21tYW5kTGluZU9wdGlvbnMge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZvcmNlOiAhIWNvbW1hbmRlci5mb3JjZSxcclxuICAgICAgICAgICAgdGFyZ2V0ZGlyOiBjb21tYW5kZXIudGFyZ2V0ZGlyLFxyXG4gICAgICAgICAgICBjb25maWc6IGNvbW1hbmRlci5jb25maWcsXHJcbiAgICAgICAgICAgIHZlcmJvc2U6ICEhY29tbWFuZGVyLnZlcmJvc2UsXHJcbiAgICAgICAgICAgIHNpbGVudDogISFjb21tYW5kZXIuc2lsZW50LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5jjg6vjg5fooajnpLrjgZfjgabntYLkuoZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hvd0hlbHAoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaW5mb3JtID0gKHRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hhbGsuZ3JlZW4odGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb21tYW5kZXIub3V0cHV0SGVscCg8YW55PmluZm9ybSk7XHJcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY29tbWFuZC1wYXJzZXIudHMiLCJpbXBvcnQge1xyXG4gICAgSUxpYnJhcnlDb25maWdyYXRpb24sXHJcbiAgICBJTW9iaWxlQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgSURlc2t0b3BBcHBDb25maWdyYXRpb24sXHJcbiAgICBJV2ViQXBwQ29uZmlncmF0aW9uLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcblxyXG4vKipcclxuICog44OW44Op44Km44K255Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25Ccm93c2VyID0gPElMaWJyYXJ5Q29uZmlncmF0aW9uPntcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJ1bWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiBmYWxzZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOb2RlLmpzIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uTm9kZSA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJQ29tcGlsZUNvbmZpZ3JhdGlvblxyXG4gICAgdHNUcmFuc3BpbGVUYXJnZXQ6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGVTeXN0ZW06IFwiY29tbW9uanNcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwibm9kZVwiLFxyXG4gICAgc3VwcG9ydENTUzogZmFsc2UsXHJcbn07XHJcblxyXG4vKipcclxuICogZWxlY3Ryb24g55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25FbGVjdHJvbiA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJQ29tcGlsZUNvbmZpZ3JhdGlvblxyXG4gICAgdHNUcmFuc3BpbGVUYXJnZXQ6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGVTeXN0ZW06IFwiY29tbW9uanNcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwiZWxlY3Ryb25cIixcclxuICAgIHN1cHBvcnRDU1M6IGZhbHNlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtihjb3Jkb3ZhKeeSsOWig+OBp+WLleS9nOOBmeOCi+ODouODkOOCpOODq+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbW9iaWxlT25Ccm93c2VyID0gPElNb2JpbGVBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSUNvbXBpbGVDb25maWdyYXRpb25cclxuICAgIHRzVHJhbnNwaWxlVGFyZ2V0OiBcImVzNVwiLFxyXG4gICAgbW9kdWxlU3lzdGVtOiBcImFtZFwiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJ3ZWJcIixcclxuICAgIHN1cHBvcnRDU1M6IHRydWUsXHJcbn07XHJcblxyXG4vKipcclxuICog44OW44Op44Km44K255Kw5aKD44Gn5YuV5L2c44GZ44KL44OH44K544Kv44OI44OD44OX44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBkZXNrdG9wT25Ccm93c2VyID0gPElEZXNrdG9wQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJhbWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiB0cnVlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqICBlbGVjdHJvbiDnkrDlooPjgafli5XkvZzjgZnjgovjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGRlc2t0b3BPbkVsZWN0cm9uID0gPElEZXNrdG9wQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczIwMTVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJjb21tb25qc1wiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJlbGVjdHJvbi1yZW5kZXJlclwiLFxyXG4gICAgc3VwcG9ydENTUzogdHJ1ZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjgqbjgqfjg5bjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IHdlYk9uQnJvd3NlciA9IDxJV2ViQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJhbWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiB0cnVlLFxyXG59O1xyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGxpYnJhcnk6IHtcclxuICAgICAgICBicm93c2VyOiBsaWJyYXJ5T25Ccm93c2VyLFxyXG4gICAgICAgIG5vZGU6IGxpYnJhcnlPbk5vZGUsXHJcbiAgICAgICAgZWxlY3Ryb246IGxpYnJhcnlPbkVsZWN0cm9uLFxyXG4gICAgICAgIEVMRUNUUk9OX0FWQUlMQUJMRTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbW9iaWxlOiB7XHJcbiAgICAgICAgYnJvd3NlcjogbW9iaWxlT25Ccm93c2VyLFxyXG4gICAgfSxcclxuICAgIGRlc2N0b3A6IHtcclxuICAgICAgICBicm93c2VyOiBkZXNrdG9wT25Ccm93c2VyLFxyXG4gICAgICAgIGVsZWN0cm9uOiBkZXNrdG9wT25FbGVjdHJvbixcclxuICAgIH0sXHJcbiAgICB3ZWI6IHtcclxuICAgICAgICBicm93c2VyOiB3ZWJPbkJyb3dzZXIsXHJcbiAgICB9LFxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2RlZmF1bHQtY29uZmlnLnRzIiwiLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcblxyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSURlc2t0b3BBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdERlc2t0b3BBcHBcclxuICogQGJyaWVmIOODh+OCueOCr+ODiOODg+ODl+OCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdERlc2t0b3BBcHAgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCqOODs+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IGFueSk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoXCJkZXNrdG9wIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIC8vIFRPRE86IHNob3dcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1kZXNrdG9wLnRzIiwiaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gXCIuL2RlZmF1bHQtY29uZmlnXCI7XHJcblxyXG5jb25zdCAkICAgICAgICAgICAgID0gVXRpbHMuJDtcclxuY29uc3QgY2hhbGsgICAgICAgICA9IFV0aWxzLmNoYWxrO1xyXG5jb25zdCBzZW12ZXJSZWdleCAgID0gVXRpbHMuc2VtdmVyUmVnZXg7XHJcbmNvbnN0IGxpYkNvbmZpZyA9IGRlZmF1bHRDb25maWcubGlicmFyeTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0TGlicmFyeVxyXG4gKiBAYnJpZWYg44Op44Kk44OW44Op44Oq44Oi44K444Ol44O844Or55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0TGlicmFyeSBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgLy8gcHJvamVjdCBjb21tb24gc2V0dG5pZ3MgKElQcm9qZWN0Q29uZmlncmF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInByb2plY3ROYW1lXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnByb2plY3ROYW1lIHx8IFwiQ29vbFByb2plY3ROYW1lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwidmVyc2lvblwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnZlcnNpb24gfHwgXCIwLjAuMVwiLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VtdmVyUmVnZXgoKS5leGVjKHZhbHVlKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibGljZW5zZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLmFwYWNoZTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkFwYWNoZS0yLjBcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLm1pdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTUlUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5wcm9wcmlldGFyeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTk9ORVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubGljZW5zZSB8fCBcIk5PTkVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoSUNvbXBpbGVDb25maWdyYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJ3ZWJwYWNrVGFyZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmxpYnJhcnkud2VicGFja1RhcmdldC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ud2VicGFja1RhcmdldC5jaG9pY2VzLmJyb3dzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIndlYlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi53ZWJwYWNrVGFyZ2V0LmNob2ljZXMubm9kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9kZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ud2VicGFja1RhcmdldC5jaG9pY2VzLmVsZWN0cm9uICsgdGhpcy5MSU1JVEFUSU9OKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVsZWN0cm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLndlYnBhY2tUYXJnZXQuY2hvaWNlcy5lbGVjdHJvblJlbmRlcmVyICsgdGhpcy5MSU1JVEFUSU9OKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVsZWN0cm9uLXJlbmRlcmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpYkNvbmZpZy5FTEVDVFJPTl9BVkFJTEFCTEUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJlbGVjdHJvblwiID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJub2RlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImVsZWN0cm9uLXJlbmRlcmVyXCIgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIndlYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLndlYnBhY2tUYXJnZXQgfHwgXCJ3ZWJcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gYmFzZSBzdHJ1Y3R1cmVcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImJhc2VTdHJ1Y3R1cmVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmJhc2VTdHJ1Y3R1cmUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmJhc2VTdHJ1Y3R1cmUuY2hvaWNlcy5yZWNvbW1lbmRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwicmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uYmFzZVN0cnVjdHVyZS5jaG9pY2VzLmN1c3RvbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY3VzdG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuYmFzZVN0cnVjdHVyZSB8fCBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKGN1c3RvbTogbW9kdWxlU3lzdGVtKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibW9kdWxlU3lzdGVtXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLm5vbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMuY29tbW9uanMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoXCJhbWRcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSB8fCBcImNvbW1vbmpzXCIpIDogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5iYXNlU3RydWN0dXJlICYmIC9eKG5vZGV8ZWxlY3Ryb24pJC9pLnRlc3QoYW5zd2Vycy53ZWJwYWNrVGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVTeXN0ZW1cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMubm9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5hbWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImFtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKFwiY29tbW9uanNcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSB8fCBcImFtZFwiKSA6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmJhc2VTdHJ1Y3R1cmUgJiYgXCJ3ZWJcIiA9PT0gYW5zd2Vycy53ZWJwYWNrVGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZHVsZVN5c3RlbVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5ub25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLmNvbW1vbmpzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5hbWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImFtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSB8fCBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmJhc2VTdHJ1Y3R1cmUgJiYgXCJlbGVjdHJvbi1yZW5kZXJlclwiID09PSBhbnN3ZXJzLndlYnBhY2tUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IHRzVHJhbnNwaWxlVGFyZ2V0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwidHNUcmFuc3BpbGVUYXJnZXRcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnRzVHJhbnNwaWxlVGFyZ2V0Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi50c1RyYW5zcGlsZVRhcmdldC5jaG9pY2VzLmVzNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXM1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnRzVHJhbnNwaWxlVGFyZ2V0LmNob2ljZXMuZXMyMDE1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlczIwMTVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy50c1RyYW5zcGlsZVRhcmdldCB8fCAoXCJ3ZWJcIiA9PT0gdGhpcy5hbnN3ZXJzLndlYnBhY2tUYXJnZXQgPyBcImVzNVwiIDogXCJlczIwMTVcIiksXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmJhc2VTdHJ1Y3R1cmU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IHN1cHBvcnRDU1MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29uZmlybVwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzdXBwb3J0Q1NTXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmxpYnJhcnkuc3VwcG9ydENTUy5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnN1cHBvcnRDU1MgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmJhc2VTdHJ1Y3R1cmU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICBjb25zdCBjb25maWc6IElMaWJyYXJ5Q29uZmlncmF0aW9uID0gKCgpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChhbnN3ZXJzLndlYnBhY2tUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ3ZWJcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5icm93c2VyLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJub2RlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcubm9kZSwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWxlY3Ryb25cIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5lbGVjdHJvbiwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWxlY3Ryb24tcmVuZGVyZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5lbGVjdHJvbiwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwidW5zdXBwb3J0ZWQgdGFyZ2V0OiBcIiArIGFuc3dlcnMud2VicGFja1RhcmdldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW1xyXG4gICAgICAgICAgICB7IG5hbWU6IFwiYmFzZVN0cnVjdHVyZVwiLCAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwicHJvamVjdE5hbWVcIiwgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwidmVyc2lvblwiLCAgICAgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwibGljZW5zZVwiLCAgICAgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwid2VicGFja1RhcmdldFwiLCAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwibW9kdWxlU3lzdGVtXCIsICAgICAgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwidHNUcmFuc3BpbGVUYXJnZXRcIiwgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwic3VwcG9ydENTU1wiLCAgICAgICAgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gKGl0ZW0ucmVjb21tZW5kICYmIFwicmVjb21tZW5kZWRcIiA9PT0gYW5zd2Vycy5iYXNlU3RydWN0dXJlKSA/IFwieWVsbG93XCIgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbmZpZzJkZXNjcmlwdGlvbihjb25maWcsIGl0ZW0ubmFtZSwgY29sb3IpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvciwgbnVsbCwgNCkpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzOlxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZWxlY3Ryb24g44GM5pyJ5Yq55Ye644Gq44GE5aC05ZCI44Gu6KOc6Laz5paH5a2X44KS5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgTElNSVRBVElPTigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBsaWJDb25maWcuRUxFQ1RST05fQVZBSUxBQkxFID8gXCJcIiA6IFwiIFwiICsgdGhpcy5sYW5nLnByb21wdC5jb21tb24uc3RpbE5vdEF2YWlsYWJsZTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1saWJyYXJ5LnRzIiwiLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcblxyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSU1vYmlsZUFwcENvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5cclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0TW9iaWxlQXBwXHJcbiAqIEBicmllZiDjg6Ljg5DjgqTjg6vjgqLjg5fjg6rnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHRNb2JpbGVBcHAgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCqOODs+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IGFueSk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoXCJtb2JpbGUgYXBwIHByb21wdGluZywgdW5kZXIgY29uc3RydWN0aW9uLlwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIC8vIFRPRE86XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a44Gu56K66KqNXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7SUFuc3dlclNjaGVtYX0gYW5zd2VycyDlm57nrZTntZDmnpxcclxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlncmF0aW9ufSDoqK3lrprlgKTjgpLov5TljbRcclxuICAgICAqL1xyXG4gICAgZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpOiBJUHJvamVjdENvbmZpZ3JhdGlvbiB7XHJcbiAgICAgICAgLy8gVE9ETzogc2hvd1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LW1vYmlsZS50cyIsIi8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElXZWJBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdFdlYkFwcFxyXG4gKiBAYnJpZWYg44Km44Kn44OW44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0V2ViQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KFwid2ViIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIC8vIFRPRE86IHNob3dcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC13ZWIudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21tYW5kZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdfQ==
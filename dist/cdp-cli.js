/*!
 * cdp-cli.js 0.0.2
 *
 * Date: 2017-05-12T10:06:35.994Z
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
    /**
     * ローカライズリソースにアクセス
     * ex) this.lang.prompt.projectName.message
     *
     * @return {Object} リソースオブジェクト
     */
    get lang() {
        return this._locale;
    }
    ///////////////////////////////////////////////////////////////////////
    // protected methods
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
                        .then((config) => {
                        config.action = this._cmdInfo.action;
                        config.settings = {
                            force: this._cmdInfo.cliOptions.force,
                            verbose: this._cmdInfo.cliOptions.verbose,
                            silent: this._cmdInfo.cliOptions.silent,
                            libPath: path.join(this._cmdInfo.pkgDir, "node_modules", "cdp-lib"),
                            targetDir: this._cmdInfo.cliOptions.targetDir,
                            lang: this.lang.type,
                        };
                        resolve(config);
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
        return cdp_lib_1.default.execute(config);
    })
        .then(() => {
        console.log(chalk.green(inquirer.lang.finished[cmdInfo.action]));
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
            targetDir: commander.targetdir,
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
    // IProjectConfigration
    projectKind: "library",
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
    // IProjectConfigration
    projectKind: "library",
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
    // IProjectConfigration
    projectKind: "library",
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
    // IProjectConfigration
    projectKind: "mobile",
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
    // IProjectConfigration
    projectKind: "desktop",
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
    // IProjectConfigration
    projectKind: "desktop",
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
    // IProjectConfigration
    projectKind: "web",
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
                default: this.answers.projectName || "cool-project-name",
                validate: (value) => {
                    if (/^.*[(\\|/|:|\*|?|\"|<|>|\|)].*$/.test(value)) {
                        return this.lang.prompt.common.projectName.invalidMessage;
                    }
                    else {
                        return true;
                    }
                },
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
                name: "extraSettings",
                message: this.lang.prompt.common.extraSettings.message,
                choices: [
                    {
                        name: this.lang.prompt.common.extraSettings.choices.recommended,
                        value: "recommended",
                    },
                    {
                        name: this.lang.prompt.common.extraSettings.choices.custom,
                        value: "custom",
                    },
                ],
                default: this.answers.extraSettings || "recommended",
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
                    return "custom" === answers.extraSettings && /^(node|electron)$/i.test(answers.webpackTarget);
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
                    return "custom" === answers.extraSettings && "web" === answers.webpackTarget;
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
                    return "custom" === answers.extraSettings && "electron-renderer" === answers.webpackTarget;
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
                    return "custom" === answers.extraSettings;
                },
            },
            // library settnigs (custom: supportCSS)
            {
                type: "confirm",
                name: "supportCSS",
                message: this.lang.prompt.library.supportCSS.message,
                default: this.answers.supportCSS || false,
                when: (answers) => {
                    return "custom" === answers.extraSettings;
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
            { name: "extraSettings", recommend: false },
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
                const color = (item.recommend && "recommended" === answers.extraSettings) ? "yellow" : undefined;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWZhZGFiMWMwZjVjNTMxMDM0OTAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9IiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWJhc2UudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifSIsImNkcDovLy9jZHAtY2xpL2NkcC1jbGkudHMiLCJjZHA6Ly8vY2RwLWNsaS9jb21tYW5kLXBhcnNlci50cyIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWRlc2t0b3AudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtbGlicmFyeS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1tb2JpbGUudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtd2ViLnRzIiwid2VicGFjazovLy9leHRlcm5hbC8ge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlD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c3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNWZhZGFiMWMwZjVjNTMxMDM0OTAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjZHAtbGliXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn1cbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSUNvbXBpbGVDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQgeyBJQ29tbWFuZExpbmVJbmZvIH0gZnJvbSBcIi4vY29tbWFuZC1wYXJzZXJcIjtcclxuXHJcbmNvbnN0IGZzICAgID0gVXRpbHMuZnM7XHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcbmNvbnN0IF8gICAgID0gVXRpbHMuXztcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElBbnN3ZXJTY2hlbWFcclxuICogQGJyaWVmIEFuc3dlciDjgqrjg5bjgrjjgqfjgq/jg4jjga7jgrnjgq3jg7zjg57lrprnvqnjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFuc3dlclNjaGVtYVxyXG4gICAgZXh0ZW5kcyBpbnF1aXJlci5BbnN3ZXJzLCBJUHJvamVjdENvbmZpZ3JhdGlvbiwgSUNvbXBpbGVDb25maWdyYXRpb24ge1xyXG4gICAgLy8g5YWx6YCa5ouh5by15a6a576pXHJcbiAgICBleHRyYVNldHRpbmdzOiBcInJlY29tbWVuZGVkXCIgfCBcImN1c3RvbVwiO1xyXG59XHJcblxyXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRCYXNlXHJcbiAqIEBicmllZiBQcm9tcHQg44Gu44OZ44O844K544Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbztcclxuICAgIHByaXZhdGUgX2Fuc3dlcnMgPSA8SUFuc3dlclNjaGVtYT57fTtcclxuICAgIHByaXZhdGUgX2xvY2FsZSA9IHt9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbyk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICB0aGlzLl9jbWRJbmZvID0gY21kSW5mbztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQcm9sb2d1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmlucXVpcmVMYW5ndWFnZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5xdWlyZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChzZXR0aW5nczogSVByb2plY3RDb25maWdyYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpa2UgY293c2F5XHJcbiAgICAgKiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db3dzYXlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNheShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBHUkVFVElORyA9XHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICAgIFwiICsgY2hhbGsuY3lhbihcIuKIp++8v+KIp1wiKSArIFwiICAgIO+8j++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iCDCtOKIgO+9gO+8iVwiKSArIFwi77ycICBcIiArIGNoYWxrLnllbGxvdyhtZXNzYWdlKSArXHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICBcIiArIGNoYWxrLmN5YW4oXCLvvIggIOOBpFwiKSArIFwi77ydXCIgKyBjaGFsay5jeWFuKFwi44GkXCIpICsgXCIgIO+8vO+8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhICBcIiArIGNoYWxrLmN5YW4oXCLvvZwg772cIHxcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iF/vvL/vvInvvL/vvIlcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gIOKJoSAgIFwiICsgY2hhbGsucmVkKFwi4peOXCIpICsgXCLvv6Pvv6Pvv6Pvv6NcIiArIGNoYWxrLnJlZChcIuKXjlwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhHUkVFVElORyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg63jg7zjgqvjg6njgqTjgrrjg6rjgr3jg7zjgrnjgavjgqLjgq/jgrvjgrlcclxuICAgICAqIGV4KSB0aGlzLmxhbmcucHJvbXB0LnByb2plY3ROYW1lLm1lc3NhZ2VcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOODquOCveODvOOCueOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGxhbmcoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgYWJzdHJhY3QgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBhYnN0cmFjdCBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6a5YCk44Gr44Ki44Kv44K744K5XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBnZXQgYW5zd2VycygpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYW5zd2VycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb2xvZ3VlIOOCs+ODoeODs+ODiOOBruioreWumlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHByb2xvZ3VlQ29tbWVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIldlbGNvbWUgdG8gQ0RQIEJvaWxlcnBsYXRlIEdlbmVyYXRvciFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlbGNvbWUg6KGo56S6XHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzaG93UHJvbG9ndWUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpKTtcclxuICAgICAgICB0aGlzLnNheSh0aGlzLnByb2xvZ3VlQ29tbWVudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIIOOBruabtOaWsFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlQW5zd2Vycyh1cGRhdGU6IElBbnN3ZXJTY2hlbWEpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gXy5tZXJnZSh0aGlzLl9hbnN3ZXJzLCB1cGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6aXHJcbiAgICAgKiDliIblspDjgYzlv4XopoHjgarloLTlkIjjga/jgqrjg7zjg5Djg7zjg6njgqTjg4njgZnjgovjgZPjgahcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGlucXVpcmVTZXR0aW5ncygpOiBQcm9taXNlPElBbnN3ZXJTY2hlbWE+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQodGhpcy5xdWVzdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXR0aW5nIOOBi+OCiSDoqK3lrproqqzmmI7jga7kvZzmiJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZyDoqK3lrppcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaXRlbU5hbWUg6Kit5a6a6aCF55uu5ZCNXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOiqrOaYjuaWh1xyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29uZmlnMmRlc2NyaXB0aW9uKGNvbmZpZzogT2JqZWN0LCBpdGVtTmFtZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nID0gXCJjeWFuXCIpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmxhbmcuc2V0dGluZ3NbaXRlbU5hbWVdO1xyXG4gICAgICAgIGlmIChudWxsID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvci4gaXRlbSBub3QgZm91bmQuIGl0ZW0gbmFtZTogXCIgKyBpdGVtTmFtZSkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwcm9wOiBzdHJpbmcgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9wcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucHJvcHNbY29uZmlnW2l0ZW1OYW1lXV07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJib29sZWFuXCIgPT09IHR5cGVvZiBjb25maWdbaXRlbU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5ib29sW2NvbmZpZ1tpdGVtTmFtZV0gPyBcInllc1wiIDogXCJub1wiXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWdbaXRlbU5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgKyBjaGFsa1tjb2xvcl0ocHJvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844Kr44Op44Kk44K644Oq44K944O844K544Gu44Ot44O844OJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZExhbmd1YWdlKGxvY2FsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fbG9jYWxlID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoXHJcbiAgICAgICAgICAgIHBhdGguam9pbih0aGlzLl9jbWRJbmZvLnBrZ0RpciwgXCJyZXMvbG9jYWxlcy9tZXNzYWdlcy5cIiArIGxvY2FsZSArIFwiLmpzb25cIiksIFwidXRmOFwiKS50b1N0cmluZygpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiogOiqnumBuOaKnlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlucXVpcmVMYW5ndWFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbiA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImxhbmd1YWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQbGVhc2UgY2hvb3NlIHlvdXIgcHJlZmVycmVkIGxhbmd1YWdlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJFbmdsaXNoL+iLseiqnlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZW4tVVNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJKYXBhbmVzZS/ml6XmnKzoqp5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImphLUpQXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGlucXVpcmVyLnByb21wdChxdWVzdGlvbilcclxuICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRMYW5ndWFnZShhbnN3ZXIubGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOioreWumueiuuiqjVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNvbmZpcm1TZXR0aW5ncygpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5kaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnModGhpcy5fYW5zd2Vycyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrOiBcIiArIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmNvbmZpcm0ubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY29uZmlybVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiY29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uY29uZmlybS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGlucXVpcmVyLnByb21wdChxdWVzdGlvbilcclxuICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5zd2VyLmNvbmZpcm1hdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqK3lrppcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlKCk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnF1aXJlU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXJzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQW5zd2VycyhhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5hY3Rpb24gPSB0aGlzLl9jbWRJbmZvLmFjdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMuZm9yY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcmJvc2U6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy52ZXJib3NlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWxlbnQ6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy5zaWxlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpYlBhdGg6IHBhdGguam9pbih0aGlzLl9jbWRJbmZvLnBrZ0RpciwgXCJub2RlX21vZHVsZXNcIiwgXCJjZHAtbGliXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXREaXI6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy50YXJnZXREaXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmc6IHRoaXMubGFuZy50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb25maWcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1iYXNlLnRzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpbnF1aXJlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiaW5xdWlyZXJcIixcImNvbW1vbmpzMlwiOlwiaW5xdWlyZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtcclxuICAgIGRlZmF1bHQgYXMgQ0RQTGliLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIENvbW1hbmRQYXJzZXIsXHJcbiAgICBJQ29tbWFuZExpbmVJbmZvLFxyXG59IGZyb20gXCIuL2NvbW1hbmQtcGFyc2VyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRMaWJyYXJ5LFxyXG59IGZyb20gXCIuL3Byb21wdC1saWJyYXJ5XCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRNb2JpbGVBcHAsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LW1vYmlsZVwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0RGVza3RvcEFwcCxcclxufSBmcm9tIFwiLi9wcm9tcHQtZGVza3RvcFwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0V2ViQXBwLFxyXG59IGZyb20gXCIuL3Byb21wdC13ZWJcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG5mdW5jdGlvbiBnZXRJbnF1aXJlcihjbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvKTogUHJvbXB0QmFzZSB7XHJcbiAgICBzd2l0Y2ggKGNtZEluZm8uYWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChjbWRJbmZvLmFjdGlvbiArIFwiIGNvbW1hbmQ6IHVuZGVyIGNvbnN0cnVjdGlvbi5cIikpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChjbWRJbmZvLnRhcmdldCkge1xyXG4gICAgICAgIGNhc2UgXCJsaWJyYXJ5XCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0TGlicmFyeSgpO1xyXG4gICAgICAgIGNhc2UgXCJtb2JpbGVcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRNb2JpbGVBcHAoKTtcclxuICAgICAgICBjYXNlIFwiZGVza3RvcFwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdERlc2t0b3BBcHAoKTtcclxuICAgICAgICBjYXNlIFwid2ViXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0V2ViQXBwKCk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJ1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgY21kSW5mby50YXJnZXQpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIHByb2Nlc3MudGl0bGUgPSBcImNkcFwiO1xyXG4gICAgY29uc3QgY21kSW5mbyA9IENvbW1hbmRQYXJzZXIucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuICAgIGNvbnN0IGlucXVpcmVyID0gZ2V0SW5xdWlyZXIoY21kSW5mbyk7XHJcblxyXG4gICAgaW5xdWlyZXIucHJvbXB0aW5nKGNtZEluZm8pXHJcbiAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAvLyBleGVjdXRlXHJcbiAgICAgICAgICAgIHJldHVybiBDRFBMaWIuZXhlY3V0ZShjb25maWcpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihpbnF1aXJlci5sYW5nLmZpbmlzaGVkW2NtZEluZm8uYWN0aW9uXSkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoXCJzdHJpbmdcIiAhPT0gdHlwZW9mIHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgcmVhc29uID0gSlNPTi5zdHJpbmdpZnkocmVhc29uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChyZWFzb24pKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgLy8gTk9URTogZXM2IHByb21pc2UncyBhbHdheXMgYmxvY2suXHJcbiAgICAgICAgfSk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9jZHAtY2xpLnRzIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBjb21tYW5kZXIgZnJvbSBcImNvbW1hbmRlclwiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCJjZHAtbGliXCI7XHJcblxyXG5jb25zdCBmcyAgICA9IFV0aWxzLmZzO1xyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lT3B0aW9uc1xyXG4gKiBAYnJpZWYgICAgIOOCs+ODnuODs+ODieODqeOCpOODs+eUqOOCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQ29tbWFuZExpbmVPcHRpb25zIHtcclxuICAgIGZvcmNlOiBib29sZWFuOyAgICAgLy8g44Ko44Op44O857aZ57aa55SoXHJcbiAgICB0YXJnZXREaXI6IHN0cmluZzsgIC8vIOS9nOalreODh+OCo+ODrOOCr+ODiOODquaMh+WumlxyXG4gICAgY29uZmlnOiBzdHJpbmc7ICAgICAvLyDjgrPjg7Pjg5XjgqPjgrDjg5XjgqHjgqTjg6vmjIflrppcclxuICAgIHZlcmJvc2U6IGJvb2xlYW47ICAgLy8g6Kmz57Sw44Ot44KwXHJcbiAgICBzaWxlbnQ6IGJvb2xlYW47ICAgIC8vIHNpbGVudCBtb2RlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElDb21tYW5kTGluZUluZm9cclxuICogQGJyaWVmICAgICDjgrPjg57jg7Pjg4njg6njgqTjg7Pmg4XloLHmoLzntI3jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lSW5mbyB7XHJcbiAgICBwa2dEaXI6IHN0cmluZzsgICAgICAgICAgICAgICAgICAgICAvLyBDTEkg44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44OqXHJcbiAgICBhY3Rpb246IHN0cmluZzsgICAgICAgICAgICAgICAgICAgICAvLyDjgqLjgq/jgrfjg6fjg7PlrprmlbBcclxuICAgIHRhcmdldDogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCs+ODnuODs+ODieOCv+ODvOOCsuODg+ODiFxyXG4gICAgaW5zdGFsbGVkRGlyOiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8gQ0xJIOOCpOODs+OCueODiOODvOODq1xyXG4gICAgY2xpT3B0aW9uczogSUNvbW1hbmRMaW5lT3B0aW9uczsgICAgLy8g44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gn5rih44GV44KM44Gf44Kq44OX44K344On44OzXHJcbn1cclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4vKipcclxuICogQGNsYXNzIENvbW1hbmRQYXJzZXJcclxuICogQGJyaWVmIOOCs+ODnuODs+ODieODqeOCpOODs+ODkeODvOOCteODvFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbW1hbmRQYXJzZXIge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODnuODs+ODieODqeOCpOODs+OBruODkeODvOOCuVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gYXJndiAgICAgICDlvJXmlbDjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gW29wdGlvbnNdICDjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAqIEByZXR1cm5zIHtJQ29tbWFuZExpbmVJbmZvfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHBhcnNlKGFyZ3Y6IHN0cmluZ1tdLCBvcHRpb25zPzogYW55KTogSUNvbW1hbmRMaW5lSW5mbyB7XHJcbiAgICAgICAgY29uc3QgY21kbGluZSA9IDxJQ29tbWFuZExpbmVJbmZvPntcclxuICAgICAgICAgICAgcGtnRGlyOiB0aGlzLmdldFBhY2thZ2VEaXJlY3RvcnkoYXJndiksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBwa2cgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oY21kbGluZS5wa2dEaXIsIFwicGFja2FnZS5qc29uXCIpLCBcInV0ZjhcIikudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAudmVyc2lvbihwa2cudmVyc2lvbilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1mLCAtLWZvcmNlXCIsIFwiQ29udGludWUgZXhlY3V0aW9uIGV2ZW4gaWYgaW4gZXJyb3Igc2l0dWF0aW9uXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItdCwgLS10YXJnZXRkaXIgPHBhdGg+XCIsIFwiU3BlY2lmeSBwcm9qZWN0IHRhcmdldCBkaXJlY3RvcnlcIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1jLCAtLWNvbmZpZyA8cGF0aD5cIiwgXCJTcGVjaWZ5IGNvbmZpZyBmaWxlIHBhdGhcIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi12LCAtLXZlcmJvc2VcIiwgXCJTaG93IGRlYnVnIG1lc3NhZ2VzLlwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXMsIC0tc2lsZW50XCIsIFwiUnVuIGFzIHNpbGVudCBtb2RlLlwiKVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiaW5pdFwiKVxyXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJpbml0IHByb2plY3RcIilcclxuICAgICAgICAgICAgLmFjdGlvbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjbWRsaW5lLmFjdGlvbiA9IFwiaW5pdFwiO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCItLWhlbHBcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgIEV4YW1wbGVzOlwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGluaXRcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCJjcmVhdGUgPHRhcmdldD5cIilcclxuICAgICAgICAgICAgLmRlc2NyaXB0aW9uKFwiY3JlYXRlIGJvaWxlcnBsYXRlIGZvciAnbGlicmFyeSwgbW9kdWxlJyB8ICdtb2JpbGUsIGFwcCcgfCAnZGVza3RvcCcgfCAnd2ViJ1wiKVxyXG4gICAgICAgICAgICAuYWN0aW9uKCh0YXJnZXQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKC9eKG1vZHVsZXxhcHB8bGlicmFyeXxtb2JpbGV8ZGVza3RvcHx3ZWIpJC9pLnRlc3QodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZGxpbmUuYWN0aW9uID0gXCJjcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJtb2R1bGVcIiA9PT0gY21kbGluZS50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSBcImxpYnJhcnlcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiYXBwXCIgPT09IGNtZGxpbmUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gXCJtb2JpbGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZC51bmRlcmxpbmUoXCIgIHVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyB0YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIi0taGVscFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgRXhhbXBsZXM6XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIGxpYnJhcnlcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIG1vYmlsZVwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgYXBwIC1jIHNldHRpbmcuanNvblwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcIipcIiwgbnVsbCwgeyBub0hlbHA6IHRydWUgfSlcclxuICAgICAgICAgICAgLmFjdGlvbigoY21kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQudW5kZXJsaW5lKFwiICB1bnN1cHBvcnRlZCBjb21tYW5kOiBcIiArIGNtZCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyLnBhcnNlKGFyZ3YpO1xyXG5cclxuICAgICAgICBpZiAoYXJndi5sZW5ndGggPD0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbWRsaW5lLmNsaU9wdGlvbnMgPSB0aGlzLnRvQ29tbWFuZExpbmVPcHRpb25zKGNvbW1hbmRlcik7XHJcblxyXG4gICAgICAgIHJldHVybiBjbWRsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcml2YXRlIHN0YXRpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDTEkg44Gu44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44Oq44KS5Y+W5b6XXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nW119IGFyZ3Yg5byV5pWwXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYWNrYWdlRGlyZWN0b3J5KGFyZ3Y6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBleGVjRGlyID0gcGF0aC5kaXJuYW1lKGFyZ3ZbMV0pO1xyXG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oZXhlY0RpciwgXCIuLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENMSSBvcHRpb24g44KSIElDb21tYW5kTGluZU9wdGlvbnMg44Gr5aSJ5o+bXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBjb21tYW5kZXIgcGFyc2Ug5riI44G/IGNvbWFubmRlciDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAqIEByZXR1cm4ge0lDb21tYW5kTGluZU9wdGlvbnN9IG9wdGlvbiDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdG9Db21tYW5kTGluZU9wdGlvbnMoY29tbWFuZGVyOiBhbnkpOiBJQ29tbWFuZExpbmVPcHRpb25zIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmb3JjZTogISFjb21tYW5kZXIuZm9yY2UsXHJcbiAgICAgICAgICAgIHRhcmdldERpcjogY29tbWFuZGVyLnRhcmdldGRpcixcclxuICAgICAgICAgICAgY29uZmlnOiBjb21tYW5kZXIuY29uZmlnLFxyXG4gICAgICAgICAgICB2ZXJib3NlOiAhIWNvbW1hbmRlci52ZXJib3NlLFxyXG4gICAgICAgICAgICBzaWxlbnQ6ICEhY29tbWFuZGVyLnNpbGVudCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OY44Or44OX6KGo56S644GX44Gm57WC5LqGXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHNob3dIZWxwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGluZm9ybSA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoYWxrLmdyZWVuKHRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29tbWFuZGVyLm91dHB1dEhlbHAoPGFueT5pbmZvcm0pO1xyXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NvbW1hbmQtcGFyc2VyLnRzIiwiaW1wb3J0IHtcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgSU1vYmlsZUFwcENvbmZpZ3JhdGlvbixcclxuICAgIElEZXNrdG9wQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgSVdlYkFwcENvbmZpZ3JhdGlvbixcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uQnJvd3NlciA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUNvbXBpbGVDb25maWdyYXRpb25cclxuICAgIHRzVHJhbnNwaWxlVGFyZ2V0OiBcImVzNVwiLFxyXG4gICAgbW9kdWxlU3lzdGVtOiBcInVtZFwiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJ3ZWJcIixcclxuICAgIHN1cHBvcnRDU1M6IGZhbHNlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5vZGUuanMg55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25Ob2RlID0gPElMaWJyYXJ5Q29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0S2luZDogXCJsaWJyYXJ5XCIsXHJcbiAgICAvLyBJQ29tcGlsZUNvbmZpZ3JhdGlvblxyXG4gICAgdHNUcmFuc3BpbGVUYXJnZXQ6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGVTeXN0ZW06IFwiY29tbW9uanNcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwibm9kZVwiLFxyXG4gICAgc3VwcG9ydENTUzogZmFsc2UsXHJcbn07XHJcblxyXG4vKipcclxuICogZWxlY3Ryb24g55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25FbGVjdHJvbiA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUNvbXBpbGVDb25maWdyYXRpb25cclxuICAgIHRzVHJhbnNwaWxlVGFyZ2V0OiBcImVzMjAxNVwiLFxyXG4gICAgbW9kdWxlU3lzdGVtOiBcImNvbW1vbmpzXCIsXHJcbiAgICB3ZWJwYWNrVGFyZ2V0OiBcImVsZWN0cm9uXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiBmYWxzZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrYoY29yZG92YSnnkrDlooPjgafli5XkvZzjgZnjgovjg6Ljg5DjgqTjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IG1vYmlsZU9uQnJvd3NlciA9IDxJTW9iaWxlQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0S2luZDogXCJtb2JpbGVcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJhbWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiB0cnVlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODh+OCueOCr+ODiOODg+ODl+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgZGVza3RvcE9uQnJvd3NlciA9IDxJRGVza3RvcEFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwiZGVza3RvcFwiLFxyXG4gICAgLy8gSUNvbXBpbGVDb25maWdyYXRpb25cclxuICAgIHRzVHJhbnNwaWxlVGFyZ2V0OiBcImVzNVwiLFxyXG4gICAgbW9kdWxlU3lzdGVtOiBcImFtZFwiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJ3ZWJcIixcclxuICAgIHN1cHBvcnRDU1M6IHRydWUsXHJcbn07XHJcblxyXG4vKipcclxuICogIGVsZWN0cm9uIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODh+OCueOCr+ODiOODg+ODl+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgZGVza3RvcE9uRWxlY3Ryb24gPSA8SURlc2t0b3BBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RLaW5kOiBcImRlc2t0b3BcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczIwMTVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJjb21tb25qc1wiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJlbGVjdHJvbi1yZW5kZXJlclwiLFxyXG4gICAgc3VwcG9ydENTUzogdHJ1ZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjgqbjgqfjg5bjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IHdlYk9uQnJvd3NlciA9IDxJV2ViQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0S2luZDogXCJ3ZWJcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJhbWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiB0cnVlLFxyXG59O1xyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGxpYnJhcnk6IHtcclxuICAgICAgICBicm93c2VyOiBsaWJyYXJ5T25Ccm93c2VyLFxyXG4gICAgICAgIG5vZGU6IGxpYnJhcnlPbk5vZGUsXHJcbiAgICAgICAgZWxlY3Ryb246IGxpYnJhcnlPbkVsZWN0cm9uLFxyXG4gICAgICAgIEVMRUNUUk9OX0FWQUlMQUJMRTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbW9iaWxlOiB7XHJcbiAgICAgICAgYnJvd3NlcjogbW9iaWxlT25Ccm93c2VyLFxyXG4gICAgfSxcclxuICAgIGRlc2N0b3A6IHtcclxuICAgICAgICBicm93c2VyOiBkZXNrdG9wT25Ccm93c2VyLFxyXG4gICAgICAgIGVsZWN0cm9uOiBkZXNrdG9wT25FbGVjdHJvbixcclxuICAgIH0sXHJcbiAgICB3ZWI6IHtcclxuICAgICAgICBicm93c2VyOiB3ZWJPbkJyb3dzZXIsXHJcbiAgICB9LFxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2RlZmF1bHQtY29uZmlnLnRzIiwiLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcblxyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSURlc2t0b3BBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdERlc2t0b3BBcHBcclxuICogQGJyaWVmIOODh+OCueOCr+ODiOODg+ODl+OCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdERlc2t0b3BBcHAgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCqOODs+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IGFueSk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoXCJkZXNrdG9wIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIC8vIFRPRE86IHNob3dcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1kZXNrdG9wLnRzIiwiaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gXCIuL2RlZmF1bHQtY29uZmlnXCI7XHJcblxyXG5jb25zdCAkICAgICAgICAgICAgID0gVXRpbHMuJDtcclxuY29uc3QgY2hhbGsgICAgICAgICA9IFV0aWxzLmNoYWxrO1xyXG5jb25zdCBzZW12ZXJSZWdleCAgID0gVXRpbHMuc2VtdmVyUmVnZXg7XHJcbmNvbnN0IGxpYkNvbmZpZyA9IGRlZmF1bHRDb25maWcubGlicmFyeTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0TGlicmFyeVxyXG4gKiBAYnJpZWYg44Op44Kk44OW44Op44Oq44Oi44K444Ol44O844Or55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0TGlicmFyeSBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgLy8gcHJvamVjdCBjb21tb24gc2V0dG5pZ3MgKElQcm9qZWN0Q29uZmlncmF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInByb2plY3ROYW1lXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnByb2plY3ROYW1lIHx8IFwiY29vbC1wcm9qZWN0LW5hbWVcIixcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoL14uKlsoXFxcXHwvfDp8XFwqfD98XFxcInw8fD58XFx8KV0uKiQvLnRlc3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInZlcnNpb25cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy52ZXJzaW9uIHx8IFwiMC4wLjFcIixcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlclJlZ2V4KCkuZXhlYyh2YWx1ZSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24uaW52YWxpZE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImxpY2Vuc2VcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5hcGFjaGUyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJBcGFjaGUtMi4wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5taXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk1JVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMucHJvcHJpZXRhcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk5PTkVcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmxpY2Vuc2UgfHwgXCJOT05FXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKElDb21waWxlQ29uZmlncmF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwid2VicGFja1RhcmdldFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5saWJyYXJ5LndlYnBhY2tUYXJnZXQubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLndlYnBhY2tUYXJnZXQuY2hvaWNlcy5icm93c2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ3ZWJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ud2VicGFja1RhcmdldC5jaG9pY2VzLm5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vZGVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBpbnF1aXJlci5TZXBhcmF0b3IoKSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLndlYnBhY2tUYXJnZXQuY2hvaWNlcy5lbGVjdHJvbiArIHRoaXMuTElNSVRBVElPTigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlbGVjdHJvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi53ZWJwYWNrVGFyZ2V0LmNob2ljZXMuZWxlY3Ryb25SZW5kZXJlciArIHRoaXMuTElNSVRBVElPTigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlbGVjdHJvbi1yZW5kZXJlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaWJDb25maWcuRUxFQ1RST05fQVZBSUxBQkxFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiZWxlY3Ryb25cIiA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibm9kZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJlbGVjdHJvbi1yZW5kZXJlclwiID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ3ZWJcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy53ZWJwYWNrVGFyZ2V0IHx8IFwid2ViXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGJhc2Ugc3RydWN0dXJlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJleHRyYVNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLmNob2ljZXMucmVjb21tZW5kZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5jdXN0b20sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImN1c3RvbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmV4dHJhU2V0dGluZ3MgfHwgXCJyZWNvbW1lbmRlZFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IG1vZHVsZVN5c3RlbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZHVsZVN5c3RlbVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5ub25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLmNvbW1vbmpzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKFwiYW1kXCIgIT09IHRoaXMuYW5zd2Vycy5tb2R1bGVTeXN0ZW0pID8gKHRoaXMuYW5zd2Vycy5tb2R1bGVTeXN0ZW0gfHwgXCJjb21tb25qc1wiKSA6IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiAvXihub2RlfGVsZWN0cm9uKSQvaS50ZXN0KGFuc3dlcnMud2VicGFja1RhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibW9kdWxlU3lzdGVtXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLm5vbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMuYW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJhbWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMudW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ1bWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IChcImNvbW1vbmpzXCIgIT09IHRoaXMuYW5zd2Vycy5tb2R1bGVTeXN0ZW0pID8gKHRoaXMuYW5zd2Vycy5tb2R1bGVTeXN0ZW0gfHwgXCJhbWRcIikgOiBcImFtZFwiLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzICYmIFwid2ViXCIgPT09IGFuc3dlcnMud2VicGFja1RhcmdldDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVTeXN0ZW1cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMubm9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5jb21tb25qcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMuYW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJhbWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMudW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ1bWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5tb2R1bGVTeXN0ZW0gfHwgXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzICYmIFwiZWxlY3Ryb24tcmVuZGVyZXJcIiA9PT0gYW5zd2Vycy53ZWJwYWNrVGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoY3VzdG9tOiB0c1RyYW5zcGlsZVRhcmdldClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInRzVHJhbnNwaWxlVGFyZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi50c1RyYW5zcGlsZVRhcmdldC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24udHNUcmFuc3BpbGVUYXJnZXQuY2hvaWNlcy5lczUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVzNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi50c1RyYW5zcGlsZVRhcmdldC5jaG9pY2VzLmVzMjAxNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXMyMDE1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMudHNUcmFuc3BpbGVUYXJnZXQgfHwgKFwid2ViXCIgPT09IHRoaXMuYW5zd2Vycy53ZWJwYWNrVGFyZ2V0ID8gXCJlczVcIiA6IFwiZXMyMDE1XCIpLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoY3VzdG9tOiBzdXBwb3J0Q1NTKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbmZpcm1cIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwic3VwcG9ydENTU1wiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5saWJyYXJ5LnN1cHBvcnRDU1MubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5zdXBwb3J0Q1NTIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a44Gu56K66KqNXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7SUFuc3dlclNjaGVtYX0gYW5zd2VycyDlm57nrZTntZDmnpxcclxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlncmF0aW9ufSDoqK3lrprlgKTjgpLov5TljbRcclxuICAgICAqL1xyXG4gICAgZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpOiBJUHJvamVjdENvbmZpZ3JhdGlvbiB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnOiBJTGlicmFyeUNvbmZpZ3JhdGlvbiA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoYW5zd2Vycy53ZWJwYWNrVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwid2ViXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuYnJvd3NlciwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibm9kZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLm5vZGUsIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImVsZWN0cm9uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuZWxlY3Ryb24sIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImVsZWN0cm9uLXJlbmRlcmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuZWxlY3Ryb24sIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcInVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyBhbnN3ZXJzLndlYnBhY2tUYXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICBjb25zdCBpdGVtcyA9IFtcclxuICAgICAgICAgICAgeyBuYW1lOiBcImV4dHJhU2V0dGluZ3NcIiwgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInByb2plY3ROYW1lXCIsICAgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInZlcnNpb25cIiwgICAgICAgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImxpY2Vuc2VcIiwgICAgICAgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcIndlYnBhY2tUYXJnZXRcIiwgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcIm1vZHVsZVN5c3RlbVwiLCAgICAgICAgIHJlY29tbWVuZDogdHJ1ZSAgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInRzVHJhbnNwaWxlVGFyZ2V0XCIsICAgIHJlY29tbWVuZDogdHJ1ZSAgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInN1cHBvcnRDU1NcIiwgICAgICAgICAgIHJlY29tbWVuZDogdHJ1ZSAgICAgfSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IChpdGVtLnJlY29tbWVuZCAmJiBcInJlY29tbWVuZGVkXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncykgPyBcInllbGxvd1wiIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25maWcyZGVzY3JpcHRpb24oY29uZmlnLCBpdGVtLm5hbWUsIGNvbG9yKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwiZXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IsIG51bGwsIDQpKSk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgbWV0aG9kczpcclxuXHJcbiAgICAvKipcclxuICAgICAqIGVsZWN0cm9uIOOBjOacieWKueWHuuOBquOBhOWgtOWQiOOBruijnOi2s+aWh+Wtl+OCkuWPluW+l1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIExJTUlUQVRJT04oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gbGliQ29uZmlnLkVMRUNUUk9OX0FWQUlMQUJMRSA/IFwiXCIgOiBcIiBcIiArIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnN0aWxOb3RBdmFpbGFibGU7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtbGlicmFyeS50cyIsIi8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElNb2JpbGVBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdE1vYmlsZUFwcFxyXG4gKiBAYnJpZWYg44Oi44OQ44Kk44Or44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0TW9iaWxlQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KFwibW9iaWxlIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIC8vIFRPRE86IHNob3dcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1tb2JpbGUudHMiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJV2ViQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRXZWJBcHBcclxuICogQGJyaWVmIOOCpuOCp+ODluOCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdFdlYkFwcCBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogYW55KTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChcIndlYiBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICAvLyBUT0RPOiBzaG93XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtd2ViLnRzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29tbWFuZGVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjb21tYW5kZXJcIixcImNvbW1vbmpzMlwiOlwiY29tbWFuZGVyXCJ9XG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXX0=
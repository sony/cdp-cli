/*!
 * cdp-cli.js 0.0.2
 *
 * Date: 2017-05-11T11:17:36.061Z
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
                        .then((config) => {
                        config.settings = {
                            force: this._cmdInfo.cliOptions.force,
                            verbose: this._cmdInfo.cliOptions.verbose,
                            silent: this._cmdInfo.cliOptions.silent,
                            libPath: path.join(this._cmdInfo.pkgDir, "node_modules", "cdp-lib"),
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
        console.log(cmdInfo.cliOptions.config);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjllMjFjZjg2MzYxMDBmNzFlNjciLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9IiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWJhc2UudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifSIsImNkcDovLy9jZHAtY2xpL2NkcC1jbGkudHMiLCJjZHA6Ly8vY2RwLWNsaS9jb21tYW5kLXBhcnNlci50cyIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWRlc2t0b3AudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtbGlicmFyeS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1tb2JpbGUudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtd2ViLnRzIiwid2VicGFjazovLy9leHRlcm5hbC8ge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlD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QUVHO0lBQ0ksU0FBUyxDQUFDLE9BQVk7UUFDekIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsTUFBTSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsdUVBQXVFO0lBQ3ZFLDhCQUE4QjtJQUU5Qjs7T0FFRztJQUNILElBQUksU0FBUztRQUNULFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsd0JBQXdCLENBQUMsT0FBc0I7UUFDM0MsYUFBYTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBbkNELG9DQW1DQzs7Ozs7OztBQ3ZERCxzQyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDI5ZTIxY2Y4NjM2MTAwZjcxZTY3IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2RwLWxpYlwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9XG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElDb21waWxlQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHsgSUNvbW1hbmRMaW5lSW5mbyB9IGZyb20gXCIuL2NvbW1hbmQtcGFyc2VyXCI7XHJcblxyXG5jb25zdCBmcyAgICA9IFV0aWxzLmZzO1xyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5jb25zdCBfICAgICA9IFV0aWxzLl87XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJQW5zd2VyU2NoZW1hXHJcbiAqIEBicmllZiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OI44Gu44K544Kt44O844Oe5a6a576p44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElBbnN3ZXJTY2hlbWFcclxuICAgIGV4dGVuZHMgaW5xdWlyZXIuQW5zd2VycywgSVByb2plY3RDb25maWdyYXRpb24sIElDb21waWxlQ29uZmlncmF0aW9uIHtcclxuICAgIC8vIOWFsemAmuaLoeW8teWumue+qVxyXG4gICAgYmFzZVN0cnVjdHVyZTogXCJyZWNvbW1lbmRlZFwiIHwgXCJjdXN0b21cIjtcclxufVxyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0QmFzZVxyXG4gKiBAYnJpZWYgUHJvbXB0IOOBruODmeODvOOCueOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIHByaXZhdGUgX2NtZEluZm86IElDb21tYW5kTGluZUluZm87XHJcbiAgICBwcml2YXRlIF9hbnN3ZXJzID0gPElBbnN3ZXJTY2hlbWE+e307XHJcbiAgICBwcml2YXRlIF9sb2NhbGUgPSB7fTtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCqOODs+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IElDb21tYW5kTGluZUluZm8pOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgdGhpcy5fY21kSW5mbyA9IGNtZEluZm87XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zaG93UHJvbG9ndWUoKTtcclxuICAgICAgICAgICAgdGhpcy5pbnF1aXJlTGFuZ3VhZ2UoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlucXVpcmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoc2V0dGluZ3M6IElQcm9qZWN0Q29uZmlncmF0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaWtlIGNvd3NheVxyXG4gICAgICogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ293c2F5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzYXkobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgR1JFRVRJTkcgPVxyXG4gICAgICAgICAgICBcIlxcbiAg4omhICAgICBcIiArIGNoYWxrLmN5YW4oXCLiiKfvvL/iiKdcIikgKyBcIiAgICDvvI/vv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6NcIiArXHJcbiAgICAgICAgICAgIFwiXFxuICAgIOKJoSBcIiArIGNoYWxrLmN5YW4oXCLvvIggwrTiiIDvvYDvvIlcIikgKyBcIu+8nCAgXCIgKyBjaGFsay55ZWxsb3cobWVzc2FnZSkgK1xyXG4gICAgICAgICAgICBcIlxcbiAg4omhICAgXCIgKyBjaGFsay5jeWFuKFwi77yIICDjgaRcIikgKyBcIu+8nVwiICsgY2hhbGsuY3lhbihcIuOBpFwiKSArIFwiICDvvLzvvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL9cIiArXHJcbiAgICAgICAgICAgIFwiXFxuICAgIOKJoSAgXCIgKyBjaGFsay5jeWFuKFwi772cIO+9nCB8XCIpICsgXCLvvLxcIiArXHJcbiAgICAgICAgICAgIFwiXFxuICAgIOKJoSBcIiArIGNoYWxrLmN5YW4oXCLvvIhf77y/77yJ77y/77yJXCIpICsgXCLvvLxcIiArXHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICBcIiArIGNoYWxrLnJlZChcIuKXjlwiKSArIFwi77+j77+j77+j77+jXCIgKyBjaGFsay5yZWQoXCLil45cIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coR1JFRVRJTkcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgYWJzdHJhY3QgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBhYnN0cmFjdCBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844Kr44Op44Kk44K644Oq44K944O844K544Gr44Ki44Kv44K744K5XHJcbiAgICAgKiBleCkgdGhpcy5sYW5nLnByb21wdC5wcm9qZWN0TmFtZS5tZXNzYWdlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSDjg6rjgr3jg7zjgrnjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGdldCBsYW5nKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOioreWumuWApOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGFuc3dlcnMoKTogSUFuc3dlclNjaGVtYSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Fuc3dlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9sb2d1ZSDjgrPjg6Hjg7Pjg4jjga7oqK3lrppcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGdldCBwcm9sb2d1ZUNvbW1lbnQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJXZWxjb21lIHRvIENEUCBCb2lsZXJwbGF0ZSBHZW5lcmF0b3IhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXZWxjb21lIOihqOekulxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgc2hvd1Byb2xvZ3VlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSk7XHJcbiAgICAgICAgdGhpcy5zYXkodGhpcy5wcm9sb2d1ZUNvbW1lbnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSArIFwiXFxuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiCDjga7mm7TmlrBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuc3dlciDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUFuc3dlcnModXBkYXRlOiBJQW5zd2VyU2NoZW1hKTogSUFuc3dlclNjaGVtYSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWVyZ2UodGhpcy5fYW5zd2VycywgdXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumlxyXG4gICAgICog5YiG5bKQ44GM5b+F6KaB44Gq5aC05ZCI44Gv44Kq44O844OQ44O844Op44Kk44OJ44GZ44KL44GT44GoXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBpbnF1aXJlU2V0dGluZ3MoKTogUHJvbWlzZTxJQW5zd2VyU2NoZW1hPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaW5xdWlyZXIucHJvbXB0KHRoaXMucXVlc3Rpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0dGluZyDjgYvjgokg6Kit5a6a6Kqs5piO44Gu5L2c5oiQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBjb25maWcg6Kit5a6aXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGl0ZW1OYW1lIOioreWumumgheebruWQjVxyXG4gICAgICogQHJldHVybiB7U3RyaW5nfSDoqqzmmI7mlodcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGNvbmZpZzJkZXNjcmlwdGlvbihjb25maWc6IE9iamVjdCwgaXRlbU5hbWU6IHN0cmluZywgY29sb3I6IHN0cmluZyA9IFwiY3lhblwiKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5sYW5nLnNldHRpbmdzW2l0ZW1OYW1lXTtcclxuICAgICAgICBpZiAobnVsbCA9PSBpdGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwiZXJyb3IuIGl0ZW0gbm90IGZvdW5kLiBpdGVtIG5hbWU6IFwiICsgaXRlbU5hbWUpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcHJvcDogc3RyaW5nID0gKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ucHJvcHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnByb3BzW2NvbmZpZ1tpdGVtTmFtZV1dO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFwiYm9vbGVhblwiID09PSB0eXBlb2YgY29uZmlnW2l0ZW1OYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uYm9vbFtjb25maWdbaXRlbU5hbWVdID8gXCJ5ZXNcIiA6IFwibm9cIl07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnW2l0ZW1OYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpdGVtLmxhYmVsICsgY2hhbGtbY29sb3JdKHByb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODreODvOOCq+ODqeOCpOOCuuODquOCveODvOOCueOBruODreODvOODiVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRMYW5ndWFnZShsb2NhbGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKFxyXG4gICAgICAgICAgICBwYXRoLmpvaW4odGhpcy5fY21kSW5mby5wa2dEaXIsIFwicmVzL2xvY2FsZXMvbWVzc2FnZXMuXCIgKyBsb2NhbGUgKyBcIi5qc29uXCIpLCBcInV0ZjhcIikudG9TdHJpbmcoKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqIDoqp7pgbjmip5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlTGFuZ3VhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJsYW5ndWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUGxlYXNlIGNob29zZSB5b3VyIHByZWZlcnJlZCBsYW5ndWFnZS5cIixcclxuICAgICAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRW5nbGlzaC/oi7Hoqp5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVuLVVTXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiSmFwYW5lc2Uv5pel5pys6KqeXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJqYS1KUFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb24pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkTGFuZ3VhZ2UoYW5zd2VyLmxhbmd1YWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqK3lrprnorroqo1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjb25maXJtU2V0dGluZ3MoKTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMuZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKHRoaXMuX2Fuc3dlcnMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGVjazogXCIgKyB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5jb25maXJtLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbiA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNvbmZpcm1cIixcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImNvbmZpcm1hdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmNvbmZpcm0ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb24pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuc3dlci5jb25maXJtYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6aXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5xdWlyZSgpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5xdWlyZVNldHRpbmdzKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUFuc3dlcnMoYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybVNldHRpbmdzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlOiB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMuZm9yY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcmJvc2U6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy52ZXJib3NlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWxlbnQ6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy5zaWxlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpYlBhdGg6IHBhdGguam9pbih0aGlzLl9jbWRJbmZvLnBrZ0RpciwgXCJub2RlX21vZHVsZXNcIiwgXCJjZHAtbGliXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb25maWcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1iYXNlLnRzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpbnF1aXJlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiaW5xdWlyZXJcIixcImNvbW1vbmpzMlwiOlwiaW5xdWlyZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtcclxuICAgIGRlZmF1bHQgYXMgQ0RQTGliLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIENvbW1hbmRQYXJzZXIsXHJcbiAgICBJQ29tbWFuZExpbmVJbmZvLFxyXG59IGZyb20gXCIuL2NvbW1hbmQtcGFyc2VyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRMaWJyYXJ5LFxyXG59IGZyb20gXCIuL3Byb21wdC1saWJyYXJ5XCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRNb2JpbGVBcHAsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LW1vYmlsZVwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0RGVza3RvcEFwcCxcclxufSBmcm9tIFwiLi9wcm9tcHQtZGVza3RvcFwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0V2ViQXBwLFxyXG59IGZyb20gXCIuL3Byb21wdC13ZWJcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG5mdW5jdGlvbiBnZXRJbnF1aXJlcihjbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvKTogUHJvbXB0QmFzZSB7XHJcbiAgICBzd2l0Y2ggKGNtZEluZm8uYWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChjbWRJbmZvLmFjdGlvbiArIFwiIGNvbW1hbmQ6IHVuZGVyIGNvbnN0cnVjdGlvbi5cIikpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChjbWRJbmZvLnRhcmdldCkge1xyXG4gICAgICAgIGNhc2UgXCJsaWJyYXJ5XCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0TGlicmFyeSgpO1xyXG4gICAgICAgIGNhc2UgXCJtb2JpbGVcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRNb2JpbGVBcHAoKTtcclxuICAgICAgICBjYXNlIFwiZGVza3RvcFwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdERlc2t0b3BBcHAoKTtcclxuICAgICAgICBjYXNlIFwid2ViXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0V2ViQXBwKCk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJ1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgY21kSW5mby50YXJnZXQpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIHByb2Nlc3MudGl0bGUgPSBcImNkcFwiO1xyXG4gICAgY29uc3QgY21kSW5mbyA9IENvbW1hbmRQYXJzZXIucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuICAgIGNvbnN0IGlucXVpcmVyID0gZ2V0SW5xdWlyZXIoY21kSW5mbyk7XHJcblxyXG4gICAgaW5xdWlyZXIucHJvbXB0aW5nKGNtZEluZm8pXHJcbiAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjbWRJbmZvLmNsaU9wdGlvbnMuY29uZmlnKTtcclxuICAgICAgICAgICAgLy8gZXhlY3V0ZVxyXG4gICAgICAgICAgICBDRFBMaWIuZXhlY3V0ZShjb25maWcpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoXCJzdHJpbmdcIiAhPT0gdHlwZW9mIHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgcmVhc29uID0gSlNPTi5zdHJpbmdpZnkocmVhc29uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChyZWFzb24pKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgLy8gTk9URTogZXM2IHByb21pc2UncyBhbHdheXMgYmxvY2suXHJcbiAgICAgICAgfSk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9jZHAtY2xpLnRzIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBjb21tYW5kZXIgZnJvbSBcImNvbW1hbmRlclwiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCJjZHAtbGliXCI7XHJcblxyXG5jb25zdCBmcyAgICA9IFV0aWxzLmZzO1xyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lT3B0aW9uc1xyXG4gKiBAYnJpZWYgICAgIOOCs+ODnuODs+ODieODqeOCpOODs+eUqOOCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQ29tbWFuZExpbmVPcHRpb25zIHtcclxuICAgIGZvcmNlOiBib29sZWFuOyAgICAgLy8g44Ko44Op44O857aZ57aa55SoXHJcbiAgICB0YXJnZXRkaXI6IHN0cmluZzsgIC8vIOS9nOalreODh+OCo+ODrOOCr+ODiOODquaMh+WumlxyXG4gICAgY29uZmlnOiBzdHJpbmc7ICAgICAvLyDjgrPjg7Pjg5XjgqPjgrDjg5XjgqHjgqTjg6vmjIflrppcclxuICAgIHZlcmJvc2U6IGJvb2xlYW47ICAgLy8g6Kmz57Sw44Ot44KwXHJcbiAgICBzaWxlbnQ6IGJvb2xlYW47ICAgIC8vIHNpbGVudCBtb2RlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElDb21tYW5kTGluZUluZm9cclxuICogQGJyaWVmICAgICDjgrPjg57jg7Pjg4njg6njgqTjg7Pmg4XloLHmoLzntI3jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lSW5mbyB7XHJcbiAgICBwa2dEaXI6IHN0cmluZzsgICAgICAgICAgICAgICAgICAgICAvLyBDTEkg44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44OqXHJcbiAgICBhY3Rpb246IHN0cmluZzsgICAgICAgICAgICAgICAgICAgICAvLyDjgqLjgq/jgrfjg6fjg7PlrprmlbBcclxuICAgIHRhcmdldDogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCs+ODnuODs+ODieOCv+ODvOOCsuODg+ODiFxyXG4gICAgaW5zdGFsbGVkRGlyOiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8gQ0xJIOOCpOODs+OCueODiOODvOODq1xyXG4gICAgY2xpT3B0aW9uczogSUNvbW1hbmRMaW5lT3B0aW9uczsgICAgLy8g44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gn5rih44GV44KM44Gf44Kq44OX44K344On44OzXHJcbn1cclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4vKipcclxuICogQGNsYXNzIENvbW1hbmRQYXJzZXJcclxuICogQGJyaWVmIOOCs+ODnuODs+ODieODqeOCpOODs+ODkeODvOOCteODvFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbW1hbmRQYXJzZXIge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODnuODs+ODieODqeOCpOODs+OBruODkeODvOOCuVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gYXJndiAgICAgICDlvJXmlbDjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gW29wdGlvbnNdICDjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAqIEByZXR1cm5zIHtJQ29tbWFuZExpbmVJbmZvfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHBhcnNlKGFyZ3Y6IHN0cmluZ1tdLCBvcHRpb25zPzogYW55KTogSUNvbW1hbmRMaW5lSW5mbyB7XHJcbiAgICAgICAgY29uc3QgY21kbGluZSA9IDxJQ29tbWFuZExpbmVJbmZvPntcclxuICAgICAgICAgICAgcGtnRGlyOiB0aGlzLmdldFBhY2thZ2VEaXJlY3RvcnkoYXJndiksXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBwa2cgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oY21kbGluZS5wa2dEaXIsIFwicGFja2FnZS5qc29uXCIpLCBcInV0ZjhcIikudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAudmVyc2lvbihwa2cudmVyc2lvbilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1mLCAtLWZvcmNlXCIsIFwiQ29udGludWUgZXhlY3V0aW9uIGV2ZW4gaWYgaW4gZXJyb3Igc2l0dWF0aW9uXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItdCwgLS10YXJnZXRkaXIgPHBhdGg+XCIsIFwiU3BlY2lmeSBwcm9qZWN0IHRhcmdldCBkaXJlY3RvcnlcIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1jLCAtLWNvbmZpZyA8cGF0aD5cIiwgXCJTcGVjaWZ5IGNvbmZpZyBmaWxlIHBhdGhcIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi12LCAtLXZlcmJvc2VcIiwgXCJTaG93IGRlYnVnIG1lc3NhZ2VzLlwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXMsIC0tc2lsZW50XCIsIFwiUnVuIGFzIHNpbGVudCBtb2RlLlwiKVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiaW5pdFwiKVxyXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJpbml0IHByb2plY3RcIilcclxuICAgICAgICAgICAgLmFjdGlvbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjbWRsaW5lLmFjdGlvbiA9IFwiaW5pdFwiO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCItLWhlbHBcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgIEV4YW1wbGVzOlwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGluaXRcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCJjcmVhdGUgPHRhcmdldD5cIilcclxuICAgICAgICAgICAgLmRlc2NyaXB0aW9uKFwiY3JlYXRlIGJvaWxlcnBsYXRlIGZvciAnbGlicmFyeSwgbW9kdWxlJyB8ICdtb2JpbGUsIGFwcCcgfCAnZGVza3RvcCcgfCAnd2ViJ1wiKVxyXG4gICAgICAgICAgICAuYWN0aW9uKCh0YXJnZXQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKC9eKG1vZHVsZXxhcHB8bGlicmFyeXxtb2JpbGV8ZGVza3RvcHx3ZWIpJC9pLnRlc3QodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZGxpbmUuYWN0aW9uID0gXCJjcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJtb2R1bGVcIiA9PT0gY21kbGluZS50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSBcImxpYnJhcnlcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiYXBwXCIgPT09IGNtZGxpbmUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gXCJtb2JpbGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZC51bmRlcmxpbmUoXCIgIHVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyB0YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIi0taGVscFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgRXhhbXBsZXM6XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIGxpYnJhcnlcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIG1vYmlsZVwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgYXBwIC1jIHNldHRpbmcuanNvblwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcIipcIiwgbnVsbCwgeyBub0hlbHA6IHRydWUgfSlcclxuICAgICAgICAgICAgLmFjdGlvbigoY21kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQudW5kZXJsaW5lKFwiICB1bnN1cHBvcnRlZCBjb21tYW5kOiBcIiArIGNtZCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyLnBhcnNlKGFyZ3YpO1xyXG5cclxuICAgICAgICBpZiAoYXJndi5sZW5ndGggPD0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbWRsaW5lLmNsaU9wdGlvbnMgPSB0aGlzLnRvQ29tbWFuZExpbmVPcHRpb25zKGNvbW1hbmRlcik7XHJcblxyXG4gICAgICAgIHJldHVybiBjbWRsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcml2YXRlIHN0YXRpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDTEkg44Gu44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44Oq44KS5Y+W5b6XXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nW119IGFyZ3Yg5byV5pWwXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYWNrYWdlRGlyZWN0b3J5KGFyZ3Y6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBleGVjRGlyID0gcGF0aC5kaXJuYW1lKGFyZ3ZbMV0pO1xyXG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oZXhlY0RpciwgXCIuLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENMSSBvcHRpb24g44KSIElDb21tYW5kTGluZU9wdGlvbnMg44Gr5aSJ5o+bXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBjb21tYW5kZXIgcGFyc2Ug5riI44G/IGNvbWFubmRlciDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAqIEByZXR1cm4ge0lDb21tYW5kTGluZU9wdGlvbnN9IG9wdGlvbiDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdG9Db21tYW5kTGluZU9wdGlvbnMoY29tbWFuZGVyOiBhbnkpOiBJQ29tbWFuZExpbmVPcHRpb25zIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmb3JjZTogISFjb21tYW5kZXIuZm9yY2UsXHJcbiAgICAgICAgICAgIHRhcmdldGRpcjogY29tbWFuZGVyLnRhcmdldGRpcixcclxuICAgICAgICAgICAgY29uZmlnOiBjb21tYW5kZXIuY29uZmlnLFxyXG4gICAgICAgICAgICB2ZXJib3NlOiAhIWNvbW1hbmRlci52ZXJib3NlLFxyXG4gICAgICAgICAgICBzaWxlbnQ6ICEhY29tbWFuZGVyLnNpbGVudCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OY44Or44OX6KGo56S644GX44Gm57WC5LqGXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHNob3dIZWxwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGluZm9ybSA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoYWxrLmdyZWVuKHRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29tbWFuZGVyLm91dHB1dEhlbHAoPGFueT5pbmZvcm0pO1xyXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NvbW1hbmQtcGFyc2VyLnRzIiwiaW1wb3J0IHtcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgSU1vYmlsZUFwcENvbmZpZ3JhdGlvbixcclxuICAgIElEZXNrdG9wQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgSVdlYkFwcENvbmZpZ3JhdGlvbixcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uQnJvd3NlciA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUNvbXBpbGVDb25maWdyYXRpb25cclxuICAgIHRzVHJhbnNwaWxlVGFyZ2V0OiBcImVzNVwiLFxyXG4gICAgbW9kdWxlU3lzdGVtOiBcInVtZFwiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJ3ZWJcIixcclxuICAgIHN1cHBvcnRDU1M6IGZhbHNlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5vZGUuanMg55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25Ob2RlID0gPElMaWJyYXJ5Q29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0S2luZDogXCJsaWJyYXJ5XCIsXHJcbiAgICAvLyBJQ29tcGlsZUNvbmZpZ3JhdGlvblxyXG4gICAgdHNUcmFuc3BpbGVUYXJnZXQ6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGVTeXN0ZW06IFwiY29tbW9uanNcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwibm9kZVwiLFxyXG4gICAgc3VwcG9ydENTUzogZmFsc2UsXHJcbn07XHJcblxyXG4vKipcclxuICogZWxlY3Ryb24g55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25FbGVjdHJvbiA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUNvbXBpbGVDb25maWdyYXRpb25cclxuICAgIHRzVHJhbnNwaWxlVGFyZ2V0OiBcImVzMjAxNVwiLFxyXG4gICAgbW9kdWxlU3lzdGVtOiBcImNvbW1vbmpzXCIsXHJcbiAgICB3ZWJwYWNrVGFyZ2V0OiBcImVsZWN0cm9uXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiBmYWxzZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrYoY29yZG92YSnnkrDlooPjgafli5XkvZzjgZnjgovjg6Ljg5DjgqTjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IG1vYmlsZU9uQnJvd3NlciA9IDxJTW9iaWxlQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0S2luZDogXCJtb2JpbGVcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJhbWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiB0cnVlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODh+OCueOCr+ODiOODg+ODl+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgZGVza3RvcE9uQnJvd3NlciA9IDxJRGVza3RvcEFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwiZGVza3RvcFwiLFxyXG4gICAgLy8gSUNvbXBpbGVDb25maWdyYXRpb25cclxuICAgIHRzVHJhbnNwaWxlVGFyZ2V0OiBcImVzNVwiLFxyXG4gICAgbW9kdWxlU3lzdGVtOiBcImFtZFwiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJ3ZWJcIixcclxuICAgIHN1cHBvcnRDU1M6IHRydWUsXHJcbn07XHJcblxyXG4vKipcclxuICogIGVsZWN0cm9uIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODh+OCueOCr+ODiOODg+ODl+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgZGVza3RvcE9uRWxlY3Ryb24gPSA8SURlc2t0b3BBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RLaW5kOiBcImRlc2t0b3BcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczIwMTVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJjb21tb25qc1wiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJlbGVjdHJvbi1yZW5kZXJlclwiLFxyXG4gICAgc3VwcG9ydENTUzogdHJ1ZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjgqbjgqfjg5bjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IHdlYk9uQnJvd3NlciA9IDxJV2ViQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0S2luZDogXCJ3ZWJcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICB0c1RyYW5zcGlsZVRhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJhbWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiB0cnVlLFxyXG59O1xyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGxpYnJhcnk6IHtcclxuICAgICAgICBicm93c2VyOiBsaWJyYXJ5T25Ccm93c2VyLFxyXG4gICAgICAgIG5vZGU6IGxpYnJhcnlPbk5vZGUsXHJcbiAgICAgICAgZWxlY3Ryb246IGxpYnJhcnlPbkVsZWN0cm9uLFxyXG4gICAgICAgIEVMRUNUUk9OX0FWQUlMQUJMRTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbW9iaWxlOiB7XHJcbiAgICAgICAgYnJvd3NlcjogbW9iaWxlT25Ccm93c2VyLFxyXG4gICAgfSxcclxuICAgIGRlc2N0b3A6IHtcclxuICAgICAgICBicm93c2VyOiBkZXNrdG9wT25Ccm93c2VyLFxyXG4gICAgICAgIGVsZWN0cm9uOiBkZXNrdG9wT25FbGVjdHJvbixcclxuICAgIH0sXHJcbiAgICB3ZWI6IHtcclxuICAgICAgICBicm93c2VyOiB3ZWJPbkJyb3dzZXIsXHJcbiAgICB9LFxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2RlZmF1bHQtY29uZmlnLnRzIiwiLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcblxyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSURlc2t0b3BBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdERlc2t0b3BBcHBcclxuICogQGJyaWVmIOODh+OCueOCr+ODiOODg+ODl+OCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdERlc2t0b3BBcHAgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCqOODs+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IGFueSk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoXCJkZXNrdG9wIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIC8vIFRPRE86IHNob3dcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1kZXNrdG9wLnRzIiwiaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gXCIuL2RlZmF1bHQtY29uZmlnXCI7XHJcblxyXG5jb25zdCAkICAgICAgICAgICAgID0gVXRpbHMuJDtcclxuY29uc3QgY2hhbGsgICAgICAgICA9IFV0aWxzLmNoYWxrO1xyXG5jb25zdCBzZW12ZXJSZWdleCAgID0gVXRpbHMuc2VtdmVyUmVnZXg7XHJcbmNvbnN0IGxpYkNvbmZpZyA9IGRlZmF1bHRDb25maWcubGlicmFyeTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0TGlicmFyeVxyXG4gKiBAYnJpZWYg44Op44Kk44OW44Op44Oq44Oi44K444Ol44O844Or55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0TGlicmFyeSBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgLy8gcHJvamVjdCBjb21tb24gc2V0dG5pZ3MgKElQcm9qZWN0Q29uZmlncmF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInByb2plY3ROYW1lXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnByb2plY3ROYW1lIHx8IFwiQ29vbFByb2plY3ROYW1lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwidmVyc2lvblwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnZlcnNpb24gfHwgXCIwLjAuMVwiLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VtdmVyUmVnZXgoKS5leGVjKHZhbHVlKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibGljZW5zZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLmFwYWNoZTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkFwYWNoZS0yLjBcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLm1pdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTUlUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5wcm9wcmlldGFyeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTk9ORVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubGljZW5zZSB8fCBcIk5PTkVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoSUNvbXBpbGVDb25maWdyYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJ3ZWJwYWNrVGFyZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmxpYnJhcnkud2VicGFja1RhcmdldC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ud2VicGFja1RhcmdldC5jaG9pY2VzLmJyb3dzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIndlYlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi53ZWJwYWNrVGFyZ2V0LmNob2ljZXMubm9kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9kZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ud2VicGFja1RhcmdldC5jaG9pY2VzLmVsZWN0cm9uICsgdGhpcy5MSU1JVEFUSU9OKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVsZWN0cm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLndlYnBhY2tUYXJnZXQuY2hvaWNlcy5lbGVjdHJvblJlbmRlcmVyICsgdGhpcy5MSU1JVEFUSU9OKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVsZWN0cm9uLXJlbmRlcmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpYkNvbmZpZy5FTEVDVFJPTl9BVkFJTEFCTEUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJlbGVjdHJvblwiID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJub2RlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImVsZWN0cm9uLXJlbmRlcmVyXCIgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIndlYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLndlYnBhY2tUYXJnZXQgfHwgXCJ3ZWJcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gYmFzZSBzdHJ1Y3R1cmVcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImJhc2VTdHJ1Y3R1cmVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmJhc2VTdHJ1Y3R1cmUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmJhc2VTdHJ1Y3R1cmUuY2hvaWNlcy5yZWNvbW1lbmRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwicmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uYmFzZVN0cnVjdHVyZS5jaG9pY2VzLmN1c3RvbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY3VzdG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuYmFzZVN0cnVjdHVyZSB8fCBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKGN1c3RvbTogbW9kdWxlU3lzdGVtKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibW9kdWxlU3lzdGVtXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLm5vbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMuY29tbW9uanMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoXCJhbWRcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSB8fCBcImNvbW1vbmpzXCIpIDogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5iYXNlU3RydWN0dXJlICYmIC9eKG5vZGV8ZWxlY3Ryb24pJC9pLnRlc3QoYW5zd2Vycy53ZWJwYWNrVGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVTeXN0ZW1cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMubm9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5hbWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImFtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKFwiY29tbW9uanNcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSB8fCBcImFtZFwiKSA6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmJhc2VTdHJ1Y3R1cmUgJiYgXCJ3ZWJcIiA9PT0gYW5zd2Vycy53ZWJwYWNrVGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZHVsZVN5c3RlbVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5ub25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLmNvbW1vbmpzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5hbWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImFtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLm1vZHVsZVN5c3RlbSB8fCBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmJhc2VTdHJ1Y3R1cmUgJiYgXCJlbGVjdHJvbi1yZW5kZXJlclwiID09PSBhbnN3ZXJzLndlYnBhY2tUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IHRzVHJhbnNwaWxlVGFyZ2V0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwidHNUcmFuc3BpbGVUYXJnZXRcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnRzVHJhbnNwaWxlVGFyZ2V0Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi50c1RyYW5zcGlsZVRhcmdldC5jaG9pY2VzLmVzNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXM1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnRzVHJhbnNwaWxlVGFyZ2V0LmNob2ljZXMuZXMyMDE1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlczIwMTVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy50c1RyYW5zcGlsZVRhcmdldCB8fCAoXCJ3ZWJcIiA9PT0gdGhpcy5hbnN3ZXJzLndlYnBhY2tUYXJnZXQgPyBcImVzNVwiIDogXCJlczIwMTVcIiksXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmJhc2VTdHJ1Y3R1cmU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IHN1cHBvcnRDU1MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY29uZmlybVwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJzdXBwb3J0Q1NTXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmxpYnJhcnkuc3VwcG9ydENTUy5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnN1cHBvcnRDU1MgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmJhc2VTdHJ1Y3R1cmU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICBjb25zdCBjb25maWc6IElMaWJyYXJ5Q29uZmlncmF0aW9uID0gKCgpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChhbnN3ZXJzLndlYnBhY2tUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ3ZWJcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5icm93c2VyLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJub2RlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcubm9kZSwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWxlY3Ryb25cIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5lbGVjdHJvbiwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWxlY3Ryb24tcmVuZGVyZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5lbGVjdHJvbiwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwidW5zdXBwb3J0ZWQgdGFyZ2V0OiBcIiArIGFuc3dlcnMud2VicGFja1RhcmdldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW1xyXG4gICAgICAgICAgICB7IG5hbWU6IFwiYmFzZVN0cnVjdHVyZVwiLCAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwicHJvamVjdE5hbWVcIiwgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwidmVyc2lvblwiLCAgICAgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwibGljZW5zZVwiLCAgICAgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwid2VicGFja1RhcmdldFwiLCAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwibW9kdWxlU3lzdGVtXCIsICAgICAgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwidHNUcmFuc3BpbGVUYXJnZXRcIiwgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwic3VwcG9ydENTU1wiLCAgICAgICAgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gKGl0ZW0ucmVjb21tZW5kICYmIFwicmVjb21tZW5kZWRcIiA9PT0gYW5zd2Vycy5iYXNlU3RydWN0dXJlKSA/IFwieWVsbG93XCIgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbmZpZzJkZXNjcmlwdGlvbihjb25maWcsIGl0ZW0ubmFtZSwgY29sb3IpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvciwgbnVsbCwgNCkpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzOlxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZWxlY3Ryb24g44GM5pyJ5Yq55Ye644Gq44GE5aC05ZCI44Gu6KOc6Laz5paH5a2X44KS5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgTElNSVRBVElPTigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBsaWJDb25maWcuRUxFQ1RST05fQVZBSUxBQkxFID8gXCJcIiA6IFwiIFwiICsgdGhpcy5sYW5nLnByb21wdC5jb21tb24uc3RpbE5vdEF2YWlsYWJsZTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1saWJyYXJ5LnRzIiwiLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcblxyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSU1vYmlsZUFwcENvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5cclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0TW9iaWxlQXBwXHJcbiAqIEBicmllZiDjg6Ljg5DjgqTjg6vjgqLjg5fjg6rnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHRNb2JpbGVBcHAgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCqOODs+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IGFueSk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoXCJtb2JpbGUgYXBwIHByb21wdGluZywgdW5kZXIgY29uc3RydWN0aW9uLlwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIC8vIFRPRE86XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a44Gu56K66KqNXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7SUFuc3dlclNjaGVtYX0gYW5zd2VycyDlm57nrZTntZDmnpxcclxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlncmF0aW9ufSDoqK3lrprlgKTjgpLov5TljbRcclxuICAgICAqL1xyXG4gICAgZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpOiBJUHJvamVjdENvbmZpZ3JhdGlvbiB7XHJcbiAgICAgICAgLy8gVE9ETzogc2hvd1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LW1vYmlsZS50cyIsIi8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElXZWJBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdFdlYkFwcFxyXG4gKiBAYnJpZWYg44Km44Kn44OW44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0V2ViQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KFwid2ViIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIC8vIFRPRE86IHNob3dcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC13ZWIudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21tYW5kZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdfQ==
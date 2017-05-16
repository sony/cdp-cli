/*!
 * cdp-cli.js 0.0.2
 *
 * Date: 2017-05-16T02:11:00.474Z
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
        try {
            this._locale = JSON.parse(fs.readFileSync(path.join(this._cmdInfo.pkgDir, "res/locales/messages." + locale + ".json"), "utf8").toString());
        }
        catch (error) {
            throw Error("Language resource JSON parse error" + error.message);
        }
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
            if (null != reason.message) {
                reason = reason.message;
            }
            else {
                reason = JSON.stringify(reason);
            }
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
        let pkg;
        try {
            pkg = JSON.parse(fs.readFileSync(path.join(cmdline.pkgDir, "package.json"), "utf8").toString());
        }
        catch (error) {
            throw Error("package.json parse error" + error.message);
        }
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
    esTarget: "es5",
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
    esTarget: "es2015",
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
    esTarget: "es2015",
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
    esTarget: "es5",
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
    esTarget: "es5",
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
    esTarget: "es2015",
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
    esTarget: "es5",
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
            // library settnigs (custom: esTarget)
            {
                type: "list",
                name: "esTarget",
                message: this.lang.prompt.common.esTarget.message,
                choices: [
                    {
                        name: this.lang.prompt.common.esTarget.choices.es5,
                        value: "es5",
                    },
                    {
                        name: this.lang.prompt.common.esTarget.choices.es2015,
                        value: "es2015",
                    },
                ],
                default: this.answers.esTarget || ("web" === this.answers.webpackTarget ? "es5" : "es2015"),
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
            { name: "esTarget", recommend: true },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGZkMGI3OTc3N2YyMDk5MmI3ZjAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9IiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWJhc2UudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifSIsImNkcDovLy9jZHAtY2xpL2NkcC1jbGkudHMiLCJjZHA6Ly8vY2RwLWNsaS9jb21tYW5kLXBhcnNlci50cyIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWRlc2t0b3AudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtbGlicmFyeS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1tb2JpbGUudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtd2ViLnRzIiwid2VicGFjazovLy9leHRlcm5hbC8ge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlD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QUMsT0FBWTtRQUN6QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixNQUFNLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCx1RUFBdUU7SUFDdkUsOEJBQThCO0lBRTlCOztPQUVHO0lBQ0gsSUFBSSxTQUFTO1FBQ1QsUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCx3QkFBd0IsQ0FBQyxPQUFzQjtRQUMzQyxhQUFhO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFuQ0Qsb0NBbUNDOzs7Ozs7O0FDdkRELHNDIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNGZkMGI3OTc3N2YyMDk5MmI3ZjAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjZHAtbGliXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn1cbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSUNvbXBpbGVDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQgeyBJQ29tbWFuZExpbmVJbmZvIH0gZnJvbSBcIi4vY29tbWFuZC1wYXJzZXJcIjtcclxuXHJcbmNvbnN0IGZzICAgID0gVXRpbHMuZnM7XHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcbmNvbnN0IF8gICAgID0gVXRpbHMuXztcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElBbnN3ZXJTY2hlbWFcclxuICogQGJyaWVmIEFuc3dlciDjgqrjg5bjgrjjgqfjgq/jg4jjga7jgrnjgq3jg7zjg57lrprnvqnjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFuc3dlclNjaGVtYVxyXG4gICAgZXh0ZW5kcyBpbnF1aXJlci5BbnN3ZXJzLCBJUHJvamVjdENvbmZpZ3JhdGlvbiwgSUNvbXBpbGVDb25maWdyYXRpb24ge1xyXG4gICAgLy8g5YWx6YCa5ouh5by15a6a576pXHJcbiAgICBleHRyYVNldHRpbmdzOiBcInJlY29tbWVuZGVkXCIgfCBcImN1c3RvbVwiO1xyXG59XHJcblxyXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRCYXNlXHJcbiAqIEBicmllZiBQcm9tcHQg44Gu44OZ44O844K544Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbztcclxuICAgIHByaXZhdGUgX2Fuc3dlcnMgPSA8SUFuc3dlclNjaGVtYT57fTtcclxuICAgIHByaXZhdGUgX2xvY2FsZSA9IHt9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbyk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICB0aGlzLl9jbWRJbmZvID0gY21kSW5mbztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQcm9sb2d1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmlucXVpcmVMYW5ndWFnZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5xdWlyZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChzZXR0aW5nczogSVByb2plY3RDb25maWdyYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpa2UgY293c2F5XHJcbiAgICAgKiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db3dzYXlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNheShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBHUkVFVElORyA9XHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICAgIFwiICsgY2hhbGsuY3lhbihcIuKIp++8v+KIp1wiKSArIFwiICAgIO+8j++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iCDCtOKIgO+9gO+8iVwiKSArIFwi77ycICBcIiArIGNoYWxrLnllbGxvdyhtZXNzYWdlKSArXHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICBcIiArIGNoYWxrLmN5YW4oXCLvvIggIOOBpFwiKSArIFwi77ydXCIgKyBjaGFsay5jeWFuKFwi44GkXCIpICsgXCIgIO+8vO+8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhICBcIiArIGNoYWxrLmN5YW4oXCLvvZwg772cIHxcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iF/vvL/vvInvvL/vvIlcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gIOKJoSAgIFwiICsgY2hhbGsucmVkKFwi4peOXCIpICsgXCLvv6Pvv6Pvv6Pvv6NcIiArIGNoYWxrLnJlZChcIuKXjlwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhHUkVFVElORyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg63jg7zjgqvjg6njgqTjgrrjg6rjgr3jg7zjgrnjgavjgqLjgq/jgrvjgrlcclxuICAgICAqIGV4KSB0aGlzLmxhbmcucHJvbXB0LnByb2plY3ROYW1lLm1lc3NhZ2VcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOODquOCveODvOOCueOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGxhbmcoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgYWJzdHJhY3QgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBhYnN0cmFjdCBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6a5YCk44Gr44Ki44Kv44K744K5XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBnZXQgYW5zd2VycygpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYW5zd2VycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb2xvZ3VlIOOCs+ODoeODs+ODiOOBruioreWumlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHByb2xvZ3VlQ29tbWVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIldlbGNvbWUgdG8gQ0RQIEJvaWxlcnBsYXRlIEdlbmVyYXRvciFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlbGNvbWUg6KGo56S6XHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzaG93UHJvbG9ndWUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpKTtcclxuICAgICAgICB0aGlzLnNheSh0aGlzLnByb2xvZ3VlQ29tbWVudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIIOOBruabtOaWsFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlQW5zd2Vycyh1cGRhdGU6IElBbnN3ZXJTY2hlbWEpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gXy5tZXJnZSh0aGlzLl9hbnN3ZXJzLCB1cGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6aXHJcbiAgICAgKiDliIblspDjgYzlv4XopoHjgarloLTlkIjjga/jgqrjg7zjg5Djg7zjg6njgqTjg4njgZnjgovjgZPjgahcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGlucXVpcmVTZXR0aW5ncygpOiBQcm9taXNlPElBbnN3ZXJTY2hlbWE+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQodGhpcy5xdWVzdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXR0aW5nIOOBi+OCiSDoqK3lrproqqzmmI7jga7kvZzmiJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZyDoqK3lrppcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaXRlbU5hbWUg6Kit5a6a6aCF55uu5ZCNXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOiqrOaYjuaWh1xyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29uZmlnMmRlc2NyaXB0aW9uKGNvbmZpZzogT2JqZWN0LCBpdGVtTmFtZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nID0gXCJjeWFuXCIpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmxhbmcuc2V0dGluZ3NbaXRlbU5hbWVdO1xyXG4gICAgICAgIGlmIChudWxsID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvci4gaXRlbSBub3QgZm91bmQuIGl0ZW0gbmFtZTogXCIgKyBpdGVtTmFtZSkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwcm9wOiBzdHJpbmcgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9wcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucHJvcHNbY29uZmlnW2l0ZW1OYW1lXV07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJib29sZWFuXCIgPT09IHR5cGVvZiBjb25maWdbaXRlbU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5ib29sW2NvbmZpZ1tpdGVtTmFtZV0gPyBcInllc1wiIDogXCJub1wiXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWdbaXRlbU5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgKyBjaGFsa1tjb2xvcl0ocHJvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844Kr44Op44Kk44K644Oq44K944O844K544Gu44Ot44O844OJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZExhbmd1YWdlKGxvY2FsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoXHJcbiAgICAgICAgICAgICAgICBwYXRoLmpvaW4odGhpcy5fY21kSW5mby5wa2dEaXIsIFwicmVzL2xvY2FsZXMvbWVzc2FnZXMuXCIgKyBsb2NhbGUgKyBcIi5qc29uXCIpLCBcInV0ZjhcIikudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiTGFuZ3VhZ2UgcmVzb3VyY2UgSlNPTiBwYXJzZSBlcnJvclwiICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6KiA6Kqe6YG45oqeXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5xdWlyZUxhbmd1YWdlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwibGFuZ3VhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlBsZWFzZSBjaG9vc2UgeW91ciBwcmVmZXJyZWQgbGFuZ3VhZ2UuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkVuZ2xpc2gv6Iux6KqeXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlbi1VU1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkphcGFuZXNlL+aXpeacrOiqnlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiamEtSlBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgaW5xdWlyZXIucHJvbXB0KHF1ZXN0aW9uKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZExhbmd1YWdlKGFuc3dlci5sYW5ndWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6a56K66KqNXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY29uZmlybVNldHRpbmdzKCk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLmRpc3BsYXlTZXR0aW5nc0J5QW5zd2Vycyh0aGlzLl9hbnN3ZXJzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2hlY2s6IFwiICsgdGhpcy5sYW5nLnByb21wdC5jb21tb24uY29uZmlybS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjb25maXJtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJjb25maXJtYXRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5jb25maXJtLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgaW5xdWlyZXIucHJvbXB0KHF1ZXN0aW9uKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbnN3ZXIuY29uZmlybWF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOioreWumlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlucXVpcmUoKTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucXVpcmVTZXR0aW5ncygpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVBbnN3ZXJzKGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpcm1TZXR0aW5ncygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoY29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmFjdGlvbiA9IHRoaXMuX2NtZEluZm8uYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5zZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2U6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy5mb3JjZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyYm9zZTogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnZlcmJvc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbGVudDogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnNpbGVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGliUGF0aDogcGF0aC5qb2luKHRoaXMuX2NtZEluZm8ucGtnRGlyLCBcIm5vZGVfbW9kdWxlc1wiLCBcImNkcC1saWJcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldERpcjogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnRhcmdldERpcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFuZzogdGhpcy5sYW5nLnR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHByb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHByb2MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LWJhc2UudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicGF0aFwiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImlucXVpcmVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifVxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge1xyXG4gICAgZGVmYXVsdCBhcyBDRFBMaWIsXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgQ29tbWFuZFBhcnNlcixcclxuICAgIElDb21tYW5kTGluZUluZm8sXHJcbn0gZnJvbSBcIi4vY29tbWFuZC1wYXJzZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdExpYnJhcnksXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWxpYnJhcnlcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdE1vYmlsZUFwcCxcclxufSBmcm9tIFwiLi9wcm9tcHQtbW9iaWxlXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHREZXNrdG9wQXBwLFxyXG59IGZyb20gXCIuL3Byb21wdC1kZXNrdG9wXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRXZWJBcHAsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LXdlYlwiO1xyXG5cclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbmZ1bmN0aW9uIGdldElucXVpcmVyKGNtZEluZm86IElDb21tYW5kTGluZUluZm8pOiBQcm9tcHRCYXNlIHtcclxuICAgIHN3aXRjaCAoY21kSW5mby5hY3Rpb24pIHtcclxuICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKGNtZEluZm8uYWN0aW9uICsgXCIgY29tbWFuZDogdW5kZXIgY29uc3RydWN0aW9uLlwiKSk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKGNtZEluZm8udGFyZ2V0KSB7XHJcbiAgICAgICAgY2FzZSBcImxpYnJhcnlcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRMaWJyYXJ5KCk7XHJcbiAgICAgICAgY2FzZSBcIm1vYmlsZVwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdE1vYmlsZUFwcCgpO1xyXG4gICAgICAgIGNhc2UgXCJkZXNrdG9wXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0RGVza3RvcEFwcCgpO1xyXG4gICAgICAgIGNhc2UgXCJ3ZWJcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRXZWJBcHAoKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcInVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyBjbWRJbmZvLnRhcmdldCkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWluKCkge1xyXG4gICAgcHJvY2Vzcy50aXRsZSA9IFwiY2RwXCI7XHJcbiAgICBjb25zdCBjbWRJbmZvID0gQ29tbWFuZFBhcnNlci5wYXJzZShwcm9jZXNzLmFyZ3YpO1xyXG4gICAgY29uc3QgaW5xdWlyZXIgPSBnZXRJbnF1aXJlcihjbWRJbmZvKTtcclxuXHJcbiAgICBpbnF1aXJlci5wcm9tcHRpbmcoY21kSW5mbylcclxuICAgICAgICAudGhlbigoY29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGV4ZWN1dGVcclxuICAgICAgICAgICAgcmV0dXJuIENEUExpYi5leGVjdXRlKGNvbmZpZyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKGlucXVpcmVyLmxhbmcuZmluaXNoZWRbY21kSW5mby5hY3Rpb25dKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChcInN0cmluZ1wiICE9PSB0eXBlb2YgcmVhc29uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSByZWFzb24ubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbiA9IHJlYXNvbi5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb24gPSBKU09OLnN0cmluZ2lmeShyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKHJlYXNvbikpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBOT1RFOiBlczYgcHJvbWlzZSdzIGFsd2F5cyBibG9jay5cclxuICAgICAgICB9KTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NkcC1jbGkudHMiLCJpbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCAqIGFzIGNvbW1hbmRlciBmcm9tIFwiY29tbWFuZGVyXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcImNkcC1saWJcIjtcclxuXHJcbmNvbnN0IGZzICAgID0gVXRpbHMuZnM7XHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJQ29tbWFuZExpbmVPcHRpb25zXHJcbiAqIEBicmllZiAgICAg44Kz44Oe44Oz44OJ44Op44Kk44Oz55So44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElDb21tYW5kTGluZU9wdGlvbnMge1xyXG4gICAgZm9yY2U6IGJvb2xlYW47ICAgICAvLyDjgqjjg6njg7zntpnntprnlKhcclxuICAgIHRhcmdldERpcjogc3RyaW5nOyAgLy8g5L2c5qWt44OH44Kj44Os44Kv44OI44Oq5oyH5a6aXHJcbiAgICBjb25maWc6IHN0cmluZzsgICAgIC8vIOOCs+ODs+ODleOCo+OCsOODleOCoeOCpOODq+aMh+WumlxyXG4gICAgdmVyYm9zZTogYm9vbGVhbjsgICAvLyDoqbPntLDjg63jgrBcclxuICAgIHNpbGVudDogYm9vbGVhbjsgICAgLy8gc2lsZW50IG1vZGVcclxufVxyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lSW5mb1xyXG4gKiBAYnJpZWYgICAgIOOCs+ODnuODs+ODieODqeOCpOODs+aDheWgseagvOe0jeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgIHBrZ0Rpcjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIENMSSDjgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6pcclxuICAgIGFjdGlvbjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCouOCr+OCt+ODp+ODs+WumuaVsFxyXG4gICAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgICAgLy8g44Kz44Oe44Oz44OJ44K/44O844Ky44OD44OIXHJcbiAgICBpbnN0YWxsZWREaXI6IHN0cmluZzsgICAgICAgICAgICAgICAvLyBDTEkg44Kk44Oz44K544OI44O844OrXHJcbiAgICBjbGlPcHRpb25zOiBJQ29tbWFuZExpbmVPcHRpb25zOyAgICAvLyDjgrPjg57jg7Pjg4njg6njgqTjg7PjgafmuKHjgZXjgozjgZ/jgqrjg5fjgrfjg6fjg7NcclxufVxyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29tbWFuZFBhcnNlclxyXG4gKiBAYnJpZWYg44Kz44Oe44Oz44OJ44Op44Kk44Oz44OR44O844K144O8XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29tbWFuZFBhcnNlciB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gu44OR44O844K5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBhcmd2ICAgICAgIOW8leaVsOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBbb3B0aW9uc10gIOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMge0lDb21tYW5kTGluZUluZm99XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2UoYXJndjogc3RyaW5nW10sIG9wdGlvbnM/OiBhbnkpOiBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgICAgICBjb25zdCBjbWRsaW5lID0gPElDb21tYW5kTGluZUluZm8+e1xyXG4gICAgICAgICAgICBwa2dEaXI6IHRoaXMuZ2V0UGFja2FnZURpcmVjdG9yeShhcmd2KSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGtnOiBhbnk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHBrZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihjbWRsaW5lLnBrZ0RpciwgXCJwYWNrYWdlLmpzb25cIiksIFwidXRmOFwiKS50b1N0cmluZygpKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcInBhY2thZ2UuanNvbiBwYXJzZSBlcnJvclwiICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLnZlcnNpb24ocGtnLnZlcnNpb24pXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItZiwgLS1mb3JjZVwiLCBcIkNvbnRpbnVlIGV4ZWN1dGlvbiBldmVuIGlmIGluIGVycm9yIHNpdHVhdGlvblwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXQsIC0tdGFyZ2V0ZGlyIDxwYXRoPlwiLCBcIlNwZWNpZnkgcHJvamVjdCB0YXJnZXQgZGlyZWN0b3J5XCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItYywgLS1jb25maWcgPHBhdGg+XCIsIFwiU3BlY2lmeSBjb25maWcgZmlsZSBwYXRoXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItdiwgLS12ZXJib3NlXCIsIFwiU2hvdyBkZWJ1ZyBtZXNzYWdlcy5cIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1zLCAtLXNpbGVudFwiLCBcIlJ1biBhcyBzaWxlbnQgbW9kZS5cIilcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcImluaXRcIilcclxuICAgICAgICAgICAgLmRlc2NyaXB0aW9uKFwiaW5pdCBwcm9qZWN0XCIpXHJcbiAgICAgICAgICAgIC5hY3Rpb24oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY21kbGluZS5hY3Rpb24gPSBcImluaXRcIjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKFwiLS1oZWxwXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICBFeGFtcGxlczpcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBpbml0XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiY3JlYXRlIDx0YXJnZXQ+XCIpXHJcbiAgICAgICAgICAgIC5kZXNjcmlwdGlvbihcImNyZWF0ZSBib2lsZXJwbGF0ZSBmb3IgJ2xpYnJhcnksIG1vZHVsZScgfCAnbW9iaWxlLCBhcHAnIHwgJ2Rlc2t0b3AnIHwgJ3dlYidcIilcclxuICAgICAgICAgICAgLmFjdGlvbigodGFyZ2V0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgvXihtb2R1bGV8YXBwfGxpYnJhcnl8bW9iaWxlfGRlc2t0b3B8d2ViKSQvaS50ZXN0KHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLmFjdGlvbiA9IFwiY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwibW9kdWxlXCIgPT09IGNtZGxpbmUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gXCJsaWJyYXJ5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImFwcFwiID09PSBjbWRsaW5lLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLnRhcmdldCA9IFwibW9iaWxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQudW5kZXJsaW5lKFwiICB1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgdGFyZ2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCItLWhlbHBcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgIEV4YW1wbGVzOlwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBsaWJyYXJ5XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBtb2JpbGVcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIGFwcCAtYyBzZXR0aW5nLmpzb25cIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCIqXCIsIG51bGwsIHsgbm9IZWxwOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIC5hY3Rpb24oKGNtZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkLnVuZGVybGluZShcIiAgdW5zdXBwb3J0ZWQgY29tbWFuZDogXCIgKyBjbWQpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlci5wYXJzZShhcmd2KTtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3YubGVuZ3RoIDw9IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY21kbGluZS5jbGlPcHRpb25zID0gdGhpcy50b0NvbW1hbmRMaW5lT3B0aW9ucyhjb21tYW5kZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gY21kbGluZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ0xJIOOBruOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODquOCkuWPluW+l1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ1tdfSBhcmd2IOW8leaVsFxyXG4gICAgICogQHJldHVybiB7U3RyaW5nfSDjgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGFja2FnZURpcmVjdG9yeShhcmd2OiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZXhlY0RpciA9IHBhdGguZGlybmFtZShhcmd2WzFdKTtcclxuICAgICAgICByZXR1cm4gcGF0aC5qb2luKGV4ZWNEaXIsIFwiLi5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDTEkgb3B0aW9uIOOCkiBJQ29tbWFuZExpbmVPcHRpb25zIOOBq+WkieaPm1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gY29tbWFuZGVyIHBhcnNlIOa4iOOBvyBjb21hbm5kZXIg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgKiBAcmV0dXJuIHtJQ29tbWFuZExpbmVPcHRpb25zfSBvcHRpb24g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHRvQ29tbWFuZExpbmVPcHRpb25zKGNvbW1hbmRlcjogYW55KTogSUNvbW1hbmRMaW5lT3B0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZm9yY2U6ICEhY29tbWFuZGVyLmZvcmNlLFxyXG4gICAgICAgICAgICB0YXJnZXREaXI6IGNvbW1hbmRlci50YXJnZXRkaXIsXHJcbiAgICAgICAgICAgIGNvbmZpZzogY29tbWFuZGVyLmNvbmZpZyxcclxuICAgICAgICAgICAgdmVyYm9zZTogISFjb21tYW5kZXIudmVyYm9zZSxcclxuICAgICAgICAgICAgc2lsZW50OiAhIWNvbW1hbmRlci5zaWxlbnQsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODmOODq+ODl+ihqOekuuOBl+OBpue1guS6hlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBzaG93SGVscCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpbmZvcm0gPSAodGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGFsay5ncmVlbih0ZXh0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbW1hbmRlci5vdXRwdXRIZWxwKDxhbnk+aW5mb3JtKTtcclxuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9jb21tYW5kLXBhcnNlci50cyIsImltcG9ydCB7XHJcbiAgICBJTGlicmFyeUNvbmZpZ3JhdGlvbixcclxuICAgIElNb2JpbGVBcHBDb25maWdyYXRpb24sXHJcbiAgICBJRGVza3RvcEFwcENvbmZpZ3JhdGlvbixcclxuICAgIElXZWJBcHBDb25maWdyYXRpb24sXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjg6njgqTjg5bjg6njg6rjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGxpYnJhcnlPbkJyb3dzZXIgPSA8SUxpYnJhcnlDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RLaW5kOiBcImxpYnJhcnlcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICBlc1RhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJ1bWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiBmYWxzZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOb2RlLmpzIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uTm9kZSA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUNvbXBpbGVDb25maWdyYXRpb25cclxuICAgIGVzVGFyZ2V0OiBcImVzMjAxNVwiLFxyXG4gICAgbW9kdWxlU3lzdGVtOiBcImNvbW1vbmpzXCIsXHJcbiAgICB3ZWJwYWNrVGFyZ2V0OiBcIm5vZGVcIixcclxuICAgIHN1cHBvcnRDU1M6IGZhbHNlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIGVsZWN0cm9uIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uRWxlY3Ryb24gPSA8SUxpYnJhcnlDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RLaW5kOiBcImxpYnJhcnlcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICBlc1RhcmdldDogXCJlczIwMTVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJjb21tb25qc1wiLFxyXG4gICAgd2VicGFja1RhcmdldDogXCJlbGVjdHJvblwiLFxyXG4gICAgc3VwcG9ydENTUzogZmFsc2UsXHJcbn07XHJcblxyXG4vKipcclxuICog44OW44Op44Km44K2KGNvcmRvdmEp55Kw5aKD44Gn5YuV5L2c44GZ44KL44Oi44OQ44Kk44Or44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBtb2JpbGVPbkJyb3dzZXIgPSA8SU1vYmlsZUFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwibW9iaWxlXCIsXHJcbiAgICAvLyBJQ29tcGlsZUNvbmZpZ3JhdGlvblxyXG4gICAgZXNUYXJnZXQ6IFwiZXM1XCIsXHJcbiAgICBtb2R1bGVTeXN0ZW06IFwiYW1kXCIsXHJcbiAgICB3ZWJwYWNrVGFyZ2V0OiBcIndlYlwiLFxyXG4gICAgc3VwcG9ydENTUzogdHJ1ZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGRlc2t0b3BPbkJyb3dzZXIgPSA8SURlc2t0b3BBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RLaW5kOiBcImRlc2t0b3BcIixcclxuICAgIC8vIElDb21waWxlQ29uZmlncmF0aW9uXHJcbiAgICBlc1RhcmdldDogXCJlczVcIixcclxuICAgIG1vZHVsZVN5c3RlbTogXCJhbWRcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwid2ViXCIsXHJcbiAgICBzdXBwb3J0Q1NTOiB0cnVlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqICBlbGVjdHJvbiDnkrDlooPjgafli5XkvZzjgZnjgovjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGRlc2t0b3BPbkVsZWN0cm9uID0gPElEZXNrdG9wQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0S2luZDogXCJkZXNrdG9wXCIsXHJcbiAgICAvLyBJQ29tcGlsZUNvbmZpZ3JhdGlvblxyXG4gICAgZXNUYXJnZXQ6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGVTeXN0ZW06IFwiY29tbW9uanNcIixcclxuICAgIHdlYnBhY2tUYXJnZXQ6IFwiZWxlY3Ryb24tcmVuZGVyZXJcIixcclxuICAgIHN1cHBvcnRDU1M6IHRydWUsXHJcbn07XHJcblxyXG4vKipcclxuICog44OW44Op44Km44K255Kw5aKD44Gn5YuV5L2c44GZ44KL44Km44Kn44OW44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCB3ZWJPbkJyb3dzZXIgPSA8SVdlYkFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdEtpbmQ6IFwid2ViXCIsXHJcbiAgICAvLyBJQ29tcGlsZUNvbmZpZ3JhdGlvblxyXG4gICAgZXNUYXJnZXQ6IFwiZXM1XCIsXHJcbiAgICBtb2R1bGVTeXN0ZW06IFwiYW1kXCIsXHJcbiAgICB3ZWJwYWNrVGFyZ2V0OiBcIndlYlwiLFxyXG4gICAgc3VwcG9ydENTUzogdHJ1ZSxcclxufTtcclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBsaWJyYXJ5OiB7XHJcbiAgICAgICAgYnJvd3NlcjogbGlicmFyeU9uQnJvd3NlcixcclxuICAgICAgICBub2RlOiBsaWJyYXJ5T25Ob2RlLFxyXG4gICAgICAgIGVsZWN0cm9uOiBsaWJyYXJ5T25FbGVjdHJvbixcclxuICAgICAgICBFTEVDVFJPTl9BVkFJTEFCTEU6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIG1vYmlsZToge1xyXG4gICAgICAgIGJyb3dzZXI6IG1vYmlsZU9uQnJvd3NlcixcclxuICAgIH0sXHJcbiAgICBkZXNjdG9wOiB7XHJcbiAgICAgICAgYnJvd3NlcjogZGVza3RvcE9uQnJvd3NlcixcclxuICAgICAgICBlbGVjdHJvbjogZGVza3RvcE9uRWxlY3Ryb24sXHJcbiAgICB9LFxyXG4gICAgd2ViOiB7XHJcbiAgICAgICAgYnJvd3Nlcjogd2ViT25Ccm93c2VyLFxyXG4gICAgfSxcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9kZWZhdWx0LWNvbmZpZy50cyIsIi8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElEZXNrdG9wQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHREZXNrdG9wQXBwXHJcbiAqIEBicmllZiDjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHREZXNrdG9wQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KFwiZGVza3RvcCBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICAvLyBUT0RPOiBzaG93XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtZGVza3RvcC50cyIsImltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJTGlicmFyeUNvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5pbXBvcnQgZGVmYXVsdENvbmZpZyBmcm9tIFwiLi9kZWZhdWx0LWNvbmZpZ1wiO1xyXG5cclxuY29uc3QgJCAgICAgICAgICAgICA9IFV0aWxzLiQ7XHJcbmNvbnN0IGNoYWxrICAgICAgICAgPSBVdGlscy5jaGFsaztcclxuY29uc3Qgc2VtdmVyUmVnZXggICA9IFV0aWxzLnNlbXZlclJlZ2V4O1xyXG5jb25zdCBsaWJDb25maWcgPSBkZWZhdWx0Q29uZmlnLmxpYnJhcnk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdExpYnJhcnlcclxuICogQGJyaWVmIOODqeOCpOODluODqeODquODouOCuOODpeODvOODq+eUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdExpYnJhcnkgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIC8vIHByb2plY3QgY29tbW9uIHNldHRuaWdzIChJUHJvamVjdENvbmZpZ3JhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJwcm9qZWN0TmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ucHJvamVjdE5hbWUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5wcm9qZWN0TmFtZSB8fCBcImNvb2wtcHJvamVjdC1uYW1lXCIsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eLipbKFxcXFx8L3w6fFxcKnw/fFxcXCJ8PHw+fFxcfCldLiokLy50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5jb21tb24ucHJvamVjdE5hbWUuaW52YWxpZE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJ2ZXJzaW9uXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi52ZXJzaW9uLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMudmVyc2lvbiB8fCBcIjAuMC4xXCIsXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZW12ZXJSZWdleCgpLnRlc3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZW12ZXJSZWdleCgpLmV4ZWModmFsdWUpWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZW12ZXJSZWdleCgpLnRlc3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi52ZXJzaW9uLmludmFsaWRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJsaWNlbnNlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMuYXBhY2hlMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiQXBhY2hlLTIuMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMubWl0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJNSVRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLnByb3ByaWV0YXJ5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJOT05FXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5saWNlbnNlIHx8IFwiTk9ORVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChJQ29tcGlsZUNvbmZpZ3JhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIndlYnBhY2tUYXJnZXRcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQubGlicmFyeS53ZWJwYWNrVGFyZ2V0Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi53ZWJwYWNrVGFyZ2V0LmNob2ljZXMuYnJvd3NlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwid2ViXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLndlYnBhY2tUYXJnZXQuY2hvaWNlcy5ub2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub2RlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgaW5xdWlyZXIuU2VwYXJhdG9yKCksXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi53ZWJwYWNrVGFyZ2V0LmNob2ljZXMuZWxlY3Ryb24gKyB0aGlzLkxJTUlUQVRJT04oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZWxlY3Ryb25cIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ud2VicGFja1RhcmdldC5jaG9pY2VzLmVsZWN0cm9uUmVuZGVyZXIgKyB0aGlzLkxJTUlUQVRJT04oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZWxlY3Ryb24tcmVuZGVyZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGliQ29uZmlnLkVMRUNUUk9OX0FWQUlMQUJMRSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImVsZWN0cm9uXCIgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm5vZGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiZWxlY3Ryb24tcmVuZGVyZXJcIiA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwid2ViXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMud2VicGFja1RhcmdldCB8fCBcIndlYlwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBiYXNlIHN0cnVjdHVyZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiZXh0cmFTZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXh0cmFTZXR0aW5ncy5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXh0cmFTZXR0aW5ncy5jaG9pY2VzLnJlY29tbWVuZGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJyZWNvbW1lbmRlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLmNob2ljZXMuY3VzdG9tLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjdXN0b21cIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5leHRyYVNldHRpbmdzIHx8IFwicmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoY3VzdG9tOiBtb2R1bGVTeXN0ZW0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVTeXN0ZW1cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMubm9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5jb21tb25qcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMudW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ1bWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IChcImFtZFwiICE9PSB0aGlzLmFuc3dlcnMubW9kdWxlU3lzdGVtKSA/ICh0aGlzLmFuc3dlcnMubW9kdWxlU3lzdGVtIHx8IFwiY29tbW9uanNcIikgOiBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3MgJiYgL14obm9kZXxlbGVjdHJvbikkL2kudGVzdChhbnN3ZXJzLndlYnBhY2tUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZHVsZVN5c3RlbVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0uY2hvaWNlcy5ub25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLmFtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoXCJjb21tb25qc1wiICE9PSB0aGlzLmFuc3dlcnMubW9kdWxlU3lzdGVtKSA/ICh0aGlzLmFuc3dlcnMubW9kdWxlU3lzdGVtIHx8IFwiYW1kXCIpIDogXCJhbWRcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiBcIndlYlwiID09PSBhbnN3ZXJzLndlYnBhY2tUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibW9kdWxlU3lzdGVtXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGVTeXN0ZW0ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLm5vbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlU3lzdGVtLmNob2ljZXMuY29tbW9uanMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLmFtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZVN5c3RlbS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubW9kdWxlU3lzdGVtIHx8IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiBcImVsZWN0cm9uLXJlbmRlcmVyXCIgPT09IGFuc3dlcnMud2VicGFja1RhcmdldDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKGN1c3RvbTogZXNUYXJnZXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJlc1RhcmdldFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXNUYXJnZXQubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVzVGFyZ2V0LmNob2ljZXMuZXM1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlczVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXNUYXJnZXQuY2hvaWNlcy5lczIwMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVzMjAxNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmVzVGFyZ2V0IHx8IChcIndlYlwiID09PSB0aGlzLmFuc3dlcnMud2VicGFja1RhcmdldCA/IFwiZXM1XCIgOiBcImVzMjAxNVwiKSxcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKGN1c3RvbTogc3VwcG9ydENTUylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjb25maXJtXCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInN1cHBvcnRDU1NcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQubGlicmFyeS5zdXBwb3J0Q1NTLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuc3VwcG9ydENTUyB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZzogSUxpYnJhcnlDb25maWdyYXRpb24gPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGFuc3dlcnMud2VicGFja1RhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIndlYlwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmJyb3dzZXIsIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm5vZGVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5ub2RlLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJlbGVjdHJvblwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmVsZWN0cm9uLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJlbGVjdHJvbi1yZW5kZXJlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmVsZWN0cm9uLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJ1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgYW5zd2Vycy53ZWJwYWNrVGFyZ2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJleHRyYVNldHRpbmdzXCIsICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJwcm9qZWN0TmFtZVwiLCAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJ2ZXJzaW9uXCIsICAgICAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJsaWNlbnNlXCIsICAgICAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJ3ZWJwYWNrVGFyZ2V0XCIsICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJtb2R1bGVTeXN0ZW1cIiwgICAgICAgICByZWNvbW1lbmQ6IHRydWUgICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJlc1RhcmdldFwiLCAgICByZWNvbW1lbmQ6IHRydWUgICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJzdXBwb3J0Q1NTXCIsICAgICAgICAgICByZWNvbW1lbmQ6IHRydWUgICAgIH0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSAoaXRlbS5yZWNvbW1lbmQgJiYgXCJyZWNvbW1lbmRlZFwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3MpID8gXCJ5ZWxsb3dcIiA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29uZmlnMmRlc2NyaXB0aW9uKGNvbmZpZywgaXRlbS5uYW1lLCBjb2xvcikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcImVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yLCBudWxsLCA0KSkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcml2YXRlIG1ldGhvZHM6XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBlbGVjdHJvbiDjgYzmnInlirnlh7rjgarjgYTloLTlkIjjga7oo5zotrPmloflrZfjgpLlj5blvpdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBMSU1JVEFUSU9OKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGxpYkNvbmZpZy5FTEVDVFJPTl9BVkFJTEFCTEUgPyBcIlwiIDogXCIgXCIgKyB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5zdGlsTm90QXZhaWxhYmxlO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LWxpYnJhcnkudHMiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJTW9iaWxlQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRNb2JpbGVBcHBcclxuICogQGJyaWVmIOODouODkOOCpOODq+OCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdE1vYmlsZUFwcCBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogYW55KTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChcIm1vYmlsZSBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICAvLyBUT0RPOiBzaG93XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtbW9iaWxlLnRzIiwiLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcblxyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSVdlYkFwcENvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5cclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0V2ViQXBwXHJcbiAqIEBicmllZiDjgqbjgqfjg5bjgqLjg5fjg6rnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHRXZWJBcHAgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCqOODs+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IGFueSk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoXCJ3ZWIgYXBwIHByb21wdGluZywgdW5kZXIgY29uc3RydWN0aW9uLlwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIC8vIFRPRE86XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a44Gu56K66KqNXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7SUFuc3dlclNjaGVtYX0gYW5zd2VycyDlm57nrZTntZDmnpxcclxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlncmF0aW9ufSDoqK3lrprlgKTjgpLov5TljbRcclxuICAgICAqL1xyXG4gICAgZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpOiBJUHJvamVjdENvbmZpZ3JhdGlvbiB7XHJcbiAgICAgICAgLy8gVE9ETzogc2hvd1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LXdlYi50cyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvbW1hbmRlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY29tbWFuZGVyXCIsXCJjb21tb25qczJcIjpcImNvbW1hbmRlclwifVxuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl19
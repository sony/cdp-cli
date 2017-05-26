/*!
 * cdp-cli.js 0.0.2
 *
 * Date: 2017-05-26T10:36:24.972Z
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
            throw Error("Language resource JSON parse error: " + error.message);
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
     * command line 情報を Conficuration に反映
     *
     * @param  {IProjectConfiguration} config 設定
     * @return {IProjectConfiguration} command line を反映させた config 設定
     */
    reflectCommandInfo(config) {
        config.action = this._cmdInfo.action;
        config.minify = this._cmdInfo.cliOptions.minify;
        config.settings = {
            force: this._cmdInfo.cliOptions.force,
            verbose: this._cmdInfo.cliOptions.verbose,
            silent: this._cmdInfo.cliOptions.silent,
            targetDir: this._cmdInfo.cliOptions.targetDir,
            lang: this.lang.type,
        };
        return config;
    }
    /**
     * 設定インタラクション
     */
    inquire() {
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
            throw Error("package.json parse error: " + error.message);
        }
        commander
            .version(pkg.version)
            .option("-f, --force", "Continue execution even if in error situation")
            .option("-t, --targetdir <path>", "Specify project target directory")
            .option("-c, --config <path>", "Specify config file path")
            .option("-v, --verbose", "Show debug messages.")
            .option("-s, --silent", "Run as silent mode.")
            .option("--no-minify", "Not minified on release.");
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
            minify: commander.minify,
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
    projectType: "library",
    // IBuildTargetConfigration
    es: "es5",
    module: "umd",
    env: "web",
    tools: ["webpack", "nyc"],
    supportCSS: false,
};
/**
 * Node.js 環境で動作するライブラリの既定値
 */
const libraryOnNode = {
    // IProjectConfigration
    projectType: "library",
    // IBuildTargetConfigration
    es: "es2015",
    module: "commonjs",
    env: "node",
    tools: ["webpack", "nyc"],
    supportCSS: false,
};
/**
 * electron 環境で動作するライブラリの既定値
 */
const libraryOnElectron = {
    // IProjectConfigration
    projectType: "library",
    // IBuildTargetConfigration
    es: "es2015",
    module: "commonjs",
    env: "electron",
    tools: ["webpack", "nyc"],
    supportCSS: false,
};
/**
 * ブラウザ(cordova)環境で動作するモバイルアプリケーションの既定値
 */
const mobileOnBrowser = {
    // IProjectConfigration
    projectType: "mobile",
    // IBuildTargetConfigration
    es: "es5",
    module: "amd",
    env: "web",
    tools: ["nyc"],
    supportCSS: true,
};
/**
 * ブラウザ環境で動作するデスクトップアプリケーションの既定値
 */
const desktopOnBrowser = {
    // IProjectConfigration
    projectType: "desktop",
    // IBuildTargetConfigration
    es: "es5",
    module: "amd",
    env: "web",
    tools: ["nyc"],
    supportCSS: true,
};
/**
 *  electron 環境で動作するデスクトップアプリケーションの既定値
 */
const desktopOnElectron = {
    // IProjectConfigration
    projectType: "desktop",
    // IBuildTargetConfigration
    es: "es2015",
    module: "commonjs",
    env: "electron-renderer",
    tools: ["webpack", "nyc"],
    supportCSS: true,
};
/**
 * ブラウザ環境で動作するウェブアプリケーションの既定値
 */
const webOnBrowser = {
    // IProjectConfigration
    projectType: "web",
    // IBuildTargetConfigration
    es: "es5",
    module: "amd",
    env: "web",
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
                    if (!/^[a-zA-Z0-9_-]*$/.test(value)) {
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
            // library settnigs (IBuildTargetConfigration)
            {
                type: "list",
                name: "env",
                message: this.lang.prompt.library.env.message,
                choices: [
                    {
                        name: this.lang.prompt.common.env.choices.browser,
                        value: "web",
                    },
                    {
                        name: this.lang.prompt.common.env.choices.node,
                        value: "node",
                    },
                    new inquirer.Separator(),
                    {
                        name: this.lang.prompt.common.env.choices.electron + this.LIMITATION(),
                        value: "electron",
                    },
                    {
                        name: this.lang.prompt.common.env.choices.electronRenderer + this.LIMITATION(),
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
                default: this.answers.env || "web",
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
            // library settnigs (custom: module)
            {
                type: "list",
                name: "module",
                message: this.lang.prompt.common.module.message,
                choices: [
                    {
                        name: this.lang.prompt.common.module.choices.none,
                        value: "none",
                    },
                    {
                        name: this.lang.prompt.common.module.choices.commonjs,
                        value: "commonjs",
                    },
                    {
                        name: this.lang.prompt.common.module.choices.umd,
                        value: "umd",
                    },
                ],
                default: ("amd" !== this.answers.module) ? (this.answers.module || "commonjs") : "commonjs",
                when: (answers) => {
                    return "custom" === answers.extraSettings && /^(node|electron)$/i.test(answers.env);
                },
            },
            {
                type: "list",
                name: "module",
                message: this.lang.prompt.common.module.message,
                choices: [
                    {
                        name: this.lang.prompt.common.module.choices.none,
                        value: "none",
                    },
                    {
                        name: this.lang.prompt.common.module.choices.amd,
                        value: "amd",
                    },
                    {
                        name: this.lang.prompt.common.module.choices.umd,
                        value: "umd",
                    },
                ],
                default: ("commonjs" !== this.answers.module) ? (this.answers.module || "amd") : "amd",
                when: (answers) => {
                    return "custom" === answers.extraSettings && "web" === answers.env;
                },
            },
            {
                type: "list",
                name: "module",
                message: this.lang.prompt.common.module.message,
                choices: [
                    {
                        name: this.lang.prompt.common.module.choices.none,
                        value: "none",
                    },
                    {
                        name: this.lang.prompt.common.module.choices.commonjs,
                        value: "commonjs",
                    },
                    {
                        name: this.lang.prompt.common.module.choices.amd,
                        value: "amd",
                    },
                    {
                        name: this.lang.prompt.common.module.choices.umd,
                        value: "umd",
                    },
                ],
                default: this.answers.module || "commonjs",
                when: (answers) => {
                    return "custom" === answers.extraSettings && "electron-renderer" === answers.env;
                },
            },
            // library settnigs (custom: es)
            {
                type: "list",
                name: "es",
                message: this.lang.prompt.common.es.message,
                choices: [
                    {
                        name: this.lang.prompt.common.es.choices.es5,
                        value: "es5",
                    },
                    {
                        name: this.lang.prompt.common.es.choices.es2015,
                        value: "es2015",
                    },
                ],
                default: this.answers.es || ("web" === this.answers.env ? "es5" : "es2015"),
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
            switch (answers.env) {
                case "web":
                    return $.extend({}, libConfig.browser, answers);
                case "node":
                    return $.extend({}, libConfig.node, answers);
                case "electron":
                    return $.extend({}, libConfig.electron, answers);
                case "electron-renderer":
                    return $.extend({}, libConfig.electron, answers);
                default:
                    console.error(chalk.red("unsupported target: " + answers.env));
                    process.exit(1);
            }
        })();
        const items = [
            { name: "extraSettings", recommend: false },
            { name: "projectName", recommend: false },
            { name: "version", recommend: false },
            { name: "license", recommend: false },
            { name: "env", recommend: false },
            { name: "module", recommend: true },
            { name: "es", recommend: true },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTI5MTkwYTg4MmExMDQ4NjgyNGUiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9IiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWJhc2UudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifSIsImNkcDovLy9jZHAtY2xpL2NkcC1jbGkudHMiLCJjZHA6Ly8vY2RwLWNsaS9jb21tYW5kLXBhcnNlci50cyIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWRlc2t0b3AudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtbGlicmFyeS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1tb2JpbGUudHMiLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtd2ViLnRzIiwid2VicGFjazovLy9leHRlcm5hbC8ge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlD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RztJQUNILElBQUksU0FBUztRQUNULFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsd0JBQXdCLENBQUMsT0FBc0I7UUFDM0MsYUFBYTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBbkNELDBDQW1DQzs7Ozs7Ozs7O0FDdkRELHNEQUFzRDtBQUN0RCxtQ0FBbUM7O0FBR25DLHlDQUlpQjtBQUNqQiw2Q0FHdUI7QUFFdkIsTUFBTSxLQUFLLEdBQUcsZUFBSyxDQUFDLEtBQUssQ0FBQztBQUUxQjs7O0dBR0c7QUFDSCxrQkFBMEIsU0FBUSx3QkFBVTtJQUV4Qyx1RUFBdUU7SUFDdkUsaUJBQWlCO0lBRWpCOztPQUVHO0lBQ0ksU0FBUyxDQUFDLE9BQVk7UUFDekIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsTUFBTSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsdUVBQXVFO0lBQ3ZFLDhCQUE4QjtJQUU5Qjs7T0FFRztJQUNILElBQUksU0FBUztRQUNULFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsd0JBQXdCLENBQUMsT0FBc0I7UUFDM0MsYUFBYTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBbkNELG9DQW1DQzs7Ozs7OztBQ3ZERCxzQyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGEyOTE5MGE4ODJhMTA0ODY4MjRlIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2RwLWxpYlwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9XG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7IElDb21tYW5kTGluZUluZm8gfSBmcm9tIFwiLi9jb21tYW5kLXBhcnNlclwiO1xyXG5cclxuY29uc3QgZnMgICAgPSBVdGlscy5mcztcclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuY29uc3QgXyAgICAgPSBVdGlscy5fO1xyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUFuc3dlclNjaGVtYVxyXG4gKiBAYnJpZWYgQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiOOBruOCueOCreODvOODnuWumue+qeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQW5zd2VyU2NoZW1hXHJcbiAgICBleHRlbmRzIGlucXVpcmVyLkFuc3dlcnMsIElQcm9qZWN0Q29uZmlncmF0aW9uLCBJQnVpbGRUYXJnZXRDb25maWdyYXRpb24ge1xyXG4gICAgLy8g5YWx6YCa5ouh5by15a6a576pXHJcbiAgICBleHRyYVNldHRpbmdzOiBcInJlY29tbWVuZGVkXCIgfCBcImN1c3RvbVwiO1xyXG59XHJcblxyXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRCYXNlXHJcbiAqIEBicmllZiBQcm9tcHQg44Gu44OZ44O844K544Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbztcclxuICAgIHByaXZhdGUgX2Fuc3dlcnMgPSA8SUFuc3dlclNjaGVtYT57fTtcclxuICAgIHByaXZhdGUgX2xvY2FsZSA9IHt9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbyk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICB0aGlzLl9jbWRJbmZvID0gY21kSW5mbztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQcm9sb2d1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmlucXVpcmVMYW5ndWFnZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5xdWlyZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChzZXR0aW5nczogSVByb2plY3RDb25maWdyYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpa2UgY293c2F5XHJcbiAgICAgKiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db3dzYXlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNheShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBHUkVFVElORyA9XHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICAgIFwiICsgY2hhbGsuY3lhbihcIuKIp++8v+KIp1wiKSArIFwiICAgIO+8j++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iCDCtOKIgO+9gO+8iVwiKSArIFwi77ycICBcIiArIGNoYWxrLnllbGxvdyhtZXNzYWdlKSArXHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICBcIiArIGNoYWxrLmN5YW4oXCLvvIggIOOBpFwiKSArIFwi77ydXCIgKyBjaGFsay5jeWFuKFwi44GkXCIpICsgXCIgIO+8vO+8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhICBcIiArIGNoYWxrLmN5YW4oXCLvvZwg772cIHxcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iF/vvL/vvInvvL/vvIlcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gIOKJoSAgIFwiICsgY2hhbGsucmVkKFwi4peOXCIpICsgXCLvv6Pvv6Pvv6Pvv6NcIiArIGNoYWxrLnJlZChcIuKXjlwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhHUkVFVElORyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg63jg7zjgqvjg6njgqTjgrrjg6rjgr3jg7zjgrnjgavjgqLjgq/jgrvjgrlcclxuICAgICAqIGV4KSB0aGlzLmxhbmcucHJvbXB0LnByb2plY3ROYW1lLm1lc3NhZ2VcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOODquOCveODvOOCueOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGxhbmcoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgYWJzdHJhY3QgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBhYnN0cmFjdCBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6a5YCk44Gr44Ki44Kv44K744K5XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBnZXQgYW5zd2VycygpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYW5zd2VycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb2xvZ3VlIOOCs+ODoeODs+ODiOOBruioreWumlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHByb2xvZ3VlQ29tbWVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIldlbGNvbWUgdG8gQ0RQIEJvaWxlcnBsYXRlIEdlbmVyYXRvciFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlbGNvbWUg6KGo56S6XHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzaG93UHJvbG9ndWUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpKTtcclxuICAgICAgICB0aGlzLnNheSh0aGlzLnByb2xvZ3VlQ29tbWVudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIIOOBruabtOaWsFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlQW5zd2Vycyh1cGRhdGU6IElBbnN3ZXJTY2hlbWEpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gXy5tZXJnZSh0aGlzLl9hbnN3ZXJzLCB1cGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6aXHJcbiAgICAgKiDliIblspDjgYzlv4XopoHjgarloLTlkIjjga/jgqrjg7zjg5Djg7zjg6njgqTjg4njgZnjgovjgZPjgahcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGlucXVpcmVTZXR0aW5ncygpOiBQcm9taXNlPElBbnN3ZXJTY2hlbWE+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQodGhpcy5xdWVzdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXR0aW5nIOOBi+OCiSDoqK3lrproqqzmmI7jga7kvZzmiJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZyDoqK3lrppcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaXRlbU5hbWUg6Kit5a6a6aCF55uu5ZCNXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOiqrOaYjuaWh1xyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29uZmlnMmRlc2NyaXB0aW9uKGNvbmZpZzogT2JqZWN0LCBpdGVtTmFtZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nID0gXCJjeWFuXCIpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmxhbmcuc2V0dGluZ3NbaXRlbU5hbWVdO1xyXG4gICAgICAgIGlmIChudWxsID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvci4gaXRlbSBub3QgZm91bmQuIGl0ZW0gbmFtZTogXCIgKyBpdGVtTmFtZSkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwcm9wOiBzdHJpbmcgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9wcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucHJvcHNbY29uZmlnW2l0ZW1OYW1lXV07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJib29sZWFuXCIgPT09IHR5cGVvZiBjb25maWdbaXRlbU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5ib29sW2NvbmZpZ1tpdGVtTmFtZV0gPyBcInllc1wiIDogXCJub1wiXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWdbaXRlbU5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgKyBjaGFsa1tjb2xvcl0ocHJvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844Kr44Op44Kk44K644Oq44K944O844K544Gu44Ot44O844OJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZExhbmd1YWdlKGxvY2FsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoXHJcbiAgICAgICAgICAgICAgICBwYXRoLmpvaW4odGhpcy5fY21kSW5mby5wa2dEaXIsIFwicmVzL2xvY2FsZXMvbWVzc2FnZXMuXCIgKyBsb2NhbGUgKyBcIi5qc29uXCIpLCBcInV0ZjhcIikudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiTGFuZ3VhZ2UgcmVzb3VyY2UgSlNPTiBwYXJzZSBlcnJvcjogXCIgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqIDoqp7pgbjmip5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlTGFuZ3VhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJsYW5ndWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUGxlYXNlIGNob29zZSB5b3VyIHByZWZlcnJlZCBsYW5ndWFnZS5cIixcclxuICAgICAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRW5nbGlzaC/oi7Hoqp5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVuLVVTXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiSmFwYW5lc2Uv5pel5pys6KqeXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJqYS1KUFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb24pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkTGFuZ3VhZ2UoYW5zd2VyLmxhbmd1YWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqK3lrprnorroqo1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjb25maXJtU2V0dGluZ3MoKTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMuZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKHRoaXMuX2Fuc3dlcnMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGVjazogXCIgKyB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5jb25maXJtLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbiA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNvbmZpcm1cIixcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImNvbmZpcm1hdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmNvbmZpcm0ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb24pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuc3dlci5jb25maXJtYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY29tbWFuZCBsaW5lIOaDheWgseOCkiBDb25maWN1cmF0aW9uIOOBq+WPjeaYoFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lQcm9qZWN0Q29uZmlndXJhdGlvbn0gY29uZmlnIOioreWumlxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWd1cmF0aW9ufSBjb21tYW5kIGxpbmUg44KS5Y+N5pig44GV44Gb44GfIGNvbmZpZyDoqK3lrppcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWZsZWN0Q29tbWFuZEluZm8oY29uZmlnOiBJUHJvamVjdENvbmZpZ3JhdGlvbik6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICBjb25maWcuYWN0aW9uID0gdGhpcy5fY21kSW5mby5hY3Rpb247XHJcblxyXG4gICAgICAgICg8SUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uPmNvbmZpZykubWluaWZ5ID0gdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLm1pbmlmeTtcclxuXHJcbiAgICAgICAgY29uZmlnLnNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICBmb3JjZTogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLmZvcmNlLFxyXG4gICAgICAgICAgICB2ZXJib3NlOiB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMudmVyYm9zZSxcclxuICAgICAgICAgICAgc2lsZW50OiB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMuc2lsZW50LFxyXG4gICAgICAgICAgICB0YXJnZXREaXI6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy50YXJnZXREaXIsXHJcbiAgICAgICAgICAgIGxhbmc6IHRoaXMubGFuZy50eXBlLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqK3lrprjgqTjg7Pjgr/jg6njgq/jgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlKCk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnF1aXJlU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXJzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQW5zd2VycyhhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZWZsZWN0Q29tbWFuZEluZm8oY29uZmlnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHByb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHByb2MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LWJhc2UudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicGF0aFwiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImlucXVpcmVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifVxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge1xyXG4gICAgZGVmYXVsdCBhcyBDRFBMaWIsXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgQ29tbWFuZFBhcnNlcixcclxuICAgIElDb21tYW5kTGluZUluZm8sXHJcbn0gZnJvbSBcIi4vY29tbWFuZC1wYXJzZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdExpYnJhcnksXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWxpYnJhcnlcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdE1vYmlsZUFwcCxcclxufSBmcm9tIFwiLi9wcm9tcHQtbW9iaWxlXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHREZXNrdG9wQXBwLFxyXG59IGZyb20gXCIuL3Byb21wdC1kZXNrdG9wXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRXZWJBcHAsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LXdlYlwiO1xyXG5cclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbmZ1bmN0aW9uIGdldElucXVpcmVyKGNtZEluZm86IElDb21tYW5kTGluZUluZm8pOiBQcm9tcHRCYXNlIHtcclxuICAgIHN3aXRjaCAoY21kSW5mby5hY3Rpb24pIHtcclxuICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKGNtZEluZm8uYWN0aW9uICsgXCIgY29tbWFuZDogdW5kZXIgY29uc3RydWN0aW9uLlwiKSk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKGNtZEluZm8udGFyZ2V0KSB7XHJcbiAgICAgICAgY2FzZSBcImxpYnJhcnlcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRMaWJyYXJ5KCk7XHJcbiAgICAgICAgY2FzZSBcIm1vYmlsZVwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdE1vYmlsZUFwcCgpO1xyXG4gICAgICAgIGNhc2UgXCJkZXNrdG9wXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0RGVza3RvcEFwcCgpO1xyXG4gICAgICAgIGNhc2UgXCJ3ZWJcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRXZWJBcHAoKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcInVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyBjbWRJbmZvLnRhcmdldCkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWluKCkge1xyXG4gICAgcHJvY2Vzcy50aXRsZSA9IFwiY2RwXCI7XHJcbiAgICBjb25zdCBjbWRJbmZvID0gQ29tbWFuZFBhcnNlci5wYXJzZShwcm9jZXNzLmFyZ3YpO1xyXG4gICAgY29uc3QgaW5xdWlyZXIgPSBnZXRJbnF1aXJlcihjbWRJbmZvKTtcclxuXHJcbiAgICBpbnF1aXJlci5wcm9tcHRpbmcoY21kSW5mbylcclxuICAgICAgICAudGhlbigoY29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGV4ZWN1dGVcclxuICAgICAgICAgICAgcmV0dXJuIENEUExpYi5leGVjdXRlKGNvbmZpZyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKGlucXVpcmVyLmxhbmcuZmluaXNoZWRbY21kSW5mby5hY3Rpb25dKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChcInN0cmluZ1wiICE9PSB0eXBlb2YgcmVhc29uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSByZWFzb24ubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbiA9IHJlYXNvbi5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb24gPSBKU09OLnN0cmluZ2lmeShyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKHJlYXNvbikpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBOT1RFOiBlczYgcHJvbWlzZSdzIGFsd2F5cyBibG9jay5cclxuICAgICAgICB9KTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NkcC1jbGkudHMiLCJpbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCAqIGFzIGNvbW1hbmRlciBmcm9tIFwiY29tbWFuZGVyXCI7XHJcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcImNkcC1saWJcIjtcclxuXHJcbmNvbnN0IGZzICAgID0gVXRpbHMuZnM7XHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJQ29tbWFuZExpbmVPcHRpb25zXHJcbiAqIEBicmllZiAgICAg44Kz44Oe44Oz44OJ44Op44Kk44Oz55So44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElDb21tYW5kTGluZU9wdGlvbnMge1xyXG4gICAgZm9yY2U6IGJvb2xlYW47ICAgICAvLyDjgqjjg6njg7zntpnntprnlKhcclxuICAgIHRhcmdldERpcjogc3RyaW5nOyAgLy8g5L2c5qWt44OH44Kj44Os44Kv44OI44Oq5oyH5a6aXHJcbiAgICBjb25maWc6IHN0cmluZzsgICAgIC8vIOOCs+ODs+ODleOCo+OCsOODleOCoeOCpOODq+aMh+WumlxyXG4gICAgdmVyYm9zZTogYm9vbGVhbjsgICAvLyDoqbPntLDjg63jgrBcclxuICAgIHNpbGVudDogYm9vbGVhbjsgICAgLy8gc2lsZW50IG1vZGVcclxuICAgIG1pbmlmeTogYm9vbGVhbjsgICAgLy8gbWluaWZ5IHN1cHBvcnRcclxufVxyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lSW5mb1xyXG4gKiBAYnJpZWYgICAgIOOCs+ODnuODs+ODieODqeOCpOODs+aDheWgseagvOe0jeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgIHBrZ0Rpcjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIENMSSDjgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6pcclxuICAgIGFjdGlvbjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCouOCr+OCt+ODp+ODs+WumuaVsFxyXG4gICAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgICAgLy8g44Kz44Oe44Oz44OJ44K/44O844Ky44OD44OIXHJcbiAgICBpbnN0YWxsZWREaXI6IHN0cmluZzsgICAgICAgICAgICAgICAvLyBDTEkg44Kk44Oz44K544OI44O844OrXHJcbiAgICBjbGlPcHRpb25zOiBJQ29tbWFuZExpbmVPcHRpb25zOyAgICAvLyDjgrPjg57jg7Pjg4njg6njgqTjg7PjgafmuKHjgZXjgozjgZ/jgqrjg5fjgrfjg6fjg7NcclxufVxyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29tbWFuZFBhcnNlclxyXG4gKiBAYnJpZWYg44Kz44Oe44Oz44OJ44Op44Kk44Oz44OR44O844K144O8XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29tbWFuZFBhcnNlciB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gu44OR44O844K5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBhcmd2ICAgICAgIOW8leaVsOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBbb3B0aW9uc10gIOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMge0lDb21tYW5kTGluZUluZm99XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2UoYXJndjogc3RyaW5nW10sIG9wdGlvbnM/OiBhbnkpOiBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgICAgICBjb25zdCBjbWRsaW5lID0gPElDb21tYW5kTGluZUluZm8+e1xyXG4gICAgICAgICAgICBwa2dEaXI6IHRoaXMuZ2V0UGFja2FnZURpcmVjdG9yeShhcmd2KSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGtnOiBhbnk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHBrZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihjbWRsaW5lLnBrZ0RpciwgXCJwYWNrYWdlLmpzb25cIiksIFwidXRmOFwiKS50b1N0cmluZygpKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcInBhY2thZ2UuanNvbiBwYXJzZSBlcnJvcjogXCIgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAudmVyc2lvbihwa2cudmVyc2lvbilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1mLCAtLWZvcmNlXCIsIFwiQ29udGludWUgZXhlY3V0aW9uIGV2ZW4gaWYgaW4gZXJyb3Igc2l0dWF0aW9uXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItdCwgLS10YXJnZXRkaXIgPHBhdGg+XCIsIFwiU3BlY2lmeSBwcm9qZWN0IHRhcmdldCBkaXJlY3RvcnlcIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1jLCAtLWNvbmZpZyA8cGF0aD5cIiwgXCJTcGVjaWZ5IGNvbmZpZyBmaWxlIHBhdGhcIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi12LCAtLXZlcmJvc2VcIiwgXCJTaG93IGRlYnVnIG1lc3NhZ2VzLlwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXMsIC0tc2lsZW50XCIsIFwiUnVuIGFzIHNpbGVudCBtb2RlLlwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLS1uby1taW5pZnlcIiwgXCJOb3QgbWluaWZpZWQgb24gcmVsZWFzZS5cIilcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcImluaXRcIilcclxuICAgICAgICAgICAgLmRlc2NyaXB0aW9uKFwiaW5pdCBwcm9qZWN0XCIpXHJcbiAgICAgICAgICAgIC5hY3Rpb24oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY21kbGluZS5hY3Rpb24gPSBcImluaXRcIjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKFwiLS1oZWxwXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICBFeGFtcGxlczpcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBpbml0XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiY3JlYXRlIDx0YXJnZXQ+XCIpXHJcbiAgICAgICAgICAgIC5kZXNjcmlwdGlvbihcImNyZWF0ZSBib2lsZXJwbGF0ZSBmb3IgJ2xpYnJhcnksIG1vZHVsZScgfCAnbW9iaWxlLCBhcHAnIHwgJ2Rlc2t0b3AnIHwgJ3dlYidcIilcclxuICAgICAgICAgICAgLmFjdGlvbigodGFyZ2V0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgvXihtb2R1bGV8YXBwfGxpYnJhcnl8bW9iaWxlfGRlc2t0b3B8d2ViKSQvaS50ZXN0KHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLmFjdGlvbiA9IFwiY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwibW9kdWxlXCIgPT09IGNtZGxpbmUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gXCJsaWJyYXJ5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImFwcFwiID09PSBjbWRsaW5lLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLnRhcmdldCA9IFwibW9iaWxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQudW5kZXJsaW5lKFwiICB1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgdGFyZ2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCItLWhlbHBcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgIEV4YW1wbGVzOlwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBsaWJyYXJ5XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBtb2JpbGVcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIGFwcCAtYyBzZXR0aW5nLmpzb25cIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCIqXCIsIG51bGwsIHsgbm9IZWxwOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIC5hY3Rpb24oKGNtZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkLnVuZGVybGluZShcIiAgdW5zdXBwb3J0ZWQgY29tbWFuZDogXCIgKyBjbWQpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlci5wYXJzZShhcmd2KTtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3YubGVuZ3RoIDw9IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY21kbGluZS5jbGlPcHRpb25zID0gdGhpcy50b0NvbW1hbmRMaW5lT3B0aW9ucyhjb21tYW5kZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gY21kbGluZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ0xJIOOBruOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODquOCkuWPluW+l1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ1tdfSBhcmd2IOW8leaVsFxyXG4gICAgICogQHJldHVybiB7U3RyaW5nfSDjgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGFja2FnZURpcmVjdG9yeShhcmd2OiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZXhlY0RpciA9IHBhdGguZGlybmFtZShhcmd2WzFdKTtcclxuICAgICAgICByZXR1cm4gcGF0aC5qb2luKGV4ZWNEaXIsIFwiLi5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDTEkgb3B0aW9uIOOCkiBJQ29tbWFuZExpbmVPcHRpb25zIOOBq+WkieaPm1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gY29tbWFuZGVyIHBhcnNlIOa4iOOBvyBjb21hbm5kZXIg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgKiBAcmV0dXJuIHtJQ29tbWFuZExpbmVPcHRpb25zfSBvcHRpb24g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHRvQ29tbWFuZExpbmVPcHRpb25zKGNvbW1hbmRlcjogYW55KTogSUNvbW1hbmRMaW5lT3B0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZm9yY2U6ICEhY29tbWFuZGVyLmZvcmNlLFxyXG4gICAgICAgICAgICB0YXJnZXREaXI6IGNvbW1hbmRlci50YXJnZXRkaXIsXHJcbiAgICAgICAgICAgIGNvbmZpZzogY29tbWFuZGVyLmNvbmZpZyxcclxuICAgICAgICAgICAgdmVyYm9zZTogISFjb21tYW5kZXIudmVyYm9zZSxcclxuICAgICAgICAgICAgc2lsZW50OiAhIWNvbW1hbmRlci5zaWxlbnQsXHJcbiAgICAgICAgICAgIG1pbmlmeTogY29tbWFuZGVyLm1pbmlmeSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OY44Or44OX6KGo56S644GX44Gm57WC5LqGXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHNob3dIZWxwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGluZm9ybSA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoYWxrLmdyZWVuKHRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29tbWFuZGVyLm91dHB1dEhlbHAoPGFueT5pbmZvcm0pO1xyXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NvbW1hbmQtcGFyc2VyLnRzIiwiaW1wb3J0IHtcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgSU1vYmlsZUFwcENvbmZpZ3JhdGlvbixcclxuICAgIElEZXNrdG9wQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgSVdlYkFwcENvbmZpZ3JhdGlvbixcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uQnJvd3NlciA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczVcIixcclxuICAgIG1vZHVsZTogXCJ1bWRcIixcclxuICAgIGVudjogXCJ3ZWJcIixcclxuICAgIHRvb2xzOiBbXCJ3ZWJwYWNrXCIsIFwibnljXCJdLFxyXG4gICAgc3VwcG9ydENTUzogZmFsc2UsXHJcbn07XHJcblxyXG4vKipcclxuICogTm9kZS5qcyDnkrDlooPjgafli5XkvZzjgZnjgovjg6njgqTjg5bjg6njg6rjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGxpYnJhcnlPbk5vZGUgPSA8SUxpYnJhcnlDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcImxpYnJhcnlcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGU6IFwiY29tbW9uanNcIixcclxuICAgIGVudjogXCJub2RlXCIsXHJcbiAgICB0b29sczogW1wid2VicGFja1wiLCBcIm55Y1wiXSxcclxuICAgIHN1cHBvcnRDU1M6IGZhbHNlLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIGVsZWN0cm9uIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uRWxlY3Ryb24gPSA8SUxpYnJhcnlDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcImxpYnJhcnlcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGU6IFwiY29tbW9uanNcIixcclxuICAgIGVudjogXCJlbGVjdHJvblwiLFxyXG4gICAgdG9vbHM6IFtcIndlYnBhY2tcIiwgXCJueWNcIl0sXHJcbiAgICBzdXBwb3J0Q1NTOiBmYWxzZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrYoY29yZG92YSnnkrDlooPjgafli5XkvZzjgZnjgovjg6Ljg5DjgqTjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IG1vYmlsZU9uQnJvd3NlciA9IDxJTW9iaWxlQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0VHlwZTogXCJtb2JpbGVcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXM1XCIsXHJcbiAgICBtb2R1bGU6IFwiYW1kXCIsXHJcbiAgICBlbnY6IFwid2ViXCIsXHJcbiAgICB0b29sczogW1wibnljXCJdLFxyXG4gICAgc3VwcG9ydENTUzogdHJ1ZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGRlc2t0b3BPbkJyb3dzZXIgPSA8SURlc2t0b3BBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcImRlc2t0b3BcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXM1XCIsXHJcbiAgICBtb2R1bGU6IFwiYW1kXCIsXHJcbiAgICBlbnY6IFwid2ViXCIsXHJcbiAgICB0b29sczogW1wibnljXCJdLFxyXG4gICAgc3VwcG9ydENTUzogdHJ1ZSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiAgZWxlY3Ryb24g55Kw5aKD44Gn5YuV5L2c44GZ44KL44OH44K544Kv44OI44OD44OX44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBkZXNrdG9wT25FbGVjdHJvbiA9IDxJRGVza3RvcEFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwiZGVza3RvcFwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczIwMTVcIixcclxuICAgIG1vZHVsZTogXCJjb21tb25qc1wiLFxyXG4gICAgZW52OiBcImVsZWN0cm9uLXJlbmRlcmVyXCIsXHJcbiAgICB0b29sczogW1wid2VicGFja1wiLCBcIm55Y1wiXSxcclxuICAgIHN1cHBvcnRDU1M6IHRydWUsXHJcbn07XHJcblxyXG4vKipcclxuICog44OW44Op44Km44K255Kw5aKD44Gn5YuV5L2c44GZ44KL44Km44Kn44OW44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCB3ZWJPbkJyb3dzZXIgPSA8SVdlYkFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwid2ViXCIsXHJcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cclxuICAgIGVzOiBcImVzNVwiLFxyXG4gICAgbW9kdWxlOiBcImFtZFwiLFxyXG4gICAgZW52OiBcIndlYlwiLFxyXG4gICAgc3VwcG9ydENTUzogdHJ1ZSxcclxufTtcclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBsaWJyYXJ5OiB7XHJcbiAgICAgICAgYnJvd3NlcjogbGlicmFyeU9uQnJvd3NlcixcclxuICAgICAgICBub2RlOiBsaWJyYXJ5T25Ob2RlLFxyXG4gICAgICAgIGVsZWN0cm9uOiBsaWJyYXJ5T25FbGVjdHJvbixcclxuICAgICAgICBFTEVDVFJPTl9BVkFJTEFCTEU6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIG1vYmlsZToge1xyXG4gICAgICAgIGJyb3dzZXI6IG1vYmlsZU9uQnJvd3NlcixcclxuICAgIH0sXHJcbiAgICBkZXNjdG9wOiB7XHJcbiAgICAgICAgYnJvd3NlcjogZGVza3RvcE9uQnJvd3NlcixcclxuICAgICAgICBlbGVjdHJvbjogZGVza3RvcE9uRWxlY3Ryb24sXHJcbiAgICB9LFxyXG4gICAgd2ViOiB7XHJcbiAgICAgICAgYnJvd3Nlcjogd2ViT25Ccm93c2VyLFxyXG4gICAgfSxcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9kZWZhdWx0LWNvbmZpZy50cyIsIi8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElEZXNrdG9wQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHREZXNrdG9wQXBwXHJcbiAqIEBicmllZiDjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHREZXNrdG9wQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KFwiZGVza3RvcCBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICAvLyBUT0RPOiBzaG93XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtZGVza3RvcC50cyIsImltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJTGlicmFyeUNvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5pbXBvcnQgZGVmYXVsdENvbmZpZyBmcm9tIFwiLi9kZWZhdWx0LWNvbmZpZ1wiO1xyXG5cclxuY29uc3QgJCAgICAgICAgICAgICA9IFV0aWxzLiQ7XHJcbmNvbnN0IGNoYWxrICAgICAgICAgPSBVdGlscy5jaGFsaztcclxuY29uc3Qgc2VtdmVyUmVnZXggICA9IFV0aWxzLnNlbXZlclJlZ2V4O1xyXG5jb25zdCBsaWJDb25maWcgPSBkZWZhdWx0Q29uZmlnLmxpYnJhcnk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdExpYnJhcnlcclxuICogQGJyaWVmIOODqeOCpOODluODqeODquODouOCuOODpeODvOODq+eUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdExpYnJhcnkgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIC8vIHByb2plY3QgY29tbW9uIHNldHRuaWdzIChJUHJvamVjdENvbmZpZ3JhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJwcm9qZWN0TmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ucHJvamVjdE5hbWUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5wcm9qZWN0TmFtZSB8fCBcImNvb2wtcHJvamVjdC1uYW1lXCIsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEvXlthLXpBLVowLTlfLV0qJC8udGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnByb2plY3ROYW1lLmludmFsaWRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwidmVyc2lvblwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnZlcnNpb24gfHwgXCIwLjAuMVwiLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VtdmVyUmVnZXgoKS5leGVjKHZhbHVlKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibGljZW5zZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLmFwYWNoZTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkFwYWNoZS0yLjBcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLm1pdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTUlUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5wcm9wcmlldGFyeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTk9ORVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubGljZW5zZSB8fCBcIk5PTkVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiZW52XCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmxpYnJhcnkuZW52Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lbnYuY2hvaWNlcy5icm93c2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ3ZWJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMubm9kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9kZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMuZWxlY3Ryb24gKyB0aGlzLkxJTUlUQVRJT04oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZWxlY3Ryb25cIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMuZWxlY3Ryb25SZW5kZXJlciArIHRoaXMuTElNSVRBVElPTigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlbGVjdHJvbi1yZW5kZXJlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaWJDb25maWcuRUxFQ1RST05fQVZBSUxBQkxFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiZWxlY3Ryb25cIiA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibm9kZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJlbGVjdHJvbi1yZW5kZXJlclwiID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ3ZWJcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5lbnYgfHwgXCJ3ZWJcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gYmFzZSBzdHJ1Y3R1cmVcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImV4dHJhU2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5yZWNvbW1lbmRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwicmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXh0cmFTZXR0aW5ncy5jaG9pY2VzLmN1c3RvbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY3VzdG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZXh0cmFTZXR0aW5ncyB8fCBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKGN1c3RvbTogbW9kdWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibW9kdWxlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLm5vbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMuY29tbW9uanMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoXCJhbWRcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZSB8fCBcImNvbW1vbmpzXCIpIDogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzICYmIC9eKG5vZGV8ZWxlY3Ryb24pJC9pLnRlc3QoYW5zd2Vycy5lbnYpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZHVsZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy5ub25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmFtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoXCJjb21tb25qc1wiICE9PSB0aGlzLmFuc3dlcnMubW9kdWxlKSA/ICh0aGlzLmFuc3dlcnMubW9kdWxlIHx8IFwiYW1kXCIpIDogXCJhbWRcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiBcIndlYlwiID09PSBhbnN3ZXJzLmVudjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMubm9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy5jb21tb25qcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMuYW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJhbWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMudW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ1bWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5tb2R1bGUgfHwgXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzICYmIFwiZWxlY3Ryb24tcmVuZGVyZXJcIiA9PT0gYW5zd2Vycy5lbnY7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IGVzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiZXNcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVzLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lcy5jaG9pY2VzLmVzNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXM1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVzLmNob2ljZXMuZXMyMDE1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlczIwMTVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5lcyB8fCAoXCJ3ZWJcIiA9PT0gdGhpcy5hbnN3ZXJzLmVudiA/IFwiZXM1XCIgOiBcImVzMjAxNVwiKSxcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKGN1c3RvbTogc3VwcG9ydENTUylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjb25maXJtXCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInN1cHBvcnRDU1NcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQubGlicmFyeS5zdXBwb3J0Q1NTLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuc3VwcG9ydENTUyB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZzogSUxpYnJhcnlDb25maWdyYXRpb24gPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGFuc3dlcnMuZW52KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwid2ViXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuYnJvd3NlciwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibm9kZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLm5vZGUsIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImVsZWN0cm9uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuZWxlY3Ryb24sIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImVsZWN0cm9uLXJlbmRlcmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuZWxlY3Ryb24sIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcInVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyBhbnN3ZXJzLmVudikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW1xyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXh0cmFTZXR0aW5nc1wiLCAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJwcm9qZWN0TmFtZVwiLCAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInZlcnNpb25cIiwgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwibGljZW5zZVwiLCAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJlbnZcIiwgICAgICAgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcIm1vZHVsZVwiLCAgICAgICAgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXNcIiwgICAgICAgICAgICAgICByZWNvbW1lbmQ6IHRydWUgICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJzdXBwb3J0Q1NTXCIsICAgICAgIHJlY29tbWVuZDogdHJ1ZSAgICAgfSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IChpdGVtLnJlY29tbWVuZCAmJiBcInJlY29tbWVuZGVkXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncykgPyBcInllbGxvd1wiIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25maWcyZGVzY3JpcHRpb24oY29uZmlnLCBpdGVtLm5hbWUsIGNvbG9yKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwiZXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IsIG51bGwsIDQpKSk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgbWV0aG9kczpcclxuXHJcbiAgICAvKipcclxuICAgICAqIGVsZWN0cm9uIOOBjOacieWKueWHuuOBquOBhOWgtOWQiOOBruijnOi2s+aWh+Wtl+OCkuWPluW+l1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIExJTUlUQVRJT04oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gbGliQ29uZmlnLkVMRUNUUk9OX0FWQUlMQUJMRSA/IFwiXCIgOiBcIiBcIiArIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnN0aWxOb3RBdmFpbGFibGU7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtbGlicmFyeS50cyIsIi8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElNb2JpbGVBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdE1vYmlsZUFwcFxyXG4gKiBAYnJpZWYg44Oi44OQ44Kk44Or44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0TW9iaWxlQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KFwibW9iaWxlIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIC8vIFRPRE86IHNob3dcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1tb2JpbGUudHMiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJV2ViQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRXZWJBcHBcclxuICogQGJyaWVmIOOCpuOCp+ODluOCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdFdlYkFwcCBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogYW55KTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChcIndlYiBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICAvLyBUT0RPOiBzaG93XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtd2ViLnRzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29tbWFuZGVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjb21tYW5kZXJcIixcImNvbW1vbmpzMlwiOlwiY29tbWFuZGVyXCJ9XG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXX0=
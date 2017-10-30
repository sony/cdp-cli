/*!
 * cdp-cli.js 0.1.1
 *
 * Date: 2017-10-30T03:11:21.774Z
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
/******/     return __webpack_require__(__webpack_require__.s = 5);
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
const path = __webpack_require__(3);
const inquirer = __webpack_require__(2);
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
        const GREETING = "\n    ≡   " + chalk.yellow("|￣ |") +
            "\n  ≡    " + chalk.yellow("_|___ |_") + "   ／￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣" +
            "\n    ≡ " + chalk.cyan("（ -^0^ ）") + "＜  " + chalk.yellow(message) +
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

module.exports = require("inquirer");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */
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
    // IMobileAppConfigration
    platforms: ["android", "ios"],
    projectStructure: [],
    external: {
        "hogan.js": {
            acquisition: "npm",
            regular: true,
            alias: "hogan",
        },
        "hammerjs": {
            acquisition: "npm",
            regular: true,
            globalExport: "Hammer",
            fileName: "hammer",
            subset: {
                "jquery-hammerjs": {
                    acquisition: "npm",
                    venderName: "hammerjs",
                    fileName: "jquery.hammer",
                    regular: true,
                },
                "@types/hammerjs": {
                    acquisition: "npm:dev",
                    regular: true,
                },
            },
        },
        "cordova-plugin-cdp-nativebridge": {
            acquisition: "cordova",
            regular: true,
        },
        "cordova-plugin-inappbrowser": {
            acquisition: "cordova",
            regular: false,
            subset: {
                "@types/cordova-plugin-inappbrowser": {
                    acquisition: "npm:dev",
                    default: true,
                },
            },
        },
        "cordova-plugin-app-version": {
            acquisition: "cordova",
            regular: false,
            subset: {
                "@types/cordova-plugin-app-version": {
                    acquisition: "npm:dev",
                    regular: true,
                },
            },
        },
        "iscroll": {
            acquisition: "npm",
            regular: false,
            globalExport: "IScroll",
            fileName: "iscroll-probe",
            subset: {
                "@types/iscroll": {
                    acquisition: "npm:dev",
                    regular: true,
                },
            },
        },
        "flipsnap": {
            acquisition: "npm",
            regular: false,
            globalExport: "Flipsnap",
            subset: {
                "@types/flipsnap": {
                    acquisition: "npm:dev",
                    regular: true,
                },
            },
        },
    },
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const command_parser_1 = __webpack_require__(7);
const prompt_library_1 = __webpack_require__(9);
const prompt_mobile_1 = __webpack_require__(10);
const prompt_desktop_1 = __webpack_require__(11);
const prompt_web_1 = __webpack_require__(12);
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(3);
const commander = __webpack_require__(8);
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
    static toCommandLineOptions(command) {
        return {
            force: !!command.force,
            targetDir: command.targetdir,
            config: command.config,
            verbose: !!command.verbose,
            silent: !!command.silent,
            minify: command.minify,
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
/* 8 */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __webpack_require__(2);
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(1);
const default_config_1 = __webpack_require__(4);
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
                    if (!/^[a-zA-Z0-9/@._-]+$/.test(value)) {
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __webpack_require__(2);
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(1);
const default_config_1 = __webpack_require__(4);
const $ = cdp_lib_1.Utils.$;
const _ = cdp_lib_1.Utils._;
const chalk = cdp_lib_1.Utils.chalk;
const semverRegex = cdp_lib_1.Utils.semverRegex;
const mobileConfig = default_config_1.default.mobile;
const EXTERNAL_DEFAULTS = (() => {
    const defaults = [];
    Object.keys(mobileConfig.browser.external)
        .forEach((target) => {
        if (mobileConfig.browser.external[target].regular) {
            defaults.push(target);
        }
    });
    return defaults;
})();
/**
 * @class PromptMobileApp
 * @brief モバイルアプリ用 Inquire クラス
 */
class PromptMobileApp extends prompt_base_1.PromptBase {
    ///////////////////////////////////////////////////////////////////////
    // imprements abstruct methods
    /**
     * プロジェクト設定項目の取得
     */
    get questions() {
        const platforms_default = this.answers.platforms
            ? this.answers.platforms.slice()
            : mobileConfig.browser.platforms;
        delete this.answers.platforms;
        const projectStructure_default = this.answers.projectStructure
            ? this.answers.projectStructure.slice()
            : mobileConfig.browser.projectStructure;
        delete this.answers.projectStructure;
        const external_default = this.answers.external
            ? this.answers.external.slice()
            : EXTERNAL_DEFAULTS;
        delete this.answers.external;
        return [
            // project common settnigs (IProjectConfigration)
            {
                type: "input",
                name: "appName",
                message: this.lang.prompt.mobile.appName.message,
                default: this.answers.appName || "Cool App Name",
                validate: (value) => {
                    if (/^.*[(\\|/|:|*|?|"|<|>||)].*$/.test(value)) {
                        return this.lang.prompt.mobile.appName.invalidMessage;
                    }
                    else {
                        return true;
                    }
                },
            },
            {
                type: "input",
                name: "projectName",
                message: this.lang.prompt.common.projectName.message,
                default: (answers) => {
                    return _.trim(_.dasherize(answers.appName.toLowerCase()), "-");
                },
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
                name: "appId",
                message: this.lang.prompt.mobile.appId.message,
                default: this.answers.appId || "org.cool.appname",
                filter: (value) => {
                    return value.toLowerCase();
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
                    },
                ],
                default: this.answers.license || "NONE",
            },
            {
                type: "checkbox",
                name: "platforms",
                message: this.lang.prompt.mobile.platforms.message,
                choices: [
                    {
                        name: "android",
                        checked: (0 <= platforms_default.indexOf("android")),
                    },
                    {
                        name: "ios",
                        checked: (0 <= platforms_default.indexOf("ios")),
                    },
                ],
            },
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
            {
                type: "checkbox",
                name: "projectStructure",
                message: this.lang.prompt.mobile.projectStructure.message,
                choices: [
                    {
                        name: this.lang.prompt.mobile.projectStructure.lib,
                        value: "lib",
                        checked: (0 <= projectStructure_default.indexOf("lib")),
                    },
                    {
                        name: this.lang.prompt.mobile.projectStructure.porting,
                        value: "porting",
                        checked: (0 <= projectStructure_default.indexOf("porting")),
                    },
                ],
                when: (answers) => {
                    return "custom" === answers.extraSettings;
                },
            },
            {
                type: "checkbox",
                name: "external",
                message: this.lang.prompt.mobile.external.message,
                paginated: false,
                choices: [
                    new inquirer.Separator(this.lang.prompt.mobile.external.separator.cordova),
                    {
                        name: this.lang.prompt.mobile.external.modules["cordova-plugin-cdp-nativebridge"],
                        value: "cordova-plugin-cdp-nativebridge",
                        checked: (0 <= external_default.indexOf("cordova-plugin-cdp-nativebridge")),
                        disabled: (answers) => {
                            if (!answers.platforms || answers.platforms.length <= 0) {
                                return this.lang.prompt.mobile.external.noCordovaMessage;
                            }
                        },
                    },
                    {
                        name: this.lang.prompt.mobile.external.modules["cordova-plugin-inappbrowser"],
                        value: "cordova-plugin-inappbrowser",
                        checked: (0 <= external_default.indexOf("cordova-plugin-inappbrowser")),
                        disabled: (answers) => {
                            if (!answers.platforms || answers.platforms.length <= 0) {
                                return this.lang.prompt.mobile.external.noCordovaMessage;
                            }
                        },
                    },
                    {
                        name: this.lang.prompt.mobile.external.modules["cordova-plugin-app-version"],
                        value: "cordova-plugin-app-version",
                        checked: (0 <= external_default.indexOf("cordova-plugin-app-version")),
                        disabled: (answers) => {
                            if (!answers.platforms || answers.platforms.length <= 0) {
                                return this.lang.prompt.mobile.external.noCordovaMessage;
                            }
                        },
                    },
                    new inquirer.Separator(this.lang.prompt.mobile.external.separator.utils),
                    /* tslint:disable:no-string-literal */
                    {
                        name: this.lang.prompt.mobile.external.modules["hogan.js"],
                        value: "hogan.js",
                        checked: (0 <= external_default.indexOf("hogan.js")),
                    },
                    {
                        name: this.lang.prompt.mobile.external.modules["hammerjs"],
                        value: "hammerjs",
                        checked: (0 <= external_default.indexOf("hammerjs")),
                    },
                    {
                        name: this.lang.prompt.mobile.external.modules["iscroll"],
                        value: "iscroll",
                        checked: (0 <= external_default.indexOf("iscroll")),
                    },
                    {
                        name: this.lang.prompt.mobile.external.modules["flipsnap"],
                        value: "flipsnap",
                        checked: (0 <= external_default.indexOf("flipsnap")),
                    },
                ],
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
            const defaults = $.extend({}, mobileConfig.browser);
            const lookup = defaults.external;
            delete defaults.external;
            const _config = $.extend({}, defaults, {
                external: EXTERNAL_DEFAULTS,
                dependencies: [],
                devDependencies: [],
                cordova_plugin: [],
                resource_addon: [],
            }, answers);
            try {
                const resolveDependencies = (moduleName, info) => {
                    switch (info.acquisition) {
                        case "npm":
                            _config.dependencies.push({
                                name: moduleName,
                                alias: info.alias,
                                globalExport: info.globalExport,
                                venderName: info.venderName,
                                fileName: info.fileName,
                            });
                            return true;
                        case "npm:dev":
                            _config.devDependencies.push({ name: moduleName });
                            return true;
                        case "cordova":
                            if (0 < _config.platforms.length) {
                                _config.cordova_plugin.push({ name: moduleName });
                                return true;
                            }
                            else {
                                return false;
                            }
                        case "resource":
                            _config.resource_addon.push({
                                name: moduleName,
                                alias: info.alias,
                                globalExport: info.globalExport,
                                venderName: info.venderName,
                                fileName: info.fileName,
                            });
                            return true;
                        default:
                            return false;
                    }
                };
                _config.external.forEach((top) => {
                    const info = lookup[top];
                    const valid = resolveDependencies(top, info);
                    if (valid && info.subset) {
                        Object.keys(info.subset)
                            .forEach((sub) => {
                            resolveDependencies(sub, info.subset[sub]);
                        });
                    }
                });
            }
            catch (error) {
                console.error(chalk.red("error: " + JSON.stringify(error, null, 4)));
                process.exit(1);
            }
            delete _config.external;
            return _config;
        })();
        const items = [
            { name: "extraSettings", fixed: false },
            { name: "appName", fixed: false },
            { name: "projectName", fixed: false },
            { name: "appId", fixed: false },
            { name: "version", fixed: false },
            { name: "license", fixed: false },
            { name: "module", fixed: true },
            { name: "es", fixed: true },
        ];
        try {
            items.forEach((item) => {
                const color = (item.fixed) ? "yellow" : undefined;
                console.log(this.config2description(config, item.name, color));
            });
        }
        catch (error) {
            console.error(chalk.red("error: " + JSON.stringify(error, null, 4)));
            process.exit(1);
        }
        // platforms
        const platformInfo = (0 < config.platforms.length)
            ? config.platforms.join(", ")
            : this.lang.settings.mobile.platforms.none;
        console.log("\n" + this.lang.settings.mobile.platforms.label + chalk.cyan(platformInfo));
        const COLOR = ("recommended" === answers.extraSettings) ? "yellow" : "cyan";
        // additional project structure
        if (0 < config.projectStructure.length) {
            const projectStructure = config.projectStructure.join(", ");
            console.log("\n" + this.lang.settings.mobile.projectStructure.label + chalk[COLOR](projectStructure));
        }
        // additional cordova plugin
        if (0 < config.cordova_plugin.length) {
            console.log("\n" + this.lang.settings.mobile.cordovaPlugins.label);
            config.cordova_plugin.forEach((info) => {
                console.log("    " + chalk[COLOR](info.name));
            });
        }
        // additional dependency
        if (0 < config.dependencies.length) {
            console.log("\n" + this.lang.settings.mobile.dependencies.label);
            config.resource_addon.forEach((info) => {
                console.log("    " + chalk[COLOR](info.name));
            });
            config.dependencies.forEach((info) => {
                console.log("    " + chalk[COLOR](info.name));
            });
        }
        return config;
    }
}
exports.PromptMobileApp = PromptMobileApp;


/***/ }),
/* 11 */
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
/* 12 */
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGVmZDU3ZTlkMjBhZDQyZmE1M2EiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn0iLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtYmFzZS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImlucXVpcmVyXCIsXCJjb21tb25qczJcIjpcImlucXVpcmVyXCJ9Iiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvY2RwLWNsaS50cyIsImNkcDovLy9jZHAtY2xpL2NvbW1hbmQtcGFyc2VyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY29tbWFuZGVyXCIsXCJjb21tb25qczJcIjpcImNvbW1hbmRlclwifSIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1saWJyYXJ5LnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LW1vYmlsZS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1kZXNrdG9wLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LXdlYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztB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SUFDSCx3QkFBd0IsQ0FBQyxPQUFzQjtRQUMzQyxhQUFhO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFuQ0QsNENBbUNDOzs7Ozs7Ozs7QUN2REQsc0RBQXNEO0FBQ3RELG1DQUFtQzs7QUFHbkMseUNBSWlCO0FBQ2pCLDZDQUd1QjtBQUV2QixNQUFNLEtBQUssR0FBRyxlQUFLLENBQUMsS0FBSyxDQUFDO0FBRTFCOzs7R0FHRztBQUNILGtCQUEwQixTQUFRLHdCQUFVO0lBRXhDLHVFQUF1RTtJQUN2RSxpQkFBaUI7SUFFakI7O09BRUc7SUFDSSxTQUFTLENBQUMsT0FBWTtRQUN6QixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsdUVBQXVFO0lBQ3ZFLDhCQUE4QjtJQUU5Qjs7T0FFRztJQUNILElBQUksU0FBUztRQUNULFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsd0JBQXdCLENBQUMsT0FBc0I7UUFDM0MsYUFBYTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBbkNELG9DQW1DQyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDhlZmQ1N2U5ZDIwYWQ0MmZhNTNhIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2RwLWxpYlwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9XG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7IElDb21tYW5kTGluZUluZm8gfSBmcm9tIFwiLi9jb21tYW5kLXBhcnNlclwiO1xyXG5cclxuY29uc3QgZnMgICAgPSBVdGlscy5mcztcclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuY29uc3QgXyAgICAgPSBVdGlscy5fO1xyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUFuc3dlclNjaGVtYVxyXG4gKiBAYnJpZWYgQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiOOBruOCueOCreODvOODnuWumue+qeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQW5zd2VyU2NoZW1hXHJcbiAgICBleHRlbmRzIGlucXVpcmVyLkFuc3dlcnMsIElQcm9qZWN0Q29uZmlncmF0aW9uLCBJQnVpbGRUYXJnZXRDb25maWdyYXRpb24ge1xyXG4gICAgLy8g5YWx6YCa5ouh5by15a6a576pXHJcbiAgICBleHRyYVNldHRpbmdzOiBcInJlY29tbWVuZGVkXCIgfCBcImN1c3RvbVwiO1xyXG59XHJcblxyXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRCYXNlXHJcbiAqIEBicmllZiBQcm9tcHQg44Gu44OZ44O844K544Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBfY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbztcclxuICAgIHByaXZhdGUgX2Fuc3dlcnMgPSA8SUFuc3dlclNjaGVtYT57fTtcclxuICAgIHByaXZhdGUgX2xvY2FsZSA9IHt9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbyk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICB0aGlzLl9jbWRJbmZvID0gY21kSW5mbztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQcm9sb2d1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmlucXVpcmVMYW5ndWFnZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5xdWlyZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChzZXR0aW5nczogSVByb2plY3RDb25maWdyYXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpa2UgY293c2F5XHJcbiAgICAgKiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db3dzYXlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNheShtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBHUkVFVElORyA9XHJcbiAgICAgICAgICAgIFwiXFxuICAgIOKJoSAgIFwiICsgY2hhbGsueWVsbG93KFwifO+/oyB8XCIpICtcclxuICAgICAgICAgICAgXCJcXG4gIOKJoSAgICBcIiArIGNoYWxrLnllbGxvdyhcIl98X19fIHxfXCIpICsgXCIgICDvvI/vv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6Pvv6NcIiArXHJcbiAgICAgICAgICAgIFwiXFxuICAgIOKJoSBcIiArIGNoYWxrLmN5YW4oXCLvvIggLV4wXiDvvIlcIikgKyBcIu+8nCAgXCIgKyBjaGFsay55ZWxsb3cobWVzc2FnZSkgK1xyXG4gICAgICAgICAgICBcIlxcbiAg4omhICAgXCIgKyBjaGFsay5jeWFuKFwi77yIICDjgaRcIikgKyBcIu+8nVwiICsgY2hhbGsuY3lhbihcIuOBpFwiKSArIFwiICDvvLzvvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL9cIiArXHJcbiAgICAgICAgICAgIFwiXFxuICAgIOKJoSAgXCIgKyBjaGFsay5jeWFuKFwi772cIO+9nCB8XCIpICsgXCLvvLxcIiArXHJcbiAgICAgICAgICAgIFwiXFxuICAgIOKJoSBcIiArIGNoYWxrLmN5YW4oXCLvvIhf77y/77yJ77y/77yJXCIpICsgXCLvvLxcIiArXHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICBcIiArIGNoYWxrLnJlZChcIuKXjlwiKSArIFwi77+j77+j77+j77+jXCIgKyBjaGFsay5yZWQoXCLil45cIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coR1JFRVRJTkcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844Kr44Op44Kk44K644Oq44K944O844K544Gr44Ki44Kv44K744K5XHJcbiAgICAgKiBleCkgdGhpcy5sYW5nLnByb21wdC5wcm9qZWN0TmFtZS5tZXNzYWdlXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSDjg6rjgr3jg7zjgrnjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBsYW5nKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGFic3RyYWN0IGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a44Gu56K66KqNXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7SUFuc3dlclNjaGVtYX0gYW5zd2VycyDlm57nrZTntZDmnpxcclxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlncmF0aW9ufSDoqK3lrprlgKTjgpLov5TljbRcclxuICAgICAqL1xyXG4gICAgYWJzdHJhY3QgZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpOiBJUHJvamVjdENvbmZpZ3JhdGlvbjtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJvdGVjdGVkIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOioreWumuWApOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGFuc3dlcnMoKTogSUFuc3dlclNjaGVtYSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Fuc3dlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9sb2d1ZSDjgrPjg6Hjg7Pjg4jjga7oqK3lrppcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGdldCBwcm9sb2d1ZUNvbW1lbnQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJXZWxjb21lIHRvIENEUCBCb2lsZXJwbGF0ZSBHZW5lcmF0b3IhXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXZWxjb21lIOihqOekulxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgc2hvd1Byb2xvZ3VlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSk7XHJcbiAgICAgICAgdGhpcy5zYXkodGhpcy5wcm9sb2d1ZUNvbW1lbnQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSArIFwiXFxuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiCDjga7mm7TmlrBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuc3dlciDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUFuc3dlcnModXBkYXRlOiBJQW5zd2VyU2NoZW1hKTogSUFuc3dlclNjaGVtYSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWVyZ2UodGhpcy5fYW5zd2VycywgdXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumlxyXG4gICAgICog5YiG5bKQ44GM5b+F6KaB44Gq5aC05ZCI44Gv44Kq44O844OQ44O844Op44Kk44OJ44GZ44KL44GT44GoXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBpbnF1aXJlU2V0dGluZ3MoKTogUHJvbWlzZTxJQW5zd2VyU2NoZW1hPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaW5xdWlyZXIucHJvbXB0KHRoaXMucXVlc3Rpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKDxJQW5zd2VyU2NoZW1hPmFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0dGluZyDjgYvjgokg6Kit5a6a6Kqs5piO44Gu5L2c5oiQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBjb25maWcg6Kit5a6aXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGl0ZW1OYW1lIOioreWumumgheebruWQjVxyXG4gICAgICogQHJldHVybiB7U3RyaW5nfSDoqqzmmI7mlodcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGNvbmZpZzJkZXNjcmlwdGlvbihjb25maWc6IE9iamVjdCwgaXRlbU5hbWU6IHN0cmluZywgY29sb3I6IHN0cmluZyA9IFwiY3lhblwiKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5sYW5nLnNldHRpbmdzW2l0ZW1OYW1lXTtcclxuICAgICAgICBpZiAobnVsbCA9PSBpdGVtKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwiZXJyb3IuIGl0ZW0gbm90IGZvdW5kLiBpdGVtIG5hbWU6IFwiICsgaXRlbU5hbWUpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcHJvcDogc3RyaW5nID0gKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ucHJvcHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnByb3BzW2NvbmZpZ1tpdGVtTmFtZV1dO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFwiYm9vbGVhblwiID09PSB0eXBlb2YgY29uZmlnW2l0ZW1OYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uYm9vbFtjb25maWdbaXRlbU5hbWVdID8gXCJ5ZXNcIiA6IFwibm9cIl07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnW2l0ZW1OYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpdGVtLmxhYmVsICsgY2hhbGtbY29sb3JdKHByb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODreODvOOCq+ODqeOCpOOCuuODquOCveODvOOCueOBruODreODvOODiVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGxvYWRMYW5ndWFnZShsb2NhbGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKFxyXG4gICAgICAgICAgICAgICAgcGF0aC5qb2luKHRoaXMuX2NtZEluZm8ucGtnRGlyLCBcInJlcy9sb2NhbGVzL21lc3NhZ2VzLlwiICsgbG9jYWxlICsgXCIuanNvblwiKSwgXCJ1dGY4XCIpLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkxhbmd1YWdlIHJlc291cmNlIEpTT04gcGFyc2UgZXJyb3I6IFwiICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6KiA6Kqe6YG45oqeXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5xdWlyZUxhbmd1YWdlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwibGFuZ3VhZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlBsZWFzZSBjaG9vc2UgeW91ciBwcmVmZXJyZWQgbGFuZ3VhZ2UuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkVuZ2xpc2gv6Iux6KqeXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlbi1VU1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkphcGFuZXNlL+aXpeacrOiqnlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiamEtSlBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgaW5xdWlyZXIucHJvbXB0KHF1ZXN0aW9uKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZExhbmd1YWdlKGFuc3dlci5sYW5ndWFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6a56K66KqNXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY29uZmlybVNldHRpbmdzKCk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLmRpc3BsYXlTZXR0aW5nc0J5QW5zd2Vycyh0aGlzLl9hbnN3ZXJzKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2hlY2s6IFwiICsgdGhpcy5sYW5nLnByb21wdC5jb21tb24uY29uZmlybS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjb25maXJtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJjb25maXJtYXRpb25cIixcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5jb25maXJtLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgaW5xdWlyZXIucHJvbXB0KHF1ZXN0aW9uKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbnN3ZXIuY29uZmlybWF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNvbW1hbmQgbGluZSDmg4XloLHjgpIgQ29uZmljdXJhdGlvbiDjgavlj43mmKBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJUHJvamVjdENvbmZpZ3VyYXRpb259IGNvbmZpZyDoqK3lrppcclxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlndXJhdGlvbn0gY29tbWFuZCBsaW5lIOOCkuWPjeaYoOOBleOBm+OBnyBjb25maWcg6Kit5a6aXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVmbGVjdENvbW1hbmRJbmZvKGNvbmZpZzogSVByb2plY3RDb25maWdyYXRpb24pOiBJUHJvamVjdENvbmZpZ3JhdGlvbiB7XHJcbiAgICAgICAgY29uZmlnLmFjdGlvbiA9IHRoaXMuX2NtZEluZm8uYWN0aW9uO1xyXG5cclxuICAgICAgICAoPElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbj5jb25maWcpLm1pbmlmeSA9IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy5taW5pZnk7XHJcblxyXG4gICAgICAgIGNvbmZpZy5zZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgZm9yY2U6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy5mb3JjZSxcclxuICAgICAgICAgICAgdmVyYm9zZTogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnZlcmJvc2UsXHJcbiAgICAgICAgICAgIHNpbGVudDogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnNpbGVudCxcclxuICAgICAgICAgICAgdGFyZ2V0RGlyOiB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMudGFyZ2V0RGlyLFxyXG4gICAgICAgICAgICBsYW5nOiB0aGlzLmxhbmcudHlwZSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6a44Kk44Oz44K/44Op44Kv44K344On44OzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5xdWlyZSgpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5xdWlyZVNldHRpbmdzKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUFuc3dlcnMoYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybVNldHRpbmdzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVmbGVjdENvbW1hbmRJbmZvKGNvbmZpZykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1iYXNlLnRzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaW5xdWlyZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImlucXVpcmVyXCIsXCJjb21tb25qczJcIjpcImlucXVpcmVyXCJ9XG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJwYXRoXCJcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgSU1vYmlsZUFwcENvbmZpZ3JhdGlvbixcclxuICAgIElEZXNrdG9wQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgSVdlYkFwcENvbmZpZ3JhdGlvbixcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uQnJvd3NlciA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczVcIixcclxuICAgIG1vZHVsZTogXCJ1bWRcIixcclxuICAgIGVudjogXCJ3ZWJcIixcclxuICAgIHRvb2xzOiBbXCJ3ZWJwYWNrXCIsIFwibnljXCJdLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5vZGUuanMg55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25Ob2RlID0gPElMaWJyYXJ5Q29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0VHlwZTogXCJsaWJyYXJ5XCIsXHJcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cclxuICAgIGVzOiBcImVzMjAxNVwiLFxyXG4gICAgbW9kdWxlOiBcImNvbW1vbmpzXCIsXHJcbiAgICBlbnY6IFwibm9kZVwiLFxyXG4gICAgdG9vbHM6IFtcIndlYnBhY2tcIiwgXCJueWNcIl0sXHJcbn07XHJcblxyXG4vKipcclxuICogZWxlY3Ryb24g55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25FbGVjdHJvbiA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczIwMTVcIixcclxuICAgIG1vZHVsZTogXCJjb21tb25qc1wiLFxyXG4gICAgZW52OiBcImVsZWN0cm9uXCIsXHJcbiAgICB0b29sczogW1wid2VicGFja1wiLCBcIm55Y1wiXSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrYoY29yZG92YSnnkrDlooPjgafli5XkvZzjgZnjgovjg6Ljg5DjgqTjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IG1vYmlsZU9uQnJvd3NlcjogSU1vYmlsZUFwcENvbmZpZ3JhdGlvbiA9IDxhbnk+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcIm1vYmlsZVwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczVcIixcclxuICAgIG1vZHVsZTogXCJhbWRcIixcclxuICAgIGVudjogXCJ3ZWJcIixcclxuICAgIHRvb2xzOiBbXCJueWNcIl0sXHJcbiAgICAvLyBJTW9iaWxlQXBwQ29uZmlncmF0aW9uXHJcbiAgICBwbGF0Zm9ybXM6IFtcImFuZHJvaWRcIiwgXCJpb3NcIl0sXHJcbiAgICBwcm9qZWN0U3RydWN0dXJlOiBbXSxcclxuICAgIGV4dGVybmFsOiB7XHJcbiAgICAgICAgXCJob2dhbi5qc1wiOiB7XHJcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbVwiLFxyXG4gICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxyXG4gICAgICAgICAgICBhbGlhczogXCJob2dhblwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJoYW1tZXJqc1wiOiB7XHJcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbVwiLFxyXG4gICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxyXG4gICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IFwiSGFtbWVyXCIsXHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcImhhbW1lclwiLFxyXG4gICAgICAgICAgICBzdWJzZXQ6IHtcclxuICAgICAgICAgICAgICAgIFwianF1ZXJ5LWhhbW1lcmpzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG1cIixcclxuICAgICAgICAgICAgICAgICAgICB2ZW5kZXJOYW1lOiBcImhhbW1lcmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IFwianF1ZXJ5LmhhbW1lclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ3VsYXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJAdHlwZXMvaGFtbWVyanNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbTpkZXZcIixcclxuICAgICAgICAgICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZVwiOiB7XHJcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcImNvcmRvdmFcIixcclxuICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29yZG92YS1wbHVnaW4taW5hcHBicm93c2VyXCI6IHtcclxuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwiY29yZG92YVwiLFxyXG4gICAgICAgICAgICByZWd1bGFyOiBmYWxzZSxcclxuICAgICAgICAgICAgc3Vic2V0OiB7XHJcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9jb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbTpkZXZcIixcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29yZG92YS1wbHVnaW4tYXBwLXZlcnNpb25cIjoge1xyXG4gICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJjb3Jkb3ZhXCIsXHJcbiAgICAgICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWJzZXQ6IHtcclxuICAgICAgICAgICAgICAgIFwiQHR5cGVzL2NvcmRvdmEtcGx1Z2luLWFwcC12ZXJzaW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG06ZGV2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImlzY3JvbGxcIjoge1xyXG4gICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG1cIixcclxuICAgICAgICAgICAgcmVndWxhcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGdsb2JhbEV4cG9ydDogXCJJU2Nyb2xsXCIsXHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcImlzY3JvbGwtcHJvYmVcIixcclxuICAgICAgICAgICAgc3Vic2V0OiB7XHJcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9pc2Nyb2xsXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG06ZGV2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImZsaXBzbmFwXCI6IHtcclxuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtXCIsXHJcbiAgICAgICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IFwiRmxpcHNuYXBcIixcclxuICAgICAgICAgICAgc3Vic2V0OiB7XHJcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9mbGlwc25hcFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtOmRldlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ3VsYXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODh+OCueOCr+ODiOODg+ODl+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgZGVza3RvcE9uQnJvd3NlciA9IDxJRGVza3RvcEFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwiZGVza3RvcFwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczVcIixcclxuICAgIG1vZHVsZTogXCJhbWRcIixcclxuICAgIGVudjogXCJ3ZWJcIixcclxuICAgIHRvb2xzOiBbXCJueWNcIl0sXHJcbn07XHJcblxyXG4vKipcclxuICogIGVsZWN0cm9uIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODh+OCueOCr+ODiOODg+ODl+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgZGVza3RvcE9uRWxlY3Ryb24gPSA8SURlc2t0b3BBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcImRlc2t0b3BcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGU6IFwiY29tbW9uanNcIixcclxuICAgIGVudjogXCJlbGVjdHJvbi1yZW5kZXJlclwiLFxyXG4gICAgdG9vbHM6IFtcIndlYnBhY2tcIiwgXCJueWNcIl0sXHJcbn07XHJcblxyXG4vKipcclxuICog44OW44Op44Km44K255Kw5aKD44Gn5YuV5L2c44GZ44KL44Km44Kn44OW44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCB3ZWJPbkJyb3dzZXIgPSA8SVdlYkFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwid2ViXCIsXHJcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cclxuICAgIGVzOiBcImVzNVwiLFxyXG4gICAgbW9kdWxlOiBcImFtZFwiLFxyXG4gICAgZW52OiBcIndlYlwiLFxyXG59O1xyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGxpYnJhcnk6IHtcclxuICAgICAgICBicm93c2VyOiBsaWJyYXJ5T25Ccm93c2VyLFxyXG4gICAgICAgIG5vZGU6IGxpYnJhcnlPbk5vZGUsXHJcbiAgICAgICAgZWxlY3Ryb246IGxpYnJhcnlPbkVsZWN0cm9uLFxyXG4gICAgICAgIEVMRUNUUk9OX0FWQUlMQUJMRTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbW9iaWxlOiB7XHJcbiAgICAgICAgYnJvd3NlcjogbW9iaWxlT25Ccm93c2VyLFxyXG4gICAgfSxcclxuICAgIGRlc2N0b3A6IHtcclxuICAgICAgICBicm93c2VyOiBkZXNrdG9wT25Ccm93c2VyLFxyXG4gICAgICAgIGVsZWN0cm9uOiBkZXNrdG9wT25FbGVjdHJvbixcclxuICAgIH0sXHJcbiAgICB3ZWI6IHtcclxuICAgICAgICBicm93c2VyOiB3ZWJPbkJyb3dzZXIsXHJcbiAgICB9LFxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2RlZmF1bHQtY29uZmlnLnRzIiwiaW1wb3J0IHtcclxuICAgIGRlZmF1bHQgYXMgQ0RQTGliLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIENvbW1hbmRQYXJzZXIsXHJcbiAgICBJQ29tbWFuZExpbmVJbmZvLFxyXG59IGZyb20gXCIuL2NvbW1hbmQtcGFyc2VyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRMaWJyYXJ5LFxyXG59IGZyb20gXCIuL3Byb21wdC1saWJyYXJ5XCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRNb2JpbGVBcHAsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LW1vYmlsZVwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0RGVza3RvcEFwcCxcclxufSBmcm9tIFwiLi9wcm9tcHQtZGVza3RvcFwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0V2ViQXBwLFxyXG59IGZyb20gXCIuL3Byb21wdC13ZWJcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG5mdW5jdGlvbiBnZXRJbnF1aXJlcihjbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvKTogUHJvbXB0QmFzZSB7XHJcbiAgICBzd2l0Y2ggKGNtZEluZm8uYWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSBcImNyZWF0ZVwiOlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChjbWRJbmZvLmFjdGlvbiArIFwiIGNvbW1hbmQ6IHVuZGVyIGNvbnN0cnVjdGlvbi5cIikpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChjbWRJbmZvLnRhcmdldCkge1xyXG4gICAgICAgIGNhc2UgXCJsaWJyYXJ5XCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0TGlicmFyeSgpO1xyXG4gICAgICAgIGNhc2UgXCJtb2JpbGVcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRNb2JpbGVBcHAoKTtcclxuICAgICAgICBjYXNlIFwiZGVza3RvcFwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdERlc2t0b3BBcHAoKTtcclxuICAgICAgICBjYXNlIFwid2ViXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0V2ViQXBwKCk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJ1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgY21kSW5mby50YXJnZXQpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIHByb2Nlc3MudGl0bGUgPSBcImNkcFwiO1xyXG4gICAgY29uc3QgY21kSW5mbyA9IENvbW1hbmRQYXJzZXIucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuICAgIGNvbnN0IGlucXVpcmVyID0gZ2V0SW5xdWlyZXIoY21kSW5mbyk7XHJcblxyXG4gICAgaW5xdWlyZXIucHJvbXB0aW5nKGNtZEluZm8pXHJcbiAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAvLyBleGVjdXRlXHJcbiAgICAgICAgICAgIHJldHVybiBDRFBMaWIuZXhlY3V0ZShjb25maWcpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihpbnF1aXJlci5sYW5nLmZpbmlzaGVkW2NtZEluZm8uYWN0aW9uXSkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoXCJzdHJpbmdcIiAhPT0gdHlwZW9mIHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gcmVhc29uLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb24gPSByZWFzb24ubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uID0gSlNPTi5zdHJpbmdpZnkocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChyZWFzb24pKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgLy8gTk9URTogZXM2IHByb21pc2UncyBhbHdheXMgYmxvY2suXHJcbiAgICAgICAgfSk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9jZHAtY2xpLnRzIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBjb21tYW5kZXIgZnJvbSBcImNvbW1hbmRlclwiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCJjZHAtbGliXCI7XHJcblxyXG5jb25zdCBmcyAgICA9IFV0aWxzLmZzO1xyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lT3B0aW9uc1xyXG4gKiBAYnJpZWYgICAgIOOCs+ODnuODs+ODieODqeOCpOODs+eUqOOCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQ29tbWFuZExpbmVPcHRpb25zIHtcclxuICAgIGZvcmNlOiBib29sZWFuOyAgICAgLy8g44Ko44Op44O857aZ57aa55SoXHJcbiAgICB0YXJnZXREaXI6IHN0cmluZzsgIC8vIOS9nOalreODh+OCo+ODrOOCr+ODiOODquaMh+WumlxyXG4gICAgY29uZmlnOiBzdHJpbmc7ICAgICAvLyDjgrPjg7Pjg5XjgqPjgrDjg5XjgqHjgqTjg6vmjIflrppcclxuICAgIHZlcmJvc2U6IGJvb2xlYW47ICAgLy8g6Kmz57Sw44Ot44KwXHJcbiAgICBzaWxlbnQ6IGJvb2xlYW47ICAgIC8vIHNpbGVudCBtb2RlXHJcbiAgICBtaW5pZnk6IGJvb2xlYW47ICAgIC8vIG1pbmlmeSBzdXBwb3J0XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElDb21tYW5kTGluZUluZm9cclxuICogQGJyaWVmICAgICDjgrPjg57jg7Pjg4njg6njgqTjg7Pmg4XloLHmoLzntI3jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lSW5mbyB7XHJcbiAgICBwa2dEaXI6IHN0cmluZzsgICAgICAgICAgICAgICAgICAgICAvLyBDTEkg44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44OqXHJcbiAgICBhY3Rpb246IHN0cmluZzsgICAgICAgICAgICAgICAgICAgICAvLyDjgqLjgq/jgrfjg6fjg7PlrprmlbBcclxuICAgIHRhcmdldDogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCs+ODnuODs+ODieOCv+ODvOOCsuODg+ODiFxyXG4gICAgaW5zdGFsbGVkRGlyOiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8gQ0xJIOOCpOODs+OCueODiOODvOODq1xyXG4gICAgY2xpT3B0aW9uczogSUNvbW1hbmRMaW5lT3B0aW9uczsgICAgLy8g44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gn5rih44GV44KM44Gf44Kq44OX44K344On44OzXHJcbn1cclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4vKipcclxuICogQGNsYXNzIENvbW1hbmRQYXJzZXJcclxuICogQGJyaWVmIOOCs+ODnuODs+ODieODqeOCpOODs+ODkeODvOOCteODvFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENvbW1hbmRQYXJzZXIge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODnuODs+ODieODqeOCpOODs+OBruODkeODvOOCuVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gYXJndiAgICAgICDlvJXmlbDjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gW29wdGlvbnNdICDjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAqIEByZXR1cm5zIHtJQ29tbWFuZExpbmVJbmZvfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHBhcnNlKGFyZ3Y6IHN0cmluZ1tdLCBvcHRpb25zPzogYW55KTogSUNvbW1hbmRMaW5lSW5mbyB7XHJcbiAgICAgICAgY29uc3QgY21kbGluZSA9IDxJQ29tbWFuZExpbmVJbmZvPntcclxuICAgICAgICAgICAgcGtnRGlyOiB0aGlzLmdldFBhY2thZ2VEaXJlY3RvcnkoYXJndiksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHBrZzogYW55O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBwa2cgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oY21kbGluZS5wa2dEaXIsIFwicGFja2FnZS5qc29uXCIpLCBcInV0ZjhcIikudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJwYWNrYWdlLmpzb24gcGFyc2UgZXJyb3I6IFwiICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLnZlcnNpb24ocGtnLnZlcnNpb24pXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItZiwgLS1mb3JjZVwiLCBcIkNvbnRpbnVlIGV4ZWN1dGlvbiBldmVuIGlmIGluIGVycm9yIHNpdHVhdGlvblwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXQsIC0tdGFyZ2V0ZGlyIDxwYXRoPlwiLCBcIlNwZWNpZnkgcHJvamVjdCB0YXJnZXQgZGlyZWN0b3J5XCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItYywgLS1jb25maWcgPHBhdGg+XCIsIFwiU3BlY2lmeSBjb25maWcgZmlsZSBwYXRoXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItdiwgLS12ZXJib3NlXCIsIFwiU2hvdyBkZWJ1ZyBtZXNzYWdlcy5cIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1zLCAtLXNpbGVudFwiLCBcIlJ1biBhcyBzaWxlbnQgbW9kZS5cIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi0tbm8tbWluaWZ5XCIsIFwiTm90IG1pbmlmaWVkIG9uIHJlbGVhc2UuXCIpXHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCJpbml0XCIpXHJcbiAgICAgICAgICAgIC5kZXNjcmlwdGlvbihcImluaXQgcHJvamVjdFwiKVxyXG4gICAgICAgICAgICAuYWN0aW9uKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNtZGxpbmUuYWN0aW9uID0gXCJpbml0XCI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIi0taGVscFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgRXhhbXBsZXM6XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgaW5pdFwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcImNyZWF0ZSA8dGFyZ2V0PlwiKVxyXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJjcmVhdGUgYm9pbGVycGxhdGUgZm9yICdsaWJyYXJ5LCBtb2R1bGUnIHwgJ21vYmlsZSwgYXBwJyB8ICdkZXNrdG9wJyB8ICd3ZWInXCIpXHJcbiAgICAgICAgICAgIC5hY3Rpb24oKHRhcmdldDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoL14obW9kdWxlfGFwcHxsaWJyYXJ5fG1vYmlsZXxkZXNrdG9wfHdlYikkL2kudGVzdCh0YXJnZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kbGluZS5hY3Rpb24gPSBcImNyZWF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcIm1vZHVsZVwiID09PSBjbWRsaW5lLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLnRhcmdldCA9IFwibGlicmFyeVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJhcHBcIiA9PT0gY21kbGluZS50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSBcIm1vYmlsZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkLnVuZGVybGluZShcIiAgdW5zdXBwb3J0ZWQgdGFyZ2V0OiBcIiArIHRhcmdldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKFwiLS1oZWxwXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICBFeGFtcGxlczpcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgbGlicmFyeVwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgbW9iaWxlXCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBhcHAgLWMgc2V0dGluZy5qc29uXCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiKlwiLCBudWxsLCB7IG5vSGVscDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICAuYWN0aW9uKChjbWQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZC51bmRlcmxpbmUoXCIgIHVuc3VwcG9ydGVkIGNvbW1hbmQ6IFwiICsgY21kKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXIucGFyc2UoYXJndik7XHJcblxyXG4gICAgICAgIGlmIChhcmd2Lmxlbmd0aCA8PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNtZGxpbmUuY2xpT3B0aW9ucyA9IHRoaXMudG9Db21tYW5kTGluZU9wdGlvbnMoY29tbWFuZGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNtZGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIENMSSDjga7jgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6rjgpLlj5blvpdcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmdbXX0gYXJndiDlvJXmlbBcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ30g44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44OqXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFBhY2thZ2VEaXJlY3RvcnkoYXJndjogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGV4ZWNEaXIgPSBwYXRoLmRpcm5hbWUoYXJndlsxXSk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihleGVjRGlyLCBcIi4uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ0xJIG9wdGlvbiDjgpIgSUNvbW1hbmRMaW5lT3B0aW9ucyDjgavlpInmj5tcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbW1hbmRlciBwYXJzZSDmuIjjgb8gY29tYW5uZGVyIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICogQHJldHVybiB7SUNvbW1hbmRMaW5lT3B0aW9uc30gb3B0aW9uIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyB0b0NvbW1hbmRMaW5lT3B0aW9ucyhjb21tYW5kOiBhbnkpOiBJQ29tbWFuZExpbmVPcHRpb25zIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmb3JjZTogISFjb21tYW5kLmZvcmNlLFxyXG4gICAgICAgICAgICB0YXJnZXREaXI6IGNvbW1hbmQudGFyZ2V0ZGlyLFxyXG4gICAgICAgICAgICBjb25maWc6IGNvbW1hbmQuY29uZmlnLFxyXG4gICAgICAgICAgICB2ZXJib3NlOiAhIWNvbW1hbmQudmVyYm9zZSxcclxuICAgICAgICAgICAgc2lsZW50OiAhIWNvbW1hbmQuc2lsZW50LFxyXG4gICAgICAgICAgICBtaW5pZnk6IGNvbW1hbmQubWluaWZ5LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5jjg6vjg5fooajnpLrjgZfjgabntYLkuoZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hvd0hlbHAoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaW5mb3JtID0gKHRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hhbGsuZ3JlZW4odGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb21tYW5kZXIub3V0cHV0SGVscCg8YW55PmluZm9ybSk7XHJcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY29tbWFuZC1wYXJzZXIudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21tYW5kZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gXCIuL2RlZmF1bHQtY29uZmlnXCI7XHJcblxyXG5jb25zdCAkICAgICAgICAgICAgID0gVXRpbHMuJDtcclxuY29uc3QgY2hhbGsgICAgICAgICA9IFV0aWxzLmNoYWxrO1xyXG5jb25zdCBzZW12ZXJSZWdleCAgID0gVXRpbHMuc2VtdmVyUmVnZXg7XHJcbmNvbnN0IGxpYkNvbmZpZyAgICAgPSBkZWZhdWx0Q29uZmlnLmxpYnJhcnk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdExpYnJhcnlcclxuICogQGJyaWVmIOODqeOCpOODluODqeODquODouOCuOODpeODvOODq+eUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdExpYnJhcnkgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIC8vIHByb2plY3QgY29tbW9uIHNldHRuaWdzIChJUHJvamVjdENvbmZpZ3JhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJwcm9qZWN0TmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ucHJvamVjdE5hbWUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5wcm9qZWN0TmFtZSB8fCBcImNvb2wtcHJvamVjdC1uYW1lXCIsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEvXlthLXpBLVowLTkvQC5fLV0rJC8udGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnByb2plY3ROYW1lLmludmFsaWRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwidmVyc2lvblwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnZlcnNpb24gfHwgXCIwLjAuMVwiLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VtdmVyUmVnZXgoKS5leGVjKHZhbHVlKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibGljZW5zZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLmFwYWNoZTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkFwYWNoZS0yLjBcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLm1pdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTUlUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5wcm9wcmlldGFyeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTk9ORVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubGljZW5zZSB8fCBcIk5PTkVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiZW52XCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmxpYnJhcnkuZW52Lm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lbnYuY2hvaWNlcy5icm93c2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ3ZWJcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMubm9kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9kZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMuZWxlY3Ryb24gKyB0aGlzLkxJTUlUQVRJT04oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZWxlY3Ryb25cIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMuZWxlY3Ryb25SZW5kZXJlciArIHRoaXMuTElNSVRBVElPTigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlbGVjdHJvbi1yZW5kZXJlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaWJDb25maWcuRUxFQ1RST05fQVZBSUxBQkxFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiZWxlY3Ryb25cIiA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibm9kZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJlbGVjdHJvbi1yZW5kZXJlclwiID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ3ZWJcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5lbnYgfHwgXCJ3ZWJcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gYmFzZSBzdHJ1Y3R1cmVcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImV4dHJhU2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5yZWNvbW1lbmRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwicmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXh0cmFTZXR0aW5ncy5jaG9pY2VzLmN1c3RvbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY3VzdG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZXh0cmFTZXR0aW5ncyB8fCBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKGN1c3RvbTogbW9kdWxlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibW9kdWxlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLm5vbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMuY29tbW9uanMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoXCJhbWRcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZSB8fCBcImNvbW1vbmpzXCIpIDogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzICYmIC9eKG5vZGV8ZWxlY3Ryb24pJC9pLnRlc3QoYW5zd2Vycy5lbnYpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZHVsZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy5ub25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmFtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoXCJjb21tb25qc1wiICE9PSB0aGlzLmFuc3dlcnMubW9kdWxlKSA/ICh0aGlzLmFuc3dlcnMubW9kdWxlIHx8IFwiYW1kXCIpIDogXCJhbWRcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiBcIndlYlwiID09PSBhbnN3ZXJzLmVudjtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMubm9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy5jb21tb25qcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMuYW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJhbWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMudW1kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ1bWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5tb2R1bGUgfHwgXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzICYmIFwiZWxlY3Ryb24tcmVuZGVyZXJcIiA9PT0gYW5zd2Vycy5lbnY7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IGVzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiZXNcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVzLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lcy5jaG9pY2VzLmVzNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXM1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVzLmNob2ljZXMuZXMyMDE1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJlczIwMTVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5lcyB8fCAoXCJ3ZWJcIiA9PT0gdGhpcy5hbnN3ZXJzLmVudiA/IFwiZXM1XCIgOiBcImVzMjAxNVwiKSxcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZzogSUxpYnJhcnlDb25maWdyYXRpb24gPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGFuc3dlcnMuZW52KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwid2ViXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuYnJvd3NlciwgYW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibm9kZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLm5vZGUsIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImVsZWN0cm9uXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuZWxlY3Ryb24sIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImVsZWN0cm9uLXJlbmRlcmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBsaWJDb25maWcuZWxlY3Ryb24sIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcInVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyBhbnN3ZXJzLmVudikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW1xyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXh0cmFTZXR0aW5nc1wiLCAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJwcm9qZWN0TmFtZVwiLCAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInZlcnNpb25cIiwgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwibGljZW5zZVwiLCAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJlbnZcIiwgICAgICAgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcIm1vZHVsZVwiLCAgICAgICAgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXNcIiwgICAgICAgICAgICAgICByZWNvbW1lbmQ6IHRydWUgICAgIH0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSAoaXRlbS5yZWNvbW1lbmQgJiYgXCJyZWNvbW1lbmRlZFwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3MpID8gXCJ5ZWxsb3dcIiA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29uZmlnMmRlc2NyaXB0aW9uKGNvbmZpZywgaXRlbS5uYW1lLCBjb2xvcikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcImVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yLCBudWxsLCA0KSkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcml2YXRlIG1ldGhvZHM6XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBlbGVjdHJvbiDjgYzmnInlirnlh7rjgarjgYTloLTlkIjjga7oo5zotrPmloflrZfjgpLlj5blvpdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBMSU1JVEFUSU9OKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGxpYkNvbmZpZy5FTEVDVFJPTl9BVkFJTEFCTEUgPyBcIlwiIDogXCIgXCIgKyB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5zdGlsTm90QXZhaWxhYmxlO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LWxpYnJhcnkudHMiLCJpbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSUV4dGVybmFsTW9kdWxlSW5mbyxcclxuICAgIElNb2JpbGVBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuaW1wb3J0IGRlZmF1bHRDb25maWcgZnJvbSBcIi4vZGVmYXVsdC1jb25maWdcIjtcclxuXHJcbmNvbnN0ICQgICAgICAgICAgICAgPSBVdGlscy4kO1xyXG5jb25zdCBfICAgICAgICAgICAgID0gVXRpbHMuXztcclxuY29uc3QgY2hhbGsgICAgICAgICA9IFV0aWxzLmNoYWxrO1xyXG5jb25zdCBzZW12ZXJSZWdleCAgID0gVXRpbHMuc2VtdmVyUmVnZXg7XHJcbmNvbnN0IG1vYmlsZUNvbmZpZyAgPSBkZWZhdWx0Q29uZmlnLm1vYmlsZTtcclxuXHJcbmNvbnN0IEVYVEVSTkFMX0RFRkFVTFRTID0gKCgpID0+IHtcclxuICAgIGNvbnN0IGRlZmF1bHRzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgT2JqZWN0LmtleXMobW9iaWxlQ29uZmlnLmJyb3dzZXIuZXh0ZXJuYWwpXHJcbiAgICAgICAgLmZvckVhY2goKHRhcmdldCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobW9iaWxlQ29uZmlnLmJyb3dzZXIuZXh0ZXJuYWxbdGFyZ2V0XS5yZWd1bGFyKSB7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0cy5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIHJldHVybiBkZWZhdWx0cztcclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0TW9iaWxlQXBwXHJcbiAqIEBicmllZiDjg6Ljg5DjgqTjg6vjgqLjg5fjg6rnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHRNb2JpbGVBcHAgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIGNvbnN0IHBsYXRmb3Jtc19kZWZhdWx0ID0gdGhpcy5hbnN3ZXJzLnBsYXRmb3Jtc1xyXG4gICAgICAgICAgICA/IHRoaXMuYW5zd2Vycy5wbGF0Zm9ybXMuc2xpY2UoKVxyXG4gICAgICAgICAgICA6IG1vYmlsZUNvbmZpZy5icm93c2VyLnBsYXRmb3JtcztcclxuICAgICAgICBkZWxldGUgdGhpcy5hbnN3ZXJzLnBsYXRmb3JtcztcclxuXHJcbiAgICAgICAgY29uc3QgcHJvamVjdFN0cnVjdHVyZV9kZWZhdWx0ID0gdGhpcy5hbnN3ZXJzLnByb2plY3RTdHJ1Y3R1cmVcclxuICAgICAgICAgICAgPyB0aGlzLmFuc3dlcnMucHJvamVjdFN0cnVjdHVyZS5zbGljZSgpXHJcbiAgICAgICAgICAgIDogbW9iaWxlQ29uZmlnLmJyb3dzZXIucHJvamVjdFN0cnVjdHVyZTtcclxuICAgICAgICBkZWxldGUgdGhpcy5hbnN3ZXJzLnByb2plY3RTdHJ1Y3R1cmU7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4dGVybmFsX2RlZmF1bHQgPSB0aGlzLmFuc3dlcnMuZXh0ZXJuYWxcclxuICAgICAgICAgICAgPyB0aGlzLmFuc3dlcnMuZXh0ZXJuYWwuc2xpY2UoKVxyXG4gICAgICAgICAgICA6IEVYVEVSTkFMX0RFRkFVTFRTO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmFuc3dlcnMuZXh0ZXJuYWw7XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIC8vIHByb2plY3QgY29tbW9uIHNldHRuaWdzIChJUHJvamVjdENvbmZpZ3JhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJhcHBOYW1lXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5hcHBOYW1lLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuYXBwTmFtZSB8fCBcIkNvb2wgQXBwIE5hbWVcIixcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoL14uKlsoXFxcXHwvfDp8Knw/fFwifDx8Pnx8KV0uKiQvLnRlc3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5hcHBOYW1lLmludmFsaWRNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwicHJvamVjdE5hbWVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnByb2plY3ROYW1lLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfLnRyaW0oXy5kYXNoZXJpemUoYW5zd2Vycy5hcHBOYW1lLnRvTG93ZXJDYXNlKCkpLCBcIi1cIik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghL15bYS16QS1aMC05Xy1dKiQvLnRlc3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImFwcElkXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5hcHBJZC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmFwcElkIHx8IFwib3JnLmNvb2wuYXBwbmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwidmVyc2lvblwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLnZlcnNpb24gfHwgXCIwLjAuMVwiLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VtdmVyUmVnZXgoKS5leGVjKHZhbHVlKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibGljZW5zZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLmFwYWNoZTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkFwYWNoZS0yLjBcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLm1pdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTUlUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5wcm9wcmlldGFyeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTk9ORVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmxpY2Vuc2UgfHwgXCJOT05FXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm1zXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5wbGF0Zm9ybXMubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiYW5kcm9pZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBwbGF0Zm9ybXNfZGVmYXVsdC5pbmRleE9mKFwiYW5kcm9pZFwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiaW9zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IHBsYXRmb3Jtc19kZWZhdWx0LmluZGV4T2YoXCJpb3NcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiZXh0cmFTZXR0aW5nc1wiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXh0cmFTZXR0aW5ncy5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXh0cmFTZXR0aW5ncy5jaG9pY2VzLnJlY29tbWVuZGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJyZWNvbW1lbmRlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLmNob2ljZXMuY3VzdG9tLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjdXN0b21cIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5leHRyYVNldHRpbmdzIHx8IFwicmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJwcm9qZWN0U3RydWN0dXJlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5wcm9qZWN0U3RydWN0dXJlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5wcm9qZWN0U3RydWN0dXJlLmxpYixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibGliXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IHByb2plY3RTdHJ1Y3R1cmVfZGVmYXVsdC5pbmRleE9mKFwibGliXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUucHJvamVjdFN0cnVjdHVyZS5wb3J0aW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJwb3J0aW5nXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IHByb2plY3RTdHJ1Y3R1cmVfZGVmYXVsdC5pbmRleE9mKFwicG9ydGluZ1wiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImV4dGVybmFsXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgcGFnaW5hdGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgaW5xdWlyZXIuU2VwYXJhdG9yKHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLnNlcGFyYXRvci5jb3Jkb3ZhKSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImNvcmRvdmEtcGx1Z2luLWNkcC1uYXRpdmVicmlkZ2VcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYW5zd2Vycy5wbGF0Zm9ybXMgfHwgYW5zd2Vycy5wbGF0Zm9ybXMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubm9Db3Jkb3ZhTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImNvcmRvdmEtcGx1Z2luLWluYXBwYnJvd3NlclwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29yZG92YS1wbHVnaW4taW5hcHBicm93c2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImNvcmRvdmEtcGx1Z2luLWluYXBwYnJvd3NlclwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbnN3ZXJzLnBsYXRmb3JtcyB8fCBhbnN3ZXJzLnBsYXRmb3Jtcy5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5ub0NvcmRvdmFNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tb2R1bGVzW1wiY29yZG92YS1wbHVnaW4tYXBwLXZlcnNpb25cIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvcmRvdmEtcGx1Z2luLWFwcC12ZXJzaW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImNvcmRvdmEtcGx1Z2luLWFwcC12ZXJzaW9uXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuc3dlcnMucGxhdGZvcm1zIHx8IGFuc3dlcnMucGxhdGZvcm1zLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm5vQ29yZG92YU1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBuZXcgaW5xdWlyZXIuU2VwYXJhdG9yKHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLnNlcGFyYXRvci51dGlscyksXHJcbiAgICAgICAgICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJob2dhbi5qc1wiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiaG9nYW4uanNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZDogKDAgPD0gZXh0ZXJuYWxfZGVmYXVsdC5pbmRleE9mKFwiaG9nYW4uanNcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tb2R1bGVzW1wiaGFtbWVyanNcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImhhbW1lcmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImhhbW1lcmpzXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImlzY3JvbGxcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImlzY3JvbGxcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZDogKDAgPD0gZXh0ZXJuYWxfZGVmYXVsdC5pbmRleE9mKFwiaXNjcm9sbFwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJmbGlwc25hcFwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZmxpcHNuYXBcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZDogKDAgPD0gZXh0ZXJuYWxfZGVmYXVsdC5pbmRleE9mKFwiZmxpcHNuYXBcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby1zdHJpbmctbGl0ZXJhbCAqL1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZzogSU1vYmlsZUFwcENvbmZpZ3JhdGlvbiA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRzID0gJC5leHRlbmQoe30sIG1vYmlsZUNvbmZpZy5icm93c2VyKTtcclxuICAgICAgICAgICAgY29uc3QgbG9va3VwID0gZGVmYXVsdHMuZXh0ZXJuYWw7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBkZWZhdWx0cy5leHRlcm5hbDtcclxuICAgICAgICAgICAgY29uc3QgX2NvbmZpZzogSU1vYmlsZUFwcENvbmZpZ3JhdGlvbiA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywge1xyXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWw6IEVYVEVSTkFMX0RFRkFVTFRTLFxyXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzOiBbXSxcclxuICAgICAgICAgICAgICAgIGRldkRlcGVuZGVuY2llczogW10sXHJcbiAgICAgICAgICAgICAgICBjb3Jkb3ZhX3BsdWdpbjogW10sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZV9hZGRvbjogW10sXHJcbiAgICAgICAgICAgIH0sIGFuc3dlcnMpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVEZXBlbmRlbmNpZXMgPSAobW9kdWxlTmFtZTogc3RyaW5nLCBpbmZvOiBJRXh0ZXJuYWxNb2R1bGVJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChpbmZvLmFjcXVpc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJucG1cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb25maWcuZGVwZW5kZW5jaWVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1vZHVsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXM6IGluZm8uYWxpYXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsRXhwb3J0OiBpbmZvLmdsb2JhbEV4cG9ydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZW5kZXJOYW1lOiBpbmZvLnZlbmRlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGluZm8uZmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibnBtOmRldlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NvbmZpZy5kZXZEZXBlbmRlbmNpZXMucHVzaCh7IG5hbWU6IG1vZHVsZU5hbWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNvcmRvdmFcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgwIDwgX2NvbmZpZy5wbGF0Zm9ybXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NvbmZpZy5jb3Jkb3ZhX3BsdWdpbi5wdXNoKHsgbmFtZTogbW9kdWxlTmFtZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmVzb3VyY2VcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb25maWcucmVzb3VyY2VfYWRkb24ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbW9kdWxlTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGlhczogaW5mby5hbGlhcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IGluZm8uZ2xvYmFsRXhwb3J0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlbmRlck5hbWU6IGluZm8udmVuZGVyTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogaW5mby5maWxlTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAoPGFueT5fY29uZmlnKS5leHRlcm5hbC5mb3JFYWNoKCh0b3A6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZm8gPSA8SUV4dGVybmFsTW9kdWxlSW5mbz5sb29rdXBbdG9wXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWxpZCA9IHJlc29sdmVEZXBlbmRlbmNpZXModG9wLCBpbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWQgJiYgaW5mby5zdWJzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoaW5mby5zdWJzZXQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoc3ViKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZURlcGVuZGVuY2llcyhzdWIsIDxJRXh0ZXJuYWxNb2R1bGVJbmZvPmluZm8uc3Vic2V0W3N1Yl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcImVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yLCBudWxsLCA0KSkpO1xyXG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkZWxldGUgX2NvbmZpZy5leHRlcm5hbDtcclxuICAgICAgICAgICAgcmV0dXJuIF9jb25maWc7XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJleHRyYVNldHRpbmdzXCIsICAgIGZpeGVkOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXBwTmFtZVwiLCAgICAgICAgICBmaXhlZDogZmFsc2UgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInByb2plY3ROYW1lXCIsICAgICAgZml4ZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJhcHBJZFwiLCAgICAgICAgICAgIGZpeGVkOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwidmVyc2lvblwiLCAgICAgICAgICBmaXhlZDogZmFsc2UgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImxpY2Vuc2VcIiwgICAgICAgICAgZml4ZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJtb2R1bGVcIiwgICAgICAgICAgIGZpeGVkOiB0cnVlICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXNcIiwgICAgICAgICAgICAgICBmaXhlZDogdHJ1ZSAgfSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IChpdGVtLmZpeGVkKSA/IFwieWVsbG93XCIgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbmZpZzJkZXNjcmlwdGlvbihjb25maWcsIGl0ZW0ubmFtZSwgY29sb3IpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvciwgbnVsbCwgNCkpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcGxhdGZvcm1zXHJcbiAgICAgICAgY29uc3QgcGxhdGZvcm1JbmZvID0gKDAgPCBjb25maWcucGxhdGZvcm1zLmxlbmd0aClcclxuICAgICAgICAgICAgPyBjb25maWcucGxhdGZvcm1zLmpvaW4oXCIsIFwiKVxyXG4gICAgICAgICAgICA6IHRoaXMubGFuZy5zZXR0aW5ncy5tb2JpbGUucGxhdGZvcm1zLm5vbmU7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIHRoaXMubGFuZy5zZXR0aW5ncy5tb2JpbGUucGxhdGZvcm1zLmxhYmVsICsgY2hhbGsuY3lhbihwbGF0Zm9ybUluZm8pKTtcclxuXHJcbiAgICAgICAgY29uc3QgQ09MT1IgPSAoXCJyZWNvbW1lbmRlZFwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3MpID8gXCJ5ZWxsb3dcIiA6IFwiY3lhblwiO1xyXG5cclxuICAgICAgICAvLyBhZGRpdGlvbmFsIHByb2plY3Qgc3RydWN0dXJlXHJcbiAgICAgICAgaWYgKDAgPCBjb25maWcucHJvamVjdFN0cnVjdHVyZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJvamVjdFN0cnVjdHVyZSA9IGNvbmZpZy5wcm9qZWN0U3RydWN0dXJlLmpvaW4oXCIsIFwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIHRoaXMubGFuZy5zZXR0aW5ncy5tb2JpbGUucHJvamVjdFN0cnVjdHVyZS5sYWJlbCArIGNoYWxrW0NPTE9SXShwcm9qZWN0U3RydWN0dXJlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGRpdGlvbmFsIGNvcmRvdmEgcGx1Z2luXHJcbiAgICAgICAgaWYgKDAgPCBjb25maWcuY29yZG92YV9wbHVnaW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLmNvcmRvdmFQbHVnaW5zLmxhYmVsKTtcclxuICAgICAgICAgICAgY29uZmlnLmNvcmRvdmFfcGx1Z2luLmZvckVhY2goKGluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIFwiICsgY2hhbGtbQ09MT1JdKGluZm8ubmFtZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFkZGl0aW9uYWwgZGVwZW5kZW5jeVxyXG4gICAgICAgIGlmICgwIDwgY29uZmlnLmRlcGVuZGVuY2llcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIHRoaXMubGFuZy5zZXR0aW5ncy5tb2JpbGUuZGVwZW5kZW5jaWVzLmxhYmVsKTtcclxuICAgICAgICAgICAgY29uZmlnLnJlc291cmNlX2FkZG9uLmZvckVhY2goKGluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiICAgIFwiICsgY2hhbGtbQ09MT1JdKGluZm8ubmFtZSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29uZmlnLmRlcGVuZGVuY2llcy5mb3JFYWNoKChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBcIiArIGNoYWxrW0NPTE9SXShpbmZvLm5hbWUpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LW1vYmlsZS50cyIsIi8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElEZXNrdG9wQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHREZXNrdG9wQXBwXHJcbiAqIEBicmllZiDjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHREZXNrdG9wQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KFwiZGVza3RvcCBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICAvLyBUT0RPOiBzaG93XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtZGVza3RvcC50cyIsIi8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElXZWJBcHBDb25maWdyYXRpb24sXHJcbiAgICBVdGlscyxcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxuICAgIElBbnN3ZXJTY2hlbWEsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdFdlYkFwcFxyXG4gKiBAYnJpZWYg44Km44Kn44OW44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0V2ViQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KFwid2ViIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICAvLyBUT0RPOlxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIC8vIFRPRE86IHNob3dcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC13ZWIudHMiXX0=
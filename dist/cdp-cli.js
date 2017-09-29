/*!
 * cdp-cli.js 0.0.2
 *
 * Date: 2017-09-28T10:47:01.203Z
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjYzZGY5Yzk3OWM4Y2MwNDA5NzAiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn0iLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtYmFzZS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImlucXVpcmVyXCIsXCJjb21tb25qczJcIjpcImlucXVpcmVyXCJ9Iiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvY2RwLWNsaS50cyIsImNkcDovLy9jZHAtY2xpL2NvbW1hbmQtcGFyc2VyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY29tbWFuZGVyXCIsXCJjb21tb25qczJcIjpcImNvbW1hbmRlclwifSIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1saWJyYXJ5LnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LW1vYmlsZS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1kZXNrdG9wLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LXdlYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztB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QUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQW5DRCw0Q0FtQ0M7Ozs7Ozs7OztBQ3ZERCxzREFBc0Q7QUFDdEQsbUNBQW1DOztBQUduQyx5Q0FJaUI7QUFDakIsNkNBR3VCO0FBRXZCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUM7QUFFMUI7OztHQUdHO0FBQ0gsa0JBQTBCLFNBQVEsd0JBQVU7SUFFeEMsdUVBQXVFO0lBQ3ZFLGlCQUFpQjtJQUVqQjs7T0FFRztJQUNJLFNBQVMsQ0FBQyxPQUFZO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxNQUFNLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCx1RUFBdUU7SUFDdkUsOEJBQThCO0lBRTlCOztPQUVHO0lBQ0gsSUFBSSxTQUFTO1FBQ1QsUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCx3QkFBd0IsQ0FBQyxPQUFzQjtRQUMzQyxhQUFhO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFuQ0Qsb0NBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjYzZGY5Yzk3OWM4Y2MwNDA5NzAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjZHAtbGliXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn1cbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHsgSUNvbW1hbmRMaW5lSW5mbyB9IGZyb20gXCIuL2NvbW1hbmQtcGFyc2VyXCI7XHJcblxyXG5jb25zdCBmcyAgICA9IFV0aWxzLmZzO1xyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5jb25zdCBfICAgICA9IFV0aWxzLl87XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJQW5zd2VyU2NoZW1hXHJcbiAqIEBicmllZiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OI44Gu44K544Kt44O844Oe5a6a576p44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElBbnN3ZXJTY2hlbWFcclxuICAgIGV4dGVuZHMgaW5xdWlyZXIuQW5zd2VycywgSVByb2plY3RDb25maWdyYXRpb24sIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbiB7XHJcbiAgICAvLyDlhbHpgJrmi6HlvLXlrprnvqlcclxuICAgIGV4dHJhU2V0dGluZ3M6IFwicmVjb21tZW5kZWRcIiB8IFwiY3VzdG9tXCI7XHJcbn1cclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdEJhc2VcclxuICogQGJyaWVmIFByb21wdCDjga7jg5njg7zjgrnjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICBwcml2YXRlIF9jbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvO1xyXG4gICAgcHJpdmF0ZSBfYW5zd2VycyA9IDxJQW5zd2VyU2NoZW1hPnt9O1xyXG4gICAgcHJpdmF0ZSBfbG9jYWxlID0ge307XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvKTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHRoaXMuX2NtZEluZm8gPSBjbWRJbmZvO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1Byb2xvZ3VlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5xdWlyZUxhbmd1YWdlKClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnF1aXJlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHNldHRpbmdzOiBJUHJvamVjdENvbmZpZ3JhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlrZSBjb3dzYXlcclxuICAgICAqIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Nvd3NheVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2F5KG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IEdSRUVUSU5HID1cclxuICAgICAgICAgICAgXCJcXG4gIOKJoSAgICAgXCIgKyBjaGFsay5jeWFuKFwi4oin77y/4oinXCIpICsgXCIgICAg77yP77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+jXCIgK1xyXG4gICAgICAgICAgICBcIlxcbiAgICDiiaEgXCIgKyBjaGFsay5jeWFuKFwi77yIIMK04oiA772A77yJXCIpICsgXCLvvJwgIFwiICsgY2hhbGsueWVsbG93KG1lc3NhZ2UpICtcclxuICAgICAgICAgICAgXCJcXG4gIOKJoSAgIFwiICsgY2hhbGsuY3lhbihcIu+8iCAg44GkXCIpICsgXCLvvJ1cIiArIGNoYWxrLmN5YW4oXCLjgaRcIikgKyBcIiAg77y877y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/77y/XCIgK1xyXG4gICAgICAgICAgICBcIlxcbiAgICDiiaEgIFwiICsgY2hhbGsuY3lhbihcIu+9nCDvvZwgfFwiKSArIFwi77y8XCIgK1xyXG4gICAgICAgICAgICBcIlxcbiAgICDiiaEgXCIgKyBjaGFsay5jeWFuKFwi77yIX++8v++8ie+8v++8iVwiKSArIFwi77y8XCIgK1xyXG4gICAgICAgICAgICBcIlxcbiAg4omhICAgXCIgKyBjaGFsay5yZWQoXCLil45cIikgKyBcIu+/o++/o++/o++/o1wiICsgY2hhbGsucmVkKFwi4peOXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEdSRUVUSU5HKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODreODvOOCq+ODqeOCpOOCuuODquOCveODvOOCueOBq+OCouOCr+OCu+OCuVxyXG4gICAgICogZXgpIHRoaXMubGFuZy5wcm9tcHQucHJvamVjdE5hbWUubWVzc2FnZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0g44Oq44K944O844K544Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgbGFuZygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBhYnN0cmFjdCBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucztcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumuOBrueiuuiqjVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3JhdGlvbn0g6Kit5a6a5YCk44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGFic3RyYWN0IGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb247XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByb3RlY3RlZCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqK3lrprlgKTjgavjgqLjgq/jgrvjgrlcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuc3dlciDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGdldCBhbnN3ZXJzKCk6IElBbnN3ZXJTY2hlbWEge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbnN3ZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvbG9ndWUg44Kz44Oh44Oz44OI44Gu6Kit5a6aXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBnZXQgcHJvbG9ndWVDb21tZW50KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiV2VsY29tZSB0byBDRFAgQm9pbGVycGxhdGUgR2VuZXJhdG9yIVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2VsY29tZSDooajnpLpcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHNob3dQcm9sb2d1ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikpO1xyXG4gICAgICAgIHRoaXMuc2F5KHRoaXMucHJvbG9ndWVDb21tZW50KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuc3dlciDjgqrjg5bjgrjjgqfjgq/jg4gg44Gu5pu05pawXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCB1cGRhdGVBbnN3ZXJzKHVwZGF0ZTogSUFuc3dlclNjaGVtYSk6IElBbnN3ZXJTY2hlbWEge1xyXG4gICAgICAgIHJldHVybiBfLm1lcmdlKHRoaXMuX2Fuc3dlcnMsIHVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrppcclxuICAgICAqIOWIhuWykOOBjOW/heimgeOBquWgtOWQiOOBr+OCquODvOODkOODvOODqeOCpOODieOBmeOCi+OBk+OBqFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgaW5xdWlyZVNldHRpbmdzKCk6IFByb21pc2U8SUFuc3dlclNjaGVtYT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGlucXVpcmVyLnByb21wdCh0aGlzLnF1ZXN0aW9ucylcclxuICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXJzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSg8SUFuc3dlclNjaGVtYT5hbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldHRpbmcg44GL44KJIOioreWumuiqrOaYjuOBruS9nOaIkFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gY29uZmlnIOioreWumlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBpdGVtTmFtZSDoqK3lrprpoIXnm67lkI1cclxuICAgICAqIEByZXR1cm4ge1N0cmluZ30g6Kqs5piO5paHXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBjb25maWcyZGVzY3JpcHRpb24oY29uZmlnOiBPYmplY3QsIGl0ZW1OYW1lOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcgPSBcImN5YW5cIik6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMubGFuZy5zZXR0aW5nc1tpdGVtTmFtZV07XHJcbiAgICAgICAgaWYgKG51bGwgPT0gaXRlbSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcImVycm9yLiBpdGVtIG5vdCBmb3VuZC4gaXRlbSBuYW1lOiBcIiArIGl0ZW1OYW1lKSk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHByb3A6IHN0cmluZyA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5wcm9wc1tjb25maWdbaXRlbU5hbWVdXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChcImJvb2xlYW5cIiA9PT0gdHlwZW9mIGNvbmZpZ1tpdGVtTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmJvb2xbY29uZmlnW2l0ZW1OYW1lXSA/IFwieWVzXCIgOiBcIm5vXCJdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1tpdGVtTmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gaXRlbS5sYWJlbCArIGNoYWxrW2NvbG9yXShwcm9wKTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg63jg7zjgqvjg6njgqTjgrrjg6rjgr3jg7zjgrnjga7jg63jg7zjg4lcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkTGFuZ3VhZ2UobG9jYWxlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2NhbGUgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhcclxuICAgICAgICAgICAgICAgIHBhdGguam9pbih0aGlzLl9jbWRJbmZvLnBrZ0RpciwgXCJyZXMvbG9jYWxlcy9tZXNzYWdlcy5cIiArIGxvY2FsZSArIFwiLmpzb25cIiksIFwidXRmOFwiKS50b1N0cmluZygpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJMYW5ndWFnZSByZXNvdXJjZSBKU09OIHBhcnNlIGVycm9yOiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiogOiqnumBuOaKnlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlucXVpcmVMYW5ndWFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbiA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImxhbmd1YWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJQbGVhc2UgY2hvb3NlIHlvdXIgcHJlZmVycmVkIGxhbmd1YWdlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJFbmdsaXNoL+iLseiqnlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZW4tVVNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJKYXBhbmVzZS/ml6XmnKzoqp5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImphLUpQXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGlucXVpcmVyLnByb21wdChxdWVzdGlvbilcclxuICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRMYW5ndWFnZShhbnN3ZXIubGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOioreWumueiuuiqjVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNvbmZpcm1TZXR0aW5ncygpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5kaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnModGhpcy5fYW5zd2Vycyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrOiBcIiArIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmNvbmZpcm0ubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY29uZmlybVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiY29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uY29uZmlybS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGlucXVpcmVyLnByb21wdChxdWVzdGlvbilcclxuICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5zd2VyLmNvbmZpcm1hdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjb21tYW5kIGxpbmUg5oOF5aCx44KSIENvbmZpY3VyYXRpb24g44Gr5Y+N5pigXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7SVByb2plY3RDb25maWd1cmF0aW9ufSBjb25maWcg6Kit5a6aXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvamVjdENvbmZpZ3VyYXRpb259IGNvbW1hbmQgbGluZSDjgpLlj43mmKDjgZXjgZvjgZ8gY29uZmlnIOioreWumlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlZmxlY3RDb21tYW5kSW5mbyhjb25maWc6IElQcm9qZWN0Q29uZmlncmF0aW9uKTogSVByb2plY3RDb25maWdyYXRpb24ge1xyXG4gICAgICAgIGNvbmZpZy5hY3Rpb24gPSB0aGlzLl9jbWRJbmZvLmFjdGlvbjtcclxuXHJcbiAgICAgICAgKDxJQnVpbGRUYXJnZXRDb25maWdyYXRpb24+Y29uZmlnKS5taW5pZnkgPSB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMubWluaWZ5O1xyXG5cclxuICAgICAgICBjb25maWcuc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIGZvcmNlOiB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMuZm9yY2UsXHJcbiAgICAgICAgICAgIHZlcmJvc2U6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy52ZXJib3NlLFxyXG4gICAgICAgICAgICBzaWxlbnQ6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy5zaWxlbnQsXHJcbiAgICAgICAgICAgIHRhcmdldERpcjogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnRhcmdldERpcixcclxuICAgICAgICAgICAgbGFuZzogdGhpcy5sYW5nLnR5cGUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOioreWumuOCpOODs+OCv+ODqeOCr+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlucXVpcmUoKTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucXVpcmVTZXR0aW5ncygpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcnMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVBbnN3ZXJzKGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpcm1TZXR0aW5ncygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoY29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlZmxlY3RDb21tYW5kSW5mbyhjb25maWcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQocHJvYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQocHJvYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtYmFzZS50cyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImlucXVpcmVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifVxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicGF0aFwiXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7XHJcbiAgICBJTGlicmFyeUNvbmZpZ3JhdGlvbixcclxuICAgIElNb2JpbGVBcHBDb25maWdyYXRpb24sXHJcbiAgICBJRGVza3RvcEFwcENvbmZpZ3JhdGlvbixcclxuICAgIElXZWJBcHBDb25maWdyYXRpb24sXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjg6njgqTjg5bjg6njg6rjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGxpYnJhcnlPbkJyb3dzZXIgPSA8SUxpYnJhcnlDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcImxpYnJhcnlcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXM1XCIsXHJcbiAgICBtb2R1bGU6IFwidW1kXCIsXHJcbiAgICBlbnY6IFwid2ViXCIsXHJcbiAgICB0b29sczogW1wid2VicGFja1wiLCBcIm55Y1wiXSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOb2RlLmpzIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uTm9kZSA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczIwMTVcIixcclxuICAgIG1vZHVsZTogXCJjb21tb25qc1wiLFxyXG4gICAgZW52OiBcIm5vZGVcIixcclxuICAgIHRvb2xzOiBbXCJ3ZWJwYWNrXCIsIFwibnljXCJdLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIGVsZWN0cm9uIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uRWxlY3Ryb24gPSA8SUxpYnJhcnlDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcImxpYnJhcnlcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGU6IFwiY29tbW9uanNcIixcclxuICAgIGVudjogXCJlbGVjdHJvblwiLFxyXG4gICAgdG9vbHM6IFtcIndlYnBhY2tcIiwgXCJueWNcIl0sXHJcbn07XHJcblxyXG4vKipcclxuICog44OW44Op44Km44K2KGNvcmRvdmEp55Kw5aKD44Gn5YuV5L2c44GZ44KL44Oi44OQ44Kk44Or44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBtb2JpbGVPbkJyb3dzZXI6IElNb2JpbGVBcHBDb25maWdyYXRpb24gPSA8YW55PntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0VHlwZTogXCJtb2JpbGVcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXM1XCIsXHJcbiAgICBtb2R1bGU6IFwiYW1kXCIsXHJcbiAgICBlbnY6IFwid2ViXCIsXHJcbiAgICB0b29sczogW1wibnljXCJdLFxyXG4gICAgLy8gSU1vYmlsZUFwcENvbmZpZ3JhdGlvblxyXG4gICAgcGxhdGZvcm1zOiBbXCJhbmRyb2lkXCIsIFwiaW9zXCJdLFxyXG4gICAgcHJvamVjdFN0cnVjdHVyZTogW10sXHJcbiAgICBleHRlcm5hbDoge1xyXG4gICAgICAgIFwiaG9nYW4uanNcIjoge1xyXG4gICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG1cIixcclxuICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICAgICAgYWxpYXM6IFwiaG9nYW5cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiaGFtbWVyanNcIjoge1xyXG4gICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG1cIixcclxuICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICAgICAgZ2xvYmFsRXhwb3J0OiBcIkhhbW1lclwiLFxyXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJoYW1tZXJcIixcclxuICAgICAgICAgICAgc3Vic2V0OiB7XHJcbiAgICAgICAgICAgICAgICBcImpxdWVyeS1oYW1tZXJqc1wiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmVuZGVyTmFtZTogXCJoYW1tZXJqc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBcImpxdWVyeS5oYW1tZXJcIixcclxuICAgICAgICAgICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiQHR5cGVzL2hhbW1lcmpzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG06ZGV2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImNvcmRvdmEtcGx1Z2luLWNkcC1uYXRpdmVicmlkZ2VcIjoge1xyXG4gICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJjb3Jkb3ZhXCIsXHJcbiAgICAgICAgICAgIHJlZ3VsYXI6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImNvcmRvdmEtcGx1Z2luLWluYXBwYnJvd3NlclwiOiB7XHJcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcImNvcmRvdmFcIixcclxuICAgICAgICAgICAgcmVndWxhcjogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1YnNldDoge1xyXG4gICAgICAgICAgICAgICAgXCJAdHlwZXMvY29yZG92YS1wbHVnaW4taW5hcHBicm93c2VyXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG06ZGV2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImNvcmRvdmEtcGx1Z2luLWFwcC12ZXJzaW9uXCI6IHtcclxuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwiY29yZG92YVwiLFxyXG4gICAgICAgICAgICByZWd1bGFyOiBmYWxzZSxcclxuICAgICAgICAgICAgc3Vic2V0OiB7XHJcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9jb3Jkb3ZhLXBsdWdpbi1hcHAtdmVyc2lvblwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtOmRldlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ3VsYXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJpc2Nyb2xsXCI6IHtcclxuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtXCIsXHJcbiAgICAgICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IFwiSVNjcm9sbFwiLFxyXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJpc2Nyb2xsLXByb2JlXCIsXHJcbiAgICAgICAgICAgIHN1YnNldDoge1xyXG4gICAgICAgICAgICAgICAgXCJAdHlwZXMvaXNjcm9sbFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtOmRldlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ3VsYXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJmbGlwc25hcFwiOiB7XHJcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbVwiLFxyXG4gICAgICAgICAgICByZWd1bGFyOiBmYWxzZSxcclxuICAgICAgICAgICAgZ2xvYmFsRXhwb3J0OiBcIkZsaXBzbmFwXCIsXHJcbiAgICAgICAgICAgIHN1YnNldDoge1xyXG4gICAgICAgICAgICAgICAgXCJAdHlwZXMvZmxpcHNuYXBcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbTpkZXZcIixcclxuICAgICAgICAgICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGRlc2t0b3BPbkJyb3dzZXIgPSA8SURlc2t0b3BBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcImRlc2t0b3BcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXM1XCIsXHJcbiAgICBtb2R1bGU6IFwiYW1kXCIsXHJcbiAgICBlbnY6IFwid2ViXCIsXHJcbiAgICB0b29sczogW1wibnljXCJdLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqICBlbGVjdHJvbiDnkrDlooPjgafli5XkvZzjgZnjgovjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IGRlc2t0b3BPbkVsZWN0cm9uID0gPElEZXNrdG9wQXBwQ29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0VHlwZTogXCJkZXNrdG9wXCIsXHJcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cclxuICAgIGVzOiBcImVzMjAxNVwiLFxyXG4gICAgbW9kdWxlOiBcImNvbW1vbmpzXCIsXHJcbiAgICBlbnY6IFwiZWxlY3Ryb24tcmVuZGVyZXJcIixcclxuICAgIHRvb2xzOiBbXCJ3ZWJwYWNrXCIsIFwibnljXCJdLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+OCpuOCp+ODluOCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3Qgd2ViT25Ccm93c2VyID0gPElXZWJBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcIndlYlwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczVcIixcclxuICAgIG1vZHVsZTogXCJhbWRcIixcclxuICAgIGVudjogXCJ3ZWJcIixcclxufTtcclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBsaWJyYXJ5OiB7XHJcbiAgICAgICAgYnJvd3NlcjogbGlicmFyeU9uQnJvd3NlcixcclxuICAgICAgICBub2RlOiBsaWJyYXJ5T25Ob2RlLFxyXG4gICAgICAgIGVsZWN0cm9uOiBsaWJyYXJ5T25FbGVjdHJvbixcclxuICAgICAgICBFTEVDVFJPTl9BVkFJTEFCTEU6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIG1vYmlsZToge1xyXG4gICAgICAgIGJyb3dzZXI6IG1vYmlsZU9uQnJvd3NlcixcclxuICAgIH0sXHJcbiAgICBkZXNjdG9wOiB7XHJcbiAgICAgICAgYnJvd3NlcjogZGVza3RvcE9uQnJvd3NlcixcclxuICAgICAgICBlbGVjdHJvbjogZGVza3RvcE9uRWxlY3Ryb24sXHJcbiAgICB9LFxyXG4gICAgd2ViOiB7XHJcbiAgICAgICAgYnJvd3Nlcjogd2ViT25Ccm93c2VyLFxyXG4gICAgfSxcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9kZWZhdWx0LWNvbmZpZy50cyIsImltcG9ydCB7XHJcbiAgICBkZWZhdWx0IGFzIENEUExpYixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBDb21tYW5kUGFyc2VyLFxyXG4gICAgSUNvbW1hbmRMaW5lSW5mbyxcclxufSBmcm9tIFwiLi9jb21tYW5kLXBhcnNlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0QmFzZSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0TGlicmFyeSxcclxufSBmcm9tIFwiLi9wcm9tcHQtbGlicmFyeVwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0TW9iaWxlQXBwLFxyXG59IGZyb20gXCIuL3Byb21wdC1tb2JpbGVcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdERlc2t0b3BBcHAsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LWRlc2t0b3BcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdFdlYkFwcCxcclxufSBmcm9tIFwiLi9wcm9tcHQtd2ViXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5xdWlyZXIoY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbyk6IFByb21wdEJhc2Uge1xyXG4gICAgc3dpdGNoIChjbWRJbmZvLmFjdGlvbikge1xyXG4gICAgICAgIGNhc2UgXCJjcmVhdGVcIjpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoY21kSW5mby5hY3Rpb24gKyBcIiBjb21tYW5kOiB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAoY21kSW5mby50YXJnZXQpIHtcclxuICAgICAgICBjYXNlIFwibGlicmFyeVwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdExpYnJhcnkoKTtcclxuICAgICAgICBjYXNlIFwibW9iaWxlXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0TW9iaWxlQXBwKCk7XHJcbiAgICAgICAgY2FzZSBcImRlc2t0b3BcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHREZXNrdG9wQXBwKCk7XHJcbiAgICAgICAgY2FzZSBcIndlYlwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdFdlYkFwcCgpO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwidW5zdXBwb3J0ZWQgdGFyZ2V0OiBcIiArIGNtZEluZm8udGFyZ2V0KSk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBwcm9jZXNzLnRpdGxlID0gXCJjZHBcIjtcclxuICAgIGNvbnN0IGNtZEluZm8gPSBDb21tYW5kUGFyc2VyLnBhcnNlKHByb2Nlc3MuYXJndik7XHJcbiAgICBjb25zdCBpbnF1aXJlciA9IGdldElucXVpcmVyKGNtZEluZm8pO1xyXG5cclxuICAgIGlucXVpcmVyLnByb21wdGluZyhjbWRJbmZvKVxyXG4gICAgICAgIC50aGVuKChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgLy8gZXhlY3V0ZVxyXG4gICAgICAgICAgICByZXR1cm4gQ0RQTGliLmV4ZWN1dGUoY29uZmlnKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oaW5xdWlyZXIubGFuZy5maW5pc2hlZFtjbWRJbmZvLmFjdGlvbl0pKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKFwic3RyaW5nXCIgIT09IHR5cGVvZiByZWFzb24pIHtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHJlYXNvbi5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uID0gcmVhc29uLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbiA9IEpTT04uc3RyaW5naWZ5KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQocmVhc29uKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIE5PVEU6IGVzNiBwcm9taXNlJ3MgYWx3YXlzIGJsb2NrLlxyXG4gICAgICAgIH0pO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY2RwLWNsaS50cyIsImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0ICogYXMgY29tbWFuZGVyIGZyb20gXCJjb21tYW5kZXJcIjtcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5cclxuY29uc3QgZnMgICAgPSBVdGlscy5mcztcclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElDb21tYW5kTGluZU9wdGlvbnNcclxuICogQGJyaWVmICAgICDjgrPjg57jg7Pjg4njg6njgqTjg7PnlKjjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lT3B0aW9ucyB7XHJcbiAgICBmb3JjZTogYm9vbGVhbjsgICAgIC8vIOOCqOODqeODvOe2mee2mueUqFxyXG4gICAgdGFyZ2V0RGlyOiBzdHJpbmc7ICAvLyDkvZzmpa3jg4fjgqPjg6zjgq/jg4jjg6rmjIflrppcclxuICAgIGNvbmZpZzogc3RyaW5nOyAgICAgLy8g44Kz44Oz44OV44Kj44Kw44OV44Kh44Kk44Or5oyH5a6aXHJcbiAgICB2ZXJib3NlOiBib29sZWFuOyAgIC8vIOips+e0sOODreOCsFxyXG4gICAgc2lsZW50OiBib29sZWFuOyAgICAvLyBzaWxlbnQgbW9kZVxyXG4gICAgbWluaWZ5OiBib29sZWFuOyAgICAvLyBtaW5pZnkgc3VwcG9ydFxyXG59XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJQ29tbWFuZExpbmVJbmZvXHJcbiAqIEBicmllZiAgICAg44Kz44Oe44Oz44OJ44Op44Kk44Oz5oOF5aCx5qC857SN44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElDb21tYW5kTGluZUluZm8ge1xyXG4gICAgcGtnRGlyOiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgICAgLy8gQ0xJIOOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODqlxyXG4gICAgYWN0aW9uOiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgICAgLy8g44Ki44Kv44K344On44Oz5a6a5pWwXHJcbiAgICB0YXJnZXQ6IHN0cmluZzsgICAgICAgICAgICAgICAgICAgICAvLyDjgrPjg57jg7Pjg4njgr/jg7zjgrLjg4Pjg4hcclxuICAgIGluc3RhbGxlZERpcjogc3RyaW5nOyAgICAgICAgICAgICAgIC8vIENMSSDjgqTjg7Pjgrnjg4jjg7zjg6tcclxuICAgIGNsaU9wdGlvbnM6IElDb21tYW5kTGluZU9wdGlvbnM7ICAgIC8vIOOCs+ODnuODs+ODieODqeOCpOODs+OBp+a4oeOBleOCjOOBn+OCquODl+OCt+ODp+ODs1xyXG59XHJcblxyXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBDb21tYW5kUGFyc2VyXHJcbiAqIEBicmllZiDjgrPjg57jg7Pjg4njg6njgqTjg7Pjg5Hjg7zjgrXjg7xcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDb21tYW5kUGFyc2VyIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrPjg57jg7Pjg4njg6njgqTjg7Pjga7jg5Hjg7zjgrlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGFyZ3YgICAgICAg5byV5pWw44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IFtvcHRpb25zXSAg44Kq44OX44K344On44Oz44KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJucyB7SUNvbW1hbmRMaW5lSW5mb31cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwYXJzZShhcmd2OiBzdHJpbmdbXSwgb3B0aW9ucz86IGFueSk6IElDb21tYW5kTGluZUluZm8ge1xyXG4gICAgICAgIGNvbnN0IGNtZGxpbmUgPSA8SUNvbW1hbmRMaW5lSW5mbz57XHJcbiAgICAgICAgICAgIHBrZ0RpcjogdGhpcy5nZXRQYWNrYWdlRGlyZWN0b3J5KGFyZ3YpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBwa2c6IGFueTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcGtnID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGNtZGxpbmUucGtnRGlyLCBcInBhY2thZ2UuanNvblwiKSwgXCJ1dGY4XCIpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwicGFja2FnZS5qc29uIHBhcnNlIGVycm9yOiBcIiArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC52ZXJzaW9uKHBrZy52ZXJzaW9uKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLWYsIC0tZm9yY2VcIiwgXCJDb250aW51ZSBleGVjdXRpb24gZXZlbiBpZiBpbiBlcnJvciBzaXR1YXRpb25cIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi10LCAtLXRhcmdldGRpciA8cGF0aD5cIiwgXCJTcGVjaWZ5IHByb2plY3QgdGFyZ2V0IGRpcmVjdG9yeVwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLWMsIC0tY29uZmlnIDxwYXRoPlwiLCBcIlNwZWNpZnkgY29uZmlnIGZpbGUgcGF0aFwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXYsIC0tdmVyYm9zZVwiLCBcIlNob3cgZGVidWcgbWVzc2FnZXMuXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItcywgLS1zaWxlbnRcIiwgXCJSdW4gYXMgc2lsZW50IG1vZGUuXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItLW5vLW1pbmlmeVwiLCBcIk5vdCBtaW5pZmllZCBvbiByZWxlYXNlLlwiKVxyXG4gICAgICAgIDtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiaW5pdFwiKVxyXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJpbml0IHByb2plY3RcIilcclxuICAgICAgICAgICAgLmFjdGlvbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjbWRsaW5lLmFjdGlvbiA9IFwiaW5pdFwiO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCItLWhlbHBcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgIEV4YW1wbGVzOlwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGluaXRcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCJjcmVhdGUgPHRhcmdldD5cIilcclxuICAgICAgICAgICAgLmRlc2NyaXB0aW9uKFwiY3JlYXRlIGJvaWxlcnBsYXRlIGZvciAnbGlicmFyeSwgbW9kdWxlJyB8ICdtb2JpbGUsIGFwcCcgfCAnZGVza3RvcCcgfCAnd2ViJ1wiKVxyXG4gICAgICAgICAgICAuYWN0aW9uKCh0YXJnZXQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKC9eKG1vZHVsZXxhcHB8bGlicmFyeXxtb2JpbGV8ZGVza3RvcHx3ZWIpJC9pLnRlc3QodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZGxpbmUuYWN0aW9uID0gXCJjcmVhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJtb2R1bGVcIiA9PT0gY21kbGluZS50YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSBcImxpYnJhcnlcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiYXBwXCIgPT09IGNtZGxpbmUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gXCJtb2JpbGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZC51bmRlcmxpbmUoXCIgIHVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyB0YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbihcIi0taGVscFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgRXhhbXBsZXM6XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIGxpYnJhcnlcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIG1vYmlsZVwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgYXBwIC1jIHNldHRpbmcuanNvblwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcIipcIiwgbnVsbCwgeyBub0hlbHA6IHRydWUgfSlcclxuICAgICAgICAgICAgLmFjdGlvbigoY21kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQudW5kZXJsaW5lKFwiICB1bnN1cHBvcnRlZCBjb21tYW5kOiBcIiArIGNtZCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyLnBhcnNlKGFyZ3YpO1xyXG5cclxuICAgICAgICBpZiAoYXJndi5sZW5ndGggPD0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbWRsaW5lLmNsaU9wdGlvbnMgPSB0aGlzLnRvQ29tbWFuZExpbmVPcHRpb25zKGNvbW1hbmRlcik7XHJcblxyXG4gICAgICAgIHJldHVybiBjbWRsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcml2YXRlIHN0YXRpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDTEkg44Gu44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44Oq44KS5Y+W5b6XXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nW119IGFyZ3Yg5byV5pWwXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYWNrYWdlRGlyZWN0b3J5KGFyZ3Y6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBleGVjRGlyID0gcGF0aC5kaXJuYW1lKGFyZ3ZbMV0pO1xyXG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oZXhlY0RpciwgXCIuLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENMSSBvcHRpb24g44KSIElDb21tYW5kTGluZU9wdGlvbnMg44Gr5aSJ5o+bXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBjb21tYW5kZXIgcGFyc2Ug5riI44G/IGNvbWFubmRlciDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAqIEByZXR1cm4ge0lDb21tYW5kTGluZU9wdGlvbnN9IG9wdGlvbiDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdG9Db21tYW5kTGluZU9wdGlvbnMoY29tbWFuZDogYW55KTogSUNvbW1hbmRMaW5lT3B0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZm9yY2U6ICEhY29tbWFuZC5mb3JjZSxcclxuICAgICAgICAgICAgdGFyZ2V0RGlyOiBjb21tYW5kLnRhcmdldGRpcixcclxuICAgICAgICAgICAgY29uZmlnOiBjb21tYW5kLmNvbmZpZyxcclxuICAgICAgICAgICAgdmVyYm9zZTogISFjb21tYW5kLnZlcmJvc2UsXHJcbiAgICAgICAgICAgIHNpbGVudDogISFjb21tYW5kLnNpbGVudCxcclxuICAgICAgICAgICAgbWluaWZ5OiBjb21tYW5kLm1pbmlmeSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OY44Or44OX6KGo56S644GX44Gm57WC5LqGXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHNob3dIZWxwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGluZm9ybSA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNoYWxrLmdyZWVuKHRleHQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29tbWFuZGVyLm91dHB1dEhlbHAoPGFueT5pbmZvcm0pO1xyXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NvbW1hbmQtcGFyc2VyLnRzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29tbWFuZGVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjb21tYW5kZXJcIixcImNvbW1vbmpzMlwiOlwiY29tbWFuZGVyXCJ9XG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJTGlicmFyeUNvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5pbXBvcnQgZGVmYXVsdENvbmZpZyBmcm9tIFwiLi9kZWZhdWx0LWNvbmZpZ1wiO1xyXG5cclxuY29uc3QgJCAgICAgICAgICAgICA9IFV0aWxzLiQ7XHJcbmNvbnN0IGNoYWxrICAgICAgICAgPSBVdGlscy5jaGFsaztcclxuY29uc3Qgc2VtdmVyUmVnZXggICA9IFV0aWxzLnNlbXZlclJlZ2V4O1xyXG5jb25zdCBsaWJDb25maWcgICAgID0gZGVmYXVsdENvbmZpZy5saWJyYXJ5O1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRMaWJyYXJ5XHJcbiAqIEBicmllZiDjg6njgqTjg5bjg6njg6rjg6Ljgrjjg6Xjg7zjg6vnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHRMaWJyYXJ5IGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAvLyBwcm9qZWN0IGNvbW1vbiBzZXR0bmlncyAoSVByb2plY3RDb25maWdyYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwicHJvamVjdE5hbWVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnByb2plY3ROYW1lLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMucHJvamVjdE5hbWUgfHwgXCJjb29sLXByb2plY3QtbmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghL15bYS16QS1aMC05L0AuXy1dKyQvLnRlc3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInZlcnNpb25cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy52ZXJzaW9uIHx8IFwiMC4wLjFcIixcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlclJlZ2V4KCkuZXhlYyh2YWx1ZSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24uaW52YWxpZE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImxpY2Vuc2VcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5hcGFjaGUyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJBcGFjaGUtMi4wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5taXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk1JVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMucHJvcHJpZXRhcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk5PTkVcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmxpY2Vuc2UgfHwgXCJOT05FXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImVudlwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5saWJyYXJ5LmVudi5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMuYnJvd3NlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwid2ViXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVudi5jaG9pY2VzLm5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vZGVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBpbnF1aXJlci5TZXBhcmF0b3IoKSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVudi5jaG9pY2VzLmVsZWN0cm9uICsgdGhpcy5MSU1JVEFUSU9OKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVsZWN0cm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVudi5jaG9pY2VzLmVsZWN0cm9uUmVuZGVyZXIgKyB0aGlzLkxJTUlUQVRJT04oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZWxlY3Ryb24tcmVuZGVyZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGliQ29uZmlnLkVMRUNUUk9OX0FWQUlMQUJMRSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImVsZWN0cm9uXCIgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm5vZGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiZWxlY3Ryb24tcmVuZGVyZXJcIiA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwid2ViXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZW52IHx8IFwid2ViXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGJhc2Ugc3RydWN0dXJlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJleHRyYVNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLmNob2ljZXMucmVjb21tZW5kZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5jdXN0b20sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImN1c3RvbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmV4dHJhU2V0dGluZ3MgfHwgXCJyZWNvbW1lbmRlZFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IG1vZHVsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZHVsZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy5ub25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmNvbW1vbmpzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKFwiYW1kXCIgIT09IHRoaXMuYW5zd2Vycy5tb2R1bGUpID8gKHRoaXMuYW5zd2Vycy5tb2R1bGUgfHwgXCJjb21tb25qc1wiKSA6IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiAvXihub2RlfGVsZWN0cm9uKSQvaS50ZXN0KGFuc3dlcnMuZW52KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMubm9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy5hbWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImFtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKFwiY29tbW9uanNcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZSB8fCBcImFtZFwiKSA6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3MgJiYgXCJ3ZWJcIiA9PT0gYW5zd2Vycy5lbnY7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibW9kdWxlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLm5vbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMuY29tbW9uanMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmFtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubW9kdWxlIHx8IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiBcImVsZWN0cm9uLXJlbmRlcmVyXCIgPT09IGFuc3dlcnMuZW52O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoY3VzdG9tOiBlcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImVzXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lcy5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXMuY2hvaWNlcy5lczUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVzNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lcy5jaG9pY2VzLmVzMjAxNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXMyMDE1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZXMgfHwgKFwid2ViXCIgPT09IHRoaXMuYW5zd2Vycy5lbnYgPyBcImVzNVwiIDogXCJlczIwMTVcIiksXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICBjb25zdCBjb25maWc6IElMaWJyYXJ5Q29uZmlncmF0aW9uID0gKCgpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChhbnN3ZXJzLmVudikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIndlYlwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmJyb3dzZXIsIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm5vZGVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5ub2RlLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJlbGVjdHJvblwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmVsZWN0cm9uLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJlbGVjdHJvbi1yZW5kZXJlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmVsZWN0cm9uLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJ1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgYW5zd2Vycy5lbnYpKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICBjb25zdCBpdGVtcyA9IFtcclxuICAgICAgICAgICAgeyBuYW1lOiBcImV4dHJhU2V0dGluZ3NcIiwgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwicHJvamVjdE5hbWVcIiwgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJ2ZXJzaW9uXCIsICAgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImxpY2Vuc2VcIiwgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZW52XCIsICAgICAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJtb2R1bGVcIiwgICAgICAgICAgIHJlY29tbWVuZDogdHJ1ZSAgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImVzXCIsICAgICAgICAgICAgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gKGl0ZW0ucmVjb21tZW5kICYmIFwicmVjb21tZW5kZWRcIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzKSA/IFwieWVsbG93XCIgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbmZpZzJkZXNjcmlwdGlvbihjb25maWcsIGl0ZW0ubmFtZSwgY29sb3IpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvciwgbnVsbCwgNCkpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzOlxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZWxlY3Ryb24g44GM5pyJ5Yq55Ye644Gq44GE5aC05ZCI44Gu6KOc6Laz5paH5a2X44KS5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgTElNSVRBVElPTigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBsaWJDb25maWcuRUxFQ1RST05fQVZBSUxBQkxFID8gXCJcIiA6IFwiIFwiICsgdGhpcy5sYW5nLnByb21wdC5jb21tb24uc3RpbE5vdEF2YWlsYWJsZTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1saWJyYXJ5LnRzIiwiaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElFeHRlcm5hbE1vZHVsZUluZm8sXHJcbiAgICBJTW9iaWxlQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gXCIuL2RlZmF1bHQtY29uZmlnXCI7XHJcblxyXG5jb25zdCAkICAgICAgICAgICAgID0gVXRpbHMuJDtcclxuY29uc3QgXyAgICAgICAgICAgICA9IFV0aWxzLl87XHJcbmNvbnN0IGNoYWxrICAgICAgICAgPSBVdGlscy5jaGFsaztcclxuY29uc3Qgc2VtdmVyUmVnZXggICA9IFV0aWxzLnNlbXZlclJlZ2V4O1xyXG5jb25zdCBtb2JpbGVDb25maWcgID0gZGVmYXVsdENvbmZpZy5tb2JpbGU7XHJcblxyXG5jb25zdCBFWFRFUk5BTF9ERUZBVUxUUyA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBkZWZhdWx0czogc3RyaW5nW10gPSBbXTtcclxuICAgIE9iamVjdC5rZXlzKG1vYmlsZUNvbmZpZy5icm93c2VyLmV4dGVybmFsKVxyXG4gICAgICAgIC5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuICAgICAgICAgICAgaWYgKG1vYmlsZUNvbmZpZy5icm93c2VyLmV4dGVybmFsW3RhcmdldF0ucmVndWxhcikge1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdHMucHVzaCh0YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gZGVmYXVsdHM7XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdE1vYmlsZUFwcFxyXG4gKiBAYnJpZWYg44Oi44OQ44Kk44Or44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0TW9iaWxlQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICBjb25zdCBwbGF0Zm9ybXNfZGVmYXVsdCA9IHRoaXMuYW5zd2Vycy5wbGF0Zm9ybXNcclxuICAgICAgICAgICAgPyB0aGlzLmFuc3dlcnMucGxhdGZvcm1zLnNsaWNlKClcclxuICAgICAgICAgICAgOiBtb2JpbGVDb25maWcuYnJvd3Nlci5wbGF0Zm9ybXM7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYW5zd2Vycy5wbGF0Zm9ybXM7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2plY3RTdHJ1Y3R1cmVfZGVmYXVsdCA9IHRoaXMuYW5zd2Vycy5wcm9qZWN0U3RydWN0dXJlXHJcbiAgICAgICAgICAgID8gdGhpcy5hbnN3ZXJzLnByb2plY3RTdHJ1Y3R1cmUuc2xpY2UoKVxyXG4gICAgICAgICAgICA6IG1vYmlsZUNvbmZpZy5icm93c2VyLnByb2plY3RTdHJ1Y3R1cmU7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYW5zd2Vycy5wcm9qZWN0U3RydWN0dXJlO1xyXG5cclxuICAgICAgICBjb25zdCBleHRlcm5hbF9kZWZhdWx0ID0gdGhpcy5hbnN3ZXJzLmV4dGVybmFsXHJcbiAgICAgICAgICAgID8gdGhpcy5hbnN3ZXJzLmV4dGVybmFsLnNsaWNlKClcclxuICAgICAgICAgICAgOiBFWFRFUk5BTF9ERUZBVUxUUztcclxuICAgICAgICBkZWxldGUgdGhpcy5hbnN3ZXJzLmV4dGVybmFsO1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAvLyBwcm9qZWN0IGNvbW1vbiBzZXR0bmlncyAoSVByb2plY3RDb25maWdyYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiYXBwTmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuYXBwTmFtZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmFwcE5hbWUgfHwgXCJDb29sIEFwcCBOYW1lXCIsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eLipbKFxcXFx8L3w6fCp8P3xcInw8fD58fCldLiokLy50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuYXBwTmFtZS5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInByb2plY3ROYW1lXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy50cmltKF8uZGFzaGVyaXplKGFuc3dlcnMuYXBwTmFtZS50b0xvd2VyQ2FzZSgpKSwgXCItXCIpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIS9eW2EtekEtWjAtOV8tXSokLy50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5jb21tb24ucHJvamVjdE5hbWUuaW52YWxpZE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJhcHBJZFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuYXBwSWQubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5hcHBJZCB8fCBcIm9yZy5jb29sLmFwcG5hbWVcIixcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInZlcnNpb25cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy52ZXJzaW9uIHx8IFwiMC4wLjFcIixcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlclJlZ2V4KCkuZXhlYyh2YWx1ZSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24uaW52YWxpZE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImxpY2Vuc2VcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5hcGFjaGUyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJBcGFjaGUtMi4wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5taXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk1JVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMucHJvcHJpZXRhcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk5PTkVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5saWNlbnNlIHx8IFwiTk9ORVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3Jtc1wiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUucGxhdGZvcm1zLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImFuZHJvaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZDogKDAgPD0gcGxhdGZvcm1zX2RlZmF1bHQuaW5kZXhPZihcImFuZHJvaWRcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImlvc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBwbGF0Zm9ybXNfZGVmYXVsdC5pbmRleE9mKFwiaW9zXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImV4dHJhU2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5yZWNvbW1lbmRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwicmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXh0cmFTZXR0aW5ncy5jaG9pY2VzLmN1c3RvbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY3VzdG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZXh0cmFTZXR0aW5ncyB8fCBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwicHJvamVjdFN0cnVjdHVyZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUucHJvamVjdFN0cnVjdHVyZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUucHJvamVjdFN0cnVjdHVyZS5saWIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImxpYlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBwcm9qZWN0U3RydWN0dXJlX2RlZmF1bHQuaW5kZXhPZihcImxpYlwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLnByb2plY3RTdHJ1Y3R1cmUucG9ydGluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwicG9ydGluZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBwcm9qZWN0U3RydWN0dXJlX2RlZmF1bHQuaW5kZXhPZihcInBvcnRpbmdcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJleHRlcm5hbFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIHBhZ2luYXRlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcih0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5zZXBhcmF0b3IuY29yZG92YSksXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tb2R1bGVzW1wiY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZVwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuc3dlcnMucGxhdGZvcm1zIHx8IGFuc3dlcnMucGxhdGZvcm1zLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm5vQ29yZG92YU1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJjb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvcmRvdmEtcGx1Z2luLWluYXBwYnJvd3NlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJjb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYW5zd2Vycy5wbGF0Zm9ybXMgfHwgYW5zd2Vycy5wbGF0Zm9ybXMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubm9Db3Jkb3ZhTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImNvcmRvdmEtcGx1Z2luLWFwcC12ZXJzaW9uXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb3Jkb3ZhLXBsdWdpbi1hcHAtdmVyc2lvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJjb3Jkb3ZhLXBsdWdpbi1hcHAtdmVyc2lvblwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbnN3ZXJzLnBsYXRmb3JtcyB8fCBhbnN3ZXJzLnBsYXRmb3Jtcy5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5ub0NvcmRvdmFNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcih0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5zZXBhcmF0b3IudXRpbHMpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXN0cmluZy1saXRlcmFsICovXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tb2R1bGVzW1wiaG9nYW4uanNcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImhvZ2FuLmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImhvZ2FuLmpzXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImhhbW1lcmpzXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJoYW1tZXJqc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJoYW1tZXJqc1wiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJpc2Nyb2xsXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJpc2Nyb2xsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImlzY3JvbGxcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tb2R1bGVzW1wiZmxpcHNuYXBcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImZsaXBzbmFwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImZsaXBzbmFwXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRzbGludDplbmFibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICBjb25zdCBjb25maWc6IElNb2JpbGVBcHBDb25maWdyYXRpb24gPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9ICQuZXh0ZW5kKHt9LCBtb2JpbGVDb25maWcuYnJvd3Nlcik7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvb2t1cCA9IGRlZmF1bHRzLmV4dGVybmFsO1xyXG4gICAgICAgICAgICBkZWxldGUgZGVmYXVsdHMuZXh0ZXJuYWw7XHJcbiAgICAgICAgICAgIGNvbnN0IF9jb25maWc6IElNb2JpbGVBcHBDb25maWdyYXRpb24gPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIHtcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBFWFRFUk5BTF9ERUZBVUxUUyxcclxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llczogW10sXHJcbiAgICAgICAgICAgICAgICBkZXZEZXBlbmRlbmNpZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgY29yZG92YV9wbHVnaW46IFtdLFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VfYWRkb246IFtdLFxyXG4gICAgICAgICAgICB9LCBhbnN3ZXJzKTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvbHZlRGVwZW5kZW5jaWVzID0gKG1vZHVsZU5hbWU6IHN0cmluZywgaW5mbzogSUV4dGVybmFsTW9kdWxlSW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoaW5mby5hY3F1aXNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibnBtXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY29uZmlnLmRlcGVuZGVuY2llcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBtb2R1bGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzOiBpbmZvLmFsaWFzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbEV4cG9ydDogaW5mby5nbG9iYWxFeHBvcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVuZGVyTmFtZTogaW5mby52ZW5kZXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBpbmZvLmZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5wbTpkZXZcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb25maWcuZGV2RGVwZW5kZW5jaWVzLnB1c2goeyBuYW1lOiBtb2R1bGVOYW1lIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjb3Jkb3ZhXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA8IF9jb25maWcucGxhdGZvcm1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb25maWcuY29yZG92YV9wbHVnaW4ucHVzaCh7IG5hbWU6IG1vZHVsZU5hbWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJlc291cmNlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY29uZmlnLnJlc291cmNlX2FkZG9uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1vZHVsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXM6IGluZm8uYWxpYXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsRXhwb3J0OiBpbmZvLmdsb2JhbEV4cG9ydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZW5kZXJOYW1lOiBpbmZvLnZlbmRlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGluZm8uZmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgKDxhbnk+X2NvbmZpZykuZXh0ZXJuYWwuZm9yRWFjaCgodG9wOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmZvID0gPElFeHRlcm5hbE1vZHVsZUluZm8+bG9va3VwW3RvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWQgPSByZXNvbHZlRGVwZW5kZW5jaWVzKHRvcCwgaW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkICYmIGluZm8uc3Vic2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGluZm8uc3Vic2V0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKHN1YikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVEZXBlbmRlbmNpZXMoc3ViLCA8SUV4dGVybmFsTW9kdWxlSW5mbz5pbmZvLnN1YnNldFtzdWJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvciwgbnVsbCwgNCkpKTtcclxuICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVsZXRlIF9jb25maWcuZXh0ZXJuYWw7XHJcbiAgICAgICAgICAgIHJldHVybiBfY29uZmlnO1xyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW1xyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXh0cmFTZXR0aW5nc1wiLCAgICBmaXhlZDogZmFsc2UgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImFwcE5hbWVcIiwgICAgICAgICAgZml4ZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJwcm9qZWN0TmFtZVwiLCAgICAgIGZpeGVkOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXBwSWRcIiwgICAgICAgICAgICBmaXhlZDogZmFsc2UgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInZlcnNpb25cIiwgICAgICAgICAgZml4ZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJsaWNlbnNlXCIsICAgICAgICAgIGZpeGVkOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwibW9kdWxlXCIsICAgICAgICAgICBmaXhlZDogdHJ1ZSAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImVzXCIsICAgICAgICAgICAgICAgZml4ZWQ6IHRydWUgIH0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSAoaXRlbS5maXhlZCkgPyBcInllbGxvd1wiIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25maWcyZGVzY3JpcHRpb24oY29uZmlnLCBpdGVtLm5hbWUsIGNvbG9yKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwiZXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IsIG51bGwsIDQpKSk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHBsYXRmb3Jtc1xyXG4gICAgICAgIGNvbnN0IHBsYXRmb3JtSW5mbyA9ICgwIDwgY29uZmlnLnBsYXRmb3Jtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgID8gY29uZmlnLnBsYXRmb3Jtcy5qb2luKFwiLCBcIilcclxuICAgICAgICAgICAgOiB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLnBsYXRmb3Jtcy5ub25lO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLnBsYXRmb3Jtcy5sYWJlbCArIGNoYWxrLmN5YW4ocGxhdGZvcm1JbmZvKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IENPTE9SID0gKFwicmVjb21tZW5kZWRcIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzKSA/IFwieWVsbG93XCIgOiBcImN5YW5cIjtcclxuXHJcbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9qZWN0IHN0cnVjdHVyZVxyXG4gICAgICAgIGlmICgwIDwgY29uZmlnLnByb2plY3RTdHJ1Y3R1cmUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RTdHJ1Y3R1cmUgPSBjb25maWcucHJvamVjdFN0cnVjdHVyZS5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLnByb2plY3RTdHJ1Y3R1cmUubGFiZWwgKyBjaGFsa1tDT0xPUl0ocHJvamVjdFN0cnVjdHVyZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkaXRpb25hbCBjb3Jkb3ZhIHBsdWdpblxyXG4gICAgICAgIGlmICgwIDwgY29uZmlnLmNvcmRvdmFfcGx1Z2luLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgdGhpcy5sYW5nLnNldHRpbmdzLm1vYmlsZS5jb3Jkb3ZhUGx1Z2lucy5sYWJlbCk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5jb3Jkb3ZhX3BsdWdpbi5mb3JFYWNoKChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBcIiArIGNoYWxrW0NPTE9SXShpbmZvLm5hbWUpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGRpdGlvbmFsIGRlcGVuZGVuY3lcclxuICAgICAgICBpZiAoMCA8IGNvbmZpZy5kZXBlbmRlbmNpZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLmRlcGVuZGVuY2llcy5sYWJlbCk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5yZXNvdXJjZV9hZGRvbi5mb3JFYWNoKChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBcIiArIGNoYWxrW0NPTE9SXShpbmZvLm5hbWUpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5kZXBlbmRlbmNpZXMuZm9yRWFjaCgoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgXCIgKyBjaGFsa1tDT0xPUl0oaW5mby5uYW1lKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1tb2JpbGUudHMiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJRGVza3RvcEFwcENvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5cclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0RGVza3RvcEFwcFxyXG4gKiBAYnJpZWYg44OH44K544Kv44OI44OD44OX44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0RGVza3RvcEFwcCBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogYW55KTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChcImRlc2t0b3AgYXBwIHByb21wdGluZywgdW5kZXIgY29uc3RydWN0aW9uLlwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIC8vIFRPRE86XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a44Gu56K66KqNXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7SUFuc3dlclNjaGVtYX0gYW5zd2VycyDlm57nrZTntZDmnpxcclxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlncmF0aW9ufSDoqK3lrprlgKTjgpLov5TljbRcclxuICAgICAqL1xyXG4gICAgZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpOiBJUHJvamVjdENvbmZpZ3JhdGlvbiB7XHJcbiAgICAgICAgLy8gVE9ETzogc2hvd1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LWRlc2t0b3AudHMiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJV2ViQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRXZWJBcHBcclxuICogQGJyaWVmIOOCpuOCp+ODluOCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdFdlYkFwcCBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogYW55KTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChcIndlYiBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICAvLyBUT0RPOiBzaG93XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtd2ViLnRzIl19
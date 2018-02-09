/*!
 * cdp-cli.js 0.1.5-dev
 *
 * Date: 2018-02-09T06:04:08.282Z
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
/******/     return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("cdp-lib");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(1);
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
/* 3 */
/***/ (function(module, exports) {

module.exports = require("inquirer");

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

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(19));
__export(__webpack_require__(8));
__export(__webpack_require__(9));


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(9);
const index_1 = __webpack_require__(5);
let _settings = {
    force: false,
    verbose: false,
    silent: false,
    lang: "en-US",
};
///////////////////////////////////////////////////////////////////////
// exports methods:
/**
 * 設定取得
 *
 * @returns options ログに使用するオプション
 */
function getSettings() {
    return index_1.deepExtend({}, _settings);
}
exports.getSettings = getSettings;
/**
 * 設定指定
 *
 * @param options ログに使用するオプション
 */
function setSettings(settings) {
    if (settings) {
        _settings.force = settings.force || _settings.force;
        _settings.verbose = settings.verbose || _settings.verbose;
        _settings.silent = settings.silent || _settings.silent;
        _settings.targetDir = settings.targetDir || _settings.targetDir;
        _settings.lang = settings.lang || _settings.lang;
    }
    else {
        _settings = {
            force: false,
            verbose: false,
            silent: false,
            lang: "en-US",
        };
    }
}
exports.setSettings = setSettings;
/**
 * ログ出力
 * console.log() と同等
 *
 * @param message        出力メッセージ
 * @param optionalParams 付加情報
 */
function log(message, ...optionalParams) {
    if (!_settings.silent) {
        if (0 < optionalParams.length) {
            console.log(message, optionalParams);
        }
        else {
            console.log(message);
        }
    }
}
exports.log = log;
/**
 * 詳細ログ出力
 * console.debug() と同等
 *
 * @param message        出力メッセージ
 * @param optionalParams 付加情報
 */
function debug(message, ...optionalParams) {
    if (!_settings.silent && _settings.verbose) {
        if (0 < optionalParams.length) {
            console.error("DEBUG: " + message, optionalParams);
        }
        else {
            console.error("DEBUG: " + message);
        }
    }
}
exports.debug = debug;
/**
 * 検証
 * console.assert() と同等
 *
 * @param test           検証する式
 * @param message        出力メッセージ
 * @param optionalParams 付加情報
 */
function assert(test, message, ...optionalParams) {
    if (!test) {
        if (_settings.force) {
            if (0 < optionalParams.length) {
                console.warn(message, optionalParams);
            }
            else {
                console.warn(message);
            }
        }
        else {
            if (0 < optionalParams.length) {
                console.error(message, optionalParams);
            }
            else {
                console.error(message);
            }
            process.exit(1);
        }
    }
}
exports.assert = assert;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(7);
const child_process_1 = __webpack_require__(6);
const cli_spinner_1 = __webpack_require__(26);
const which = __webpack_require__(27);
const deepExtend = __webpack_require__(28);
exports.deepExtend = deepExtend;
const settings_1 = __webpack_require__(8);
///////////////////////////////////////////////////////////////////////
// exports methods:
/**
 * Handle command line error and kill process.
 * When the application received error from cli, please call this method.
 *
 * @param {String} error  error information.
 */
function handleError(error) {
    settings_1.assert(false, error);
}
exports.handleError = handleError;
//___________________________________________________________________________________________________________________//
/**
 * Get spinner instance.
 * CLI helper.
 *
 * @param  {String}  [format]  spinner format string.
 * @param  {Number}  [index]   spinner index defined by cli-spinner. (default: random [0-29])
 * @return {Spinner} cli-spinner instance.
 */
function getSpinner(format, index) {
    const spinners = [
        "|/-\\",
        "┤┘┴└├┌┬┐",
        "◢◣◤◥",
        "▌▀▐▄",
        "▉▊▋▌▍▎▏▎▍▌▋▊▉",
        "▁▃▄▅▆▇█▇▆▅▄▃",
        "☱☲☴",
        ".oO@*",
        "◐◓◑◒",
        ////
        "◡◡ ⊙⊙ ◠◠",
        "■□▪▫",
        "←↖↑↗→↘↓↙",
        ".oO°Oo.",
    ];
    const fmt = format || "%s";
    const spinner = new cli_spinner_1.Spinner(fmt);
    const idx = (null != index && 0 <= index && index < 14) ? index : Math.floor(Math.random() * 10);
    spinner.setSpinnerString(spinners[idx]);
    return spinner;
}
exports.getSpinner = getSpinner;
/**
 * Execute command line by spawn.
 * call spawn. if error occured, cui is killed proccess.
 *
 * @param   {String}               command    main command. ex) "cordova"
 * @param   {String[]}             args       command args. ex) ["plugin", "add", pluginName]
 * @param   {ExecCommandOptions}   [options]  cli-spinner"s options.
 * @returns {Number} error code
 */
function execCommand(command, args, options) {
    return new Promise((resolve, reject) => {
        const opt = deepExtend({}, {
            stdio: "inherit",
            spinner: { format: "%s" },
            stdout: (data) => { },
            stderr: (data) => { },
        }, options);
        // on win32, command and args need to be quoted if containing spaces
        const quoteIfNeeded = (str) => {
            if ("win32" === os.platform() && str.includes(" ")) {
                str = "\"" + str + "\"";
                opt.shell = true;
            }
            return str;
        };
        which(command, (error, resolvedCommand) => {
            if (error) {
                handleError(JSON.stringify(error));
            }
            const spinner = opt.spinner ? getSpinner(opt.spinner.format, opt.spinner.index) : null;
            if (spinner) {
                spinner.start();
            }
            resolvedCommand = quoteIfNeeded(resolvedCommand);
            args = args.map(quoteIfNeeded);
            const child = child_process_1.spawn(resolvedCommand, args, opt)
                .on("error", handleError)
                .on("close", (code) => {
                if (spinner) {
                    spinner.stop(true);
                }
                resolve(code);
            });
            if ("pipe" === opt.stdio) {
                child.stdout.on("data", (data) => {
                    opt.stdout(data.toString());
                });
                child.stderr.on("data", (data) => {
                    opt.stderr(data.toString());
                });
            }
        });
    });
}
exports.execCommand = execCommand;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const command_parser_1 = __webpack_require__(12);
const prompt_library_1 = __webpack_require__(14);
const prompt_mobile_1 = __webpack_require__(15);
const prompt_desktop_1 = __webpack_require__(16);
const prompt_web_1 = __webpack_require__(17);
const cdp_doc_1 = __webpack_require__(18);
const chalk = cdp_lib_1.Utils.chalk;
function getCreateInquirer(cmdInfo) {
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
function inquireCreate(cmdInfo) {
    const inquirer = getCreateInquirer(cmdInfo);
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
function browseDoc(prt) {
    cdp_doc_1.default.execute(prt).then((resolve) => {
        console.log("Automaticaly web browser opened and you can browse cdp documents.");
        console.log("To quit browsing, press Ctrl + C.");
    })
        .catch((reject) => {
        console.log("Default port 8080 is already used. Please use another port, for example $ cdp doc -p 3000");
    });
}
function main() {
    process.title = "cdp";
    const cmdInfo = command_parser_1.CommandParser.parse(process.argv);
    const prt = cmdInfo.cliOptions.port;
    switch (cmdInfo.action) {
        case "create":
            inquireCreate(cmdInfo);
            break;
        case "doc":
            browseDoc(prt);
            break;
        default:
            console.error(chalk.red(cmdInfo.action + " command: under construction."));
            process.exit(1);
    }
}
exports.main = main;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(1);
const commander = __webpack_require__(13);
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
            .option("--no-minify", "Not minified on release.")
            .option("-p, --port <port>", "Set local server port when browsing document");
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
        commander
            .command("doc")
            .description("show document with browser")
            .action(() => {
            cmdline.action = "doc";
        })
            .on("--help", () => {
            console.log(chalk.green("  Examples:"));
            console.log("");
            console.log(chalk.green("    $ cdp doc -p <port number>"));
            console.log(chalk.green("    $ cdp doc <<in case of using default port: 8080>>"));
            console.log("");
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
        // Added: Issue #4: get the real path of exec, because get the path of symbolic link of exec on Mac.
        const execRealPath = fs.realpathSync(argv[1]);
        //
        const execDir = path.dirname(execRealPath);
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
            port: command.port,
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
/* 13 */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __webpack_require__(3);
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(2);
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __webpack_require__(3);
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(2);
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(2);
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const prompt_base_1 = __webpack_require__(2);
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Utils = __webpack_require__(5);
/**
 * @class CdpDoc
 * @brief TODO:
 */
class CDPDoc {
    ///////////////////////////////////////////////////////////////////////
    // pubic methods:
    /**
     * main command
     */
    static execute(prt) {
        return Utils.launchLocalServer(prt)
            .then(() => {
            return Utils.launchBrowser(prt);
        });
    }
}
exports.default = CDPDoc;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(1);
// import { execCommand } from "./tools";
const opn = __webpack_require__(20);
const express = __webpack_require__(23);
const http = __webpack_require__(24); // Node.jsのserver.on('error')を使うためにインポート
const url = __webpack_require__(25);
let hostName = "http://localhost:";
const DEFAULT_PORT = 8080;
function launchBrowser(prt) {
    let prtNumber = Number.parseInt(prt);
    prtNumber = prtNumber || DEFAULT_PORT;
    hostName += String(prtNumber);
    const hostUrl = url.parse(hostName, true);
    return opn(hostUrl.href);
}
exports.launchBrowser = launchBrowser;
function launchLocalServer(prt) {
    return new Promise((resolve, reject) => {
        const app = express();
        const htmlRoot = path.join(__dirname, "..", "root");
        app.use(express.static(htmlRoot));
        let prtNumber = Number.parseInt(prt);
        prtNumber = prtNumber || DEFAULT_PORT;
        const server = http.createServer(app);
        server.on("error", (e) => {
            const error_json_string = JSON.stringify(e); // 例外の内容を JSON 文字列（JSON全体がコーテーションで囲まれている）で取得
            const error_js_object = JSON.parse(error_json_string); // JSON文字列を JavaScriptオブジェクトに変換
            // console.log(error_js_object);       // { code: 'EADDRINUSE', errno: 'EADDRINUSE', ... , port: 8080 }
            // console.log(error_js_object.errno); // "EADDRINUSE"
            if (error_js_object.errno === "EADDRINUSE") {
                // console.log("'EADDRINUSE' error happened!");     // debug message
                return reject();
            }
            else {
                console.log("Unknown error except 'EADDRINUSE (default prot used)' happend!"); // Process on command pronpt will stop.
            }
        });
        server.listen(prtNumber, () => {
            return resolve();
        });
    });
}
exports.launchLocalServer = launchLocalServer;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const path = __webpack_require__(1);
const childProcess = __webpack_require__(6);
const isWsl = __webpack_require__(21);

module.exports = (target, opts) => {
    if (typeof target !== 'string') {
        return Promise.reject(new Error('Expected a `target`'));
    }

    opts = Object.assign({wait: true}, opts);

    let cmd;
    let appArgs = [];
    let args = [];
    const cpOpts = {};

    if (Array.isArray(opts.app)) {
        appArgs = opts.app.slice(1);
        opts.app = opts.app[0];
    }

    if (process.platform === 'darwin') {
        cmd = 'open';

        if (opts.wait) {
            args.push('-W');
        }

        if (opts.app) {
            args.push('-a', opts.app);
        }
    } else if (process.platform === 'win32' || isWsl) {
        cmd = 'cmd' + (isWsl ? '.exe' : '');
        args.push('/c', 'start', '""', '/b');
        target = target.replace(/&/g, '^&');

        if (opts.wait) {
            args.push('/wait');
        }

        if (opts.app) {
            args.push(opts.app);
        }

        if (appArgs.length > 0) {
            args = args.concat(appArgs);
        }
    } else {
        if (opts.app) {
            cmd = opts.app;
        } else {
            cmd = path.join(__dirname, 'xdg-open');
        }

        if (appArgs.length > 0) {
            args = args.concat(appArgs);
        }

        if (!opts.wait) {
            // `xdg-open` will block the process unless
            // stdio is ignored and it's detached from the parent
            // even if it's unref'd
            cpOpts.stdio = 'ignore';
            cpOpts.detached = true;
        }
    }

    args.push(target);

    if (process.platform === 'darwin' && appArgs.length > 0) {
        args.push('--args');
        args = args.concat(appArgs);
    }

    const cp = childProcess.spawn(cmd, args, cpOpts);

    if (opts.wait) {
        return new Promise((resolve, reject) => {
            cp.once('error', reject);

            cp.once('close', code => {
                if (code > 0) {
                    reject(new Error('Exited with code ' + code));
                    return;
                }

                resolve(cp);
            });
        });
    }

    cp.unref();

    return Promise.resolve(cp);
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(7);
const fs = __webpack_require__(22);

const isWsl = () => {
    if (process.platform !== 'linux') {
        return false;
    }

    if (os.release().includes('Microsoft')) {
        return true;
    }

    try {
        return fs.readFileSync('/proc/version', 'utf8').includes('Microsoft');
    } catch (err) {
        return false;
    }
};

if (process.env.__IS_WSL_TEST__) {
    module.exports = isWsl;
} else {
    module.exports = isWsl();
}


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("cli-spinner");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("which");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2015 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



function isSpecificValue(val) {
    return (
        val instanceof Buffer
        || val instanceof Date
        || val instanceof RegExp
    ) ? true : false;
}

function cloneSpecificValue(val) {
    if (val instanceof Buffer) {
        var x = new Buffer(val.length);
        val.copy(x);
        return x;
    } else if (val instanceof Date) {
        return new Date(val.getTime());
    } else if (val instanceof RegExp) {
        return new RegExp(val);
    } else {
        throw new Error('Unexpected situation');
    }
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr) {
    var clone = [];
    arr.forEach(function (item, index) {
        if (typeof item === 'object' && item !== null) {
            if (Array.isArray(item)) {
                clone[index] = deepCloneArray(item);
            } else if (isSpecificValue(item)) {
                clone[index] = cloneSpecificValue(item);
            } else {
                clone[index] = deepExtend({}, item);
            }
        } else {
            clone[index] = item;
        }
    });
    return clone;
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
var deepExtend = module.exports = function (/*obj_1, [obj_2], [obj_N]*/) {
    if (arguments.length < 1 || typeof arguments[0] !== 'object') {
        return false;
    }

    if (arguments.length < 2) {
        return arguments[0];
    }

    var target = arguments[0];

    // convert arguments to array and cut off target object
    var args = Array.prototype.slice.call(arguments, 1);

    var val, src, clone;

    args.forEach(function (obj) {
        // skip argument if isn't an object, is null, or is an array
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return;
        }

        Object.keys(obj).forEach(function (key) {
            src = target[key]; // source value
            val = obj[key]; // new value

            // recursion prevention
            if (val === target) {
                return;

            /**
             * if new value isn't object then just overwrite by new value
             * instead of extending.
             */
            } else if (typeof val !== 'object' || val === null) {
                target[key] = val;
                return;

            // just clone arrays (and recursive clone objects inside)
            } else if (Array.isArray(val)) {
                target[key] = deepCloneArray(val);
                return;

            // custom cloning and overwrite for specific objects
            } else if (isSpecificValue(val)) {
                target[key] = cloneSpecificValue(val);
                return;

            // overwrite by new value if source isn't object or array
            } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
                target[key] = deepExtend({}, val);
                return;

            // source value and new value is objects both, extending...
            } else {
                target[key] = deepExtend(src, val);
                return;
            }
        });
    });

    return target;
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTRiNzU5M2JkZmM2ODJkY2YxOWMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LWJhc2UudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifSIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvdXRpbHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2hpbGRfcHJvY2Vzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm9zXCIiLCJjZHA6Ly8vY2RwLWNsaS91dGlscy9zZXR0aW5ncy50cyIsImNkcDovLy9jZHAtY2xpL3V0aWxzL3Rvb2xzLnRzIiwiY2RwOi8vL2NkcC1jbGkvY2RwLWNsaS50cyIsImNkcDovLy9jZHAtY2xpL2NvbW1hbmQtcGFyc2VyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY29tbWFuZGVyXCIsXCJjb21tb25qczJcIjpcImNvbW1hbmRlclwifSIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1saWJyYXJ5LnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LW1vYmlsZS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1kZXNrdG9wLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LXdlYi50cyIsImNkcDovLy9jZHAtY2xpL2NkcC1kb2MudHMiLCJjZHA6Ly8vY2RwLWNsaS91dGlscy9sb2NhbC1zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9vcG4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL25vZGVfbW9kdWxlcy9pcy13c2wvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImV4cHJlc3NcIixcImNvbW1vbmpzMlwiOlwiZXhwcmVzc1wifSIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjbGktc3Bpbm5lclwiLFwiY29tbW9uanMyXCI6XCJjbGktc3Bpbm5lclwifSIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcIndoaWNoXCIsXCJjb21tb25qczJcIjpcIndoaWNoXCJ9Iiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvZGVlcC1leHRlbmQvbGliL2RlZXAtZXh0ZW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REEsb0M7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7QUNBQSxvQ0FBNkI7QUFDN0Isd0NBQXFDO0FBQ3JDLHlDQUlpQjtBQUdqQixNQUFNLEVBQUUsR0FBTSxlQUFLLENBQUMsRUFBRSxDQUFDO0FBQ3ZCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUM7QUFDMUIs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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKLGdDQUFnQztBQUNoQztBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCO0FBQ3JCLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKLCtCQUErQjtBQUMvQjs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGU0Yjc1OTNiZGZjNjgyZGNmMTljIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2RwLWxpYlwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY2RwLWxpYlwiLFwiY29tbW9uanMyXCI6XCJjZHAtbGliXCJ9XG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJwYXRoXCJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcclxuaW1wb3J0IHtcclxuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxyXG4gICAgSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHsgSUNvbW1hbmRMaW5lSW5mbyB9IGZyb20gXCIuL2NvbW1hbmQtcGFyc2VyXCI7XHJcblxyXG5jb25zdCBmcyAgICA9IFV0aWxzLmZzO1xyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5jb25zdCBfICAgICA9IFV0aWxzLl87XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJQW5zd2VyU2NoZW1hXHJcbiAqIEBicmllZiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OI44Gu44K544Kt44O844Oe5a6a576p44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElBbnN3ZXJTY2hlbWFcclxuICAgIGV4dGVuZHMgaW5xdWlyZXIuQW5zd2VycywgSVByb2plY3RDb25maWdyYXRpb24sIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbiB7XHJcbiAgICAvLyDlhbHpgJrmi6HlvLXlrprnvqlcclxuICAgIGV4dHJhU2V0dGluZ3M6IFwicmVjb21tZW5kZWRcIiB8IFwiY3VzdG9tXCI7XHJcbn1cclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdEJhc2VcclxuICogQGJyaWVmIFByb21wdCDjga7jg5njg7zjgrnjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcm9tcHRCYXNlIHtcclxuXHJcbiAgICBwcml2YXRlIF9jbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvO1xyXG4gICAgcHJpdmF0ZSBfYW5zd2VycyA9IDxJQW5zd2VyU2NoZW1hPnt9O1xyXG4gICAgcHJpdmF0ZSBfbG9jYWxlID0ge307XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg7Pjg4jjg6pcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvKTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHRoaXMuX2NtZEluZm8gPSBjbWRJbmZvO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1Byb2xvZ3VlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5xdWlyZUxhbmd1YWdlKClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnF1aXJlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHNldHRpbmdzOiBJUHJvamVjdENvbmZpZ3JhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlrZSBjb3dzYXlcclxuICAgICAqIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Nvd3NheVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2F5KG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IEdSRUVUSU5HID1cclxuICAgICAgICAgICAgXCJcXG4gICAg4omhICAgXCIgKyBjaGFsay55ZWxsb3coXCJ877+jIHxcIikgK1xyXG4gICAgICAgICAgICBcIlxcbiAg4omhICAgIFwiICsgY2hhbGsueWVsbG93KFwiX3xfX18gfF9cIikgKyBcIiAgIO+8j++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o++/o1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iCAtXjBeIO+8iVwiKSArIFwi77ycICBcIiArIGNoYWxrLnllbGxvdyhtZXNzYWdlKSArXHJcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICBcIiArIGNoYWxrLmN5YW4oXCLvvIggIOOBpFwiKSArIFwi77ydXCIgKyBjaGFsay5jeWFuKFwi44GkXCIpICsgXCIgIO+8vO+8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v++8v1wiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhICBcIiArIGNoYWxrLmN5YW4oXCLvvZwg772cIHxcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iF/vvL/vvInvvL/vvIlcIikgKyBcIu+8vFwiICtcclxuICAgICAgICAgICAgXCJcXG4gIOKJoSAgIFwiICsgY2hhbGsucmVkKFwi4peOXCIpICsgXCLvv6Pvv6Pvv6Pvv6NcIiArIGNoYWxrLnJlZChcIuKXjlwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhHUkVFVElORyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg63jg7zjgqvjg6njgqTjgrrjg6rjgr3jg7zjgrnjgavjgqLjgq/jgrvjgrlcclxuICAgICAqIGV4KSB0aGlzLmxhbmcucHJvbXB0LnByb2plY3ROYW1lLm1lc3NhZ2VcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOODquOCveODvOOCueOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGxhbmcoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgYWJzdHJhY3QgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBhYnN0cmFjdCBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kit5a6a5YCk44Gr44Ki44Kv44K744K5XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBnZXQgYW5zd2VycygpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYW5zd2VycztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb2xvZ3VlIOOCs+ODoeODs+ODiOOBruioreWumlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHByb2xvZ3VlQ29tbWVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIldlbGNvbWUgdG8gQ0RQIEJvaWxlcnBsYXRlIEdlbmVyYXRvciFcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlbGNvbWUg6KGo56S6XHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzaG93UHJvbG9ndWUoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpKTtcclxuICAgICAgICB0aGlzLnNheSh0aGlzLnByb2xvZ3VlQ29tbWVudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpICsgXCJcXG5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIIOOBruabtOaWsFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlQW5zd2Vycyh1cGRhdGU6IElBbnN3ZXJTY2hlbWEpOiBJQW5zd2VyU2NoZW1hIHtcclxuICAgICAgICByZXR1cm4gXy5tZXJnZSh0aGlzLl9hbnN3ZXJzLCB1cGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6aXHJcbiAgICAgKiDliIblspDjgYzlv4XopoHjgarloLTlkIjjga/jgqrjg7zjg5Djg7zjg6njgqTjg4njgZnjgovjgZPjgahcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGlucXVpcmVTZXR0aW5ncygpOiBQcm9taXNlPElBbnN3ZXJTY2hlbWE+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQodGhpcy5xdWVzdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VycykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoPElBbnN3ZXJTY2hlbWE+YW5zd2Vycyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXR0aW5nIOOBi+OCiSDoqK3lrproqqzmmI7jga7kvZzmiJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZyDoqK3lrppcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaXRlbU5hbWUg6Kit5a6a6aCF55uu5ZCNXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOiqrOaYjuaWh1xyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29uZmlnMmRlc2NyaXB0aW9uKGNvbmZpZzogT2JqZWN0LCBpdGVtTmFtZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nID0gXCJjeWFuXCIpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmxhbmcuc2V0dGluZ3NbaXRlbU5hbWVdO1xyXG4gICAgICAgIGlmIChudWxsID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvci4gaXRlbSBub3QgZm91bmQuIGl0ZW0gbmFtZTogXCIgKyBpdGVtTmFtZSkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwcm9wOiBzdHJpbmcgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9wcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucHJvcHNbY29uZmlnW2l0ZW1OYW1lXV07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJib29sZWFuXCIgPT09IHR5cGVvZiBjb25maWdbaXRlbU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5ib29sW2NvbmZpZ1tpdGVtTmFtZV0gPyBcInllc1wiIDogXCJub1wiXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb25maWdbaXRlbU5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgKyBjaGFsa1tjb2xvcl0ocHJvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844Kr44Op44Kk44K644Oq44K944O844K544Gu44Ot44O844OJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZExhbmd1YWdlKGxvY2FsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoXHJcbiAgICAgICAgICAgICAgICBwYXRoLmpvaW4odGhpcy5fY21kSW5mby5wa2dEaXIsIFwicmVzL2xvY2FsZXMvbWVzc2FnZXMuXCIgKyBsb2NhbGUgKyBcIi5qc29uXCIpLCBcInV0ZjhcIikudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiTGFuZ3VhZ2UgcmVzb3VyY2UgSlNPTiBwYXJzZSBlcnJvcjogXCIgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqIDoqp7pgbjmip5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlTGFuZ3VhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJsYW5ndWFnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUGxlYXNlIGNob29zZSB5b3VyIHByZWZlcnJlZCBsYW5ndWFnZS5cIixcclxuICAgICAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiRW5nbGlzaC/oi7Hoqp5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVuLVVTXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiSmFwYW5lc2Uv5pel5pys6KqeXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJqYS1KUFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb24pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkTGFuZ3VhZ2UoYW5zd2VyLmxhbmd1YWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqK3lrprnorroqo1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjb25maXJtU2V0dGluZ3MoKTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyBjaGFsay5ncmF5KFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMuZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKHRoaXMuX2Fuc3dlcnMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGVjazogXCIgKyB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5jb25maXJtLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICBjb25zdCBxdWVzdGlvbiA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNvbmZpcm1cIixcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImNvbmZpcm1hdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmNvbmZpcm0ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb24pXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuc3dlci5jb25maXJtYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY29tbWFuZCBsaW5lIOaDheWgseOCkiBDb25maWN1cmF0aW9uIOOBq+WPjeaYoFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge0lQcm9qZWN0Q29uZmlndXJhdGlvbn0gY29uZmlnIOioreWumlxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWd1cmF0aW9ufSBjb21tYW5kIGxpbmUg44KS5Y+N5pig44GV44Gb44GfIGNvbmZpZyDoqK3lrppcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWZsZWN0Q29tbWFuZEluZm8oY29uZmlnOiBJUHJvamVjdENvbmZpZ3JhdGlvbik6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICBjb25maWcuYWN0aW9uID0gdGhpcy5fY21kSW5mby5hY3Rpb247XHJcblxyXG4gICAgICAgICg8SUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uPmNvbmZpZykubWluaWZ5ID0gdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLm1pbmlmeTtcclxuXHJcbiAgICAgICAgY29uZmlnLnNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICBmb3JjZTogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLmZvcmNlLFxyXG4gICAgICAgICAgICB2ZXJib3NlOiB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMudmVyYm9zZSxcclxuICAgICAgICAgICAgc2lsZW50OiB0aGlzLl9jbWRJbmZvLmNsaU9wdGlvbnMuc2lsZW50LFxyXG4gICAgICAgICAgICB0YXJnZXREaXI6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy50YXJnZXREaXIsXHJcbiAgICAgICAgICAgIGxhbmc6IHRoaXMubGFuZy50eXBlLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoqK3lrprjgqTjg7Pjgr/jg6njgq/jgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbnF1aXJlKCk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnF1aXJlU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXJzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQW5zd2VycyhhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtU2V0dGluZ3MoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZWZsZWN0Q29tbWFuZEluZm8oY29uZmlnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHByb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHByb2MpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LWJhc2UudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpbnF1aXJlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiaW5xdWlyZXJcIixcImNvbW1vbmpzMlwiOlwiaW5xdWlyZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtcclxuICAgIElMaWJyYXJ5Q29uZmlncmF0aW9uLFxyXG4gICAgSU1vYmlsZUFwcENvbmZpZ3JhdGlvbixcclxuICAgIElEZXNrdG9wQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgSVdlYkFwcENvbmZpZ3JhdGlvbixcclxufSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgbGlicmFyeU9uQnJvd3NlciA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczVcIixcclxuICAgIG1vZHVsZTogXCJ1bWRcIixcclxuICAgIGVudjogXCJ3ZWJcIixcclxuICAgIHRvb2xzOiBbXCJ3ZWJwYWNrXCIsIFwibnljXCJdLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5vZGUuanMg55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25Ob2RlID0gPElMaWJyYXJ5Q29uZmlncmF0aW9uPntcclxuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXHJcbiAgICBwcm9qZWN0VHlwZTogXCJsaWJyYXJ5XCIsXHJcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cclxuICAgIGVzOiBcImVzMjAxNVwiLFxyXG4gICAgbW9kdWxlOiBcImNvbW1vbmpzXCIsXHJcbiAgICBlbnY6IFwibm9kZVwiLFxyXG4gICAgdG9vbHM6IFtcIndlYnBhY2tcIiwgXCJueWNcIl0sXHJcbn07XHJcblxyXG4vKipcclxuICogZWxlY3Ryb24g55Kw5aKD44Gn5YuV5L2c44GZ44KL44Op44Kk44OW44Op44Oq44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5T25FbGVjdHJvbiA9IDxJTGlicmFyeUNvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwibGlicmFyeVwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczIwMTVcIixcclxuICAgIG1vZHVsZTogXCJjb21tb25qc1wiLFxyXG4gICAgZW52OiBcImVsZWN0cm9uXCIsXHJcbiAgICB0b29sczogW1wid2VicGFja1wiLCBcIm55Y1wiXSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiDjg5bjg6njgqbjgrYoY29yZG92YSnnkrDlooPjgafli5XkvZzjgZnjgovjg6Ljg5DjgqTjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcclxuICovXHJcbmNvbnN0IG1vYmlsZU9uQnJvd3NlcjogSU1vYmlsZUFwcENvbmZpZ3JhdGlvbiA9IDxhbnk+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcIm1vYmlsZVwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczVcIixcclxuICAgIG1vZHVsZTogXCJhbWRcIixcclxuICAgIGVudjogXCJ3ZWJcIixcclxuICAgIHRvb2xzOiBbXCJueWNcIl0sXHJcbiAgICAvLyBJTW9iaWxlQXBwQ29uZmlncmF0aW9uXHJcbiAgICBwbGF0Zm9ybXM6IFtcImFuZHJvaWRcIiwgXCJpb3NcIl0sXHJcbiAgICBwcm9qZWN0U3RydWN0dXJlOiBbXSxcclxuICAgIGV4dGVybmFsOiB7XHJcbiAgICAgICAgXCJob2dhbi5qc1wiOiB7XHJcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbVwiLFxyXG4gICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxyXG4gICAgICAgICAgICBhbGlhczogXCJob2dhblwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJoYW1tZXJqc1wiOiB7XHJcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbVwiLFxyXG4gICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxyXG4gICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IFwiSGFtbWVyXCIsXHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcImhhbW1lclwiLFxyXG4gICAgICAgICAgICBzdWJzZXQ6IHtcclxuICAgICAgICAgICAgICAgIFwianF1ZXJ5LWhhbW1lcmpzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG1cIixcclxuICAgICAgICAgICAgICAgICAgICB2ZW5kZXJOYW1lOiBcImhhbW1lcmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IFwianF1ZXJ5LmhhbW1lclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ3VsYXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJAdHlwZXMvaGFtbWVyanNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbTpkZXZcIixcclxuICAgICAgICAgICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZVwiOiB7XHJcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcImNvcmRvdmFcIixcclxuICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29yZG92YS1wbHVnaW4taW5hcHBicm93c2VyXCI6IHtcclxuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwiY29yZG92YVwiLFxyXG4gICAgICAgICAgICByZWd1bGFyOiBmYWxzZSxcclxuICAgICAgICAgICAgc3Vic2V0OiB7XHJcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9jb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbTpkZXZcIixcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29yZG92YS1wbHVnaW4tYXBwLXZlcnNpb25cIjoge1xyXG4gICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJjb3Jkb3ZhXCIsXHJcbiAgICAgICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWJzZXQ6IHtcclxuICAgICAgICAgICAgICAgIFwiQHR5cGVzL2NvcmRvdmEtcGx1Z2luLWFwcC12ZXJzaW9uXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG06ZGV2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImlzY3JvbGxcIjoge1xyXG4gICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG1cIixcclxuICAgICAgICAgICAgcmVndWxhcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGdsb2JhbEV4cG9ydDogXCJJU2Nyb2xsXCIsXHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcImlzY3JvbGwtcHJvYmVcIixcclxuICAgICAgICAgICAgc3Vic2V0OiB7XHJcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9pc2Nyb2xsXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG06ZGV2XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImZsaXBzbmFwXCI6IHtcclxuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtXCIsXHJcbiAgICAgICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxyXG4gICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IFwiRmxpcHNuYXBcIixcclxuICAgICAgICAgICAgc3Vic2V0OiB7XHJcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9mbGlwc25hcFwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtOmRldlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ3VsYXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODh+OCueOCr+ODiOODg+ODl+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgZGVza3RvcE9uQnJvd3NlciA9IDxJRGVza3RvcEFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwiZGVza3RvcFwiLFxyXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXHJcbiAgICBlczogXCJlczVcIixcclxuICAgIG1vZHVsZTogXCJhbWRcIixcclxuICAgIGVudjogXCJ3ZWJcIixcclxuICAgIHRvb2xzOiBbXCJueWNcIl0sXHJcbn07XHJcblxyXG4vKipcclxuICogIGVsZWN0cm9uIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODh+OCueOCr+ODiOODg+ODl+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBruaXouWumuWApFxyXG4gKi9cclxuY29uc3QgZGVza3RvcE9uRWxlY3Ryb24gPSA8SURlc2t0b3BBcHBDb25maWdyYXRpb24+e1xyXG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cclxuICAgIHByb2plY3RUeXBlOiBcImRlc2t0b3BcIixcclxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxyXG4gICAgZXM6IFwiZXMyMDE1XCIsXHJcbiAgICBtb2R1bGU6IFwiY29tbW9uanNcIixcclxuICAgIGVudjogXCJlbGVjdHJvbi1yZW5kZXJlclwiLFxyXG4gICAgdG9vbHM6IFtcIndlYnBhY2tcIiwgXCJueWNcIl0sXHJcbn07XHJcblxyXG4vKipcclxuICog44OW44Op44Km44K255Kw5aKD44Gn5YuV5L2c44GZ44KL44Km44Kn44OW44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXHJcbiAqL1xyXG5jb25zdCB3ZWJPbkJyb3dzZXIgPSA8SVdlYkFwcENvbmZpZ3JhdGlvbj57XHJcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxyXG4gICAgcHJvamVjdFR5cGU6IFwid2ViXCIsXHJcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cclxuICAgIGVzOiBcImVzNVwiLFxyXG4gICAgbW9kdWxlOiBcImFtZFwiLFxyXG4gICAgZW52OiBcIndlYlwiLFxyXG59O1xyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGxpYnJhcnk6IHtcclxuICAgICAgICBicm93c2VyOiBsaWJyYXJ5T25Ccm93c2VyLFxyXG4gICAgICAgIG5vZGU6IGxpYnJhcnlPbk5vZGUsXHJcbiAgICAgICAgZWxlY3Ryb246IGxpYnJhcnlPbkVsZWN0cm9uLFxyXG4gICAgICAgIEVMRUNUUk9OX0FWQUlMQUJMRTogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgbW9iaWxlOiB7XHJcbiAgICAgICAgYnJvd3NlcjogbW9iaWxlT25Ccm93c2VyLFxyXG4gICAgfSxcclxuICAgIGRlc2N0b3A6IHtcclxuICAgICAgICBicm93c2VyOiBkZXNrdG9wT25Ccm93c2VyLFxyXG4gICAgICAgIGVsZWN0cm9uOiBkZXNrdG9wT25FbGVjdHJvbixcclxuICAgIH0sXHJcbiAgICB3ZWI6IHtcclxuICAgICAgICBicm93c2VyOiB3ZWJPbkJyb3dzZXIsXHJcbiAgICB9LFxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2RlZmF1bHQtY29uZmlnLnRzIiwiZXhwb3J0ICogZnJvbSBcIi4vbG9jYWwtc2VydmVyXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL3NldHRpbmdzXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL3Rvb2xzXCI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy91dGlscy9pbmRleC50cyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJjaGlsZF9wcm9jZXNzXCJcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJvc1wiXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBcIi4vdG9vbHNcIjtcclxuaW1wb3J0IHsgZGVlcEV4dGVuZCB9IGZyb20gXCIuL2luZGV4XCI7XHJcblxyXG4vKipcclxuICogQGludGVyZmFjZSBJR2xvYmFsU2V0dGluZ3NcclxuICogQGJyaWVmIOOCsOODreODvOODkOODq+ioreWumuOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJR2xvYmFsU2V0dGluZ3Mge1xyXG4gICAgZm9yY2U/OiBib29sZWFuOyAgICAgICAgICAgIC8vIOOCqOODqeODvOe2mee2mueUqFxyXG4gICAgdmVyYm9zZT86IGJvb2xlYW47ICAgICAgICAgIC8vIOips+e0sOODreOCsFxyXG4gICAgc2lsZW50PzogYm9vbGVhbjsgICAgICAgICAgIC8vIHNpbGVudCBtb2RlXHJcbiAgICB0YXJnZXREaXI/OiBzdHJpbmc7ICAgICAgICAgLy8g5L2c5qWt44OH44Kj44Os44Kv44OI44OqXHJcbiAgICBsYW5nPzogXCJlbi1VU1wiIHwgXCJqYS1KUFwiO1xyXG59XHJcblxyXG5sZXQgX3NldHRpbmdzOiBJR2xvYmFsU2V0dGluZ3MgPSB7XHJcbiAgICBmb3JjZTogZmFsc2UsXHJcbiAgICB2ZXJib3NlOiBmYWxzZSxcclxuICAgIHNpbGVudDogZmFsc2UsXHJcbiAgICBsYW5nOiBcImVuLVVTXCIsXHJcbn07XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBleHBvcnRzIG1ldGhvZHM6XHJcblxyXG4vKipcclxuICog6Kit5a6a5Y+W5b6XXHJcbiAqXHJcbiAqIEByZXR1cm5zIG9wdGlvbnMg44Ot44Kw44Gr5L2/55So44GZ44KL44Kq44OX44K344On44OzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGluZ3MoKTogSUdsb2JhbFNldHRpbmdzIHtcclxuICAgIHJldHVybiBkZWVwRXh0ZW5kKHt9LCBfc2V0dGluZ3MpO1xyXG59XHJcblxyXG4vKipcclxuICog6Kit5a6a5oyH5a6aXHJcbiAqXHJcbiAqIEBwYXJhbSBvcHRpb25zIOODreOCsOOBq+S9v+eUqOOBmeOCi+OCquODl+OCt+ODp+ODs1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFNldHRpbmdzKHNldHRpbmdzOiBJR2xvYmFsU2V0dGluZ3MpOiB2b2lkIHtcclxuICAgIGlmIChzZXR0aW5ncykge1xyXG4gICAgICAgIF9zZXR0aW5ncy5mb3JjZSAgICAgPSBzZXR0aW5ncy5mb3JjZSAgICAgICAgfHwgX3NldHRpbmdzLmZvcmNlO1xyXG4gICAgICAgIF9zZXR0aW5ncy52ZXJib3NlICAgPSBzZXR0aW5ncy52ZXJib3NlICAgICAgfHwgX3NldHRpbmdzLnZlcmJvc2U7XHJcbiAgICAgICAgX3NldHRpbmdzLnNpbGVudCAgICA9IHNldHRpbmdzLnNpbGVudCAgICAgICB8fCBfc2V0dGluZ3Muc2lsZW50O1xyXG4gICAgICAgIF9zZXR0aW5ncy50YXJnZXREaXIgPSBzZXR0aW5ncy50YXJnZXREaXIgICAgfHwgX3NldHRpbmdzLnRhcmdldERpcjtcclxuICAgICAgICBfc2V0dGluZ3MubGFuZyAgICAgID0gc2V0dGluZ3MubGFuZyAgICAgICAgIHx8IF9zZXR0aW5ncy5sYW5nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBfc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIGZvcmNlOiBmYWxzZSxcclxuICAgICAgICAgICAgdmVyYm9zZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNpbGVudDogZmFsc2UsXHJcbiAgICAgICAgICAgIGxhbmc6IFwiZW4tVVNcIixcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog44Ot44Kw5Ye65YqbXHJcbiAqIGNvbnNvbGUubG9nKCkg44Go5ZCM562JXHJcbiAqXHJcbiAqIEBwYXJhbSBtZXNzYWdlICAgICAgICDlh7rlipvjg6Hjg4Pjgrvjg7zjgrhcclxuICogQHBhcmFtIG9wdGlvbmFsUGFyYW1zIOS7mOWKoOaDheWgsVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtZXNzYWdlPzogc3RyaW5nLCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkIHtcclxuICAgIGlmICghX3NldHRpbmdzLnNpbGVudCkge1xyXG4gICAgICAgIGlmICgwIDwgb3B0aW9uYWxQYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIG9wdGlvbmFsUGFyYW1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDoqbPntLDjg63jgrDlh7rliptcclxuICogY29uc29sZS5kZWJ1ZygpIOOBqOWQjOetiVxyXG4gKlxyXG4gKiBAcGFyYW0gbWVzc2FnZSAgICAgICAg5Ye65Yqb44Oh44OD44K744O844K4XHJcbiAqIEBwYXJhbSBvcHRpb25hbFBhcmFtcyDku5jliqDmg4XloLFcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZyhtZXNzYWdlPzogc3RyaW5nLCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkIHtcclxuICAgIGlmICghX3NldHRpbmdzLnNpbGVudCAmJiBfc2V0dGluZ3MudmVyYm9zZSkge1xyXG4gICAgICAgIGlmICgwIDwgb3B0aW9uYWxQYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJERUJVRzogXCIgKyBtZXNzYWdlLCBvcHRpb25hbFBhcmFtcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkRFQlVHOiBcIiArIG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOaknOiovFxyXG4gKiBjb25zb2xlLmFzc2VydCgpIOOBqOWQjOetiVxyXG4gKlxyXG4gKiBAcGFyYW0gdGVzdCAgICAgICAgICAg5qSc6Ki844GZ44KL5byPXHJcbiAqIEBwYXJhbSBtZXNzYWdlICAgICAgICDlh7rlipvjg6Hjg4Pjgrvjg7zjgrhcclxuICogQHBhcmFtIG9wdGlvbmFsUGFyYW1zIOS7mOWKoOaDheWgsVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydCh0ZXN0PzogYm9vbGVhbiwgbWVzc2FnZT86IHN0cmluZywgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICBpZiAoIXRlc3QpIHtcclxuICAgICAgICBpZiAoX3NldHRpbmdzLmZvcmNlKSB7XHJcbiAgICAgICAgICAgIGlmICgwIDwgb3B0aW9uYWxQYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSwgb3B0aW9uYWxQYXJhbXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKDAgPCBvcHRpb25hbFBhcmFtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgb3B0aW9uYWxQYXJhbXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3V0aWxzL3NldHRpbmdzLnRzIiwiaW1wb3J0ICogYXMgb3MgZnJvbSBcIm9zXCI7XHJcbmltcG9ydCB7IHNwYXduLCBTcGF3bk9wdGlvbnMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xyXG5pbXBvcnQgeyBTcGlubmVyIH0gZnJvbSBcImNsaS1zcGlubmVyXCI7XHJcbmltcG9ydCAqIGFzIHdoaWNoIGZyb20gXCJ3aGljaFwiO1xyXG5pbXBvcnQgKiBhcyBkZWVwRXh0ZW5kIGZyb20gXCJkZWVwLWV4dGVuZFwiO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGFzc2VydCxcclxufSBmcm9tIFwiLi9zZXR0aW5nc1wiO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIGRlZXBFeHRlbmQsXHJcbn07XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBleHBvcnRzIG1ldGhvZHM6XHJcblxyXG4vKipcclxuICogSGFuZGxlIGNvbW1hbmQgbGluZSBlcnJvciBhbmQga2lsbCBwcm9jZXNzLlxyXG4gKiBXaGVuIHRoZSBhcHBsaWNhdGlvbiByZWNlaXZlZCBlcnJvciBmcm9tIGNsaSwgcGxlYXNlIGNhbGwgdGhpcyBtZXRob2QuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBlcnJvciAgZXJyb3IgaW5mb3JtYXRpb24uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3I6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgYXNzZXJ0KGZhbHNlLCBlcnJvcik7XHJcbn1cclxuXHJcbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4vKipcclxuICogR2V0IHNwaW5uZXIgaW5zdGFuY2UuXHJcbiAqIENMSSBoZWxwZXIuXHJcbiAqXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gIFtmb3JtYXRdICBzcGlubmVyIGZvcm1hdCBzdHJpbmcuXHJcbiAqIEBwYXJhbSAge051bWJlcn0gIFtpbmRleF0gICBzcGlubmVyIGluZGV4IGRlZmluZWQgYnkgY2xpLXNwaW5uZXIuIChkZWZhdWx0OiByYW5kb20gWzAtMjldKVxyXG4gKiBAcmV0dXJuIHtTcGlubmVyfSBjbGktc3Bpbm5lciBpbnN0YW5jZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGlubmVyKGZvcm1hdD86IHN0cmluZywgaW5kZXg/OiBudW1iZXIpOiB7IHN0YXJ0OiAoKSA9PiB2b2lkOyBzdG9wOiAoY2xlYW4/OiBib29sZWFuKSA9PiB2b2lkOyB9IHtcclxuICAgIGNvbnN0IHNwaW5uZXJzID0gW1xyXG4gICAgICAgIFwifC8tXFxcXFwiLFxyXG4gICAgICAgIFwi4pSk4pSY4pS04pSU4pSc4pSM4pSs4pSQXCIsXHJcbiAgICAgICAgXCLil6Lil6Pil6Til6VcIixcclxuICAgICAgICBcIuKWjOKWgOKWkOKWhFwiLFxyXG4gICAgICAgIFwi4paJ4paK4paL4paM4paN4paO4paP4paO4paN4paM4paL4paK4paJXCIsXHJcbiAgICAgICAgXCLiloHiloPiloTiloXilobilofilojilofilobiloXiloTiloNcIixcclxuICAgICAgICBcIuKYseKYsuKYtFwiLFxyXG4gICAgICAgIFwiLm9PQCpcIixcclxuICAgICAgICBcIuKXkOKXk+KXkeKXklwiLFxyXG4gICAgICAgIC8vLy9cclxuICAgICAgICBcIuKXoeKXoSDiipniipkg4peg4pegXCIsXHJcbiAgICAgICAgXCLilqDilqHilqrilqtcIixcclxuICAgICAgICBcIuKGkOKGluKGkeKGl+KGkuKGmOKGk+KGmVwiLFxyXG4gICAgICAgIFwiLm9PwrBPby5cIixcclxuICAgIF07XHJcbiAgICBjb25zdCBmbXQgPSBmb3JtYXQgfHwgXCIlc1wiO1xyXG4gICAgY29uc3Qgc3Bpbm5lciA9IG5ldyBTcGlubmVyKGZtdCk7XHJcbiAgICBjb25zdCBpZHggPSAobnVsbCAhPSBpbmRleCAmJiAwIDw9IGluZGV4ICYmIGluZGV4IDwgMTQpID8gaW5kZXggOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbiAgICBzcGlubmVyLnNldFNwaW5uZXJTdHJpbmcoc3Bpbm5lcnNbaWR4XSk7XHJcbiAgICByZXR1cm4gc3Bpbm5lcjtcclxufVxyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIEV4ZWNDb21tYW5kT3B0aW9uc1xyXG4gKiBAYnJpZWYgZXhlY0NvbW1hbmQoKSDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7NcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXhlY0NvbW1hbmRPcHRpb25zIGV4dGVuZHMgU3Bhd25PcHRpb25zIHtcclxuICAgIHNwaW5uZXI/OiB7XHJcbiAgICAgICAgZm9ybWF0Pzogc3RyaW5nOyAgICAvLyBleCkgXCIlc1wiXHJcbiAgICAgICAgaW5kZXg/OiBudW1iZXI7ICAgICAvLyAwIC0gOSDjga7mlbDlgKTjgpLmjIflrppcclxuICAgIH07XHJcbiAgICBzdGRvdXQ/OiAoZGF0YTogc3RyaW5nKSA9PiB2b2lkO1xyXG4gICAgc3RkZXJyPzogKGRhdGE6IHN0cmluZykgPT4gdm9pZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEV4ZWN1dGUgY29tbWFuZCBsaW5lIGJ5IHNwYXduLlxyXG4gKiBjYWxsIHNwYXduLiBpZiBlcnJvciBvY2N1cmVkLCBjdWkgaXMga2lsbGVkIHByb2NjZXNzLlxyXG4gKlxyXG4gKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgICAgICAgIGNvbW1hbmQgICAgbWFpbiBjb21tYW5kLiBleCkgXCJjb3Jkb3ZhXCJcclxuICogQHBhcmFtICAge1N0cmluZ1tdfSAgICAgICAgICAgICBhcmdzICAgICAgIGNvbW1hbmQgYXJncy4gZXgpIFtcInBsdWdpblwiLCBcImFkZFwiLCBwbHVnaW5OYW1lXVxyXG4gKiBAcGFyYW0gICB7RXhlY0NvbW1hbmRPcHRpb25zfSAgIFtvcHRpb25zXSAgY2xpLXNwaW5uZXJcInMgb3B0aW9ucy5cclxuICogQHJldHVybnMge051bWJlcn0gZXJyb3IgY29kZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWNDb21tYW5kKGNvbW1hbmQ6IHN0cmluZywgYXJnczogc3RyaW5nW10sIG9wdGlvbnM/OiBFeGVjQ29tbWFuZE9wdGlvbnMpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBvcHQ6IEV4ZWNDb21tYW5kT3B0aW9ucyA9IGRlZXBFeHRlbmQoe30sIHtcclxuICAgICAgICAgICAgc3RkaW86IFwiaW5oZXJpdFwiLFxyXG4gICAgICAgICAgICBzcGlubmVyOiB7IGZvcm1hdDogXCIlc1wiIH0sXHJcbiAgICAgICAgICAgIHN0ZG91dDogKGRhdGE6IHN0cmluZyk6IHZvaWQgPT4geyAvKiBub29wICovIH0sXHJcbiAgICAgICAgICAgIHN0ZGVycjogKGRhdGE6IHN0cmluZyk6IHZvaWQgPT4geyAvKiBub29wICovIH0sXHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIG9uIHdpbjMyLCBjb21tYW5kIGFuZCBhcmdzIG5lZWQgdG8gYmUgcXVvdGVkIGlmIGNvbnRhaW5pbmcgc3BhY2VzXHJcbiAgICAgICAgY29uc3QgcXVvdGVJZk5lZWRlZCA9IChzdHI6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChcIndpbjMyXCIgPT09IG9zLnBsYXRmb3JtKCkgJiYgc3RyLmluY2x1ZGVzKFwiIFwiKSkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gXCJcXFwiXCIgKyBzdHIgKyBcIlxcXCJcIjtcclxuICAgICAgICAgICAgICAgIG9wdC5zaGVsbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB3aGljaChjb21tYW5kLCAoZXJyb3IsIHJlc29sdmVkQ29tbWFuZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNwaW5uZXIgPSBvcHQuc3Bpbm5lciA/IGdldFNwaW5uZXIob3B0LnNwaW5uZXIuZm9ybWF0LCBvcHQuc3Bpbm5lci5pbmRleCkgOiBudWxsO1xyXG4gICAgICAgICAgICBpZiAoc3Bpbm5lcikge1xyXG4gICAgICAgICAgICAgICAgc3Bpbm5lci5zdGFydCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXNvbHZlZENvbW1hbmQgPSBxdW90ZUlmTmVlZGVkKHJlc29sdmVkQ29tbWFuZCk7XHJcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzLm1hcChxdW90ZUlmTmVlZGVkKTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBzcGF3bihyZXNvbHZlZENvbW1hbmQsIGFyZ3MsIG9wdClcclxuICAgICAgICAgICAgICAgIC5vbihcImVycm9yXCIsIGhhbmRsZUVycm9yKVxyXG4gICAgICAgICAgICAgICAgLm9uKFwiY2xvc2VcIiwgKGNvZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3Bpbm5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGlubmVyLnN0b3AodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29kZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChcInBpcGVcIiA9PT0gb3B0LnN0ZGlvKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5zdGRvdXQub24oXCJkYXRhXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LnN0ZG91dChkYXRhLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5zdGRlcnIub24oXCJkYXRhXCIsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LnN0ZGVycihkYXRhLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3V0aWxzL3Rvb2xzLnRzIiwiaW1wb3J0IHtcclxuICAgIGRlZmF1bHQgYXMgQ0RQTGliLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIENvbW1hbmRQYXJzZXIsXHJcbiAgICBJQ29tbWFuZExpbmVJbmZvLFxyXG59IGZyb20gXCIuL2NvbW1hbmQtcGFyc2VyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRMaWJyYXJ5LFxyXG59IGZyb20gXCIuL3Byb21wdC1saWJyYXJ5XCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRNb2JpbGVBcHAsXHJcbn0gZnJvbSBcIi4vcHJvbXB0LW1vYmlsZVwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0RGVza3RvcEFwcCxcclxufSBmcm9tIFwiLi9wcm9tcHQtZGVza3RvcFwiO1xyXG5pbXBvcnQge1xyXG4gICAgUHJvbXB0V2ViQXBwLFxyXG59IGZyb20gXCIuL3Byb21wdC13ZWJcIjtcclxuaW1wb3J0IHtcclxuICAgIGRlZmF1bHQgYXMgQ0RQRG9jLFxyXG59IGZyb20gXCIuL2NkcC1kb2NcIjtcclxuXHJcbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XHJcblxyXG5mdW5jdGlvbiBnZXRDcmVhdGVJbnF1aXJlcihjbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvKTogUHJvbXB0QmFzZSB7XHJcbiAgICBzd2l0Y2ggKGNtZEluZm8udGFyZ2V0KSB7XHJcbiAgICAgICAgY2FzZSBcImxpYnJhcnlcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRMaWJyYXJ5KCk7XHJcbiAgICAgICAgY2FzZSBcIm1vYmlsZVwiOlxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdE1vYmlsZUFwcCgpO1xyXG4gICAgICAgIGNhc2UgXCJkZXNrdG9wXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0RGVza3RvcEFwcCgpO1xyXG4gICAgICAgIGNhc2UgXCJ3ZWJcIjpcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRXZWJBcHAoKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcInVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyBjbWRJbmZvLnRhcmdldCkpO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlucXVpcmVDcmVhdGUoY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbyk6IHZvaWQge1xyXG4gICAgY29uc3QgaW5xdWlyZXIgPSBnZXRDcmVhdGVJbnF1aXJlcihjbWRJbmZvKTtcclxuXHJcbiAgICAgICAgaW5xdWlyZXIucHJvbXB0aW5nKGNtZEluZm8pXHJcbiAgICAgICAgICAgIC50aGVuKChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGV4ZWN1dGVcclxuICAgICAgICAgICAgICAgIHJldHVybiBDRFBMaWIuZXhlY3V0ZShjb25maWcpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihpbnF1aXJlci5sYW5nLmZpbmlzaGVkW2NtZEluZm8uYWN0aW9uXSkpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJzdHJpbmdcIiAhPT0gdHlwZW9mIHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHJlYXNvbi5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbiA9IHJlYXNvbi5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbiA9IEpTT04uc3RyaW5naWZ5KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQocmVhc29uKSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIE5PVEU6IGVzNiBwcm9taXNlJ3MgYWx3YXlzIGJsb2NrLlxyXG4gICAgICAgICAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnJvd3NlRG9jKHBydDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBDRFBEb2MuZXhlY3V0ZShwcnQpLnRoZW4oKHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkF1dG9tYXRpY2FseSB3ZWIgYnJvd3NlciBvcGVuZWQgYW5kIHlvdSBjYW4gYnJvd3NlIGNkcCBkb2N1bWVudHMuXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVG8gcXVpdCBicm93c2luZywgcHJlc3MgQ3RybCArIEMuXCIpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaCgocmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEZWZhdWx0IHBvcnQgODA4MCBpcyBhbHJlYWR5IHVzZWQuIFBsZWFzZSB1c2UgYW5vdGhlciBwb3J0LCBmb3IgZXhhbXBsZSAkIGNkcCBkb2MgLXAgMzAwMFwiKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIHByb2Nlc3MudGl0bGUgPSBcImNkcFwiO1xyXG4gICAgY29uc3QgY21kSW5mbyA9IENvbW1hbmRQYXJzZXIucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuICAgIGNvbnN0IHBydDogc3RyaW5nID0gY21kSW5mby5jbGlPcHRpb25zLnBvcnQ7XHJcblxyXG4gICAgc3dpdGNoIChjbWRJbmZvLmFjdGlvbikge1xyXG4gICAgICAgIGNhc2UgXCJjcmVhdGVcIjpcclxuICAgICAgICAgICAgaW5xdWlyZUNyZWF0ZShjbWRJbmZvKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcImRvY1wiOlxyXG4gICAgICAgICAgICBicm93c2VEb2MocHJ0KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoY21kSW5mby5hY3Rpb24gKyBcIiBjb21tYW5kOiB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY2RwLWNsaS50cyIsImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0ICogYXMgY29tbWFuZGVyIGZyb20gXCJjb21tYW5kZXJcIjtcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tIFwiY2RwLWxpYlwiO1xyXG5cclxuY29uc3QgZnMgICAgPSBVdGlscy5mcztcclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbi8qKlxyXG4gKiBAaW50ZXJmYWNlIElDb21tYW5kTGluZU9wdGlvbnNcclxuICogQGJyaWVmICAgICDjgrPjg57jg7Pjg4njg6njgqTjg7PnlKjjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lT3B0aW9ucyB7XHJcbiAgICBmb3JjZTogYm9vbGVhbjsgICAgIC8vIOOCqOODqeODvOe2mee2mueUqFxyXG4gICAgdGFyZ2V0RGlyOiBzdHJpbmc7ICAvLyDkvZzmpa3jg4fjgqPjg6zjgq/jg4jjg6rmjIflrppcclxuICAgIGNvbmZpZzogc3RyaW5nOyAgICAgLy8g44Kz44Oz44OV44Kj44Kw44OV44Kh44Kk44Or5oyH5a6aXHJcbiAgICB2ZXJib3NlOiBib29sZWFuOyAgIC8vIOips+e0sOODreOCsFxyXG4gICAgc2lsZW50OiBib29sZWFuOyAgICAvLyBzaWxlbnQgbW9kZVxyXG4gICAgbWluaWZ5OiBib29sZWFuOyAgICAvLyBtaW5pZnkgc3VwcG9ydFxyXG4gICAgcG9ydDogc3RyaW5nOyAgICAgICAvLyBsb2NhbCBzZXJ2ZXIgbGlzdGVuaW5nIHBvcnRcclxufVxyXG5cclxuLyoqXHJcbiAqIEBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lSW5mb1xyXG4gKiBAYnJpZWYgICAgIOOCs+ODnuODs+ODieODqeOCpOODs+aDheWgseagvOe0jeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgIHBrZ0Rpcjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIENMSSDjgqTjg7Pjgrnjg4jjg7zjg6vjg4fjgqPjg6zjgq/jg4jjg6pcclxuICAgIGFjdGlvbjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCouOCr+OCt+ODp+ODs+WumuaVsFxyXG4gICAgdGFyZ2V0OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgICAgLy8g44Kz44Oe44Oz44OJ44K/44O844Ky44OD44OIXHJcbiAgICBpbnN0YWxsZWREaXI6IHN0cmluZzsgICAgICAgICAgICAgICAvLyBDTEkg44Kk44Oz44K544OI44O844OrXHJcbiAgICBjbGlPcHRpb25zOiBJQ29tbWFuZExpbmVPcHRpb25zOyAgICAvLyDjgrPjg57jg7Pjg4njg6njgqTjg7PjgafmuKHjgZXjgozjgZ/jgqrjg5fjgrfjg6fjg7NcclxufVxyXG5cclxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ29tbWFuZFBhcnNlclxyXG4gKiBAYnJpZWYg44Kz44Oe44Oz44OJ44Op44Kk44Oz44OR44O844K144O8XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29tbWFuZFBhcnNlciB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gu44OR44O844K5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBhcmd2ICAgICAgIOW8leaVsOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBbb3B0aW9uc10gIOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMge0lDb21tYW5kTGluZUluZm99XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2UoYXJndjogc3RyaW5nW10sIG9wdGlvbnM/OiBhbnkpOiBJQ29tbWFuZExpbmVJbmZvIHtcclxuICAgICAgICBjb25zdCBjbWRsaW5lID0gPElDb21tYW5kTGluZUluZm8+e1xyXG4gICAgICAgICAgICBwa2dEaXI6IHRoaXMuZ2V0UGFja2FnZURpcmVjdG9yeShhcmd2KSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgcGtnOiBhbnk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHBrZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihjbWRsaW5lLnBrZ0RpciwgXCJwYWNrYWdlLmpzb25cIiksIFwidXRmOFwiKS50b1N0cmluZygpKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcInBhY2thZ2UuanNvbiBwYXJzZSBlcnJvcjogXCIgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAudmVyc2lvbihwa2cudmVyc2lvbilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1mLCAtLWZvcmNlXCIsIFwiQ29udGludWUgZXhlY3V0aW9uIGV2ZW4gaWYgaW4gZXJyb3Igc2l0dWF0aW9uXCIpXHJcbiAgICAgICAgICAgIC5vcHRpb24oXCItdCwgLS10YXJnZXRkaXIgPHBhdGg+XCIsIFwiU3BlY2lmeSBwcm9qZWN0IHRhcmdldCBkaXJlY3RvcnlcIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1jLCAtLWNvbmZpZyA8cGF0aD5cIiwgXCJTcGVjaWZ5IGNvbmZpZyBmaWxlIHBhdGhcIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi12LCAtLXZlcmJvc2VcIiwgXCJTaG93IGRlYnVnIG1lc3NhZ2VzLlwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLXMsIC0tc2lsZW50XCIsIFwiUnVuIGFzIHNpbGVudCBtb2RlLlwiKVxyXG4gICAgICAgICAgICAub3B0aW9uKFwiLS1uby1taW5pZnlcIiwgXCJOb3QgbWluaWZpZWQgb24gcmVsZWFzZS5cIilcclxuICAgICAgICAgICAgLm9wdGlvbihcIi1wLCAtLXBvcnQgPHBvcnQ+XCIsIFwiU2V0IGxvY2FsIHNlcnZlciBwb3J0IHdoZW4gYnJvd3NpbmcgZG9jdW1lbnRcIilcclxuICAgICAgICA7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcImluaXRcIilcclxuICAgICAgICAgICAgLmRlc2NyaXB0aW9uKFwiaW5pdCBwcm9qZWN0XCIpXHJcbiAgICAgICAgICAgIC5hY3Rpb24oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY21kbGluZS5hY3Rpb24gPSBcImluaXRcIjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKFwiLS1oZWxwXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICBFeGFtcGxlczpcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBpbml0XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyXHJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiY3JlYXRlIDx0YXJnZXQ+XCIpXHJcbiAgICAgICAgICAgIC5kZXNjcmlwdGlvbihcImNyZWF0ZSBib2lsZXJwbGF0ZSBmb3IgJ2xpYnJhcnksIG1vZHVsZScgfCAnbW9iaWxlLCBhcHAnIHwgJ2Rlc2t0b3AnIHwgJ3dlYidcIilcclxuICAgICAgICAgICAgLmFjdGlvbigodGFyZ2V0OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgvXihtb2R1bGV8YXBwfGxpYnJhcnl8bW9iaWxlfGRlc2t0b3B8d2ViKSQvaS50ZXN0KHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLmFjdGlvbiA9IFwiY3JlYXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY21kbGluZS50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwibW9kdWxlXCIgPT09IGNtZGxpbmUudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gXCJsaWJyYXJ5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImFwcFwiID09PSBjbWRsaW5lLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLnRhcmdldCA9IFwibW9iaWxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQudW5kZXJsaW5lKFwiICB1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgdGFyZ2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oXCItLWhlbHBcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgIEV4YW1wbGVzOlwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBsaWJyYXJ5XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBtb2JpbGVcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgY3JlYXRlIGFwcCAtYyBzZXR0aW5nLmpzb25cIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21tYW5kZXJcclxuICAgICAgICAgICAgLmNvbW1hbmQoXCIqXCIsIG51bGwsIHsgbm9IZWxwOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIC5hY3Rpb24oKGNtZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkLnVuZGVybGluZShcIiAgdW5zdXBwb3J0ZWQgY29tbWFuZDogXCIgKyBjbWQpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbW1hbmRlclxyXG4gICAgICAgICAgICAuY29tbWFuZChcImRvY1wiKVxyXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJzaG93IGRvY3VtZW50IHdpdGggYnJvd3NlclwiKVxyXG4gICAgICAgICAgICAuYWN0aW9uKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNtZGxpbmUuYWN0aW9uID0gXCJkb2NcIjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKFwiLS1oZWxwXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICBFeGFtcGxlczpcIikpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBkb2MgLXAgPHBvcnQgbnVtYmVyPlwiKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBkb2MgPDxpbiBjYXNlIG9mIHVzaW5nIGRlZmF1bHQgcG9ydDogODA4MD4+XCIpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29tbWFuZGVyLnBhcnNlKGFyZ3YpO1xyXG5cclxuICAgICAgICBpZiAoYXJndi5sZW5ndGggPD0gMikge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbWRsaW5lLmNsaU9wdGlvbnMgPSB0aGlzLnRvQ29tbWFuZExpbmVPcHRpb25zKGNvbW1hbmRlcik7XHJcblxyXG4gICAgICAgIHJldHVybiBjbWRsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwcml2YXRlIHN0YXRpYyBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDTEkg44Gu44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44Oq44KS5Y+W5b6XXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nW119IGFyZ3Yg5byV5pWwXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODqlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYWNrYWdlRGlyZWN0b3J5KGFyZ3Y6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgICAgICAvLyBBZGRlZDogSXNzdWUgIzQ6IGdldCB0aGUgcmVhbCBwYXRoIG9mIGV4ZWMsIGJlY2F1c2UgZ2V0IHRoZSBwYXRoIG9mIHN5bWJvbGljIGxpbmsgb2YgZXhlYyBvbiBNYWMuXHJcbiAgICAgICAgY29uc3QgZXhlY1JlYWxQYXRoID0gZnMucmVhbHBhdGhTeW5jKGFyZ3ZbMV0pO1xyXG4gICAgICAgIC8vXHJcbiAgICAgICAgY29uc3QgZXhlY0RpciA9IHBhdGguZGlybmFtZShleGVjUmVhbFBhdGgpO1xyXG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oZXhlY0RpciwgXCIuLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENMSSBvcHRpb24g44KSIElDb21tYW5kTGluZU9wdGlvbnMg44Gr5aSJ5o+bXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBjb21tYW5kZXIgcGFyc2Ug5riI44G/IGNvbWFubmRlciDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAqIEByZXR1cm4ge0lDb21tYW5kTGluZU9wdGlvbnN9IG9wdGlvbiDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdG9Db21tYW5kTGluZU9wdGlvbnMoY29tbWFuZDogYW55KTogSUNvbW1hbmRMaW5lT3B0aW9ucyB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZm9yY2U6ICEhY29tbWFuZC5mb3JjZSxcclxuICAgICAgICAgICAgdGFyZ2V0RGlyOiBjb21tYW5kLnRhcmdldGRpcixcclxuICAgICAgICAgICAgY29uZmlnOiBjb21tYW5kLmNvbmZpZyxcclxuICAgICAgICAgICAgdmVyYm9zZTogISFjb21tYW5kLnZlcmJvc2UsXHJcbiAgICAgICAgICAgIHNpbGVudDogISFjb21tYW5kLnNpbGVudCxcclxuICAgICAgICAgICAgbWluaWZ5OiBjb21tYW5kLm1pbmlmeSxcclxuICAgICAgICAgICAgcG9ydDogY29tbWFuZC5wb3J0LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5jjg6vjg5fooajnpLrjgZfjgabntYLkuoZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2hvd0hlbHAoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaW5mb3JtID0gKHRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gY2hhbGsuZ3JlZW4odGV4dCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb21tYW5kZXIub3V0cHV0SGVscCg8YW55PmluZm9ybSk7XHJcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY29tbWFuZC1wYXJzZXIudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21tYW5kZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJTGlicmFyeUNvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5pbXBvcnQgZGVmYXVsdENvbmZpZyBmcm9tIFwiLi9kZWZhdWx0LWNvbmZpZ1wiO1xyXG5cclxuY29uc3QgJCAgICAgICAgICAgICA9IFV0aWxzLiQ7XHJcbmNvbnN0IGNoYWxrICAgICAgICAgPSBVdGlscy5jaGFsaztcclxuY29uc3Qgc2VtdmVyUmVnZXggICA9IFV0aWxzLnNlbXZlclJlZ2V4O1xyXG5jb25zdCBsaWJDb25maWcgICAgID0gZGVmYXVsdENvbmZpZy5saWJyYXJ5O1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRMaWJyYXJ5XHJcbiAqIEBicmllZiDjg6njgqTjg5bjg6njg6rjg6Ljgrjjg6Xjg7zjg6vnlKggSW5xdWlyZSDjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQcm9tcHRMaWJyYXJ5IGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAvLyBwcm9qZWN0IGNvbW1vbiBzZXR0bmlncyAoSVByb2plY3RDb25maWdyYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwicHJvamVjdE5hbWVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnByb2plY3ROYW1lLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMucHJvamVjdE5hbWUgfHwgXCJjb29sLXByb2plY3QtbmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghL15bYS16QS1aMC05L0AuXy1dKyQvLnRlc3QodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInZlcnNpb25cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy52ZXJzaW9uIHx8IFwiMC4wLjFcIixcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlclJlZ2V4KCkuZXhlYyh2YWx1ZSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24uaW52YWxpZE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImxpY2Vuc2VcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5hcGFjaGUyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJBcGFjaGUtMi4wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5taXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk1JVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMucHJvcHJpZXRhcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk5PTkVcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmxpY2Vuc2UgfHwgXCJOT05FXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGxpYnJhcnkgc2V0dG5pZ3MgKElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImVudlwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5saWJyYXJ5LmVudi5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMuYnJvd3NlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwid2ViXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVudi5jaG9pY2VzLm5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vZGVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBpbnF1aXJlci5TZXBhcmF0b3IoKSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVudi5jaG9pY2VzLmVsZWN0cm9uICsgdGhpcy5MSU1JVEFUSU9OKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVsZWN0cm9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVudi5jaG9pY2VzLmVsZWN0cm9uUmVuZGVyZXIgKyB0aGlzLkxJTUlUQVRJT04oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZWxlY3Ryb24tcmVuZGVyZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGliQ29uZmlnLkVMRUNUUk9OX0FWQUlMQUJMRSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImVsZWN0cm9uXCIgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm5vZGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiZWxlY3Ryb24tcmVuZGVyZXJcIiA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwid2ViXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZW52IHx8IFwid2ViXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIGJhc2Ugc3RydWN0dXJlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJleHRyYVNldHRpbmdzXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLmNob2ljZXMucmVjb21tZW5kZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5jdXN0b20sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImN1c3RvbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmV4dHJhU2V0dGluZ3MgfHwgXCJyZWNvbW1lbmRlZFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChjdXN0b206IG1vZHVsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm1vZHVsZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy5ub25lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmNvbW1vbmpzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb21tb25qc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKFwiYW1kXCIgIT09IHRoaXMuYW5zd2Vycy5tb2R1bGUpID8gKHRoaXMuYW5zd2Vycy5tb2R1bGUgfHwgXCJjb21tb25qc1wiKSA6IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiAvXihub2RlfGVsZWN0cm9uKSQvaS50ZXN0KGFuc3dlcnMuZW52KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMubm9uZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy5hbWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImFtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy51bWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKFwiY29tbW9uanNcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZSB8fCBcImFtZFwiKSA6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3MgJiYgXCJ3ZWJcIiA9PT0gYW5zd2Vycy5lbnY7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwibW9kdWxlXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLm5vbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMuY29tbW9uanMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvbW1vbmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmFtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiYW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLnVtZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubW9kdWxlIHx8IFwiY29tbW9uanNcIixcclxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiBcImVsZWN0cm9uLXJlbmRlcmVyXCIgPT09IGFuc3dlcnMuZW52O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoY3VzdG9tOiBlcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImVzXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lcy5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXMuY2hvaWNlcy5lczUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVzNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lcy5jaG9pY2VzLmVzMjAxNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXMyMDE1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZXMgfHwgKFwid2ViXCIgPT09IHRoaXMuYW5zd2Vycy5lbnYgPyBcImVzNVwiIDogXCJlczIwMTVcIiksXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICBjb25zdCBjb25maWc6IElMaWJyYXJ5Q29uZmlncmF0aW9uID0gKCgpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChhbnN3ZXJzLmVudikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIndlYlwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmJyb3dzZXIsIGFuc3dlcnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm5vZGVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5ub2RlLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJlbGVjdHJvblwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmVsZWN0cm9uLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJlbGVjdHJvbi1yZW5kZXJlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmVsZWN0cm9uLCBhbnN3ZXJzKTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJ1bnN1cHBvcnRlZCB0YXJnZXQ6IFwiICsgYW5zd2Vycy5lbnYpKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICBjb25zdCBpdGVtcyA9IFtcclxuICAgICAgICAgICAgeyBuYW1lOiBcImV4dHJhU2V0dGluZ3NcIiwgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwicHJvamVjdE5hbWVcIiwgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJ2ZXJzaW9uXCIsICAgICAgICAgIHJlY29tbWVuZDogZmFsc2UgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImxpY2Vuc2VcIiwgICAgICAgICAgcmVjb21tZW5kOiBmYWxzZSAgICB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZW52XCIsICAgICAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJtb2R1bGVcIiwgICAgICAgICAgIHJlY29tbWVuZDogdHJ1ZSAgICAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImVzXCIsICAgICAgICAgICAgICAgcmVjb21tZW5kOiB0cnVlICAgICB9LFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gKGl0ZW0ucmVjb21tZW5kICYmIFwicmVjb21tZW5kZWRcIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzKSA/IFwieWVsbG93XCIgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbmZpZzJkZXNjcmlwdGlvbihjb25maWcsIGl0ZW0ubmFtZSwgY29sb3IpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvciwgbnVsbCwgNCkpKTtcclxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzOlxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZWxlY3Ryb24g44GM5pyJ5Yq55Ye644Gq44GE5aC05ZCI44Gu6KOc6Laz5paH5a2X44KS5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgTElNSVRBVElPTigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBsaWJDb25maWcuRUxFQ1RST05fQVZBSUxBQkxFID8gXCJcIiA6IFwiIFwiICsgdGhpcy5sYW5nLnByb21wdC5jb21tb24uc3RpbE5vdEF2YWlsYWJsZTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1saWJyYXJ5LnRzIiwiaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XHJcbmltcG9ydCB7XHJcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcclxuICAgIElFeHRlcm5hbE1vZHVsZUluZm8sXHJcbiAgICBJTW9iaWxlQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gXCIuL2RlZmF1bHQtY29uZmlnXCI7XHJcblxyXG5jb25zdCAkICAgICAgICAgICAgID0gVXRpbHMuJDtcclxuY29uc3QgXyAgICAgICAgICAgICA9IFV0aWxzLl87XHJcbmNvbnN0IGNoYWxrICAgICAgICAgPSBVdGlscy5jaGFsaztcclxuY29uc3Qgc2VtdmVyUmVnZXggICA9IFV0aWxzLnNlbXZlclJlZ2V4O1xyXG5jb25zdCBtb2JpbGVDb25maWcgID0gZGVmYXVsdENvbmZpZy5tb2JpbGU7XHJcblxyXG5jb25zdCBFWFRFUk5BTF9ERUZBVUxUUyA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBkZWZhdWx0czogc3RyaW5nW10gPSBbXTtcclxuICAgIE9iamVjdC5rZXlzKG1vYmlsZUNvbmZpZy5icm93c2VyLmV4dGVybmFsKVxyXG4gICAgICAgIC5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuICAgICAgICAgICAgaWYgKG1vYmlsZUNvbmZpZy5icm93c2VyLmV4dGVybmFsW3RhcmdldF0ucmVndWxhcikge1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdHMucHVzaCh0YXJnZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gZGVmYXVsdHM7XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFByb21wdE1vYmlsZUFwcFxyXG4gKiBAYnJpZWYg44Oi44OQ44Kk44Or44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0TW9iaWxlQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGdldCBxdWVzdGlvbnMoKTogaW5xdWlyZXIuUXVlc3Rpb25zIHtcclxuICAgICAgICBjb25zdCBwbGF0Zm9ybXNfZGVmYXVsdCA9IHRoaXMuYW5zd2Vycy5wbGF0Zm9ybXNcclxuICAgICAgICAgICAgPyB0aGlzLmFuc3dlcnMucGxhdGZvcm1zLnNsaWNlKClcclxuICAgICAgICAgICAgOiBtb2JpbGVDb25maWcuYnJvd3Nlci5wbGF0Zm9ybXM7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYW5zd2Vycy5wbGF0Zm9ybXM7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2plY3RTdHJ1Y3R1cmVfZGVmYXVsdCA9IHRoaXMuYW5zd2Vycy5wcm9qZWN0U3RydWN0dXJlXHJcbiAgICAgICAgICAgID8gdGhpcy5hbnN3ZXJzLnByb2plY3RTdHJ1Y3R1cmUuc2xpY2UoKVxyXG4gICAgICAgICAgICA6IG1vYmlsZUNvbmZpZy5icm93c2VyLnByb2plY3RTdHJ1Y3R1cmU7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuYW5zd2Vycy5wcm9qZWN0U3RydWN0dXJlO1xyXG5cclxuICAgICAgICBjb25zdCBleHRlcm5hbF9kZWZhdWx0ID0gdGhpcy5hbnN3ZXJzLmV4dGVybmFsXHJcbiAgICAgICAgICAgID8gdGhpcy5hbnN3ZXJzLmV4dGVybmFsLnNsaWNlKClcclxuICAgICAgICAgICAgOiBFWFRFUk5BTF9ERUZBVUxUUztcclxuICAgICAgICBkZWxldGUgdGhpcy5hbnN3ZXJzLmV4dGVybmFsO1xyXG5cclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAvLyBwcm9qZWN0IGNvbW1vbiBzZXR0bmlncyAoSVByb2plY3RDb25maWdyYXRpb24pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiYXBwTmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuYXBwTmFtZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLmFwcE5hbWUgfHwgXCJDb29sIEFwcCBOYW1lXCIsXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eLipbKFxcXFx8L3w6fCp8P3xcInw8fD58fCldLiokLy50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuYXBwTmFtZS5pbnZhbGlkTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInByb2plY3ROYW1lXCIsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy50cmltKF8uZGFzaGVyaXplKGFuc3dlcnMuYXBwTmFtZS50b0xvd2VyQ2FzZSgpKSwgXCItXCIpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIS9eW2EtekEtWjAtOV8tXSokLy50ZXN0KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5jb21tb24ucHJvamVjdE5hbWUuaW52YWxpZE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJhcHBJZFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuYXBwSWQubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5hcHBJZCB8fCBcIm9yZy5jb29sLmFwcG5hbWVcIixcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInZlcnNpb25cIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24ubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy52ZXJzaW9uIHx8IFwiMC4wLjFcIixcclxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlclJlZ2V4KCkuZXhlYyh2YWx1ZSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24uaW52YWxpZE1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImxpY2Vuc2VcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5hcGFjaGUyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJBcGFjaGUtMi4wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5taXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk1JVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMucHJvcHJpZXRhcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk5PTkVcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5saWNlbnNlIHx8IFwiTk9ORVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNoZWNrYm94XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInBsYXRmb3Jtc1wiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUucGxhdGZvcm1zLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImFuZHJvaWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZDogKDAgPD0gcGxhdGZvcm1zX2RlZmF1bHQuaW5kZXhPZihcImFuZHJvaWRcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImlvc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBwbGF0Zm9ybXNfZGVmYXVsdC5pbmRleE9mKFwiaW9zXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImV4dHJhU2V0dGluZ3NcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5yZWNvbW1lbmRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwicmVjb21tZW5kZWRcIixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXh0cmFTZXR0aW5ncy5jaG9pY2VzLmN1c3RvbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY3VzdG9tXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZXh0cmFTZXR0aW5ncyB8fCBcInJlY29tbWVuZGVkXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwicHJvamVjdFN0cnVjdHVyZVwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUucHJvamVjdFN0cnVjdHVyZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUucHJvamVjdFN0cnVjdHVyZS5saWIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImxpYlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBwcm9qZWN0U3RydWN0dXJlX2RlZmF1bHQuaW5kZXhPZihcImxpYlwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLnByb2plY3RTdHJ1Y3R1cmUucG9ydGluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwicG9ydGluZ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBwcm9qZWN0U3RydWN0dXJlX2RlZmF1bHQuaW5kZXhPZihcInBvcnRpbmdcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJleHRlcm5hbFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIHBhZ2luYXRlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcih0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5zZXBhcmF0b3IuY29yZG92YSksXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tb2R1bGVzW1wiY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZVwiXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuc3dlcnMucGxhdGZvcm1zIHx8IGFuc3dlcnMucGxhdGZvcm1zLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm5vQ29yZG92YU1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJjb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvcmRvdmEtcGx1Z2luLWluYXBwYnJvd3NlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJjb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYW5zd2Vycy5wbGF0Zm9ybXMgfHwgYW5zd2Vycy5wbGF0Zm9ybXMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubm9Db3Jkb3ZhTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImNvcmRvdmEtcGx1Z2luLWFwcC12ZXJzaW9uXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb3Jkb3ZhLXBsdWdpbi1hcHAtdmVyc2lvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJjb3Jkb3ZhLXBsdWdpbi1hcHAtdmVyc2lvblwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhbnN3ZXJzLnBsYXRmb3JtcyB8fCBhbnN3ZXJzLnBsYXRmb3Jtcy5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5ub0NvcmRvdmFNZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcih0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5zZXBhcmF0b3IudXRpbHMpLFxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXN0cmluZy1saXRlcmFsICovXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tb2R1bGVzW1wiaG9nYW4uanNcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImhvZ2FuLmpzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImhvZ2FuLmpzXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImhhbW1lcmpzXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJoYW1tZXJqc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJoYW1tZXJqc1wiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJpc2Nyb2xsXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJpc2Nyb2xsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImlzY3JvbGxcIikpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5tb2R1bGVzW1wiZmxpcHNuYXBcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImZsaXBzbmFwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImZsaXBzbmFwXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRzbGludDplbmFibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3M7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICBjb25zdCBjb25maWc6IElNb2JpbGVBcHBDb25maWdyYXRpb24gPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9ICQuZXh0ZW5kKHt9LCBtb2JpbGVDb25maWcuYnJvd3Nlcik7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvb2t1cCA9IGRlZmF1bHRzLmV4dGVybmFsO1xyXG4gICAgICAgICAgICBkZWxldGUgZGVmYXVsdHMuZXh0ZXJuYWw7XHJcbiAgICAgICAgICAgIGNvbnN0IF9jb25maWc6IElNb2JpbGVBcHBDb25maWdyYXRpb24gPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIHtcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBFWFRFUk5BTF9ERUZBVUxUUyxcclxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llczogW10sXHJcbiAgICAgICAgICAgICAgICBkZXZEZXBlbmRlbmNpZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgY29yZG92YV9wbHVnaW46IFtdLFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VfYWRkb246IFtdLFxyXG4gICAgICAgICAgICB9LCBhbnN3ZXJzKTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNvbHZlRGVwZW5kZW5jaWVzID0gKG1vZHVsZU5hbWU6IHN0cmluZywgaW5mbzogSUV4dGVybmFsTW9kdWxlSW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoaW5mby5hY3F1aXNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibnBtXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY29uZmlnLmRlcGVuZGVuY2llcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBtb2R1bGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzOiBpbmZvLmFsaWFzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbEV4cG9ydDogaW5mby5nbG9iYWxFeHBvcnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVuZGVyTmFtZTogaW5mby52ZW5kZXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBpbmZvLmZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5wbTpkZXZcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb25maWcuZGV2RGVwZW5kZW5jaWVzLnB1c2goeyBuYW1lOiBtb2R1bGVOYW1lIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjb3Jkb3ZhXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoMCA8IF9jb25maWcucGxhdGZvcm1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb25maWcuY29yZG92YV9wbHVnaW4ucHVzaCh7IG5hbWU6IG1vZHVsZU5hbWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJlc291cmNlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY29uZmlnLnJlc291cmNlX2FkZG9uLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1vZHVsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXM6IGluZm8uYWxpYXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsRXhwb3J0OiBpbmZvLmdsb2JhbEV4cG9ydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZW5kZXJOYW1lOiBpbmZvLnZlbmRlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGluZm8uZmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgKDxhbnk+X2NvbmZpZykuZXh0ZXJuYWwuZm9yRWFjaCgodG9wOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmZvID0gPElFeHRlcm5hbE1vZHVsZUluZm8+bG9va3VwW3RvcF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWQgPSByZXNvbHZlRGVwZW5kZW5jaWVzKHRvcCwgaW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkICYmIGluZm8uc3Vic2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGluZm8uc3Vic2V0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKHN1YikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVEZXBlbmRlbmNpZXMoc3ViLCA8SUV4dGVybmFsTW9kdWxlSW5mbz5pbmZvLnN1YnNldFtzdWJdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihjaGFsay5yZWQoXCJlcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvciwgbnVsbCwgNCkpKTtcclxuICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVsZXRlIF9jb25maWcuZXh0ZXJuYWw7XHJcbiAgICAgICAgICAgIHJldHVybiBfY29uZmlnO1xyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW1xyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXh0cmFTZXR0aW5nc1wiLCAgICBmaXhlZDogZmFsc2UgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImFwcE5hbWVcIiwgICAgICAgICAgZml4ZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJwcm9qZWN0TmFtZVwiLCAgICAgIGZpeGVkOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiYXBwSWRcIiwgICAgICAgICAgICBmaXhlZDogZmFsc2UgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcInZlcnNpb25cIiwgICAgICAgICAgZml4ZWQ6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJsaWNlbnNlXCIsICAgICAgICAgIGZpeGVkOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwibW9kdWxlXCIsICAgICAgICAgICBmaXhlZDogdHJ1ZSAgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImVzXCIsICAgICAgICAgICAgICAgZml4ZWQ6IHRydWUgIH0sXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSAoaXRlbS5maXhlZCkgPyBcInllbGxvd1wiIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25maWcyZGVzY3JpcHRpb24oY29uZmlnLCBpdGVtLm5hbWUsIGNvbG9yKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwiZXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IsIG51bGwsIDQpKSk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHBsYXRmb3Jtc1xyXG4gICAgICAgIGNvbnN0IHBsYXRmb3JtSW5mbyA9ICgwIDwgY29uZmlnLnBsYXRmb3Jtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgID8gY29uZmlnLnBsYXRmb3Jtcy5qb2luKFwiLCBcIilcclxuICAgICAgICAgICAgOiB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLnBsYXRmb3Jtcy5ub25lO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLnBsYXRmb3Jtcy5sYWJlbCArIGNoYWxrLmN5YW4ocGxhdGZvcm1JbmZvKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IENPTE9SID0gKFwicmVjb21tZW5kZWRcIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzKSA/IFwieWVsbG93XCIgOiBcImN5YW5cIjtcclxuXHJcbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9qZWN0IHN0cnVjdHVyZVxyXG4gICAgICAgIGlmICgwIDwgY29uZmlnLnByb2plY3RTdHJ1Y3R1cmUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RTdHJ1Y3R1cmUgPSBjb25maWcucHJvamVjdFN0cnVjdHVyZS5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLnByb2plY3RTdHJ1Y3R1cmUubGFiZWwgKyBjaGFsa1tDT0xPUl0ocHJvamVjdFN0cnVjdHVyZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkaXRpb25hbCBjb3Jkb3ZhIHBsdWdpblxyXG4gICAgICAgIGlmICgwIDwgY29uZmlnLmNvcmRvdmFfcGx1Z2luLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgdGhpcy5sYW5nLnNldHRpbmdzLm1vYmlsZS5jb3Jkb3ZhUGx1Z2lucy5sYWJlbCk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5jb3Jkb3ZhX3BsdWdpbi5mb3JFYWNoKChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBcIiArIGNoYWxrW0NPTE9SXShpbmZvLm5hbWUpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGRpdGlvbmFsIGRlcGVuZGVuY3lcclxuICAgICAgICBpZiAoMCA8IGNvbmZpZy5kZXBlbmRlbmNpZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLmRlcGVuZGVuY2llcy5sYWJlbCk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5yZXNvdXJjZV9hZGRvbi5mb3JFYWNoKChpbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBcIiArIGNoYWxrW0NPTE9SXShpbmZvLm5hbWUpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbmZpZy5kZXBlbmRlbmNpZXMuZm9yRWFjaCgoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgXCIgKyBjaGFsa1tDT0xPUl0oaW5mby5uYW1lKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC1tb2JpbGUudHMiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJRGVza3RvcEFwcENvbmZpZ3JhdGlvbixcclxuICAgIFV0aWxzLFxyXG59IGZyb20gXCJjZHAtbGliXCI7XHJcbmltcG9ydCB7XHJcbiAgICBQcm9tcHRCYXNlLFxyXG4gICAgSUFuc3dlclNjaGVtYSxcclxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xyXG5cclxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUHJvbXB0RGVza3RvcEFwcFxyXG4gKiBAYnJpZWYg44OH44K544Kv44OI44OD44OX44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUHJvbXB0RGVza3RvcEFwcCBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogYW55KTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChcImRlc2t0b3AgYXBwIHByb21wdGluZywgdW5kZXIgY29uc3RydWN0aW9uLlwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcclxuICAgICAqL1xyXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xyXG4gICAgICAgIC8vIFRPRE86XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a44Gu56K66KqNXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7SUFuc3dlclNjaGVtYX0gYW5zd2VycyDlm57nrZTntZDmnpxcclxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlncmF0aW9ufSDoqK3lrprlgKTjgpLov5TljbRcclxuICAgICAqL1xyXG4gICAgZGlzcGxheVNldHRpbmdzQnlBbnN3ZXJzKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpOiBJUHJvamVjdENvbmZpZ3JhdGlvbiB7XHJcbiAgICAgICAgLy8gVE9ETzogc2hvd1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LWRlc2t0b3AudHMiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xyXG5pbXBvcnQge1xyXG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXHJcbiAgICBJV2ViQXBwQ29uZmlncmF0aW9uLFxyXG4gICAgVXRpbHMsXHJcbn0gZnJvbSBcImNkcC1saWJcIjtcclxuaW1wb3J0IHtcclxuICAgIFByb21wdEJhc2UsXHJcbiAgICBJQW5zd2VyU2NoZW1hLFxyXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XHJcblxyXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBQcm9tcHRXZWJBcHBcclxuICogQGJyaWVmIOOCpuOCp+ODluOCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFByb21wdFdlYkFwcCBleHRlbmRzIFByb21wdEJhc2Uge1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Oz44OI44OqXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcm9tcHRpbmcoY21kSW5mbzogYW55KTogUHJvbWlzZTxJUHJvamVjdENvbmZpZ3JhdGlvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChcIndlYiBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBpbXByZW1lbnRzIGFic3RydWN0IG1ldGhvZHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIOODl+ODreOCuOOCp+OCr+ODiOioreWumumgheebruOBruWPluW+l1xyXG4gICAgICovXHJcbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxyXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcclxuICAgICAgICAvLyBUT0RPOiBzaG93XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtd2ViLnRzIiwiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgQ2RwRG9jXHJcbiAqIEBicmllZiBUT0RPOlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0RQRG9jIHtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHViaWMgbWV0aG9kczpcclxuXHJcbiAgICAvKipcclxuICAgICAqIG1haW4gY29tbWFuZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGV4ZWN1dGUocHJ0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICByZXR1cm4gVXRpbHMubGF1bmNoTG9jYWxTZXJ2ZXIocHJ0KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFV0aWxzLmxhdW5jaEJyb3dzZXIocHJ0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NkcC1kb2MudHMiLCJpbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbi8vIGltcG9ydCB7IGV4ZWNDb21tYW5kIH0gZnJvbSBcIi4vdG9vbHNcIjtcclxuY29uc3Qgb3BuID0gcmVxdWlyZShcIm9wblwiKTtcclxuaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgKiBhcyBodHRwIGZyb20gXCJodHRwXCI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm9kZS5qc+OBrnNlcnZlci5vbignZXJyb3InKeOCkuS9v+OBhuOBn+OCgeOBq+OCpOODs+ODneODvOODiFxyXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSBcInVybFwiO1xyXG5sZXQgaG9zdE5hbWUgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6XCI7XHJcbmNvbnN0IERFRkFVTFRfUE9SVCA9IDgwODA7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGF1bmNoQnJvd3NlcihwcnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IHBydE51bWJlciA9IE51bWJlci5wYXJzZUludChwcnQpO1xyXG4gICAgcHJ0TnVtYmVyID0gcHJ0TnVtYmVyIHx8IERFRkFVTFRfUE9SVDtcclxuICAgIGhvc3ROYW1lICs9IFN0cmluZyhwcnROdW1iZXIpO1xyXG4gICAgY29uc3QgaG9zdFVybCA9IHVybC5wYXJzZShob3N0TmFtZSwgdHJ1ZSk7XHJcbiAgICByZXR1cm4gb3BuKGhvc3RVcmwuaHJlZik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hMb2NhbFNlcnZlcihwcnQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcbiAgICAgICAgY29uc3QgaHRtbFJvb3QgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwicm9vdFwiKTtcclxuICAgICAgICBhcHAudXNlKGV4cHJlc3Muc3RhdGljKGh0bWxSb290KSk7XHJcblxyXG4gICAgICAgIGxldCBwcnROdW1iZXIgPSBOdW1iZXIucGFyc2VJbnQocHJ0KTtcclxuICAgICAgICBwcnROdW1iZXIgPSBwcnROdW1iZXIgfHwgREVGQVVMVF9QT1JUO1xyXG5cclxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihhcHApO1xyXG5cclxuICAgICAgICBzZXJ2ZXIub24oXCJlcnJvclwiLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvcl9qc29uX3N0cmluZyA9IEpTT04uc3RyaW5naWZ5KGUpOyAgICAgICAgICAgICAgLy8g5L6L5aSW44Gu5YaF5a6544KSIEpTT04g5paH5a2X5YiX77yISlNPTuWFqOS9k+OBjOOCs+ODvOODhuODvOOCt+ODp+ODs+OBp+WbsuOBvuOCjOOBpuOBhOOCi++8ieOBp+WPluW+l1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvcl9qc19vYmplY3QgPSBKU09OLnBhcnNlKGVycm9yX2pzb25fc3RyaW5nKTsgICAgLy8gSlNPTuaWh+Wtl+WIl+OCkiBKYXZhU2NyaXB044Kq44OW44K444Kn44Kv44OI44Gr5aSJ5o+bXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVycm9yX2pzX29iamVjdCk7ICAgICAgIC8vIHsgY29kZTogJ0VBRERSSU5VU0UnLCBlcnJubzogJ0VBRERSSU5VU0UnLCAuLi4gLCBwb3J0OiA4MDgwIH1cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXJyb3JfanNfb2JqZWN0LmVycm5vKTsgLy8gXCJFQUREUklOVVNFXCJcclxuXHJcbiAgICAgICAgICAgIGlmKGVycm9yX2pzX29iamVjdC5lcnJubyA9PT0gXCJFQUREUklOVVNFXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiJ0VBRERSSU5VU0UnIGVycm9yIGhhcHBlbmVkIVwiKTsgICAgIC8vIGRlYnVnIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBlcnJvciBleGNlcHQgJ0VBRERSSU5VU0UgKGRlZmF1bHQgcHJvdCB1c2VkKScgaGFwcGVuZCFcIik7ICAvLyBQcm9jZXNzIG9uIGNvbW1hbmQgcHJvbnB0IHdpbGwgc3RvcC5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZXJ2ZXIubGlzdGVuKHBydE51bWJlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3V0aWxzL2xvY2FsLXNlcnZlci50cyIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBjaGlsZFByb2Nlc3MgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG5jb25zdCBpc1dzbCA9IHJlcXVpcmUoJ2lzLXdzbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICh0YXJnZXQsIG9wdHMpID0+IHtcblx0aWYgKHR5cGVvZiB0YXJnZXQgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignRXhwZWN0ZWQgYSBgdGFyZ2V0YCcpKTtcblx0fVxuXG5cdG9wdHMgPSBPYmplY3QuYXNzaWduKHt3YWl0OiB0cnVlfSwgb3B0cyk7XG5cblx0bGV0IGNtZDtcblx0bGV0IGFwcEFyZ3MgPSBbXTtcblx0bGV0IGFyZ3MgPSBbXTtcblx0Y29uc3QgY3BPcHRzID0ge307XG5cblx0aWYgKEFycmF5LmlzQXJyYXkob3B0cy5hcHApKSB7XG5cdFx0YXBwQXJncyA9IG9wdHMuYXBwLnNsaWNlKDEpO1xuXHRcdG9wdHMuYXBwID0gb3B0cy5hcHBbMF07XG5cdH1cblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcblx0XHRjbWQgPSAnb3Blbic7XG5cblx0XHRpZiAob3B0cy53YWl0KSB7XG5cdFx0XHRhcmdzLnB1c2goJy1XJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdHMuYXBwKSB7XG5cdFx0XHRhcmdzLnB1c2goJy1hJywgb3B0cy5hcHApO1xuXHRcdH1cblx0fSBlbHNlIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInIHx8IGlzV3NsKSB7XG5cdFx0Y21kID0gJ2NtZCcgKyAoaXNXc2wgPyAnLmV4ZScgOiAnJyk7XG5cdFx0YXJncy5wdXNoKCcvYycsICdzdGFydCcsICdcIlwiJywgJy9iJyk7XG5cdFx0dGFyZ2V0ID0gdGFyZ2V0LnJlcGxhY2UoLyYvZywgJ14mJyk7XG5cblx0XHRpZiAob3B0cy53YWl0KSB7XG5cdFx0XHRhcmdzLnB1c2goJy93YWl0Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdHMuYXBwKSB7XG5cdFx0XHRhcmdzLnB1c2gob3B0cy5hcHApO1xuXHRcdH1cblxuXHRcdGlmIChhcHBBcmdzLmxlbmd0aCA+IDApIHtcblx0XHRcdGFyZ3MgPSBhcmdzLmNvbmNhdChhcHBBcmdzKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKG9wdHMuYXBwKSB7XG5cdFx0XHRjbWQgPSBvcHRzLmFwcDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y21kID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3hkZy1vcGVuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKGFwcEFyZ3MubGVuZ3RoID4gMCkge1xuXHRcdFx0YXJncyA9IGFyZ3MuY29uY2F0KGFwcEFyZ3MpO1xuXHRcdH1cblxuXHRcdGlmICghb3B0cy53YWl0KSB7XG5cdFx0XHQvLyBgeGRnLW9wZW5gIHdpbGwgYmxvY2sgdGhlIHByb2Nlc3MgdW5sZXNzXG5cdFx0XHQvLyBzdGRpbyBpcyBpZ25vcmVkIGFuZCBpdCdzIGRldGFjaGVkIGZyb20gdGhlIHBhcmVudFxuXHRcdFx0Ly8gZXZlbiBpZiBpdCdzIHVucmVmJ2Rcblx0XHRcdGNwT3B0cy5zdGRpbyA9ICdpZ25vcmUnO1xuXHRcdFx0Y3BPcHRzLmRldGFjaGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRhcmdzLnB1c2godGFyZ2V0KTtcblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgJiYgYXBwQXJncy5sZW5ndGggPiAwKSB7XG5cdFx0YXJncy5wdXNoKCctLWFyZ3MnKTtcblx0XHRhcmdzID0gYXJncy5jb25jYXQoYXBwQXJncyk7XG5cdH1cblxuXHRjb25zdCBjcCA9IGNoaWxkUHJvY2Vzcy5zcGF3bihjbWQsIGFyZ3MsIGNwT3B0cyk7XG5cblx0aWYgKG9wdHMud2FpdCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRjcC5vbmNlKCdlcnJvcicsIHJlamVjdCk7XG5cblx0XHRcdGNwLm9uY2UoJ2Nsb3NlJywgY29kZSA9PiB7XG5cdFx0XHRcdGlmIChjb2RlID4gMCkge1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoJ0V4aXRlZCB3aXRoIGNvZGUgJyArIGNvZGUpKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNvbHZlKGNwKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Y3AudW5yZWYoKTtcblxuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNwKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9vcG4vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcblxuY29uc3QgaXNXc2wgPSAoKSA9PiB7XG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnbGludXgnKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKG9zLnJlbGVhc2UoKS5pbmNsdWRlcygnTWljcm9zb2Z0JykpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIGZzLnJlYWRGaWxlU3luYygnL3Byb2MvdmVyc2lvbicsICd1dGY4JykuaW5jbHVkZXMoJ01pY3Jvc29mdCcpO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG5cbmlmIChwcm9jZXNzLmVudi5fX0lTX1dTTF9URVNUX18pIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBpc1dzbDtcbn0gZWxzZSB7XG5cdG1vZHVsZS5leHBvcnRzID0gaXNXc2woKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2lzLXdzbC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJmc1wiXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJleHByZXNzXCIsXCJjb21tb25qczJcIjpcImV4cHJlc3NcIn1cbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJodHRwXCJcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInVybFwiXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbGktc3Bpbm5lclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY2xpLXNwaW5uZXJcIixcImNvbW1vbmpzMlwiOlwiY2xpLXNwaW5uZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndoaWNoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJ3aGljaFwiLFwiY29tbW9uanMyXCI6XCJ3aGljaFwifVxuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohXG4gKiBAZGVzY3JpcHRpb24gUmVjdXJzaXZlIG9iamVjdCBleHRlbmRpbmdcbiAqIEBhdXRob3IgVmlhY2hlc2xhdiBMb3RzbWFub3YgPGxvdHNtYW5vdjg5QGdtYWlsLmNvbT5cbiAqIEBsaWNlbnNlIE1JVFxuICpcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMy0yMDE1IFZpYWNoZXNsYXYgTG90c21hbm92XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZlxuICogdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpblxuICogdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0b1xuICogdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2ZcbiAqIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SXG4gKiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVJcbiAqIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOXG4gKiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaXNTcGVjaWZpY1ZhbHVlKHZhbCkge1xuXHRyZXR1cm4gKFxuXHRcdHZhbCBpbnN0YW5jZW9mIEJ1ZmZlclxuXHRcdHx8IHZhbCBpbnN0YW5jZW9mIERhdGVcblx0XHR8fCB2YWwgaW5zdGFuY2VvZiBSZWdFeHBcblx0KSA/IHRydWUgOiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gY2xvbmVTcGVjaWZpY1ZhbHVlKHZhbCkge1xuXHRpZiAodmFsIGluc3RhbmNlb2YgQnVmZmVyKSB7XG5cdFx0dmFyIHggPSBuZXcgQnVmZmVyKHZhbC5sZW5ndGgpO1xuXHRcdHZhbC5jb3B5KHgpO1xuXHRcdHJldHVybiB4O1xuXHR9IGVsc2UgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcblx0XHRyZXR1cm4gbmV3IERhdGUodmFsLmdldFRpbWUoKSk7XG5cdH0gZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgUmVnRXhwKSB7XG5cdFx0cmV0dXJuIG5ldyBSZWdFeHAodmFsKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgc2l0dWF0aW9uJyk7XG5cdH1cbn1cblxuLyoqXG4gKiBSZWN1cnNpdmUgY2xvbmluZyBhcnJheS5cbiAqL1xuZnVuY3Rpb24gZGVlcENsb25lQXJyYXkoYXJyKSB7XG5cdHZhciBjbG9uZSA9IFtdO1xuXHRhcnIuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcblx0XHRpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0gIT09IG51bGwpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG5cdFx0XHRcdGNsb25lW2luZGV4XSA9IGRlZXBDbG9uZUFycmF5KGl0ZW0pO1xuXHRcdFx0fSBlbHNlIGlmIChpc1NwZWNpZmljVmFsdWUoaXRlbSkpIHtcblx0XHRcdFx0Y2xvbmVbaW5kZXhdID0gY2xvbmVTcGVjaWZpY1ZhbHVlKGl0ZW0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xvbmVbaW5kZXhdID0gZGVlcEV4dGVuZCh7fSwgaXRlbSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsb25lW2luZGV4XSA9IGl0ZW07XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGNsb25lO1xufVxuXG4vKipcbiAqIEV4dGVuaW5nIG9iamVjdCB0aGF0IGVudGVyZWQgaW4gZmlyc3QgYXJndW1lbnQuXG4gKlxuICogUmV0dXJucyBleHRlbmRlZCBvYmplY3Qgb3IgZmFsc2UgaWYgaGF2ZSBubyB0YXJnZXQgb2JqZWN0IG9yIGluY29ycmVjdCB0eXBlLlxuICpcbiAqIElmIHlvdSB3aXNoIHRvIGNsb25lIHNvdXJjZSBvYmplY3QgKHdpdGhvdXQgbW9kaWZ5IGl0KSwganVzdCB1c2UgZW1wdHkgbmV3XG4gKiBvYmplY3QgYXMgZmlyc3QgYXJndW1lbnQsIGxpa2UgdGhpczpcbiAqICAgZGVlcEV4dGVuZCh7fSwgeW91ck9ial8xLCBbeW91ck9ial9OXSk7XG4gKi9cbnZhciBkZWVwRXh0ZW5kID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoLypvYmpfMSwgW29ial8yXSwgW29ial9OXSovKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSB8fCB0eXBlb2YgYXJndW1lbnRzWzBdICE9PSAnb2JqZWN0Jykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuXHRcdHJldHVybiBhcmd1bWVudHNbMF07XG5cdH1cblxuXHR2YXIgdGFyZ2V0ID0gYXJndW1lbnRzWzBdO1xuXG5cdC8vIGNvbnZlcnQgYXJndW1lbnRzIHRvIGFycmF5IGFuZCBjdXQgb2ZmIHRhcmdldCBvYmplY3Rcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG5cdHZhciB2YWwsIHNyYywgY2xvbmU7XG5cblx0YXJncy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHQvLyBza2lwIGFyZ3VtZW50IGlmIGlzbid0IGFuIG9iamVjdCwgaXMgbnVsbCwgb3IgaXMgYW4gYXJyYXlcblx0XHRpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsIHx8IEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRzcmMgPSB0YXJnZXRba2V5XTsgLy8gc291cmNlIHZhbHVlXG5cdFx0XHR2YWwgPSBvYmpba2V5XTsgLy8gbmV3IHZhbHVlXG5cblx0XHRcdC8vIHJlY3Vyc2lvbiBwcmV2ZW50aW9uXG5cdFx0XHRpZiAodmFsID09PSB0YXJnZXQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIGlmIG5ldyB2YWx1ZSBpc24ndCBvYmplY3QgdGhlbiBqdXN0IG92ZXJ3cml0ZSBieSBuZXcgdmFsdWVcblx0XHRcdCAqIGluc3RlYWQgb2YgZXh0ZW5kaW5nLlxuXHRcdFx0ICovXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiB2YWwgIT09ICdvYmplY3QnIHx8IHZhbCA9PT0gbnVsbCkge1xuXHRcdFx0XHR0YXJnZXRba2V5XSA9IHZhbDtcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHQvLyBqdXN0IGNsb25lIGFycmF5cyAoYW5kIHJlY3Vyc2l2ZSBjbG9uZSBvYmplY3RzIGluc2lkZSlcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG5cdFx0XHRcdHRhcmdldFtrZXldID0gZGVlcENsb25lQXJyYXkodmFsKTtcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHQvLyBjdXN0b20gY2xvbmluZyBhbmQgb3ZlcndyaXRlIGZvciBzcGVjaWZpYyBvYmplY3RzXG5cdFx0XHR9IGVsc2UgaWYgKGlzU3BlY2lmaWNWYWx1ZSh2YWwpKSB7XG5cdFx0XHRcdHRhcmdldFtrZXldID0gY2xvbmVTcGVjaWZpY1ZhbHVlKHZhbCk7XG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0Ly8gb3ZlcndyaXRlIGJ5IG5ldyB2YWx1ZSBpZiBzb3VyY2UgaXNuJ3Qgb2JqZWN0IG9yIGFycmF5XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCB8fCBBcnJheS5pc0FycmF5KHNyYykpIHtcblx0XHRcdFx0dGFyZ2V0W2tleV0gPSBkZWVwRXh0ZW5kKHt9LCB2YWwpO1xuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdC8vIHNvdXJjZSB2YWx1ZSBhbmQgbmV3IHZhbHVlIGlzIG9iamVjdHMgYm90aCwgZXh0ZW5kaW5nLi4uXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0YXJnZXRba2V5XSA9IGRlZXBFeHRlbmQoc3JjLCB2YWwpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHJldHVybiB0YXJnZXQ7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9kZWVwLWV4dGVuZC9saWIvZGVlcC1leHRlbmQuanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdfQ==
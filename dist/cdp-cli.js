/*!
 * cdp-cli.js 0.1.5
 *
 * Date: 2018-02-23T11:48:57.942Z
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
/******/     return __webpack_require__(__webpack_require__.s = 8);
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
__export(__webpack_require__(17));
__export(__webpack_require__(6));
__export(__webpack_require__(7));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(7);
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(22);
const child_process_1 = __webpack_require__(23);
const cli_spinner_1 = __webpack_require__(24);
const which = __webpack_require__(25);
const deepExtend = __webpack_require__(26);
exports.deepExtend = deepExtend;
const settings_1 = __webpack_require__(6);
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cdp_lib_1 = __webpack_require__(0);
const command_parser_1 = __webpack_require__(10);
const prompt_library_1 = __webpack_require__(12);
const prompt_mobile_1 = __webpack_require__(13);
const prompt_desktop_1 = __webpack_require__(14);
const prompt_web_1 = __webpack_require__(15);
const cdp_doc_1 = __webpack_require__(16);
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
/* 10 */
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
/* 11 */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __webpack_require__(3);
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __webpack_require__(3);
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
/* 14 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(2);
// import { execCommand } from "./tools";
const opn = __webpack_require__(18);
const express = __webpack_require__(19);
const http = __webpack_require__(20); // Node.jsのserver.on('error')を使うためにインポート
const url = __webpack_require__(21);
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
/* 18 */
/***/ (function(module, exports) {

module.exports = require("opn");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("cli-spinner");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("which");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("deep-extend");

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDIzZDgzY2RkODM0NjBiYzliNDEiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn0iLCJjZHA6Ly8vY2RwLWNsaS9wcm9tcHQtYmFzZS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJpbnF1aXJlclwiLFwiY29tbW9uanMyXCI6XCJpbnF1aXJlclwifSIsImNkcDovLy9jZHAtY2xpL2RlZmF1bHQtY29uZmlnLnRzIiwiY2RwOi8vL2NkcC1jbGkvdXRpbHMvaW5kZXgudHMiLCJjZHA6Ly8vY2RwLWNsaS91dGlscy9zZXR0aW5ncy50cyIsImNkcDovLy9jZHAtY2xpL3V0aWxzL3Rvb2xzLnRzIiwiY2RwOi8vL2NkcC1jbGkvY2RwLWNsaS50cyIsImNkcDovLy9jZHAtY2xpL2NvbW1hbmQtcGFyc2VyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY29tbWFuZGVyXCIsXCJjb21tb25qczJcIjpcImNvbW1hbmRlclwifSIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1saWJyYXJ5LnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LW1vYmlsZS50cyIsImNkcDovLy9jZHAtY2xpL3Byb21wdC1kZXNrdG9wLnRzIiwiY2RwOi8vL2NkcC1jbGkvcHJvbXB0LXdlYi50cyIsImNkcDovLy9jZHAtY2xpL2NkcC1kb2MudHMiLCJjZHA6Ly8vY2RwLWNsaS91dGlscy9sb2NhbC1zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJvcG5cIixcImNvbW1vbmpzMlwiOlwib3BuXCJ9Iiwid2VicGFjazovLy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwiZXhwcmVzc1wiLFwiY29tbW9uanMyXCI6XCJleHByZXNzXCJ9Iiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJvc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNoaWxkX3Byb2Nlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImNsaS1zcGlubmVyXCIsXCJjb21tb25qczJcIjpcImNsaS1zcGlubmVyXCJ9Iiwid2VicGFjazovLy9leHRlcm5hbCB7XCJjb21tb25qc1wiOlwid2hpY2hcIixcImNvbW1vbmpzMlwiOlwid2hpY2hcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJkZWVwLWV4dGVuZFwiLFwiY29tbW9uanMyXCI6XCJkZWVwLWV4dGVuZFwifSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBLG9DOzs7Ozs7Ozs7QUNBQSxvQ0FBNkI7QUFDN0Isd0NBQXFDO0FBQ3JDLHlDQUlpQjtBQUdqQixNQUFNLEVBQUUsR0FBTSxlQUFLLENBQUMsRUFBRSxDQUFDO0FBQ3ZCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUM7QUFDMUIsTUFBTSxDQUFDLEdBQU8sZUFBSyxDQUFDLENBQUMs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QUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBN0JELDhDQTZCQzs7Ozs7OztBQzlDRCxnQzs7Ozs7O0FDQUEsb0M7Ozs7OztBQ0FBLGlDOzs7Ozs7QUNBQSxnQzs7Ozs7O0FDQUEsK0I7Ozs7OztBQ0FBLDBDOzs7Ozs7QUNBQSx3Qzs7Ozs7O0FDQUEsa0M7Ozs7OztBQ0FBLHdDIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDIzZDgzY2RkODM0NjBiYzliNDEiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjZHAtbGliXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJjZHAtbGliXCIsXCJjb21tb25qczJcIjpcImNkcC1saWJcIn1cbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSBcImlucXVpcmVyXCI7XG5pbXBvcnQge1xuICAgIElQcm9qZWN0Q29uZmlncmF0aW9uLFxuICAgIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbixcbiAgICBVdGlscyxcbn0gZnJvbSBcImNkcC1saWJcIjtcbmltcG9ydCB7IElDb21tYW5kTGluZUluZm8gfSBmcm9tIFwiLi9jb21tYW5kLXBhcnNlclwiO1xuXG5jb25zdCBmcyAgICA9IFV0aWxzLmZzO1xuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcbmNvbnN0IF8gICAgID0gVXRpbHMuXztcblxuLyoqXG4gKiBAaW50ZXJmYWNlIElBbnN3ZXJTY2hlbWFcbiAqIEBicmllZiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OI44Gu44K544Kt44O844Oe5a6a576p44Kk44Oz44K/44O844OV44Kn44Kk44K5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUFuc3dlclNjaGVtYVxuICAgIGV4dGVuZHMgaW5xdWlyZXIuQW5zd2VycywgSVByb2plY3RDb25maWdyYXRpb24sIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvbiB7XG4gICAgLy8g5YWx6YCa5ouh5by15a6a576pXG4gICAgZXh0cmFTZXR0aW5nczogXCJyZWNvbW1lbmRlZFwiIHwgXCJjdXN0b21cIjtcbn1cblxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cblxuLyoqXG4gKiBAY2xhc3MgUHJvbXB0QmFzZVxuICogQGJyaWVmIFByb21wdCDjga7jg5njg7zjgrnjgq/jg6njgrlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByb21wdEJhc2Uge1xuXG4gICAgcHJpdmF0ZSBfY21kSW5mbzogSUNvbW1hbmRMaW5lSW5mbztcbiAgICBwcml2YXRlIF9hbnN3ZXJzID0gPElBbnN3ZXJTY2hlbWE+e307XG4gICAgcHJpdmF0ZSBfbG9jYWxlID0ge307XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIHB1YmxpYyBtZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiDjgqjjg7Pjg4jjg6pcbiAgICAgKi9cbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IElDb21tYW5kTGluZUluZm8pOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XG4gICAgICAgIHRoaXMuX2NtZEluZm8gPSBjbWRJbmZvO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zaG93UHJvbG9ndWUoKTtcbiAgICAgICAgICAgIHRoaXMuaW5xdWlyZUxhbmd1YWdlKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlucXVpcmUoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChzZXR0aW5nczogSVByb2plY3RDb25maWdyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaWtlIGNvd3NheVxuICAgICAqIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Nvd3NheVxuICAgICAqL1xuICAgIHB1YmxpYyBzYXkobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IEdSRUVUSU5HID1cbiAgICAgICAgICAgIFwiXFxuICAgIOKJoSAgIFwiICsgY2hhbGsueWVsbG93KFwifO+/oyB8XCIpICtcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICAgXCIgKyBjaGFsay55ZWxsb3coXCJffF9fXyB8X1wiKSArIFwiICAg77yP77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+j77+jXCIgK1xuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iCAtXjBeIO+8iVwiKSArIFwi77ycICBcIiArIGNoYWxrLnllbGxvdyhtZXNzYWdlKSArXG4gICAgICAgICAgICBcIlxcbiAg4omhICAgXCIgKyBjaGFsay5jeWFuKFwi77yIICDjgaRcIikgKyBcIu+8nVwiICsgY2hhbGsuY3lhbihcIuOBpFwiKSArIFwiICDvvLzvvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL/vvL9cIiArXG4gICAgICAgICAgICBcIlxcbiAgICDiiaEgIFwiICsgY2hhbGsuY3lhbihcIu+9nCDvvZwgfFwiKSArIFwi77y8XCIgK1xuICAgICAgICAgICAgXCJcXG4gICAg4omhIFwiICsgY2hhbGsuY3lhbihcIu+8iF/vvL/vvInvvL/vvIlcIikgKyBcIu+8vFwiICtcbiAgICAgICAgICAgIFwiXFxuICDiiaEgICBcIiArIGNoYWxrLnJlZChcIuKXjlwiKSArIFwi77+j77+j77+j77+jXCIgKyBjaGFsay5yZWQoXCLil45cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKEdSRUVUSU5HKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg63jg7zjgqvjg6njgqTjgrrjg6rjgr3jg7zjgrnjgavjgqLjgq/jgrvjgrlcbiAgICAgKiBleCkgdGhpcy5sYW5nLnByb21wdC5wcm9qZWN0TmFtZS5tZXNzYWdlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOODquOCveODvOOCueOCquODluOCuOOCp+OCr+ODiFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbGFuZygpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gYWJzdHJ1Y3QgbWV0aG9kc1xuXG4gICAgLyoqXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXG4gICAgICovXG4gICAgYWJzdHJhY3QgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnM7XG5cbiAgICAvKipcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxuICAgICAqL1xuICAgIGFic3RyYWN0IGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb247XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIHByb3RlY3RlZCBtZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiDoqK3lrprlgKTjgavjgqLjgq/jgrvjgrlcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQW5zd2VyIOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXQgYW5zd2VycygpOiBJQW5zd2VyU2NoZW1hIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Fuc3dlcnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvbG9ndWUg44Kz44Oh44Oz44OI44Gu6Kit5a6aXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldCBwcm9sb2d1ZUNvbW1lbnQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiV2VsY29tZSB0byBDRFAgQm9pbGVycGxhdGUgR2VuZXJhdG9yIVwiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdlbGNvbWUg6KGo56S6XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNob3dQcm9sb2d1ZSgpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIGNoYWxrLmdyYXkoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpKTtcbiAgICAgICAgdGhpcy5zYXkodGhpcy5wcm9sb2d1ZUNvbW1lbnQpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIIOOBruabtOaWsFxuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbnN3ZXIg44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUFuc3dlcnModXBkYXRlOiBJQW5zd2VyU2NoZW1hKTogSUFuc3dlclNjaGVtYSB7XG4gICAgICAgIHJldHVybiBfLm1lcmdlKHRoaXMuX2Fuc3dlcnMsIHVwZGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6aXG4gICAgICog5YiG5bKQ44GM5b+F6KaB44Gq5aC05ZCI44Gv44Kq44O844OQ44O844Op44Kk44OJ44GZ44KL44GT44GoXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGlucXVpcmVTZXR0aW5ncygpOiBQcm9taXNlPElBbnN3ZXJTY2hlbWE+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlucXVpcmVyLnByb21wdCh0aGlzLnF1ZXN0aW9ucylcbiAgICAgICAgICAgICAgICAudGhlbigoYW5zd2VycykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKDxJQW5zd2VyU2NoZW1hPmFuc3dlcnMpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb246IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0dGluZyDjgYvjgokg6Kit5a6a6Kqs5piO44Gu5L2c5oiQXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZyDoqK3lrppcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGl0ZW1OYW1lIOioreWumumgheebruWQjVxuICAgICAqIEByZXR1cm4ge1N0cmluZ30g6Kqs5piO5paHXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNvbmZpZzJkZXNjcmlwdGlvbihjb25maWc6IE9iamVjdCwgaXRlbU5hbWU6IHN0cmluZywgY29sb3I6IHN0cmluZyA9IFwiY3lhblwiKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMubGFuZy5zZXR0aW5nc1tpdGVtTmFtZV07XG4gICAgICAgIGlmIChudWxsID09IGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwiZXJyb3IuIGl0ZW0gbm90IGZvdW5kLiBpdGVtIG5hbWU6IFwiICsgaXRlbU5hbWUpKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3A6IHN0cmluZyA9ICgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5wcm9wcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnByb3BzW2NvbmZpZ1tpdGVtTmFtZV1dO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcImJvb2xlYW5cIiA9PT0gdHlwZW9mIGNvbmZpZ1tpdGVtTmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5ib29sW2NvbmZpZ1tpdGVtTmFtZV0gPyBcInllc1wiIDogXCJub1wiXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1tpdGVtTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgKyBjaGFsa1tjb2xvcl0ocHJvcCk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIC8qKlxuICAgICAqIOODreODvOOCq+ODqeOCpOOCuuODquOCveODvOOCueOBruODreODvOODiVxuICAgICAqL1xuICAgIHByaXZhdGUgbG9hZExhbmd1YWdlKGxvY2FsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9sb2NhbGUgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhcbiAgICAgICAgICAgICAgICBwYXRoLmpvaW4odGhpcy5fY21kSW5mby5wa2dEaXIsIFwicmVzL2xvY2FsZXMvbWVzc2FnZXMuXCIgKyBsb2NhbGUgKyBcIi5qc29uXCIpLCBcInV0ZjhcIikudG9TdHJpbmcoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiTGFuZ3VhZ2UgcmVzb3VyY2UgSlNPTiBwYXJzZSBlcnJvcjogXCIgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOiogOiqnumBuOaKnlxuICAgICAqL1xuICAgIHByaXZhdGUgaW5xdWlyZUxhbmd1YWdlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb24gPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJsYW5ndWFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlBsZWFzZSBjaG9vc2UgeW91ciBwcmVmZXJyZWQgbGFuZ3VhZ2UuXCIsXG4gICAgICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIkVuZ2xpc2gv6Iux6KqeXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZW4tVVNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJKYXBhbmVzZS/ml6XmnKzoqp5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJqYS1KUFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb24pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRMYW5ndWFnZShhbnN3ZXIubGFuZ3VhZ2UpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDoqK3lrprnorroqo1cbiAgICAgKi9cbiAgICBwcml2YXRlIGNvbmZpcm1TZXR0aW5ncygpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5kaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnModGhpcy5fYW5zd2Vycyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgY2hhbGsuZ3JheShcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIikgKyBcIlxcblwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2hlY2s6IFwiICsgdGhpcy5sYW5nLnByb21wdC5jb21tb24uY29uZmlybS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJjb25maXJtXCIsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiY29uZmlybWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmNvbmZpcm0ubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgaW5xdWlyZXIucHJvbXB0KHF1ZXN0aW9uKVxuICAgICAgICAgICAgICAgIC50aGVuKChhbnN3ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuc3dlci5jb25maXJtYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbW1hbmQgbGluZSDmg4XloLHjgpIgQ29uZmljdXJhdGlvbiDjgavlj43mmKBcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge0lQcm9qZWN0Q29uZmlndXJhdGlvbn0gY29uZmlnIOioreWumlxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlndXJhdGlvbn0gY29tbWFuZCBsaW5lIOOCkuWPjeaYoOOBleOBm+OBnyBjb25maWcg6Kit5a6aXG4gICAgICovXG4gICAgcHJpdmF0ZSByZWZsZWN0Q29tbWFuZEluZm8oY29uZmlnOiBJUHJvamVjdENvbmZpZ3JhdGlvbik6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcbiAgICAgICAgY29uZmlnLmFjdGlvbiA9IHRoaXMuX2NtZEluZm8uYWN0aW9uO1xuXG4gICAgICAgICg8SUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uPmNvbmZpZykubWluaWZ5ID0gdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLm1pbmlmeTtcblxuICAgICAgICBjb25maWcuc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBmb3JjZTogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLmZvcmNlLFxuICAgICAgICAgICAgdmVyYm9zZTogdGhpcy5fY21kSW5mby5jbGlPcHRpb25zLnZlcmJvc2UsXG4gICAgICAgICAgICBzaWxlbnQ6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy5zaWxlbnQsXG4gICAgICAgICAgICB0YXJnZXREaXI6IHRoaXMuX2NtZEluZm8uY2xpT3B0aW9ucy50YXJnZXREaXIsXG4gICAgICAgICAgICBsYW5nOiB0aGlzLmxhbmcudHlwZSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOioreWumuOCpOODs+OCv+ODqeOCr+OCt+ODp+ODs1xuICAgICAqL1xuICAgIHByaXZhdGUgaW5xdWlyZSgpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9jID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5xdWlyZVNldHRpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQW5zd2VycyhhbnN3ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybVNldHRpbmdzKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZWZsZWN0Q29tbWFuZEluZm8oY29uZmlnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHByb2MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc2V0VGltZW91dChwcm9jKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtYmFzZS50cyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJwYXRoXCJcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaW5xdWlyZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImlucXVpcmVyXCIsXCJjb21tb25qczJcIjpcImlucXVpcmVyXCJ9XG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7XG4gICAgSUxpYnJhcnlDb25maWdyYXRpb24sXG4gICAgSU1vYmlsZUFwcENvbmZpZ3JhdGlvbixcbiAgICBJRGVza3RvcEFwcENvbmZpZ3JhdGlvbixcbiAgICBJV2ViQXBwQ29uZmlncmF0aW9uLFxufSBmcm9tIFwiY2RwLWxpYlwiO1xuXG4vKipcbiAqIOODluODqeOCpuOCtueSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxuICovXG5jb25zdCBsaWJyYXJ5T25Ccm93c2VyID0gPElMaWJyYXJ5Q29uZmlncmF0aW9uPntcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxuICAgIHByb2plY3RUeXBlOiBcImxpYnJhcnlcIixcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cbiAgICBlczogXCJlczVcIixcbiAgICBtb2R1bGU6IFwidW1kXCIsXG4gICAgZW52OiBcIndlYlwiLFxuICAgIHRvb2xzOiBbXCJ3ZWJwYWNrXCIsIFwibnljXCJdLFxufTtcblxuLyoqXG4gKiBOb2RlLmpzIOeSsOWig+OBp+WLleS9nOOBmeOCi+ODqeOCpOODluODqeODquOBruaXouWumuWApFxuICovXG5jb25zdCBsaWJyYXJ5T25Ob2RlID0gPElMaWJyYXJ5Q29uZmlncmF0aW9uPntcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxuICAgIHByb2plY3RUeXBlOiBcImxpYnJhcnlcIixcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cbiAgICBlczogXCJlczIwMTVcIixcbiAgICBtb2R1bGU6IFwiY29tbW9uanNcIixcbiAgICBlbnY6IFwibm9kZVwiLFxuICAgIHRvb2xzOiBbXCJ3ZWJwYWNrXCIsIFwibnljXCJdLFxufTtcblxuLyoqXG4gKiBlbGVjdHJvbiDnkrDlooPjgafli5XkvZzjgZnjgovjg6njgqTjg5bjg6njg6rjga7ml6LlrprlgKRcbiAqL1xuY29uc3QgbGlicmFyeU9uRWxlY3Ryb24gPSA8SUxpYnJhcnlDb25maWdyYXRpb24+e1xuICAgIC8vIElQcm9qZWN0Q29uZmlncmF0aW9uXG4gICAgcHJvamVjdFR5cGU6IFwibGlicmFyeVwiLFxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxuICAgIGVzOiBcImVzMjAxNVwiLFxuICAgIG1vZHVsZTogXCJjb21tb25qc1wiLFxuICAgIGVudjogXCJlbGVjdHJvblwiLFxuICAgIHRvb2xzOiBbXCJ3ZWJwYWNrXCIsIFwibnljXCJdLFxufTtcblxuLyoqXG4gKiDjg5bjg6njgqbjgrYoY29yZG92YSnnkrDlooPjgafli5XkvZzjgZnjgovjg6Ljg5DjgqTjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcbiAqL1xuY29uc3QgbW9iaWxlT25Ccm93c2VyOiBJTW9iaWxlQXBwQ29uZmlncmF0aW9uID0gPGFueT57XG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cbiAgICBwcm9qZWN0VHlwZTogXCJtb2JpbGVcIixcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cbiAgICBlczogXCJlczVcIixcbiAgICBtb2R1bGU6IFwiYW1kXCIsXG4gICAgZW52OiBcIndlYlwiLFxuICAgIHRvb2xzOiBbXCJueWNcIl0sXG4gICAgLy8gSU1vYmlsZUFwcENvbmZpZ3JhdGlvblxuICAgIHBsYXRmb3JtczogW1wiYW5kcm9pZFwiLCBcImlvc1wiXSxcbiAgICBwcm9qZWN0U3RydWN0dXJlOiBbXSxcbiAgICBleHRlcm5hbDoge1xuICAgICAgICBcImhvZ2FuLmpzXCI6IHtcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbVwiLFxuICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcbiAgICAgICAgICAgIGFsaWFzOiBcImhvZ2FuXCIsXG4gICAgICAgIH0sXG4gICAgICAgIFwiaGFtbWVyanNcIjoge1xuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtXCIsXG4gICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxuICAgICAgICAgICAgZ2xvYmFsRXhwb3J0OiBcIkhhbW1lclwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiaGFtbWVyXCIsXG4gICAgICAgICAgICBzdWJzZXQ6IHtcbiAgICAgICAgICAgICAgICBcImpxdWVyeS1oYW1tZXJqc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbVwiLFxuICAgICAgICAgICAgICAgICAgICB2ZW5kZXJOYW1lOiBcImhhbW1lcmpzXCIsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBcImpxdWVyeS5oYW1tZXJcIixcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiQHR5cGVzL2hhbW1lcmpzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgYWNxdWlzaXRpb246IFwibnBtOmRldlwiLFxuICAgICAgICAgICAgICAgICAgICByZWd1bGFyOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBcImNvcmRvdmEtcGx1Z2luLWNkcC1uYXRpdmVicmlkZ2VcIjoge1xuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwiY29yZG92YVwiLFxuICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJjb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIjoge1xuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwiY29yZG92YVwiLFxuICAgICAgICAgICAgcmVndWxhcjogZmFsc2UsXG4gICAgICAgICAgICBzdWJzZXQ6IHtcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9jb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG06ZGV2XCIsXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFwiY29yZG92YS1wbHVnaW4tYXBwLXZlcnNpb25cIjoge1xuICAgICAgICAgICAgYWNxdWlzaXRpb246IFwiY29yZG92YVwiLFxuICAgICAgICAgICAgcmVndWxhcjogZmFsc2UsXG4gICAgICAgICAgICBzdWJzZXQ6IHtcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9jb3Jkb3ZhLXBsdWdpbi1hcHAtdmVyc2lvblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbTpkZXZcIixcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJpc2Nyb2xsXCI6IHtcbiAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbVwiLFxuICAgICAgICAgICAgcmVndWxhcjogZmFsc2UsXG4gICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IFwiSVNjcm9sbFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiaXNjcm9sbC1wcm9iZVwiLFxuICAgICAgICAgICAgc3Vic2V0OiB7XG4gICAgICAgICAgICAgICAgXCJAdHlwZXMvaXNjcm9sbFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbTpkZXZcIixcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJmbGlwc25hcFwiOiB7XG4gICAgICAgICAgICBhY3F1aXNpdGlvbjogXCJucG1cIixcbiAgICAgICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxuICAgICAgICAgICAgZ2xvYmFsRXhwb3J0OiBcIkZsaXBzbmFwXCIsXG4gICAgICAgICAgICBzdWJzZXQ6IHtcbiAgICAgICAgICAgICAgICBcIkB0eXBlcy9mbGlwc25hcFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjcXVpc2l0aW9uOiBcIm5wbTpkZXZcIixcbiAgICAgICAgICAgICAgICAgICAgcmVndWxhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufTtcblxuLyoqXG4gKiDjg5bjg6njgqbjgrbnkrDlooPjgafli5XkvZzjgZnjgovjg4fjgrnjgq/jg4jjg4Pjg5fjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjga7ml6LlrprlgKRcbiAqL1xuY29uc3QgZGVza3RvcE9uQnJvd3NlciA9IDxJRGVza3RvcEFwcENvbmZpZ3JhdGlvbj57XG4gICAgLy8gSVByb2plY3RDb25maWdyYXRpb25cbiAgICBwcm9qZWN0VHlwZTogXCJkZXNrdG9wXCIsXG4gICAgLy8gSUJ1aWxkVGFyZ2V0Q29uZmlncmF0aW9uXG4gICAgZXM6IFwiZXM1XCIsXG4gICAgbW9kdWxlOiBcImFtZFwiLFxuICAgIGVudjogXCJ3ZWJcIixcbiAgICB0b29sczogW1wibnljXCJdLFxufTtcblxuLyoqXG4gKiAgZWxlY3Ryb24g55Kw5aKD44Gn5YuV5L2c44GZ44KL44OH44K544Kv44OI44OD44OX44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXG4gKi9cbmNvbnN0IGRlc2t0b3BPbkVsZWN0cm9uID0gPElEZXNrdG9wQXBwQ29uZmlncmF0aW9uPntcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxuICAgIHByb2plY3RUeXBlOiBcImRlc2t0b3BcIixcbiAgICAvLyBJQnVpbGRUYXJnZXRDb25maWdyYXRpb25cbiAgICBlczogXCJlczIwMTVcIixcbiAgICBtb2R1bGU6IFwiY29tbW9uanNcIixcbiAgICBlbnY6IFwiZWxlY3Ryb24tcmVuZGVyZXJcIixcbiAgICB0b29sczogW1wid2VicGFja1wiLCBcIm55Y1wiXSxcbn07XG5cbi8qKlxuICog44OW44Op44Km44K255Kw5aKD44Gn5YuV5L2c44GZ44KL44Km44Kn44OW44Ki44OX44Oq44Kx44O844K344On44Oz44Gu5pei5a6a5YCkXG4gKi9cbmNvbnN0IHdlYk9uQnJvd3NlciA9IDxJV2ViQXBwQ29uZmlncmF0aW9uPntcbiAgICAvLyBJUHJvamVjdENvbmZpZ3JhdGlvblxuICAgIHByb2plY3RUeXBlOiBcIndlYlwiLFxuICAgIC8vIElCdWlsZFRhcmdldENvbmZpZ3JhdGlvblxuICAgIGVzOiBcImVzNVwiLFxuICAgIG1vZHVsZTogXCJhbWRcIixcbiAgICBlbnY6IFwid2ViXCIsXG59O1xuXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgbGlicmFyeToge1xuICAgICAgICBicm93c2VyOiBsaWJyYXJ5T25Ccm93c2VyLFxuICAgICAgICBub2RlOiBsaWJyYXJ5T25Ob2RlLFxuICAgICAgICBlbGVjdHJvbjogbGlicmFyeU9uRWxlY3Ryb24sXG4gICAgICAgIEVMRUNUUk9OX0FWQUlMQUJMRTogZmFsc2UsXG4gICAgfSxcbiAgICBtb2JpbGU6IHtcbiAgICAgICAgYnJvd3NlcjogbW9iaWxlT25Ccm93c2VyLFxuICAgIH0sXG4gICAgZGVzY3RvcDoge1xuICAgICAgICBicm93c2VyOiBkZXNrdG9wT25Ccm93c2VyLFxuICAgICAgICBlbGVjdHJvbjogZGVza3RvcE9uRWxlY3Ryb24sXG4gICAgfSxcbiAgICB3ZWI6IHtcbiAgICAgICAgYnJvd3Nlcjogd2ViT25Ccm93c2VyLFxuICAgIH0sXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9kZWZhdWx0LWNvbmZpZy50cyIsImV4cG9ydCAqIGZyb20gXCIuL2xvY2FsLXNlcnZlclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vc2V0dGluZ3NcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3Rvb2xzXCI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy91dGlscy9pbmRleC50cyIsImltcG9ydCBcIi4vdG9vbHNcIjtcbmltcG9ydCB7IGRlZXBFeHRlbmQgfSBmcm9tIFwiLi9pbmRleFwiO1xuXG4vKipcbiAqIEBpbnRlcmZhY2UgSUdsb2JhbFNldHRpbmdzXG4gKiBAYnJpZWYg44Kw44Ot44O844OQ44Or6Kit5a6a44Kk44Oz44K/44O844OV44Kn44Kk44K5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUdsb2JhbFNldHRpbmdzIHtcbiAgICBmb3JjZT86IGJvb2xlYW47ICAgICAgICAgICAgLy8g44Ko44Op44O857aZ57aa55SoXG4gICAgdmVyYm9zZT86IGJvb2xlYW47ICAgICAgICAgIC8vIOips+e0sOODreOCsFxuICAgIHNpbGVudD86IGJvb2xlYW47ICAgICAgICAgICAvLyBzaWxlbnQgbW9kZVxuICAgIHRhcmdldERpcj86IHN0cmluZzsgICAgICAgICAvLyDkvZzmpa3jg4fjgqPjg6zjgq/jg4jjg6pcbiAgICBsYW5nPzogXCJlbi1VU1wiIHwgXCJqYS1KUFwiO1xufVxuXG5sZXQgX3NldHRpbmdzOiBJR2xvYmFsU2V0dGluZ3MgPSB7XG4gICAgZm9yY2U6IGZhbHNlLFxuICAgIHZlcmJvc2U6IGZhbHNlLFxuICAgIHNpbGVudDogZmFsc2UsXG4gICAgbGFuZzogXCJlbi1VU1wiLFxufTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGV4cG9ydHMgbWV0aG9kczpcblxuLyoqXG4gKiDoqK3lrprlj5blvpdcbiAqXG4gKiBAcmV0dXJucyBvcHRpb25zIOODreOCsOOBq+S9v+eUqOOBmeOCi+OCquODl+OCt+ODp+ODs1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGluZ3MoKTogSUdsb2JhbFNldHRpbmdzIHtcbiAgICByZXR1cm4gZGVlcEV4dGVuZCh7fSwgX3NldHRpbmdzKTtcbn1cblxuLyoqXG4gKiDoqK3lrprmjIflrppcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyDjg63jgrDjgavkvb/nlKjjgZnjgovjgqrjg5fjgrfjg6fjg7NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFNldHRpbmdzKHNldHRpbmdzOiBJR2xvYmFsU2V0dGluZ3MpOiB2b2lkIHtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgX3NldHRpbmdzLmZvcmNlICAgICA9IHNldHRpbmdzLmZvcmNlICAgICAgICB8fCBfc2V0dGluZ3MuZm9yY2U7XG4gICAgICAgIF9zZXR0aW5ncy52ZXJib3NlICAgPSBzZXR0aW5ncy52ZXJib3NlICAgICAgfHwgX3NldHRpbmdzLnZlcmJvc2U7XG4gICAgICAgIF9zZXR0aW5ncy5zaWxlbnQgICAgPSBzZXR0aW5ncy5zaWxlbnQgICAgICAgfHwgX3NldHRpbmdzLnNpbGVudDtcbiAgICAgICAgX3NldHRpbmdzLnRhcmdldERpciA9IHNldHRpbmdzLnRhcmdldERpciAgICB8fCBfc2V0dGluZ3MudGFyZ2V0RGlyO1xuICAgICAgICBfc2V0dGluZ3MubGFuZyAgICAgID0gc2V0dGluZ3MubGFuZyAgICAgICAgIHx8IF9zZXR0aW5ncy5sYW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIF9zZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIGZvcmNlOiBmYWxzZSxcbiAgICAgICAgICAgIHZlcmJvc2U6IGZhbHNlLFxuICAgICAgICAgICAgc2lsZW50OiBmYWxzZSxcbiAgICAgICAgICAgIGxhbmc6IFwiZW4tVVNcIixcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbi8qKlxuICog44Ot44Kw5Ye65YqbXG4gKiBjb25zb2xlLmxvZygpIOOBqOWQjOetiVxuICpcbiAqIEBwYXJhbSBtZXNzYWdlICAgICAgICDlh7rlipvjg6Hjg4Pjgrvjg7zjgrhcbiAqIEBwYXJhbSBvcHRpb25hbFBhcmFtcyDku5jliqDmg4XloLFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZyhtZXNzYWdlPzogc3RyaW5nLCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkIHtcbiAgICBpZiAoIV9zZXR0aW5ncy5zaWxlbnQpIHtcbiAgICAgICAgaWYgKDAgPCBvcHRpb25hbFBhcmFtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIG9wdGlvbmFsUGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIOips+e0sOODreOCsOWHuuWKm1xuICogY29uc29sZS5kZWJ1ZygpIOOBqOWQjOetiVxuICpcbiAqIEBwYXJhbSBtZXNzYWdlICAgICAgICDlh7rlipvjg6Hjg4Pjgrvjg7zjgrhcbiAqIEBwYXJhbSBvcHRpb25hbFBhcmFtcyDku5jliqDmg4XloLFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnKG1lc3NhZ2U/OiBzdHJpbmcsIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSk6IHZvaWQge1xuICAgIGlmICghX3NldHRpbmdzLnNpbGVudCAmJiBfc2V0dGluZ3MudmVyYm9zZSkge1xuICAgICAgICBpZiAoMCA8IG9wdGlvbmFsUGFyYW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkRFQlVHOiBcIiArIG1lc3NhZ2UsIG9wdGlvbmFsUGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJERUJVRzogXCIgKyBtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiDmpJzoqLxcbiAqIGNvbnNvbGUuYXNzZXJ0KCkg44Go5ZCM562JXG4gKlxuICogQHBhcmFtIHRlc3QgICAgICAgICAgIOaknOiovOOBmeOCi+W8j1xuICogQHBhcmFtIG1lc3NhZ2UgICAgICAgIOWHuuWKm+ODoeODg+OCu+ODvOOCuFxuICogQHBhcmFtIG9wdGlvbmFsUGFyYW1zIOS7mOWKoOaDheWgsVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0KHRlc3Q/OiBib29sZWFuLCBtZXNzYWdlPzogc3RyaW5nLCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pOiB2b2lkIHtcbiAgICBpZiAoIXRlc3QpIHtcbiAgICAgICAgaWYgKF9zZXR0aW5ncy5mb3JjZSkge1xuICAgICAgICAgICAgaWYgKDAgPCBvcHRpb25hbFBhcmFtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSwgb3B0aW9uYWxQYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4obWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoMCA8IG9wdGlvbmFsUGFyYW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgb3B0aW9uYWxQYXJhbXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3V0aWxzL3NldHRpbmdzLnRzIiwiaW1wb3J0ICogYXMgb3MgZnJvbSBcIm9zXCI7XG5pbXBvcnQgeyBzcGF3biwgU3Bhd25PcHRpb25zIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IFNwaW5uZXIgfSBmcm9tIFwiY2xpLXNwaW5uZXJcIjtcbmltcG9ydCAqIGFzIHdoaWNoIGZyb20gXCJ3aGljaFwiO1xuaW1wb3J0ICogYXMgZGVlcEV4dGVuZCBmcm9tIFwiZGVlcC1leHRlbmRcIjtcblxuaW1wb3J0IHtcbiAgICBhc3NlcnQsXG59IGZyb20gXCIuL3NldHRpbmdzXCI7XG5cbmV4cG9ydCB7XG4gICAgZGVlcEV4dGVuZCxcbn07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBleHBvcnRzIG1ldGhvZHM6XG5cbi8qKlxuICogSGFuZGxlIGNvbW1hbmQgbGluZSBlcnJvciBhbmQga2lsbCBwcm9jZXNzLlxuICogV2hlbiB0aGUgYXBwbGljYXRpb24gcmVjZWl2ZWQgZXJyb3IgZnJvbSBjbGksIHBsZWFzZSBjYWxsIHRoaXMgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBlcnJvciAgZXJyb3IgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnJvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgYXNzZXJ0KGZhbHNlLCBlcnJvcik7XG59XG5cbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXG5cbi8qKlxuICogR2V0IHNwaW5uZXIgaW5zdGFuY2UuXG4gKiBDTEkgaGVscGVyLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gIFtmb3JtYXRdICBzcGlubmVyIGZvcm1hdCBzdHJpbmcuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICBbaW5kZXhdICAgc3Bpbm5lciBpbmRleCBkZWZpbmVkIGJ5IGNsaS1zcGlubmVyLiAoZGVmYXVsdDogcmFuZG9tIFswLTI5XSlcbiAqIEByZXR1cm4ge1NwaW5uZXJ9IGNsaS1zcGlubmVyIGluc3RhbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3Bpbm5lcihmb3JtYXQ/OiBzdHJpbmcsIGluZGV4PzogbnVtYmVyKTogeyBzdGFydDogKCkgPT4gdm9pZDsgc3RvcDogKGNsZWFuPzogYm9vbGVhbikgPT4gdm9pZDsgfSB7XG4gICAgY29uc3Qgc3Bpbm5lcnMgPSBbXG4gICAgICAgIFwifC8tXFxcXFwiLFxuICAgICAgICBcIuKUpOKUmOKUtOKUlOKUnOKUjOKUrOKUkFwiLFxuICAgICAgICBcIuKXouKXo+KXpOKXpVwiLFxuICAgICAgICBcIuKWjOKWgOKWkOKWhFwiLFxuICAgICAgICBcIuKWieKWiuKWi+KWjOKWjeKWjuKWj+KWjuKWjeKWjOKWi+KWiuKWiVwiLFxuICAgICAgICBcIuKWgeKWg+KWhOKWheKWhuKWh+KWiOKWh+KWhuKWheKWhOKWg1wiLFxuICAgICAgICBcIuKYseKYsuKYtFwiLFxuICAgICAgICBcIi5vT0AqXCIsXG4gICAgICAgIFwi4peQ4peT4peR4peSXCIsXG4gICAgICAgIC8vLy9cbiAgICAgICAgXCLil6Hil6Eg4oqZ4oqZIOKXoOKXoFwiLFxuICAgICAgICBcIuKWoOKWoeKWquKWq1wiLFxuICAgICAgICBcIuKGkOKGluKGkeKGl+KGkuKGmOKGk+KGmVwiLFxuICAgICAgICBcIi5vT8KwT28uXCIsXG4gICAgXTtcbiAgICBjb25zdCBmbXQgPSBmb3JtYXQgfHwgXCIlc1wiO1xuICAgIGNvbnN0IHNwaW5uZXIgPSBuZXcgU3Bpbm5lcihmbXQpO1xuICAgIGNvbnN0IGlkeCA9IChudWxsICE9IGluZGV4ICYmIDAgPD0gaW5kZXggJiYgaW5kZXggPCAxNCkgPyBpbmRleCA6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICBzcGlubmVyLnNldFNwaW5uZXJTdHJpbmcoc3Bpbm5lcnNbaWR4XSk7XG4gICAgcmV0dXJuIHNwaW5uZXI7XG59XG5cbi8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXG5cbi8qKlxuICogQGludGVyZmFjZSBFeGVjQ29tbWFuZE9wdGlvbnNcbiAqIEBicmllZiBleGVjQ29tbWFuZCgpIOOBq+aMh+WumuOBmeOCi+OCquODl+OCt+ODp+ODs1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4ZWNDb21tYW5kT3B0aW9ucyBleHRlbmRzIFNwYXduT3B0aW9ucyB7XG4gICAgc3Bpbm5lcj86IHtcbiAgICAgICAgZm9ybWF0Pzogc3RyaW5nOyAgICAvLyBleCkgXCIlc1wiXG4gICAgICAgIGluZGV4PzogbnVtYmVyOyAgICAgLy8gMCAtIDkg44Gu5pWw5YCk44KS5oyH5a6aXG4gICAgfTtcbiAgICBzdGRvdXQ/OiAoZGF0YTogc3RyaW5nKSA9PiB2b2lkO1xuICAgIHN0ZGVycj86IChkYXRhOiBzdHJpbmcpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogRXhlY3V0ZSBjb21tYW5kIGxpbmUgYnkgc3Bhd24uXG4gKiBjYWxsIHNwYXduLiBpZiBlcnJvciBvY2N1cmVkLCBjdWkgaXMga2lsbGVkIHByb2NjZXNzLlxuICpcbiAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgY29tbWFuZCAgICBtYWluIGNvbW1hbmQuIGV4KSBcImNvcmRvdmFcIlxuICogQHBhcmFtICAge1N0cmluZ1tdfSAgICAgICAgICAgICBhcmdzICAgICAgIGNvbW1hbmQgYXJncy4gZXgpIFtcInBsdWdpblwiLCBcImFkZFwiLCBwbHVnaW5OYW1lXVxuICogQHBhcmFtICAge0V4ZWNDb21tYW5kT3B0aW9uc30gICBbb3B0aW9uc10gIGNsaS1zcGlubmVyXCJzIG9wdGlvbnMuXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBlcnJvciBjb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGVjQ29tbWFuZChjb21tYW5kOiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdLCBvcHRpb25zPzogRXhlY0NvbW1hbmRPcHRpb25zKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBvcHQ6IEV4ZWNDb21tYW5kT3B0aW9ucyA9IGRlZXBFeHRlbmQoe30sIHtcbiAgICAgICAgICAgIHN0ZGlvOiBcImluaGVyaXRcIixcbiAgICAgICAgICAgIHNwaW5uZXI6IHsgZm9ybWF0OiBcIiVzXCIgfSxcbiAgICAgICAgICAgIHN0ZG91dDogKGRhdGE6IHN0cmluZyk6IHZvaWQgPT4geyAvKiBub29wICovIH0sXG4gICAgICAgICAgICBzdGRlcnI6IChkYXRhOiBzdHJpbmcpOiB2b2lkID0+IHsgLyogbm9vcCAqLyB9LFxuICAgICAgICB9LCBvcHRpb25zKTtcblxuICAgICAgICAvLyBvbiB3aW4zMiwgY29tbWFuZCBhbmQgYXJncyBuZWVkIHRvIGJlIHF1b3RlZCBpZiBjb250YWluaW5nIHNwYWNlc1xuICAgICAgICBjb25zdCBxdW90ZUlmTmVlZGVkID0gKHN0cjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlmIChcIndpbjMyXCIgPT09IG9zLnBsYXRmb3JtKCkgJiYgc3RyLmluY2x1ZGVzKFwiIFwiKSkge1xuICAgICAgICAgICAgICAgIHN0ciA9IFwiXFxcIlwiICsgc3RyICsgXCJcXFwiXCI7XG4gICAgICAgICAgICAgICAgb3B0LnNoZWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH07XG5cbiAgICAgICAgd2hpY2goY29tbWFuZCwgKGVycm9yLCByZXNvbHZlZENvbW1hbmQpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNwaW5uZXIgPSBvcHQuc3Bpbm5lciA/IGdldFNwaW5uZXIob3B0LnNwaW5uZXIuZm9ybWF0LCBvcHQuc3Bpbm5lci5pbmRleCkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKHNwaW5uZXIpIHtcbiAgICAgICAgICAgICAgICBzcGlubmVyLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc29sdmVkQ29tbWFuZCA9IHF1b3RlSWZOZWVkZWQocmVzb2x2ZWRDb21tYW5kKTtcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzLm1hcChxdW90ZUlmTmVlZGVkKTtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gc3Bhd24ocmVzb2x2ZWRDb21tYW5kLCBhcmdzLCBvcHQpXG4gICAgICAgICAgICAgICAgLm9uKFwiZXJyb3JcIiwgaGFuZGxlRXJyb3IpXG4gICAgICAgICAgICAgICAgLm9uKFwiY2xvc2VcIiwgKGNvZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNwaW5uZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwaW5uZXIuc3RvcCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoXCJwaXBlXCIgPT09IG9wdC5zdGRpbykge1xuICAgICAgICAgICAgICAgIGNoaWxkLnN0ZG91dC5vbihcImRhdGFcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb3B0LnN0ZG91dChkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNoaWxkLnN0ZGVyci5vbihcImRhdGFcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb3B0LnN0ZGVycihkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uLy4uL3NyYy91dGlscy90b29scy50cyIsImltcG9ydCB7XG4gICAgZGVmYXVsdCBhcyBDRFBMaWIsXG4gICAgVXRpbHMsXG59IGZyb20gXCJjZHAtbGliXCI7XG5pbXBvcnQge1xuICAgIENvbW1hbmRQYXJzZXIsXG4gICAgSUNvbW1hbmRMaW5lSW5mbyxcbn0gZnJvbSBcIi4vY29tbWFuZC1wYXJzZXJcIjtcbmltcG9ydCB7XG4gICAgUHJvbXB0QmFzZSxcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcbmltcG9ydCB7XG4gICAgUHJvbXB0TGlicmFyeSxcbn0gZnJvbSBcIi4vcHJvbXB0LWxpYnJhcnlcIjtcbmltcG9ydCB7XG4gICAgUHJvbXB0TW9iaWxlQXBwLFxufSBmcm9tIFwiLi9wcm9tcHQtbW9iaWxlXCI7XG5pbXBvcnQge1xuICAgIFByb21wdERlc2t0b3BBcHAsXG59IGZyb20gXCIuL3Byb21wdC1kZXNrdG9wXCI7XG5pbXBvcnQge1xuICAgIFByb21wdFdlYkFwcCxcbn0gZnJvbSBcIi4vcHJvbXB0LXdlYlwiO1xuaW1wb3J0IHtcbiAgICBkZWZhdWx0IGFzIENEUERvYyxcbn0gZnJvbSBcIi4vY2RwLWRvY1wiO1xuXG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xuXG5mdW5jdGlvbiBnZXRDcmVhdGVJbnF1aXJlcihjbWRJbmZvOiBJQ29tbWFuZExpbmVJbmZvKTogUHJvbXB0QmFzZSB7XG4gICAgc3dpdGNoIChjbWRJbmZvLnRhcmdldCkge1xuICAgICAgICBjYXNlIFwibGlicmFyeVwiOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRMaWJyYXJ5KCk7XG4gICAgICAgIGNhc2UgXCJtb2JpbGVcIjpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbXB0TW9iaWxlQXBwKCk7XG4gICAgICAgIGNhc2UgXCJkZXNrdG9wXCI6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21wdERlc2t0b3BBcHAoKTtcbiAgICAgICAgY2FzZSBcIndlYlwiOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9tcHRXZWJBcHAoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwidW5zdXBwb3J0ZWQgdGFyZ2V0OiBcIiArIGNtZEluZm8udGFyZ2V0KSk7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbnF1aXJlQ3JlYXRlKGNtZEluZm86IElDb21tYW5kTGluZUluZm8pOiB2b2lkIHtcbiAgICBjb25zdCBpbnF1aXJlciA9IGdldENyZWF0ZUlucXVpcmVyKGNtZEluZm8pO1xuXG4gICAgICAgIGlucXVpcmVyLnByb21wdGluZyhjbWRJbmZvKVxuICAgICAgICAgICAgLnRoZW4oKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGV4ZWN1dGVcbiAgICAgICAgICAgICAgICByZXR1cm4gQ0RQTGliLmV4ZWN1dGUoY29uZmlnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oaW5xdWlyZXIubGFuZy5maW5pc2hlZFtjbWRJbmZvLmFjdGlvbl0pKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKHJlYXNvbjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFwic3RyaW5nXCIgIT09IHR5cGVvZiByZWFzb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gcmVhc29uLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYXNvbiA9IHJlYXNvbi5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhc29uID0gSlNPTi5zdHJpbmdpZnkocmVhc29uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChyZWFzb24pKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTk9URTogZXM2IHByb21pc2UncyBhbHdheXMgYmxvY2suXG4gICAgICAgICAgICB9KTtcbn1cblxuZnVuY3Rpb24gYnJvd3NlRG9jKHBydDogc3RyaW5nKTogdm9pZCB7XG4gICAgQ0RQRG9jLmV4ZWN1dGUocHJ0KS50aGVuKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQXV0b21hdGljYWx5IHdlYiBicm93c2VyIG9wZW5lZCBhbmQgeW91IGNhbiBicm93c2UgY2RwIGRvY3VtZW50cy5cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVG8gcXVpdCBicm93c2luZywgcHJlc3MgQ3RybCArIEMuXCIpO1xuICAgIH0pXG4gICAgLmNhdGNoKChyZWplY3QpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJEZWZhdWx0IHBvcnQgODA4MCBpcyBhbHJlYWR5IHVzZWQuIFBsZWFzZSB1c2UgYW5vdGhlciBwb3J0LCBmb3IgZXhhbXBsZSAkIGNkcCBkb2MgLXAgMzAwMFwiKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1haW4oKSB7XG4gICAgcHJvY2Vzcy50aXRsZSA9IFwiY2RwXCI7XG4gICAgY29uc3QgY21kSW5mbyA9IENvbW1hbmRQYXJzZXIucGFyc2UocHJvY2Vzcy5hcmd2KTtcbiAgICBjb25zdCBwcnQ6IHN0cmluZyA9IGNtZEluZm8uY2xpT3B0aW9ucy5wb3J0O1xuXG4gICAgc3dpdGNoIChjbWRJbmZvLmFjdGlvbikge1xuICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICBpbnF1aXJlQ3JlYXRlKGNtZEluZm8pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkb2NcIjpcbiAgICAgICAgICAgIGJyb3dzZURvYyhwcnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChjbWRJbmZvLmFjdGlvbiArIFwiIGNvbW1hbmQ6IHVuZGVyIGNvbnN0cnVjdGlvbi5cIikpO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY2RwLWNsaS50cyIsImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGNvbW1hbmRlciBmcm9tIFwiY29tbWFuZGVyXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCJjZHAtbGliXCI7XG5cbmNvbnN0IGZzICAgID0gVXRpbHMuZnM7XG5jb25zdCBjaGFsayA9IFV0aWxzLmNoYWxrO1xuXG4vKipcbiAqIEBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lT3B0aW9uc1xuICogQGJyaWVmICAgICDjgrPjg57jg7Pjg4njg6njgqTjg7PnlKjjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ29tbWFuZExpbmVPcHRpb25zIHtcbiAgICBmb3JjZTogYm9vbGVhbjsgICAgIC8vIOOCqOODqeODvOe2mee2mueUqFxuICAgIHRhcmdldERpcjogc3RyaW5nOyAgLy8g5L2c5qWt44OH44Kj44Os44Kv44OI44Oq5oyH5a6aXG4gICAgY29uZmlnOiBzdHJpbmc7ICAgICAvLyDjgrPjg7Pjg5XjgqPjgrDjg5XjgqHjgqTjg6vmjIflrppcbiAgICB2ZXJib3NlOiBib29sZWFuOyAgIC8vIOips+e0sOODreOCsFxuICAgIHNpbGVudDogYm9vbGVhbjsgICAgLy8gc2lsZW50IG1vZGVcbiAgICBtaW5pZnk6IGJvb2xlYW47ICAgIC8vIG1pbmlmeSBzdXBwb3J0XG4gICAgcG9ydDogc3RyaW5nOyAgICAgICAvLyBsb2NhbCBzZXJ2ZXIgbGlzdGVuaW5nIHBvcnRcbn1cblxuLyoqXG4gKiBAaW50ZXJmYWNlIElDb21tYW5kTGluZUluZm9cbiAqIEBicmllZiAgICAg44Kz44Oe44Oz44OJ44Op44Kk44Oz5oOF5aCx5qC857SN44Kk44Oz44K/44O844OV44Kn44Kk44K5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbW1hbmRMaW5lSW5mbyB7XG4gICAgcGtnRGlyOiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgICAgLy8gQ0xJIOOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODqlxuICAgIGFjdGlvbjogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCouOCr+OCt+ODp+ODs+WumuaVsFxuICAgIHRhcmdldDogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAgIC8vIOOCs+ODnuODs+ODieOCv+ODvOOCsuODg+ODiFxuICAgIGluc3RhbGxlZERpcjogc3RyaW5nOyAgICAgICAgICAgICAgIC8vIENMSSDjgqTjg7Pjgrnjg4jjg7zjg6tcbiAgICBjbGlPcHRpb25zOiBJQ29tbWFuZExpbmVPcHRpb25zOyAgICAvLyDjgrPjg57jg7Pjg4njg6njgqTjg7PjgafmuKHjgZXjgozjgZ/jgqrjg5fjgrfjg6fjg7Ncbn1cblxuLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cblxuLyoqXG4gKiBAY2xhc3MgQ29tbWFuZFBhcnNlclxuICogQGJyaWVmIOOCs+ODnuODs+ODieODqeOCpOODs+ODkeODvOOCteODvFxuICovXG5leHBvcnQgY2xhc3MgQ29tbWFuZFBhcnNlciB7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xuXG4gICAgLyoqXG4gICAgICog44Kz44Oe44Oz44OJ44Op44Kk44Oz44Gu44OR44O844K5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGFyZ3YgICAgICAg5byV5pWw44KS5oyH5a6aXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBbb3B0aW9uc10gIOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxuICAgICAqIEByZXR1cm5zIHtJQ29tbWFuZExpbmVJbmZvfVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcGFyc2UoYXJndjogc3RyaW5nW10sIG9wdGlvbnM/OiBhbnkpOiBJQ29tbWFuZExpbmVJbmZvIHtcbiAgICAgICAgY29uc3QgY21kbGluZSA9IDxJQ29tbWFuZExpbmVJbmZvPntcbiAgICAgICAgICAgIHBrZ0RpcjogdGhpcy5nZXRQYWNrYWdlRGlyZWN0b3J5KGFyZ3YpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBwa2c6IGFueTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGtnID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGNtZGxpbmUucGtnRGlyLCBcInBhY2thZ2UuanNvblwiKSwgXCJ1dGY4XCIpLnRvU3RyaW5nKCkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJwYWNrYWdlLmpzb24gcGFyc2UgZXJyb3I6IFwiICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb21tYW5kZXJcbiAgICAgICAgICAgIC52ZXJzaW9uKHBrZy52ZXJzaW9uKVxuICAgICAgICAgICAgLm9wdGlvbihcIi1mLCAtLWZvcmNlXCIsIFwiQ29udGludWUgZXhlY3V0aW9uIGV2ZW4gaWYgaW4gZXJyb3Igc2l0dWF0aW9uXCIpXG4gICAgICAgICAgICAub3B0aW9uKFwiLXQsIC0tdGFyZ2V0ZGlyIDxwYXRoPlwiLCBcIlNwZWNpZnkgcHJvamVjdCB0YXJnZXQgZGlyZWN0b3J5XCIpXG4gICAgICAgICAgICAub3B0aW9uKFwiLWMsIC0tY29uZmlnIDxwYXRoPlwiLCBcIlNwZWNpZnkgY29uZmlnIGZpbGUgcGF0aFwiKVxuICAgICAgICAgICAgLm9wdGlvbihcIi12LCAtLXZlcmJvc2VcIiwgXCJTaG93IGRlYnVnIG1lc3NhZ2VzLlwiKVxuICAgICAgICAgICAgLm9wdGlvbihcIi1zLCAtLXNpbGVudFwiLCBcIlJ1biBhcyBzaWxlbnQgbW9kZS5cIilcbiAgICAgICAgICAgIC5vcHRpb24oXCItLW5vLW1pbmlmeVwiLCBcIk5vdCBtaW5pZmllZCBvbiByZWxlYXNlLlwiKVxuICAgICAgICAgICAgLm9wdGlvbihcIi1wLCAtLXBvcnQgPHBvcnQ+XCIsIFwiU2V0IGxvY2FsIHNlcnZlciBwb3J0IHdoZW4gYnJvd3NpbmcgZG9jdW1lbnRcIilcbiAgICAgICAgO1xuXG4gICAgICAgIGNvbW1hbmRlclxuICAgICAgICAgICAgLmNvbW1hbmQoXCJpbml0XCIpXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJpbml0IHByb2plY3RcIilcbiAgICAgICAgICAgIC5hY3Rpb24oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNtZGxpbmUuYWN0aW9uID0gXCJpbml0XCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKFwiLS1oZWxwXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgRXhhbXBsZXM6XCIpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBpbml0XCIpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbW1hbmRlclxuICAgICAgICAgICAgLmNvbW1hbmQoXCJjcmVhdGUgPHRhcmdldD5cIilcbiAgICAgICAgICAgIC5kZXNjcmlwdGlvbihcImNyZWF0ZSBib2lsZXJwbGF0ZSBmb3IgJ2xpYnJhcnksIG1vZHVsZScgfCAnbW9iaWxlLCBhcHAnIHwgJ2Rlc2t0b3AnIHwgJ3dlYidcIilcbiAgICAgICAgICAgIC5hY3Rpb24oKHRhcmdldDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKC9eKG1vZHVsZXxhcHB8bGlicmFyeXxtb2JpbGV8ZGVza3RvcHx3ZWIpJC9pLnRlc3QodGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBjbWRsaW5lLmFjdGlvbiA9IFwiY3JlYXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoXCJtb2R1bGVcIiA9PT0gY21kbGluZS50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gXCJsaWJyYXJ5XCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJhcHBcIiA9PT0gY21kbGluZS50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtZGxpbmUudGFyZ2V0ID0gXCJtb2JpbGVcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZC51bmRlcmxpbmUoXCIgIHVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyB0YXJnZXQpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCItLWhlbHBcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICBFeGFtcGxlczpcIikpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGNyZWF0ZSBsaWJyYXJ5XCIpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgbW9iaWxlXCIpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbihcIiAgICAkIGNkcCBjcmVhdGUgYXBwIC1jIHNldHRpbmcuanNvblwiKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb21tYW5kZXJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiKlwiLCBudWxsLCB7IG5vSGVscDogdHJ1ZSB9KVxuICAgICAgICAgICAgLmFjdGlvbigoY21kKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkLnVuZGVybGluZShcIiAgdW5zdXBwb3J0ZWQgY29tbWFuZDogXCIgKyBjbWQpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb21tYW5kZXJcbiAgICAgICAgICAgIC5jb21tYW5kKFwiZG9jXCIpXG4gICAgICAgICAgICAuZGVzY3JpcHRpb24oXCJzaG93IGRvY3VtZW50IHdpdGggYnJvd3NlclwiKVxuICAgICAgICAgICAgLmFjdGlvbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgY21kbGluZS5hY3Rpb24gPSBcImRvY1wiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbihcIi0taGVscFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgIEV4YW1wbGVzOlwiKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY2hhbGsuZ3JlZW4oXCIgICAgJCBjZHAgZG9jIC1wIDxwb3J0IG51bWJlcj5cIikpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyZWVuKFwiICAgICQgY2RwIGRvYyA8PGluIGNhc2Ugb2YgdXNpbmcgZGVmYXVsdCBwb3J0OiA4MDgwPj5cIikpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29tbWFuZGVyLnBhcnNlKGFyZ3YpO1xuXG4gICAgICAgIGlmIChhcmd2Lmxlbmd0aCA8PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbWRsaW5lLmNsaU9wdGlvbnMgPSB0aGlzLnRvQ29tbWFuZExpbmVPcHRpb25zKGNvbW1hbmRlcik7XG5cbiAgICAgICAgcmV0dXJuIGNtZGxpbmU7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBwcml2YXRlIHN0YXRpYyBtZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiBDTEkg44Gu44Kk44Oz44K544OI44O844Or44OH44Kj44Os44Kv44OI44Oq44KS5Y+W5b6XXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmdbXX0gYXJndiDlvJXmlbBcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOOCpOODs+OCueODiOODvOODq+ODh+OCo+ODrOOCr+ODiOODqlxuICAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIGdldFBhY2thZ2VEaXJlY3RvcnkoYXJndjogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgICAgICAvLyBBZGRlZDogSXNzdWUgIzQ6IGdldCB0aGUgcmVhbCBwYXRoIG9mIGV4ZWMsIGJlY2F1c2UgZ2V0IHRoZSBwYXRoIG9mIHN5bWJvbGljIGxpbmsgb2YgZXhlYyBvbiBNYWMuXG4gICAgICAgIGNvbnN0IGV4ZWNSZWFsUGF0aCA9IGZzLnJlYWxwYXRoU3luYyhhcmd2WzFdKTtcbiAgICAgICAgLy9cbiAgICAgICAgY29uc3QgZXhlY0RpciA9IHBhdGguZGlybmFtZShleGVjUmVhbFBhdGgpO1xuICAgICAgICByZXR1cm4gcGF0aC5qb2luKGV4ZWNEaXIsIFwiLi5cIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ0xJIG9wdGlvbiDjgpIgSUNvbW1hbmRMaW5lT3B0aW9ucyDjgavlpInmj5tcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gY29tbWFuZGVyIHBhcnNlIOa4iOOBvyBjb21hbm5kZXIg44Kk44Oz44K544K/44Oz44K5XG4gICAgICogQHJldHVybiB7SUNvbW1hbmRMaW5lT3B0aW9uc30gb3B0aW9uIOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIHRvQ29tbWFuZExpbmVPcHRpb25zKGNvbW1hbmQ6IGFueSk6IElDb21tYW5kTGluZU9wdGlvbnMge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZm9yY2U6ICEhY29tbWFuZC5mb3JjZSxcbiAgICAgICAgICAgIHRhcmdldERpcjogY29tbWFuZC50YXJnZXRkaXIsXG4gICAgICAgICAgICBjb25maWc6IGNvbW1hbmQuY29uZmlnLFxuICAgICAgICAgICAgdmVyYm9zZTogISFjb21tYW5kLnZlcmJvc2UsXG4gICAgICAgICAgICBzaWxlbnQ6ICEhY29tbWFuZC5zaWxlbnQsXG4gICAgICAgICAgICBtaW5pZnk6IGNvbW1hbmQubWluaWZ5LFxuICAgICAgICAgICAgcG9ydDogY29tbWFuZC5wb3J0LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODmOODq+ODl+ihqOekuuOBl+OBpue1guS6hlxuICAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIHNob3dIZWxwKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpbmZvcm0gPSAodGV4dDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2hhbGsuZ3JlZW4odGV4dCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbW1hbmRlci5vdXRwdXRIZWxwKDxhbnk+aW5mb3JtKTtcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY29tbWFuZC1wYXJzZXIudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21tYW5kZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImNvbW1hbmRlclwiLFwiY29tbW9uanMyXCI6XCJjb21tYW5kZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xuaW1wb3J0IHtcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcbiAgICBJTGlicmFyeUNvbmZpZ3JhdGlvbixcbiAgICBVdGlscyxcbn0gZnJvbSBcImNkcC1saWJcIjtcbmltcG9ydCB7XG4gICAgUHJvbXB0QmFzZSxcbiAgICBJQW5zd2VyU2NoZW1hLFxufSBmcm9tIFwiLi9wcm9tcHQtYmFzZVwiO1xuaW1wb3J0IGRlZmF1bHRDb25maWcgZnJvbSBcIi4vZGVmYXVsdC1jb25maWdcIjtcblxuY29uc3QgJCAgICAgICAgICAgICA9IFV0aWxzLiQ7XG5jb25zdCBjaGFsayAgICAgICAgID0gVXRpbHMuY2hhbGs7XG5jb25zdCBzZW12ZXJSZWdleCAgID0gVXRpbHMuc2VtdmVyUmVnZXg7XG5jb25zdCBsaWJDb25maWcgICAgID0gZGVmYXVsdENvbmZpZy5saWJyYXJ5O1xuXG4vKipcbiAqIEBjbGFzcyBQcm9tcHRMaWJyYXJ5XG4gKiBAYnJpZWYg44Op44Kk44OW44Op44Oq44Oi44K444Ol44O844Or55SoIElucXVpcmUg44Kv44Op44K5XG4gKi9cbmV4cG9ydCBjbGFzcyBQcm9tcHRMaWJyYXJ5IGV4dGVuZHMgUHJvbXB0QmFzZSB7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xuXG4gICAgLyoqXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXG4gICAgICovXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gcHJvamVjdCBjb21tb24gc2V0dG5pZ3MgKElQcm9qZWN0Q29uZmlncmF0aW9uKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiaW5wdXRcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcInByb2plY3ROYW1lXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ucHJvamVjdE5hbWUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMucHJvamVjdE5hbWUgfHwgXCJjb29sLXByb2plY3QtbmFtZVwiLFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEvXlthLXpBLVowLTkvQC5fLV0rJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5pbnZhbGlkTWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwidmVyc2lvblwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24ubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMudmVyc2lvbiB8fCBcIjAuMC4xXCIsXG4gICAgICAgICAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZW12ZXJSZWdleCgpLmV4ZWModmFsdWUpWzBdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZW12ZXJSZWdleCgpLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi52ZXJzaW9uLmludmFsaWRNZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJsaWNlbnNlXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLmFwYWNoZTIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJBcGFjaGUtMi4wXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmxpY2Vuc2UuY2hvaWNlcy5taXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJNSVRcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLnByb3ByaWV0YXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTk9ORVwiLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubGljZW5zZSB8fCBcIk5PTkVcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBsaWJyYXJ5IHNldHRuaWdzIChJQnVpbGRUYXJnZXRDb25maWdyYXRpb24pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJlbnZcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmxpYnJhcnkuZW52Lm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5lbnYuY2hvaWNlcy5icm93c2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwid2ViXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVudi5jaG9pY2VzLm5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub2RlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5ldyBpbnF1aXJlci5TZXBhcmF0b3IoKSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZW52LmNob2ljZXMuZWxlY3Ryb24gKyB0aGlzLkxJTUlUQVRJT04oKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVsZWN0cm9uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVudi5jaG9pY2VzLmVsZWN0cm9uUmVuZGVyZXIgKyB0aGlzLkxJTUlUQVRJT04oKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImVsZWN0cm9uLXJlbmRlcmVyXCIsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGZpbHRlcjogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaWJDb25maWcuRUxFQ1RST05fQVZBSUxBQkxFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJlbGVjdHJvblwiID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibm9kZVwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiZWxlY3Ryb24tcmVuZGVyZXJcIiA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIndlYlwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZW52IHx8IFwid2ViXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gYmFzZSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcImV4dHJhU2V0dGluZ3NcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLmNob2ljZXMucmVjb21tZW5kZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJyZWNvbW1lbmRlZFwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5leHRyYVNldHRpbmdzLmNob2ljZXMuY3VzdG9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY3VzdG9tXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZXh0cmFTZXR0aW5ncyB8fCBcInJlY29tbWVuZGVkXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoY3VzdG9tOiBtb2R1bGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLm5vbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmNvbW1vbmpzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29tbW9uanNcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMudW1kLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwidW1kXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAoXCJhbWRcIiAhPT0gdGhpcy5hbnN3ZXJzLm1vZHVsZSkgPyAodGhpcy5hbnN3ZXJzLm1vZHVsZSB8fCBcImNvbW1vbmpzXCIpIDogXCJjb21tb25qc1wiLFxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3MgJiYgL14obm9kZXxlbGVjdHJvbikkL2kudGVzdChhbnN3ZXJzLmVudik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLm5vbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmFtZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImFtZFwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUuY2hvaWNlcy51bWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ1bWRcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IChcImNvbW1vbmpzXCIgIT09IHRoaXMuYW5zd2Vycy5tb2R1bGUpID8gKHRoaXMuYW5zd2Vycy5tb2R1bGUgfHwgXCJhbWRcIikgOiBcImFtZFwiLFxuICAgICAgICAgICAgICAgIHdoZW46IChhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImN1c3RvbVwiID09PSBhbnN3ZXJzLmV4dHJhU2V0dGluZ3MgJiYgXCJ3ZWJcIiA9PT0gYW5zd2Vycy5lbnY7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJsaXN0XCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJtb2R1bGVcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5tb2R1bGUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLm5vbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLmNvbW1vbmpzLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29tbW9uanNcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubW9kdWxlLmNob2ljZXMuYW1kLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiYW1kXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLm1vZHVsZS5jaG9pY2VzLnVtZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInVtZFwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhpcy5hbnN3ZXJzLm1vZHVsZSB8fCBcImNvbW1vbmpzXCIsXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncyAmJiBcImVsZWN0cm9uLXJlbmRlcmVyXCIgPT09IGFuc3dlcnMuZW52O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gbGlicmFyeSBzZXR0bmlncyAoY3VzdG9tOiBlcylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcImVzXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24uZXMubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVzLmNob2ljZXMuZXM1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXM1XCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmVzLmNob2ljZXMuZXMyMDE1LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZXMyMDE1XCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuZXMgfHwgKFwid2ViXCIgPT09IHRoaXMuYW5zd2Vycy5lbnYgPyBcImVzNVwiIDogXCJlczIwMTVcIiksXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxuICAgICAqL1xuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xuICAgICAgICBjb25zdCBjb25maWc6IElMaWJyYXJ5Q29uZmlncmF0aW9uID0gKCgpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoYW5zd2Vycy5lbnYpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwid2ViXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmJyb3dzZXIsIGFuc3dlcnMpO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJub2RlXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLm5vZGUsIGFuc3dlcnMpO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlbGVjdHJvblwiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIGxpYkNvbmZpZy5lbGVjdHJvbiwgYW5zd2Vycyk7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVsZWN0cm9uLXJlbmRlcmVyXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgbGliQ29uZmlnLmVsZWN0cm9uLCBhbnN3ZXJzKTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcInVuc3VwcG9ydGVkIHRhcmdldDogXCIgKyBhbnN3ZXJzLmVudikpO1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXh0cmFTZXR0aW5nc1wiLCAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwicHJvamVjdE5hbWVcIiwgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwidmVyc2lvblwiLCAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwibGljZW5zZVwiLCAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiZW52XCIsICAgICAgICAgICAgICByZWNvbW1lbmQ6IGZhbHNlICAgIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwibW9kdWxlXCIsICAgICAgICAgICByZWNvbW1lbmQ6IHRydWUgICAgIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiZXNcIiwgICAgICAgICAgICAgICByZWNvbW1lbmQ6IHRydWUgICAgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IChpdGVtLnJlY29tbWVuZCAmJiBcInJlY29tbWVuZGVkXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncykgPyBcInllbGxvd1wiIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY29uZmlnMmRlc2NyaXB0aW9uKGNvbmZpZywgaXRlbS5uYW1lLCBjb2xvcikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcImVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yLCBudWxsLCA0KSkpO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIHByaXZhdGUgbWV0aG9kczpcblxuICAgIC8qKlxuICAgICAqIGVsZWN0cm9uIOOBjOacieWKueWHuuOBquOBhOWgtOWQiOOBruijnOi2s+aWh+Wtl+OCkuWPluW+l1xuICAgICAqL1xuICAgIHByaXZhdGUgTElNSVRBVElPTigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gbGliQ29uZmlnLkVMRUNUUk9OX0FWQUlMQUJMRSA/IFwiXCIgOiBcIiBcIiArIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnN0aWxOb3RBdmFpbGFibGU7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtbGlicmFyeS50cyIsImltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xuaW1wb3J0IHtcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcbiAgICBJRXh0ZXJuYWxNb2R1bGVJbmZvLFxuICAgIElNb2JpbGVBcHBDb25maWdyYXRpb24sXG4gICAgVXRpbHMsXG59IGZyb20gXCJjZHAtbGliXCI7XG5pbXBvcnQge1xuICAgIFByb21wdEJhc2UsXG4gICAgSUFuc3dlclNjaGVtYSxcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcbmltcG9ydCBkZWZhdWx0Q29uZmlnIGZyb20gXCIuL2RlZmF1bHQtY29uZmlnXCI7XG5cbmNvbnN0ICQgICAgICAgICAgICAgPSBVdGlscy4kO1xuY29uc3QgXyAgICAgICAgICAgICA9IFV0aWxzLl87XG5jb25zdCBjaGFsayAgICAgICAgID0gVXRpbHMuY2hhbGs7XG5jb25zdCBzZW12ZXJSZWdleCAgID0gVXRpbHMuc2VtdmVyUmVnZXg7XG5jb25zdCBtb2JpbGVDb25maWcgID0gZGVmYXVsdENvbmZpZy5tb2JpbGU7XG5cbmNvbnN0IEVYVEVSTkFMX0RFRkFVTFRTID0gKCgpID0+IHtcbiAgICBjb25zdCBkZWZhdWx0czogc3RyaW5nW10gPSBbXTtcbiAgICBPYmplY3Qua2V5cyhtb2JpbGVDb25maWcuYnJvd3Nlci5leHRlcm5hbClcbiAgICAgICAgLmZvckVhY2goKHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1vYmlsZUNvbmZpZy5icm93c2VyLmV4dGVybmFsW3RhcmdldF0ucmVndWxhcikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzLnB1c2godGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgcmV0dXJuIGRlZmF1bHRzO1xufSkoKTtcblxuLyoqXG4gKiBAY2xhc3MgUHJvbXB0TW9iaWxlQXBwXG4gKiBAYnJpZWYg44Oi44OQ44Kk44Or44Ki44OX44Oq55SoIElucXVpcmUg44Kv44Op44K5XG4gKi9cbmV4cG9ydCBjbGFzcyBQcm9tcHRNb2JpbGVBcHAgZXh0ZW5kcyBQcm9tcHRCYXNlIHtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcbiAgICAgKi9cbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XG4gICAgICAgIGNvbnN0IHBsYXRmb3Jtc19kZWZhdWx0ID0gdGhpcy5hbnN3ZXJzLnBsYXRmb3Jtc1xuICAgICAgICAgICAgPyB0aGlzLmFuc3dlcnMucGxhdGZvcm1zLnNsaWNlKClcbiAgICAgICAgICAgIDogbW9iaWxlQ29uZmlnLmJyb3dzZXIucGxhdGZvcm1zO1xuICAgICAgICBkZWxldGUgdGhpcy5hbnN3ZXJzLnBsYXRmb3JtcztcblxuICAgICAgICBjb25zdCBwcm9qZWN0U3RydWN0dXJlX2RlZmF1bHQgPSB0aGlzLmFuc3dlcnMucHJvamVjdFN0cnVjdHVyZVxuICAgICAgICAgICAgPyB0aGlzLmFuc3dlcnMucHJvamVjdFN0cnVjdHVyZS5zbGljZSgpXG4gICAgICAgICAgICA6IG1vYmlsZUNvbmZpZy5icm93c2VyLnByb2plY3RTdHJ1Y3R1cmU7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmFuc3dlcnMucHJvamVjdFN0cnVjdHVyZTtcblxuICAgICAgICBjb25zdCBleHRlcm5hbF9kZWZhdWx0ID0gdGhpcy5hbnN3ZXJzLmV4dGVybmFsXG4gICAgICAgICAgICA/IHRoaXMuYW5zd2Vycy5leHRlcm5hbC5zbGljZSgpXG4gICAgICAgICAgICA6IEVYVEVSTkFMX0RFRkFVTFRTO1xuICAgICAgICBkZWxldGUgdGhpcy5hbnN3ZXJzLmV4dGVybmFsO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAvLyBwcm9qZWN0IGNvbW1vbiBzZXR0bmlncyAoSVByb2plY3RDb25maWdyYXRpb24pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiYXBwTmFtZVwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmFwcE5hbWUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMuYXBwTmFtZSB8fCBcIkNvb2wgQXBwIE5hbWVcIixcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgvXi4qWyhcXFxcfC98OnwqfD98XCJ8PHw+fHwpXS4qJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5hcHBOYW1lLmludmFsaWRNZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJwcm9qZWN0TmFtZVwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnByb2plY3ROYW1lLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8udHJpbShfLmRhc2hlcml6ZShhbnN3ZXJzLmFwcE5hbWUudG9Mb3dlckNhc2UoKSksIFwiLVwiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEvXlthLXpBLVowLTlfLV0qJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5wcm9qZWN0TmFtZS5pbnZhbGlkTWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJpbnB1dFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiYXBwSWRcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5hcHBJZC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5hcHBJZCB8fCBcIm9yZy5jb29sLmFwcG5hbWVcIixcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImlucHV0XCIsXG4gICAgICAgICAgICAgICAgbmFtZTogXCJ2ZXJzaW9uXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24udmVyc2lvbi5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy52ZXJzaW9uIHx8IFwiMC4wLjFcIixcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VtdmVyUmVnZXgoKS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbXZlclJlZ2V4KCkuZXhlYyh2YWx1ZSlbMF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbGlkYXRlOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbXZlclJlZ2V4KCkudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLnZlcnNpb24uaW52YWxpZE1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpc3RcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcImxpY2Vuc2VcIixcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMuYXBhY2hlMixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkFwYWNoZS0yLjBcIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5jb21tb24ubGljZW5zZS5jaG9pY2VzLm1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIk1JVFwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLmxhbmcucHJvbXB0LmNvbW1vbi5saWNlbnNlLmNob2ljZXMucHJvcHJpZXRhcnksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJOT05FXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmFuc3dlcnMubGljZW5zZSB8fCBcIk5PTkVcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwicGxhdGZvcm1zXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUucGxhdGZvcm1zLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgY2hvaWNlczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImFuZHJvaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IHBsYXRmb3Jtc19kZWZhdWx0LmluZGV4T2YoXCJhbmRyb2lkXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJpb3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IHBsYXRmb3Jtc19kZWZhdWx0LmluZGV4T2YoXCJpb3NcIikpLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwiZXh0cmFTZXR0aW5nc1wiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5yZWNvbW1lbmRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInJlY29tbWVuZGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQuY29tbW9uLmV4dHJhU2V0dGluZ3MuY2hvaWNlcy5jdXN0b20sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjdXN0b21cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRoaXMuYW5zd2Vycy5leHRyYVNldHRpbmdzIHx8IFwicmVjb21tZW5kZWRcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJjaGVja2JveFwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IFwicHJvamVjdFN0cnVjdHVyZVwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLnByb2plY3RTdHJ1Y3R1cmUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLnByb2plY3RTdHJ1Y3R1cmUubGliLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibGliXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBwcm9qZWN0U3RydWN0dXJlX2RlZmF1bHQuaW5kZXhPZihcImxpYlwiKSksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLnByb2plY3RTdHJ1Y3R1cmUucG9ydGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInBvcnRpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IHByb2plY3RTdHJ1Y3R1cmVfZGVmYXVsdC5pbmRleE9mKFwicG9ydGluZ1wiKSksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB3aGVuOiAoYW5zd2VyczogSUFuc3dlclNjaGVtYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJjdXN0b21cIiA9PT0gYW5zd2Vycy5leHRyYVNldHRpbmdzO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiY2hlY2tib3hcIixcbiAgICAgICAgICAgICAgICBuYW1lOiBcImV4dGVybmFsXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBwYWdpbmF0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNob2ljZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgbmV3IGlucXVpcmVyLlNlcGFyYXRvcih0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5zZXBhcmF0b3IuY29yZG92YSksXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZDogKDAgPD0gZXh0ZXJuYWxfZGVmYXVsdC5pbmRleE9mKFwiY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZVwiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuc3dlcnMucGxhdGZvcm1zIHx8IGFuc3dlcnMucGxhdGZvcm1zLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5ub0NvcmRvdmFNZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJjb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJjb3Jkb3ZhLXBsdWdpbi1pbmFwcGJyb3dzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImNvcmRvdmEtcGx1Z2luLWluYXBwYnJvd3NlclwiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuc3dlcnMucGxhdGZvcm1zIHx8IGFuc3dlcnMucGxhdGZvcm1zLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5ub0NvcmRvdmFNZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMubGFuZy5wcm9tcHQubW9iaWxlLmV4dGVybmFsLm1vZHVsZXNbXCJjb3Jkb3ZhLXBsdWdpbi1hcHAtdmVyc2lvblwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcImNvcmRvdmEtcGx1Z2luLWFwcC12ZXJzaW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJjb3Jkb3ZhLXBsdWdpbi1hcHAtdmVyc2lvblwiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFuc3dlcnMucGxhdGZvcm1zIHx8IGFuc3dlcnMucGxhdGZvcm1zLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcucHJvbXB0Lm1vYmlsZS5leHRlcm5hbC5ub0NvcmRvdmFNZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5ldyBpbnF1aXJlci5TZXBhcmF0b3IodGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwuc2VwYXJhdG9yLnV0aWxzKSxcbiAgICAgICAgICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImhvZ2FuLmpzXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiaG9nYW4uanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImhvZ2FuLmpzXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImhhbW1lcmpzXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiaGFtbWVyanNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImhhbW1lcmpzXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImlzY3JvbGxcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJpc2Nyb2xsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiAoMCA8PSBleHRlcm5hbF9kZWZhdWx0LmluZGV4T2YoXCJpc2Nyb2xsXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5sYW5nLnByb21wdC5tb2JpbGUuZXh0ZXJuYWwubW9kdWxlc1tcImZsaXBzbmFwXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiZmxpcHNuYXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6ICgwIDw9IGV4dGVybmFsX2RlZmF1bHQuaW5kZXhPZihcImZsaXBzbmFwXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby1zdHJpbmctbGl0ZXJhbCAqL1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgd2hlbjogKGFuc3dlcnM6IElBbnN3ZXJTY2hlbWEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY3VzdG9tXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxuICAgICAqL1xuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xuICAgICAgICBjb25zdCBjb25maWc6IElNb2JpbGVBcHBDb25maWdyYXRpb24gPSAoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdHMgPSAkLmV4dGVuZCh7fSwgbW9iaWxlQ29uZmlnLmJyb3dzZXIpO1xuICAgICAgICAgICAgY29uc3QgbG9va3VwID0gZGVmYXVsdHMuZXh0ZXJuYWw7XG4gICAgICAgICAgICBkZWxldGUgZGVmYXVsdHMuZXh0ZXJuYWw7XG4gICAgICAgICAgICBjb25zdCBfY29uZmlnOiBJTW9iaWxlQXBwQ29uZmlncmF0aW9uID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCB7XG4gICAgICAgICAgICAgICAgZXh0ZXJuYWw6IEVYVEVSTkFMX0RFRkFVTFRTLFxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llczogW10sXG4gICAgICAgICAgICAgICAgZGV2RGVwZW5kZW5jaWVzOiBbXSxcbiAgICAgICAgICAgICAgICBjb3Jkb3ZhX3BsdWdpbjogW10sXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VfYWRkb246IFtdLFxuICAgICAgICAgICAgfSwgYW5zd2Vycyk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZURlcGVuZGVuY2llcyA9IChtb2R1bGVOYW1lOiBzdHJpbmcsIGluZm86IElFeHRlcm5hbE1vZHVsZUluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChpbmZvLmFjcXVpc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibnBtXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NvbmZpZy5kZXBlbmRlbmNpZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1vZHVsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzOiBpbmZvLmFsaWFzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IGluZm8uZ2xvYmFsRXhwb3J0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZW5kZXJOYW1lOiBpbmZvLnZlbmRlck5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBpbmZvLmZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5wbTpkZXZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfY29uZmlnLmRldkRlcGVuZGVuY2llcy5wdXNoKHsgbmFtZTogbW9kdWxlTmFtZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjb3Jkb3ZhXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDAgPCBfY29uZmlnLnBsYXRmb3Jtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NvbmZpZy5jb3Jkb3ZhX3BsdWdpbi5wdXNoKHsgbmFtZTogbW9kdWxlTmFtZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyZXNvdXJjZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb25maWcucmVzb3VyY2VfYWRkb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG1vZHVsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzOiBpbmZvLmFsaWFzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxFeHBvcnQ6IGluZm8uZ2xvYmFsRXhwb3J0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZW5kZXJOYW1lOiBpbmZvLnZlbmRlck5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBpbmZvLmZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgKDxhbnk+X2NvbmZpZykuZXh0ZXJuYWwuZm9yRWFjaCgodG9wOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5mbyA9IDxJRXh0ZXJuYWxNb2R1bGVJbmZvPmxvb2t1cFt0b3BdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWxpZCA9IHJlc29sdmVEZXBlbmRlbmNpZXModG9wLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkICYmIGluZm8uc3Vic2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhpbmZvLnN1YnNldClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoc3ViKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVEZXBlbmRlbmNpZXMoc3ViLCA8SUV4dGVybmFsTW9kdWxlSW5mbz5pbmZvLnN1YnNldFtzdWJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNoYWxrLnJlZChcImVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yLCBudWxsLCA0KSkpO1xuICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVsZXRlIF9jb25maWcuZXh0ZXJuYWw7XG4gICAgICAgICAgICByZXR1cm4gX2NvbmZpZztcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogXCJleHRyYVNldHRpbmdzXCIsICAgIGZpeGVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImFwcE5hbWVcIiwgICAgICAgICAgZml4ZWQ6IGZhbHNlIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwicHJvamVjdE5hbWVcIiwgICAgICBmaXhlZDogZmFsc2UgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJhcHBJZFwiLCAgICAgICAgICAgIGZpeGVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcInZlcnNpb25cIiwgICAgICAgICAgZml4ZWQ6IGZhbHNlIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwibGljZW5zZVwiLCAgICAgICAgICBmaXhlZDogZmFsc2UgfSxcbiAgICAgICAgICAgIHsgbmFtZTogXCJtb2R1bGVcIiwgICAgICAgICAgIGZpeGVkOiB0cnVlICB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcImVzXCIsICAgICAgICAgICAgICAgZml4ZWQ6IHRydWUgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IChpdGVtLmZpeGVkKSA/IFwieWVsbG93XCIgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5jb25maWcyZGVzY3JpcHRpb24oY29uZmlnLCBpdGVtLm5hbWUsIGNvbG9yKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoY2hhbGsucmVkKFwiZXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IsIG51bGwsIDQpKSk7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwbGF0Zm9ybXNcbiAgICAgICAgY29uc3QgcGxhdGZvcm1JbmZvID0gKDAgPCBjb25maWcucGxhdGZvcm1zLmxlbmd0aClcbiAgICAgICAgICAgID8gY29uZmlnLnBsYXRmb3Jtcy5qb2luKFwiLCBcIilcbiAgICAgICAgICAgIDogdGhpcy5sYW5nLnNldHRpbmdzLm1vYmlsZS5wbGF0Zm9ybXMubm9uZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJcXG5cIiArIHRoaXMubGFuZy5zZXR0aW5ncy5tb2JpbGUucGxhdGZvcm1zLmxhYmVsICsgY2hhbGsuY3lhbihwbGF0Zm9ybUluZm8pKTtcblxuICAgICAgICBjb25zdCBDT0xPUiA9IChcInJlY29tbWVuZGVkXCIgPT09IGFuc3dlcnMuZXh0cmFTZXR0aW5ncykgPyBcInllbGxvd1wiIDogXCJjeWFuXCI7XG5cbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9qZWN0IHN0cnVjdHVyZVxuICAgICAgICBpZiAoMCA8IGNvbmZpZy5wcm9qZWN0U3RydWN0dXJlLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgcHJvamVjdFN0cnVjdHVyZSA9IGNvbmZpZy5wcm9qZWN0U3RydWN0dXJlLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLnByb2plY3RTdHJ1Y3R1cmUubGFiZWwgKyBjaGFsa1tDT0xPUl0ocHJvamVjdFN0cnVjdHVyZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkaXRpb25hbCBjb3Jkb3ZhIHBsdWdpblxuICAgICAgICBpZiAoMCA8IGNvbmZpZy5jb3Jkb3ZhX3BsdWdpbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXCIgKyB0aGlzLmxhbmcuc2V0dGluZ3MubW9iaWxlLmNvcmRvdmFQbHVnaW5zLmxhYmVsKTtcbiAgICAgICAgICAgIGNvbmZpZy5jb3Jkb3ZhX3BsdWdpbi5mb3JFYWNoKChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgXCIgKyBjaGFsa1tDT0xPUl0oaW5mby5uYW1lKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZGl0aW9uYWwgZGVwZW5kZW5jeVxuICAgICAgICBpZiAoMCA8IGNvbmZpZy5kZXBlbmRlbmNpZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlxcblwiICsgdGhpcy5sYW5nLnNldHRpbmdzLm1vYmlsZS5kZXBlbmRlbmNpZXMubGFiZWwpO1xuICAgICAgICAgICAgY29uZmlnLnJlc291cmNlX2FkZG9uLmZvckVhY2goKGluZm8pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiAgICBcIiArIGNoYWxrW0NPTE9SXShpbmZvLm5hbWUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uZmlnLmRlcGVuZGVuY2llcy5mb3JFYWNoKChpbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIgICAgXCIgKyBjaGFsa1tDT0xPUl0oaW5mby5uYW1lKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9wcm9tcHQtbW9iaWxlLnRzIiwiLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tIFwiaW5xdWlyZXJcIjtcbmltcG9ydCB7XG4gICAgSVByb2plY3RDb25maWdyYXRpb24sXG4gICAgSURlc2t0b3BBcHBDb25maWdyYXRpb24sXG4gICAgVXRpbHMsXG59IGZyb20gXCJjZHAtbGliXCI7XG5pbXBvcnQge1xuICAgIFByb21wdEJhc2UsXG4gICAgSUFuc3dlclNjaGVtYSxcbn0gZnJvbSBcIi4vcHJvbXB0LWJhc2VcIjtcblxuY29uc3QgY2hhbGsgPSBVdGlscy5jaGFsaztcblxuLyoqXG4gKiBAY2xhc3MgUHJvbXB0RGVza3RvcEFwcFxuICogQGJyaWVmIOODh+OCueOCr+ODiOODg+ODl+OCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxuICovXG5leHBvcnQgY2xhc3MgUHJvbXB0RGVza3RvcEFwcCBleHRlbmRzIFByb21wdEJhc2Uge1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuXG4gICAgLyoqXG4gICAgICog44Ko44Oz44OI44OqXG4gICAgICovXG4gICAgcHVibGljIHByb21wdGluZyhjbWRJbmZvOiBhbnkpOiBQcm9taXNlPElQcm9qZWN0Q29uZmlncmF0aW9uPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZWplY3QoXCJkZXNrdG9wIGFwcCBwcm9tcHRpbmcsIHVuZGVyIGNvbnN0cnVjdGlvbi5cIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gaW1wcmVtZW50cyBhYnN0cnVjdCBtZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprpoIXnm67jga7lj5blvpdcbiAgICAgKi9cbiAgICBnZXQgcXVlc3Rpb25zKCk6IGlucXVpcmVyLlF1ZXN0aW9ucyB7XG4gICAgICAgIC8vIFRPRE86XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg5fjg63jgrjjgqfjgq/jg4joqK3lrprjga7norroqo1cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge0lBbnN3ZXJTY2hlbWF9IGFuc3dlcnMg5Zue562U57WQ5p6cXG4gICAgICogQHJldHVybiB7SVByb2plY3RDb25maWdyYXRpb259IOioreWumuWApOOCkui/lOWNtFxuICAgICAqL1xuICAgIGRpc3BsYXlTZXR0aW5nc0J5QW5zd2VycyhhbnN3ZXJzOiBJQW5zd2VyU2NoZW1hKTogSVByb2plY3RDb25maWdyYXRpb24ge1xuICAgICAgICAvLyBUT0RPOiBzaG93XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJvbXB0LWRlc2t0b3AudHMiLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5cbmltcG9ydCAqIGFzIGlucXVpcmVyIGZyb20gXCJpbnF1aXJlclwiO1xuaW1wb3J0IHtcbiAgICBJUHJvamVjdENvbmZpZ3JhdGlvbixcbiAgICBJV2ViQXBwQ29uZmlncmF0aW9uLFxuICAgIFV0aWxzLFxufSBmcm9tIFwiY2RwLWxpYlwiO1xuaW1wb3J0IHtcbiAgICBQcm9tcHRCYXNlLFxuICAgIElBbnN3ZXJTY2hlbWEsXG59IGZyb20gXCIuL3Byb21wdC1iYXNlXCI7XG5cbmNvbnN0IGNoYWxrID0gVXRpbHMuY2hhbGs7XG5cbi8qKlxuICogQGNsYXNzIFByb21wdFdlYkFwcFxuICogQGJyaWVmIOOCpuOCp+ODluOCouODl+ODqueUqCBJbnF1aXJlIOOCr+ODqeOCuVxuICovXG5leHBvcnQgY2xhc3MgUHJvbXB0V2ViQXBwIGV4dGVuZHMgUHJvbXB0QmFzZSB7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIHB1YmxpYyBtZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiDjgqjjg7Pjg4jjg6pcbiAgICAgKi9cbiAgICBwdWJsaWMgcHJvbXB0aW5nKGNtZEluZm86IGFueSk6IFByb21pc2U8SVByb2plY3RDb25maWdyYXRpb24+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChcIndlYiBhcHAgcHJvbXB0aW5nLCB1bmRlciBjb25zdHJ1Y3Rpb24uXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIGltcHJlbWVudHMgYWJzdHJ1Y3QgbWV0aG9kc1xuXG4gICAgLyoqXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a6aCF55uu44Gu5Y+W5b6XXG4gICAgICovXG4gICAgZ2V0IHF1ZXN0aW9ucygpOiBpbnF1aXJlci5RdWVzdGlvbnMge1xuICAgICAgICAvLyBUT0RPOlxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44OX44Ot44K444Kn44Kv44OI6Kit5a6a44Gu56K66KqNXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtJQW5zd2VyU2NoZW1hfSBhbnN3ZXJzIOWbnuetlOe1kOaenFxuICAgICAqIEByZXR1cm4ge0lQcm9qZWN0Q29uZmlncmF0aW9ufSDoqK3lrprlgKTjgpLov5TljbRcbiAgICAgKi9cbiAgICBkaXNwbGF5U2V0dGluZ3NCeUFuc3dlcnMoYW5zd2VyczogSUFuc3dlclNjaGVtYSk6IElQcm9qZWN0Q29uZmlncmF0aW9uIHtcbiAgICAgICAgLy8gVE9ETzogc2hvd1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Byb21wdC13ZWIudHMiLCJpbXBvcnQgKiBhcyBVdGlscyBmcm9tIFwiLi91dGlsc1wiO1xuXG4vKipcbiAqIEBjbGFzcyBDZHBEb2NcbiAqIEBicmllZiBUT0RPOlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDRFBEb2Mge1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBwdWJpYyBtZXRob2RzOlxuXG4gICAgLyoqXG4gICAgICogbWFpbiBjb21tYW5kXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBleGVjdXRlKHBydDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBVdGlscy5sYXVuY2hMb2NhbFNlcnZlcihwcnQpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBVdGlscy5sYXVuY2hCcm93c2VyKHBydCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY2RwLWRvYy50cyIsImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbi8vIGltcG9ydCB7IGV4ZWNDb21tYW5kIH0gZnJvbSBcIi4vdG9vbHNcIjtcbmNvbnN0IG9wbiA9IHJlcXVpcmUoXCJvcG5cIik7XG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgKiBhcyBodHRwIGZyb20gXCJodHRwXCI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm9kZS5qc+OBrnNlcnZlci5vbignZXJyb3InKeOCkuS9v+OBhuOBn+OCgeOBq+OCpOODs+ODneODvOODiFxuaW1wb3J0ICogYXMgdXJsIGZyb20gXCJ1cmxcIjtcbmxldCBob3N0TmFtZSA9IFwiaHR0cDovL2xvY2FsaG9zdDpcIjtcbmNvbnN0IERFRkFVTFRfUE9SVCA9IDgwODA7XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXVuY2hCcm93c2VyKHBydDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbGV0IHBydE51bWJlciA9IE51bWJlci5wYXJzZUludChwcnQpO1xuICAgIHBydE51bWJlciA9IHBydE51bWJlciB8fCBERUZBVUxUX1BPUlQ7XG4gICAgaG9zdE5hbWUgKz0gU3RyaW5nKHBydE51bWJlcik7XG4gICAgY29uc3QgaG9zdFVybCA9IHVybC5wYXJzZShob3N0TmFtZSwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9wbihob3N0VXJsLmhyZWYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF1bmNoTG9jYWxTZXJ2ZXIocHJ0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBhcHAgPSBleHByZXNzKCk7XG4gICAgICAgIGNvbnN0IGh0bWxSb290ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcInJvb3RcIik7XG4gICAgICAgIGFwcC51c2UoZXhwcmVzcy5zdGF0aWMoaHRtbFJvb3QpKTtcblxuICAgICAgICBsZXQgcHJ0TnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KHBydCk7XG4gICAgICAgIHBydE51bWJlciA9IHBydE51bWJlciB8fCBERUZBVUxUX1BPUlQ7XG5cbiAgICAgICAgY29uc3Qgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwKTtcblxuICAgICAgICBzZXJ2ZXIub24oXCJlcnJvclwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JfanNvbl9zdHJpbmcgPSBKU09OLnN0cmluZ2lmeShlKTsgICAgICAgICAgICAgIC8vIOS+i+WkluOBruWGheWuueOCkiBKU09OIOaWh+Wtl+WIl++8iEpTT07lhajkvZPjgYzjgrPjg7zjg4bjg7zjgrfjg6fjg7Pjgaflm7Ljgb7jgozjgabjgYTjgovvvInjgaflj5blvpdcbiAgICAgICAgICAgIGNvbnN0IGVycm9yX2pzX29iamVjdCA9IEpTT04ucGFyc2UoZXJyb3JfanNvbl9zdHJpbmcpOyAgICAvLyBKU09O5paH5a2X5YiX44KSIEphdmFTY3JpcHTjgqrjg5bjgrjjgqfjgq/jg4jjgavlpInmj5tcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVycm9yX2pzX29iamVjdCk7ICAgICAgIC8vIHsgY29kZTogJ0VBRERSSU5VU0UnLCBlcnJubzogJ0VBRERSSU5VU0UnLCAuLi4gLCBwb3J0OiA4MDgwIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVycm9yX2pzX29iamVjdC5lcnJubyk7IC8vIFwiRUFERFJJTlVTRVwiXG5cbiAgICAgICAgICAgIGlmKGVycm9yX2pzX29iamVjdC5lcnJubyA9PT0gXCJFQUREUklOVVNFXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIidFQUREUklOVVNFJyBlcnJvciBoYXBwZW5lZCFcIik7ICAgICAvLyBkZWJ1ZyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gZXJyb3IgZXhjZXB0ICdFQUREUklOVVNFIChkZWZhdWx0IHByb3QgdXNlZCknIGhhcHBlbmQhXCIpOyAgLy8gUHJvY2VzcyBvbiBjb21tYW5kIHByb25wdCB3aWxsIHN0b3AuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlcnZlci5saXN0ZW4ocHJ0TnVtYmVyLCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vLi4vc3JjL3V0aWxzL2xvY2FsLXNlcnZlci50cyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9wblwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwib3BuXCIsXCJjb21tb25qczJcIjpcIm9wblwifVxuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiZXhwcmVzc1wiLFwiY29tbW9uanMyXCI6XCJleHByZXNzXCJ9XG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiaHR0cFwiXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmxcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ1cmxcIlxuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJvc1wiXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY2hpbGRfcHJvY2Vzc1wiXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbGktc3Bpbm5lclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJjb21tb25qc1wiOlwiY2xpLXNwaW5uZXJcIixcImNvbW1vbmpzMlwiOlwiY2xpLXNwaW5uZXJcIn1cbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndoaWNoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcImNvbW1vbmpzXCI6XCJ3aGljaFwiLFwiY29tbW9uanMyXCI6XCJ3aGljaFwifVxuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZGVlcC1leHRlbmRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wiY29tbW9uanNcIjpcImRlZXAtZXh0ZW5kXCIsXCJjb21tb25qczJcIjpcImRlZXAtZXh0ZW5kXCJ9XG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXX0=
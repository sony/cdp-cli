import * as path from "path";
import * as commander from "commander";
import { Utils } from "cdp-lib";

const fs    = Utils.fs;
const chalk = Utils.chalk;

/**
 * @interface ICommandLineOptions
 * @brief     コマンドライン用オプションインターフェイス
 */
export interface ICommandLineOptions {
    force: boolean;     // エラー継続用
    targetDir: string;  // 作業ディレクトリ指定
    config: string;     // コンフィグファイル指定
    verbose: boolean;   // 詳細ログ
    silent: boolean;    // silent mode
    minify: boolean;    // minify support
}

/**
 * @interface ICommandLineInfo
 * @brief     コマンドライン情報格納インターフェイス
 */
export interface ICommandLineInfo {
    pkgDir: string;                     // CLI インストールディレクトリ
    action: string;                     // アクション定数
    target: string;                     // コマンドターゲット
    installedDir: string;               // CLI インストール
    cliOptions: ICommandLineOptions;    // コマンドラインで渡されたオプション
}

//___________________________________________________________________________________________________________________//

/**
 * @class CommandParser
 * @brief コマンドラインパーサー
 */
export class CommandParser {

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    /**
     * コマンドラインのパース
     *
     * @param  {String} argv       引数を指定
     * @param  {Object} [options]  オプションを指定
     * @returns {ICommandLineInfo}
     */
    public static parse(argv: string[], options?: any): ICommandLineInfo {
        const cmdline = <ICommandLineInfo>{
            pkgDir: this.getPackageDirectory(argv),
        };

        let pkg: any;

        try {
            pkg = JSON.parse(fs.readFileSync(path.join(cmdline.pkgDir, "package.json"), "utf8").toString());
        } catch (error) {
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
        ;

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
            .action((target: string) => {
                if (/^(module|app|library|mobile|desktop|web)$/i.test(target)) {
                    cmdline.action = "create";
                    cmdline.target = target;
                    if ("module" === cmdline.target) {
                        cmdline.target = "library";
                    } else if ("app" === cmdline.target) {
                        cmdline.target = "mobile";
                    }
                } else {
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
    private static getPackageDirectory(argv: string[]): string {
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
    private static toCommandLineOptions(command: any): ICommandLineOptions {
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
    private static showHelp(): void {
        const inform = (text: string) => {
            return chalk.green(text);
        };
        commander.outputHelp(<any>inform);
        process.exit(1);
    }
}

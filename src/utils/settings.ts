import "./tools";
import { deepExtend } from "./index";

/**
 * @interface IGlobalSettings
 * @brief グローバル設定インターフェイス
 */
export interface IGlobalSettings {
    force?: boolean;            // エラー継続用
    verbose?: boolean;          // 詳細ログ
    silent?: boolean;           // silent mode
    targetDir?: string;         // 作業ディレクトリ
    lang?: "en-US" | "ja-JP";
}

let _settings: IGlobalSettings = {
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
export function getSettings(): IGlobalSettings {
    return deepExtend({}, _settings);
}

/**
 * 設定指定
 *
 * @param options ログに使用するオプション
 */
export function setSettings(settings: IGlobalSettings): void {
    if (settings) {
        _settings.force     = settings.force        || _settings.force;
        _settings.verbose   = settings.verbose      || _settings.verbose;
        _settings.silent    = settings.silent       || _settings.silent;
        _settings.targetDir = settings.targetDir    || _settings.targetDir;
        _settings.lang      = settings.lang         || _settings.lang;
    } else {
        _settings = {
            force: false,
            verbose: false,
            silent: false,
            lang: "en-US",
        };
    }
}

/**
 * ログ出力
 * console.log() と同等
 *
 * @param message        出力メッセージ
 * @param optionalParams 付加情報
 */
export function log(message?: string, ...optionalParams: any[]): void {
    if (!_settings.silent) {
        if (0 < optionalParams.length) {
            console.log(message, optionalParams);
        } else {
            console.log(message);
        }
    }
}

/**
 * 詳細ログ出力
 * console.debug() と同等
 *
 * @param message        出力メッセージ
 * @param optionalParams 付加情報
 */
export function debug(message?: string, ...optionalParams: any[]): void {
    if (!_settings.silent && _settings.verbose) {
        if (0 < optionalParams.length) {
            console.error("DEBUG: " + message, optionalParams);
        } else {
            console.error("DEBUG: " + message);
        }
    }
}

/**
 * 検証
 * console.assert() と同等
 *
 * @param test           検証する式
 * @param message        出力メッセージ
 * @param optionalParams 付加情報
 */
export function assert(test?: boolean, message?: string, ...optionalParams: any[]): void {
    if (!test) {
        if (_settings.force) {
            if (0 < optionalParams.length) {
                console.warn(message, optionalParams);
            } else {
                console.warn(message);
            }
        } else {
            if (0 < optionalParams.length) {
                console.error(message, optionalParams);
            } else {
                console.error(message);
            }
            process.exit(1);
        }
    }
}


import {
    ILibraryConfigration,
    IMobileAppConfigration,
    IDesktopAppConfigration,
    IWebAppConfigration,
} from "cdp-lib";

/**
 * ブラウザ環境で動作するライブラリの既定値
 */
const libraryOnBrowser = <ILibraryConfigration>{
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
const libraryOnNode = <ILibraryConfigration>{
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
const libraryOnElectron = <ILibraryConfigration>{
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
const mobileOnBrowser: IMobileAppConfigration = <any>{
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
        },
        "hammerjs": {
            acquisition: "npm",
            regular: true,
            subset: {
                "jquery-hammerjs": {
                    acquisition: "npm",
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
            subset: {
                "cdp-nativebridge": {
                    acquisition: "resource",
                    regular: true,
                },
            },
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
const desktopOnBrowser = <IDesktopAppConfigration>{
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
const desktopOnElectron = <IDesktopAppConfigration>{
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
const webOnBrowser = <IWebAppConfigration>{
    // IProjectConfigration
    projectType: "web",
    // IBuildTargetConfigration
    es: "es5",
    module: "amd",
    env: "web",
    supportCSS: true,
};

//___________________________________________________________________________________________________________________//

export default {
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

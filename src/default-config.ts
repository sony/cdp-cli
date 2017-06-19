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
            subset: {
                "cdp-nativebridge": {
                    acquisition: "resource",
                    alias: "cdp.nativebridge",
                    venderName: "cdp",
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
const desktopOnBrowser = <IDesktopAppConfigration>{
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
const desktopOnElectron = <IDesktopAppConfigration>{
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
const webOnBrowser = <IWebAppConfigration>{
    // IProjectConfigration
    projectType: "web",
    // IBuildTargetConfigration
    es: "es5",
    module: "amd",
    env: "web",
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

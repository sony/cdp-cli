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
    projectKind: "library",
    // ICompileConfigration
    tsTranspileTarget: "es5",
    moduleSystem: "umd",
    webpackTarget: "web",
    supportCSS: false,
};

/**
 * Node.js 環境で動作するライブラリの既定値
 */
const libraryOnNode = <ILibraryConfigration>{
    // IProjectConfigration
    projectKind: "library",
    // ICompileConfigration
    tsTranspileTarget: "es2015",
    moduleSystem: "commonjs",
    webpackTarget: "node",
    supportCSS: false,
};

/**
 * electron 環境で動作するライブラリの既定値
 */
const libraryOnElectron = <ILibraryConfigration>{
    // IProjectConfigration
    projectKind: "library",
    // ICompileConfigration
    tsTranspileTarget: "es2015",
    moduleSystem: "commonjs",
    webpackTarget: "electron",
    supportCSS: false,
};

/**
 * ブラウザ(cordova)環境で動作するモバイルアプリケーションの既定値
 */
const mobileOnBrowser = <IMobileAppConfigration>{
    // IProjectConfigration
    projectKind: "mobile",
    // ICompileConfigration
    tsTranspileTarget: "es5",
    moduleSystem: "amd",
    webpackTarget: "web",
    supportCSS: true,
};

/**
 * ブラウザ環境で動作するデスクトップアプリケーションの既定値
 */
const desktopOnBrowser = <IDesktopAppConfigration>{
    // IProjectConfigration
    projectKind: "desktop",
    // ICompileConfigration
    tsTranspileTarget: "es5",
    moduleSystem: "amd",
    webpackTarget: "web",
    supportCSS: true,
};

/**
 *  electron 環境で動作するデスクトップアプリケーションの既定値
 */
const desktopOnElectron = <IDesktopAppConfigration>{
    // IProjectConfigration
    projectKind: "desktop",
    // ICompileConfigration
    tsTranspileTarget: "es2015",
    moduleSystem: "commonjs",
    webpackTarget: "electron-renderer",
    supportCSS: true,
};

/**
 * ブラウザ環境で動作するウェブアプリケーションの既定値
 */
const webOnBrowser = <IWebAppConfigration>{
    // IProjectConfigration
    projectKind: "web",
    // ICompileConfigration
    tsTranspileTarget: "es5",
    moduleSystem: "amd",
    webpackTarget: "web",
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

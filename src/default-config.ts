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
    tools: ["webpack"],
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
    tools: ["webpack"],
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
    tools: ["webpack"],
    supportCSS: false,
};

/**
 * ブラウザ(cordova)環境で動作するモバイルアプリケーションの既定値
 */
const mobileOnBrowser = <IMobileAppConfigration>{
    // IProjectConfigration
    projectType: "mobile",
    // IBuildTargetConfigration
    es: "es5",
    module: "amd",
    env: "web",
    supportCSS: true,
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
    tools: ["webpack"],
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

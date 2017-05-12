import * as fs from "fs-extra";
import * as path from "path";
import * as inquirer from "inquirer";
import { Utils } from "cdp-lib";
import { PromptLibrary } from "../../built/prompt-library";
import defaultConfig from "../../built/default-config";

const instance = new PromptLibrary();
const libConfig = defaultConfig.library;
const $ = Utils.$;

function loadResouce(locale: string): void {
    (<any>instance)._locale = JSON.parse(fs.readFileSync(
        path.join(process.cwd(), "res/locales/messages." + locale + ".json"), "utf8").toString()
    );
}

function unloadResouce(): void {
    (<any>instance)._locale = {};
}

describe("prompt-library check", () => {
    afterEach(() => {
        unloadResouce();
    });

    it("library resource check: ja-JP", () => {
        loadResouce("ja-JP");
        const lang = (<any>instance).lang;
        expect(lang).not.toBeNull();
        // prompt strings
        expect("string" === typeof lang.prompt.common.projectName.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.version.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.version.invalidMessage).toBeTruthy();
        expect("string" === typeof lang.prompt.common.license.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.license.choices.apache2).toBeTruthy();
        expect("string" === typeof lang.prompt.common.license.choices.mit).toBeTruthy();
        expect("string" === typeof lang.prompt.common.license.choices.proprietary).toBeTruthy();
        expect("string" === typeof lang.prompt.library.webpackTarget.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.webpackTarget.choices.browser).toBeTruthy();
        expect("string" === typeof lang.prompt.common.webpackTarget.choices.node).toBeTruthy();
        expect("string" === typeof lang.prompt.common.webpackTarget.choices.electron).toBeTruthy();
        expect("string" === typeof lang.prompt.common.webpackTarget.choices.electronRenderer).toBeTruthy();
        expect("string" === typeof lang.prompt.common.extraSettings.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.extraSettings.choices.recommended).toBeTruthy();
        expect("string" === typeof lang.prompt.common.extraSettings.choices.custom).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.choices.none).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.choices.commonjs).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.choices.amd).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.choices.umd).toBeTruthy();
        expect("string" === typeof lang.prompt.common.tsTranspileTarget.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.tsTranspileTarget.choices.es5).toBeTruthy();
        expect("string" === typeof lang.prompt.common.tsTranspileTarget.choices.es2015).toBeTruthy();
        expect("string" === typeof lang.prompt.library.supportCSS.message).toBeTruthy();

        //// setting strings
        expect("string" === typeof lang.settings.extraSettings.label).toBeTruthy();
        expect("string" === typeof lang.settings.extraSettings.props.recommended).toBeTruthy();
        expect("string" === typeof lang.settings.extraSettings.props.custom).toBeTruthy();
        expect("string" === typeof lang.settings.projectName.label).toBeTruthy();
        expect("string" === typeof lang.settings.version.label).toBeTruthy();
        expect("string" === typeof lang.settings.license.label).toBeTruthy();
        expect("string" === typeof lang.settings.license.props["Apache-2.0"]).toBeTruthy();
        expect("string" === typeof lang.settings.license.props.MIT).toBeTruthy();
        expect("string" === typeof lang.settings.license.props.NONE).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.label).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.props.web).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.props.node).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.props.electron).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.props["electron-renderer"]).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.label).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.props.none).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.props.commonjs).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.props.amd).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.props.umd).toBeTruthy();
        expect("string" === typeof lang.settings.tsTranspileTarget.label).toBeTruthy();
        expect("string" === typeof lang.settings.tsTranspileTarget.props.es5).toBeTruthy();
        expect("string" === typeof lang.settings.tsTranspileTarget.props.es2015).toBeTruthy();
        expect("string" === typeof lang.settings.supportCSS.label).toBeTruthy();
        expect("string" === typeof lang.settings.supportCSS.bool.yes).toBeTruthy();
        expect("string" === typeof lang.settings.supportCSS.bool.no).toBeTruthy();
    });

    it("library resource check: en-US", () => {
        loadResouce("en-US");
        const lang = (<any>instance).lang;
        expect(lang).not.toBeNull();
        // prompt strings
        expect("string" === typeof lang.prompt.common.projectName.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.version.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.version.invalidMessage).toBeTruthy();
        expect("string" === typeof lang.prompt.common.license.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.license.choices.apache2).toBeTruthy();
        expect("string" === typeof lang.prompt.common.license.choices.mit).toBeTruthy();
        expect("string" === typeof lang.prompt.common.license.choices.proprietary).toBeTruthy();
        expect("string" === typeof lang.prompt.library.webpackTarget.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.webpackTarget.choices.browser).toBeTruthy();
        expect("string" === typeof lang.prompt.common.webpackTarget.choices.node).toBeTruthy();
        expect("string" === typeof lang.prompt.common.webpackTarget.choices.electron).toBeTruthy();
        expect("string" === typeof lang.prompt.common.webpackTarget.choices.electronRenderer).toBeTruthy();
        expect("string" === typeof lang.prompt.common.extraSettings.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.extraSettings.choices.recommended).toBeTruthy();
        expect("string" === typeof lang.prompt.common.extraSettings.choices.custom).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.choices.none).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.choices.commonjs).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.choices.amd).toBeTruthy();
        expect("string" === typeof lang.prompt.common.moduleSystem.choices.umd).toBeTruthy();
        expect("string" === typeof lang.prompt.common.tsTranspileTarget.message).toBeTruthy();
        expect("string" === typeof lang.prompt.common.tsTranspileTarget.choices.es5).toBeTruthy();
        expect("string" === typeof lang.prompt.common.tsTranspileTarget.choices.es2015).toBeTruthy();
        expect("string" === typeof lang.prompt.library.supportCSS.message).toBeTruthy();

        //// setting strings
        expect("string" === typeof lang.settings.extraSettings.label).toBeTruthy();
        expect("string" === typeof lang.settings.extraSettings.props.recommended).toBeTruthy();
        expect("string" === typeof lang.settings.extraSettings.props.custom).toBeTruthy();
        expect("string" === typeof lang.settings.projectName.label).toBeTruthy();
        expect("string" === typeof lang.settings.version.label).toBeTruthy();
        expect("string" === typeof lang.settings.license.label).toBeTruthy();
        expect("string" === typeof lang.settings.license.props["Apache-2.0"]).toBeTruthy();
        expect("string" === typeof lang.settings.license.props.MIT).toBeTruthy();
        expect("string" === typeof lang.settings.license.props.NONE).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.label).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.props.web).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.props.node).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.props.electron).toBeTruthy();
        expect("string" === typeof lang.settings.webpackTarget.props["electron-renderer"]).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.label).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.props.none).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.props.commonjs).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.props.amd).toBeTruthy();
        expect("string" === typeof lang.settings.moduleSystem.props.umd).toBeTruthy();
        expect("string" === typeof lang.settings.tsTranspileTarget.label).toBeTruthy();
        expect("string" === typeof lang.settings.tsTranspileTarget.props.es5).toBeTruthy();
        expect("string" === typeof lang.settings.tsTranspileTarget.props.es2015).toBeTruthy();
        expect("string" === typeof lang.settings.supportCSS.label).toBeTruthy();
        expect("string" === typeof lang.settings.supportCSS.bool.yes).toBeTruthy();
        expect("string" === typeof lang.settings.supportCSS.bool.no).toBeTruthy();
    });

    it("questioin check", () => {
        loadResouce("ja-JP");
        const questions = <inquirer.Question[]>instance.questions;
        expect(questions.length).toEqual(10);

        // property check
        expect(questions[0].name).toEqual("projectName");
        expect(questions[1].name).toEqual("version");
        expect(questions[2].name).toEqual("license");
        expect(questions[3].name).toEqual("webpackTarget");
        expect(questions[4].name).toEqual("extraSettings");
        expect(questions[5].name).toEqual("moduleSystem");
        expect(questions[6].name).toEqual("moduleSystem");
        expect(questions[7].name).toEqual("moduleSystem");
        expect(questions[8].name).toEqual("tsTranspileTarget");
        expect(questions[9].name).toEqual("supportCSS");

        // semver check
        const version = questions.find((elem) => {
            return "version" === elem.name;
        });
        expect(version).not.toBeUndefined();
        expect(version.validate("1.0.0")).toBeTruthy();
        expect(version.validate("v1.0.0")).toBeTruthy();
        expect(version.validate("1.0.0-alpha")).toBeTruthy();
        expect(version.validate("v1.0.0beta")).toBeTruthy();
        expect("string" === typeof version.validate("a1.0.0")).toBeTruthy();
        expect("string" === typeof version.validate("1.0")).toBeTruthy();
        expect("string" === typeof version.validate("1.0a.0")).toBeTruthy();
        expect("string" === typeof version.validate("1.0.a")).toBeTruthy();
        expect("string" === typeof version.validate("hoge")).toBeTruthy();
        expect(version.filter("1.0.0")).toBe("1.0.0");
        expect(version.filter("1.0.0 hoge")).toBe("1.0.0");
        expect(version.filter("v1.0.0")).toBe("v1.0.0");
        expect(version.filter("v1.0.0 hoge")).toBe("v1.0.0");
        expect(version.filter("hoge")).toBe("hoge");

        // webpackTarget check
        const webpackTarget = questions.find((elem) => {
            return "webpackTarget" === elem.name;
        });
        expect(webpackTarget).not.toBeUndefined();
        expect(webpackTarget.filter("electron")).toBe("node");
        expect(webpackTarget.filter("electron-renderer")).toBe("web");
        expect(webpackTarget.filter("web")).toBe("web");
        expect(webpackTarget.filter("node")).toBe("node");
        if (false === libConfig.ELECTRON_AVAILABLE) {
            libConfig.ELECTRON_AVAILABLE = true;
            expect(webpackTarget.filter("electron")).toBe("electron");
            libConfig.ELECTRON_AVAILABLE = false;
        }

        // moduleSystem when check
        const moduleSystems = questions.filter((elem) => {
            return "moduleSystem" === elem.name;
        });
        expect(moduleSystems.length).toBe(3);

        const msNodeElectron = moduleSystems[0];
        expect((<any>msNodeElectron).when({
            extraSettings: "custom",
            webpackTarget: "node",
        })).toBeTruthy();
        expect((<any>msNodeElectron).when({
            extraSettings: "custom",
            webpackTarget: "electron",
        })).toBeTruthy();
        expect((<any>msNodeElectron).when({
            extraSettings: "custom",
            webpackTarget: "web",
        })).toBeFalsy();
        expect((<any>msNodeElectron).when({
            extraSettings: "custom",
            webpackTarget: "electron-renderer",
        })).toBeFalsy();
        expect((<any>msNodeElectron).when({
            extraSettings: "recommended",
        })).toBeFalsy();

        const msWeb = moduleSystems[1];
        expect((<any>msWeb).when({
            extraSettings: "custom",
            webpackTarget: "web",
        })).toBeTruthy();
        expect((<any>msWeb).when({
            extraSettings: "custom",
            webpackTarget: "node",
        })).toBeFalsy();
        expect((<any>msWeb).when({
            extraSettings: "custom",
            webpackTarget: "electron",
        })).toBeFalsy();
        expect((<any>msWeb).when({
            extraSettings: "custom",
            webpackTarget: "electron-renderer",
        })).toBeFalsy();
        expect((<any>msWeb).when({
            extraSettings: "recommended",
        })).toBeFalsy();

        const msElectronRenderer = moduleSystems[2];
        expect((<any>msElectronRenderer).when({
            extraSettings: "custom",
            webpackTarget: "electron-renderer",
        })).toBeTruthy();
        expect((<any>msElectronRenderer).when({
            extraSettings: "custom",
            webpackTarget: "web",
        })).toBeFalsy();
        expect((<any>msElectronRenderer).when({
            extraSettings: "custom",
            webpackTarget: "node",
        })).toBeFalsy();
        expect((<any>msElectronRenderer).when({
            extraSettings: "custom",
            webpackTarget: "electron",
        })).toBeFalsy();
        expect((<any>msElectronRenderer).when({
            extraSettings: "recommended",
        })).toBeFalsy();

        // tsTranspileTarget  when check
        const tsTranspileTarget  = questions.find((elem) => {
            return "tsTranspileTarget" === elem.name;
        });
        expect(tsTranspileTarget).not.toBeUndefined();
        expect((<any>tsTranspileTarget).when({
            extraSettings: "custom",
        })).toBeTruthy();
        expect((<any>tsTranspileTarget).when({
            extraSettings: "recommended",
        })).toBeFalsy();

        // supportCSS  when check
        const supportCSS = questions.find((elem) => {
            return "supportCSS" === elem.name;
        });
        expect(supportCSS).not.toBeUndefined();
        expect((<any>supportCSS).when({
            extraSettings: "custom",
        })).toBeTruthy();
        expect((<any>supportCSS).when({
            extraSettings: "recommended",
        })).toBeFalsy();
    });

    it("displaySettingsByAnswers check", () => {
        loadResouce("ja-JP");
        spyOn(console, "log").and.stub();
        spyOn(console, "error").and.stub();
        spyOn(process, "exit").and.callFake((value: number) => {
            expect(value).toEqual(1);
        });

        let compared: any;
        expect(instance.displaySettingsByAnswers(<any>{
            webpackTarget: "hoge",
        })).toBeUndefined();
        expect(instance.displaySettingsByAnswers(<any>{
            webpackTarget: "web",
        })).toEqual(libConfig.browser);
        compared = $.extend({}, libConfig.node, { extraSettings: "recommended" });
        expect(instance.displaySettingsByAnswers(<any>{
            webpackTarget: "node",
            extraSettings: "recommended",
        })).toEqual(compared);
        expect(instance.displaySettingsByAnswers(<any>{
            webpackTarget: "electron",
        })).toEqual(libConfig.electron);
        compared = $.extend({}, libConfig.electron, { webpackTarget: "electron-renderer" });
        expect(instance.displaySettingsByAnswers(<any>{
            webpackTarget: "electron-renderer",
        })).toEqual(compared);
    });
});

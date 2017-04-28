import * as fs from "fs-extra";
import * as path from "path";
import * as inquirer from "inquirer";
import { Utils } from "cdp-lib";
import { PromptBase } from "../../built/prompt-base";
import { PromptLibrary } from "../../built/prompt-library";
import defaultConfig from "../../built/default-config";

const instance: PromptBase = new PromptLibrary();
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

describe("prompt-base check", () => {
    let value: any;

    afterEach(() => {
        unloadResouce();
    });

    beforeEach((done) => {
        loadResouce("ja-JP");
        const lang = (<any>instance).lang;

        spyOn(console, "log").and.stub();
        spyOn(<any>instance, "inquireLanguage").and.callFake(() => {
            return new Promise((resolve, reject) => {
                resolve();
            });
        });
        spyOn(<any>instance, "inquire").and.callFake(() => {
            return new Promise((resolve, reject) => {
                resolve(libConfig);
            });
        });

        instance.prompting(null)
            .then((config) => {
                value = config;
                done();
            });
    });

    it("check", () => {
        expect(value).toEqual(libConfig);
    });
});

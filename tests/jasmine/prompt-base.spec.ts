import * as path from "path";
import * as inquirer from "inquirer";
import { Utils } from "cdp-lib";
import { PromptBase } from "../../built/prompt-base";
import { PromptLibrary } from "../../built/prompt-library";
import defaultConfig from "../../built/default-config";

const libConfig = defaultConfig.library;
const $     = Utils.$;
const fs    = Utils.fs;

function loadResouce(instance: any, locale: string): void {
    instance._locale = JSON.parse(fs.readFileSync(
        path.join(process.cwd(), "res/locales/messages." + locale + ".json"), "utf8").toString()
    );
}

function unloadResouce(instance: any): void {
    instance._locale = {};
}

describe("prompt-base check", () => {
    describe("prompting check", () => {
        let value: any;

        beforeEach((done) => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            const lang = instance.lang;

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

    it("prompting reject check", (done) => {
        let instance: any = new PromptLibrary();
        loadResouce(instance, "ja-JP");
        const lang = instance.lang;

        spyOn(console, "log").and.stub();
        spyOn(<any>instance, "inquireLanguage").and.callFake(() => {
            return new Promise((resolve, reject) => {
                reject("for TEST case");
            });
        });

        instance.prompting(null)
            .catch((reason) => {
                expect(reason).toEqual("for TEST case");
                done();
            });
    });

    it("updateAnswers check", () => {
        let instance: any = new PromptLibrary();
        let answers = instance._answers;
        expect(answers).toEqual({});
        answers = instance.updateAnswers({ test1: "hoge" });
        expect(answers.test1).toEqual("hoge");
        answers = instance.updateAnswers({ test2: "fuga" });
        expect(answers.test1).toEqual("hoge");
        expect(answers.test2).toEqual("fuga");
    });

    describe("inquireSettings check", () => {
        it("inquireSettings resolve check", (done) => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve({
                        baseStructure: "recommended",
                    });
                });
            });

            instance.inquireSettings()
                .then((answers) => {
                    expect(answers.baseStructure).toEqual("recommended");
                    done();
                });
        });
        it("inquireSettings reject check", (done) => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    reject("for TEST case");
                });
            });

            instance.inquireSettings()
                .catch((reason) => {
                    expect(reason).toEqual("for TEST case");
                    done();
                });
        });
    });

    describe("config2description check", () => {
        it("config2description error check", () => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            spyOn(console, "error").and.stub();
            spyOn(process, "exit").and.callFake((value: number) => {
                expect(value).toEqual(1);
            }).and.throwError("for TEST break");

            try {
                (<any>instance).config2description(null, "hoge");
            } catch (error) {
                expect(error.message).toEqual("for TEST break");
            }
        });
    });

    describe("loadLanguage check", () => {
        it("loadLanguage coverage", () => {
            let instance: any = new PromptLibrary();
            instance._cmdInfo = {
                pkgDir: "temp"
            };

            spyOn(fs, "readFileSync").and.callFake((value: string) => {
                return "{ \"type\": \"en\"}";
            });
            instance.loadLanguage(null);
            expect(instance.lang.type).toEqual("en");
        });
    });

    describe("inquireLanguage check", () => {
        it("inquireLanguage resolve check", (done) => {
            let instance: any = new PromptLibrary();
            instance._cmdInfo = {
                pkgDir: "temp"
            };

            spyOn(fs, "readFileSync").and.callFake((value: string) => {
                expect(value).toEqual(path.join("temp", "res/locales/messages.en-US.json"));
                return "{ \"type\": \"en\"}";
            });

            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve({
                        language: "en-US",
                    });
                });
            });

            instance.inquireLanguage()
                .then((answer) => {
                    expect(instance.lang.type).toEqual("en");
                    done();
                });

        });

        it("inquireLanguage reject check", (done) => {
            let instance: any = new PromptLibrary();
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    reject("for TEST case");
                });
            });

            (<any>instance).inquireLanguage()
                .catch((reason) => {
                    expect(reason).toEqual("for TEST case");
                    done();
                });
        });
    });

    describe("confirmSettings check", () => {
        it("confirmSettings resolve true", (done) => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            spyOn(console, "log").and.stub();
            spyOn(instance, "displaySettingsByAnswers").and.callFake(() => {
                return {
                    test: "OK"
                }
            });
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve({
                        confirmation: true,
                    });
                });
            });

            (<any>instance).confirmSettings()
                .then((settings) => {
                    expect(settings.test).toEqual("OK");
                    done();
                });

        });

        it("confirmSettings resolve false", (done) => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            spyOn(console, "log").and.stub();
            spyOn(instance, "displaySettingsByAnswers").and.stub();
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve({
                        confirmation: false,
                    });
                });
            });

            instance.confirmSettings()
                .catch((reason) => {
                    expect(reason).toBeUndefined();
                    done();
                });

        });

        it("confirmSettings reject check", (done) => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            spyOn(console, "log").and.stub();
            spyOn(instance, "displaySettingsByAnswers").and.stub();
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    reject("for TEST case");
                });
            });

            instance.confirmSettings()
                .catch((reason) => {
                    expect(reason).toEqual("for TEST case");
                    done();
                });
        });
    });

    describe("inquire check", () => {
        // jasmine 2.0 に指定可能な timeout 値は 32bit
        // http://stackoverflow.com/questions/32336575/infinite-jasmine-timeout
        let DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        const MAX_SAFE_TIMEOUT_INTERVAL = Math.pow(2, 31) - 1;
        beforeEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT_INTERVAL;
        });
        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
        });

        it("inquire resolve coverage", (done) => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            instance._cmdInfo = {
                pkgDir: "temp",
                cliOptions: {}
            };
            let times = 0;
            spyOn(instance, "inquireSettings").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
            spyOn(instance, "updateAnswers").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
            spyOn(instance, "confirmSettings").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    if (times < 2) {
                        times++;
                        reject();
                    } else {
                        resolve({
                            test: true,
                        });
                    }
                });
            });

            instance.inquire()
                .then((settings) => {
                    expect(settings.test).toBeTruthy();
                    done();
                });
        });

        it("inquire reject coverage", (done) => {
            let instance: any = new PromptLibrary();
            loadResouce(instance, "ja-JP");
            spyOn(console, "log").and.stub();
            spyOn(instance, "inquireSettings").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    reject("for TEST case");
                });
            });

            instance.inquire()
                .catch((reason) => {
                    expect(reason).toEqual("for TEST case");
                    done();
                });
        });
    });
});

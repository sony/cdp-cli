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
    afterEach(() => {
        unloadResouce();
    });

    describe("prompting check", () => {
        let value: any;

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

    it("prompting reject check", (done) => {
        loadResouce("ja-JP");
        const lang = (<any>instance).lang;

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
        const instance: PromptBase = new PromptLibrary();
        let answers = (<any>instance)._answers;
        expect(answers).toEqual({});
        answers = (<any>instance).updateAnswers({ test1: "hoge" });
        expect(answers.test1).toEqual("hoge");
        answers = (<any>instance).updateAnswers({ test2: "fuga" });
        expect(answers.test1).toEqual("hoge");
        expect(answers.test2).toEqual("fuga");
    });

    describe("inquireSettings check", () => {
        beforeEach(() => {
            loadResouce("ja-JP");
        });
        afterEach(() => {
            unloadResouce();
        });
        it("inquireSettings resolve check", (done) => {
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve({
                        baseStructure: "recommended",
                    });
                });
            });

            (<any>instance).inquireSettings()
                .then((answers) => {
                    expect(answers.baseStructure).toEqual("recommended");
                    done();
                });
        });
        it("inquireSettings reject check", (done) => {
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    reject("for TEST case");
                });
            });

            (<any>instance).inquireSettings()
                .catch((reason) => {
                    expect(reason).toEqual("for TEST case");
                    done();
                });
        });
    });

    describe("config2description check", () => {
        beforeEach(() => {
            loadResouce("ja-JP");
        });
        afterEach(() => {
            unloadResouce();
        });
        it("config2description error check", () => {
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
            const instance: PromptBase = new PromptLibrary();
            (<any>instance)._cmdInfo = {
                pkgDir: "temp"
            };

            spyOn(fs, "readFileSync").and.callFake((value: string) => {
                return "{ \"type\": \"en\"}";
            });
            (<any>instance).loadLanguage(null);
            expect((<any>instance).lang.type).toEqual("en");
        });
    });

    describe("inquireLanguage check", () => {
        it("inquireLanguage resolve check", (done) => {
            const instance: PromptBase = new PromptLibrary();
            (<any>instance)._cmdInfo = {
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

            (<any>instance).inquireLanguage()
                .then((answer) => {
                    expect((<any>instance).lang.type).toEqual("en");
                    done();
                });

        });

        it("inquireLanguage reject check", (done) => {
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
        beforeEach(() => {
            loadResouce("ja-JP");
        });
        afterEach(() => {
            unloadResouce();
        });
        it("confirmSettings resolve true", (done) => {
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
            spyOn(console, "log").and.stub();
            spyOn(instance, "displaySettingsByAnswers").and.stub();
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve({
                        confirmation: false,
                    });
                });
            });

            (<any>instance).confirmSettings()
                .catch((reason) => {
                    expect(reason).toBeUndefined();
                    done();
                });

        });

        it("confirmSettings reject check", (done) => {
            spyOn(console, "log").and.stub();
            spyOn(instance, "displaySettingsByAnswers").and.stub();
            spyOn(inquirer, "prompt").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    reject("for TEST case");
                });
            });

            (<any>instance).confirmSettings()
                .catch((reason) => {
                    expect(reason).toEqual("for TEST case");
                    done();
                });
        });
    });

    describe("inquire check", () => {
        beforeEach(() => {
            loadResouce("ja-JP");
        });
        afterEach(() => {
            unloadResouce();
        });

        it("inquire resolve coverage", (done) => {
            let times = 0;
            spyOn((<any>instance), "inquireSettings").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
            spyOn((<any>instance), "updateAnswers").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
            spyOn((<any>instance), "confirmSettings").and.callFake(() => {
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


            (<any>instance).inquire()
                .then((settings) => {
                    expect(settings.test).toBeTruthy();
                    done();
                });

        });

        it("inquire reject coverage", (done) => {
            spyOn(console, "log").and.stub();
            spyOn((<any>instance), "inquireSettings").and.callFake(() => {
                return new Promise((resolve, reject) => {
                    reject("for TEST case");
                });
            });

            (<any>instance).inquire()
                .catch((reason) => {
                    expect(reason).toEqual("for TEST case");
                    done();
                });
        });
    });
});

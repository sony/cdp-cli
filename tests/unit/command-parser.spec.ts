import * as path from "path";
import {
    CommandParser,
} from "../../built/command-parser";

const pkgDir = path.join(process.cwd(), "bin", "cdp");
const argsBase = "node.exe " + pkgDir + " ";

describe("CommandParser check", () => {
    it("command: init", () => {
        const cmd = "init";
        const argv = (argsBase + cmd).split(" ");
        const cmdInfo = CommandParser.parse(argv);
        expect(cmdInfo.action).toEqual("init");
    });
    it("command: init --help", () => {
        const cmd = "init --help";
        const argv = (argsBase + cmd).split(" ");
        spyOn(process, "exit").and.stub();
        spyOn(process.stdout, "write").and.stub();
        spyOn(console, "error").and.stub();
        const cmdInfo = CommandParser.parse(argv);
        expect(cmdInfo.action).toEqual("init");
        expect(process.exit).toHaveBeenCalled();
    });
    it("command: create app", () => {
        const cmd = "create app";
        const argv = (argsBase + cmd).split(" ");
        const cmdInfo = CommandParser.parse(argv);
        expect(cmdInfo.action).toEqual("create");
        expect(cmdInfo.target).toEqual("mobile");
    });
    it("command: create module", () => {
        const cmd = "create module";
        const argv = (argsBase + cmd).split(" ");
        const cmdInfo = CommandParser.parse(argv);
        expect(cmdInfo.action).toEqual("create");
        expect(cmdInfo.target).toEqual("library");
    });
    it("command: create hoge", () => {
        const cmd = "create hoge";
        const argv = (argsBase + cmd).split(" ");
        spyOn(process, "exit").and.stub();
        spyOn(process.stdout, "write").and.stub();
        spyOn(console, "error").and.stub();
        const cmdInfo = CommandParser.parse(argv);
        expect(cmdInfo.action).toBeUndefined();
        expect(cmdInfo.target).toBeUndefined();
    });
    it("command: create --help", () => {
        const cmd = "create --help";
        const argv = (argsBase + cmd).split(" ");
        spyOn(process, "exit").and.stub();
        spyOn(process.stdout, "write").and.stub();
        spyOn(console, "error").and.stub();
        const cmdInfo = CommandParser.parse(argv);
        expect(cmdInfo.action).toBeUndefined();
        expect(cmdInfo.target).toBeUndefined();
        expect(process.exit).toHaveBeenCalled();
    });
    it("command: invalid", () => {
        const cmd = "invalid";
        const argv = (argsBase + cmd).split(" ");
        spyOn(process, "exit").and.stub();
        spyOn(process.stdout, "write").and.stub();
        spyOn(console, "error").and.stub();
        const cmdInfo = CommandParser.parse(argv);
        spyOn<any>(CommandParser, "showHelp").and.stub();
        expect(cmdInfo.action).toBeUndefined();
        expect(cmdInfo.target).toBeUndefined();
        expect(process.exit).toHaveBeenCalled();
    });
    it("command: null", () => {
        let argv = argsBase.split(" ");
        argv.pop();
        spyOn(process, "exit").and.stub();
        spyOn(process.stdout, "write").and.stub();
        spyOn(console, "error").and.stub();
        const cmdInfo = CommandParser.parse(argv);
        expect(cmdInfo.action).toBeUndefined();
        expect(cmdInfo.target).toBeUndefined();
        expect(process.exit).toHaveBeenCalled();
    });
});

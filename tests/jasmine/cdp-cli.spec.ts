import { run } from "../../built/cdp-cli";

describe("cdp-cli check", () => {
    it("cli:run", () => {
        expect(run).toBeDefined();
        expect("function" === typeof run).toBeTruthy();
    });
});

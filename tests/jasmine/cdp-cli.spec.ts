import { CDPLib as CLI } from "../../built/cdp-cli";

describe("cdp-cli check", () => {
    it("cli:", () => {
        expect(CLI.execute).toBeDefined();
        expect("function" === typeof CLI.execute).toBeTruthy();
    });
});

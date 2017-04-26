import { main } from "../../built/cdp-cli";

describe("cdp-cli check", () => {
    it("cli:run", () => {
        expect(main).toBeDefined();
        expect("function" === typeof main).toBeTruthy();
    });
});

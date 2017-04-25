import { CDPLib } from "cdp-lib";

if ("function" === typeof CDPLib.execute) {
    console.log("ok");
}

export { CDPLib };

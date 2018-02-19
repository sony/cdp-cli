import * as path from "path";
// import { execCommand } from "./tools";
const opn = require("opn");
import * as express from "express";
import * as http from "http";                                       // Node.jsのserver.on('error')を使うためにインポート
import * as url from "url";
let hostName = "http://localhost:";
const DEFAULT_PORT = 8080;

export function launchBrowser(prt: string): Promise<void> {
    let prtNumber = Number.parseInt(prt);
    prtNumber = prtNumber || DEFAULT_PORT;
    hostName += String(prtNumber);
    const hostUrl = url.parse(hostName, true);
    return opn(hostUrl.href);
}

export function launchLocalServer(prt: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const app = express();
        const htmlRoot = path.join(__dirname, "..", "root");
        app.use(express.static(htmlRoot));

        let prtNumber = Number.parseInt(prt);
        prtNumber = prtNumber || DEFAULT_PORT;

        const server = http.createServer(app);

        server.on("error", (e) => {
            const error_json_string = JSON.stringify(e);              // 例外の内容を JSON 文字列（JSON全体がコーテーションで囲まれている）で取得
            const error_js_object = JSON.parse(error_json_string);    // JSON文字列を JavaScriptオブジェクトに変換
            // console.log(error_js_object);       // { code: 'EADDRINUSE', errno: 'EADDRINUSE', ... , port: 8080 }
            // console.log(error_js_object.errno); // "EADDRINUSE"

            if(error_js_object.errno === "EADDRINUSE") {
                // console.log("'EADDRINUSE' error happened!");     // debug message
                return reject();
            } else {
                console.log("Unknown error except 'EADDRINUSE (default prot used)' happend!");  // Process on command pronpt will stop.
            }
        });

        server.listen(prtNumber, () => {
            return resolve();
        });
    });
}
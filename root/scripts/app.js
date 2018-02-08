define(["require", "exports", "cdp", "hammerjs", "cdp/framework", "cdp/ui", "hogan", "jquery-hammerjs", "./view/loader"], function (require, exports, cdp_1, Hammer, framework_1, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cdp_1.global["Hammer"] = Hammer;
    var TAG = "[app] ";
    function onStart() {
        // for dev. always show vertical scroll bar.
        ui_1.Theme.detectUIPlatform();
        framework_1.Router.register("", "/templates/top/top.html", true);
        // start Router.
        framework_1.Router.start();
    }
    exports.main = onStart;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL3NjcmlwdHMvYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUtBLFlBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUM7SUFNMUIsSUFBTSxHQUFHLEdBQVcsUUFBUSxDQUFDO0lBRTdCO1FBQ0ksNENBQTRDO1FBQzVDLFVBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXpCLGtCQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSx5QkFBeUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyRCxnQkFBZ0I7UUFDaEIsa0JBQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRW1CLHVCQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiaG9nYW5cIjtcbmltcG9ydCBcImpxdWVyeS1oYW1tZXJqc1wiO1xuaW1wb3J0IHsgZ2xvYmFsIH0gZnJvbSBcImNkcFwiO1xuLyogdHNsaW50OmRpc2FibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cbmltcG9ydCAqIGFzIEhhbW1lciBmcm9tIFwiaGFtbWVyanNcIjtcbmdsb2JhbFtcIkhhbW1lclwiXSA9IEhhbW1lcjtcbi8qIHRzbGludDplbmFibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cbmltcG9ydCB7IFJvdXRlciBhcyByb3V0ZXIgfSBmcm9tIFwiY2RwL2ZyYW1ld29ya1wiO1xuaW1wb3J0IHsgVGhlbWUgfSBmcm9tIFwiY2RwL3VpXCI7XG5pbXBvcnQgXCIuL3ZpZXcvbG9hZGVyXCI7XG5cbmNvbnN0IFRBRzogc3RyaW5nID0gXCJbYXBwXSBcIjtcblxuZnVuY3Rpb24gb25TdGFydCgpOiB2b2lkIHtcbiAgICAvLyBmb3IgZGV2LiBhbHdheXMgc2hvdyB2ZXJ0aWNhbCBzY3JvbGwgYmFyLlxuICAgIFRoZW1lLmRldGVjdFVJUGxhdGZvcm0oKTtcblxuICAgIHJvdXRlci5yZWdpc3RlcihcIlwiLCBcIi90ZW1wbGF0ZXMvdG9wL3RvcC5odG1sXCIsIHRydWUpO1xuICAgIC8vIHN0YXJ0IFJvdXRlci5cbiAgICByb3V0ZXIuc3RhcnQoKTtcbn1cblxuZXhwb3J0IHsgb25TdGFydCBhcyBtYWluIH07XG4iXX0=
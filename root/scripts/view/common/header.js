var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "backbone", "cdp/framework", "cdp/tools/tools"], function (require, exports, Backbone, framework_1, tools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.HeaderView] ";
    var HeaderCategory;
    (function (HeaderCategory) {
        HeaderCategory[HeaderCategory["GETSTARTED"] = 0] = "GETSTARTED";
        HeaderCategory[HeaderCategory["RESOURCES"] = 1] = "RESOURCES";
        HeaderCategory[HeaderCategory["DOCUMENTS"] = 2] = "DOCUMENTS";
        HeaderCategory[HeaderCategory["COMMUNICATION"] = 3] = "COMMUNICATION";
    })(HeaderCategory = exports.HeaderCategory || (exports.HeaderCategory = {}));
    /**
     * @class HeaderView
     * @brief ヘッダーのクラス
     */
    var HeaderView = /** @class */ (function (_super) {
        __extends(HeaderView, _super);
        /**
         * constructor
         */
        function HeaderView(options) {
            return _super.call(this, options) || this;
        }
        /**
         * ヘッダーをレンダリングする
         * @param category [in] ヘッダーのカテゴリー
         */
        HeaderView.prototype.render = function (category) {
            var headerData = {};
            switch (category) {
                case HeaderCategory.GETSTARTED:
                    headerData.getstarted = true;
                    break;
                case HeaderCategory.RESOURCES:
                    headerData.resources = true;
                    break;
                case HeaderCategory.DOCUMENTS:
                    headerData.documents = true;
                    break;
                case HeaderCategory.COMMUNICATION:
                    headerData.communication = true;
                    break;
            }
            var template = tools_1.Template.getJST("#template-common-header", framework_1.toUrl("/templates/common/header.html"));
            var $header = $(template(headerData));
            this.$el.append($header);
            return this;
        };
        return HeaderView;
    }(Backbone.View));
    exports.HeaderView = HeaderView;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9jb21tb24vaGVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFJQSxJQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQztJQUVqQyxJQUFZLGNBS1g7SUFMRCxXQUFZLGNBQWM7UUFDdEIsK0RBQVUsQ0FBQTtRQUNWLDZEQUFTLENBQUE7UUFDVCw2REFBUyxDQUFBO1FBQ1QscUVBQWEsQ0FBQTtJQUNqQixDQUFDLEVBTFcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFLekI7SUFTRDs7O09BR0c7SUFDSDtRQUFnQyw4QkFBNkI7UUFDekQ7O1dBRUc7UUFDSCxvQkFBWSxPQUE4QzttQkFDdEQsa0JBQU0sT0FBTyxDQUFDO1FBQ2xCLENBQUM7UUFFRDs7O1dBR0c7UUFDSCwyQkFBTSxHQUFOLFVBQU8sUUFBeUI7WUFDNUIsSUFBTSxVQUFVLEdBQWUsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsS0FBSyxjQUFjLENBQUMsVUFBVTtvQkFDMUIsVUFBVSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7b0JBQzdCLEtBQUssQ0FBQztnQkFFVixLQUFLLGNBQWMsQ0FBQyxTQUFTO29CQUN6QixVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDNUIsS0FBSyxDQUFDO2dCQUVWLEtBQUssY0FBYyxDQUFDLFNBQVM7b0JBQ3pCLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUM1QixLQUFLLENBQUM7Z0JBRVYsS0FBSyxjQUFjLENBQUMsYUFBYTtvQkFDN0IsVUFBVSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQ2hDLEtBQUssQ0FBQztZQUNkLENBQUM7WUFFRCxJQUFNLFFBQVEsR0FBRyxnQkFBUSxDQUFDLE1BQU0sQ0FDNUIseUJBQXlCLEVBQ3pCLGlCQUFLLENBQUMsK0JBQStCLENBQUMsQ0FDekMsQ0FBQztZQUNGLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV6QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTCxpQkFBQztJQUFELENBQUMsQUF6Q0QsQ0FBZ0MsUUFBUSxDQUFDLElBQUksR0F5QzVDO0lBekNZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQmFja2JvbmUgZnJvbSBcImJhY2tib25lXCI7XG5pbXBvcnQgeyB0b1VybCB9IGZyb20gXCJjZHAvZnJhbWV3b3JrXCI7XG5pbXBvcnQgeyBKU1QsIFRlbXBsYXRlIH0gZnJvbSBcImNkcC90b29scy90b29sc1wiO1xuXG5jb25zdCBUQUcgPSBcIlt2aWV3LkhlYWRlclZpZXddIFwiO1xuXG5leHBvcnQgZW51bSBIZWFkZXJDYXRlZ29yeSB7XG4gICAgR0VUU1RBUlRFRCxcbiAgICBSRVNPVVJDRVMsXG4gICAgRE9DVU1FTlRTLFxuICAgIENPTU1VTklDQVRJT04sXG59XG5cbmludGVyZmFjZSBIZWFkZXJEYXRhIHtcbiAgICBnZXRzdGFydGVkPzogYm9vbGVhbjtcbiAgICByZXNvdXJjZXM/OiBib29sZWFuO1xuICAgIGRvY3VtZW50cz86IGJvb2xlYW47XG4gICAgY29tbXVuaWNhdGlvbj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQGNsYXNzIEhlYWRlclZpZXdcbiAqIEBicmllZiDjg5jjg4Pjg4Djg7zjga7jgq/jg6njgrlcbiAqL1xuZXhwb3J0IGNsYXNzIEhlYWRlclZpZXcgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3PEJhY2tib25lLk1vZGVsPiB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogQmFja2JvbmUuVmlld09wdGlvbnM8QmFja2JvbmUuTW9kZWw+KSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODmOODg+ODgOODvOOCkuODrOODs+ODgOODquODs+OCsOOBmeOCi1xuICAgICAqIEBwYXJhbSBjYXRlZ29yeSBbaW5dIOODmOODg+ODgOODvOOBruOCq+ODhuOCtOODquODvFxuICAgICAqL1xuICAgIHJlbmRlcihjYXRlZ29yeT86IEhlYWRlckNhdGVnb3J5KTogSGVhZGVyVmlldyB7XG4gICAgICAgIGNvbnN0IGhlYWRlckRhdGE6IEhlYWRlckRhdGEgPSB7fTtcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeSkge1xuICAgICAgICAgICAgY2FzZSBIZWFkZXJDYXRlZ29yeS5HRVRTVEFSVEVEOlxuICAgICAgICAgICAgICAgIGhlYWRlckRhdGEuZ2V0c3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgSGVhZGVyQ2F0ZWdvcnkuUkVTT1VSQ0VTOlxuICAgICAgICAgICAgICAgIGhlYWRlckRhdGEucmVzb3VyY2VzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBIZWFkZXJDYXRlZ29yeS5ET0NVTUVOVFM6XG4gICAgICAgICAgICAgICAgaGVhZGVyRGF0YS5kb2N1bWVudHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEhlYWRlckNhdGVnb3J5LkNPTU1VTklDQVRJT046XG4gICAgICAgICAgICAgICAgaGVhZGVyRGF0YS5jb21tdW5pY2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKFxuICAgICAgICAgICAgXCIjdGVtcGxhdGUtY29tbW9uLWhlYWRlclwiLFxuICAgICAgICAgICAgdG9VcmwoXCIvdGVtcGxhdGVzL2NvbW1vbi9oZWFkZXIuaHRtbFwiKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCAkaGVhZGVyID0gJCh0ZW1wbGF0ZShoZWFkZXJEYXRhKSk7XG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZCgkaGVhZGVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iXX0=
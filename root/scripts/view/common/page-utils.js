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
define(["require", "exports", "backbone", "underscore", "cdp/framework", "cdp/tools/tools", "./menu", "./header", "./footer", "../../util/functions", "cdp/framework"], function (require, exports, Backbone, _, framework_1, tools_1, menu_1, header_1, footer_1, functions_1, framework_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageCategory;
    (function (PageCategory) {
        PageCategory[PageCategory["GETSTARTED"] = 0] = "GETSTARTED";
        PageCategory[PageCategory["DOCUMENTS"] = 1] = "DOCUMENTS";
        PageCategory[PageCategory["RESOURCES"] = 2] = "RESOURCES";
        PageCategory[PageCategory["COMMUNICATION"] = 3] = "COMMUNICATION";
    })(PageCategory = exports.PageCategory || (exports.PageCategory = {}));
    var PageUtils = /** @class */ (function (_super) {
        __extends(PageUtils, _super);
        function PageUtils(params) {
            var _this = _super.call(this, params) || this;
            _this._menu = new menu_1.MenuView({
                el: _this.$el.find(".contents-list")
            });
            _this._header = new header_1.HeaderView({
                el: _this.$el.find(".page-base-header")
            });
            _this._footer = new footer_1.FooterView({
                el: _this.$el.find(".page-base-footer")
            });
            switch (params.category) {
                case PageCategory.GETSTARTED:
                    _this._menu.render(menu_1.MenuCategory.GETSTARTED);
                    _this._header.render(header_1.HeaderCategory.GETSTARTED);
                    break;
                case PageCategory.DOCUMENTS:
                    _this._menu.render(menu_1.MenuCategory.DOCUMENTS);
                    _this._header.render(header_1.HeaderCategory.DOCUMENTS);
                    break;
                case PageCategory.RESOURCES:
                    _this._menu.render(menu_1.MenuCategory.RESOURCES);
                    _this._header.render(header_1.HeaderCategory.RESOURCES);
                    break;
                case PageCategory.COMMUNICATION:
                    _this._menu.render(menu_1.MenuCategory.COMMUNICATION);
                    _this._header.render(header_1.HeaderCategory.COMMUNICATION);
                    break;
            }
            _this._footer.render();
            _this._templateDirectory = params.templateDirctory;
            _this._categoryPageHash = params.categoryPageHash;
            _this._defaultPageName = params.defaultPageName ? params.defaultPageName : "top";
            return _this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Override: Backbone.View
        PageUtils.prototype.remove = function () {
            if (this._menu) {
                this._menu.remove();
                this._menu = null;
            }
            if (this._header) {
                this._header.remove();
                this._header = null;
            }
            if (this._footer) {
                this._footer.remove();
                this._footer = null;
            }
            _super.prototype.remove.call(this);
            return this;
        };
        ///////////////////////////////////////////////////////////////////////
        // Public Methods
        /**
         * 同一カテゴリーのページのコンテンツを切り替える
         */
        PageUtils.prototype.changeContent = function () {
            // query params から入れ替えるページ名を取得
            var params = framework_2.Router.getQueryParameters();
            var pageName = null;
            if (_.isArray(params) && _.isArray(params[0])) {
                pageName = params[0][0];
            }
            if (!pageName) {
                pageName = this._defaultPageName;
            }
            this._menu.setCurrentPage(this._categoryPageHash + "/" + pageName);
            // メインのコンテンツを入れ替える
            var $mainContent = this.$el.find(".main-content");
            $mainContent.empty();
            var templateId = this._categoryPageHash + "-" + pageName;
            var templateFile = framework_1.toUrl(this._templateDirectory + pageName + ".html");
            var template = tools_1.Template.getJST(templateId, templateFile);
            var $content = $(template());
            $mainContent.append($content);
            this.$el.scrollTop(0);
            // 外部リンクの有効化
            functions_1.Utils.activateAllExternalLinks(this.$el);
            // inline code の有効化
            functions_1.Utils.activateInlineCode(this.$el);
            // Highlight.js を発動
            functions_1.Utils.activateHighlight(this.$el);
        };
        return PageUtils;
    }(Backbone.View));
    exports.PageUtils = PageUtils;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9zY3JpcHRzL3ZpZXcvY29tbW9uL3BhZ2UtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWNBLElBQVksWUFLWDtJQUxELFdBQVksWUFBWTtRQUNwQiwyREFBVSxDQUFBO1FBQ1YseURBQVMsQ0FBQTtRQUNULHlEQUFTLENBQUE7UUFDVCxpRUFBYSxDQUFBO0lBQ2pCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtJQVNEO1FBQStCLDZCQUE2QjtRQVF4RCxtQkFBWSxNQUF3QjtZQUFwQyxZQUNJLGtCQUFNLE1BQU0sQ0FBQyxTQXNDaEI7WUFwQ0csS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQVEsQ0FBQztnQkFDdEIsRUFBRSxFQUFFLEtBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2FBQ3RDLENBQUMsQ0FBQztZQUNILEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxtQkFBVSxDQUFDO2dCQUMxQixFQUFFLEVBQUUsS0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7YUFDekMsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLG1CQUFVLENBQUM7Z0JBQzFCLEVBQUUsRUFBRSxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQzthQUN6QyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxZQUFZLENBQUMsVUFBVTtvQkFDeEIsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDM0MsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsdUJBQWMsQ0FB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RyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFFbkUsa0JBQWtCO1lBQ2xCLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BELFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVyQixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQztZQUMzRCxJQUFNLFlBQVksR0FBRyxpQkFBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFFekUsSUFBTSxRQUFRLEdBQUcsZ0JBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzNELElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEIsWUFBWTtZQUNaLGlCQUFLLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXpDLG1CQUFtQjtZQUNuQixpQkFBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVuQyxtQkFBbUI7WUFDbkIsaUJBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNMLGdCQUFDO0lBQUQsQ0FBQyxBQWpIRCxDQUErQixRQUFRLENBQUMsSUFBSSxHQWlIM0M7SUFqSFksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCYWNrYm9uZSBmcm9tIFwiYmFja2JvbmVcIjtcbmltcG9ydCAqIGFzIF8gZnJvbSBcInVuZGVyc2NvcmVcIjtcblxuaW1wb3J0IHsgdG9VcmwgfSBmcm9tIFwiY2RwL2ZyYW1ld29ya1wiO1xuaW1wb3J0IHsgSlNULCBUZW1wbGF0ZSB9IGZyb20gXCJjZHAvdG9vbHMvdG9vbHNcIjtcblxuaW1wb3J0IHsgTWVudVZpZXcsIE1lbnVDYXRlZ29yeSB9IGZyb20gXCIuL21lbnVcIjtcbmltcG9ydCB7IEhlYWRlclZpZXcsIEhlYWRlckNhdGVnb3J5IH0gZnJvbSBcIi4vaGVhZGVyXCI7XG5pbXBvcnQgeyBGb290ZXJWaWV3IH0gZnJvbSBcIi4vZm9vdGVyXCI7XG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi8uLi91dGlsL2Z1bmN0aW9uc1wiO1xuXG5cbmltcG9ydCB7IFJvdXRlciBhcyByb3V0ZXIgfSBmcm9tIFwiY2RwL2ZyYW1ld29ya1wiO1xuXG5leHBvcnQgZW51bSBQYWdlQ2F0ZWdvcnkge1xuICAgIEdFVFNUQVJURUQsXG4gICAgRE9DVU1FTlRTLFxuICAgIFJFU09VUkNFUyxcbiAgICBDT01NVU5JQ0FUSU9OLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2VVdGlsc1BhcmFtcyBleHRlbmRzIEJhY2tib25lLlZpZXdPcHRpb25zPEJhY2tib25lLk1vZGVsPiB7XG4gICAgY2F0ZWdvcnk6IFBhZ2VDYXRlZ29yeTtcbiAgICB0ZW1wbGF0ZURpcmN0b3J5OiBzdHJpbmc7XG4gICAgY2F0ZWdvcnlQYWdlSGFzaDogc3RyaW5nO1xuICAgIGRlZmF1bHRQYWdlTmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFBhZ2VVdGlscyBleHRlbmRzIEJhY2tib25lLlZpZXc8QmFja2JvbmUuTW9kZWw+IHtcbiAgICBwcml2YXRlIF9tZW51OiBNZW51VmlldztcbiAgICBwcml2YXRlIF9oZWFkZXI6IEhlYWRlclZpZXc7XG4gICAgcHJpdmF0ZSBfZm9vdGVyOiBGb290ZXJWaWV3O1xuICAgIHByaXZhdGUgX3RlbXBsYXRlRGlyZWN0b3J5OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlQYWdlSGFzaDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2RlZmF1bHRQYWdlTmFtZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocGFyYW1zPzogUGFnZVV0aWxzUGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKHBhcmFtcyk7XG5cbiAgICAgICAgdGhpcy5fbWVudSA9IG5ldyBNZW51Vmlldyh7XG4gICAgICAgICAgICBlbDogdGhpcy4kZWwuZmluZChcIi5jb250ZW50cy1saXN0XCIpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9oZWFkZXIgPSBuZXcgSGVhZGVyVmlldyh7XG4gICAgICAgICAgICBlbDogdGhpcy4kZWwuZmluZChcIi5wYWdlLWJhc2UtaGVhZGVyXCIpXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9mb290ZXIgPSBuZXcgRm9vdGVyVmlldyh7XG4gICAgICAgICAgICBlbDogdGhpcy4kZWwuZmluZChcIi5wYWdlLWJhc2UtZm9vdGVyXCIpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN3aXRjaCAocGFyYW1zLmNhdGVnb3J5KSB7XG4gICAgICAgICAgICBjYXNlIFBhZ2VDYXRlZ29yeS5HRVRTVEFSVEVEOlxuICAgICAgICAgICAgICAgIHRoaXMuX21lbnUucmVuZGVyKE1lbnVDYXRlZ29yeS5HRVRTVEFSVEVEKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFkZXIucmVuZGVyKEhlYWRlckNhdGVnb3J5LkdFVFNUQVJURUQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFBhZ2VDYXRlZ29yeS5ET0NVTUVOVFM6XG4gICAgICAgICAgICAgICAgdGhpcy5fbWVudS5yZW5kZXIoTWVudUNhdGVnb3J5LkRPQ1VNRU5UUyk7XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhZGVyLnJlbmRlcihIZWFkZXJDYXRlZ29yeS5ET0NVTUVOVFMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFBhZ2VDYXRlZ29yeS5SRVNPVVJDRVM6XG4gICAgICAgICAgICAgICAgdGhpcy5fbWVudS5yZW5kZXIoTWVudUNhdGVnb3J5LlJFU09VUkNFUyk7XG4gICAgICAgICAgICAgICAgdGhpcy5faGVhZGVyLnJlbmRlcihIZWFkZXJDYXRlZ29yeS5SRVNPVVJDRVMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFBhZ2VDYXRlZ29yeS5DT01NVU5JQ0FUSU9OOlxuICAgICAgICAgICAgICAgIHRoaXMuX21lbnUucmVuZGVyKE1lbnVDYXRlZ29yeS5DT01NVU5JQ0FUSU9OKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWFkZXIucmVuZGVyKEhlYWRlckNhdGVnb3J5LkNPTU1VTklDQVRJT04pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Zvb3Rlci5yZW5kZXIoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlRGlyZWN0b3J5ID0gcGFyYW1zLnRlbXBsYXRlRGlyY3Rvcnk7XG4gICAgICAgIHRoaXMuX2NhdGVnb3J5UGFnZUhhc2ggPSBwYXJhbXMuY2F0ZWdvcnlQYWdlSGFzaDtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFBhZ2VOYW1lID0gcGFyYW1zLmRlZmF1bHRQYWdlTmFtZSA/IHBhcmFtcy5kZWZhdWx0UGFnZU5hbWUgOiBcInRvcFwiO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gT3ZlcnJpZGU6IEJhY2tib25lLlZpZXdcblxuICAgIHJlbW92ZSgpOiBQYWdlVXRpbHMge1xuICAgICAgICBpZiAodGhpcy5fbWVudSkge1xuICAgICAgICAgICAgdGhpcy5fbWVudS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX21lbnUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9oZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlci5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZm9vdGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9mb290ZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLl9mb290ZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc3VwZXIucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFB1YmxpYyBNZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiDlkIzkuIDjgqvjg4bjgrTjg6rjg7zjga7jg5rjg7zjgrjjga7jgrPjg7Pjg4bjg7Pjg4TjgpLliIfjgormm7/jgYjjgotcbiAgICAgKi9cbiAgICBjaGFuZ2VDb250ZW50KCk6IHZvaWQge1xuICAgICAgICAvLyBxdWVyeSBwYXJhbXMg44GL44KJ5YWl44KM5pu/44GI44KL44Oa44O844K45ZCN44KS5Y+W5b6XXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHJvdXRlci5nZXRRdWVyeVBhcmFtZXRlcnMoKTtcbiAgICAgICAgbGV0IHBhZ2VOYW1lOiBzdHJpbmcgPSBudWxsO1xuICAgICAgICBpZiAoXy5pc0FycmF5KHBhcmFtcykgJiYgXy5pc0FycmF5KHBhcmFtc1swXSkpIHtcbiAgICAgICAgICAgIHBhZ2VOYW1lID0gcGFyYW1zWzBdWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFnZU5hbWUpIHtcbiAgICAgICAgICAgIHBhZ2VOYW1lID0gdGhpcy5fZGVmYXVsdFBhZ2VOYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21lbnUuc2V0Q3VycmVudFBhZ2UodGhpcy5fY2F0ZWdvcnlQYWdlSGFzaCArIFwiL1wiICsgcGFnZU5hbWUpO1xuXG4gICAgICAgIC8vIOODoeOCpOODs+OBruOCs+ODs+ODhuODs+ODhOOCkuWFpeOCjOabv+OBiOOCi1xuICAgICAgICBjb25zdCAkbWFpbkNvbnRlbnQgPSB0aGlzLiRlbC5maW5kKFwiLm1haW4tY29udGVudFwiKTtcbiAgICAgICAgJG1haW5Db250ZW50LmVtcHR5KCk7XG5cbiAgICAgICAgY29uc3QgdGVtcGxhdGVJZCA9IHRoaXMuX2NhdGVnb3J5UGFnZUhhc2ggKyBcIi1cIiArIHBhZ2VOYW1lO1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZUZpbGUgPSB0b1VybCh0aGlzLl90ZW1wbGF0ZURpcmVjdG9yeSArIHBhZ2VOYW1lICsgXCIuaHRtbFwiKTtcblxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVCh0ZW1wbGF0ZUlkLCB0ZW1wbGF0ZUZpbGUpO1xuICAgICAgICBjb25zdCAkY29udGVudCA9ICQodGVtcGxhdGUoKSk7XG4gICAgICAgICRtYWluQ29udGVudC5hcHBlbmQoJGNvbnRlbnQpO1xuXG4gICAgICAgIHRoaXMuJGVsLnNjcm9sbFRvcCgwKTtcblxuICAgICAgICAvLyDlpJbpg6jjg6rjg7Pjgq/jga7mnInlirnljJZcbiAgICAgICAgVXRpbHMuYWN0aXZhdGVBbGxFeHRlcm5hbExpbmtzKHRoaXMuJGVsKTtcblxuICAgICAgICAvLyBpbmxpbmUgY29kZSDjga7mnInlirnljJZcbiAgICAgICAgVXRpbHMuYWN0aXZhdGVJbmxpbmVDb2RlKHRoaXMuJGVsKTtcblxuICAgICAgICAvLyBIaWdobGlnaHQuanMg44KS55m65YuVXG4gICAgICAgIFV0aWxzLmFjdGl2YXRlSGlnaGxpZ2h0KHRoaXMuJGVsKTtcbiAgICB9XG59XG4iXX0=
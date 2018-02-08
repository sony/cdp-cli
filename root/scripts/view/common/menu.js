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
    var TAG = "[view.MenuView] ";
    var MenuCategory;
    (function (MenuCategory) {
        MenuCategory[MenuCategory["GETSTARTED"] = 0] = "GETSTARTED";
        MenuCategory[MenuCategory["DOCUMENTS"] = 1] = "DOCUMENTS";
        MenuCategory[MenuCategory["RESOURCES"] = 2] = "RESOURCES";
        MenuCategory[MenuCategory["COMMUNICATION"] = 3] = "COMMUNICATION";
    })(MenuCategory = exports.MenuCategory || (exports.MenuCategory = {}));
    var TOP_MENU_DATA = "/res/data/menu/top.json";
    var GETSTARTED_MENU_DATA = "/res/data/menu/getstarted.json";
    var DOCUMENTS_MENU_DATA = "/res/data/menu/documents.json";
    var RESOURCES_MENU_DATA = "/res/data/menu/resources.json";
    var COMMUNICATION_MENU_DATA = "/res/data/menu/communication.json";
    /**
     * @class MenuView
     * @brief サイドメニューのクラス
     */
    var MenuView = /** @class */ (function (_super) {
        __extends(MenuView, _super);
        /**
         * constructor
         */
        function MenuView(options) {
            return _super.call(this, options) || this;
        }
        /**
         * メニューをレンダリングする
         * @param category [in] メニューのカテゴリー
         */
        MenuView.prototype.render = function (category) {
            var _this = this;
            var menuData = "";
            switch (category) {
                case MenuCategory.GETSTARTED:
                    menuData = GETSTARTED_MENU_DATA;
                    break;
                case MenuCategory.DOCUMENTS:
                    menuData = DOCUMENTS_MENU_DATA;
                    break;
                case MenuCategory.RESOURCES:
                    menuData = RESOURCES_MENU_DATA;
                    break;
                case MenuCategory.COMMUNICATION:
                    menuData = COMMUNICATION_MENU_DATA;
                    break;
                default:
                    menuData = TOP_MENU_DATA;
            }
            $.ajax({
                url: framework_1.toUrl(menuData),
                type: "GET",
                dataType: "json",
                async: false
            })
                .done(function (data) {
                var template = tools_1.Template.getJST("#template-menu-list-container", framework_1.toUrl("/templates/common/menu.html"));
                var $menu = $(template(data));
                _this.$el.append($menu);
            });
            return this;
        };
        /**
         * メニューに選択したページをマークする
         *
         * @param pageId [in] 選択したページ
         */
        MenuView.prototype.setCurrentPage = function (pageId) {
            var $links = this.$el.find("a");
            $links.each(function (index, elem) {
                var $link = $(elem);
                var href = $link.attr("href");
                if (href === pageId) {
                    $link.addClass("selected");
                    $link.parents(".expandable").removeClass("collapsed");
                }
                else {
                    $link.removeClass("selected");
                }
            });
        };
        MenuView.prototype.events = function () {
            return {
                "vclick .expandable": this.onClickedExpand,
            };
        };
        /**
         * 開閉可能なリストの処理
         * @param event
         */
        MenuView.prototype.onClickedExpand = function (event) {
            var _this = this;
            var $target = $(event.target);
            if ($target.attr("target") === "_blank") {
                return;
            }
            event.preventDefault();
            if (this._preventListExpand) {
                return;
            }
            this._preventListExpand = true;
            if ($target.hasClass("collapsed")) {
                $target.removeClass("collapsed");
            }
            else {
                $target.addClass("collapsed");
            }
            setTimeout(function () {
                _this._preventListExpand = false;
            }, 500);
        };
        return MenuView;
    }(Backbone.View));
    exports.MenuView = MenuView;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9zY3JpcHRzL3ZpZXcvY29tbW9uL21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUtBLElBQU0sR0FBRyxHQUFHLGtCQUFrQixDQUFDO0lBRS9CLElBQVksWUFLWDtJQUxELFdBQVksWUFBWTtRQUNwQiwyREFBVSxDQUFBO1FBQ1YseURBQVMsQ0FBQTtRQUNULHlEQUFTLENBQUE7UUFDVCxpRUFBYSxDQUFBO0lBQ2pCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtJQUVELElBQU0sYUFBYSxHQUFHLHlCQUF5QixDQUFDO0lBQ2hELElBQU0sb0JBQW9CLEdBQUcsZ0NBQWdDLENBQUM7SUFDOUQsSUFBTSxtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQztJQUM1RCxJQUFNLG1CQUFtQixHQUFHLCtCQUErQixDQUFDO0lBQzVELElBQU0sdUJBQXVCLEdBQUcsbUNBQW1DLENBQUM7SUFFcEU7OztPQUdHO0lBQ0g7UUFBOEIsNEJBQTZCO1FBR3ZEOztXQUVHO1FBQ0gsa0JBQVksT0FBOEM7bUJBQ3RELGtCQUFNLE9BQU8sQ0FBQztRQUNsQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0gseUJBQU0sR0FBTixVQUFPLFFBQXVCO1lBQTlCLGlCQXVDQztZQXRDRyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFLLFlBQVksQ0FBQyxVQUFVO29CQUN4QixRQUFRLEdBQUcsb0JBQW9CLENBQUM7b0JBQ2hDLEtBQUssQ0FBQztnQkFFVixLQUFLLFlBQVksQ0FBQyxTQUFTO29CQUN2QixRQUFRLEdBQUcsbUJBQW1CLENBQUM7b0JBQy9CLEtBQUssQ0FBQztnQkFFVixLQUFLLFlBQVksQ0FBQyxTQUFTO29CQUN2QixRQUFRLEdBQUcsbUJBQW1CLENBQUM7b0JBQy9CLEtBQUssQ0FBQztnQkFFVixLQUFLLFlBQVksQ0FBQyxhQUFhO29CQUMzQixRQUFRLEdBQUcsdUJBQXVCLENBQUM7b0JBQ25DLEtBQUssQ0FBQztnQkFFVjtvQkFDSSxRQUFRLEdBQUcsYUFBYSxDQUFDO1lBRWpDLENBQUM7WUFFRCxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNILEdBQUcsRUFBRSxpQkFBSyxDQUFDLFFBQVEsQ0FBQztnQkFDcEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLEtBQUssRUFBRSxLQUFLO2FBQ2YsQ0FBQztpQkFDRyxJQUFJLENBQUMsVUFBQyxJQUFTO2dCQUNaLElBQU0sUUFBUSxHQUFHLGdCQUFRLENBQUMsTUFBTSxDQUM1QiwrQkFBK0IsRUFDL0IsaUJBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUN2QyxDQUFDO2dCQUNGLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDaEMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRDs7OztXQUlHO1FBQ0gsaUNBQWMsR0FBZCxVQUFlLE1BQWM7WUFDekIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssRUFBRSxJQUFJO2dCQUNwQixJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hDLEVBQUUsQ0FBQSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNqQixLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUMzQixLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQseUJBQU0sR0FBTjtZQUNJLE1BQU0sQ0FBQztnQkFDSCxvQkFBb0IsRUFBRSxJQUFJLENBQUMsZUFBZTthQUM3QyxDQUFDO1FBQ04sQ0FBQztRQUVEOzs7V0FHRztRQUNLLGtDQUFlLEdBQXZCLFVBQXdCLEtBQXdCO1lBQWhELGlCQXFCQztZQXBCRyxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUV2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUUvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBRUQsVUFBVSxDQUFDO2dCQUNQLEtBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDcEMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQUNMLGVBQUM7SUFBRCxDQUFDLEFBMUdELENBQThCLFFBQVEsQ0FBQyxJQUFJLEdBMEcxQztJQTFHWSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEJhY2tib25lIGZyb20gXCJiYWNrYm9uZVwiO1xuLy9pbXBvcnQgeyBQYWdlVmlldywgU2hvd0V2ZW50RGF0YSwgSGlkZUV2ZW50RGF0YSwgVG9hc3QsIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9ucyB9IGZyb20gXCJjZHAvdWlcIjtcbmltcG9ydCB7IHRvVXJsIH0gZnJvbSBcImNkcC9mcmFtZXdvcmtcIjtcbmltcG9ydCB7IEpTVCwgVGVtcGxhdGUgfSBmcm9tIFwiY2RwL3Rvb2xzL3Rvb2xzXCI7XG5cbmNvbnN0IFRBRyA9IFwiW3ZpZXcuTWVudVZpZXddIFwiO1xuXG5leHBvcnQgZW51bSBNZW51Q2F0ZWdvcnkge1xuICAgIEdFVFNUQVJURUQsXG4gICAgRE9DVU1FTlRTLFxuICAgIFJFU09VUkNFUyxcbiAgICBDT01NVU5JQ0FUSU9OLFxufVxuXG5jb25zdCBUT1BfTUVOVV9EQVRBID0gXCIvcmVzL2RhdGEvbWVudS90b3AuanNvblwiO1xuY29uc3QgR0VUU1RBUlRFRF9NRU5VX0RBVEEgPSBcIi9yZXMvZGF0YS9tZW51L2dldHN0YXJ0ZWQuanNvblwiO1xuY29uc3QgRE9DVU1FTlRTX01FTlVfREFUQSA9IFwiL3Jlcy9kYXRhL21lbnUvZG9jdW1lbnRzLmpzb25cIjtcbmNvbnN0IFJFU09VUkNFU19NRU5VX0RBVEEgPSBcIi9yZXMvZGF0YS9tZW51L3Jlc291cmNlcy5qc29uXCI7XG5jb25zdCBDT01NVU5JQ0FUSU9OX01FTlVfREFUQSA9IFwiL3Jlcy9kYXRhL21lbnUvY29tbXVuaWNhdGlvbi5qc29uXCI7XG5cbi8qKlxuICogQGNsYXNzIE1lbnVWaWV3XG4gKiBAYnJpZWYg44K144Kk44OJ44Oh44OL44Ol44O844Gu44Kv44Op44K5XG4gKi9cbmV4cG9ydCBjbGFzcyBNZW51VmlldyBleHRlbmRzIEJhY2tib25lLlZpZXc8QmFja2JvbmUuTW9kZWw+IHtcbiAgICBwcml2YXRlIF9wcmV2ZW50TGlzdEV4cGFuZDogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucz86IEJhY2tib25lLlZpZXdPcHRpb25zPEJhY2tib25lLk1vZGVsPikge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Hjg4vjg6Xjg7zjgpLjg6zjg7Pjg4Djg6rjg7PjgrDjgZnjgotcbiAgICAgKiBAcGFyYW0gY2F0ZWdvcnkgW2luXSDjg6Hjg4vjg6Xjg7zjga7jgqvjg4bjgrTjg6rjg7xcbiAgICAgKi9cbiAgICByZW5kZXIoY2F0ZWdvcnk/OiBNZW51Q2F0ZWdvcnkpOiBNZW51VmlldyB7XG4gICAgICAgIGxldCBtZW51RGF0YSA9IFwiXCI7XG4gICAgICAgIHN3aXRjaCAoY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIGNhc2UgTWVudUNhdGVnb3J5LkdFVFNUQVJURUQ6XG4gICAgICAgICAgICAgICAgbWVudURhdGEgPSBHRVRTVEFSVEVEX01FTlVfREFUQTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBNZW51Q2F0ZWdvcnkuRE9DVU1FTlRTOlxuICAgICAgICAgICAgICAgIG1lbnVEYXRhID0gRE9DVU1FTlRTX01FTlVfREFUQTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBNZW51Q2F0ZWdvcnkuUkVTT1VSQ0VTOlxuICAgICAgICAgICAgICAgIG1lbnVEYXRhID0gUkVTT1VSQ0VTX01FTlVfREFUQTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBNZW51Q2F0ZWdvcnkuQ09NTVVOSUNBVElPTjpcbiAgICAgICAgICAgICAgICBtZW51RGF0YSA9IENPTU1VTklDQVRJT05fTUVOVV9EQVRBO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG1lbnVEYXRhID0gVE9QX01FTlVfREFUQTtcblxuICAgICAgICB9XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdG9VcmwobWVudURhdGEpLFxuICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKFxuICAgICAgICAgICAgICAgICAgICBcIiN0ZW1wbGF0ZS1tZW51LWxpc3QtY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgICAgIHRvVXJsKFwiL3RlbXBsYXRlcy9jb21tb24vbWVudS5odG1sXCIpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkbWVudSA9ICQodGVtcGxhdGUoZGF0YSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZCgkbWVudSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oh44OL44Ol44O844Gr6YG45oqe44GX44Gf44Oa44O844K444KS44Oe44O844Kv44GZ44KLXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFnZUlkIFtpbl0g6YG45oqe44GX44Gf44Oa44O844K4XG4gICAgICovXG4gICAgc2V0Q3VycmVudFBhZ2UocGFnZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgJGxpbmtzID0gdGhpcy4kZWwuZmluZChcImFcIik7XG4gICAgICAgICRsaW5rcy5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGxpbmsgPSAkKGVsZW0pO1xuICAgICAgICAgICAgY29uc3QgaHJlZiA9ICRsaW5rLmF0dHIoXCJocmVmXCIpO1xuICAgICAgICAgICAgaWYoaHJlZiA9PT0gcGFnZUlkKSB7XG4gICAgICAgICAgICAgICAgJGxpbmsuYWRkQ2xhc3MoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICAkbGluay5wYXJlbnRzKFwiLmV4cGFuZGFibGVcIikucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRsaW5rLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGV2ZW50cygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJ2Y2xpY2sgLmV4cGFuZGFibGVcIjogdGhpcy5vbkNsaWNrZWRFeHBhbmQsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6ZaL6ZaJ5Y+v6IO944Gq44Oq44K544OI44Gu5Yem55CGXG4gICAgICogQHBhcmFtIGV2ZW50IFxuICAgICAqL1xuICAgIHByaXZhdGUgb25DbGlja2VkRXhwYW5kKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuICAgICAgICBpZigkdGFyZ2V0LmF0dHIoXCJ0YXJnZXRcIikgPT09IFwiX2JsYW5rXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9wcmV2ZW50TGlzdEV4cGFuZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ByZXZlbnRMaXN0RXhwYW5kID0gdHJ1ZTtcblxuICAgICAgICBpZiAoJHRhcmdldC5oYXNDbGFzcyhcImNvbGxhcHNlZFwiKSkge1xuICAgICAgICAgICAgJHRhcmdldC5yZW1vdmVDbGFzcyhcImNvbGxhcHNlZFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0YXJnZXQuYWRkQ2xhc3MoXCJjb2xsYXBzZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3ByZXZlbnRMaXN0RXhwYW5kID0gZmFsc2U7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgfVxufVxuIl19
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
define(["require", "exports", "cdp/ui", "../common/header", "../common/footer", "../../util/functions"], function (require, exports, ui_1, header_1, footer_1, functions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.TopPage] ";
    /**
     * @class HomeView
     * @brief ホームページのクラス
     */
    var TopPage = /** @class */ (function (_super) {
        __extends(TopPage, _super);
        /**
         * constructor
         */
        function TopPage() {
            return _super.call(this, "/templates/top/top.html", "page-top", {
                route: "top"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        TopPage.prototype.events = function () {
            return {
                "vclick .command-demo-device-rotate": this.onDemoDeviceRotate,
                "vclick .command-demo-zoom": this.onDemoDeviceZoom,
            };
        };
        /**
         * デモの回転ボタンをクリックされたときに呼び出される
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onDemoDeviceRotate = function (event) {
            var $demoContainer = this.$el.find(".demo-container");
            if ($demoContainer.hasClass("iphone7-portrait")) {
                $demoContainer.removeClass("iphone7-portrait")
                    .addClass("iphone7-landscape");
            }
            else {
                $demoContainer.removeClass("iphone7-landscape")
                    .addClass("iphone7-portrait");
            }
        };
        /**
         * デモのZoomボタンをクリックされたときに呼び出される
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onDemoDeviceZoom = function (event) {
            var $demoContainer = this.$el.find(".demo-container");
            if ($demoContainer.hasClass("zoom-out")) {
                $demoContainer.removeClass("zoom-out");
            }
            else {
                $demoContainer.addClass("zoom-out");
            }
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        TopPage.prototype.onPageBeforeShow = function (event, data) {
            if (!this._headerView) {
                this._headerView = new header_1.HeaderView({
                    el: this.$el.find(".page-base-header")
                });
                this._headerView.render();
            }
            if (!this._footerView) {
                this._footerView = new footer_1.FooterView({
                    el: this.$el.find(".page-base-footer")
                });
                this._footerView.render();
            }
            functions_1.Utils.activateAllExternalLinks(this.$el);
            _super.prototype.onPageBeforeShow.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainershow" (旧:"pageshow") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        TopPage.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        TopPage.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        TopPage.prototype.onPageHide = function (event, data) {
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onPageRemove = function (event) {
            this._headerView = null;
            this._footerView = null;
            _super.prototype.onPageRemove.call(this, event);
        };
        return TopPage;
    }(ui_1.PageView));
    exports.TopPage = TopPage;
    var __viewTopPage = new TopPage();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAvc2NyaXB0cy92aWV3L3RvcC90b3AtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBT0EsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUM7SUFFOUI7OztPQUdHO0lBQ0g7UUFBNkIsMkJBQXdCO1FBSWpEOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0seUJBQXlCLEVBQUUsVUFBVSxFQUFFO2dCQUN6QyxLQUFLLEVBQUUsS0FBSzthQUNmLENBQUM7UUFDTixDQUFDO1FBRUQsdUVBQXVFO1FBQ3ZFLGdCQUFnQjtRQUVoQixrQkFBa0I7UUFDbEIsd0JBQU0sR0FBTjtZQUNJLE1BQU0sQ0FBQztnQkFDSCxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsa0JBQWtCO2dCQUM3RCwyQkFBMkIsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2FBQ3JELENBQUM7UUFDTixDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILG9DQUFrQixHQUFsQixVQUFtQixLQUF3QjtZQUN2QyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3hELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLGNBQWMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUM7cUJBQ3pDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixjQUFjLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDO3FCQUMxQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN0QyxDQUFDO1FBQ0wsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxrQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0I7WUFDckMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN4RCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osY0FBYyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QyxDQUFDO1FBQ0wsQ0FBQztRQUVELHVFQUF1RTtRQUN2RSx3QkFBd0I7UUFFeEI7Ozs7V0FJRztRQUNILG9DQUFrQixHQUFsQixVQUFtQixLQUF3QjtZQUN2QyxpQkFBTSxrQkFBa0IsWUFBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILDRCQUFVLEdBQVYsVUFBVyxLQUF3QjtZQUMvQixpQkFBTSxVQUFVLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0NBQWdCLEdBQWhCLFVBQWlCLEtBQXdCLEVBQUUsSUFBbUI7WUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG1CQUFVLENBQUM7b0JBQzlCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztpQkFDekMsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDOUIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQkFBVSxDQUFDO29CQUM5QixFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7aUJBQ3pDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzlCLENBQUM7WUFFRCxpQkFBSyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV6QyxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsNEJBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCxrQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsNEJBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILDhCQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixpQkFBTSxZQUFZLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNMLGNBQUM7SUFBRCxDQUFDLEFBNUlELENBQTZCLGFBQVEsR0E0SXBDO0lBNUlZLDBCQUFPO0lBOElwQixJQUFNLGFBQWEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQmFja2JvbmUgZnJvbSBcImJhY2tib25lXCI7XG5pbXBvcnQgeyBQYWdlVmlldywgU2hvd0V2ZW50RGF0YSwgSGlkZUV2ZW50RGF0YSB9IGZyb20gXCJjZHAvdWlcIjtcblxuaW1wb3J0IHsgSGVhZGVyVmlldyB9IGZyb20gXCIuLi9jb21tb24vaGVhZGVyXCI7XG5pbXBvcnQgeyBGb290ZXJWaWV3IH0gZnJvbSBcIi4uL2NvbW1vbi9mb290ZXJcIjtcbmltcG9ydCB7IFV0aWxzIH0gZnJvbSBcIi4uLy4uL3V0aWwvZnVuY3Rpb25zXCI7XG5cbmNvbnN0IFRBRyA9IFwiW3ZpZXcuVG9wUGFnZV0gXCI7XG5cbi8qKlxuICogQGNsYXNzIEhvbWVWaWV3XG4gKiBAYnJpZWYg44Ob44O844Og44Oa44O844K444Gu44Kv44Op44K5XG4gKi9cbmV4cG9ydCBjbGFzcyBUb3BQYWdlIGV4dGVuZHMgUGFnZVZpZXc8QmFja2JvbmUuTW9kZWw+IHtcblxuICAgIHByaXZhdGUgX2hlYWRlclZpZXc6IEhlYWRlclZpZXc7XG4gICAgcHJpdmF0ZSBfZm9vdGVyVmlldzogRm9vdGVyVmlldztcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcIi90ZW1wbGF0ZXMvdG9wL3RvcC5odG1sXCIsIFwicGFnZS10b3BcIiwge1xuICAgICAgICAgICAgcm91dGU6IFwidG9wXCJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBFdmVudCBIYW5kbGVyXG5cbiAgICAvLyEg44Kk44OZ44Oz44OI44OP44Oz44OJ44Op44Gu44Oe44OD44OU44Oz44KwXG4gICAgZXZlbnRzKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcInZjbGljayAuY29tbWFuZC1kZW1vLWRldmljZS1yb3RhdGVcIjogdGhpcy5vbkRlbW9EZXZpY2VSb3RhdGUsXG4gICAgICAgICAgICBcInZjbGljayAuY29tbWFuZC1kZW1vLXpvb21cIjogdGhpcy5vbkRlbW9EZXZpY2Vab29tLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODh+ODouOBruWbnui7ouODnOOCv+ODs+OCkuOCr+ODquODg+OCr+OBleOCjOOBn+OBqOOBjeOBq+WRvOOBs+WHuuOBleOCjOOCi1xuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25EZW1vRGV2aWNlUm90YXRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBjb25zdCAkZGVtb0NvbnRhaW5lciA9IHRoaXMuJGVsLmZpbmQoXCIuZGVtby1jb250YWluZXJcIik7XG4gICAgICAgIGlmICgkZGVtb0NvbnRhaW5lci5oYXNDbGFzcyhcImlwaG9uZTctcG9ydHJhaXRcIikpIHtcbiAgICAgICAgICAgICRkZW1vQ29udGFpbmVyLnJlbW92ZUNsYXNzKFwiaXBob25lNy1wb3J0cmFpdFwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImlwaG9uZTctbGFuZHNjYXBlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGRlbW9Db250YWluZXIucmVtb3ZlQ2xhc3MoXCJpcGhvbmU3LWxhbmRzY2FwZVwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImlwaG9uZTctcG9ydHJhaXRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg4fjg6Ljga5ab29t44Oc44K/44Oz44KS44Kv44Oq44OD44Kv44GV44KM44Gf44Go44GN44Gr5ZG844Gz5Ye644GV44KM44KLXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKi9cbiAgICBvbkRlbW9EZXZpY2Vab29tKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBjb25zdCAkZGVtb0NvbnRhaW5lciA9IHRoaXMuJGVsLmZpbmQoXCIuZGVtby1jb250YWluZXJcIik7XG4gICAgICAgIGlmICgkZGVtb0NvbnRhaW5lci5oYXNDbGFzcyhcInpvb20tb3V0XCIpKSB7XG4gICAgICAgICAgICAkZGVtb0NvbnRhaW5lci5yZW1vdmVDbGFzcyhcInpvb20tb3V0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGRlbW9Db250YWluZXIuYWRkQ2xhc3MoXCJ6b29tLW91dFwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gT3ZlcnJpZGU6IFVJLlBhZ2VWaWV3XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY3JlYXRlXCIgKOaXpzpcInBhZ2Vpbml0XCIpIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlSW5pdChldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuX2hlYWRlclZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlclZpZXcgPSBuZXcgSGVhZGVyVmlldyh7XG4gICAgICAgICAgICAgICAgZWw6IHRoaXMuJGVsLmZpbmQoXCIucGFnZS1iYXNlLWhlYWRlclwiKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9oZWFkZXJWaWV3LnJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fZm9vdGVyVmlldykge1xuICAgICAgICAgICAgdGhpcy5fZm9vdGVyVmlldyA9IG5ldyBGb290ZXJWaWV3KHtcbiAgICAgICAgICAgICAgICBlbDogdGhpcy4kZWwuZmluZChcIi5wYWdlLWJhc2UtZm9vdGVyXCIpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2Zvb3RlclZpZXcucmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBVdGlscy5hY3RpdmF0ZUFsbEV4dGVybmFsTGlua3ModGhpcy4kZWwpO1xuXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxuICAgICAqL1xuICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBTaG93RXZlbnREYXRhKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3JlaGlkZVwiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXG4gICAgICovXG4gICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEhpZGVFdmVudERhdGEpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlSGlkZShldmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJoaWRlXCIgKOaXpzpcInBhZ2VoaWRlXCIpIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXG4gICAgICovXG4gICAgb25QYWdlSGlkZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEhpZGVFdmVudERhdGEpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlSGlkZShldmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqL1xuICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5faGVhZGVyVmlldyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2Zvb3RlclZpZXcgPSBudWxsO1xuICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xuICAgIH1cbn1cblxuY29uc3QgX192aWV3VG9wUGFnZSA9IG5ldyBUb3BQYWdlKCk7XG4iXX0=
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
define(["require", "exports", "cdp/ui", "../common/page-utils"], function (require, exports, ui_1, page_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.ResourcesPage] ";
    /**
     * @class ResourcesView
     * @brief リソースカテゴリーのクラス
     */
    var ResourcesPage = /** @class */ (function (_super) {
        __extends(ResourcesPage, _super);
        /**
         * constructor
         */
        function ResourcesPage() {
            return _super.call(this, "/templates/resources/index.html", "page-resources", {
                route: "resources(/:query)"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        ResourcesPage.prototype.events = function () {
            return {};
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        ResourcesPage.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        ResourcesPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        ResourcesPage.prototype.onPageBeforeShow = function (event, data) {
            console.log(TAG + "onPageBeforeShow");
            if (!this._pageUtils) {
                this._pageUtils = new page_utils_1.PageUtils({
                    el: this.$el,
                    category: page_utils_1.PageCategory.RESOURCES,
                    templateDirctory: "/templates/resources/",
                    categoryPageHash: "#resources",
                    defaultPageName: "links-external-documents"
                });
            }
            // ページコンテンツの切り替え
            this._pageUtils.changeContent();
            _super.prototype.onPageBeforeShow.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainershow" (旧:"pageshow") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        ResourcesPage.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        ResourcesPage.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        ResourcesPage.prototype.onPageHide = function (event, data) {
            console.log(TAG + "onPageHide");
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        ResourcesPage.prototype.onPageRemove = function (event) {
            console.log(TAG + "onPageRemove");
            if (this._pageUtils) {
                this._pageUtils.remove();
                this._pageUtils = null;
            }
            _super.prototype.onPageRemove.call(this, event);
        };
        return ResourcesPage;
    }(ui_1.PageView));
    exports.ResourcesPage = ResourcesPage;
    var __viewResourcesPage = new ResourcesPage();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VzLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAvc2NyaXB0cy92aWV3L3Jlc291cmNlcy9yZXNvdXJjZXMtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsSUFBTSxHQUFHLEdBQUcsdUJBQXVCLENBQUM7SUFFcEM7OztPQUdHO0lBQ0g7UUFBbUMsaUNBQXdCO1FBR3ZEOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0saUNBQWlDLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ3ZELEtBQUssRUFBRSxvQkFBb0I7YUFDOUIsQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsZ0JBQWdCO1FBRWhCLGtCQUFrQjtRQUNsQiw4QkFBTSxHQUFOO1lBQ0ksTUFBTSxDQUFDLEVBQ04sQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsd0JBQXdCO1FBRXhCOzs7O1dBSUc7UUFDSCwwQ0FBa0IsR0FBbEIsVUFBbUIsS0FBd0I7WUFDdkMsaUJBQU0sa0JBQWtCLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxrQ0FBVSxHQUFWLFVBQVcsS0FBd0I7WUFDL0IsaUJBQU0sVUFBVSxZQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNILHdDQUFnQixHQUFoQixVQUFpQixLQUF3QixFQUFFLElBQW1CO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHNCQUFTLENBQUM7b0JBQzVCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDWixRQUFRLEVBQUUseUJBQVksQ0FBQyxTQUFTO29CQUNoQyxnQkFBZ0IsRUFBRSx1QkFBdUI7b0JBQ3pDLGdCQUFnQixFQUFFLFlBQVk7b0JBQzlCLGVBQWUsRUFBRSwwQkFBMEI7aUJBQzlDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVoQyxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0NBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCx3Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0NBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDaEMsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILG9DQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUNELGlCQUFNLFlBQVksWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBS0wsb0JBQUM7SUFBRCxDQUFDLEFBbEhELENBQW1DLGFBQVEsR0FrSDFDO0lBbEhZLHNDQUFhO0lBb0gxQixJQUFNLG1CQUFtQixHQUFHLElBQUksYUFBYSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCYWNrYm9uZSBmcm9tIFwiYmFja2JvbmVcIjtcbmltcG9ydCB7IFBhZ2VWaWV3LCBTaG93RXZlbnREYXRhLCBIaWRlRXZlbnREYXRhIH0gZnJvbSBcImNkcC91aVwiO1xuXG5pbXBvcnQgeyBQYWdlVXRpbHMsIFBhZ2VDYXRlZ29yeSB9IGZyb20gXCIuLi9jb21tb24vcGFnZS11dGlsc1wiO1xuXG5jb25zdCBUQUcgPSBcIlt2aWV3LlJlc291cmNlc1BhZ2VdIFwiO1xuXG4vKipcbiAqIEBjbGFzcyBSZXNvdXJjZXNWaWV3XG4gKiBAYnJpZWYg44Oq44K944O844K544Kr44OG44K044Oq44O844Gu44Kv44Op44K5XG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZXNQYWdlIGV4dGVuZHMgUGFnZVZpZXc8QmFja2JvbmUuTW9kZWw+IHtcbiAgICBwcml2YXRlIF9wYWdlVXRpbHM6IFBhZ2VVdGlscztcblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiL3RlbXBsYXRlcy9yZXNvdXJjZXMvaW5kZXguaHRtbFwiLCBcInBhZ2UtcmVzb3VyY2VzXCIsIHtcbiAgICAgICAgICAgIHJvdXRlOiBcInJlc291cmNlcygvOnF1ZXJ5KVwiXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gRXZlbnQgSGFuZGxlclxuXG4gICAgLy8hIOOCpOODmeODs+ODiOODj+ODs+ODieODqeOBruODnuODg+ODlOODs+OCsFxuICAgIGV2ZW50cygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gT3ZlcnJpZGU6IFVJLlBhZ2VWaWV3XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY3JlYXRlXCIgKOaXpzpcInBhZ2Vpbml0XCIpIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlSW5pdChldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhUQUcgKyBcIm9uUGFnZUJlZm9yZVNob3dcIik7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9wYWdlVXRpbHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VVdGlscyA9IG5ldyBQYWdlVXRpbHMoe1xuICAgICAgICAgICAgICAgIGVsOiB0aGlzLiRlbCxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogUGFnZUNhdGVnb3J5LlJFU09VUkNFUyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURpcmN0b3J5OiBcIi90ZW1wbGF0ZXMvcmVzb3VyY2VzL1wiLFxuICAgICAgICAgICAgICAgIGNhdGVnb3J5UGFnZUhhc2g6IFwiI3Jlc291cmNlc1wiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRQYWdlTmFtZTogXCJsaW5rcy1leHRlcm5hbC1kb2N1bWVudHNcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g44Oa44O844K444Kz44Oz44OG44Oz44OE44Gu5YiH44KK5pu/44GIXG4gICAgICAgIHRoaXMuX3BhZ2VVdGlscy5jaGFuZ2VDb250ZW50KCk7XG5cbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXG4gICAgICovXG4gICAgb25QYWdlU2hvdyhldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IFNob3dFdmVudERhdGEpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlU2hvdyhldmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VCZWZvcmVIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVIaWRlKGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcmhpZGVcIiAo5penOlwicGFnZWhpZGVcIikg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhUQUcgKyBcIm9uUGFnZUhpZGVcIik7XG4gICAgICAgIHN1cGVyLm9uUGFnZUhpZGUoZXZlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKi9cbiAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0KTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKFRBRyArIFwib25QYWdlUmVtb3ZlXCIpO1xuICAgICAgICBpZiAodGhpcy5fcGFnZVV0aWxzKSB7XG4gICAgICAgICAgICB0aGlzLl9wYWdlVXRpbHMucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLl9wYWdlVXRpbHMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLm9uUGFnZVJlbW92ZShldmVudCk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQcml2YXRlIG1ldGhvZHNcblxufVxuXG5jb25zdCBfX3ZpZXdSZXNvdXJjZXNQYWdlID0gbmV3IFJlc291cmNlc1BhZ2UoKTtcbiJdfQ==
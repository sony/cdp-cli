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
    var TAG = "[view.GetStartedPage] ";
    /**
     * @class GetStartedView
     * @brief ホームページのクラス
     */
    var GetStartedPage = /** @class */ (function (_super) {
        __extends(GetStartedPage, _super);
        /**
         * constructor
         */
        function GetStartedPage() {
            return _super.call(this, "/templates/getstarted/index.html", "page-getstarted", {
                route: "getstarted(/:query)"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        GetStartedPage.prototype.events = function () {
            return {};
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        GetStartedPage.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        GetStartedPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        GetStartedPage.prototype.onPageBeforeShow = function (event, data) {
            console.log(TAG + "onPageBeforeShow");
            if (!this._pageUtils) {
                this._pageUtils = new page_utils_1.PageUtils({
                    el: this.$el,
                    category: page_utils_1.PageCategory.GETSTARTED,
                    templateDirctory: "/templates/getstarted/",
                    categoryPageHash: "#getstarted"
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
        GetStartedPage.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        GetStartedPage.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        GetStartedPage.prototype.onPageHide = function (event, data) {
            console.log(TAG + "onPageHide");
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        GetStartedPage.prototype.onPageRemove = function (event) {
            console.log(TAG + "onPageRemove");
            if (this._pageUtils) {
                this._pageUtils.remove();
                this._pageUtils = null;
            }
            _super.prototype.onPageRemove.call(this, event);
        };
        return GetStartedPage;
    }(ui_1.PageView));
    exports.GetStartedPage = GetStartedPage;
    var __viewGetStartedPage = new GetStartedPage();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0c3RhcnRlZC1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9nZXRzdGFydGVkL2dldHN0YXJ0ZWQtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsSUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUM7SUFFckM7OztPQUdHO0lBQ0g7UUFBb0Msa0NBQXdCO1FBR3hEOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0sa0NBQWtDLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQ3pELEtBQUssRUFBRSxxQkFBcUI7YUFDL0IsQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsZ0JBQWdCO1FBRWhCLGtCQUFrQjtRQUNsQiwrQkFBTSxHQUFOO1lBQ0ksTUFBTSxDQUFDLEVBQ04sQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsd0JBQXdCO1FBRXhCOzs7O1dBSUc7UUFDSCwyQ0FBa0IsR0FBbEIsVUFBbUIsS0FBd0I7WUFDdkMsaUJBQU0sa0JBQWtCLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxtQ0FBVSxHQUFWLFVBQVcsS0FBd0I7WUFDL0IsaUJBQU0sVUFBVSxZQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNILHlDQUFnQixHQUFoQixVQUFpQixLQUF3QixFQUFFLElBQW1CO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHNCQUFTLENBQUM7b0JBQzVCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDWixRQUFRLEVBQUUseUJBQVksQ0FBQyxVQUFVO29CQUNqQyxnQkFBZ0IsRUFBRSx3QkFBd0I7b0JBQzFDLGdCQUFnQixFQUFFLGFBQWE7aUJBQ2xDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVoQyxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsbUNBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCx5Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsbUNBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDaEMsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILHFDQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUNELGlCQUFNLFlBQVksWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBS0wscUJBQUM7SUFBRCxDQUFDLEFBakhELENBQW9DLGFBQVEsR0FpSDNDO0lBakhZLHdDQUFjO0lBbUgzQixJQUFNLG9CQUFvQixHQUFHLElBQUksY0FBYyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCYWNrYm9uZSBmcm9tIFwiYmFja2JvbmVcIjtcbmltcG9ydCB7IFBhZ2VWaWV3LCBTaG93RXZlbnREYXRhLCBIaWRlRXZlbnREYXRhIH0gZnJvbSBcImNkcC91aVwiO1xuXG5pbXBvcnQgeyBQYWdlVXRpbHMsIFBhZ2VDYXRlZ29yeSB9IGZyb20gXCIuLi9jb21tb24vcGFnZS11dGlsc1wiO1xuXG5jb25zdCBUQUcgPSBcIlt2aWV3LkdldFN0YXJ0ZWRQYWdlXSBcIjtcblxuLyoqXG4gKiBAY2xhc3MgR2V0U3RhcnRlZFZpZXdcbiAqIEBicmllZiDjg5vjg7zjg6Djg5rjg7zjgrjjga7jgq/jg6njgrlcbiAqL1xuZXhwb3J0IGNsYXNzIEdldFN0YXJ0ZWRQYWdlIGV4dGVuZHMgUGFnZVZpZXc8QmFja2JvbmUuTW9kZWw+IHtcbiAgICBwcml2YXRlIF9wYWdlVXRpbHM6IFBhZ2VVdGlscztcblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiL3RlbXBsYXRlcy9nZXRzdGFydGVkL2luZGV4Lmh0bWxcIiwgXCJwYWdlLWdldHN0YXJ0ZWRcIiwge1xuICAgICAgICAgICAgcm91dGU6IFwiZ2V0c3RhcnRlZCgvOnF1ZXJ5KVwiXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gRXZlbnQgSGFuZGxlclxuXG4gICAgLy8hIOOCpOODmeODs+ODiOODj+ODs+ODieODqeOBruODnuODg+ODlOODs+OCsFxuICAgIGV2ZW50cygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gT3ZlcnJpZGU6IFVJLlBhZ2VWaWV3XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY3JlYXRlXCIgKOaXpzpcInBhZ2Vpbml0XCIpIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlSW5pdChldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhUQUcgKyBcIm9uUGFnZUJlZm9yZVNob3dcIik7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9wYWdlVXRpbHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VVdGlscyA9IG5ldyBQYWdlVXRpbHMoe1xuICAgICAgICAgICAgICAgIGVsOiB0aGlzLiRlbCxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogUGFnZUNhdGVnb3J5LkdFVFNUQVJURUQsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEaXJjdG9yeTogXCIvdGVtcGxhdGVzL2dldHN0YXJ0ZWQvXCIsXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlQYWdlSGFzaDogXCIjZ2V0c3RhcnRlZFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyDjg5rjg7zjgrjjgrPjg7Pjg4bjg7Pjg4Tjga7liIfjgormm7/jgYhcbiAgICAgICAgdGhpcy5fcGFnZVV0aWxzLmNoYW5nZUNvbnRlbnQoKTtcblxuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVTaG93KGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcnNob3dcIiAo5penOlwicGFnZXNob3dcIikg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VTaG93KGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWhpZGVcIiDjgavlr77lv5xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxuICAgICAqL1xuICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBIaWRlRXZlbnREYXRhKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUhpZGUoZXZlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyaGlkZVwiICjml6c6XCJwYWdlaGlkZVwiKSDjgavlr77lv5xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxuICAgICAqL1xuICAgIG9uUGFnZUhpZGUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBIaWRlRXZlbnREYXRhKTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKFRBRyArIFwib25QYWdlSGlkZVwiKTtcbiAgICAgICAgc3VwZXIub25QYWdlSGlkZShldmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqL1xuICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coVEFHICsgXCJvblBhZ2VSZW1vdmVcIik7XG4gICAgICAgIGlmICh0aGlzLl9wYWdlVXRpbHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VVdGlscy5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VVdGlscyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIub25QYWdlUmVtb3ZlKGV2ZW50KTtcbiAgICB9XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFByaXZhdGUgbWV0aG9kc1xuXG59XG5cbmNvbnN0IF9fdmlld0dldFN0YXJ0ZWRQYWdlID0gbmV3IEdldFN0YXJ0ZWRQYWdlKCk7XG4iXX0=
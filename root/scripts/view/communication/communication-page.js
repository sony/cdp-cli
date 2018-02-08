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
    var TAG = "[view.CommunicationPage] ";
    /**
     * @class CommunicationView
     * @brief コミュニケーションカテゴリーのクラス
     */
    var CommunicationPage = /** @class */ (function (_super) {
        __extends(CommunicationPage, _super);
        /**
         * constructor
         */
        function CommunicationPage() {
            return _super.call(this, "/templates/communication/index.html", "page-communication", {
                route: "communication(/:query)"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        CommunicationPage.prototype.events = function () {
            return {};
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        CommunicationPage.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        CommunicationPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        CommunicationPage.prototype.onPageBeforeShow = function (event, data) {
            console.log(TAG + "onPageBeforeShow");
            if (!this._pageUtils) {
                this._pageUtils = new page_utils_1.PageUtils({
                    el: this.$el,
                    category: page_utils_1.PageCategory.COMMUNICATION,
                    templateDirctory: "/templates/communication/",
                    categoryPageHash: "#communication",
                    defaultPageName: "contact"
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
        CommunicationPage.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        CommunicationPage.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        CommunicationPage.prototype.onPageHide = function (event, data) {
            console.log(TAG + "onPageHide");
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        CommunicationPage.prototype.onPageRemove = function (event) {
            console.log(TAG + "onPageRemove");
            if (this._pageUtils) {
                this._pageUtils.remove();
                this._pageUtils = null;
            }
            _super.prototype.onPageRemove.call(this, event);
        };
        return CommunicationPage;
    }(ui_1.PageView));
    exports.CommunicationPage = CommunicationPage;
    var __viewCommunicationPage = new CommunicationPage();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbXVuaWNhdGlvbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9jb21tdW5pY2F0aW9uL2NvbW11bmljYXRpb24tcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsSUFBTSxHQUFHLEdBQUcsMkJBQTJCLENBQUM7SUFFeEM7OztPQUdHO0lBQ0g7UUFBdUMscUNBQXdCO1FBRzNEOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0scUNBQXFDLEVBQUUsb0JBQW9CLEVBQUU7Z0JBQy9ELEtBQUssRUFBRSx3QkFBd0I7YUFDbEMsQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsZ0JBQWdCO1FBRWhCLGtCQUFrQjtRQUNsQixrQ0FBTSxHQUFOO1lBQ0ksTUFBTSxDQUFDLEVBQ04sQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsd0JBQXdCO1FBRXhCOzs7O1dBSUc7UUFDSCw4Q0FBa0IsR0FBbEIsVUFBbUIsS0FBd0I7WUFDdkMsaUJBQU0sa0JBQWtCLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxzQ0FBVSxHQUFWLFVBQVcsS0FBd0I7WUFDL0IsaUJBQU0sVUFBVSxZQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNILDRDQUFnQixHQUFoQixVQUFpQixLQUF3QixFQUFFLElBQW1CO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHNCQUFTLENBQUM7b0JBQzVCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDWixRQUFRLEVBQUUseUJBQVksQ0FBQyxhQUFhO29CQUNwQyxnQkFBZ0IsRUFBRSwyQkFBMkI7b0JBQzdDLGdCQUFnQixFQUFFLGdCQUFnQjtvQkFDbEMsZUFBZSxFQUFFLFNBQVM7aUJBQzdCLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVoQyxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsc0NBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCw0Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsc0NBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDaEMsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILHdDQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUNELGlCQUFNLFlBQVksWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBS0wsd0JBQUM7SUFBRCxDQUFDLEFBbEhELENBQXVDLGFBQVEsR0FrSDlDO0lBbEhZLDhDQUFpQjtJQW9IOUIsSUFBTSx1QkFBdUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCYWNrYm9uZSBmcm9tIFwiYmFja2JvbmVcIjtcbmltcG9ydCB7IFBhZ2VWaWV3LCBTaG93RXZlbnREYXRhLCBIaWRlRXZlbnREYXRhIH0gZnJvbSBcImNkcC91aVwiO1xuXG5pbXBvcnQgeyBQYWdlVXRpbHMsIFBhZ2VDYXRlZ29yeSB9IGZyb20gXCIuLi9jb21tb24vcGFnZS11dGlsc1wiO1xuXG5jb25zdCBUQUcgPSBcIlt2aWV3LkNvbW11bmljYXRpb25QYWdlXSBcIjtcblxuLyoqXG4gKiBAY2xhc3MgQ29tbXVuaWNhdGlvblZpZXdcbiAqIEBicmllZiDjgrPjg5/jg6Xjg4vjgrHjg7zjgrfjg6fjg7Pjgqvjg4bjgrTjg6rjg7zjga7jgq/jg6njgrlcbiAqL1xuZXhwb3J0IGNsYXNzIENvbW11bmljYXRpb25QYWdlIGV4dGVuZHMgUGFnZVZpZXc8QmFja2JvbmUuTW9kZWw+IHtcbiAgICBwcml2YXRlIF9wYWdlVXRpbHM6IFBhZ2VVdGlscztcblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiL3RlbXBsYXRlcy9jb21tdW5pY2F0aW9uL2luZGV4Lmh0bWxcIiwgXCJwYWdlLWNvbW11bmljYXRpb25cIiwge1xuICAgICAgICAgICAgcm91dGU6IFwiY29tbXVuaWNhdGlvbigvOnF1ZXJ5KVwiXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gRXZlbnQgSGFuZGxlclxuXG4gICAgLy8hIOOCpOODmeODs+ODiOODj+ODs+ODieODqeOBruODnuODg+ODlOODs+OCsFxuICAgIGV2ZW50cygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gT3ZlcnJpZGU6IFVJLlBhZ2VWaWV3XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY3JlYXRlXCIgKOaXpzpcInBhZ2Vpbml0XCIpIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlSW5pdChldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhUQUcgKyBcIm9uUGFnZUJlZm9yZVNob3dcIik7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9wYWdlVXRpbHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VVdGlscyA9IG5ldyBQYWdlVXRpbHMoe1xuICAgICAgICAgICAgICAgIGVsOiB0aGlzLiRlbCxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogUGFnZUNhdGVnb3J5LkNPTU1VTklDQVRJT04sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEaXJjdG9yeTogXCIvdGVtcGxhdGVzL2NvbW11bmljYXRpb24vXCIsXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlQYWdlSGFzaDogXCIjY29tbXVuaWNhdGlvblwiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRQYWdlTmFtZTogXCJjb250YWN0XCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIOODmuODvOOCuOOCs+ODs+ODhuODs+ODhOOBruWIh+OCiuabv+OBiFxuICAgICAgICB0aGlzLl9wYWdlVXRpbHMuY2hhbmdlQ29udGVudCgpO1xuXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxuICAgICAqL1xuICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBTaG93RXZlbnREYXRhKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3JlaGlkZVwiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXG4gICAgICovXG4gICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEhpZGVFdmVudERhdGEpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlSGlkZShldmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJoaWRlXCIgKOaXpzpcInBhZ2VoaWRlXCIpIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXG4gICAgICovXG4gICAgb25QYWdlSGlkZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEhpZGVFdmVudERhdGEpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coVEFHICsgXCJvblBhZ2VIaWRlXCIpO1xuICAgICAgICBzdXBlci5vblBhZ2VIaWRlKGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhUQUcgKyBcIm9uUGFnZVJlbW92ZVwiKTtcbiAgICAgICAgaWYgKHRoaXMuX3BhZ2VVdGlscykge1xuICAgICAgICAgICAgdGhpcy5fcGFnZVV0aWxzLnJlbW92ZSgpO1xuICAgICAgICAgICAgdGhpcy5fcGFnZVV0aWxzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUHJpdmF0ZSBtZXRob2RzXG5cbn1cblxuY29uc3QgX192aWV3Q29tbXVuaWNhdGlvblBhZ2UgPSBuZXcgQ29tbXVuaWNhdGlvblBhZ2UoKTtcbiJdfQ==
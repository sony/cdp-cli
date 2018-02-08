define(["require", "exports", "underscore", "highlight"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.activateAllExternalLinks = function ($parents) {
            // アンカータグを探す
            var $links = $parents.find("a");
            $links.each(function (index, elem) {
                var $link = $(elem);
                var href = $link.attr("href").toLowerCase();
                // http:// or https:// で始まる場合は外部リンクとして扱う
                // mailto で始まる場合は、デフォルトの動作をさせる
                if (href) {
                    if (href.indexOf("http://") === 0 ||
                        href.indexOf("https://") === 0) {
                        $link.attr({
                            "target": "_blank",
                            "rel": "external",
                            "data-no-vclick-handle": "true",
                        });
                    }
                    else if (href.indexOf("mailto") === 0) {
                        $link.attr({
                            "rel": "external",
                            "data-no-vclick-handle": "true",
                        });
                    }
                }
            });
        };
        /**
         * `string`を <code>string</code> に置換する
         * @param  $parents
         */
        Utils.activateInlineCode = function ($parents) {
            // p, li タグを探す
            var $elems = $parents.find("p, li");
            $elems.each(function (index, elem) {
                var $elem = $(elem);
                var html = $elem.html();
                // "`" で分割する
                var splits = html.split("`");
                var count = splits.length;
                var newHtml = "";
                // <code> </code> を挿入
                for (var i = 0; i < count; i++) {
                    newHtml += splits[i];
                    if (i % 2 === 0 && i < count - 2) {
                        newHtml += "<code>";
                    }
                    else if (i % 2 === 1) {
                        newHtml += "</code>";
                    }
                }
                $elem.html(newHtml);
            });
        };
        /**
         * hignlight.js を有効化する
         */
        Utils.activateHighlight = function ($parents) {
            // <pre class="hljspre"></pre> の中身を HTML エスケープし、<code> で wrap する
            var $hljspre = $parents.find(".hljspre");
            $hljspre.each(function (index, elem) {
                var $elem = $(elem);
                var className = $elem.attr("class");
                var html = $elem.html();
                var $code = $("<code />").html(_.escape(html));
                if (className) {
                    $code.addClass(className);
                }
                $code.removeClass("hljspre");
                $elem.empty();
                $elem.append($code);
            });
            // <pre><code>...</code></pre> を探す
            var $elems = $parents.find("pre code");
            $elems.each(function (index, elem) {
                window.hljs.highlightBlock(elem);
            });
        };
        return Utils;
    }());
    exports.Utils = Utils;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3NjcmlwdHMvdXRpbC9mdW5jdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBR0E7UUFBQTtRQWdGQSxDQUFDO1FBL0VVLDhCQUF3QixHQUEvQixVQUFnQyxRQUFnQjtZQUM1QyxZQUFZO1lBQ1osSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUk7Z0JBQ3BCLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDOUMsd0NBQXdDO2dCQUN4Qyw4QkFBOEI7Z0JBQzlCLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ04sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO3dCQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUM7NEJBQ1AsUUFBUSxFQUFFLFFBQVE7NEJBQ2xCLEtBQUssRUFBRSxVQUFVOzRCQUNqQix1QkFBdUIsRUFBRSxNQUFNO3lCQUNsQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxLQUFLLENBQUMsSUFBSSxDQUFDOzRCQUNQLEtBQUssRUFBRSxVQUFVOzRCQUNqQix1QkFBdUIsRUFBRSxNQUFNO3lCQUNsQyxDQUFDLENB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bnQiOlsiaW1wb3J0IFwiaGlnaGxpZ2h0XCI7XG5pbXBvcnQgKiBhcyBfIGZyb20gXCJ1bmRlcnNjb3JlXCI7XG5cbmV4cG9ydCBjbGFzcyBVdGlscyB7XG4gICAgc3RhdGljIGFjdGl2YXRlQWxsRXh0ZXJuYWxMaW5rcygkcGFyZW50czogSlF1ZXJ5KTogdm9pZCB7XG4gICAgICAgIC8vIOOCouODs+OCq+ODvOOCv+OCsOOCkuaOouOBmVxuICAgICAgICBjb25zdCAkbGlua3MgPSAkcGFyZW50cy5maW5kKFwiYVwiKTtcbiAgICAgICAgJGxpbmtzLmVhY2goKGluZGV4LCBlbGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkbGluayA9ICQoZWxlbSk7XG4gICAgICAgICAgICBjb25zdCBocmVmID0gJGxpbmsuYXR0cihcImhyZWZcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIC8vIGh0dHA6Ly8gb3IgaHR0cHM6Ly8g44Gn5aeL44G+44KL5aC05ZCI44Gv5aSW6YOo44Oq44Oz44Kv44Go44GX44Gm5omx44GGXG4gICAgICAgICAgICAvLyBtYWlsdG8g44Gn5aeL44G+44KL5aC05ZCI44Gv44CB44OH44OV44Kp44Or44OI44Gu5YuV5L2c44KS44GV44Gb44KLXG4gICAgICAgICAgICBpZihocmVmKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhyZWYuaW5kZXhPZihcImh0dHA6Ly9cIikgPT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgaHJlZi5pbmRleE9mKFwiaHR0cHM6Ly9cIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJGxpbmsuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInRhcmdldFwiOiBcIl9ibGFua1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWxcIjogXCJleHRlcm5hbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLW5vLXZjbGljay1oYW5kbGVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaHJlZi5pbmRleE9mKFwibWFpbHRvXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaW5rLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWxcIjogXCJleHRlcm5hbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLW5vLXZjbGljay1oYW5kbGVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYHN0cmluZ2DjgpIgPGNvZGU+c3RyaW5nPC9jb2RlPiDjgavnva7mj5vjgZnjgotcbiAgICAgKiBAcGFyYW0gICRwYXJlbnRzXG4gICAgICovXG4gICAgc3RhdGljIGFjdGl2YXRlSW5saW5lQ29kZSgkcGFyZW50czogSlF1ZXJ5KTogdm9pZCB7XG4gICAgICAgIC8vIHAsIGxpIOOCv+OCsOOCkuaOouOBmVxuICAgICAgICBjb25zdCAkZWxlbXMgPSAkcGFyZW50cy5maW5kKFwicCwgbGlcIik7XG4gICAgICAgICRlbGVtcy5lYWNoKChpbmRleCwgZWxlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xuICAgICAgICAgICAgY29uc3QgaHRtbCA9ICRlbGVtLmh0bWwoKTtcbiAgICAgICAgICAgIC8vIFwiYFwiIOOBp+WIhuWJsuOBmeOCi1xuICAgICAgICAgICAgY29uc3Qgc3BsaXRzID0gaHRtbC5zcGxpdChcImBcIik7XG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IHNwbGl0cy5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgbmV3SHRtbCA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8vIDxjb2RlPiA8L2NvZGU+IOOCkuaMv+WFpVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbmV3SHRtbCArPSBzcGxpdHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGkgJSAyID09PSAwICYmIGkgPCBjb3VudCAtIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SHRtbCArPSBcIjxjb2RlPlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SHRtbCArPSBcIjwvY29kZT5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkZWxlbS5odG1sKG5ld0h0bWwpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBoaWdubGlnaHQuanMg44KS5pyJ5Yq55YyW44GZ44KLXG4gICAgICovXG4gICAgc3RhdGljIGFjdGl2YXRlSGlnaGxpZ2h0KCRwYXJlbnRzOiBKUXVlcnkpOiB2b2lkIHtcbiAgICAgICAgLy8gPHByZSBjbGFzcz1cImhsanNwcmVcIj48L3ByZT4g44Gu5Lit6Lqr44KSIEhUTUwg44Ko44K544Kx44O844OX44GX44CBPGNvZGU+IOOBpyB3cmFwIOOBmeOCi1xuICAgICAgICBjb25zdCAkaGxqc3ByZSA9ICRwYXJlbnRzLmZpbmQoXCIuaGxqc3ByZVwiKTtcbiAgICAgICAgJGhsanNwcmUuZWFjaCgoaW5kZXgsIGVsZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcbiAgICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9ICRlbGVtLmF0dHIoXCJjbGFzc1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSAkZWxlbS5odG1sKCk7XG4gICAgICAgICAgICBjb25zdCAkY29kZSA9ICQoXCI8Y29kZSAvPlwiKS5odG1sKF8uZXNjYXBlKGh0bWwpKTtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAkY29kZS5hZGRDbGFzcyhjbGFzc05hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJGNvZGUucmVtb3ZlQ2xhc3MoXCJobGpzcHJlXCIpO1xuICAgICAgICAgICAgJGVsZW0uZW1wdHkoKTtcbiAgICAgICAgICAgICRlbGVtLmFwcGVuZCgkY29kZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIDxwcmU+PGNvZGU+Li4uPC9jb2RlPjwvcHJlPiDjgpLmjqLjgZlcbiAgICAgICAgY29uc3QgJGVsZW1zID0gJHBhcmVudHMuZmluZChcInByZSBjb2RlXCIpO1xuICAgICAgICAkZWxlbXMuZWFjaCgoaW5kZXgsIGVsZW0pID0+IHtcbiAgICAgICAgICAgICg8YW55PndpbmRvdykuaGxqcy5oaWdobGlnaHRCbG9jayhlbGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==
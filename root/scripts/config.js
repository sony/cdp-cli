var Config;
(function (Config) {
    var global = Function("return this")();
    //_____________________________________________________________________________________________//
    /**
     * build config
     */
    Config.DEBUG = (function () {
        return !!("%% build_setting %%");
    })();
    //_____________________________________________________________________________________________//
    /**
     * requirejs
     */
    global.requirejs = (function () {
        var _index = function (path) {
            return "../" + path;
        };
        var _module = function (name, file) {
            return _index("external/") + name + "/scripts/" + (file ? file : name);
        };
        var _lib = function (name) {
            return _index("lib/scripts/") + name;
        };
        var _porting = function (name) {
            return _index("porting/scripts/") + name;
        };
        var _assign_package = function (_config, _path, name, main) {
            if (Config.DEBUG) {
                _config.packages = _config.packages || [];
                _config.packages.push({
                    name: name,
                    location: _path(name),
                    main: main,
                });
            }
            else {
                _config.paths[name] = _path(name);
            }
        };
        var _baseUrl = (function () {
            var webRoot = /(.+\/)[^/]*#[^/]+/.exec(location.href);
            if (!webRoot) {
                webRoot = /(.+\/)/.exec(location.href);
            }
            return webRoot[1] + "scripts/";
        })();
        //////////////////////////////////////////////////////////////////////////
        /**
         * require.config
         */
        var config = {
            baseUrl: _baseUrl,
            urlArgs: "bust=" + Date.now(),
            // >>>EXTERNAL_MODULES>>> external module entry
            paths: {
                // external modules
                "jquery": _module("jquery"),
                "underscore": _module("underscore"),
                "backbone": _module("backbone"),
                "hogan": _module("hogan"),
                "hammerjs": _module("hammerjs", "hammer"),
                "jquery-hammerjs": _module("hammerjs", "jquery.hammer"),
                "highlight": _module("highlight"),
                // core frameworks
                "cdp": _module("cdp"),
                "cordova": _index("cordova"),
            },
            // <<<EXTERNAL_MODULES<<<
            shim: {},
            packages: [],
        };
        /* tslint:disable:no-unused-variable no-unused-vars */
        /* eslint-disable no-unused-vars */
        // internal library declaretion:
        var assign_lib = _assign_package.bind(null, config, _lib);
        var assign_porting = _assign_package.bind(null, config, _porting);
        // >>>LIB_DEPENDENCIES>>> package assign
        // <<<LIB_DEPENDENCIES<<<
        /* tslint:enable:no-unused-variable no-unused-vars */
        /* eslint-enable no-unused-vars */
        return config;
    })();
    //_____________________________________________________________________________________________//
    /**
     * jQuery settings
     */
    Config.jquery = {
        ajaxSetup: { cache: false },
    };
    /**
     * jQuery Mobile settings
     * http://api.jquerymobile.com/global-config/
     */
    Config.jquerymobile = {
        allowCrossDomainPages: true,
        defaultPageTransition: "none",
        hashListeningEnabled: false,
        pushStateEnabled: false,
    };
    //_____________________________________________________________________________________________//
    /**
     * localize resource settings
     */
    Config.i18n = {
        fallbackResources: {
            en: {
                messages: "/res/locales/messages.en-US.json",
            },
            ja: {
                messages: "/res/locales/messages.ja-JP.json",
            },
        },
        // available options
        // http://i18next.com/docs/options/#init-options
        options: {
            preload: [
                "en-US",
                "ja-JP",
            ],
            fallbackLng: "en-US",
            ns: "messages",
            defaultNS: "messages",
            backend: {
                loadPath: "res/locales/{{ns}}.{{lng}}.json",
            },
            detection: {
                order: ["cookie", "navigator"],
                caches: false,
            },
            cache: {
                enable: false,
            },
        },
    };
})(Config || (Config = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL3NjcmlwdHMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsTUFBTSxDQWlLZjtBQWpLRCxXQUFVLE1BQU07SUFFWixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztJQUV6QyxpR0FBaUc7SUFFakc7O09BRUc7SUFDVSxZQUFLLEdBQUcsQ0FBQztRQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRUwsaUdBQWlHO0lBRWpHOztPQUVHO0lBQ0gsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDO1FBQ2hCLElBQU0sTUFBTSxHQUFHLFVBQUMsSUFBWTtZQUN4QixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN4QixDQUFDLENBQUM7UUFDRixJQUFNLE9BQU8sR0FBRyxVQUFDLElBQVksRUFBRSxJQUFhO1lBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxHQUFHLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUM7UUFDRixJQUFNLElBQUksR0FBRyxVQUFDLElBQVk7WUFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDekMsQ0FBQyxDQUFDO1FBQ0YsSUFBTSxRQUFRLEdBQUcsVUFBQyxJQUFZO1lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDN0MsQ0FBQyxDQUFDO1FBQ0YsSUFBTSxlQUFlLEdBQUcsVUFDcEIsT0FBd0MsRUFDeEMsS0FBK0IsRUFDL0IsSUFBWSxFQUFFLElBQWE7WUFDM0Is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O1lBQ2YsRUFBRSxFQUFFO2dCQUNBLFFBQVEsRUFBRSxrQ0FBa0M7YUFDL0M7WUFDRCxFQUFFLEVBQUU7Z0JBQ0EsUUFBUSxFQUFFLGtDQUFrQzthQUMvQztTQUNKO1FBQ0Qsb0JBQW9CO1FBQ3BCLGdEQUFnRDtRQUNoRCxPQUFPLEVBQUU7WUFDTCxPQUFPLEVBQUU7Z0JBQ0wsT0FBTztnQkFDUCxPQUFPO2FBQ1Y7WUFDRCxXQUFXLEVBQUUsT0FBTztZQUNwQixFQUFFLEVBQUUsVUFBVTtZQUNkLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLE9BQU8sRUFBRTtnQkFDTCxRQUFRLEVBQUUsaUNBQWlDO2FBQzlDO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7Z0JBQzlCLE1BQU0sRUFBRSxLQUFLO2FBQ2hCO1lBQ0QsS0FBSyxFQUFFO2dCQUNILE1BQU0sRUFBRSxLQUFLO2FBQ2hCO1NBQ0o7S0FDSixDQUFDO0FBQ04sQ0FBQyxFQWpLUyxNQUFNLEtBQU4sTUFBTSxRQWlLZiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDb25maWcge1xuXG4gICAgY29uc3QgZ2xvYmFsID0gRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xuXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xuXG4gICAgLyoqXG4gICAgICogYnVpbGQgY29uZmlnXG4gICAgICovXG4gICAgZXhwb3J0IGNvbnN0IERFQlVHID0gKCgpOiBib29sZWFuID0+IHtcbiAgICAgICAgcmV0dXJuICEhKFwiJSUgYnVpbGRfc2V0dGluZyAlJVwiKTtcbiAgICB9KSgpO1xuXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xuXG4gICAgLyoqXG4gICAgICogcmVxdWlyZWpzXG4gICAgICovXG4gICAgZ2xvYmFsLnJlcXVpcmVqcyA9ICgoKSA9PiB7XG4gICAgICAgIGNvbnN0IF9pbmRleCA9IChwYXRoOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBcIi4uL1wiICsgcGF0aDtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX21vZHVsZSA9IChuYW1lOiBzdHJpbmcsIGZpbGU/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF9pbmRleChcImV4dGVybmFsL1wiKSArIG5hbWUgKyBcIi9zY3JpcHRzL1wiICsgKGZpbGUgPyBmaWxlIDogbmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IF9saWIgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiBfaW5kZXgoXCJsaWIvc2NyaXB0cy9cIikgKyBuYW1lO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfcG9ydGluZyA9IChuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF9pbmRleChcInBvcnRpbmcvc2NyaXB0cy9cIikgKyBuYW1lO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfYXNzaWduX3BhY2thZ2UgPSAoXG4gICAgICAgICAgICBfY29uZmlnOiB7IHBhdGhzOiB7fTsgcGFja2FnZXM/OiB7fVtdOyB9LFxuICAgICAgICAgICAgX3BhdGg6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyxcbiAgICAgICAgICAgIG5hbWU6IHN0cmluZywgbWFpbj86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKERFQlVHKSB7XG4gICAgICAgICAgICAgICAgX2NvbmZpZy5wYWNrYWdlcyA9IF9jb25maWcucGFja2FnZXMgfHwgW107XG4gICAgICAgICAgICAgICAgX2NvbmZpZy5wYWNrYWdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IF9wYXRoKG5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBtYWluOiBtYWluLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfY29uZmlnLnBhdGhzW25hbWVdID0gX3BhdGgobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgX2Jhc2VVcmwgPSAoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHdlYlJvb3QgPSAvKC4rXFwvKVteL10qI1teL10rLy5leGVjKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgaWYgKCF3ZWJSb290KSB7XG4gICAgICAgICAgICAgICAgd2ViUm9vdCA9IC8oLitcXC8pLy5leGVjKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHdlYlJvb3RbMV0gKyBcInNjcmlwdHMvXCI7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVxdWlyZS5jb25maWdcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGJhc2VVcmw6IF9iYXNlVXJsLFxuICAgICAgICAgICAgdXJsQXJnczogXCJidXN0PVwiICsgRGF0ZS5ub3coKSxcblxuICAgICAgICAgICAgLy8gPj4+RVhURVJOQUxfTU9EVUxFUz4+PiBleHRlcm5hbCBtb2R1bGUgZW50cnlcbiAgICAgICAgICAgIHBhdGhzOiB7XG4gICAgICAgICAgICAgICAgLy8gZXh0ZXJuYWwgbW9kdWxlc1xuICAgICAgICAgICAgICAgIFwianF1ZXJ5XCI6IF9tb2R1bGUoXCJqcXVlcnlcIiksXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnNjb3JlXCI6IF9tb2R1bGUoXCJ1bmRlcnNjb3JlXCIpLFxuICAgICAgICAgICAgICAgIFwiYmFja2JvbmVcIjogX21vZHVsZShcImJhY2tib25lXCIpLFxuICAgICAgICAgICAgICAgIFwiaG9nYW5cIjogX21vZHVsZShcImhvZ2FuXCIpLFxuICAgICAgICAgICAgICAgIFwiaGFtbWVyanNcIjogX21vZHVsZShcImhhbW1lcmpzXCIsIFwiaGFtbWVyXCIpLFxuICAgICAgICAgICAgICAgIFwianF1ZXJ5LWhhbW1lcmpzXCI6IF9tb2R1bGUoXCJoYW1tZXJqc1wiLCBcImpxdWVyeS5oYW1tZXJcIiksXG4gICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjogX21vZHVsZShcImhpZ2hsaWdodFwiKSxcblxuICAgICAgICAgICAgICAgIC8vIGNvcmUgZnJhbWV3b3Jrc1xuICAgICAgICAgICAgICAgIFwiY2RwXCI6IF9tb2R1bGUoXCJjZHBcIiksXG4gICAgICAgICAgICAgICAgXCJjb3Jkb3ZhXCI6IF9pbmRleChcImNvcmRvdmFcIiksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gPDw8RVhURVJOQUxfTU9EVUxFUzw8PFxuXG4gICAgICAgICAgICBzaGltOiB7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBwYWNrYWdlczogW1xuICAgICAgICAgICAgICAgIC8vIERPIE5PVCBzZXR1cCBtYW51YWxseS5cbiAgICAgICAgICAgICAgICAvLyB1c2UgYXNzaWduX2xpYigpL2Fzc2luZ19wb3J0aW5nKClcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgICAgIC8vIGludGVybmFsIGxpYnJhcnkgZGVjbGFyZXRpb246XG4gICAgICAgIGNvbnN0IGFzc2lnbl9saWIgICAgICAgID0gX2Fzc2lnbl9wYWNrYWdlLmJpbmQobnVsbCwgY29uZmlnLCBfbGliKTtcbiAgICAgICAgY29uc3QgYXNzaWduX3BvcnRpbmcgICAgPSBfYXNzaWduX3BhY2thZ2UuYmluZChudWxsLCBjb25maWcsIF9wb3J0aW5nKTtcblxuICAgICAgICAvLyA+Pj5MSUJfREVQRU5ERU5DSUVTPj4+IHBhY2thZ2UgYXNzaWduXG4gICAgICAgIC8vIDw8PExJQl9ERVBFTkRFTkNJRVM8PDxcblxuICAgICAgICAvKiB0c2xpbnQ6ZW5hYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9KSgpO1xuXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xuXG4gICAgLyoqXG4gICAgICogalF1ZXJ5IHNldHRpbmdzXG4gICAgICovXG4gICAgZXhwb3J0IGNvbnN0IGpxdWVyeSA9IHtcbiAgICAgICAgYWpheFNldHVwOiB7IGNhY2hlOiBmYWxzZSB9LFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBqUXVlcnkgTW9iaWxlIHNldHRpbmdzXG4gICAgICogaHR0cDovL2FwaS5qcXVlcnltb2JpbGUuY29tL2dsb2JhbC1jb25maWcvXG4gICAgICovXG4gICAgZXhwb3J0IGNvbnN0IGpxdWVyeW1vYmlsZSA9IHtcbiAgICAgICAgYWxsb3dDcm9zc0RvbWFpblBhZ2VzOiB0cnVlLFxuICAgICAgICBkZWZhdWx0UGFnZVRyYW5zaXRpb246IFwibm9uZVwiLFxuICAgICAgICBoYXNoTGlzdGVuaW5nRW5hYmxlZDogZmFsc2UsXG4gICAgICAgIHB1c2hTdGF0ZUVuYWJsZWQ6IGZhbHNlLFxuICAgIH07XG5cbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXG5cbiAgICAvKipcbiAgICAgKiBsb2NhbGl6ZSByZXNvdXJjZSBzZXR0aW5nc1xuICAgICAqL1xuICAgIGV4cG9ydCBjb25zdCBpMThuOiBDRFAuSTE4TlNldHRpbmdzID0ge1xuICAgICAgICBmYWxsYmFja1Jlc291cmNlczoge1xuICAgICAgICAgICAgZW46IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlczogXCIvcmVzL2xvY2FsZXMvbWVzc2FnZXMuZW4tVVMuanNvblwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGphOiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IFwiL3Jlcy9sb2NhbGVzL21lc3NhZ2VzLmphLUpQLmpzb25cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGF2YWlsYWJsZSBvcHRpb25zXG4gICAgICAgIC8vIGh0dHA6Ly9pMThuZXh0LmNvbS9kb2NzL29wdGlvbnMvI2luaXQtb3B0aW9uc1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBwcmVsb2FkOiBbXG4gICAgICAgICAgICAgICAgXCJlbi1VU1wiLFxuICAgICAgICAgICAgICAgIFwiamEtSlBcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBmYWxsYmFja0xuZzogXCJlbi1VU1wiLFxuICAgICAgICAgICAgbnM6IFwibWVzc2FnZXNcIixcbiAgICAgICAgICAgIGRlZmF1bHROUzogXCJtZXNzYWdlc1wiLFxuICAgICAgICAgICAgYmFja2VuZDoge1xuICAgICAgICAgICAgICAgIGxvYWRQYXRoOiBcInJlcy9sb2NhbGVzL3t7bnN9fS57e2xuZ319Lmpzb25cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXRlY3Rpb246IHtcbiAgICAgICAgICAgICAgICBvcmRlcjogW1wiY29va2llXCIsIFwibmF2aWdhdG9yXCJdLFxuICAgICAgICAgICAgICAgIGNhY2hlczogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FjaGU6IHtcbiAgICAgICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xufVxuIl19
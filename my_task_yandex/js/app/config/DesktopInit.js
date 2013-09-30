// DesktopInit.js
// --------------
require.config({

    // Sets the js folder as the base directory for all future relative paths
    baseUrl: "./js",

    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
    // probably a good idea to keep version numbers in the file names for updates checking
    paths: {

        // Core Libraries
        // --------------
        "jquery": "libs/jquery",
        "jquery-scrollTo" : "libs/jquery-scrollTo",
        //"jqueryUI" : "libs/jquery-ui",
        //Bootstrap scripts
        //"bootstrap-datepicker" : "libs/bootstrap-datepicker",
        //"bootstrap-timepicker" : "libs/bootstrap-timepicker",
        "bootstrap-modal" : "libs/bootstrap-modal",
        "bootstrap" : "libs/bootstrap",

        "autocomplete" : "libs/autocomplete",
        "ajaxupload" : "libs/ajaxupload-36",

        "colorbox" : "libs/colorbox",

        //"jquery_ui" : "http://code.jquery.com/ui/1.9.0/jquery-ui",
        "jquery_ui" : "libs/jquery-ui",
        //"bootstrap-lan" : "libs/bootstrap-ru",

        "underscore": "libs/lodash",

        "backbone": "libs/backbone",
        "localstorage" : "libs/backbone-localstorage",

        "text": "libs/plugins/text",

        // Application Folders
        // -------------------
        "collections": "app/collections",

        "models": "app/models",

        "routers": "app/routers",

        "templates": "app/templates",

        "views": "app/views",

        "json2": "libs/json2"

    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {

        // Backbone
        "backbone": {

            // Depends on underscore/lodash and jQuery
            "deps": ["underscore", "jquery"],

            // Exports the global window.Backbone object
            "exports": "Backbone"

        },
        'localstorage': {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        'autocomplete': {
            deps: ['jquery']
        },
        'colorbox': {
            deps: ['jquery']
        },
        'bootstrap-modal': {
            deps: ['jquery']
        }

    }

});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["jquery", "json2", "backbone", "routers/Router"],
    function ($, JSON, Backbone, DesktopRouter) {
        $.cookie = function(name, value, options) {
            if (typeof value != 'undefined') { // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                // CAUTION: Needed to parenthesize options.path and options.domain
                // in the following expressions, otherwise they evaluate to undefined
                // in the packed version for some reason...
                var path = options.path ? '; path=' + (options.path) : '';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        };
        $.ajaxTransport("+*", function (options, originalOptions, jqXHR) {
            if (jQuery.browser.msie && window.XDomainRequest) {
                var xdr;
                return {
                    send: function (headers, completeCallback) {
                        // Use Microsoft XDR
                        xdr = new XDomainRequest();
                        xdr.open("get", options.url);
                        xdr.onload = function () {
                            if (this.contentType.match(/\/xml/)) {
                                var dom = new ActiveXObject("Microsoft.XMLDOM");
                                dom.async = false;
                                dom.loadXML(this.responseText);
                                completeCallback(200, "success", [dom]);
                            } else {
                                completeCallback(200, "success", [this.responseText]);
                            }
                        };
                        xdr.ontimeout = function () {
                            completeCallback(408, "error", ["The request timed out."]);
                        };
                        xdr.onerror = function () {
                            completeCallback(404, "error", ["The requested resource could not be found."]);
                        };
                        xdr.send();
                    },
                    abort: function () {
                        if (xdr)xdr.abort();
                    }
                };
            }
        });

        String.prototype.transliterate = function (){
            var text = this;
            return text.replace( /([а-яё])|([\s_])|([^a-z\d])/gi,
                function( all, ch, space, words, i ) {
                    if ( space || words ) {
                        return space ? ' ' : '';
                    }

                    var code = ch.charCodeAt(0),
                        next = text.charAt( i + 1 ),
                        index = code == 1025 || code == 1105 ? 0 :
                            code > 1071 ? code - 1071 : code - 1039,
                        t = ['yo','a','b','v','g','d','e','zh',
                            'z','i','y','k','l','m','n','o','p',
                            'r','s','t','u','f','h','c','ch','sh',
                            'shch','','y','','e','yu','ya'
                        ],
                        next = next && next.toUpperCase() === next ? 1 : 0;

                    return ch.toUpperCase() === ch ? next ? t[ index ].toUpperCase() :
                        t[ index ].substr(0,1).toUpperCase() +
                            t[ index ].substring(1) : t[ index ];
                }
            );
        };
        //$("#pageLoad").remove();
        // Instantiates a new Desktop Router instance
        new DesktopRouter();

    }

);
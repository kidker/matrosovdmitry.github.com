define(["jquery", "backbone", "models/Photo"],

    function ($, Backbone, Photo) {

        var PhotoCollection = Backbone.Collection.extend({
            model: Photo,
            totalCount: null,
            page: 1,
            autoload: true,
            url: function () {
                //return 'http://***.net/category/25/page/' + this.page + '?jr=true'
            },
            initialize: function (page) {
                this.page = page;
            },
            parse: function (data) {
                this.totalCount = data.totalCount;
                return data.result;
            },
            previous: function (model) {
                var index = this.indexOf(model);
                if (index < 1) { // 0 or -1
                    return null;
                }
                return this.models[index - 1];
            },
            next: function (model) {
                var index = this.indexOf(model);
                if (index == -1) {
                    return null;
                }
                if (index == this.models.length - 1) {
                    if (this.autoload) {
                        this.fetchNextPage({add: true, async: false});
                        var next = this.next(model);
                        if (next == "last"){
                            //switch off autoload to prevent endless recursion
                            this.autoload = false;
                        }
                        return next;
                    } else {
                        return "last";
                    }
                }
                return this.models[index + 1];
            },
            fetchNextPage: function (options) {
                this.page++;
                this.fetch(options);
            }
        });
        return PhotoCollection;
    }

);
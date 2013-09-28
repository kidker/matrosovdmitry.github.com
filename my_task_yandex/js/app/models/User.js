define(["jquery", "backbone"],
    function ($, Backbone) {
        var User = Backbone.Model.extend({
            initialize: function (options) {
                this.id = options.id;
            },
            url: function () {
               // return "http://***.net/user/profile/" + this.id + "?jr=true&loadPhotos=false";
            },
            parse: function (data) {
                return data.profile;
            }
        });
        return User;
    });
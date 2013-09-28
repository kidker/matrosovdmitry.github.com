define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Player = Backbone.Model.extend({
           // urlRoot : "/user/delete_action_type",

            sync: function(method, model, options) {
                options || (options = {});

                // passing options.url will override
                // the default construction of the url in Backbone.sync
                //CRUD
                switch (method) {
                    case "create" :
                        options.url = "/user/add_action_type/"+Math.random(1,1000);
                        options.type = "POST";
                        options.data = model.toJSON();
                        break;
                    case "read":
                        options.url = "/myservice/getUser.aspx?id="+model.get("id");
                        break;
                    case "update":
                        options.url = "/user/save_action_type/"+Math.random(1, 1000);
                        options.type = "POST";
                        //.1/2 WORK
                        //options.data = (model instanceof Backbone.Model)?model.toJSON():{};
                        options.data = model.toJSON();
                        break;
                    case "delete":
                        options.url = "/user/delete_action_type/"+model.get("id");
                        options.type = "POST";
                        break;
                }

                if (options.url)
                    Backbone.sync.call(model, method, model, options);
            },


            id : null,
            // Model Constructor
            initialize: function() {

            },


            // Default values for all of the Model attributes
            defaults: {

            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return Player;
    }

);
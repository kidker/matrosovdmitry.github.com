define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Team = Backbone.Model.extend({
            // urlRoot : "/user/delete_action_type",

            sync: function(method, model, options) {
                options || (options = {});

                // passing options.url will override
                // the default construction of the url in Backbone.sync
                //CRUD
                switch (method) {
                    case "create" :
                        options.url = "/user/add_team";
                        options.type = "POST";
                        options.data = model.toJSON();
                        break;
                    case "read":
                        options.url = "/myservice/getUser.aspx?id="+model.get("id");
                        break;
                    case "update":
                        options.url = "/user/save_team/"+Math.random(1, 1000);
                        options.type = "POST";
                        //.1/2 WORK
                        //options.data = (model instanceof Backbone.Model)?model.toJSON():{};
                        options.data = model.toJSON();
                        break;
                    case "delete":
                        //options.url = "/user/delete_action_type/"+model.get("id");
                        options.url = '/user/del_team_tour/'+Math.random(1, 1000);
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
            defaults : {
                //logo : 'images/no_photo_pic.gif'
            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return Team;
    }

);
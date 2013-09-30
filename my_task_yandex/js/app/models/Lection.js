define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var User = Backbone.Model.extend({
            // urlRoot : "/user/delete_action_type",
            /*
            sync: function(method, model, options) {
                options || (options = {});

                // passing options.url will override
                // the default construction of the url in Backbone.sync
                //CRUD
                switch (method) {
                    case "create" :
                        options.url = "http://localhost/backbone/backbone_video_kurs/server/users/addUser.php";
                        options.type = "POST";
                        options.data = model.toJSON();
                        break;
                    case "read":
                        options.url = "/myservice/getUser.aspx?id="+model.get("id");
                        break;
                    case "update":
                        options.url = "http://localhost/backbone/backbone_video_kurs/server/users/editUser.php";
                        options.type = "POST";
                        options.data = model.toJSON();
                        break;
                    case "delete":
                        options.url = 'http://localhost/backbone/backbone_video_kurs/server/users/delUser.php';
                        options.type = "POST";
                        options.data = model.toJSON();
                        break;
                }


                if (options.url)
                    Backbone.sync.call(model, method, model, options);
            },
*/

            id : null,
            // Model Constructor
            initialize: function() {

            },


            // Default values for all of the Model attributes
            defaults: {

            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {
                console.log("Method 'validate' - который делает валиадацию атрибутов");
                console.log(attrs);
            }

        });

        // Returns the Model class
        return User;
    }

);
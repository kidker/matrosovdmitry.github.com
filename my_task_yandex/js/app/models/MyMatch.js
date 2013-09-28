define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var MyMatch = Backbone.Model.extend({
            // urlRoot : "/user/delete_action_type",

            sync: function(method, model, options) {
                options || (options = {});

                // passing options.url will override
                // the default construction of the url in Backbone.sync
                //CRUD
                switch (method) {
                    case "create" :
                        options.url = "/user/add_match/"+Math.random(1, 1000);
                        options.type = "POST";
                        options.data = model.toJSON();
                        break;
                    case "read":
                        options.url = "/myservice/getUser.aspx?id="+model.get("id");
                        break;
                    case "update":
                        options.url = "user/edit_action/"+model.get('tour_id')+"/"+model.get("id");
                        options.type = "POST";
                        options.data = model.toJSON();
                        break;
                    case "delete":
                        options.url = '/user/del_match/'+Math.random(1,1000);
                        options.type = "POST";
                        break;
                }
                /*
                * function del_match(id)
                 {
                 $.ajax({
                 async: false,
                 url:	  '/user/del_match/'+Math.random(1,10000),
                 type:	  'POST',
                 dataType: 'json',
                 data: {match_id: id, tour_id:$('#tour_id').val()},
                 cache: false,
                 success:  function(msg){
                 if (msg.ans==1) {
                 $('#match'+id).fadeOut('slow');
                 setTimeout(function() {$('#match'+id).remove();},4000);
                 }
                 else {
                 var err = $('<div class="err">'+msg.err+'</div>').hide().fadeIn('slow');
                 $('#match'+id).before(err);
                 setTimeout(function() {$('.err').hide(300);$('.err').remove();},3000);
                 }
                 }
                 });
                 }
                * */

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
                console.log("Method 'validate' - который делает валиадацию атрибутов");
                console.log(attrs);
            }

        });

        // Returns the Model class
        return MyMatch;
    }

);
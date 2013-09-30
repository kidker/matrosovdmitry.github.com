define(["jquery", "backbone", "views/Users/UserItem"],
    function ($, Backbone, UserItem) {
        var UsersList = Backbone.View.extend({

            id: "my_users",
            //className : "user-item",
            tagName : "ul",
            loading: false,
            fetched: false,
            initialize: function () {
                console.log("->views/Users/UsersList.js");
                _.bindAll(this);

                //$(window).bind("scroll", this.scroll); //scroll infinity

                //this.collection.on("add", this.renderNewPhoto, this);
                this.collection.on("addUser", this.renderNewPhoto, this);

            },
            render: function () {

                var self = this;
                self.$el.empty();
                if (!this.fetched) {
                    self.startLoading();
                    self.collection.fetch({
                        success: function(){
                            self.fetched = true;
                            self.stopLoading();
                            self.render();
                        },
                        error: function(data, response){
                            //alert(response.responseText);
                        }
                    });
                } else {
                    //console.log(self.collection);

                    self.collection.each(function (model) {
                        self.renderNewPhoto(model);
                    });


                    //self._renderFirstFixedSizeElems(self.collection);
                }

                return this;
            },
            //Перерисовать коллекцию
            reRender : function(newCollection){
                var self = this;
                self.$el.empty();
                newCollection.each(function (model) {
                    self.renderNewPhoto(model);
                });
            },

            _renderFirstFixedSizeElems : function(renderCollection){
                console.log("_renderFirstFixedSizeElems");
                console.log(renderCollection);

                var count = renderCollection.totalCount;
                var count_render = renderCollection.count_render;
                console.log(count);
                console.log(count_render);

                if (count < count_render){
                    for (var i = 0;i < count;i++){
                        //console.log("a :"+i);
                        this.renderNewPhoto(renderCollection.at(i));
                    }
                }else{
                    for (var i = 0;i < count_render;i++){
                        //console.log("b : "+i);
                        this.renderNewPhoto(renderCollection.at(i));
                    }
                }
            },

            startLoading: function () {
               // this.$el.append("<img class='loading' style='display: block;' src='/js/app/img/a_loader.gif'/>");
                this.loading = true;
                return this;
            },
            stopLoading: function () {
                //this.$el.find('.loading').remove();
                this.loading = false;
                return this;
            },
            renderNewPhoto: function (model) {
                //console.log("renderNewPhoto");
                /*
                console.log("renderNewPhoto");
                if (model.get("id") == undefined){
                    model.set({ id : false });
                }
                if (model.get("hlogo") == undefined || model.get("alogo") == undefined){
                    model.set({
                        hlogo : "/images/no_photo_person.gif",
                        alogo : "/images/no_photo_person.gif"
                    });
                }

                if (model.get("htitle") == undefined){
                    model.set({ htitle : "" });
                }
                if (model.get("atitle") == undefined){
                    model.set({ atitle : "" });
                }
*/

                var view = new UserItem({ model : model });
                var content = view.render().el;
                //console.log(content);
                this.$el.append(content);
            },
            scroll: function () {
               console.log("Сработал скролл");
                if ($(window).scrollTop() + 250 >= $(document).height() - $(window).height()) {
                    this.collection.fetchNextPage();
                }
            },
            renderNextPage: function () {

                this.collection.fetchNextPage();
                /*
                if (!this.loading) {
                    var self = this;
                    self.startLoading();
                    this.collection.fetchNextPage(
                        {
                            add: true,
                            success: function () {
                                self.stopLoading();
                            }
                        }
                    );
                }
                */
            }
        });

        // Returns the View class
        return UsersList;
    }

);
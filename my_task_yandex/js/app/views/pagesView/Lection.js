define([
    "jquery", "backbone", "app/namespace", "jquery-scrollTo", "bootstrap",

    //Списки которые мы будем рендерить
    "collections/LectionsCollection",

    "text!templates/LectionProfile.html",

    "text!templates/mainTpls/Lection.html"//Template

],
    function ($, Backbone, namespace, jquery_scrollTo, bootstrap,

              LectionsCollection ,

              tpl_LectionProfile,

              template) {
        var IndexView = Backbone.View.extend({

            tagName : "div",
            events : {
               //"click #navbar-main .navbar-nav a" : "_initScrollToChangeMenu"
            },
            initialize: function () {
                _.bindAll(this);
                //Инциализация заменены меню
                //this._initChangeMenu();
                this.currentLectionsCollection = new LectionsCollection();

            },

            render: function(options){
                this.$el.empty().append( template );

                //После рендера шаблона подрубаем ScrollSpy
                //this._initScrollSpy();
                this.showLection(options.user_id);

                return this;
            },
            //Показать лекцию
            showLection: function(id){

                var self = this;
                this.currentLectionsCollection.fetch({success: function(){

                    var tpl = _.template(tpl_LectionProfile, self.currentLectionsCollection.get(id).toJSON());
                    $(self.el).find(".lection_info").empty().append(tpl);
                }});
            }
            //Globals Methods


        });

        // Returns the View class
        return IndexView;
    }

);
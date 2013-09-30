define([
    "jquery", "backbone",  "bootstrap", "app/namespace",
    //Списки которые мы будем рендерить
    "collections/UsersCollection",

    "text!templates/UserProfile.html",
    "text!templates/mainTpls/User.html"//Template

],
    function ($, Backbone,  bootstrap, namespace,
              UsersCollection,

              tpl_UserProfile,
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
                var self = this;
                this.currentUsersCollection = new UsersCollection();

            },
            _initScrollSpy: function(){

                // Cache selectors
                var self = this;
                var lastId,
                    topMenu = $(self.el).find("#navbar-main .navbar-nav"),
                    topMenuHeight = topMenu.outerHeight()+50,
                // All list items
                    menuItems = topMenu.find("a"),
                // Anchors corresponding to menu items
                    scrollItems = menuItems.map(function(){
                        var item = $(self.el).find($(this).attr("href"));
                        if (item.length) { return item; }
                    });


            // Bind to scroll
                $(window).scroll(function(){

                    // Get container scroll position
                    var fromTop = $(this).scrollTop()+topMenuHeight;

                    // Get id of current scroll item
                    var cur = scrollItems.map(function(){
                        if ($(this).offset().top < fromTop)
                            return this;
                    });
                    // Get the id of the current element
                    cur = cur[cur.length-1];

                    var id = cur && cur.length ? cur[0].id : "";

                    if (lastId !== id) {

                        lastId = id;
                        // Set/remove active class
                        menuItems
                            .parent().removeClass("active")
                            .end().filter("[href=#"+id+"]").parent().addClass("active");
                    }
                });

            },
            _initScrollToChangeMenu : function(e){

                e.preventDefault();

                $(e.currentTarget).parent().siblings().removeClass('active').end().addClass('active');

                var target = $(e.currentTarget).attr("href");
                $.scrollTo( $(this.el).find(target), 400);

            },
            _initChangeMenu : function(){
                $(window).on('scroll', this._scroll);
            },
            render: function(options){

                //this.user_id = options.user_id;

                this.$el.empty().append( template );

                this.showUser(options.user_id);

                //После рендера шаблона подрубаем ScrollSpy
                //this._initScrollSpy();


                return this;
            },
            showUser: function(id){

                var self = this;
                this.currentUsersCollection.fetch({success: function(){

                    var tpl = _.template(tpl_UserProfile, self.currentUsersCollection.get(id).toJSON());
                    $(self.el).find(".user_info").empty().append(tpl);
                }});
            },
            //Location Methods
            _scroll : function(){
                if ($(window).scrollTop()  >= 50) {
                    this._onChangeNavMenu();
                }else{
                    this._offChangeNavMenu();
                }
            },
            _onChangeNavMenu : function(){
                $(".basic-navebar").hide();
                $(".sub-nav-main").show();
            },
            _offChangeNavMenu : function(){
                $(".basic-navebar").show();
                $(".sub-nav-main").hide();
            }
            //Globals Methods


        });

        // Returns the View class
        return IndexView;
    }

);
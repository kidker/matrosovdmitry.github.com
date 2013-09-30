define([
    "jquery", "backbone", "app/namespace", "jquery-scrollTo", "bootstrap",
    "text!templates/mainTpls/Index.html"//Template

],
    function ($, Backbone, namespace, jquery_scrollTo, bootstrap,  template) {
        var IndexView = Backbone.View.extend({

            tagName : "div",
            events : {
                "click #navbar-main .navbar-nav a" : "_initScrollToChangeMenu"
            },
            initialize: function () {
                _.bindAll(this);

                $(window).off("scroll");
                //Инциализация заменены меню
                this._initChangeMenu();

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
            render: function(){
                this.$el.empty().append( template );

                //После рендера шаблона подрубаем ScrollSpy
                this._initScrollSpy();


                return this;
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
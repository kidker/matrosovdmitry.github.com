// DesktopRouter.js
// ----------------
define([
    "jquery",
    "backbone",
    "app/namespace",
    //Views
    "views/Content",
    //Main Views
    "views/pagesView/Index",

    "views/pagesView/Users",
    "views/pagesView/User",

    "views/pagesView/Lections",
    "views/pagesView/Lection",

    "views/pagesView/Lenta"
    /*
    "views/pagesView/Action",
    "views/pagesView/Index",
    "views/pagesView/Amplua",
    "views/pagesView/MyPersons",
    "views/pagesView/PersonalInfo",
    "views/pagesView/Stadiums",
    "views/pagesView/MyTournaments",
    "views/pagesView/MyMatch",
    "views/pagesView/MyTeam"
    */

],

    function ($, Backbone, namespace, Content,
              IndexView, UsersView, UserView, LectionsView, LectionView, LentaView
             /* ActionView, IndexView, AmpluaView, MyPersonsView, PersonalInfoView, StadiumsView, MyTournamentsView, MyMatchView, MyTeamView*/
        ) {

        // Returns the DesktopRouter class
        return Backbone.Router.extend({
            views: {},

            routes: {
                //Pages for main
                "": "index",
                "!/index" : "index",
                //Pages for users
                "!/users" : "users",
                "!/user/:id" : "user",
                //Pages for lections
                "!/lections" : "lections",
                "!/lection/:id" : "lection",
                //Page for lenta
                "!/lenta" : "lenta"


                /*
                "!/my_matches/:id" : "my_matches",
                "!/my_teams/:id" : "my_teams",
                "!/action_types" : "action_types",
                "!/amplua_types" : "amplua_types",
                "!/my_tournaments" : "my_tournaments",
                "!/stadiums" : "stadiums",
                "!/my_persons" : "my_persons",
                "!/personal_info" : "personal_info"
                */

            },

            initialize: function () {
                console.log("Router->initialize");
                _.bindAll(this);

                this.contentView = new Content();

                this.views = {
                    mainIndex : new IndexView,
                    mainLenta: new LentaView
                    /*
                    mainAction : new ActionView,
                    mainAmplua : new AmpluaView,
                    mainMyTournaments : new MyTournamentsView,
                    //mainMyMatch : function(){return new MyMatchView},
                    mainStadiums : new StadiumsView,
                    mainMyPersons : new MyPersonsView,
                    mainPersonalInfo : new PersonalInfoView
                    */
                };


                Backbone.history.start();
                //DON'T REMOVE DANGEROUS
                Backbone.emulateJSON = true;

                return this;
            },
            index: function () {
                console.log("index");
                this.showContent({ view : this.views.mainIndex.render() });
                this._activateTab('index');
            },
            users : function(){
                console.log("users");
                var newView = new UsersView;
                this.showContent({ view : newView.render() });
                this._activateTab('users');
            },
            user : function(id){
                console.log("user");
                var newView = new UserView;
                this.showContent({ view : newView.render({user_id: id}) });
                this._activateTab('users');
            },
            lections : function(){
                console.log("lections");
                var newView = new LectionsView;
                this.showContent({ view : newView.render() });
                this._activateTab('lections');
            },
            lection : function(id){
                console.log("lection");
                var newView = new LectionView;
                this.showContent({ view : newView.render({user_id : id}) });
                this._activateTab('lections');
            },
            lenta : function(){
                console.log("lenta");
                //var newView = new LentaView;
                this.showContent({ view : this.views.mainLenta.render() });
                this._activateTab("lenta");
            },

            _activateTab : function(name){
                $(".basic-navebar .navbar-nav").find("li.active").removeClass("active").end().find("a[href='#!/"+name+"']").parent().addClass("active");
            },
            /*
            action_types : function(){
                console.log("action_types");
                var newView = new ActionView;
                this.showContent({ view : newView.render() });
            },
            amplua_types : function(){
                console.log("amplua_types");
                this.showContent({ view : this.views.mainAmplua.render() });
            },
            my_tournaments : function(){
                console.log("my_tournaments");
                var newView = new MyTournamentsView;
                this.showContent({ view: newView.render()  });
            },

            my_matches : function(id){
                console.log("my_matches");
                var newView = new MyMatchView;
                this.showContent({ view: newView.render({ match_id : id }) });
            },
            my_teams : function(id){
                console.log("my_teams");
                var newView = new MyTeamView;
                this.showContent({ view: newView.render({ match_id : id }) });
            },

            stadiums : function(){
                console.log("stadiums");
                var newView = new StadiumsView;
                this.showContent({ view : newView.render() });
                //this.showContent({ view : this.views.mainStadiums.render() });
            },
            my_persons : function(){
                console.log("my_persons");
                var newView = new MyPersonsView;
                this.showContent({ view : newView.render() });
            },
            personal_info : function(){
                console.log("personal_info");
                this.showContent({ view : this.views.mainPersonalInfo.render() });
            },
            */
            //Отображаем в #contentBox шаблон, который содержится в пар-рах
            showContent: function (options) {
                this.contentView.clear().showInside(options);
            }


        });
    }
);
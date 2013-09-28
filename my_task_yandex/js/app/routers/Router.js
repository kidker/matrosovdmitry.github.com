// DesktopRouter.js
// ----------------
define([
    "jquery",
    "backbone",
    "app/namespace",
    //Views
    "views/Content",
    //Main Views
    "views/pagesView/Index"
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
              IndexView
             /* ActionView, IndexView, AmpluaView, MyPersonsView, PersonalInfoView, StadiumsView, MyTournamentsView, MyMatchView, MyTeamView*/
        ) {

        // Returns the DesktopRouter class
        return Backbone.Router.extend({
            views: {},

            routes: {
                "": "index",
                "!/index" : "index"
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
                    mainIndex : new IndexView
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
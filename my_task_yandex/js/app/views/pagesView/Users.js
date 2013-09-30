define([
    "jquery", "backbone", "app/namespace", "bootstrap",
    //Листы для подготовки вывода коллекции
    "views/Users/UsersList",
    //Списки которые мы будем рендерить
    "collections/UsersCollection",

    "text!templates/mainTpls/Users.html"//Template

],
    function ($, Backbone, namespace, bootstrap,
              UserList,
              UsersCollection,
              template) {
        var IndexView = Backbone.View.extend({

            tagName : "div",
            events : {
                //"click #navbar-main .navbar-nav a" : "_initScrollToChangeMenu"
            },
            initialize: function () {
                _.bindAll(this);

            },

            render: function(){

                //1. Добавляем шаблон
                this._loadTemplate();
                //2. Рендерим листы
                this._renderLists();
                //3. Грузим дополнительные данные
                this._loadAdditionalData();

                return this;
            },
            //Грузим шаблон
            _loadTemplate : function(){
                this.$el.append( template );
            },
            //Рендерим списки
            _renderLists : function(){

                var self = this;
                self.currentUsersCollection = new UsersCollection();

                self.listUsersCollection =  new UserList({
                    collection : self.currentUsersCollection
                }).render();

                //Выводим списки
                //this.$el.find(".list_users .table").append( self.listUsersCollection.$el );

            },
            //Загружаем дополнительные данные
            _loadAdditionalData : function(){

            }

            //Globals Methods


        });

        // Returns the View class
        return IndexView;
    }

);
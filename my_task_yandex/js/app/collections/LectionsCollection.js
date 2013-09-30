define(["jquery", "backbone", "app/namespace", "models/User", "localstorage"],

    function ($, Backbone, namespace, User, localstorage) {

        var UsersCollection = Backbone.Collection.extend({

            localStorage: new Backbone.LocalStorage("LectionsCollection"),

            cat_id : null,
            model: User,
            totalCount: null,
            count_render : 10,
            page: 1,

            sort_key : 'id',

            autoload: true,

            //url :  'http://localhost/backbone/backbone_video_kurs/server/users/getUsers.php',

            initialize: function (options) {

                _.bindAll(this);

                this._clearNamespace();//Чистим namespace
                this._namespaceEvents();//Активируем события

                return this;


            },
            //Навешиваем события
            _namespaceEvents : function(){
                //1. На создание в другой вьюхе модели
                namespace.app.on("collection:createUser", this._createUser);
                //2. На изменение модели в форме редактирования матча
                namespace.app.on("collection:SaveUser", this._saveUser);
            },

            //Чистит namespace
            _clearNamespace : function(){
                namespace.app.off("collection:createUser");
                namespace.app.off("collection:SaveUser");
            },

           //Переворачиваем модели коллекции
            reverseSort : function(){
                    var models = Backbone.Collection.prototype.sortBy.apply(this, arguments);
                    models.reverse();
                    this.models = models;
            },


            //Local Methods
            _initComparator : function(options){
                this.comparator = function(item){
                    return item.get(options.sortByField);
                };
            },


            //Форма для сохранения изменений модели в коллекции
            _saveUser : function( id, sel ){

                console.log( "_saveUser Trigger");
                console.log( "id : "+id);
                console.log( "Выведем текущий селектор");
                console.log( sel);

                //1. Находим модель в коллекции
                console.log(this.length);
                if (this.length == 1){
                    var curModel = this.at(0);
                }else{
                    var curModel = this.get(id);
                }

                console.log(curModel);

                //1. Применяем изменения и потом сохраняем
                var updateArr = {
                    name : sel.find("#Name").val() ,
                    author : sel.find("#Author").val() ,
                    author_img : sel.find("#AuthorImg").val(),
                    link_pres : sel.find("#link_pres").val(),
                    link_video : sel.find("#link_video").val(),
                    id        : id
                };

                if (
                        updateArr.name == ""
                    ){
                    namespace.app.trigger("show:message", false, "Заполните обязательные поля");

                }else{
                    curModel.set(updateArr);
                    this._saveModel(curModel);

                    //После удачного сохранения необходимо закрыть форму редактирования
                    namespace.app.trigger("myMatch:closeModalFormEdit");

                }

            },
            //Сохранение модели
            _saveModel : function(m){
                var selfModel = m;

                m.save();
                selfModel.trigger("saveModel");
                /*
                m.save(null,{
                    success : function(model, response){
                        if (response.ans == 1){
                            namespace.app.trigger("show:message", true, "Изменения сохранены");
                            selfModel.trigger("saveModel");
                        }else{
                            namespace.app.trigger("show:message", false, response.err);
                        }
                    },
                    error : function(model, response){
                        alert("Попробуйте в другой раз!");
                    }
                });
                */

            },

            //Создание матча
            _createUser : function(data){
                var self = this;
                console.log("CREATE USER");
                console.log(data);
                //Создаём модель и посылаем через CRUD данные на сервер

                //this.create(data);
                this.create(data, {
                    wait : true,
                    success : function(response, model){
                            self.trigger('addUser', model);
                    }
                });
                //this.trigger('addUser', data);

                /*
                this.create(data, {
                    wait : true,

                    success : function(response, model){
                        console.log("SUCCESS");
                        console.log(model);

                        if (model.get("ans") == 1){
                            //1. Вывести success
                            //namespace.app.trigger("show:message", true, "Новый матч создан");
                            //2. Закрыть форму создания
                            //namespace.app.trigger("show:toggleForm");

                            //3. Отрендерить созданный матч в листе матчей
                            self.trigger('addUser', model);
                        }else{
                            console.log("EROOR MODEL");
                            console.log(model.get('err'));
                            namespace.app.trigger("show:message", false, model.get('err'));
                        }


                    },


                    error :  function(err){
                        //1. Вывести ошибку
                        console.log("err");
                    }

                });
                 */

            },
            //Фильтрования по хозяевам и гостям
            _filterByHomeAway : function(home_data, away_data){

                return _(this.filter(function(model) {

                    if (  home_data != "all" && away_data != "all" ){
                            return model.get('away_team') == away_data && model.get('home_team') == home_data;
                    }else if ( away_data != "all" ){
                            return model.get('away_team') == away_data;
                    }else if ( home_data != "all" ){
                            return model.get('home_team') == home_data;
                    }else{
                        return model.get('id') > 0;
                        //Сдесь должен быть метод для выбора всех элементов коллекции
                        //this._
                    }

                }));

            },
            _filterByAge : function(value){
                return _(this.filter(function(model) {

                    if (value == "age<50"){
                        return model.get('age') < 50;
                    }else if (value == "id>2"){
                        return model.get('id') > 2 ;
                    }else{
                        return model.get('id') > 0;
                    }

                }));
            },
            _filterByID : function(value){
                return _(this.filter(function(model) {

                   if (value == "id>2"){
                        return model.get('id') > 2;
                    }else{
                        return model.get('id') > 0;
                    }

                }));
            },


            //Фильтр по матчам
            _filtrByMatch : function(sel_data){
                console.log(sel_data);

                return _(this.filter(function(model) {

                    if (sel_data != 3){
                            return model.get('filling') == sel_data;
                    }else{
                        return model.get('id') > 0;
                    }

                }));

            },
            //Фильтр по турам по Возрастанию и по Убыванию
            _filterByTour : function(tour_id){

                return _(this.filter(function(model) {
                    if (tour_id != "-1"){
                        return model.get('tour_number') == tour_id.toString();
                    }else{
                        return model.get('id') > 0;
                    }

                }));

            },

            //Global methods
            /*
            comparator: function(item) {
                return item.get("id");
            },
            */

            parse : function(data){
                this.totalCount = data.length;
                //console.log("totalCount : "+this.totalCount);
                var pagesTemp = this.totalCount / this.count_render;

                if (pagesTemp > Math.floor(pagesTemp)){
                    this.pages = Math.floor(pagesTemp)+1;
                }else{
                    this.pages = pagesTemp
                }

                return data;
            },
            /*

            parse: function (data) {

                this.totalCount = data.myMatches.matchs.length;
                //console.log("TOTAL COUNT "+this.totalCount);
                var pagesTemp = this.totalCount / this.count_render;

                if (pagesTemp > Math.floor(pagesTemp)){
                    this.pages = Math.floor(pagesTemp)+1;
                }else{
                    this.pages = pagesTemp
                }
                //console.log("PAGES "+this.pages);

                return data.myMatches.matchs;

             },
            */

            previous: function (model) {
                var index = this.indexOf(model);
                if (index < 1) { // 0 or -1
                    return null;
                }
                return this.models[index - 1];
            },
            next: function (model) {
                var index = this.indexOf(model);
                if (index == -1) {
                    return null;
                }
                if (index == this.models.length - 1) {
                    if (this.autoload) {
                        this.fetchNextPage({add: true, async: false});
                        var next = this.next(model);
                        if (next == "last"){
                            //switch off autoload to prevent endless recursion
                            this.autoload = false;
                        }
                        return next;
                    } else {
                        return "last";
                    }
                }
                return this.models[index + 1];
            },
            fetchNextPage: function (options) {
                var self = this;
                this.page++;
                //1. Должны проверить текущаю страница не превосходит ли, имеющееся кол-во страниц
                //2. Если не превосходит, то вывести следующую партию из 20-команд
                if (this.page <= this.pages){
                    //Вывести партию из 20 команд
                    var start = (this.page-1) * this.count_render;
                    var end = start + this.count_render;
                    //console.log("Желаемый END : "+end);
                    if (this.totalCount < end){
                        end = end - (end - this.totalCount);
                    }
                    //console.log("START : "+start+", END : "+end);
                    for (var i = start;i < end;i++){
                            self.trigger("addUser", self.at(i));
                    }
                }else{
                    //console.log("Убрали BIND SCROLL WINDOW");
                    $(window).unbind("scroll");
                }
                //
                //this.fetch(options);
            }
        });
        return UsersCollection;
    }

);
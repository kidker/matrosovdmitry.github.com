define(["jquery", "backbone", "app/namespace", "models/Tournament"],

    function ($, Backbone, namespace, Tournament) {

        var TournamentCollection = Backbone.Collection.extend({
            model: Tournament,
            totalCount: null,
            page: 1,
            autoload: true,
            url: function () {
                //return 'http://***.net/category/25/page/' + this.page + '?jr=true'
                return '/user/my_tournaments?aj=1'
            },
            filterBySeason : function(rating_id, season){
                return _(this.filter(function(data) {
                    if (rating_id != -1 && season != -1){
                        return data.get("rating_id") == rating_id && (data.get("start_year").indexOf(season.toString()) != -1 || data.get("end_year").indexOf(season.toString()) != -1) ;
                    }else if (rating_id == -1){
                        return (data.get("start_year").indexOf(season.toString()) != -1 || data.get("end_year").indexOf(season.toString()) != -1) ;
                    }else{
                        return data.get("rating_id") == rating_id;
                    }

                }));
            },
            initialize: function (page) {

                _.bindAll(this);

                this.page = page;

                this._clearNamespace();//Чистим namespace
                this._namespaceEvents();//Активируем события

            },

            _namespaceEvents : function(){
                //1. на создание в другой вьюхе модели
                namespace.app.on("collection:createTournament", this._createTournament);
            },

            //Чистит namespace
            _clearNamespace : function(){
                //1. на создание в другой вьюхе модели
                namespace.app.off("collection:createTournament");
            },

            /*
            comparator: function(item) {
                //var date = new Date(item.get("start_year"));
                console.log("id : "+item.get("id")+", start_year : "+item.get("start_year")+", end_year : "+item.get("end_year"));
                return item.get("id");
                //return item.get("start_year").valueOf();
            },
            */
            _createTournament : function(data){
                //data набор элементов необходимых для сохранения
                //this.create(data);
                console.log("TournamentCollection->_createTournament");
                console.log("CREATE TOURNAMENT");
                console.log(data);
                //Создаём модель и посылаем через CRUD данные на сервер
                var _self = this;
                this.create(data, {
                    wait : true,

                    success : function(model){
                        console.log(model);
                        if (model.get("ans") == 1){
                            //1. Вывести success
                            namespace.app.trigger("show:message", true, "Новый турнир создан");
                            //2. Закрыть форму создания
                            namespace.app.trigger("show:toggleForm");
                            //3. Вызываем триггер для коллекции
                            //_self.trigger("addTournament");
                            namespace.app.trigger("collection:addTournament", model);
                        }else{
                            namespace.app.trigger("show:message", false, model.get('err'));
                        }
                        //console.log(model);
                    },

                    error :  function(err){
                        //1. Вывести ошибку
                        console.log("ERROR");
                        //console.log(model);
                        //console.log(response);
                    }
                });

            },
            /*
             parse: function (data) {
             this.totalCount = data.totalCount;
             return data.result;
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
                this.page++;
                this.fetch(options);
            }
        });
        return TournamentCollection;
    }

);
define(["jquery", "backbone", "app/namespace", "models/Player"],

    function ($, Backbone, namespace, Player) {

        var PlayerCollection = Backbone.Collection.extend({
            model: Player,
            totalCount: null,
            page: 1,
            autoload: true,
            url: function () {
                //return 'http://***.net/category/25/page/' + this.page + '?jr=true'
                return '/user/load_players_team/0.5'
            },
            initialize: function () {

                _.bindAll(this);

                //this.page = page;

                //1. на создание в другой вьюхе модели
                //namespace.app.on("collection:createAction", this._createAction);

            },
            comparator: function(item) {
                return item.get("title");
            },
            _createAction : function(data){
                //data набор элементов необходимых для сохранения
                //this.create(data);
                console.log("ActionItem->_createAction");
                console.log("CREATE ACTION");
                console.log(data);
                //Создаём модель и посылаем через CRUD данные на сервер

                this.create(data, {
                    wait : true,

                    success : function(model){
                        console.log(model);
                        if (model.get("ans") == 1){
                            //1. Вывести success
                            namespace.app.trigger("show:message", true, "Новое действие создано");
                            //2. Закрыть форму создания
                            namespace.app.trigger("show:toggleForm");
                        }else{
                            namespace.app.trigger("show:message", false, model.get('err'));
                        }


                        //console.log(model);
                    },

                    error :  function(err){
                        //1. Вывести ошибку
                        console.log("ERROR");
                        //console.log(model);
                        console.log(response);
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
        return PlayerCollection;
    }

);
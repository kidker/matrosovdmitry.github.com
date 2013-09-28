define(["jquery", "backbone", "app/namespace", "models/MyTeam"],

    function ($, Backbone, namespace, MyTeam) {

        var MyTeamCollection = Backbone.Collection.extend({
            cat_id : null,
            model: MyTeam,
            totalCount: null,
            page: 1,
            autoload: true,

            order : true,

            url: function (cat_id) {
                return '/user/my_matches/'+cat_id+'?aj=1'
            },

            initialize: function (options) {

                console.log(" MyTeamCollection : initialize ");

                _.bindAll(this);

                console.log(options);

                //Сначала проверим page
                if ( options.page != undefined ){
                    this.page = options.page;
                }
                //Потом проверим id категории для матчей
                if ( options.cat_id != undefined ){
                    this.url = this.url( options.cat_id );
                }
                if (options.sortByField != undefined){
                    this._initComparator(options);
                }

                this._clearNamespace();//Чистим namespace
                this._namespaceEvents();//Активируем события

            },
            //Чистим namespace
            _clearNamespace : function(){
                namespace.app.off("collection:createTeam");
                namespace.app.off("collection:saveTeam");
            },
            _namespaceEvents : function(){
                namespace.app.on("collection:createTeam", this._createTeam);
                namespace.app.on("collection:saveTeam", this._saveTeam);
            },

            //Local Methods

            //Инициализируем сортировку в коллекции
            sortBy : function () {
                console.log("sortBy");
                console.log("order : " + this.order);
                var models = _.sortBy( this.models, this.comparator);
                this.order = !this.order;
                if (this.order) { models.reverse(); }
                return models;
            },

            _initComparator : function(options){
                this.comparator = function(item){
                    return item.get(options.sortByField);
                };
            },

            _createTeam : function(data){
                //data набор элементов необходимых для сохранения
                //this.create(data);
                console.log("ActionItem->_createTeam");
                console.log("CREATE TEAM");
                console.log(data);
                //Создаём модель и посылаем через CRUD данные на сервер

                this.create(data, {
                    wait : true,

                    success : function(model){
                        console.log(model);
                        if (model.get("ans") == 1){
                            //1. Вывести success
                            namespace.app.trigger("show:message", true, "Новое действие создано");
                            //2. Закрыть форму создания .modal('hide');
                            //namespace.app.trigger("view:closeModalFormCreateTeam");
                            //namespace.app.trigger("show:toggleForm");



                        }else{
                            namespace.app.trigger("show:message", false, model.get('err'));
                        }


                        //console.log(model);
                    },

                    error :  function(err){
                        //1. Вывести ошибку
                        console.log("ERROR");
                        console.log(err);

                    }
                });

            },
            //Сохранение модели в коллекции
            _saveTeam : function(updateArr){
                console.log("Это id"+updateArr.id);
                if (this.length == 1){
                    var curModel = this.at(0);
                }else{
                    var curModel = this.get( updateArr.id );
                }
                curModel.set(updateArr);

                console.log(curModel);

                this._saveModel(curModel);
                //После удачного завершения необходимо закрыть форму редактирования
                namespace.app.trigger("view:closeModalFormCreateTeam");
            },
            //Сохранение модели
            _saveModel : function(m){
                console.log("Здесь происходит сохранение модели");
                console.log(m);

                m.save(null,{
                    success : function(model, response){
                        console.log("SUCCESS 0");
                        console.log(model);
                        if (response.ans == 1){
                            namespace.app.trigger("show:message", true, "Изменения сохранены");
                            console.log("ANS 1");
                        }else{
                            console.log("ANS 0");
                            namespace.app.trigger("show:message", false, response.err);
                        }
                        m.set({name: model.get('cityName')}).trigger("saveModel");
                    },
                    error : function(model, response){
                        console.log("ERROR 0");
                        alert("Попробуйте в другой раз!");
                    }
                });

            },

             parse: function (data) {
                 //this.totalCount = data.totalCount;
                return data.myTeams.teams;
             },

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
        return MyTeamCollection;
    }

);
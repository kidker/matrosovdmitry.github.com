define(["jquery", "backbone", "app/namespace", "models/MyMatch"],

    function ($, Backbone, namespace, MyMatch) {

        var MyMatchCollection = Backbone.Collection.extend({
            cat_id : null,
            model: MyMatch,
            totalCount: null,
            count_render : 20,
            page: 1,
            autoload: true,

            url: function (cat_id) {
                return '/user/my_matches/'+cat_id+'?aj=1'
            },

            initialize: function (options) {

                _.bindAll(this);

                //Сначала проверим page
                if (options.page != undefined){
                    this.page = options.page;
                }
                //Потом проверим id категории для матчей
                if (options.cat_id != undefined){
                    this.url = this.url( options.cat_id );
                }
                if (options.sortByField != undefined){
                    this._initComparator(options);
                }

                this._clearNamespace();//Чистим namespace
                this._namespaceEvents();//Активируем события

                return this;


            },
            //Навешиваем события
            _namespaceEvents : function(){
                //1. На создание в другой вьюхе модели
                namespace.app.on("collection:createMyMatch", this._createMatch);
                //2. На изменение модели в форме редактирования матча
                namespace.app.on("collection:SaveMyMatch", this._saveMyMatch);
            },

            //Чистит namespace
            _clearNamespace : function(){
                namespace.app.off("collection:createMyMatch");
                namespace.app.off("collection:SaveMyMatch");
            },

            //Инициализируем сортировку в коллекции
            sortBy : function () {
                console.log("sortBy");
                console.log("order : " + this.order);
                var models = _.sortBy( this.models, this.comparator);
                this.order = !this.order;
                if (this.order) { models.reverse(); }
                return models;
            },

            //Local Methods
            _initComparator : function(options){
                this.comparator = function(item){
                    return item.get(options.sortByField);
                };
            },


            //Форма для сохранения изменений модели в коллекции
            _saveMyMatch : function( id, sel ){

                console.log( "_saveMyMatch Trigger");
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
                    score_home    : sel.find("input[name='score_home']").val(),
                    score_guest   : sel.find("input[name='score_guest']").val(),
                    tour_number   : sel.find("input[name='tour_number']").val(),
                    protocol_number : sel.find("input[name='protocol_number']").val(),
                    visitors        : sel.find("input[name='visitors']").val(),
                    stadion         : sel.find("input[name='stadion']").val(),
                    stadium_id      : sel.find("input[name='stadium_id']").val(),
                    tour_id         : sel.find("input[name='tour_id']").val(),
                    match_id        : sel.find("input[name='match_id']").val(),
                    d_game          : sel.find("input[name='date_game']").val(),
                    time_game       : sel.find("input[name='time_game']").val(),
                    ac              : 'save'
                };

                if (
                        updateArr.score_home == "" ||
                        updateArr.score_guest == "" ||
                        updateArr.tour_number == "" ||
                        updateArr.protocol_number == "" ||
                        updateArr.visitors == "" ||
                        updateArr.stadion == "" ||
                        updateArr.stadium_id == "" ||
                        updateArr.tour_id == "" ||
                        updateArr.d_game == "" ||
                        updateArr.time_game == "" ||
                        updateArr.match_id == ""
                    ){
                    namespace.app.trigger("show:message", false, "Заполните обязательные поля");
                    console.log("хуй 1");
                }else{
                    curModel.set(updateArr);
                    this._saveModel(curModel);
                    console.log("хуй 2");
                    //После удачного сохранения необходимо закрыть форму редактирования
                    namespace.app.trigger("myMatch:closeModalFormEdit");

                }

            },
            //Сохранение модели
            _saveModel : function(m){
                var selfModel = m;

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

            },

            //Создание матча
            _createMatch : function(data){
                //data набор элементов необходимых для сохранения
                //this.create(data);
                //console.log("ActionItem->_createAction");
                console.log("CREATE MATCH ARA");
                console.log(data);
                //Создаём модель и посылаем через CRUD данные на сервер
                var self = this;

                this.create(data, {
                    wait : true,

                    success : function(response, model){
                        console.log("SUCCESS");
                        console.log(model);

                        if (model.get("ans") == 1){
                            //1. Вывести success
                            namespace.app.trigger("show:message", true, "Новый матч создан");
                            //2. Закрыть форму создания
                            //namespace.app.trigger("show:toggleForm");

                            //3. Отрендерить созданный матч в листе матчей
                            self.trigger('addMatch', model);
                        }else{
                            console.log("EROOR MODEL");
                            console.log(model.get('err'));
                            namespace.app.trigger("show:message", false, model.get('err'));
                        }

                        /*
                        if (model.get("ans") == 1){
                            //1. Вывести success
                            namespace.app.trigger("show:message", true, "Новое действие создано");
                            //2. Закрыть форму создания
                            namespace.app.trigger("show:toggleForm");
                        }else{
                            namespace.app.trigger("show:message", false, model.get('err'));
                        }*/
                        /*
                        if (model.get("ans") == 1) {
                            // выводим добавленный матч в список, и если есть счет то выдаем pop-up
                            var th = $('#team_h').html();
                            var ta = $('#team_a').html();
                            if (model.get("filling") == 1 || model.get("filling") == 0)
                            {
                                //$.colorbox({href:"/user/edit_action/<?=$this->tour_id;?>/"+msg.match_id+'/pop', innerWidth:'800px;',innerHeight: '650px;'});
                                if (model.get("filling") != 0 )
                                {
                                    var score = '<div class="score"><span class="sh">'+model.get("sh")+'</span><span class="sa">'+model.get("sa")+'</span></div>';
                                }else{
                                    var score = '<div class="score"></div>';
                                }
                                if (model.get("filling") == 0)
                                {
                                    var cl = ' in_calendar';
                                }else{
                                    var cl = ' with_score';
                                }
                            }else {
                                var score = '<div class="score"><span class="sh">'+model.get("sh")+'</span><span class="sa">'+model.get("sa")+'</span></div>';
                                var cl = ' full_score';
                            }
                            var obertka = '<div class="match'+cl+'" id="match'+model.get("match_id")+'"><div class="th">'+th+'</div>'+score+'<div class="ta">'+ta+'</div>' +
                                '<div class="action"><a href="/user/edit_action/<?=$this->tour_id;?>/'+model.get("match_id")+'/pop" class="colorbox but_edit" title="редактировать матч"></a><a href="#" onclick="del_match('+model.get("match_id")+'); return false;" class="but_del ttip" title="удалить"></a>' +
                                '</div>' +
                                '<span class="match_date">'+model.get("match_dt")+'</span><span class="thome">хозяева</span><span class="tguest">гости</span>' +
                                '</div>';
                            var match = $(obertka).hide().fadeIn('slow');
                            $('.sort').after(match);
                            $('a.colorbox').colorbox({innerWidth:'800px;',innerHeight: '650px;'});
                            //clear_forms(); // чистим список
                            $('#match').toggle('fast');
                        }
                        else {
                            // выводим ошибку

                            var err = $('<div class="err">'+model.get("err")+'</div>').hide().fadeIn('slow');
                            $('#details').append(err);
                            setTimeout(function() {$('.err').hide(300);$('.err').remove();},4000);

                        }
                        */


                        //console.log(model);
                    },

                    error :  function(err){
                        //1. Вывести ошибку
                        console.log("err");
                    }
                });

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
            comparator: function(item) {
                return item.get("title");
            },

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
                        this.trigger("addMatch", this.at(i));
                    }
                }else{
                    //console.log("Убрали BIND SCROLL WINDOW");
                    $(window).unbind("scroll");
                }
                //
                //this.fetch(options);
            }
        });
        return MyMatchCollection;
    }

);
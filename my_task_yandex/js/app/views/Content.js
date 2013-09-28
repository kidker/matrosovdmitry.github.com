define(["jquery", "backbone", "app/namespace", "bootstrap"],

    function ($, Backbone, namespace, boot_strap){

        var Content = Backbone.View.extend({
            el: $("#contentBox"),

            events : {
                // "click .add_element" : "_toggleForm"
            },

            route: undefined,
            initialize: function () {
                _.bindAll(this);

                this._namespaceEvents();
            },
            _namespaceEvents : function(){
                //Вешаем событие отображение сообщения
                namespace.app.on("show:message", this._showMessage);
                //Вешаем событие на открытие форм создания
                namespace.app.on("show:toggleForm", this._toggleForm);
                //Вешаем кэллбек на инициализацию datepicker
                //namespace.app.on("datepicker:init", this._initDatePickers);
                //Для одного поля дня игры
                //namespace.app.on("datepickerDayGame:init", this._initDatePickersDayGame);
                //Для одного поля времени игры
                //namespace.app.on("timepickerDayGame:init", this._initTimePickerDayGame);
            },

            _showMessage : function(msg, text){
                console.log("Content->_showMessage");
                if (msg){
                    $(this.el).find('#form_edit').after($('<div class="success">'+text+'</div>').hide().fadeIn('300').fadeOut(3000));
                }else{
                    $(this.el).find('#form_edit').after($('<div class="err">'+text+'</div>').hide().fadeIn('300').fadeOut(3000));
                }
            },
            _toggleForm : function(){
                $(this.el).find('.add_element').next().toggle("medium");
            },

            render: function () {
                return this;
            },
            loading: function () {
                this.$el.append("<img class='loading' src='/img/a_loader.gif'/>");
                return this;
            },
            clear: function () {
                this.$el.empty();
                return this;
            },
            /*
            _initDatePickersDayGame : function(sel){
                if (sel != undefined && sel != null){

                    var nowDate = new Date();
                    var constYearFuture = 4;
                    var yearFuture = parseInt(nowDate.getUTCFullYear())+constYearFuture;
                    //yy-mm-dd
                    var year = nowDate.getFullYear();
                    var month = nowDate.getMonth();
                    var day = nowDate.getDate();
                    //today-tommorow
                   // var today = year+"-"+month+"-"+day;
                    //var tommorow = year+"-"+month+"-"+(day+1);
                    //Текщая дата и дата первой игры
                    var firstGameDate = new Date('1871-01-01');
                    //Начало и конец
                    var endDate = new Date(yearFuture.toString()+"-12-30");
                    //Общие настройки
                    var options = {
                        format : "yyyy-mm-dd",
                        startDate : firstGameDate,
                        endDate : endDate
                    };
                    var GlobalSelector = sel;
                    var datepicker_1 = sel.datepicker('destroy').datepicker(options).on("changeDate", function(ev){

                            var newDate = new Date(ev.date);
                            var newDateStr = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+"-"+newDate.getDate();
                            console.log(newDateStr);
                            sel.attr('value', newDateStr);

                            datepicker_1.hide();//Скрыть датапикер после выбора
                    }).data('datepicker');

                }else{
                    console.log('ERROR SELECTOR');
                }
            },
            //Инициализация времени
            _initTimePickerDayGame : function(sel){
                console.log("_initTimePickerDayGame");
                if (sel != undefined && sel != null){
                    var timepicker = sel.timepicker({
                        minuteStep: 15,
                        //template: 'modal',
                        showSeconds: false,
                        showMeridian: false
                    });
                    console.log( timepicker );

                }else{
                    console.log('ERROR SELECTOR');
                }
            },
            _initDatePickers : function(sel1, sel2){
                if (
                    sel1 != null &&
                    sel2 != null &&
                    sel1 != undefined &&
                    sel2 != undefined
                ){
                    var nowDate = new Date();
                    var constYearFuture = 4;
                    var yearFuture = parseInt(nowDate.getUTCFullYear())+constYearFuture;
                    //yy-mm-dd
                    var year = nowDate.getFullYear();
                    var month = nowDate.getMonth();
                    var day = nowDate.getDate();
                    //today-tommorow
                    var today = year+"-"+month+"-"+day;
                    var tommorow = year+"-"+month+"-"+(day+1);
                    //Текщая дата и дата первой игры
                    var firstGameDate = new Date('1871-01-01');
                    //Начало и конец
                    var endDate = new Date(yearFuture.toString()+"-12-30");
                    //Общие настройки
                    var options = {
                        format : "yyyy-mm-dd",
                        startDate : firstGameDate,
                        endDate : endDate
                    };

                    if (sel1.val() == ""){sel1.val(today);}
                    if (sel2.val() == ""){sel2.val(tommorow);}

                    var datepicker_1 = sel1.datepicker(options).on("changeDate", function(ev){
                            var data_2_value = datepicker_2.date;
                            if (ev.date.valueOf() > data_2_value.valueOf()){
                                alert("Дата начала не должна быть больше даты окончания");
                                datepicker_1.date = data_2_value;
                            } else {
                                datepicker_1.hide();
                            }
                        }).data('datepicker');

                    var datepicker_2 = sel2.datepicker(options).on("changeDate", function(ev){
                            var data_1_value = datepicker_1.date;
                            if (ev.date.valueOf() < data_1_value.valueOf()){
                                alert("Дата окончания не должна быть меньше даты начала");
                                datepicker_2.date = data_1_value;
                            } else {
                                datepicker_2.hide();
                            }
                        }).data('datepicker');

                }else{
                    console.log("ERROR SELECTORS");
                }


            },

*/

            showInside: function (options) {
                this.$el.append( options.view.$el );
                return this;
            }

        });
        return Content;
    });
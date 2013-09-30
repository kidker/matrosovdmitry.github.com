// View.js
// -------
define(["backbone", "app/namespace", "models/User",  "text!templates/UserItem.html"],

    function (Backbone, namespace, Model, template) {

        var UserItem = Backbone.View.extend({
            tagName: "li",
            className : "user-item thumbnail",
            //className: "container",
            imgloaded: false,
            randSportTypes : false,
            events: {
                // "" : "_addActionType",

               // "click .but_edit" : "_editMyMatch",
                //"click .but_del"  : "_deleteMyMatch"
                /*
                "click .e_edit a" : "_editActionType",//Редактирование
                "click .e_delete a" : "_deleteActionType",//Удаления
                "click .cancelSaveActionType" : "_cancelSaveActionType",//Отмена сохранения
                "click .saveActionType" : "_saveActionType"//Сохраниние
                */

                /*
                 "click .picture img": "modalShow",
                 "mouseover": "mouseoverItem",
                 "mouseout": "mouseoutItem"
                 */

                "click .edit_user" : "_editUser",
                "click .delete_user" : "_deleteUser"//,
                //"click .profile" : "_openProfile"


            },
            template: _.template(template),
            initialize: function () {
                _.bindAll(this);

                //1. Подписываем модель при уничтожении сразу же ремувим вьюху
                this.listenTo(this.model, "destroy", this.remove);
                //2. на изменение модели
                this.listenTo(this.model, "saveModel", this.render);

                return this;
            },
            _openProfile : function(e){
                console.log("_openProfile");
                e.preventDefault();
                //var collect = localstorage;
                //console.log(collect.getItem("5951d2b6-627c-7a34-4dcb-e4b47ed2397e"));
               // namespace.app.user(this.model);
            },
            _editUser : function(e){
                e.stopPropagation();

                namespace.app.trigger("UserView:openEditForm", e, this.model);
            },
            _deleteUser : function(e){
                e.preventDefault();

                var self = this;

                var answer = confirm('Действительно удалить пользователя?');
                //var answer = true;
                if (answer){

                    this.model.destroy({
                        data: {
                            'id' : self.model.get('id')
                        },
                        success:  function(){
                            //После удаления уже ничего скрывать не надо
                        },
                        error: function(){
                            alert('Попробуйте чуть позже!');
                        }

                    });
                }
            },
            _saveUser : function(e){
                e.preventDefault();
                console.log("_saveUser");
                var _self = this;
                var updateArr = {

                    //    'title' : $(_self.el).find('.edit_form .title').val(),
                    //  'sport_id' : _self.model.get('sport_id'),
                    // 'id' : _self.model.get('id')
                    //'sport_id' : $(_self.el).find('.edit_form .selectType').val()
                    //Не забыть дописать изменения из формы

                };

                if (updateArr.name == "" || updateArr.sername == "" || updateArr.age == ""){
                    namespace.app.trigger("show:message", false, "Заполните обязательные поля");
                }else{
                    this.model.set(updateArr);
                    this._saveModel(this.model);
                }

                console.log("END SAVE");
            },
            _saveModel : function(m){
                var _self = this;

                m.save(null,{
                    success : function(model, response){
                        if (response.ans == 1){
                            namespace.app.trigger("show:message", true, "Изменения сохранены");
                            _self.model.trigger("saveModel");
                        }else{
                            namespace.app.trigger("show:message", false, response.err);
                        }
                    },
                    error : function(model, response){
                        alert("Попробуйте в другой раз!");
                    }
                });

            },
            //Сохранение изменений одного матча
            /*
            _saveMyMatch : function(e){
                e.preventDefault();
                console.log("_saveMyMatch");
                var _self = this;
                var updateArr = {

                 //    'title' : $(_self.el).find('.edit_form .title').val(),
                   //  'sport_id' : _self.model.get('sport_id'),
                    // 'id' : _self.model.get('id')
                     //'sport_id' : $(_self.el).find('.edit_form .selectType').val()
                     //Не забыть дописать изменения из формы

                };

                if (updateArr.title == "" || updateArr.sport_id == "" || updateArr.id == ""){
                    namespace.app.trigger("show:message", false, "Заполните обязательные поля");
                }else{
                    this.model.set(updateArr);
                    this._saveModel(this.model);
                }

                console.log("END SAVE");
            },
            _saveModel : function(m){
                var _self = this;

                m.save(null,{
                    success : function(model, response){
                        if (response.ans == 1){
                            namespace.app.trigger("show:message", true, "Изменения сохранены");
                            _self.model.trigger("saveModel");
                        }else{
                            namespace.app.trigger("show:message", false, response.err);
                        }
                    },
                    error : function(model, response){
                        alert("Попробуйте в другой раз!");
                    }
                });

            },*/
            //Удаление матча
            _deleteMyMatch : function(e){

                e.preventDefault();
                console.log("DeleteActionType");
                var self = this;

                var answer = confirm('Действительно удалить?');
                //var answer = true;
                if (answer){
                    console.log("DESTROY");
                    this.model.destroy({
                        data: {
                            'match_id' : self.model.get('id'),
                            'tour_id' : self.model.get('tour_id')
                         },
                        success:  function(){
                            //После удаления уже ничего скрывать не надо
                        },
                        error: function(){
                            alert('Попробуйте чуть позже!');
                        }
                    });
                }

            },
            //Редактирование моего матча
            _editMyMatch : function(e){
                e.stopPropagation();
                console.log("_openFormEditItem");
                namespace.app.trigger("MyMatchView:openEditForm", e, this.model);

            },



            /*
            _addActionType : function(e){
                console.log("_addActionType");
                e.preventDefault();
            },
            _editActionType : function(e){
                e.preventDefault();
                this._showEditForm();
            },
            _deleteActionType : function(e){

                e.preventDefault();
                console.log("DeleteActionType");

                var answer = confirm('Действительно удалить?');
                //var answer = true;
                if (answer){
                    console.log("DESTROY");
                    this.model.destroy({
                        success:  function(){
                            //После удаления уже ничего скрывать не надо
                        },
                        error: function()
                        {
                            alert('Попробуйте чуть позже!');
                        }
                    });
                }

            },
            _cancelSaveActionType : function(e){
                e.preventDefault();
                console.log("_cancelSaveActionType");
                this._hideEditForm();
            },
            _saveActionType : function(e){
                e.preventDefault();
                console.log("SaveActionType");
                var _self = this;
                var updateArr = {
                    'title' : $(_self.el).find('.edit_form .title').val(),
                    'sport_id' : _self.model.get('sport_id'),
                    'id' : _self.model.get('id')
                    //'sport_id' : $(_self.el).find('.edit_form .selectType').val()
                    //Не забыть дописать изменения из формы
                };

                if (updateArr.title == "" || updateArr.sport_id == "" || updateArr.id == ""){
                    namespace.app.trigger("show:message", false, "Заполните обязательные поля");
                }else{
                    this.model.set(updateArr);
                    this._saveModel(this.model);
                }

                console.log("END SAVE");
            },
            _saveModel : function(m){
                var _self = this;

                m.save(null,{
                    success : function(model, response){
                        if (response.ans == 1){
                            namespace.app.trigger("show:message", true, "Изменения сохранены");
                            _self.model.trigger("saveModel");
                        }else{
                            namespace.app.trigger("show:message", false, response.err);
                        }
                    },
                    error : function(model, response){
                        alert("Попробуйте в другой раз!");
                    }
                });

            },
            _showEditForm : function(){
                var _self = this;
                $(this.el).find('.h_form').show();
                $(this.el).find('.list_elm').stop().animate({height: '130px'});

                if (!this.randSportTypes){
                    this.randSportTypes = true;
                    $(this.el).find(".selectType").append( _.template( $("#sportTypes").html(), _self.model.toJSON()) );
                }
            },
            _hideEditForm : function(){
                $(this.el).find(".h_form").hide();
                $(this.el).find('.list_elm').stop().animate({height : '50px'});
            },
            */
            /*
             _showSuccess : function(){
             $('#form_edit').after($('<div class="success">Изменения сохранены</div>').hide().fadeIn('300').fadeOut(3000));
             },
             _showError : function(error){
             $('#form_edit').after( $('<div class="err">'+error+'</div>').hide().fadeIn('300').fadeOut(3000) );
             },
             */
            /*
             modalShow: function (e) {
             e.preventDefault();
             namespace.app.trigger("modal:show:photo", this.model);
             },
             mouseoverItem: function () {
             if (this.imgloaded) {
             var self = this.$(".picture");
             self.siblings(".descriptionUp").stop().animate({opacity: 0, queue: "false"}, "slow");
             var desc = self.find('.description');
             var img = self.find('.img');
             desc.css('width', (parseInt(img.css('width')) - 10) + "px");
             var height = parseInt(desc.css('height'));
             desc.css('margin-top', -20 - parseInt(desc.css('height')) + "px");
             self.parent().addClass('removeborder');
             img.addClass('imgborder');
             desc.css("display", 'block');
             }
             },
             mouseoutItem: function () {
             if (this.imgloaded) {
             var self = this.$(".picture");
             self.siblings(".descriptionUp").stop().animate({opacity: 1, queue: "false"}, "slow");
             self.find('.description').css("display", 'none');
             var img = self.find('img');
             img.removeClass('imgborder');
             self.parent().removeClass('removeborder');
             }
             },
             */
            render: function () {

               // console.log("RENDER МОДЕЛИ");

                //this.randSportTypes = false;
                var tpl = this.template(this.model.toJSON());
                //console.log(this.model);
                /*
                 var image = new Image();
                 image.src = this.model.get("litUrl");
                 var self = this;
                 image.onload = function () {
                 var picture = self.$el.find(".img");
                 picture.attr("src", image.src);
                 picture.css("opacity", 1);
                 self.imgloaded = true;
                 };
                 */
                $(this.el).html(tpl);

                return this;
            }
        });

        // Returns the View class
        return UserItem;

    }

);
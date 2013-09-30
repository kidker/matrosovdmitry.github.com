define([
    "jquery", "backbone", "jquery-scrollTo", "bootstrap", "app/namespace",

    //Листы для подготовки вывода коллекции
    "views/Lections/LectionsList",
    //Списки которые мы будем рендерить
    "collections/LectionsCollection",

    "text!templates/mainTpls/Lections.html",//Template

    "text!templates/Lections/ModalFormCreate.html",
    "text!templates/Lections/ModalFormEdit.html"

],
    function ($, Backbone, jquery_scrollTo, bootstrap, namespace,

              LectionList,
              LectionsCollection,

              template, tpl_formCreateLection, tpl_formEditLection) {
        var IndexView = Backbone.View.extend({

            tagName : "div",
            events : {
                //"click #navbar-main .navbar-nav a" : "_initScrollToChangeMenu"

                "click .add_lection" : "_addLection",
                "click #modalEditUser #create_lection" : "_createLection",
                "click #modalEditUser #save_user" : "_saveUser"
            },
            initialize: function () {
                _.bindAll(this);
                //Инциализация заменены меню
                //this._initChangeMenu();

                //Чистим предварительно namespace
                this._clearNamespace();
                //Активируем его заново
                this._namespaceEvents();

            },
            //Чистим namespace
            _clearNamespace : function(){
                namespace.app.off("UserView:openEditForm");
                namespace.app.off("User:closeModalFormEdit");
            },
            _namespaceEvents : function(){
                namespace.app.on("UserView:openEditForm", this._openModalEditForm);
                namespace.app.on("User:closeModalFormEdit", this._closeModalFormEdit);
            },
            //закрытие модального окна редактирвоания матча
            _closeModalFormEdit : function(){
                $(this.el).find("#modalEditUser").modal('hide');
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
                self.currentLectionsCollection = new LectionsCollection();

                self.listLectionsCollection =  new LectionList({
                    collection : self.currentLectionsCollection
                }).render();

                //Выводим списки
                this.$el.find(".lection_list").append( self.listLectionsCollection.$el );

            },
            //Загружаем дополнительные данные
            _loadAdditionalData : function(){

            },
            //Save Action в форме редактирования
            _saveUser : function(e){
                e.preventDefault();
                console.log("_saveUser");
                var self = this;
                console.log(this.editFormUserId);
                namespace.app.trigger("collection:SaveUser", self.editFormUserId, $(self.el).find("#modalEditUser"));
                //Скрываем модальное окно
                $(this.el).find("#modalEditUser").modal('hide');

            },
            //Создание нового пользователя
            _createLection : function(e){
                console.log("_createUser");
                e.preventDefault();
                var self = this;

                var dateFormCreate = {
                    name : $(self.el).find("#modalEditUser #Name").val() ,
                    author : $(self.el).find("#modalEditUser #Author").val() ,
                    author_img : $(self.el).find("#modalEditUser #AuthorImg").val(),
                    link_pres : $(self.el).find("#modalEditUser #link_pres").val(),
                    link_video : $(self.el).find("#modalEditUser #link_video").val()
                };
                //console.log(dateFormCreate);
                namespace.app.trigger("collection:createUser", dateFormCreate);
                //Скрываем модальное окно
                $(this.el).find("#modalEditUser").modal('hide');
            },
            //Добавление пользователя
            _addLection : function(e){
                e.stopPropagation();

                this._openModalCreateForm(e);
            },
            //Открытие модального окна для создания
            _openModalCreateForm : function(e){

                var tpl = _.template( tpl_formCreateLection );
                $(this.el).find("#modalEditUser").empty().append( tpl );

                this._modalWindowToggleEvent(e);//Действия по нажатию на модальное окно
                //this._initModalEvents();//Инициализируем события для модального окна
            },
            //Открытие модального окна для редактирования
            _openModalEditForm : function(e, model){

                this.editFormUserId = model.get('id');


                var tpl = _.template( tpl_formEditLection, model.toJSON() );
                $(this.el).find("#modalEditUser").empty().append( tpl );


                this._modalWindowToggleEvent(e);//Действия по нажатию на модальное окно
                //this._initModalEvents(model);//Инициализируем события для модального окна
            },
            //Определяет после клика, что делать с модальным окном
            _modalWindowToggleEvent : function(e){
                console.log("_modalWindowToggleEvent");
                var $this = $(e.currentTarget)
                    , href = $this.attr('href')
                    , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
                    , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())
                e.preventDefault();
                $target
                    .modal(option)
                    .one('hide', function () {
                        $this.focus();
                    });
            }

            //Globals Methods


        });

        // Returns the View class
        return IndexView;
    }

);
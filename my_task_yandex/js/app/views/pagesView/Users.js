define([
    "jquery", "backbone", "app/namespace", "bootstrap",
    //Листы для подготовки вывода коллекции
    "views/Users/UsersList",
    //Списки которые мы будем рендерить
    "collections/UsersCollection",

    "text!templates/mainTpls/Users.html",
    "text!templates/Users/ModalFormCreate.html",
    "text!templates/Users/ModalFormEdit.html"

],
    function ($, Backbone, namespace, bootstrap,
              UserList,
              UsersCollection,
              template, tpl_formCreateUser, tpl_formEditUser) {
        var IndexView = Backbone.View.extend({

            tagName : "div",
            events : {
                //"click #navbar-main .navbar-nav a" : "_initScrollToChangeMenu"

                "click .add_user" : "_addUser",
                "click #modalEditUser #create_user" : "_createUser",
                "click #modalEditUser #save_user" : "_saveUser"
            },
            initialize: function () {
                _.bindAll(this);

                //Чистим предварительно namespace
                this._clearNamespace();
                //Активируем его заново
                this._namespaceEvents();

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
            //Инициализируем события для модального окна
            _initModalEvents: function(){

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
                this.$el.find(".users_list").append( self.listUsersCollection.$el );

            },
            //Загружаем дополнительные данные
            _loadAdditionalData : function(){

            },
            //Добавление пользователя
            _addUser : function(e){
                e.stopPropagation();

                this._openModalCreateForm(e);
            },
            //Создание нового пользователя
            _createUser : function(e){
                console.log("_createUser");
                e.preventDefault();
                var self = this;

                var dateFormCreate = {
                    name : $(self.el).find("#modalEditUser #Name").val() ,
                    sername : $(self.el).find("#modalEditUser #Sername").val() ,
                    age : $(self.el).find("#modalEditUser #Age").val(),
                    small_img : $(self.el).find("#modalEditUser #SmallImg").val(),
                    big_img : $(self.el).find("#modalEditUser #BigImg").val(),
                    description : $(self.el).find("#description").val()
                };
                //console.log(dateFormCreate);
                namespace.app.trigger("collection:createUser", dateFormCreate);
                //Скрываем модальное окно
                $(this.el).find("#modalEditUser").modal('hide');
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
            //Открытие модального окна для создания
            _openModalCreateForm : function(e){

                var tpl = _.template( tpl_formCreateUser );
                $(this.el).find("#modalEditUser").empty().append( tpl );

                this._modalWindowToggleEvent(e);//Действия по нажатию на модальное окно
                //this._initModalEvents();//Инициализируем события для модального окна
            },
            //Открытие модального окна для редактирования
            _openModalEditForm : function(e, model){

                this.editFormUserId = model.get('id');

                var tpl = _.template( tpl_formEditUser, model.toJSON() );
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
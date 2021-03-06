/**
 * Created by Micro on 24.08.2016.
 */
(function( $ )
{
    var 
        dialogHeight = 400,
        dialogWeight = 450,
    /*
     Для очистки сообщения валидации
     */
        typeText     = $(this).validatorMe().defaultTypeText;
    /**
     * Сохраняет задачу при создании и редакировании. Выполняет валидацию полей
     * @param ur
     * @param update
     * @param id
     * @returns {boolean}
     */
    function saveTask(ur, update, id) {
        var
            valid       = true,
        /*
         Поля html формы
         */
            name        = $("#name", creUpDialog),
            priority    = $("#priority", creUpDialog),
            state       = $("#state", creUpDialog),
            datepicker  = $("#datepickerDialog", creUpDialog);

        /*
        Блок валидации полей. Отрабатывает при редактировании и добавлении
        TODO: некоректно работает добавление желтого фона к активному полю. Подсвечивается первое поле, подсветка не снимается
         */
        valid = valid && $(this).validatorMe('checkLength', {objEl:name, nameEl:"Name", max:100});
        valid = valid && $(this).validatorMe('checkSelect', {objEl:priority, nameEl:"Priority"});
        valid = valid && $(this).validatorMe('checkSelect', {objEl:state, nameEl:"State"});

        valid = valid && $(this).validatorMe('checkRegexp', {objEl:name, pattern:/^[a-zа-яё0-9\s_]+$/i, sms:"Name may consist of a-z or а-Я, 0-9, underscores, spaces and must begin with a letter."});
        valid = valid && $(this).validatorMe('checkLength', {objEl:datepicker, nameEl:"Date", min:10,max:0});
        valid = valid && $(this).validatorMe('checkRegexp', {objEl:datepicker, pattern:/^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$/, sms:"Invalid date format : DD.MM.YEAR"});
        valid = valid && $(this).validatorMe('equalOrLaterDate', {objEl:datepicker, patternDate:/([\d]{1,2}).([\d]{1,2}).([\d]{4})/});
        /*
        Значения сохранения в БД
         */
        var newTask = {
                name: name.val(),
                priority: priority.val(),
                state: state.val(),
                datepicker: datepicker.val()
            },
        // При добавлении новой записи, в таблицу задач добавляется новая, но без id
        // т.к. id последней дабавленной записи не извлекается, но при реактировании id передается
        save = $.extend({id: ((typeof id != 'undefined') ? id : '')}, newTask);
        // Ajax запрос в БД, проверка валидации и ответа обработчика
        if (valid && ($(this).ajaxReq({url:ur, data:save, async:false}) == 200)){

            if(ur == '/add' && !update){

                insertElement(newTask);
            }
            else if(ur == '/upd' && update)
            {
                updateElement(update, newTask);
            }

            creUpDialog.dialog('close');
        }

        return valid;
    }
/**
 * Edit task
 */
$("a.edit").on("click", function (e) {

    e.preventDefault();

    var edEl = $(this).closest('tr'), // Task element
        id = edEl.data('task-id'); // ID db record
    edEl.addClass('yellowElement'); // Highlight selected task
    /*
    Объекты полей задачи из таблицы задач
     */
    var task = {
        name: edEl.children('td:nth-child(2)'),
        priority: edEl.children('td:nth-child(3)'),
        state: edEl.children('td:nth-child(4)'),
        datepicker: edEl.children('td:nth-child(5)')
    };

    creUpDialog = $("#dialog-form").clone(true).dialog({
        autoOpen: false,
        height: dialogHeight,
        width: dialogWeight,
        modal: true,
        buttons: {
            "Save a task": function () {
                saveTask('/upd', task, id);
            },
            Cancel: function () {
                edEl.removeClass('yellowElement');
                creUpDialog.dialog("close");
            }
        },
        title: "Update the task",
        open: function () {
            $('input[id=name]', creUpDialog).attr('value',task.name.text());
            $('input[id=datepickerDialog]', creUpDialog).attr('value',task.datepicker.text());

            selectSelect(task.priority.text(), $('select[id=priority]', creUpDialog));
            selectSelect(task.state.text(), $('select[id=state]', creUpDialog));
        },
        close: function () {
            edEl.removeClass('yellowElement');
            clearForm();
            creUpDialog.dialog('destroy'); // иначе дата не будет добавлятся в поле, после закрытия окна dialog
        }
    });

    datepickerInDialog(creUpDialog);
    creUpDialog.dialog('open');

});
/**
 * Create new task
 */
$("#create-task").button().on("click", function () {

    creUpDialog = $("#dialog-form").clone(true).dialog({
        autoOpen: false,
        height: dialogHeight,
        width: dialogWeight,
        modal: true,
        buttons: {
            "Create a task":  function () {
                saveTask('/add');
            },
            Cancel: function () {
                creUpDialog.dialog("close");
            }
        },
        close: function () {
            clearForm();
            creUpDialog.dialog('destroy');
        },
        title: "Create a new task"
    });

    datepickerInDialog(creUpDialog);

    creUpDialog.dialog("open");
});
    /**
     * Устанавливает selected для option, отменяя возможные установки
     * при предыдущих вызовах функции, установки selected
     * @param value
     * @param select
     */
    function selectSelect(value, select){

        var i = 1, option = select.get(0),  length = option.length;

        for ( ; i < length; i++ ){

            option[i].removeAttribute('selected');

            if(value == option[i].getAttribute('value'))
                option[i].setAttribute('selected', 'selected');
        }
    }

    /**
     * Заменяет текст после редактировании в форме
     * @param elements
     * @param newData
     */
    function updateElement(elements, newData) {

        for (var k in newData) {

            elements[k].text(newData[k]);
        }
    }

    /**
     * Добавляет новый елемент в таблицу задач при сохранении в БД
     * @param elements
     */
    function insertElement(elements){

        var obj = $("#task-list").children('tbody');
        //TODO: при добавлении настройки сортировки выдачи задач, сделать выбор условия append || prepend
        obj.prepend(
            $(this).createElementTable({elements: elements}));
    }

    /**
     * Костыль для корректной работы датапикера. Т.к. html форма диалогового окна открывается из
     * построенного DOM, то привязывать datepicker нужно к полю созданного клона dialog().
     * Так же нужно изменить #id, иначе будет конфликт: Cannot set property 'currentDay' of undefined.
     * Из-за присутствующего #id html формы уже построенного DOM
     * @param dialog
     */
    function datepickerInDialog(dialog){

        dialog.find('#datepicker').prop('id', 'datepickerDialog').datepicker({
            minDate: new Date(),
            dateFormat: "dd.mm.yy"
        });
    }

    /**
     * Функция очищения формы от изменений
     */
    function clearForm(){
        $(this).validatorMe('tipsField', {defaultTypeText:typeText}, true);
    }

})( jQuery );
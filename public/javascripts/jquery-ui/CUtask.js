$( function() {
    var
        name = $("#name"),
        priority = $("#priority"),
        state = $("#state"),
        datepicker = $("#datepicker"),
        allFields = $([]).add(name).add(priority).add(state).add(datepicker),
        typeText = $(this).validatorMe().defaultTypeText;

    function saveTask(ur, update, id) {

        var valid = true;

        valid = valid && $(this).validatorMe('checkLength', {objEl:name, nameEl:"Name", max:20});
        valid = valid && $(this).validatorMe('checkSelect', {objEl:priority, nameEl:"Priority"});
        valid = valid && $(this).validatorMe('checkSelect', {objEl:state, nameEl:"State"});

        valid = valid && $(this).validatorMe('checkRegexp', {objEl:name, pattern:/^[a-zа-яё0-9\s_]+$/i, sms:"Name may consist of a-z or а-Я, 0-9, underscores, spaces and must begin with a letter."});
        valid = valid && $(this).validatorMe('checkLength', {objEl:datepicker, nameEl:"Date", min:10,max:0});
        valid = valid && $(this).validatorMe('checkRegexp', {objEl:datepicker, pattern:/^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$/, sms:"Invalid date format : DD.MM.YEAR"});
        valid = valid && $(this).validatorMe('equalOrLaterDate', {objEl:datepicker, patternDate:/([\d]{1,2}).([\d]{1,2}).([\d]{4})/});

        var newTask = {
            name: name.val(),
            priority: priority.val(),
            state: state.val(),
            datepicker: datepicker.val()
        },
            save = $.extend({id: ((typeof id != 'undefined') ? id : '')}, newTask);

        if (valid && ($(this).ajaxReq({url:ur, data:save, async:false}) == 200)){
            
            if(ur == '/add' && !update){

                insertElement(newTask);
                aDialog.dialog("close");
            }
            else if(ur == '/upd' && update)
            {
                updateElement(update, newTask);
                uDialog.dialog("close");
            }

        }
        return valid;
    }

    function insertElement(elements){

        var obj = $("#task-list").children('tbody');

        obj.prepend(
            $(this).createElementTable({elements: elements}));
    }

    function updateElement(elements, newData){

        for(k in newData){

            elements[k].text(newData[k]);
        }
    }

    /**
     * Create new task
     */
    $("#create-task").button().on("click", function () {

        aDialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
                "Create a task":  function () {
                    saveTask('/add')
                },
                Cancel: function () {
                    aDialog.dialog("close");
                }
            },
            close: function () {
                aDialog.find('form').get(0).reset();
                $(this).validatorMe('clear', allFields, 'ui-state-error');
                $(this).validatorMe('tipsField', {defaultTypeText:typeText}, true);
            },
            title: "Create a new task",
            create: $("option:selected").removeAttr("selected")
        });

        aDialog.dialog("open");
    });

    /**
     * Edit task
     */
    $("a.edit").on("click", function (e) {

        e.preventDefault();

        var edEl = $(this).closest('tr'), // Task element
            id = edEl.data('task-id');
        edEl.addClass('yellowElement');


        var task = {
            name: edEl.children('td:nth-child(2)'),
            priority: edEl.children('td:nth-child(3)'),
            state: edEl.children('td:nth-child(4)'),
            datepicker: edEl.children('td:nth-child(5)')
        };

        /**
         * Updated field value on edit form
         */
        function updateForm() {

            form[0][1].setAttribute('value', task.name.text());

            var i = 1, length = form[0][2].length;

            for ( ; i < length; i++ ){
console.log();
                if(task.priority.text() == form[0][2][i].getAttribute('value'))
                    form[0][2][i].setAttribute('selected', 'selected');
            }

            i = 1; length = form[0][3].length;
            for ( ; i < length; i++ ){

                if(task.state.text() == form[0][3][i].getAttribute('value'))
                    form[0][3][i].setAttribute('selected', 'selected');
            }

            form[0][4].setAttribute('value', task.datepicker.text());
        }

        function resetForm() {

            //form[0][1].setAttribute('value', '');
            //form[0][4].setAttribute('value', '');
            ///form[0][2].prop('selected', '');
        }

        uDialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
                "Save a task": function () {
                    saveTask('/upd', task, id)
                },
                Cancel: function () {
                    uDialog.dialog("close");
                }
            },
            close: function () {
                $(this).validatorMe('clear', allFields, 'ui-state-error');
                edEl.removeClass('yellowElement');
                $(this).validatorMe('tipsField', {defaultTypeText:typeText}, true);
                uDialog.find('form').get(0).reset();
                resetForm();
            },
            title: "Update the task"
        });


        form = uDialog.find( "form" ).on( "submit", function( e ) {
            e.preventDefault();
        });
        updateForm();

        uDialog.dialog("open");
    });

} );
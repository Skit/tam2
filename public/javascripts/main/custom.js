/**
 * Created by Micro on 17.08.2016.
 */
$( function() {
    var dialog, form,

    // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
    //   emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        name = $( "#name" ),
        priority = $( "#priority" ),
        state = $( "#state" ),
        datepicker = $( "#datepicker" ),
        allFields = $( [] ).add( name ).add( priority ).add( state ).add( datepicker ),
        tips = $( ".validateTips" );

    function updateTips( t ) {
        tips
            .text( t )
            .addClass( "ui-state-highlight" );
        setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
    }

    function checkLength( o, n, min, max ) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass( "ui-state-error" );
            updateTips( "Length of " + n + " must be between " +
                min + " and " + max + "." );
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }

    function equalOrLaterDate(input, m){

        var inputDate = input.val();
        inputDate = inputDate.match(/([\d]{1,2}).([\d]{1,2}).([\d]{4})/);
        var serverDate = new Date();

        var year =inputDate[3], month =inputDate[2]-1,
            day =inputDate[1], hours =serverDate.getHours(),
            min =serverDate.getMinutes(), sec =serverDate.getSeconds(), msec =serverDate.getMilliseconds();

        var userDate = new Date(year, month, day, hours, min, sec, msec).valueOf();

        if((serverDate - userDate) <= 0){

            return true;
        } else {

            input.addClass( "ui-state-error" );
            updateTips(m);
            return false;
        }

    }

    function checkSelect( o, n) {
        if(!o.val()){
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }

    function addTaskAjax(id){

        var inform = $('#inform');
        $.ajax(
            {
                url : '/add',
                type: "POST",
                data : id,
                success:function(data, textStatus, jqXHR)
                {
                    inform.addClass('ui-state-highlight ui-corner-all').text('Succes added new task');
                    return true;
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    if(!inform.is(":visible")) inform.show();

                    inform.addClass('ui-state-error ui-corner-all').text('Error task added');
                    inform.hide(7000,'swing');
                    return false;
                }
            });
    }

    function addTask() {
        var valid = true;
        allFields.removeClass( "ui-state-error" );

        valid = valid && checkLength( name, "username", 3, 20 );
        valid = valid && checkSelect( priority, "Select Priority" );
        valid = valid && checkSelect( state, "Select State" );

        valid = valid && checkRegexp( name, /^[a-zа-яё0-9\s_]+$/i, "Name may consist of a-z or а-Я, 0-9, underscores, spaces and must begin with a letter." );
        valid = valid && checkRegexp( datepicker, /^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$/, "Invalid date format : DD.MM.YEAR" );
        valid = valid && equalOrLaterDate(datepicker, 'Later than or equal current date must be');

        var newTask = {
            name: name.val(),
            priority: priority.val(),
            state: state.val(),
            datepicker: datepicker.val()
        };

        if ( valid && addTaskAjax(newTask) ) {

            $( "#task-list tbody" ).prepend( "<tr class='ui-state-disabled'>" +"<td><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span></td>"+
                "<td>" + newTask.name + "</td>" +
                "<td>" + newTask.priority + "</td>" +
                "<td>" + newTask.state + "</td>" +
                "<td>" + newTask.datepicker + "</td>" +
                "<td><a data-task-id="+newId+" href=\"\">del</a>  | <a href=\"\">edit</a></td>" +
                "</tr>" );
            dialog.dialog( "close" );
        }
        return valid;
    }

    dialog = $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Create a task": addTask,
            Cancel: function() {
                dialog.dialog( "close" );
            }
        },
        close: function() {
            form[ 0 ].reset();
            allFields.removeClass( "ui-state-error" );
        }
    });

    form = dialog.find( "form" ).on( "submit", function( event ) {
        event.preventDefault();
        addTask();
    });

    $( "#create-user" ).button().on( "click", function() {
        dialog.dialog( "open" );
    });

    /**
     * Edit
     */
    $( "#sortable a.edit" ).on( "click", function() {

        var edEl = $(this).closest('tr'); // Task element
        edEl.addClass('yellowElement');

        var task = {
            name: edEl.children('td:nth-child(2)').text(),
            priority: edEl.children('td:nth-child(3)').text(),
            state: edEl.children('td:nth-child(4)').text(),
            datepicker: edEl.children('td:nth-child(5)').text()
        };
        var url = '/edit';

        /**
         * Edit task action
         */
        function editTaskAjax(){

            var inform = $('#inform');
            $.ajax(
                {
                    url : url,
                    type: "POST",
                    data : task,
                    success:function(data, textStatus, jqXHR)
                    {
                        inform.addClass('ui-state-highlight ui-corner-all').text('Save task success!');
                        return true;
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        if(!inform.is(":visible")) inform.show();

                        inform.addClass('ui-state-error ui-corner-all').text('Save task error!');
                        inform.hide(7000,'swing');
                        return false;
                    }
                });

            dialog.dialog('close');
        }

        function editTask() {
            var valid = true;
            allFields.removeClass( "ui-state-error" );

            valid = valid && checkLength( name, "username", 3, 20 );
            valid = valid && checkSelect( priority, "Select Priority" );
            valid = valid && checkSelect( state, "Select State" );

            valid = valid && checkRegexp( name, /^[a-zа-яё0-9\s_]+$/i, "Name may consist of a-z or а-Я, 0-9, underscores, spaces and must begin with a letter." );
            valid = valid && checkRegexp( datepicker, /^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$/, "Invalid date format : DD.MM.YEAR" );
            valid = valid && equalOrLaterDate(datepicker, 'Later than or equal current date must be');


            if ( valid && editTaskAjax() ) {

                $( "#task-list tbody" ).prepend( "<tr class='ui-state-disabled'>" +"<td><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span></td>"+
                    "<td>" + task.name + "</td>" +
                    "<td>" + task.priority + "</td>" +
                    "<td>" + task.state + "</td>" +
                    "<td>" + task.datepicker + "</td>" +
                    "<td><a data-task-id="+newId+" href=\"\">del</a>  | <a href=\"\">edit</a></td>" +
                    "</tr>" );
                dialog.dialog( "close" );
            }
            return valid;
        }

        /**
         * Updated field value on edit form
         */
        function updateForm() {

            $('.ui-dialog-title').text('Edit: '+ task.name);

            form[0][1].setAttribute('value', task.name);

            var i = 1, length = form[0][2].length;

            for ( ; i < length; i++ ){

                if(task.priority == form[0][2][i].getAttribute('value'))
                    form[0][2][i].setAttribute('selected', 'selected');
            }

            i = 1; length = form[0][3].length;
            for ( ; i < length; i++ ){

                if(task.state == form[0][3][i].getAttribute('value'))
                    form[0][3][i].setAttribute('selected', 'selected');
            }

            form[0][4].setAttribute('value', task.datepicker);
        }

        function resetForm() {

            $('.ui-dialog-title').text('Create new task');

            form[0][1].setAttribute('value', '');

            $("option:selected").removeAttr("selected");

            form[0][4].setAttribute('value', '');
        }

        var dialog = $('#dialog-form').dialog({
            height: 300,
            width: 350,
            modal: true,
            buttons: {
                "Save": editTask,
                Cancel: function() {

                    dialog.dialog( "close" );
                }
            },
            close: function() {
                resetForm();
                edEl.removeClass('yellowElement');
            }
        });

        form = dialog.find( "form" ).on( "submit", function( event ) {
            event.preventDefault();
        });

        updateForm();

        dialog.dialog('open');

        return false;
    });
} );
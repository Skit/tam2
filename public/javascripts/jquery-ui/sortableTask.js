/**
 * Соритировка элементов таблицы
 */
$( function() {

    var
        sc = $('#save-changes').button(),
        s  = $('#sortable').sortable({
            placeholder: "ui-state-highlight",
            update: function () {
                sc.button( "enable" ); // включаем кнопку "сохранить" при изменениях
            }
         });
    

    sc.click( function(e) {

        var i=0, task = s.children('tr[data-task-id]'), length=task.length, result= {};

        for(  ;i<length; i++){

           result[i] = task.eq(i).data('task-id');
        }

        result.l = length; // Отправляем длинну массива в обработчик чтобы не делать еще один цикл

        $(this).ajaxReq({url:'/sort', data:result});

        // TODO: кнопка станет неактивной при любом ответе от сервера...
        sc.button("disable");

        e.preventDefault();
    });

} );
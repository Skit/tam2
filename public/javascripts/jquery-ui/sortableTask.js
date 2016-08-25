$( function() {

    var s = $('#sortable'),
        sc = $('#save-changes');
    
    s.sortable({
        placeholder: "ui-state-highlight",
        update: function () {
            sc.prop('disabled', false);
        }
    });
    //s.disableSelection();

    sc.click( function(e) {

        var i=0, task = s.children('tr[data-task-id]'), length=task.length, result= {};

        for(  ;i<length; i++){

           result[i] = task.eq(i).data('task-id');
        }

        result['l'] = length;

        $(this).ajaxReq({url:'/sort', data:result});

        e.preventDefault();
    });

} );
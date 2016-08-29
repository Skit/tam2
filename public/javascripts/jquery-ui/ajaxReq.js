/**
 * Created by Micro on 22.08.2016.
 */
(function( $ ){
// TODO: переделать на промисы
    var defaultOptions = {
        successScore: 3000,
        successClass: 'ui-state-highlight ui-corner-all',
        successText: 'Succes',
        errorScore: 3000,
        errorClass: 'ui-state-error ui-corner-all',
        errorText: 'Error',
        loaderEl: '#loader',
        informEl: '#inform',
        method: 'POST',
        type: 'json',
        async: true,
        data: {}
    };

    var methods = {
        init : function( options ) {

            var settings = $.extend({}, defaultOptions, options);

            var
                // Сообщение об успехе или ошибке
                inform = $(settings.informEl);
                // Анимация при ожидании ответа от сервера
                loader = $(settings.loaderEl).show();

            var resp = $.ajax(
                {
                    url: settings.url,
                    method: settings.method,
                    dataType: settings.type,
                    data: settings.data,
                    async: settings.async,
                    success: function () {

                        if (!inform.is(":visible")) inform.show();
                        
                        inform.addClass(settings.successClass).text(settings.successText);
                        inform.hide(settings.successScore,'swing', function () {
                            inform.removeClass(settings.successClass);
                        });
                    },
                    error: function () {

                         if (!inform.is(":visible")) inform.show();

                         inform.addClass(settings.errorClass).text(settings.errorText);
                         inform.hide(settings.errorScore, 'swing', function () {
                             inform.removeClass(settings.errorClass);
                         });
                    }
                });

            loader.hide();
            return (settings.async)? 'async' : resp.status;
        } // End init();
    };

    $.fn.ajaxReq = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.ajaxReq' );
        }

    };

})( jQuery );
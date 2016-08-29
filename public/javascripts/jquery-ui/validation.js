/**
 * Created by Micro on 21.08.2016.
 */
(function( $ ){
    
    var defaultOptions = {
        errorClass: "ui-state-error",
        highLightClass: "ui-state-highlight",
        defaultTypeText: 'All form fields are required.',
        tips: ".validateTips"
    };

    var methods = {
        init : function( options ) {
            settings = $.extend({}, defaultOptions, options);
            return settings;
        },
        checkLength : function(option) {

            settings = $.extend({
                min: 3,
                max: 15,
                smsReplaceMin:"Length of %name must be minimum %min ",
                smsReplaceMinMax:"Length of %name must be between %min and %max."
            },
                defaultOptions, option);

            var objLength = settings.objEl.val().length;

            if(settings.max == 0 && objLength != settings.min){
                settings.objEl.addClass( settings.errorClass);
                methods.updateTips( settings.smsReplaceMin, [settings.nameEl, settings.min] );
            }
            else if ( (objLength > settings.max || objLength < settings.min) && settings.max != 0) {
                settings.objEl.addClass( settings.errorClass);
                methods.updateTips( settings.smsReplaceMinMax, [settings.name, settings.min, settings.max] );
                return false;
            } else {
                return true;
            }
        },
        checkSelect : function (options) {

            settings = $.extend({
                smsReplace:'Please select "%name" option'
            },
                defaultOptions, options);

            if(!settings.objEl.val()){
                settings.objEl.addClass(settings.errorClass);
                methods.updateTips( settings.smsReplace, settings.nameEl);
                return false;
            } else {
                return true;
            }
        },
        checkRegexp : function ( options) {

            settings = $.extend({}, defaultOptions, options);

            if (!( settings.pattern.test(settings.objEl.val() ))) {

                settings.objEl.addClass(options.errorClass);
                methods.updateTips(settings.sms);
                return false;
            } else {
                return true;
            }
        },
        equalOrLaterDate: function (options){

            settings = $.extend({
                sms: 'Later than or equal current date must be'
            },
                defaultOptions, options);

            var inputDate = settings.objEl.val();
            inputDate = inputDate.match(settings.patternDate);
            var serverDate = new Date();

            var year =inputDate[3], month =inputDate[2]-1,
                day =inputDate[1], hours =serverDate.getHours(),
                min =serverDate.getMinutes(), sec =serverDate.getSeconds(), msec =serverDate.getMilliseconds();

            var userDate = new Date(year, month, day, hours, min, sec, msec).valueOf();

            if((serverDate - userDate) <= 0){

                return true;
            } else {

                settings.objEl.addClass(settings.errorClass);
                methods.updateTips(settings.sms);
                return false;
            }

        },
        tipsField: function(options, text){

            settings = $.extend({}, defaultOptions, options);

            var obj = $(settings.tips);

            if(text === true){
                
                obj = obj.text(settings.defaultTypeText);
            }
            else if(text === false){

                obj = obj.text();
            }
            return obj;
        },
        /**
         * Добавляет сообщение валидации
         * @param patternText
         * @param value
         */
        updateTips: function (patternText, value) {

        if(!!settings.tips)
        {
            var tips = methods.tipsField({tips:settings.tips}),
                text = validationMessage(patternText, value);
            methods.tipsField({defaultTypeText:text}, true);
            tips
                .addClass( settings.highLightClass );
            setTimeout(function() {
                tips.removeClass( settings.highLightClass, 1500 );
            }, 500 );
        }
        else{
            $.error( 'You must set element for show validation message in settings plugin' );
        }
    }
    };

    $.fn.validatorMe = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.validatorMe' );
        }

    };


    /**
     * Формирует сообщение валидации
     * @param text
     * @param value
     * @returns {string|XML|void}
     */
    function validationMessage(text, value){

        if(!value){
            return text;
        }
        else if(typeof value !== 'object'){
            value = [value];
        }
        value.forEach(function(e){
            text = text.replace(/%[\w]*/, e);
        });
        return text;
    }

})( jQuery );
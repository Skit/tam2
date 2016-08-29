/**
 * Created by Micro on 23.08.2016.
 */
(function( $ ){

    var defaultOptions = {
        elements: {}
    };

    
    var methods = {
        init : function(options) {

            settings = $.extend({}, defaultOptions, options);

            var
                top = "<tr class='ui-state-disabled'><td><span class=\"ui-icon ui-icon-arrowthick-2-n-s\"></span></td>",
                td = '';
                bottom =  '<td><a class="del" href=""><span class="ui-state-default ui-state-error ui-corner-all ui-icon ui-icon-closethick"></span></a>\ ' +
                    ' | <a class="edit" href=""><span class="ui-state-default ui-corner-all ui-icon ui-icon-pencil"></span></a></td></tr>';

            for(el in settings.elements){

                td += "<td>" + settings.elements[el] + "</td>";
            }

            return (top + td + bottom);
        }
    };

    $.fn.createElementTable = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.createElementTable' );
        }

    };


})( jQuery );
(function () {
    'use strict';

    angular
        .module('myApp')
        .service('NgcWysiwygTextMenuService', NgcWysiwygTextMenuService)

    /** @ngInject */
    function NgcWysiwygTextMenuService(NgcWysiwygUtilService) {

        this.bold = function (NgcWysiwyg) {
            NgcWysiwygUtilService.aplicarEstilo(NgcWysiwyg, 'bold', 'b', 'strong')
        };
        this.italic = function (NgcWysiwyg) {
            NgcWysiwygUtilService.aplicarEstilo(NgcWysiwyg, 'italic', 'i', 'em')
        };
        this.strikeThrough = function (NgcWysiwyg) {
            NgcWysiwygUtilService.aplicarEstilo(NgcWysiwyg, 'strikeThrough', 'strike')
        };







    }

}());
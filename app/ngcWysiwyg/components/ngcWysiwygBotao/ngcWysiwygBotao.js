(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygBotao', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygBotao/ngcWysiwygBotao.html',
            bindings: {
                titulo: '@',
                icone: '@',
                callback: '<'
            }
        }

        function componentController() {

        }
    }

}());
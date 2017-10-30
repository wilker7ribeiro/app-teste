(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwyg', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './ngcWysiwug/ngcWysiwug.html',
            transclude: true,
            bindings: {}
        }

        function componentController() {
            var vm = this;

            init();

            function init() {

            }
        }
    }

}());
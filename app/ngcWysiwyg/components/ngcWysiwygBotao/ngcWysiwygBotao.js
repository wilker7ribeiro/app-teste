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
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            bindings: {
                titulo: '@',
                icone: '@',
                callback: '<',
                disabled: '<',
                classe: '@',
                active: '<'
            }
        }

        function componentController() {
            var vm = this;
            vm.callbackFn = function ($event) {

                vm.ngcWysiwyg.undoController.gravarPasso(function () {
                    vm.callback()
                    vm.ngcWysiwyg.atualizarModel()
                })

                $event.preventDefault()
            }
        }
    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygMenu/ngcWysiwygMenu.html',
            bindings: {
                titulo: '@',
                icone: '@',
                botoes: '<',
                disabled: '<'
            }
        }

        function componentController() {
            var vm = this;
            vm.abrirMenu = abrirMenu;
            vm.callbackFn = callbackFn;

            function abrirMenu($mdOpenMenu, $event) {
                $mdOpenMenu($event)
                $event.preventDefault()
            }
            function callbackFn($event, botao){
                botao.callback();
                $event.preventDefault()
            }
        }
    }

}());
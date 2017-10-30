(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwugAlignMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwugAlignMenu/ngcWysiwugAlignMenu.html',
            transclude: true,
            bindings: {}
        }

        function componentController() {
            var vm = this;
            vm.botoes = [
                {
                    icone: 'format_align_left',
                    callback: function () {
                        document.execCommand('justifyLeft', null, false);
                    }
                },
                {
                    icone: 'format_align_right',
                    callback: function () {
                        document.execCommand('justifyRight', null, false);
                    }
                },
                {
                    icone: 'format_align_justify',
                    callback: function () {
                        document.execCommand('justifyFull', null, false);
                    }
                },
                {
                    icone: 'format_align_center',
                    callback: function () {
                        document.execCommand('justifyCenter', null, false);
                    }
                }
            ]
            this.$onInit = function init() {

            }
        }
    }

}());
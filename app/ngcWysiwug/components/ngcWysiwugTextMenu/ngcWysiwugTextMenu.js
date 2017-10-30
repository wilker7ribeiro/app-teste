(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwugTextMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwugTextMenu/ngcWysiwugTextMenu.html',
            transclude: true,
            bindings: {}
        }

        function componentController() {
            var vm = this;
            vm.botoes = [
                {
                    icone: 'format_bold',
                    callback: function () {
                        document.execCommand('bold', null, false);
                    }
                },
                {
                    icone: 'format_italic',
                    callback: function () {
                        document.execCommand('italic', null, false);
                    }
                },
                {
                    icone: 'format_strikethrough',
                    callback: function () {
                        document.execCommand('strikeThrough', null, false);
                    }
                },
                {
                    icone: 'format_underlined',
                    callback: function () {
                        document.execCommand('underline', null, false);
                    }
                }
            ]
            this.$onInit = function init() {

            }
        }
    }

}());
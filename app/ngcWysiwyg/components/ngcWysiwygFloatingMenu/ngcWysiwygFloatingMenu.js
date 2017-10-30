(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygFloatingMenu', component());

    function component() {

        return {
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygFloatingMenu/ngcWysiwygFloatingMenu.html',
            bindings: {},
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            controller: function ($element) {
                var vm = this;
                vm.goToElement = function (target) {
                    var DOMElementTarget = target[0]
                    $element.css('top', DOMElementTarget.offsetTop + (DOMElementTarget.offsetHeight) + 8 + 'px')
                    $element.css('left', DOMElementTarget.offsetLeft + (DOMElementTarget.offsetWidth / 2) - (vm.botoes.length * 30 / 2) + 'px')
                }
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
                this.$postLink = function link() {
                    vm.ngcWysiwyg.floatingMenuCtrl = vm;
                }
            }
        }

    }

}());
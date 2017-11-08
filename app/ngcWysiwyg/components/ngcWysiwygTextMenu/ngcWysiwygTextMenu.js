(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygTextMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygTextMenu/ngcWysiwygTextMenu.html',
            bindings: {}
        }

        function componentController(NgcWysiwygUtilService) {
            var vm = this;

            vm.setBold = setText('Bold')
            vm.setItalic = setText('Italic')
            vm.setStrikeThrough = setText('StrikeThrough')
            vm.setUnderLine = setText('UnderLine')
            vm.isCursorText = isCursorText;
            vm.isSelectionInsideContent = isSelectionInsideContent

            function isSelectionInsideContent (){
                return NgcWysiwygUtilService.isInsideContentEditable();
            }
            function setText(type) {
                return function () {
                    document.execCommand(type, null, false);
                }
            }
            function isCursorText(type) {
                var queryComandResult = document.queryCommandValue(type);
                return queryComandResult === 'true' || queryComandResult === true
            }

            vm.menuFontFamilty = {
                titulo: 'Tipo de fonte',
                icone: 'format_size',
                botoes: [
                    { titulo: 'Arial', style: 'font-family: Arial;', callback: setFontFamilyFn('Arial') },
                    { titulo: 'Georgia', style: 'font-family: Georgia;', callback: setFontFamilyFn('Georgia') },
                    { titulo: 'Impact', style: 'font-family: Impact;', callback: setFontFamilyFn('Impact') },
                    { titulo: 'Tahoma', style: 'font-family: Tahoma;', callback: setFontFamilyFn('Tahoma') },
                    { titulo: 'Times New Roman', style: 'font-family: Times New Roman;', callback: setFontFamilyFn('Georgia') },
                    { titulo: 'Verdana', style: 'font-family: Verdana;', callback: setFontFamilyFn('Verdana') },
                ]
            }
            vm.menuFontSize = {
                titulo: 'Tamanho da fonte',
                icone: 'format_size',
                botoes: [
                    { titulo: 'A', style: 'font-size: x-small;', callback: setFontSizeFn(1) },
                    { titulo: 'A', style: 'font-size: small', callback: setFontSizeFn(2) },
                    { titulo: 'A', callback: setFontSizeFn(3) },
                    { titulo: 'A', style: 'font-size: large', callback: setFontSizeFn(4) },
                    { titulo: "A", style: 'font-size: x-large', callback: setFontSizeFn(5) },
                    { titulo: 'A', style: 'font-size: xx-large', callback: setFontSizeFn(6) },
                ]
            }
        }

        function setFontFamilyFn(fontName) {
            return function () {
                document.execCommand('fontName', null, fontName);
            }

        }
        function setFontSizeFn(fontSize) {
            return function () {
                document.execCommand('fontSize', null, fontSize);
            }

        }
        this.$onInit = function init() {

        }
    }




}());
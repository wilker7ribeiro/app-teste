(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygInputMenu', component());

    function component() {

        function surroundSelection(element) {
            if (window.getSelection) {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var range = sel.getRangeAt(0)
                    content = range.extractContents();
                    element.appendChild(content);

                    // sel.removeAllRanges();
                    // sel.addRange(range);
                }
            }
        }

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygInputMenu/ngcWysiwygInputMenu.html',
            bindings: {}
        }

        function componentController() {
            var vm = this;
            vm.botoes = [
                {
                    icone: 'format_list_bulleted',
                    titulo: 'Lista não ordenada',
                    callback: function () {
                        document.execCommand('insertUnorderedList', null, false);
                    }
                },
                {
                    icone: 'format_list_numbered',
                    titulo: 'Lista ordenada',
                    callback: function () {
                        document.execCommand('insertOrderedList', null, false);
                    }
                },
                {
                    icone: 'format_quote',
                    titulo: 'Inserir comentário',
                    callback: function () {
                         document.execCommand('formatBlock', null, "BLOCKQUOTE");
                        //surroundSelection(angular.element('<blockquote teste="true"></blockquote>')[0])
                    }
                },
                {
                    icone: 'format_underlined',
                    titulo: 'Lista não ordenada',
                    callback: function () {
                        document.execCommand('formatBlock', null, "P");
                        document.execCommand('insertHorizontalRule  ', null, false);
                    }
                }
            ]
            this.$onInit = function init() {

            }
        }
    }

}());
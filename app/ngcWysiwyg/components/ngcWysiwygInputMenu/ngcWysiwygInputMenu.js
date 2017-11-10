(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygInputMenu', component());

    function component() {
        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygInputMenu/ngcWysiwygInputMenu.html',
            bindings: {}
        }

        function componentController(NgcWysiwygUtilService) {
            var vm = this;


            vm.isSelectionInsideContent = function () {
                return NgcWysiwygUtilService.isInsideContentEditable();
            }
            vm.botoes = [
                {
                    icone: 'format_list_bulleted',
                    titulo: 'Lista não ordenada',
                    active: function () {
                        return NgcWysiwygUtilService.queryCommand('insertUnorderedList')
                    },
                    callback: function () {
                        if (!NgcWysiwygUtilService.queryCommand('formatBlock', 'blockquote')) {
                            document.execCommand('insertUnorderedList', null, false);
                            return;
                        }
                        document.execCommand('insertUnorderedList', null, false);
                    }
                },
                {
                    icone: 'format_list_numbered',
                    titulo: 'Lista ordenada',
                    active: function () {
                        return NgcWysiwygUtilService.queryCommand('insertOrderedList')
                    },
                    callback: function () {
                        if (!NgcWysiwygUtilService.queryCommand('formatBlock', 'blockquote')) {
                            document.execCommand('insertOrderedList', null, false);
                            return;
                        }
                        document.execCommand('formatBlock', null, 'p');
                    }
                },
                {
                    icone: 'format_quote',
                    titulo: 'Inserir comentário',
                    active: function () {
                        return NgcWysiwygUtilService.queryCommand('formatBlock', 'blockquote')
                    },
                    callback: function () {
                        if (!NgcWysiwygUtilService.queryCommand('formatBlock', 'blockquote')) {
                            document.execCommand('formatBlock', null, "blockquote");
                            return;
                        }
                        document.execCommand('formatBlock', null, 'p');

                        //surroundSelection(angular.element('<blockquote teste="true"></blockquote>')[0])
                    }
                },
                {
                    icone: 'brush',
                    titulo: 'Limpar Formatação',
                    active: function () {
                        return false;
                    },
                    callback: function () {
                        document.execCommand('removeFormat');
                    }
                }
            ]
            this.$onInit = function init() {

            }
        }
    }

}());
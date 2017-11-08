(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygAlignMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygAlignMenu/ngcWysiwygAlignMenu.html',
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            bindings: {
                disabled: '<'
            }
        }

        function componentController() {
            var vm = this;
            function isCursorText(type, alternativo) {
                var result = document.queryCommandValue(type);
                return result === 'true' || result === true || result === alternativo
            }
            vm.botoes = [
                {
                    icone: 'format_align_left',
                    titulo: 'Esquerda',
                    callback: function () {
                        document.execCommand('justifyLeft', null, false);
                    },
                    active: function(){
                        return isCursorText('justifyLeft', "left");
                    }
                },
                {
                    icone: 'format_align_right',
                    titulo: 'Direita',
                    callback: function () {
                        document.execCommand('justifyRight', null, false);
                    },
                    active: function(){
                        return isCursorText('justifyRight', "right");
                    }
                },
                {
                    icone: 'format_align_justify',
                    titulo: 'Justificado',
                    callback: function () {
                        document.execCommand('justifyFull', null, false);
                    },
                    active: function(){
                        return isCursorText('justifyFull', "justify");
                    }
                },
                {
                    icone: 'format_align_center',
                    titulo: 'Centro',
                    callback: function () {
                        document.execCommand('justifyCenter', null, false);
                    },
                    active: function(){
                        return isCursorText('justifyCenter', "center");
                    }
                },
                {
                    icone: 'add',
                    titulo: 'ADICIONAR IMAGEM',
                    callback: function () {
                        document.execCommand('insertImage', null, 'https://www.espacoblog.com/wp-content/uploads/2013/03/978.png');
                    }
                }
            ]
            this.$onInit = function init() {
                vm.disabled = function() {
                    return vm.ngcWysiwyg.imagemSelecionada
                }
            }

        }
    }

}());
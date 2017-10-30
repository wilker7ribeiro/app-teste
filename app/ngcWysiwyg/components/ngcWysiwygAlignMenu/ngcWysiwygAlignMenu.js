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
            bindings: {}
        }

        function componentController() {
            var vm = this;
            vm.botoes = [
                {
                    icone: 'format_align_left',
                    titulo: 'Esquerda',
                    callback: function () {
                        document.execCommand('justifyLeft', null, false);
                    }
                },
                {
                    icone: 'format_align_right',
                    titulo: 'Direita',
                    callback: function () {
                        document.execCommand('justifyRight', null, false);
                    }
                },
                {
                    icone: 'format_align_justify',
                    titulo: 'Justificado',
                    callback: function () {
                        document.execCommand('justifyFull', null, false);
                    }
                },
                {
                    icone: 'format_align_center',
                    titulo: 'Centro',
                    callback: function () {
                        document.execCommand('justifyCenter', null, false);
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

            }
            vm.abrirMenu = abrirMenu;


            function abrirMenu($mdOpenMenu, $event){
                $mdOpenMenu($event)
            }
        }
    }

}());
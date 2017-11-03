(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwyg', component());

    function component() {

        return {
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                htmlValue: '=?'
            },
            templateUrl: './public/ngcWysiwyg/ngcWysiwyg.html',
            controller: function ($scope, $element, $timeout, NgcWysiwygUndoFactory) {
                var vm = this;

                vm.undoController = NgcWysiwygUndoFactory(vm)
                vm.imagemSelecionada;

                vm.floatingMenuCtrl;

                vm.divEditableElement;
                vm.atualizarHtml;
                vm.atualizarModel;
                vm.mudouValor;


                vm.aoMudarValor = function() {

                }

                vm.setImageSelected = function (imgElement, botoes) {
                    vm.itemSelecionado = imgElement[0]
                    vm.imagemSelecionada = true;
                }
                vm.removerImagemSelecionada = function () {
                    vm.itemSelecionado = null;
                    vm.imagemSelecionada = false;
                }
                vm.setBotoesMenuFlutuante = function (botoes) {
                    vm.floatingMenuCtrl.botoes = botoes;
                }

                this.$onInit = function init() {
                    document.execCommand('styleWithCSS', null, true)
                }
            }
        }

    }



}());
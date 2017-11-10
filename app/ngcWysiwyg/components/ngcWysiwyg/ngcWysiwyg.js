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
            controller: function ($scope, $element, $timeout, NgcWysiwygUndoFactory, NgcWysiwygUtilService) {
                var vm = this;

                vm.undoController = NgcWysiwygUndoFactory(vm)

                vm.imagemSelecionada;
                vm.removerImagemSelecionada = removerImagemSelecionada
                vm.setImageSelected = setImageSelected

                vm.floatingMenuCtrl; // Instanciado pelo NgcWysiwygFloatingMenu
                vm.setBotoesMenuFlutuante = setBotoesMenuFlutuante

                // Instanciados pelo NgcWysiwygEditable
                vm.divEditableElement;
                vm.atualizarHtml;
                vm.atualizarModel;
                vm.mudouValor;




                vm.setItemSelecionado = setItemSelecionado;

                function removerImagemSelecionada() {
                    vm.itemSelecionado = null;
                    vm.imagemSelecionada = false;

                }
                function setImageSelected(imgElement) {
                    vm.setItemSelecionado(imgElement)
                    NgcWysiwygUtilService.clearSelection();
                    vm.imagemSelecionada = true;
                }

                function setItemSelecionado(element) {
                    vm.itemSelecionado = element
                }

                function setBotoesMenuFlutuante(botoes) {
                    vm.floatingMenuCtrl.botoes = botoes;
                }
                this.$onInit = function init() {
                }
                this.$postLink = function () {
                    document.execCommand('styleWithCSS', null, true)
                    document.execCommand("enableObjectResizing", false, false);
                }
            }
        }

    }



}());
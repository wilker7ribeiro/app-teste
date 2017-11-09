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

                vm.floatingMenuCtrl;

                vm.divEditableElement;
                vm.atualizarHtml;
                vm.atualizarHtmlComDOMElement;
                vm.atualizarModel;
                vm.mudouValor;


                vm.aoMudarValor = function() {

                }
                vm.setItemSelecionado = function(element){
                     vm.itemSelecionado = element

                }
                vm.setImageSelected = function (imgElement) {
                    vm.setItemSelecionado(imgElement)
                    NgcWysiwygUtilService.clearSelection();
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
                }
                this.$postLink = function(){
                    document.execCommand('styleWithCSS', null, true)
                    document.execCommand("enableObjectResizing", false, false);
                }
            }
        }

    }



}());
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
                vm.undoController.configurarGravacaoContinua();
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

                vm.teste = function ($event) {
                    $event.preventDefault()
                    var jaTem = NgcWysiwygUtilService.queryCommand('bold')
                    console.log(jaTem)
                    var range = NgcWysiwygUtilService.getRange()
                    console.log(range)
                    if (!jaTem) {
                        console.log('ativar')
                        var strongElement = document.createElement('strong')
                        range.surroundContents(strongElement)
                        strongElement.innerHTML = '&#8203;';
                        range.selectNodeContents(strongElement);
                        range.collapse(false);
                        var sel = NgcWysiwygUtilService.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } else {
                        console.log('desativar')
                        console.log('textContent', range.startContainer.textContent.replace(/\u200B/g,'').length)
                        if ( range.startContainer.textContent.replace(/\u200B/g,'').length === 0) {
                            console.log('nada escrito')
                        } else {
                            //if(range.startContainer.nextSibling.nodeType === Node.TEXT_NODE){
                                document.execCommand('bold', true, false)
                                var textoDireita = range.startContainer.parentNode.nextSibling
                                if(textoDireita){
                                   textoDireita.textContent = '\u200B' + textoDireita.textContent
                                } else {
                                    var newNode = document.createTextNode('\u200B');
                                    range.startContainer.parentNode.parentNode.append(newNode)
                                    textoDireita = newNode;
                                }
                                range.setStart(textoDireita, 1);
                                range.setEnd(textoDireita, 1);
                                //textoMaisPerto.innerHTML = '&#8203;'+ textoMaisPerto.innerHTML
                                //NgcWysiwygUtilService.setRange(textoMaisPerto, 1, textoMaisPerto, 1)

                            //}
                            console.log('tem coisa escrita')
                        }
                    }
                    console.log(range)

                }



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
                    if (document.queryCommandSupported('styleWithCSS')) {
                        document.execCommand('styleWithCSS', null, false)
                    }
                    if (document.queryCommandSupported('enableObjectResizing')) {
                        document.execCommand("enableObjectResizing", false, false);
                    }
                }
            }
        }

    }



}());
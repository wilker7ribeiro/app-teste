(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('NgcWysiwygUndoFactory', function (NgcWysiwygUtilService) {


            return function NgcWysiwygUndoFactory(ngcWysiwyg) {
                return {
                    passoAtualIndex: 0,
                    passos: [],
                    ngcWysiwyg: ngcWysiwyg,
                    gravarPasso: gravarPasso,
                    iniciarGravacaoParcial: iniciarGravacaoParcial,
                    atualizarComponenteParaPasso: atualizarComponenteParaPasso,
                    undo: undo,
                    canUndo: canUndo,
                    redo: redo,
                    canRedo: canRedo,
                    gravacaoAtual: null
                }

                function getNodeTree(node) {
                    node = angular.element(node)[0]
                    var indexArray = []
                    var parent = node.parentNode;
                    while (parent.nodeName !== "NGC-WYSIWYG-EDITABLE-CONTAINER") {
                        var index = Array.prototype.indexOf.call(parent.childNodes, node);
                        indexArray.push(index)
                        node = parent;
                        parent = parent.parentNode;
                    }
                    return indexArray;
                }
                function getNodeFromTree(tree, ngcWysiwyg) {
                    var treeCopy = tree.slice(0);
                    var elementoPai = ngcWysiwyg.divEditableElement[0]
                    var element;
                    var index = treeCopy.pop()
                    while (!angular.isUndefined(index) && index !== null) {
                        element = elementoPai.childNodes[index]
                        elementoPai = element;
                        index = treeCopy.pop()
                    }
                    return element;
                }
                function iniciarGravacaoParcial() {
                    var self = this;
                    this.gravacaoAtual = {
                        rangeInicial: iniciarGravacao(),
                        gravando: true,
                        finalizar: function () {
                            if (this.gravando) {
                                finalizarGravacao.call(self, this.rangeInicial)
                                this.gravando = false;
                            }
                        },
                        rollback: function () {
                            if (this.gravando) {
                                rollbackGravacao.call(self, this.rangeInicial)
                                this.gravando = false;
                            }
                        }
                    }
                    return this.gravacaoAtual
                }
                function montarRangeAtual() {
                    var range = NgcWysiwygUtilService.copyRange()
                    return {
                        startOffset: range.startOffset,
                        endOffset: range.endOffset,
                        startNodeTree: getNodeTree(range.startContainer),
                        endNodeTree: getNodeTree(range.endContainer)
                    }
                }
                function iniciarGravacao() {
                    return montarRangeAtual()
                }
                function rollbackGravacao(rangeInicial) {
                    this.ngcWysiwyg.atualizarModel(this.passos[this.passoAtualIndex].html);
                    this.ngcWysiwyg.atualizarHtml()
                    NgcWysiwygUtilService.setRange(getNodeFromTree(rangeInicial.startNodeTree, this.ngcWysiwyg), rangeInicial.startOffset, getNodeFromTree(rangeInicial.endNodeTree, this.ngcWysiwyg), rangeInicial.endOffset);
                }

                function finalizarGravacao(rangeInicial) {
                    if (this.passos[this.passoAtualIndex].html !== this.ngcWysiwyg.ngModelCtrl.$viewValue) {
                        this.passos = this.passos.slice(0, this.passoAtualIndex + 1)
                        this.passos.push({
                            html: this.ngcWysiwyg.ngModelCtrl.$viewValue,
                            rangeInicial: rangeInicial,
                            rangeFinal: montarRangeAtual()
                        })
                        this.passoAtualIndex++;
                        console.log('passo adicionado', this.passos)
                    }
                }

                function undo() {
                    if (this.canUndo()) {
                    this.atualizarComponenteParaPasso(this.passoAtualIndex - 1)
                    this.passoAtualIndex--;
                    }
                }

                function gravarPasso(passo) {
                    var rangeInicial = iniciarGravacao.call(this)
                    if (this.gravacaoAtual) {
                        this.gravacaoAtual.finalizar();
                    }
                    passo()

                    finalizarGravacao.call(this, rangeInicial)
                }

                function canUndo() {
                    return this.passoAtualIndex > 0
                }
                function atualizarComponenteParaPasso(index) {
                    this.ngcWysiwyg.atualizarModel(this.passos[index].html);
                    this.ngcWysiwyg.atualizarHtml()
                    if (this.passoAtualIndex > index) {
                        var range = this.passos[index + 1].rangeInicial
                        if (range) {
                            NgcWysiwygUtilService.setRange(getNodeFromTree(range.startNodeTree, this.ngcWysiwyg), range.startOffset, getNodeFromTree(range.endNodeTree, this.ngcWysiwyg), range.endOffset);
                            return
                        }
                    } else {
                        var range = this.passos[index].rangeFinal
                        if (range) {
                            NgcWysiwygUtilService.setRange(getNodeFromTree(range.startNodeTree, this.ngcWysiwyg), range.startOffset, getNodeFromTree(range.endNodeTree, this.ngcWysiwyg), range.endOffset);
                            return
                        }
                    }
                    NgcWysiwygUtilService.clearSelection()
                }
                function redo(params) {
                    if(this.canRedo()){
                        this.atualizarComponenteParaPasso(this.passoAtualIndex + 1)
                        this.passoAtualIndex++
                    }
                }
                function canRedo() {
                    return this.passos.length - 1 > this.passoAtualIndex && this.passoAtualIndex !== this.passos.length - 1
                }

            }

        })

}());
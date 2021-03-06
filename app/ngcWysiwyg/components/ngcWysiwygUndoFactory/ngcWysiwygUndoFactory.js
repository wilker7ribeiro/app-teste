(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('NgcWysiwygUndoFactory', function (NgcWysiwygUtilService, $timeout) {


            return function NgcWysiwygUndoFactory(ngcWysiwyg) {
                return {
                    passoAtualIndex: 0,
                    passos: [],
                    ngcWysiwyg: ngcWysiwyg,
                    gravarPasso: gravarPasso,
                    gravarPassoTimeout: gravarPassoTimeout,
                    iniciarGravacaoManual: iniciarGravacaoManual,
                    atualizarComponenteParaPasso: atualizarComponenteParaPasso,
                    undo: undo,
                    afterUndo: [],
                    canUndo: canUndo,
                    redo: redo,
                    canRedo: canRedo,
                    configurarGravacaoContinua: function () {
                        var controller = this;
                        this.gravacaoContinua = {
                            iniciar: function (disableTimeout) {
                                if (!this.gravando) {
                                    console.log('iniciar')
                                    var gravacao = this;
                                    this.timeoutTime = 1500;
                                    this.rangeInicial = iniciarGravacao()
                                    this.gravando = true
                                    this.disableTimeout = disableTimeout;
                                    if (!disableTimeout) {
                                        this.timeout = $timeout(function () {
                                            gravacao.finalizar();
                                        }, this.timeoutTime)
                                    }
                                }
                            },
                            refreshTimeout: function () {
                                var gravacao = this;
                                console.log('refresh')
                                $timeout.cancel(this.timeout)
                                if (!this.disableTimeout) {
                                    this.timeout = $timeout(function () {
                                        gravacao.finalizar();
                                    }, this.timeoutTime)
                                }
                            },
                            finalizar: function () {
                                if (this.gravando) {
                                    console.log('finalizar')
                                    finalizarGravacao.call(controller, this.rangeInicial)
                                    $timeout.cancel(this.timeout)
                                    this.gravando = false;
                                }
                            },
                            rollback: function () {
                                if (this.gravando) {
                                    rollbackGravacao.call(controller, this.rangeInicial)
                                    $timeout.cancel(this.timeout)
                                    this.gravando = false;
                                }
                            }
                        }
                    }
                }

                function iniciarGravacaoManual() {
                    var self = this;
                    this.gravacaoContinua = {
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
                    return this.gravacaoContinua
                }




                function montarRange() {


                    var range = NgcWysiwygUtilService.copyRange()
                    if (!range) {
                        return null;
                    }
                    var selectedText = NgcWysiwygUtilService.getSelectedText()
                    var originalStart = NgcWysiwygUtilService.getRangeInTextNode(range, false)
                    var originalEnd = NgcWysiwygUtilService.getRangeInTextNode(range, true)

                    if (!originalEnd || !originalStart) {
                        return null
                    }

                    var retornoNormalizeStart
                    var retornoNormalizeEnd
                    if (originalStart.node !== originalEnd.node) {
                        retornoNormalizeStart = NgcWysiwygUtilService.normalize(originalStart.parent, originalStart.node, originalStart.offset)
                        if (!NgcWysiwygUtilService.isConnected(originalEnd.node)) {
                            retornoNormalizeEnd = {
                                nodeSelected: retornoNormalizeStart.nodeSelected,
                                //offset: originalStart.offset + selectedText.length
                                offset: retornoNormalizeStart.offset + selectedText.length
                            }
                        } else {
                            retornoNormalizeEnd = NgcWysiwygUtilService.normalize(originalEnd.parent, originalEnd.node, originalEnd.offset)
                        }
                    } else {
                        retornoNormalizeStart = NgcWysiwygUtilService.normalize(originalStart.parent, originalStart.node, originalStart.offset)
                        retornoNormalizeEnd = { nodeSelected: retornoNormalizeStart.nodeSelected, offset: retornoNormalizeStart.offset + (originalEnd.offset - originalStart.offset) }
                    }

                    NgcWysiwygUtilService.setRange(
                        retornoNormalizeStart.nodeSelected, retornoNormalizeStart.offset,
                        retornoNormalizeEnd.nodeSelected, retornoNormalizeEnd.offset
                    )

                    return {
                        startOffset: retornoNormalizeStart.offset,
                        endOffset: retornoNormalizeEnd.offset,
                        startNodeTree: NgcWysiwygUtilService.getNodeTree(retornoNormalizeStart.nodeSelected),
                        endNodeTree: NgcWysiwygUtilService.getNodeTree(retornoNormalizeEnd.nodeSelected)
                    }
                }

                function iniciarGravacao() {
                    return montarRange()
                }
                function rollbackGravacao(rangeInicial) {
                    finalizarGravacao.call(this, rangeInicial)
                    this.undo();
                    // this.ngcWysiwyg.atualizarModel(this.passos[this.passoAtualIndex].html);
                    // this.ngcWysiwyg.atualizarHtml()
                    // NgcWysiwygUtilService.setRange(
                    //     NgcWysiwygUtilService.getNodeFromTree(rangeInicial.startNodeTree, this.ngcWysiwyg), rangeInicial.startOffset,
                    //     NgcWysiwygUtilService.getNodeFromTree(rangeInicial.endNodeTree, this.ngcWysiwyg), rangeInicial.endOffset
                    // );
                }

                function finalizarGravacao(rangeInicial) {
                    if (this.passos[this.passoAtualIndex].html !== this.ngcWysiwyg.divEditableElement.html()) {
                        this.passos = this.passos.slice(0, this.passoAtualIndex + 1)
                        var passo = {
                            html: this.ngcWysiwyg.divEditableElement.html(),
                            rangeInicial: rangeInicial,
                            rangeFinal: montarRange()
                        }
                        this.passos.push(passo)
                        this.passoAtualIndex++;
                        console.log('passo adicionado', passo, this.passos)
                    }
                }

                function undo() {
                    if (this.canUndo()) {
                        this.atualizarComponenteParaPasso(this.passoAtualIndex - 1)
                        this.passoAtualIndex--;
                        angular.forEach(this.afterUndo, function (fn) {
                            fn();
                        })
                    }
                }

                function gravarPasso(passo) {
                    var rangeInicial = iniciarGravacao.call(this)
                    this.gravacaoContinua.finalizar();
                    passo()
                    finalizarGravacao.call(this, rangeInicial)
                }
                function gravarPassoTimeout(passo) {
                    var self = this;
                    var rangeInicial = iniciarGravacao.call(this)
                    this.gravacaoContinua.finalizar();
                    if (passo) {
                        passo()
                    }
                    $timeout(function () {
                        finalizarGravacao.call(self, rangeInicial)
                    }, 0)
                }
                function canUndo() {
                    return this.passoAtualIndex > 0
                }
                function atualizarComponenteParaPasso(index) {
                    this.ngcWysiwyg.atualizarModel(this.passos[index].html);
                    this.ngcWysiwyg.atualizarHtml()
                    var range;
                    if (this.passoAtualIndex > index) {
                        range = this.passos[index + 1].rangeInicial
                        if (range) {
                            NgcWysiwygUtilService.setRange(
                                NgcWysiwygUtilService.getNodeFromTree(range.startNodeTree, this.ngcWysiwyg), range.startOffset,
                                NgcWysiwygUtilService.getNodeFromTree(range.endNodeTree, this.ngcWysiwyg), range.endOffset
                            );
                            return
                        }
                    } else {
                        range = this.passos[index].rangeFinal
                        if (range) {
                            NgcWysiwygUtilService.setRange(
                                NgcWysiwygUtilService.getNodeFromTree(range.startNodeTree, this.ngcWysiwyg), range.startOffset,
                                NgcWysiwygUtilService.getNodeFromTree(range.endNodeTree, this.ngcWysiwyg), range.endOffset
                            );
                            return
                        }
                    }
                    NgcWysiwygUtilService.clearSelection()
                }
                function redo() {
                    if (this.canRedo()) {
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
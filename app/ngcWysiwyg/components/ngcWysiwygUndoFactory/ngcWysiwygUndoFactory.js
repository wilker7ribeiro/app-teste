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
                    iniciarGravacaoParcial: iniciarGravacaoParcial,
                    atualizarComponenteParaPasso: atualizarComponenteParaPasso,
                    undo: undo,
                    canUndo: canUndo,
                    redo: redo,
                    canRedo: canRedo,
                    gravacaoAtual: null
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

                function normalize(nodeInicial, nodeSelected, offset) {
                    var retorno = {};
                    if (!nodeInicial) { return; }
                    var block = nodeInicial.firstChild
                    while (block) {
                        if(block.nodeType === 3){
                            if (block === nodeSelected) {
                                retorno.nodeSelected = block;
                                retorno.offset = offset;
                            }
                            var nodeIrmao = block.nextSibling
                            while (nodeIrmao && nodeIrmao.nodeType === 3) {
                                if (nodeIrmao === nodeSelected) {
                                    retorno.nodeSelected = block;
                                    retorno.offset = block.nodeValue.length + offset;
                                }
                                block.nodeValue += nodeIrmao.nodeValue;
                                nodeInicial.removeChild(nodeIrmao);
                                var nodeIrmao = block.nextSibling;
                            }
                        }
                        block = block.nextSibling
                    }
                    return retorno;
                }
                function getTextNodeWithTextFrom(element, text, cb) {
                    for (var i = 0; i < element.childNodes.length; i++) {
                        var childNode = element.childNodes[i];
                        if ([1, 9, 11].indexOf(childNode.nodeType)) {
                            if (childNode.data.indexOf(text)) {
                                cb(childNode)
                            }
                        }
                    }
                }
                function montarRange() {


                    var range = NgcWysiwygUtilService.copyRange()
                    var ua = window.navigator.userAgent;
                    var msie = ua.indexOf("MSIE ") !== -1;

                    //if (msie){
                    //if (range.startContainer === range.endContainer) {
                    // var originalStart = range.startContainer;
                    // var originalEnd = range.endContainer;
                    // var startParent = range.startContainer.parentNode;
                    // var endParent = range.endContainer.parentNode;
                    // var startText;
                    // var endText;
                    // var startNode;
                    // var endNode;
                    // if (range.startContainer === range.endContainer) {
                    //     startText = range.startContainer.textContent.slice(range.startOffset, range.endOffset);
                    //     endText = startText;
                    // } else {
                    //     startText = range.startContainer.textContent.slice(range.startOffset);
                    //     endText = range.endContainer.textContent.slice(0, range.endOffset)
                    // }
                    var originalStart = range.startContainer;
                    var originalEnd = range.endContainer;
                    var originalStartParent = originalStart.parentNode;
                    var originalEndParent = originalEnd.parentNode
                    var originalStartOffset = range.startOffset;
                    var originalEndOffset = range.endOffset;
                    var retornoNormalizeStart
                    var retornoNormalizeEnd
                    if(originalStart !== originalEnd){
                        retornoNormalizeStart = normalize(originalStartParent, originalStart, originalStartOffset)
                        retornoNormalizeEnd = normalize(originalEndParent, originalEnd, originalEndOffset)
                    } else {
                        retornoNormalizeStart = normalize(originalStartParent, originalStart, originalStartOffset)
                        retornoNormalizeEnd = { nodeSelected: retornoNormalizeStart.nodeSelected, offset: retornoNormalizeStart.offset + (originalEndOffset - originalStartOffset)}
                    }

                    // var startOffset
                    // var endOffset = endParent.textContent.indexOf(endText) + endText.length
                    // if (range.startContainer.nodeName !== '#text') {
                    //     getTextNodeWithTextFrom(startParent, startText, function (textNode) {
                    //         startNode = textNode
                    //         startOffset = textNode.data.indexOf(startText)
                    //     })
                    // } else {
                    //     startNode = range.startContainer
                    //     startOffset = startParent.textContent.indexOf(startText)
                    // }
                    // if (range.endContainer.nodeName !== '#text') {
                    //     getTextNodeWithTextFrom(endParent, endText, function (textNode) {
                    //         endNode = textNode
                    //         endOffset = textNode.data.indexOf(endText) + endText.length;
                    //     })
                    // } else {
                    //     endNode = range.endContainer
                    //     endOffset = endParent.textContent.indexOf(endText) + endText.length;
                    // }
                    NgcWysiwygUtilService.setRange(
                        retornoNormalizeStart.nodeSelected, retornoNormalizeStart.offset,
                        retornoNormalizeEnd.nodeSelected, retornoNormalizeEnd.offset
                    )
                    //}

                    // } else {
                    //     range.startContainer.parentNode.normalize()
                    //     range.endContainer.parentNode.normalize()
                    // }


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
                    this.ngcWysiwyg.atualizarModel(this.passos[this.passoAtualIndex].html);
                    this.ngcWysiwyg.atualizarHtml()
                    NgcWysiwygUtilService.setRange(
                        NgcWysiwygUtilService.getNodeFromTree(rangeInicial.startNodeTree, this.ngcWysiwyg), rangeInicial.startOffset,
                        NgcWysiwygUtilService.getNodeFromTree(rangeInicial.endNodeTree, this.ngcWysiwyg), rangeInicial.endOffset
                    );
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
                function gravarPassoTimeout(passo) {
                    var self = this;
                    var rangeInicial = iniciarGravacao.call(this)
                    if (this.gravacaoAtual) {
                        this.gravacaoAtual.finalizar();
                    }
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
                    if (this.passoAtualIndex > index) {
                        var range = this.passos[index + 1].rangeInicial
                        if (range) {
                            NgcWysiwygUtilService.setRange(
                                NgcWysiwygUtilService.getNodeFromTree(range.startNodeTree, this.ngcWysiwyg), range.startOffset,
                                NgcWysiwygUtilService.getNodeFromTree(range.endNodeTree, this.ngcWysiwyg), range.endOffset
                            );
                            return
                        }
                    } else {
                        var range = this.passos[index].rangeFinal
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
                function redo(params) {
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
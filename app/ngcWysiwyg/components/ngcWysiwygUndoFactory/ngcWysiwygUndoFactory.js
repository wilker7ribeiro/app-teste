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
                        if (block.nodeType === Node.TEXT_NODE) {
                            if (block === nodeSelected) {
                                retorno.nodeSelected = block;
                                retorno.offset = offset;
                            }
                            var nodeIrmao = block.nextSibling
                            while (nodeIrmao && nodeIrmao.nodeType === Node.TEXT_NODE) {
                                if (nodeIrmao === nodeSelected) {
                                    retorno.nodeSelected = block;
                                    retorno.offset = block.nodeValue.length + offset;
                                }
                                block.nodeValue += nodeIrmao.nodeValue;
                                nodeInicial.removeChild(nodeIrmao);
                                nodeIrmao = block.nextSibling;
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
                function isConnected(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        return !!node.parentNode
                    } else {
                        return document.contains(node);
                    }
                }

                function getNearTextNode(node) {
                    var irmaoDireita = node.nextSibling
                    while (irmaoDireita && irmaoDireita.nodeType !== Node.TEXT_NODE) {
                        irmaoDireita = irmaoDireita.nextSibling;
                    }
                    if (!irmaoDireita) {
                        var irmaoEsquerda = node.nextSibling
                        while (irmaoEsquerda && irmaoEsquerda.nodeType !== Node.TEXT_NODE) {
                            irmaoEsquerda = irmaoDireita.previousSibling;
                        }
                        if (!irmaoEsquerda) {
                            return getNearTextNode(node.parent);
                        }
                        return;
                    }
                    return irmaoDireita;
                }
                function prepararRange(range, final) {

                    var node = final ? range.endContainer : range.startContainer
                    var offset = final ? range.endOffset : range.startOffset;
                    while (node.nodeType !== Node.TEXT_NODE) {
                        if (node.childNodes.length <= 0 && node.nodeType !== Node.TEXT_NODE) {
                            node = getNearTextNode(node)
                        } else {
                            node = node.childNodes[offset - 1]
                        }
                        offset = final ? node.textContent.length : 0
                    }
                    var parent = node.parentNode;
                    var length = node.textContent.length
                    return {
                        node: node,
                        offset: offset,
                        parent: parent,
                        length: length
                    }
                }
                function montarRange() {


                    var range = NgcWysiwygUtilService.copyRange()
                    if (!range) {
                        return null;
                    }
                    var selectedText = range.cloneContents().textContent
                    var originalStart = prepararRange(range, false)
                    var originalEnd = prepararRange(range, true)


                    var retornoNormalizeStart
                    var retornoNormalizeEnd
                    if (originalStart.node !== originalEnd.node) {
                        retornoNormalizeStart = normalize(originalStart.parent, originalStart.node, originalStart.offset)
                        if (!isConnected(originalEnd.node)) {
                            retornoNormalizeEnd = {
                                nodeSelected: retornoNormalizeStart.nodeSelected,
                                //offset: originalStart.offset + selectedText.length
                                offset: retornoNormalizeStart.offset + selectedText.length
                            }
                        } else {
                            retornoNormalizeEnd = normalize(originalEnd.parent, originalEnd.node, originalEnd.offset)
                        }
                    } else {
                        retornoNormalizeStart = normalize(originalStart.parent, originalStart.node, originalStart.offset)
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
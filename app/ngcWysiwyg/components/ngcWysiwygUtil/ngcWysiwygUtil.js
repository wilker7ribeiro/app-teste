(function () {
    'use strict';

    angular
        .module('myApp')
        .service('NgcWysiwygUtilService', function ($window) {

            this.selecionarElemento = selecionarElemento;
            this.getRange = getRange;
            //this.encapsularSelecionado = encapsularSelecionado;
            this.copyRange = copyRange;
            this.setRange = setRange;
            this.clearSelection = clearSelection;
            this.isLetraNumero = isLetraNumero;
            this.getNodeTree = getNodeTree;
            this.getSelection = getSelection;
            this.getNodeFromTree = getNodeFromTree;
            this.isInsideContentEditable = isInsideContentEditable;
            this.isConnected = isConnected;
            this.getSelectedText = getSelectedText
            this.getNearestTextNode = getNearestTextNode;
            this.queryCommand = queryCommand;
            this.normalize = normalize;
            this.getRangeInTextNode = getRangeInTextNode;

            function getRangeInTextNode(range, final) {

                var nodeInicial = final ? range.endContainer : range.startContainer
                if (!isInsideContentEditable()) {
                    return null
                }
                var offset = final ? range.endOffset : range.startOffset;
                var node = nodeInicial;
                while (node && node.nodeType !== Node.TEXT_NODE) {
                    node = node.childNodes[offset - 1]
                }
                if (!node) {
                    node = final ? range.endContainer : range.startContainer
                    offset = final ? range.endOffset : range.startOffset;
                } else if (node !== nodeInicial && node.nodeType === Node.TEXT_NODE) {
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
                if (Object.keys(retorno).length <= 0) {
                    retorno = {
                        nodeSelected: nodeSelected,
                        offset: offset
                    }
                }
                return retorno;
            }

            function queryCommand(type, alternativo) {
                if (getRange()) {
                    var queryComandResult = document.queryCommandState(type);
                    if (!queryComandResult) {
                        queryComandResult = document.queryCommandValue(type)
                    }
                    return queryComandResult === true || queryComandResult === 'true' || queryComandResult === alternativo
                }
                return false;
            }
            function getSelectedText() {
                var range = getRange()
                if (range) {
                    return range.cloneContents().textContent
                }
                return null;

            }
            function setRange(startNode, startOffset, endNode, endOffset) {
                var selection = getSelection()
                selection.removeAllRanges()
                var newRage = document.createRange()
                newRage.setStart(startNode, startOffset)
                newRage.setEnd(endNode, endOffset)
                selection.addRange(newRage)
                // range.startContainer.replaceData(range.startOffset ,  range.startContainer.length, '<span>'+ range.startContainer.substringData(range.startOffset, range.startContainer.length)+'</span>')
            }
            // function encapsularSelecionado(node) {
            //     var range = getRange()
            //     var selectedTagInicial = range.startContainer.substringData(range.startOffset, range.startContainer.length)
            //     var selectedTagFinal = range.endContainer.substringData(0, range.endOffset)
            //     /** @todo problema com as nodes #text quando vai dar o ctrl Y depois de boldear e desboldear o mesmo texto, salva com #text separada, mas quando da ctrl Y não existe mais as #text */
            // }

            function isInsideContentEditable() {
                var range = getRange()
                if (!range) {
                    return false;
                }
                return !!angular.element(range.commonAncestorContainer).controller('ngcWysiwygEditableContainer')
            }

            function copyRange() {
                var range = getRange()
                if (range) {
                    return range.cloneRange()
                }
                return null;
            }
            function getRange() {
                var selection = getSelection()
                if (selection.rangeCount > 0) {
                    return getSelection().getRangeAt(0)
                }
                return null;
            }

            function getSelection() {
                return $window.getSelection()
            }
            function clearSelection() {
                var selecao = getSelection()
                if (selecao) {
                    selecao.removeAllRanges()
                }
            }
            function selecionarElemento(elementNode) {
                getRange().selectNode(elementNode)
            }

            function isLetraNumero(event) {
                return event.key.length === 1;
            }

            function isConnected(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    return !!node.parentNode
                } else {
                    return document.contains(node);
                }
            }

            function getNearestTextNode(node) {

                var irmaoDireita = node.nextSibling
                while (irmaoDireita && irmaoDireita.nodeType !== Node.TEXT_NODE) {
                    irmaoDireita = irmaoDireita.nextSibling;
                }
                if (!irmaoDireita) {
                    var irmaoEsquerda = node.previousSibling
                    while (irmaoEsquerda && irmaoEsquerda.nodeType !== Node.TEXT_NODE) {
                        irmaoEsquerda = irmaoEsquerda.previousSibling;
                    }
                    if (!irmaoEsquerda) {
                        return getNearestTextNode(node.parentNode);
                    }
                    return irmaoEsquerda;
                }
                return irmaoDireita;
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
                if (tree.length <= 0) {
                    return elementoPai
                }
                var index = treeCopy.pop()
                while (!angular.isUndefined(index) && index !== null) {
                    element = elementoPai.childNodes[index]
                    elementoPai = element;
                    index = treeCopy.pop()
                }
                return element;
            }
            // function adicionarPasso() {
            //     this.passos.push({
            //         html: this.ngcWysiwyg.htmlValue
            //     })
            // }
        })

}());
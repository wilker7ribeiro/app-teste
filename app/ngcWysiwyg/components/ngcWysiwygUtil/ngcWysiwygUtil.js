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
            this.aplicarEstilo = aplicarEstilo;

            function estaEntreTags(tagName, rangeOpt) {
                var range = rangeOpt || getRange()
                var tagAnteriorEh = range.startContainer.previousSibling && range.startContainer.previousSibling.nodeName.toLowerCase() === tagName
                var tagPosteriorEh = range.startContainer.nextSibling && range.startContainer.nextSibling.nodeName.toLowerCase() === tagName
                return tagAnteriorEh && tagPosteriorEh
            }
            function aplicarEstilo(NgcWysiwyg, command, tag, ieTag) {
                var ua = window.navigator.userAgent;
                var isIE = ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv:11\./);
                var tagName = tag
                if (isIE && ieTag) {
                    tagName = ieTag
                }
                var commandName = command
                NgcWysiwyg.undoController.gravacaoContinua.finalizar();
                var range = getRange()
                if (range.collapsed) {
                    NgcWysiwyg.undoController.gravacaoContinua.iniciar();
                    var estaComEfeito = queryCommand(commandName)
                    if (!estaComEfeito) {
                        // se não tiver vazio, cria a tag e seleciona ela, ou não está entre tags do mesmo efeito
                        if (range.startContainer.textContent.replace(/\u200B/g, '').length > 0 || !estaEntreTags(tagName, range)) {
                            var commandElement = document.createElement(tagName)
                            range.surroundContents(commandElement)
                            commandElement.innerHTML = '&#8203;';

                            setRange(commandElement.childNodes[0], 1, commandElement.childNodes[0], 1)
                            // não ta com efeito, ta vazio, e ta no meio de duas tags do mesmo efeito, junta
                        } else {
                            var previous = range.startContainer.previousSibling
                            var next = range.startContainer.nextSibling
                            range.startContainer.remove ? range.startContainer.remove() : range.startContainer.removeNode(true)
                            var offset = previous.childNodes[0].length
                            previous.textContent = previous.textContent + next.textContent;
                            next.remove ? next.remove() : next.removeNode(true);
                            setRange(previous.childNodes[0], offset, previous.childNodes[0], offset)
                        }
                    } else {
                        // tratamento pra quando tem coisa escrita
                        if (range.startContainer.textContent.replace(/\u200B/g, '').length > 0) {
                            // ta no final do bold
                            if (range.startContainer.length === range.startOffset) {
                                var textoDireita = range.startContainer.parentNode.nextSibling
                                if (textoDireita) {
                                    textoDireita.textContent = '\u200B' + textoDireita.textContent
                                } else {
                                    // não testado
                                    var newTextNode = document.createTextNode('\u200B');
                                    range.startContainer.parentNode.parentNode.appendChild(newTextNode)
                                    textoDireita = newTextNode;
                                }
                                setRange(textoDireita, 1, textoDireita, 1)
                            } else {
                                var selectedText = range.startContainer.data.slice(range.startOffset);
                                var startTextNode = range.startContainer
                                startTextNode.data = startTextNode.data.slice(0, range.startOffset)
                                var commandElementDireita = document.createElement(tagName)
                                var newTextNode = document.createTextNode('\u200B');
                                commandElementDireita.textContent = selectedText
                                startTextNode.parentNode.parentNode.insertBefore(newTextNode, startTextNode.parentNode.nextSibling);
                                newTextNode.parentNode.insertBefore(commandElementDireita, newTextNode.nextSibling);
                                setRange(newTextNode, 1, newTextNode, 1)
                                //console.log('no meio')
                            }
                        } else {
                            // quando não tem nada escrito o execcommand consegue se virar
                            // Não se estiver tipo <b><i><strike>AQUI</strike></i></b>;
                            document.execCommand(commandName, null, false);
                        }
                    }
                } else {
                    NgcWysiwyg.undoController.gravarPasso(function () {
                        document.execCommand(commandName, null, false);
                    })
                }
            }
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
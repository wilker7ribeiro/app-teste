(function () {
    'use strict';

    angular
        .module('myApp')
        .service('NgcWysiwygUtilService', function ($window) {

            this.selecionarElemento = selecionarElemento;
            this.getRange = getRange;
            this.encapsularSelecionado = encapsularSelecionado;
            this.copyRange = copyRange;
            this.setRange = setRange;
            this.clearSelection = clearSelection;
            this.isLetraNumero = isLetraNumero;
            this.getNodeTree = getNodeTree;
            this.getNodeFromTree = getNodeFromTree;
            this.isInsideContentEditable = isInsideContentEditable;

            function setRange(startNode, startOffset, endNode, endOffset) {
                var selection = getSelection()
                selection.removeAllRanges()
                var newRage = document.createRange()
                newRage.setStart(startNode, startOffset)
                newRage.setEnd(endNode, endOffset)
                selection.addRange(newRage)
                // range.startContainer.replaceData(range.startOffset ,  range.startContainer.length, '<span>'+ range.startContainer.substringData(range.startOffset, range.startContainer.length)+'</span>')
            }
            function encapsularSelecionado(node) {
                var range = getRange()
                var selectedTagInicial = range.startContainer.substringData(range.startOffset, range.startContainer.length)
                var selectedTagFinal = range.endContainer.substringData(0, range.endOffset)
                /** @todo problema com as nodes #text quando vai dar o ctrl Y depois de boldear e desboldear o mesmo texto, salva com #text separada, mas quando da ctrl Y não existe mais as #text */
            }

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
                getSelection().removeAllRanges()
            }
            function selecionarElemento(elementNode) {
                $window.getSelection().selectAllChildren(elementNode)
            }

            function isLetraNumero(event) {
                return event.key.length === 1;
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
            // function adicionarPasso() {
            //     this.passos.push({
            //         html: this.ngcWysiwyg.htmlValue
            //     })
            // }
        })

}());
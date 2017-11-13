(function () {
    'use strict';

    angular
        .module('myApp')
        .service('NgcWysiwygTextMenuService', NgcWysiwygTextMenuService)

    /** @ngInject */
    function NgcWysiwygTextMenuService(NgcWysiwygUtilService) {

        this.bold = bold;


        function bold(NgcWysiwyg) {
            var ua = window.navigator.userAgent;
            var isIE = ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv:11\./);
            var tagName = 'b'
            if (isIE) {
                tagName = 'strong'
            }
            var commandName = 'bold'
            NgcWysiwyg.undoController.gravacaoContinua.finalizar();
            var range = NgcWysiwygUtilService.getRange()
            if (range.collapsed) {
                NgcWysiwyg.undoController.gravacaoContinua.iniciar();
                var estaComEfeito = NgcWysiwygUtilService.queryCommand(commandName)
                if (!estaComEfeito) {
                    if (range.startContainer.textContent.replace(/\u200B/g, '').length > 0) {
                        var commandElement = document.createElement(tagName)
                        range.surroundContents(commandElement)
                        commandElement.innerHTML = '&#8203;';

                        NgcWysiwygUtilService.setRange(commandElement.childNodes[0], 1, commandElement.childNodes[0], 1)
                    } else if (range.startContainer.previousSibling && range.startContainer.previousSibling.nodeName.toLowerCase() === tagName && range.startContainer.nextSibling && range.startContainer.nextSibling.nodeName.toLowerCase() === tagName) {
                        var previous = range.startContainer.previousSibling
                        var next = range.startContainer.nextSibling
                        range.startContainer.remove ? range.startContainer.remove() : range.startContainer.removeNode(true)
                        var offset = previous.childNodes[0].length
                        previous.textContent = previous.textContent + next.textContent;
                        next.remove ? next.remove() : next.removeNode(true);
                        NgcWysiwygUtilService.setRange(previous.childNodes[0], offset, previous.childNodes[0], offset)
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
                            NgcWysiwygUtilService.setRange(textoDireita, 1, textoDireita, 1)
                        } else {
                            var selectedText = range.startContainer.data.slice(range.startOffset);
                            var startTextNode = range.startContainer
                            startTextNode.data = startTextNode.data.slice(0, range.startOffset)
                            var commandElementDireita = document.createElement(tagName)
                            var newTextNode = document.createTextNode('\u200B');
                            commandElementDireita.textContent = selectedText
                            startTextNode.parentNode.parentNode.insertBefore(newTextNode, startTextNode.parentNode.nextSibling);
                            newTextNode.parentNode.insertBefore(commandElementDireita, newTextNode.nextSibling);
                            NgcWysiwygUtilService.setRange(newTextNode, 1, newTextNode, 1)
                            //console.log('no meio')
                        }
                    } else {
                        // quando não tem nada escrito o execcommand consegue se virar
                        document.execCommand(commandName, null, false);
                    }
                }
            } else {
                NgcWysiwyg.undoController.gravarPasso(function () {
                    document.execCommand(commandName, null, false);
                })
            }
        }


    }

}());
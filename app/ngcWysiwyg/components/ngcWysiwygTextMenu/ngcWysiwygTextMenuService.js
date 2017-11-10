(function () {
    'use strict';

    angular
        .module('myApp')
        .service('NgcWysiwygTextMenuService', NgcWysiwygTextMenuService)

    /** @ngInject */
    function NgcWysiwygTextMenuService(NgcWysiwygUtilService) {

        this.bold = bold;


        function bold(UndoController) {
            var range = NgcWysiwygUtilService.getRange()
            UndoController.gravacaoContinua.finalizar();
            if (range.collapsed) {
                UndoController.gravacaoContinua.iniciar();
                console.log('collapsed')
                var jaTem = NgcWysiwygUtilService.queryCommand('bold')
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
                    if (range.startContainer.textContent.replace(/\u200B/g, '').length === 0) {
                        console.log('nada escrito')
                    } else {
                        //if(range.startContainer.nextSibling.nodeType === Node.TEXT_NODE){
                        document.execCommand('bold', true, false)
                        var textoDireita = range.startContainer.parentNode.nextSibling
                        if (textoDireita) {
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
            } else {
                console.log('não collapsed')
                UndoController.gravarPasso(function () {
                    document.execCommand('bold', null, false);
                })

            }
        }


    }

}());
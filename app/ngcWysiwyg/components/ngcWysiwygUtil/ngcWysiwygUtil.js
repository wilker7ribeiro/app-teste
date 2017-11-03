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

            function setRange(startNode, startOffset, endNode, endOffset) {
                var selection = getSelection()
                selection.removeAllRanges()
                var newRage = document.createRange()
                newRage.setStart(startNode, startOffset)
                newRage.setEnd(endNode, endOffset)
                selection.addRange(newRage)
                range.startContainer.replaceData(range.startOffset ,  range.startContainer.length, '<span>'+ range.startContainer.substringData(range.startOffset, range.startContainer.length)+'</span>')
            }
            function encapsularSelecionado(node){
                var range = getRange()
                var selectedTagInicial = range.startContainer.substringData(range.startOffset, range.startContainer.length)
                var selectedTagFinal = range.endContainer.substringData(0, range.endOffset)
                /** @todo problema com as nodes #text quando vai dar o ctrl Y depois de boldear e desboldear o mesmo texto, salva com #text separada, mas quando da ctrl Y não existe mais as #text */
            }

            function copyRange() {
                return getRange().cloneRange()
            }
            function getRange() {
                return getSelection().getRangeAt(0)
            }

            function getSelection() {
                return $window.getSelection()
            }
            function clearSelection(){
                getSelection().removeAllRanges()
            }
            function selecionarElemento(elementNode) {
                $window.getSelection().selectAllChildren(elementNode)
            }

            function isLetraNumero(event){
                return event.key.length === 1;
            }
            // function adicionarPasso() {
            //     this.passos.push({
            //         html: this.ngcWysiwyg.htmlValue
            //     })
            // }
        })

}());
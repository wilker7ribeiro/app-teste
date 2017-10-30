(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwyg', component());

    function component() {

        return {
            controllerAs: 'vm',
            bindings: {
                value: '='
            },
            templateUrl: './public/ngcWysiwyg/ngcWysiwyg.html',
            controller: function ($scope, $element, $timeout) {
                var vm = this;
                vm.imgSelected = {};

                vm.setImageSelected = function (imgElement, botoes) {
                    vm.itemSelecionado = imgElement[0]
                    vm.imagemSelecionada = true;
                }
                vm.setBotoesMenuFlutuante = function (botoes) {
                    vm.floatingMenuCtrl.botoes = botoes;
                }


                this.$postLink = function postLink() {
                    // $timeout(function () {
                    // console.log($element)
                    // $element.on('DOMNodeInserted', function (event) {
                    //     if(event.srcElement.nodeName === 'P' && event.relatedNode.classList.contains('content-editable')){
                    //         event.srcElement.classList.add('wysiwyg-paragrafo')
                    //     }
                    //     if(event.srcElement.nodeName === 'IMG' && event.relatedNode.classList.contains('wysiwyg-paragrafo')){
                    //         angular.element(event.srcElement).attr('img-editor', true)
                    //     }
                    // })
                    // })
                }
                this.$onInit = function init() {

                }
            }
        }

    }



}());
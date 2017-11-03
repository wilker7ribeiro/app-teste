(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygEditableContainer', {

            bindings: {},
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygEditableContainer/ngcWysiwygEditableContainer.html',
            require: {
                ngcWysiwyg: '^^ngcWysiwyg',
            },

            controller: function ($scope, $element, $compile) {
                var vm = this;
                vm.teste = function () {
                    vm.ngcWysiwyg.setImageSelected($element)
                }
                this.$onInit = function () {
                    // $element.on('DOMCharacterDataModified mouseup', function ($event) {
                    //     vm.ngcWysiwyg.triggerChange()
                    // })

                    $element.on('DOMNodeInserted', function (event) {

                        /** @todo mover para o componente de upload quando existir */
                        if (event.srcElement.nodeName === 'IMG') {
                            $compile(angular.element(event.srcElement).attr('ngc-wysiwyg-image', true))($scope)
                        }
                    })
                }



            }

        })

}());
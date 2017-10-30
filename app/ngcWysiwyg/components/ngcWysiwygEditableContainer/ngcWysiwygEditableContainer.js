(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygEditableContainer', {

            bindings: {},
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygEditableContainer/ngcWysiwygEditableContainer.html',
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            controller: function ($scope, $element, $compile) {
                var vm = this;
                vm.teste = function () {
                    vm.ngcWysiwyg.setImageSelected($element)
                    console.log(vm.ngcWysiwyg)
                }
                this.$onInit = function () {
                    vm.value = vm.ngcWysiwyg.value
                    $element.on('DOMNodeInserted', function (event) {
                        if (event.srcElement.nodeName === 'P' && event.relatedNode.classList.contains('content-editable')) {
                            event.srcElement.classList.add('wysiwyg-paragrafo')
                            for (var i = 0; i < event.srcElement.children.length; i++) {
                                var element = event.srcElement.children[i];
                                if (element.nodeName === 'IMG') {
                                    angular.element(element).attr('ngc-wysiwyg-image', true)
                                }
                            }
                            $compile(angular.element(event.srcElement))($scope)
                        }
                        if (event.srcElement.nodeName === 'IMG' && event.relatedNode.classList.contains('wysiwyg-paragrafo')) {
                            $compile(angular.element(event.srcElement).attr('ngc-wysiwyg-image', true))($scope)
                        }
                    })
                }

            }

        })

}());
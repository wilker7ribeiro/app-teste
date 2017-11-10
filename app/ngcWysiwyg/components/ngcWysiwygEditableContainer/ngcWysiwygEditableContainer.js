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

                this.$onInit = function () {

                    /** @todo mover para o componente de upload quando existir */
                    $element.on('DOMNodeInserted', function (event) {
                        if (event.srcElement && event.srcElement.nodeName === 'IMG') {
                            $compile(angular.element(event.srcElement).attr('ngc-wysiwyg-image', true))($scope)
                        }
                    })
                }



            }

        })

}());
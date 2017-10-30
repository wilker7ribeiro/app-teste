(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygImageResizer', component());

    function component() {

        return {
            controllerAs: 'vm',
            //bindToCrontroller: true,
            templateUrl: './public/ngcWysiwygImageResizer/ngcWysiwygImageResizer.html',
            bindings: {},
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            controller: function () {
                var vm = this;

                this.$onInit = function init() {
                    vm.botoes = [
                        {
                            icone: 'format_bold',
                            callback: function () {
                                document.execCommand('bold', null, false);
                            }
                        },
                        {
                            icone: 'format_italic',
                            callback: function () {
                                document.execCommand('italic', null, false);
                            }
                        },
                        {
                            icone: 'format_strikethrough',
                            callback: function () {
                                document.execCommand('strikeThrough', null, false);
                            }
                        },
                        {
                            icone: 'format_underlined',
                            callback: function () {
                                document.execCommand('underline', null, false);
                            }
                        }
                    ]
                }
            }
        }

    }

}());
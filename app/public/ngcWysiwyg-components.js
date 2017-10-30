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
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygAlignMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygAlignMenu/ngcWysiwygAlignMenu.html',
            bindings: {}
        }

        function componentController() {
            var vm = this;
            vm.botoes = [
                {
                    icone: 'format_align_left',
                    titulo: 'Esquerda',
                    callback: function () {
                        document.execCommand('justifyLeft', null, false);
                    }
                },
                {
                    icone: 'format_align_right',
                    titulo: 'Direita',
                    callback: function () {
                        document.execCommand('justifyRight', null, false);
                    }
                },
                {
                    icone: 'format_align_justify',
                    titulo: 'Justificado',
                    callback: function () {
                        document.execCommand('justifyFull', null, false);
                    }
                },
                {
                    icone: 'format_align_center',
                    titulo: 'Centro',
                    callback: function () {
                        document.execCommand('justifyCenter', null, false);
                    }
                },
                {
                    icone: 'add',
                    titulo: 'ADICIONAR IMAGEM',
                    callback: function () {
                        document.execCommand('insertImage', null, 'https://www.espacoblog.com/wp-content/uploads/2013/03/978.png');
                    }
                }
            ]
            this.$onInit = function init() {

            }
            vm.abrirMenu = abrirMenu;


            function abrirMenu($mdOpenMenu, $event){
                $mdOpenMenu($event)
            }
        }
    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygBotao', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygBotao/ngcWysiwygBotao.html',
            bindings: {
                titulo: '@',
                icone: '@',
                callback: '<'
            }
        }

        function componentController() {

        }
    }

}());
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
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygFloatingMenu', component());

    function component() {

        return {
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygFloatingMenu/ngcWysiwygFloatingMenu.html',
            bindings: {},
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            controller: function ($element) {
                var vm = this;
                vm.goToElement = function (target) {
                    var DOMElementTarget = target[0]
                    $element.css('top', DOMElementTarget.offsetTop + (DOMElementTarget.offsetHeight) + 8 + 'px')
                    $element.css('left', DOMElementTarget.offsetLeft + (DOMElementTarget.offsetWidth / 2) - (vm.botoes.length * 30 / 2) + 'px')
                }
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
                this.$postLink = function link() {
                    vm.ngcWysiwyg.floatingMenuCtrl = vm;
                }
            }
        }

    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('ngcWysiwygImage', function () {
            return {
                restrict: 'A',
                scope: {},
                bindToController: true,
                require: {
                    ngcWysiwyg: '^^ngcWysiwyg'
                },
                controllerAs: 'vm',
                controller: function ($scope, $element, $compile) {
                    var vm = this;
                    console.log('iu')
                    $element.on('click', function () {
                        $scope.$apply(function () {
                            vm.ngcWysiwyg.setImageSelected($element)
                            vm.ngcWysiwyg.setBotoesMenuFlutuante(vm.botoesMenuFlutuante)
                            vm.ngcWysiwyg.floatingMenuCtrl.goToElement($element)
                        })
                    })
                    vm.botoesMenuFlutuante = [
                        {
                            icone: 'format_align_left',
                            titulo: 'Esquerda',
                            callback: function () {
                                document.execCommand('justifyLeft', null, false);
                            }
                        },
                        {
                            icone: 'format_align_right',
                            titulo: 'Direita',
                            callback: function () {
                                document.execCommand('justifyRight', null, false);
                            }
                        },
                        {
                            icone: 'format_align_justify',
                            titulo: 'Justificado',
                            callback: function () {
                                document.execCommand('justifyFull', null, false);
                            }
                        },
                        {
                            icone: 'format_align_center',
                            titulo: 'Centro',
                            callback: function () {
                                document.execCommand('justifyCenter', null, false);
                            }
                        },
                        {
                            icone: 'add',
                            titulo: 'ADICIONAR IMAGEM',
                            callback: function () {
                                document.execCommand('insertImage', null, 'https://www.espacoblog.com/wp-content/uploads/2013/03/978.png');
                            }
                        }
                    ]
                    // var canvas = document.getElementById('myCanvas');
                    // var context = canvas.getContext('2d');
                    // var imageObj = new Image();

                    // imageObj.onload = function () {
                    //     // crop
                    //     var sourceX = 150;
                    //     var sourceY = 0;
                    //     var sourceWidth = 150;
                    //     var sourceHeight = 150;
                    //     var destWidth = sourceWidth;
                    //     var destHeight = sourceHeight;
                    //     var destX = canvas.width / 2 - destWidth / 2;
                    //     var destY = canvas.height / 2 - destHeight / 2;

                    //     context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                    // };
                    // imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';

                },
            }
        })

}());
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
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygInputMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygInputMenu/ngcWysiwygInputMenu.html',
            bindings: {}
        }

        function componentController() {
            var vm = this;
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
            this.$onInit = function init() {

            }
        }
    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygTextMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygTextMenu/ngcWysiwygTextMenu.html',
            bindings: {}
        }

        function componentController() {
            var vm = this;
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
            this.$onInit = function init() {

            }
        }
    }

}());
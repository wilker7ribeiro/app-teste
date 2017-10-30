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
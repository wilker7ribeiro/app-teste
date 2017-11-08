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
                controller: function ($scope, $element, $compile, $document, NgcWysiwygUtilService) {
                    var vm = this;
                    this.$onInit = function () {

                        $element.on('click', function () {
                            $scope.$apply(function () {
                                vm.ngcWysiwyg.setImageSelected($element)
                                vm.ngcWysiwyg.setBotoesMenuFlutuante(vm.botoesMenuFlutuante)
                                vm.ngcWysiwyg.floatingMenuCtrl.goToElement($element)
                                //NgcWysiwygUtilService.clearSelection();
                            })
                        })

                        // function isFloatingButton (element){
                        //     var achou = false
                        //     parentNode = element
                        //     while (parentNode) {
                        //         if (parentNode.nodeName === 'NGC-WYSIWYG-FLOATING-MENU') {
                        //             achou = true;
                        //             break;
                        //         }
                        //         parentNode = parentNode.parentNode
                        //     }
                        //     return achou
                        // }

                        var onClickFora = function (event) {
                            var isImage = event.target.nodeName === "IMG";
                            /** @todo o que é mais performatico? */
                            // isFloatingButton(event.target)
                            var isFloatingButton = !!angular.element(event.target).controller('ngcWysiwygFloatingMenu')

                            if (!isImage && !isFloatingButton) {
                                $scope.$apply(vm.ngcWysiwyg.removerImagemSelecionada)
                            }
                        }
                        $scope.$watch(function () {
                            return vm.ngcWysiwyg.imagemSelecionada
                        }, function (newValue, oldValue) {
                            if (newValue !== oldValue && newValue == true) {
                                $document.bind('click', onClickFora);
                            }
                            else if (newValue !== oldValue && newValue == false) {
                                $document.unbind('click', onClickFora);
                            }
                        });


                        vm.botoesMenuFlutuante = [
                            {
                                icone: 'format_align_left',
                                titulo: 'Esquerda',
                                callback: function () {
                                    $element.css('float', 'left');
                                    $element.addClass('align-left')
                                    $element.removeClass('align-right')
                                },
                                active: function () {
                                    return $element.hasClass('align-left')
                                }
                            },
                            {
                                icone: 'format_align_right',
                                titulo: 'Direita',
                                callback: function () {
                                    $element.css('float', 'right');
                                    $element.addClass('align-right')
                                    $element.removeClass('align-left')
                                },
                                active: function () {
                                    return $element.hasClass('align-right')
                                }
                            },
                            {
                                icone: 'format_align_justify',
                                titulo: 'Justificado',
                                callback: function () {
                                    $element.css('float', null);
                                    $element.removeClass('align-left')
                                    $element.removeClass('align-right')
                                },
                                active: function () {
                                    return !$element.hasClass('align-left') && !$element.hasClass('align-right')
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
                    }
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
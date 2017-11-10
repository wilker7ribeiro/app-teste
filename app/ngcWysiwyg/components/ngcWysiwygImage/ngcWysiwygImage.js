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


                    this.$onInit = function onInit() {

                        $element.on('click', onClick)

                    }
                    this.$onDestroy = function onDestroy() {
                        $element.off('click', onClick)
                    }

                    vm.botoesMenuFlutuante = [
                        {
                            icone: 'format_align_left',
                            titulo: 'Esquerda',
                            callback: function () {
                                $element.addClass('float-left')
                                $element.removeClass('float-right')
                            },
                            active: function () {
                                return $element.hasClass('float-left')
                            }
                        },
                        {
                            icone: 'format_align_right',
                            titulo: 'Direita',
                            callback: function () {
                                $element.addClass('float-right')
                                $element.removeClass('float-left')
                            },
                            active: function () {
                                return $element.hasClass('float-right')
                            }
                        },
                        {
                            icone: 'format_align_justify',
                            titulo: 'Justificado',
                            callback: function () {
                                $element.removeClass('float-left')
                                $element.removeClass('float-right')
                            },
                            active: function () {
                                return !$element.hasClass('float-left') && !$element.hasClass('float-right')
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
                    function onClick() {
                        $scope.$apply(function () {
                            vm.ngcWysiwyg.setImageSelected($element)
                            vm.ngcWysiwyg.setBotoesMenuFlutuante(vm.botoesMenuFlutuante)
                            vm.ngcWysiwyg.floatingMenuCtrl.goToElement($element)
                            $document.on('mouseup', onClickFora);
                            //NgcWysiwygUtilService.clearSelection();
                        })
                    }
                    function onClickFora(event) {
                        var isImage = event.target.nodeName === "IMG";
                        var isResizer = !!angular.element(event.target).controller('ngcWysiwygImageResizer')
                        /** @todo o que é mais performatico? */
                        // isFloatingButton(event.target)
                        var isFloatingButton = !!angular.element(event.target).controller('ngcWysiwygFloatingMenu')

                        if (!isImage && !isFloatingButton && !isResizer) {
                            $scope.$apply(function(){
                                vm.ngcWysiwyg.removerImagemSelecionada()
                                $document.off('mouseup', onClickFora);
                            })
                        }
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
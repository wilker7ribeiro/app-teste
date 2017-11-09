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
            controller: function ($document, $scope) {
                var vm = this;
                var mousePositionY;
                var mousePositionX;
                var resizeSimetrico;
                var widthOriginal;
                var heightOriginal;
                var stepGravando
                this.$onInit = function init() {
                    vm.ngcWysiwyg.undoController.afterUndo.push(function(){
                        vm.ngcWysiwyg.removerImagemSelecionada();
                    })
                    function resizeHandler($event) {
                        $scope.$apply(function () {
                              resize($event)
                        })
                    }


                    vm.ativarResize = function ($event) {
                        $event.preventDefault()
                        stepGravando = vm.ngcWysiwyg.undoController.iniciarGravacaoParcial()
                        mousePositionX = $event.clientX
                        mousePositionY = $event.clientY

                        var imagem = vm.ngcWysiwyg.itemSelecionado
                        widthOriginal = imagem[0].clientWidth;
                        heightOriginal = imagem[0].clientHeight;

                        $document.bind('mousemove', resizeHandler);
                        $document.bind('mouseup', desativarResize);
                    }
                    function desativarResize($event) {
                        stepGravando.finalizar();
                        resizeSimetrico = false;
                        $document.unbind('mousemove', resizeHandler);
                        $document.unbind('mouseup', desativarResize);
                    }

                    function resize($event) {
                        var imagem = vm.ngcWysiwyg.itemSelecionado

                        var widthAtual = imagem[0].clientWidth;
                        var heightAtual = imagem[0].clientHeight;

                        var moveX = $event.clientX - mousePositionX
                        var moveY = $event.clientY - mousePositionY
                        if ($event.ctrlKey) {
                            if (!resizeSimetrico) {
                                // Transforma o tamanho atual para um tamanho simétrico
                                moveX = widthAtual - widthOriginal;
                                widthAtual = widthOriginal;
                                heightAtual = heightOriginal;
                            }
                            // ativa a flag para não transformar novamente
                            resizeSimetrico = true;
                            // iguala o moveY e moveX para que heigth e width cresçam proporcionalmente
                            moveY = moveX
                        } else {
                            resizeSimetrico = false;
                        }
                        var novaWidth = widthAtual + moveX
                        var novoHeight = heightAtual + moveY

                        imagem.css('width', novaWidth)
                        mousePositionX = $event.clientX;

                        imagem.css('height', novoHeight)
                        mousePositionY = $event.clientY;
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
                }
            }
        }

    }

}());
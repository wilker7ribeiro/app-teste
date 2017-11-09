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
                var botaoTipo;
                var mousePositionY;
                var mousePositionX;
                var resizeSimetrico;
                var widthOriginal;
                var heightOriginal;
                var stepGravando
                this.$onInit = function init() {
                    vm.ngcWysiwyg.undoController.afterUndo.push(function () {
                        vm.ngcWysiwyg.removerImagemSelecionada();
                    })
                    function resizeHandler($event) {
                        $scope.$apply(function () {
                            resize($event)
                        })
                    }


                    vm.ativarResize = function ($event, botao) {
                        $event.preventDefault();
                        botaoTipo = botao;
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
                    function containsTipo(array, tipo) {
                        tipo = tipo || botaoTipo;
                        return array.indexOf(tipo) !== -1;
                    }
                    function isBotaoLadoDireito(tipo) {
                        return containsTipo(["top-right", "right", "bottom-right"], tipo)
                    }
                    function isBotaoLadoEsquerdo(tipo) {
                        return containsTipo(["top-left", "left", "bottom-left"], tipo)
                    }
                    function isBotaoCima(tipo) {
                        return containsTipo(["top-left", "top", "top-right"], tipo)
                    }
                    function isBotaoBaixo(tipo) {
                        tipo = tipo || botaoTipo;
                        return ["bottom-left", "bottom", "bottom-right"].indexOf(tipo) !== -1;
                    }

                    function resize($event) {
                        var imagem = vm.ngcWysiwyg.itemSelecionado


                        var moveX = isBotaoLadoEsquerdo() ? mousePositionX - $event.clientX : $event.clientX - mousePositionX
                        var moveY = isBotaoCima() ? mousePositionY - $event.clientY : $event.clientY - mousePositionY
                        if ($event.ctrlKey) {
                            if (!resizeSimetrico) {
                                // Transforma o tamanho atual para um tamanho simétrico
                                var widthAtual = imagem[0].clientWidth;
                                moveX = widthAtual - widthOriginal;
                            }
                            // ativa a flag para não transformar novamente
                            resizeSimetrico = true;
                            // iguala o moveY e moveX para que heigth e width cresçam proporcionalmente
                            moveY = moveX
                        } else {
                            resizeSimetrico = false;
                        }

                        var novaWidth = widthOriginal + moveX
                        var novoHeight = heightOriginal + moveY
                        if (isBotaoLadoDireito() || isBotaoLadoEsquerdo()) {
                            var containerWidth = parseInt(getComputedStyle(vm.ngcWysiwyg.divEditableElement[0]).width.replace('px', ''))
                            if (novaWidth < containerWidth) {
                                imagem.css('width', novaWidth)
                            }
                        }

                        if (isBotaoCima() || isBotaoBaixo()) {
                            imagem.css('height', novoHeight)
                        }

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
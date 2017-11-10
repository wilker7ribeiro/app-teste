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
                vm.ativarResize = ativarResize;

                this.$onInit = function init() {
                    vm.ngcWysiwyg.undoController.afterUndo.push(function () {
                        vm.ngcWysiwyg.removerImagemSelecionada();
                    })
                }
                this.$onDestroy = function onDestroy() {
                    removerEventListeners()
                }

                function removerEventListeners() {
                    $document.off('mousemove', resizeHandler);
                    $document.off('mouseup', desativarResize);
                }
                function ativarResize($event, botao) {
                    $event.preventDefault();
                    vm.ngcWysiwyg.imageResizing = true;
                    botaoTipo = botao;
                    stepGravando = vm.ngcWysiwyg.undoController.iniciarGravacaoParcial()
                    mousePositionX = $event.clientX
                    mousePositionY = $event.clientY

                    var imagem = vm.ngcWysiwyg.itemSelecionado
                    widthOriginal = imagem[0].clientWidth;
                    heightOriginal = imagem[0].clientHeight;

                    $document.on('mousemove', resizeHandler);
                    $document.on('mouseup', desativarResize);
                }
                function resizeHandler($event) {
                    $scope.$apply(function () {
                        resize($event)
                    })
                }

                function desativarResize() {
                    vm.ngcWysiwyg.imageResizing = false;
                    stepGravando.finalizar();
                    resizeSimetrico = false;
                    removerEventListeners()
                }
                function containsTipo(array, tipo) {
                    tipo = tipo || botaoTipo;
                    return array.indexOf(tipo) !== -1;
                }
                function isBotaoDiagonal(tipo) {
                    return containsTipo(['top-right', 'top-left', 'bottom-right', 'bottom-left'], tipo)
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
                    if ($event.ctrlKey && isBotaoDiagonal()) {
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

}());
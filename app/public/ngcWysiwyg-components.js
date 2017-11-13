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
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            bindings: {
                disabled: '<'
            }
        }

        function componentController(NgcWysiwygUtilService) {
            var vm = this;
            function isCursorText(type, alternativo) {
                 return NgcWysiwygUtilService.queryCommand(type, alternativo);
            }
            vm.botoes = [
                {
                    icone: 'format_align_left',
                    titulo: 'Esquerda',
                    callback: function () {
                        document.execCommand('justifyLeft', null, false);
                    },
                    active: function(){
                        return isCursorText('justifyLeft', "left");
                    }
                },
                {
                    icone: 'format_align_right',
                    titulo: 'Direita',
                    callback: function () {
                        document.execCommand('justifyRight', null, false);
                    },
                    active: function(){
                        return isCursorText('justifyRight', "right");
                    }
                },
                {
                    icone: 'format_align_justify',
                    titulo: 'Justificado',
                    callback: function () {
                        document.execCommand('justifyFull', null, false);
                    },
                    active: function(){
                        return isCursorText('justifyFull', "justify");
                    }
                },
                {
                    icone: 'format_align_center',
                    titulo: 'Centro',
                    callback: function () {
                        document.execCommand('justifyCenter', null, false);
                    },
                    active: function(){
                        return isCursorText('justifyCenter', "center");
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
                vm.disabled = function() {
                    return vm.ngcWysiwyg.imagemSelecionada
                }
            }

        }
    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwyg', component());

    function component() {

        return {
            controllerAs: 'vm',
            require: {
                ngModelCtrl: 'ngModel'
            },
            bindings: {
                htmlValue: '=?'
            },
            templateUrl: './public/ngcWysiwyg/ngcWysiwyg.html',
            controller: function ($scope, $element, $timeout, NgcWysiwygUndoFactory, NgcWysiwygUtilService) {
                var vm = this;

                vm.undoController = NgcWysiwygUndoFactory(vm)
                vm.undoController.configurarGravacaoContinua();
                vm.imagemSelecionada;
                vm.removerImagemSelecionada = removerImagemSelecionada
                vm.setImageSelected = setImageSelected

                vm.floatingMenuCtrl; // Instanciado pelo NgcWysiwygFloatingMenu
                vm.setBotoesMenuFlutuante = setBotoesMenuFlutuante

                // Instanciados pelo NgcWysiwygEditable
                vm.divEditableElement;
                vm.atualizarHtml;
                vm.atualizarModel;
                vm.mudouValor;

                vm.teste = function ($event) {
                    $event.preventDefault()
                    var jaTem = NgcWysiwygUtilService.queryCommand('bold')
                    console.log(jaTem)
                    var range = NgcWysiwygUtilService.getRange()
                    console.log(range)
                    if (!jaTem) {
                        console.log('ativar')
                        var strongElement = document.createElement('strong')
                        range.surroundContents(strongElement)
                        strongElement.innerHTML = '&#8203;';
                        range.selectNodeContents(strongElement);
                        range.collapse(false);
                        var sel = NgcWysiwygUtilService.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } else {
                        console.log('desativar')
                        console.log('textContent', range.startContainer.textContent.replace(/\u200B/g,'').length)
                        if ( range.startContainer.textContent.replace(/\u200B/g,'').length === 0) {
                            console.log('nada escrito')
                        } else {
                            //if(range.startContainer.nextSibling.nodeType === Node.TEXT_NODE){
                                document.execCommand('bold', true, false)
                                var textoDireita = range.startContainer.parentNode.nextSibling
                                if(textoDireita){
                                   textoDireita.textContent = '\u200B' + textoDireita.textContent
                                } else {
                                    var newNode = document.createTextNode('\u200B');
                                    range.startContainer.parentNode.parentNode.append(newNode)
                                    textoDireita = newNode;
                                }
                                range.setStart(textoDireita, 1);
                                range.setEnd(textoDireita, 1);
                                //textoMaisPerto.innerHTML = '&#8203;'+ textoMaisPerto.innerHTML
                                //NgcWysiwygUtilService.setRange(textoMaisPerto, 1, textoMaisPerto, 1)

                            //}
                            console.log('tem coisa escrita')
                        }
                    }
                    console.log(range)

                }



                vm.setItemSelecionado = setItemSelecionado;

                function removerImagemSelecionada() {
                    vm.itemSelecionado = null;
                    vm.imagemSelecionada = false;

                }
                function setImageSelected(imgElement) {
                    vm.setItemSelecionado(imgElement)
                    NgcWysiwygUtilService.clearSelection();
                    vm.imagemSelecionada = true;
                }

                function setItemSelecionado(element) {
                    vm.itemSelecionado = element
                }

                function setBotoesMenuFlutuante(botoes) {
                    vm.floatingMenuCtrl.botoes = botoes;
                }
                this.$onInit = function init() {
                }
                this.$postLink = function () {
                    if (document.queryCommandSupported('styleWithCSS')) {
                        document.execCommand('styleWithCSS', null, false)
                    }
                    if (document.queryCommandSupported('enableObjectResizing')) {
                        document.execCommand("enableObjectResizing", false, false);
                    }
                }
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
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            bindings: {
                titulo: '@',
                icone: '@',
                callback: '<',
                disabled: '<',
                classe: '@',
                active: '<'
            }
        }

        function componentController() {
            var vm = this;
            vm.callbackFn = function ($event) {

                //vm.ngcWysiwyg.undoController.gravarPasso(function () {
                    vm.callback()
                    vm.ngcWysiwyg.atualizarModel()
                //})

                $event.preventDefault()
            }
        }
    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('ngcWysiwygEditable', function ($sce, $timeout, $compile, NgcWysiwygUtilService, NgcWysiwygTextMenuService) {
            return {
                restrict: 'A',
                require: '^^ngcWysiwyg',
                scope: {},
                link: function (scope, element, attrs, ngcWysiwyg) {

                    function init() {

                        ngcWysiwyg.divEditableElement = element
                        ngcWysiwyg.atualizarHtml = atualizarHtml;
                        ngcWysiwyg.atualizarModel = atualizarModel;
                        ngcWysiwyg.mudouValor = mudouValor;

                        atualizarHtml()
                        compileImgs();
                        atualizarModel();

                        ngcWysiwyg.undoController.passos.push({
                            html: element.html()
                        })

                    }



                    ngcWysiwyg.ngModelCtrl.$viewChangeListeners.push(function () {
                        scope.$eval(attrs.ngChange);
                    });

                    element.on('drop', onDrop)
                    element.on('click', onClick)
                    element.on('cut', onCut)
                    element.on('keyup', onKeyUp)
                    element.on('paste', onPaste)
                    element.on('mscontrolselect', onMscontrolselect);
                    element.on('keydown', onKeydown);

                    element.on('$destroy', function () {
                        element.off('drop', onDrop)
                        element.off('click', onClick)
                        element.off('cut', onCut)
                        element.off('keyup', onKeyUp)
                        element.off('paste', onPaste)
                        element.off('mscontrolselect', onMscontrolselect);
                        element.off('keydown', onKeydown);
                    })

                    function executarComando(comando, value) {
                        ngcWysiwyg.undoController.gravarPasso(function () {
                            document.execCommand(comando, false, value)
                        })
                    }

                    function onDrop() {
                        ngcWysiwyg.undoController.gravarPassoTimeout()
                    }
                    function onClick() {
                        scope.$apply();
                    }
                    function onCut() {
                        scope.$apply(function () {
                            ngcWysiwyg.undoController.gravarPassoTimeout()
                        });
                    }
                    function onPaste(event) {
                        if (document.queryCommandSupported('insertHTML')) {
                            scope.$apply(function () {
                                ngcWysiwyg.undoController.gravarPasso(function () {
                                    var ctrlCDados = event.clipboardData || window.clipboardData
                                    var texto = ctrlCDados.getData('text')
                                    document.execCommand('insertHTML', null, texto)
                                })
                                event.preventDefault()
                            });
                        }
                    }
                    function onKeyUp() {
                        // atualiza a model
                        atualizarModel()

                    }
                    function onMscontrolselect(evt) {
                        evt.preventDefault();
                    }
                    function onKeydown(event) {
                        // inicia a gravação do step, para salvar primeiro a seleção
                        // deletar
                        scope.$apply(function () {
                            // if (event.key == 'Tab') {
                            //     ngcWysiwyg.undoController.gravarPasso(function () {
                            //         NgcWysiwygUtilService.getRange().startContainer.data = '&#9;' + NgcWysiwygUtilService.getRange().startContainer.data
                            //     });
                            //     event.preventDefault()
                            // }
                            if (event.ctrlKey) {
                                if (event.key == 'b') {
                                    NgcWysiwygTextMenuService.bold(ngcWysiwyg)
                                    event.preventDefault()
                                }
                                if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Del') {
                                    ngcWysiwyg.undoController.gravarPassoTimeout()
                                }
                                if (event.key == 'i') {
                                    executarComando('Italic');
                                    event.preventDefault()
                                }
                                if (event.key == 'u') {
                                    executarComando('UnderLine');
                                    event.preventDefault()
                                }
                                if (event.key == 's') {
                                    executarComando('StrikeThrough');
                                    event.preventDefault()
                                }

                                if (event.key == 'z') {
                                    if (ngcWysiwyg.undoController.gravacaoContinua.gravando) {
                                        ngcWysiwyg.undoController.gravacaoContinua.rollback()
                                    } else {
                                        ngcWysiwyg.undoController.undo();
                                    }
                                    event.preventDefault()
                                    return false;
                                }
                                if (event.key == 'y') {
                                    if (ngcWysiwyg.undoController.gravacaoContinua.gravando) {
                                        ngcWysiwyg.undoController.gravacaoContinua.rollback()
                                    } else {
                                        ngcWysiwyg.undoController.redo();
                                    }
                                    event.preventDefault()
                                    return false;
                                }
                                if (event.key == 'v') {
                                    if (!document.queryCommandSupported('insertHTML')) {
                                        executarComando('Paste');
                                        event.preventDefault()
                                    }
                                }

                            }
                            // certifica que o html mudou pra poder atualizar a model e começar a gravar um step
                            else if (NgcWysiwygUtilService.isLetraNumero(event) || event.key === 'Backspace') {
                                if (ngcWysiwyg.imagemSelecionada) {
                                    ngcWysiwyg.removerImagemSelecionada();
                                }
                                if (!ngcWysiwyg.undoController.gravacaoContinua.gravando) {
                                    ngcWysiwyg.undoController.gravacaoContinua.iniciar()
                                } else {
                                    ngcWysiwyg.undoController.gravacaoContinua.refreshTimeout()
                                }
                            }

                        });

                    }
                    init()

                    function compileImgs() {
                        var imgs = element.find('img')
                        imgs.attr('ngc-wysiwyg-image', true)
                        imgs.attr('contenteditable', false)
                        $compile(imgs)(scope)
                    }

                    function atualizarHtml() {
                        element.html($sce.trustAsHtml(ngcWysiwyg.ngModelCtrl.$modelValue || ''));
                        compileImgs();

                    }


                    function mudouValor(html) {
                        return (html || element.html()) !== ngcWysiwyg.ngModelCtrl.$modelValue
                    }
                    // Write data to the model


                    function atualizarModel(htmlString) {
                        var html = htmlString || element.html();
                        if (mudouValor(html)) {
                            ngcWysiwyg.ngModelCtrl.$setViewValue(html);
                        }
                    }
                }
            };
        })

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
                controller: function ($scope, $element, $compile, $document) {
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
                    vm.ngcWysiwyg.undoController.gravacaoContinua.iniciar(true)
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
                    vm.ngcWysiwyg.undoController.gravacaoContinua.finalizar();
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

        function componentController(NgcWysiwygUtilService) {
            var vm = this;


            vm.isSelectionInsideContent = function () {
                return NgcWysiwygUtilService.isInsideContentEditable();
            }
            vm.botoes = [
                {
                    icone: 'format_list_bulleted',
                    titulo: 'Lista não ordenada',
                    active: function () {
                        return NgcWysiwygUtilService.queryCommand('insertUnorderedList')
                    },
                    callback: function () {
                        if (!NgcWysiwygUtilService.queryCommand('formatBlock', 'blockquote')) {
                            document.execCommand('insertUnorderedList', null, false);
                            return;
                        }
                        document.execCommand('insertUnorderedList', null, false);
                    }
                },
                {
                    icone: 'format_list_numbered',
                    titulo: 'Lista ordenada',
                    active: function () {
                        return NgcWysiwygUtilService.queryCommand('insertOrderedList')
                    },
                    callback: function () {
                        if (!NgcWysiwygUtilService.queryCommand('formatBlock', 'blockquote')) {
                            document.execCommand('insertOrderedList', null, false);
                            return;
                        }
                        document.execCommand('formatBlock', null, 'p');
                    }
                },
                {
                    icone: 'format_quote',
                    titulo: 'Inserir comentário',
                    active: function () {
                        return NgcWysiwygUtilService.queryCommand('formatBlock', 'blockquote')
                    },
                    callback: function () {
                        if (!NgcWysiwygUtilService.queryCommand('formatBlock', 'blockquote')) {
                            document.execCommand('formatBlock', null, "blockquote");
                            return;
                        }
                        document.execCommand('formatBlock', null, 'p');

                        //surroundSelection(angular.element('<blockquote teste="true"></blockquote>')[0])
                    }
                },
                {
                    icone: 'brush',
                    titulo: 'Limpar Formatação',
                    active: function () {
                        return false;
                    },
                    callback: function () {
                        document.execCommand('removeFormat');
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
        .component('ngcWysiwygMenu', component());

    function component() {

        return {
            controller: componentController,
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygMenu/ngcWysiwygMenu.html',
            bindings: {
                titulo: '@',
                icone: '@',
                botoes: '<',
                disabled: '<'
            }
        }

        function componentController() {
            var vm = this;
            vm.abrirMenu = abrirMenu;
            vm.callbackFn = callbackFn;

            function abrirMenu($mdOpenMenu, $event) {
                $mdOpenMenu($event)
                $event.preventDefault()
            }
            function callbackFn($event, botao){
                botao.callback();
                $event.preventDefault()
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
            require: { ngcWysiwyg: '^^ngcWysiwyg' },
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygTextMenu/ngcWysiwygTextMenu.html',
            bindings: {}
        }

        function componentController(NgcWysiwygUtilService, NgcWysiwygTextMenuService) {
            var vm = this;


            vm.setItalic = setText('Italic')
            vm.setStrikeThrough = setText('StrikeThrough')
            vm.setUnderLine = setText('UnderLine')
            vm.isCursorText = isCursorText;
            vm.isSelectionInsideContent = isSelectionInsideContent

            function isSelectionInsideContent() {
                return NgcWysiwygUtilService.isInsideContentEditable();
            }
            function setText(type) {
                return function () {
                    document.execCommand(type, null, false);
                }
            }
            function isCursorText(type) {
                return NgcWysiwygUtilService.queryCommand(type)
            }

            vm.botoes = [
                {
                    callback: function () {
                        NgcWysiwygTextMenuService.bold(vm.ngcWysiwyg)
                    },
                    icone: "format_bold",
                    titulo: "Negrito",
                    active: function () {
                        return vm.isCursorText("bold")
                    }
                },
                {
                    callback: function () {
                        NgcWysiwygTextMenuService.italic(vm.ngcWysiwyg)
                    },
                    icone: "format_italic",
                    titulo: "Itálico",
                    active: function () {
                        return vm.isCursorText("italic")
                    }
                },
                {
                    callback: function () {
                        NgcWysiwygTextMenuService.strikeThrough(vm.ngcWysiwyg)
                    },
                    icone: "format_strikethrough",
                    titulo: "Riscado",
                    active: function () {
                        return vm.isCursorText("strikeThrough")
                    }
                },
                {
                    callback: vm.setUnderLine,
                    icone: "format_underlined",
                    titulo: "Sublinhado",
                    active: function () {
                        return vm.isCursorText("underline")
                    }
                },
            ]

            vm.menuFontFamilty = {
                titulo: 'Tipo de fonte',
                icone: 'format_size',
                botoes: [
                    { titulo: 'Arial', style: 'font-family: Arial;', callback: setFontFamilyFn('Arial') },
                    { titulo: 'Georgia', style: 'font-family: Georgia;', callback: setFontFamilyFn('Georgia') },
                    { titulo: 'Impact', style: 'font-family: Impact;', callback: setFontFamilyFn('Impact') },
                    { titulo: 'Tahoma', style: 'font-family: Tahoma;', callback: setFontFamilyFn('Tahoma') },
                    { titulo: 'Times New Roman', style: 'font-family: Times New Roman;', callback: setFontFamilyFn('Georgia') },
                    { titulo: 'Verdana', style: 'font-family: Verdana;', callback: setFontFamilyFn('Verdana') },
                ]
            }
            vm.menuFontSize = {
                titulo: 'Tamanho da fonte',
                icone: 'format_size',
                botoes: [
                    { titulo: 'A', style: 'font-size: x-small;', callback: setFontSizeFn(1) },
                    { titulo: 'A', style: 'font-size: small', callback: setFontSizeFn(2) },
                    { titulo: 'A', callback: setFontSizeFn(3) },
                    { titulo: 'A', style: 'font-size: large', callback: setFontSizeFn(4) },
                    { titulo: "A", style: 'font-size: x-large', callback: setFontSizeFn(5) },
                    { titulo: 'A', style: 'font-size: xx-large', callback: setFontSizeFn(6) },
                ]
            }
        }

        function setFontFamilyFn(fontName) {
            return function () {
                document.execCommand('fontName', null, fontName);
            }

        }
        function setFontSizeFn(fontSize) {
            return function () {
                document.execCommand('fontSize', null, fontSize);
            }

        }
    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .service('NgcWysiwygTextMenuService', NgcWysiwygTextMenuService)

    /** @ngInject */
    function NgcWysiwygTextMenuService(NgcWysiwygUtilService) {

        this.bold = function (NgcWysiwyg) {
            NgcWysiwygUtilService.aplicarEstilo(NgcWysiwyg, 'bold', 'b', 'strong')
        };
        this.italic = function (NgcWysiwyg) {
            NgcWysiwygUtilService.aplicarEstilo(NgcWysiwyg, 'italic', 'i', 'em')
        };
        this.strikeThrough = function (NgcWysiwyg) {
            NgcWysiwygUtilService.aplicarEstilo(NgcWysiwyg, 'strikeThrough', 'strike')
        };







    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('NgcWysiwygUndoFactory', function (NgcWysiwygUtilService, $timeout) {


            return function NgcWysiwygUndoFactory(ngcWysiwyg) {
                return {
                    passoAtualIndex: 0,
                    passos: [],
                    ngcWysiwyg: ngcWysiwyg,
                    gravarPasso: gravarPasso,
                    gravarPassoTimeout: gravarPassoTimeout,
                    iniciarGravacaoManual: iniciarGravacaoManual,
                    atualizarComponenteParaPasso: atualizarComponenteParaPasso,
                    undo: undo,
                    afterUndo: [],
                    canUndo: canUndo,
                    redo: redo,
                    canRedo: canRedo,
                    configurarGravacaoContinua: function () {
                        var controller = this;
                        this.gravacaoContinua = {
                            iniciar: function (disableTimeout) {
                                if (!this.gravando) {
                                    console.log('iniciar')
                                    var gravacao = this;
                                    this.timeoutTime = 1500;
                                    this.rangeInicial = iniciarGravacao()
                                    this.gravando = true
                                    this.disableTimeout = disableTimeout;
                                    if (!disableTimeout) {
                                        this.timeout = $timeout(function () {
                                            gravacao.finalizar();
                                        }, this.timeoutTime)
                                    }
                                }
                            },
                            refreshTimeout: function () {
                                var gravacao = this;
                                console.log('refresh')
                                $timeout.cancel(this.timeout)
                                if (!this.disableTimeout) {
                                    this.timeout = $timeout(function () {
                                        gravacao.finalizar();
                                    }, this.timeoutTime)
                                }
                            },
                            finalizar: function () {
                                if (this.gravando) {
                                    console.log('finalizar')
                                    finalizarGravacao.call(controller, this.rangeInicial)
                                    $timeout.cancel(this.timeout)
                                    this.gravando = false;
                                }
                            },
                            rollback: function () {
                                if (this.gravando) {
                                    rollbackGravacao.call(controller, this.rangeInicial)
                                    $timeout.cancel(this.timeout)
                                    this.gravando = false;
                                }
                            }
                        }
                    }
                }

                function iniciarGravacaoManual() {
                    var self = this;
                    this.gravacaoContinua = {
                        rangeInicial: iniciarGravacao(),
                        gravando: true,
                        finalizar: function () {
                            if (this.gravando) {
                                finalizarGravacao.call(self, this.rangeInicial)
                                this.gravando = false;
                            }
                        },
                        rollback: function () {
                            if (this.gravando) {
                                rollbackGravacao.call(self, this.rangeInicial)
                                this.gravando = false;
                            }
                        }
                    }
                    return this.gravacaoContinua
                }




                function montarRange() {


                    var range = NgcWysiwygUtilService.copyRange()
                    if (!range) {
                        return null;
                    }
                    var selectedText = NgcWysiwygUtilService.getSelectedText()
                    var originalStart = NgcWysiwygUtilService.getRangeInTextNode(range, false)
                    var originalEnd = NgcWysiwygUtilService.getRangeInTextNode(range, true)

                    if (!originalEnd || !originalStart) {
                        return null
                    }

                    var retornoNormalizeStart
                    var retornoNormalizeEnd
                    if (originalStart.node !== originalEnd.node) {
                        retornoNormalizeStart = NgcWysiwygUtilService.normalize(originalStart.parent, originalStart.node, originalStart.offset)
                        if (!NgcWysiwygUtilService.isConnected(originalEnd.node)) {
                            retornoNormalizeEnd = {
                                nodeSelected: retornoNormalizeStart.nodeSelected,
                                //offset: originalStart.offset + selectedText.length
                                offset: retornoNormalizeStart.offset + selectedText.length
                            }
                        } else {
                            retornoNormalizeEnd = NgcWysiwygUtilService.normalize(originalEnd.parent, originalEnd.node, originalEnd.offset)
                        }
                    } else {
                        retornoNormalizeStart = NgcWysiwygUtilService.normalize(originalStart.parent, originalStart.node, originalStart.offset)
                        retornoNormalizeEnd = { nodeSelected: retornoNormalizeStart.nodeSelected, offset: retornoNormalizeStart.offset + (originalEnd.offset - originalStart.offset) }
                    }

                    NgcWysiwygUtilService.setRange(
                        retornoNormalizeStart.nodeSelected, retornoNormalizeStart.offset,
                        retornoNormalizeEnd.nodeSelected, retornoNormalizeEnd.offset
                    )

                    return {
                        startOffset: retornoNormalizeStart.offset,
                        endOffset: retornoNormalizeEnd.offset,
                        startNodeTree: NgcWysiwygUtilService.getNodeTree(retornoNormalizeStart.nodeSelected),
                        endNodeTree: NgcWysiwygUtilService.getNodeTree(retornoNormalizeEnd.nodeSelected)
                    }
                }

                function iniciarGravacao() {
                    return montarRange()
                }
                function rollbackGravacao(rangeInicial) {
                    finalizarGravacao.call(this, rangeInicial)
                    this.undo();
                    // this.ngcWysiwyg.atualizarModel(this.passos[this.passoAtualIndex].html);
                    // this.ngcWysiwyg.atualizarHtml()
                    // NgcWysiwygUtilService.setRange(
                    //     NgcWysiwygUtilService.getNodeFromTree(rangeInicial.startNodeTree, this.ngcWysiwyg), rangeInicial.startOffset,
                    //     NgcWysiwygUtilService.getNodeFromTree(rangeInicial.endNodeTree, this.ngcWysiwyg), rangeInicial.endOffset
                    // );
                }

                function finalizarGravacao(rangeInicial) {
                    if (this.passos[this.passoAtualIndex].html !== this.ngcWysiwyg.divEditableElement.html()) {
                        this.passos = this.passos.slice(0, this.passoAtualIndex + 1)
                        var passo = {
                            html: this.ngcWysiwyg.divEditableElement.html(),
                            rangeInicial: rangeInicial,
                            rangeFinal: montarRange()
                        }
                        this.passos.push(passo)
                        this.passoAtualIndex++;
                        console.log('passo adicionado', passo, this.passos)
                    }
                }

                function undo() {
                    if (this.canUndo()) {
                        this.atualizarComponenteParaPasso(this.passoAtualIndex - 1)
                        this.passoAtualIndex--;
                        angular.forEach(this.afterUndo, function (fn) {
                            fn();
                        })
                    }
                }

                function gravarPasso(passo) {
                    var rangeInicial = iniciarGravacao.call(this)
                    this.gravacaoContinua.finalizar();
                    passo()
                    finalizarGravacao.call(this, rangeInicial)
                }
                function gravarPassoTimeout(passo) {
                    var self = this;
                    var rangeInicial = iniciarGravacao.call(this)
                    this.gravacaoContinua.finalizar();
                    if (passo) {
                        passo()
                    }
                    $timeout(function () {
                        finalizarGravacao.call(self, rangeInicial)
                    }, 0)
                }
                function canUndo() {
                    return this.passoAtualIndex > 0
                }
                function atualizarComponenteParaPasso(index) {
                    this.ngcWysiwyg.atualizarModel(this.passos[index].html);
                    this.ngcWysiwyg.atualizarHtml()
                    var range;
                    if (this.passoAtualIndex > index) {
                        range = this.passos[index + 1].rangeInicial
                        if (range) {
                            NgcWysiwygUtilService.setRange(
                                NgcWysiwygUtilService.getNodeFromTree(range.startNodeTree, this.ngcWysiwyg), range.startOffset,
                                NgcWysiwygUtilService.getNodeFromTree(range.endNodeTree, this.ngcWysiwyg), range.endOffset
                            );
                            return
                        }
                    } else {
                        range = this.passos[index].rangeFinal
                        if (range) {
                            NgcWysiwygUtilService.setRange(
                                NgcWysiwygUtilService.getNodeFromTree(range.startNodeTree, this.ngcWysiwyg), range.startOffset,
                                NgcWysiwygUtilService.getNodeFromTree(range.endNodeTree, this.ngcWysiwyg), range.endOffset
                            );
                            return
                        }
                    }
                    NgcWysiwygUtilService.clearSelection()
                }
                function redo() {
                    if (this.canRedo()) {
                        this.atualizarComponenteParaPasso(this.passoAtualIndex + 1)
                        this.passoAtualIndex++
                    }
                }
                function canRedo() {
                    return this.passos.length - 1 > this.passoAtualIndex && this.passoAtualIndex !== this.passos.length - 1
                }

            }

        })

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygUndoMenu', {
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygUndoMenu/ngcWysiwygUndoMenu.html',
            bindings: {},
            require: {
                ngcWysiwyg: '^^ngcWysiwyg'
            },
            controller: function componentController() {
                var vm = this;

                vm.botoes = [
                    {
                        disabled: canUndo,
                        titulo: 'Desfazer',
                        callback: undo,
                        icone: 'undo'
                    },
                    {
                        disabled: canRedo,
                        titulo: 'Refazer',
                        callback: redo,
                        icone: 'redo'
                    }
                ]

                function undo() {
                    vm.ngcWysiwyg.undoController.undo()
                }
                function redo() {
                    vm.ngcWysiwyg.undoController.redo()
                }
                function canUndo() {
                    return vm.ngcWysiwyg.undoController.canUndo()
                }
                function canRedo() {
                    return vm.ngcWysiwyg.undoController.canRedo()
                }

            }
        })
}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .service('NgcWysiwygUtilService', function ($window) {

            this.selecionarElemento = selecionarElemento;
            this.getRange = getRange;
            //this.encapsularSelecionado = encapsularSelecionado;
            this.copyRange = copyRange;
            this.setRange = setRange;
            this.clearSelection = clearSelection;
            this.isLetraNumero = isLetraNumero;
            this.getNodeTree = getNodeTree;
            this.getSelection = getSelection;
            this.getNodeFromTree = getNodeFromTree;
            this.isInsideContentEditable = isInsideContentEditable;
            this.isConnected = isConnected;
            this.getSelectedText = getSelectedText
            this.getNearestTextNode = getNearestTextNode;
            this.queryCommand = queryCommand;
            this.normalize = normalize;
            this.getRangeInTextNode = getRangeInTextNode;
            this.aplicarEstilo = aplicarEstilo;

            function estaEntreTags(tagName, rangeOpt) {
                var range = rangeOpt || getRange()
                var tagAnteriorEh = range.startContainer.previousSibling && range.startContainer.previousSibling.nodeName.toLowerCase() === tagName
                var tagPosteriorEh = range.startContainer.nextSibling && range.startContainer.nextSibling.nodeName.toLowerCase() === tagName
                return tagAnteriorEh && tagPosteriorEh
            }
            function aplicarEstilo(NgcWysiwyg, command, tag, ieTag) {
                var ua = window.navigator.userAgent;
                var isIE = ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv:11\./);
                var tagName = tag
                if (isIE && ieTag) {
                    tagName = ieTag
                }
                var commandName = command
                NgcWysiwyg.undoController.gravacaoContinua.finalizar();
                var range = getRange()
                if (range.collapsed) {
                    NgcWysiwyg.undoController.gravacaoContinua.iniciar();
                    var estaComEfeito = queryCommand(commandName)
                    if (!estaComEfeito) {
                        // se não tiver vazio, cria a tag e seleciona ela, ou não está entre tags do mesmo efeito
                        if (range.startContainer.textContent.replace(/\u200B/g, '').length > 0 || !estaEntreTags(tagName, range)) {
                            var commandElement = document.createElement(tagName)
                            range.surroundContents(commandElement)
                            commandElement.innerHTML = '&#8203;';

                            setRange(commandElement.childNodes[0], 1, commandElement.childNodes[0], 1)
                            // não ta com efeito, ta vazio, e ta no meio de duas tags do mesmo efeito, junta
                        } else {
                            var previous = range.startContainer.previousSibling
                            var next = range.startContainer.nextSibling
                            range.startContainer.remove ? range.startContainer.remove() : range.startContainer.removeNode(true)
                            var offset = previous.childNodes[0].length
                            previous.textContent = previous.textContent + next.textContent;
                            next.remove ? next.remove() : next.removeNode(true);
                            setRange(previous.childNodes[0], offset, previous.childNodes[0], offset)
                        }
                    } else {
                        // tratamento pra quando tem coisa escrita
                        if (range.startContainer.textContent.replace(/\u200B/g, '').length > 0) {
                            // ta no final do bold
                            if (range.startContainer.length === range.startOffset) {
                                var textoDireita = range.startContainer.parentNode.nextSibling
                                if (textoDireita) {
                                    textoDireita.textContent = '\u200B' + textoDireita.textContent
                                } else {
                                    // não testado
                                    var newTextNode = document.createTextNode('\u200B');
                                    range.startContainer.parentNode.parentNode.appendChild(newTextNode)
                                    textoDireita = newTextNode;
                                }
                                setRange(textoDireita, 1, textoDireita, 1)
                            } else {
                                var selectedText = range.startContainer.data.slice(range.startOffset);
                                var startTextNode = range.startContainer
                                startTextNode.data = startTextNode.data.slice(0, range.startOffset)
                                var commandElementDireita = document.createElement(tagName)
                                var newTextNode = document.createTextNode('\u200B');
                                commandElementDireita.textContent = selectedText
                                startTextNode.parentNode.parentNode.insertBefore(newTextNode, startTextNode.parentNode.nextSibling);
                                newTextNode.parentNode.insertBefore(commandElementDireita, newTextNode.nextSibling);
                                setRange(newTextNode, 1, newTextNode, 1)
                                //console.log('no meio')
                            }
                        } else {
                            // quando não tem nada escrito o execcommand consegue se virar
                            // Não se estiver tipo <b><i><strike>AQUI</strike></i></b>;
                            document.execCommand(commandName, null, false);
                        }
                    }
                } else {
                    NgcWysiwyg.undoController.gravarPasso(function () {
                        document.execCommand(commandName, null, false);
                    })
                }
            }
            function getRangeInTextNode(range, final) {

                var nodeInicial = final ? range.endContainer : range.startContainer
                if (!isInsideContentEditable()) {
                    return null
                }
                var offset = final ? range.endOffset : range.startOffset;
                var node = nodeInicial;
                while (node && node.nodeType !== Node.TEXT_NODE) {
                    node = node.childNodes[offset - 1]
                }
                if (!node) {
                    node = final ? range.endContainer : range.startContainer
                    offset = final ? range.endOffset : range.startOffset;
                } else if (node !== nodeInicial && node.nodeType === Node.TEXT_NODE) {
                    offset = final ? node.textContent.length : 0
                }
                var parent = node.parentNode;
                var length = node.textContent.length
                return {
                    node: node,
                    offset: offset,
                    parent: parent,
                    length: length
                }
            }
            function normalize(nodeInicial, nodeSelected, offset) {
                var retorno = {};

                if (!nodeInicial) { return; }
                var block = nodeInicial.firstChild
                while (block) {
                    if (block.nodeType === Node.TEXT_NODE) {
                        if (block === nodeSelected) {
                            retorno.nodeSelected = block;
                            retorno.offset = offset;
                        }
                        var nodeIrmao = block.nextSibling
                        while (nodeIrmao && nodeIrmao.nodeType === Node.TEXT_NODE) {
                            if (nodeIrmao === nodeSelected) {
                                retorno.nodeSelected = block;
                                retorno.offset = block.nodeValue.length + offset;
                            }
                            block.nodeValue += nodeIrmao.nodeValue;
                            nodeInicial.removeChild(nodeIrmao);
                            nodeIrmao = block.nextSibling;
                        }
                    }
                    block = block.nextSibling
                }
                if (Object.keys(retorno).length <= 0) {
                    retorno = {
                        nodeSelected: nodeSelected,
                        offset: offset
                    }
                }
                return retorno;
            }

            function queryCommand(type, alternativo) {
                if (getRange()) {
                    var queryComandResult = document.queryCommandState(type);
                    if (!queryComandResult) {
                        queryComandResult = document.queryCommandValue(type)
                    }
                    return queryComandResult === true || queryComandResult === 'true' || queryComandResult === alternativo
                }
                return false;
            }
            function getSelectedText() {
                var range = getRange()
                if (range) {
                    return range.cloneContents().textContent
                }
                return null;

            }
            function setRange(startNode, startOffset, endNode, endOffset) {
                var selection = getSelection()
                selection.removeAllRanges()
                var newRage = document.createRange()
                newRage.setStart(startNode, startOffset)
                newRage.setEnd(endNode, endOffset)
                selection.addRange(newRage)
                // range.startContainer.replaceData(range.startOffset ,  range.startContainer.length, '<span>'+ range.startContainer.substringData(range.startOffset, range.startContainer.length)+'</span>')
            }
            // function encapsularSelecionado(node) {
            //     var range = getRange()
            //     var selectedTagInicial = range.startContainer.substringData(range.startOffset, range.startContainer.length)
            //     var selectedTagFinal = range.endContainer.substringData(0, range.endOffset)
            //     /** @todo problema com as nodes #text quando vai dar o ctrl Y depois de boldear e desboldear o mesmo texto, salva com #text separada, mas quando da ctrl Y não existe mais as #text */
            // }

            function isInsideContentEditable() {
                var range = getRange()
                if (!range) {
                    return false;
                }
                return !!angular.element(range.commonAncestorContainer).controller('ngcWysiwygEditableContainer')
            }

            function copyRange() {
                var range = getRange()
                if (range) {
                    return range.cloneRange()
                }
                return null;
            }
            function getRange() {
                var selection = getSelection()
                if (selection.rangeCount > 0) {
                    return getSelection().getRangeAt(0)
                }
                return null;
            }

            function getSelection() {
                return $window.getSelection()
            }
            function clearSelection() {
                var selecao = getSelection()
                if (selecao) {
                    selecao.removeAllRanges()
                }
            }
            function selecionarElemento(elementNode) {
                getRange().selectNode(elementNode)
            }

            function isLetraNumero(event) {
                return event.key.length === 1;
            }

            function isConnected(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    return !!node.parentNode
                } else {
                    return document.contains(node);
                }
            }

            function getNearestTextNode(node) {

                var irmaoDireita = node.nextSibling
                while (irmaoDireita && irmaoDireita.nodeType !== Node.TEXT_NODE) {
                    irmaoDireita = irmaoDireita.nextSibling;
                }
                if (!irmaoDireita) {
                    var irmaoEsquerda = node.previousSibling
                    while (irmaoEsquerda && irmaoEsquerda.nodeType !== Node.TEXT_NODE) {
                        irmaoEsquerda = irmaoEsquerda.previousSibling;
                    }
                    if (!irmaoEsquerda) {
                        return getNearestTextNode(node.parentNode);
                    }
                    return irmaoEsquerda;
                }
                return irmaoDireita;
            }

            function getNodeTree(node) {
                node = angular.element(node)[0]
                var indexArray = []
                var parent = node.parentNode;
                while (parent.nodeName !== "NGC-WYSIWYG-EDITABLE-CONTAINER") {
                    var index = Array.prototype.indexOf.call(parent.childNodes, node);
                    indexArray.push(index)
                    node = parent;
                    parent = parent.parentNode;
                }
                return indexArray;
            }
            function getNodeFromTree(tree, ngcWysiwyg) {
                var treeCopy = tree.slice(0);
                var elementoPai = ngcWysiwyg.divEditableElement[0]
                var element;
                if (tree.length <= 0) {
                    return elementoPai
                }
                var index = treeCopy.pop()
                while (!angular.isUndefined(index) && index !== null) {
                    element = elementoPai.childNodes[index]
                    elementoPai = element;
                    index = treeCopy.pop()
                }
                return element;
            }
            // function adicionarPasso() {
            //     this.passos.push({
            //         html: this.ngcWysiwyg.htmlValue
            //     })
            // }
        })

}());
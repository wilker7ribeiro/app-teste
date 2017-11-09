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
                vm.imagemSelecionada;

                vm.floatingMenuCtrl;

                vm.divEditableElement;
                vm.atualizarHtml;
                vm.atualizarHtmlComDOMElement;
                vm.atualizarModel;
                vm.mudouValor;


                vm.aoMudarValor = function() {

                }
                vm.setItemSelecionado = function(element){
                     vm.itemSelecionado = element

                }
                vm.setImageSelected = function (imgElement) {
                    vm.setItemSelecionado(imgElement)
                    NgcWysiwygUtilService.clearSelection();
                    vm.imagemSelecionada = true;
                }
                vm.removerImagemSelecionada = function () {
                    vm.itemSelecionado = null;
                    vm.imagemSelecionada = false;
                }
                vm.setBotoesMenuFlutuante = function (botoes) {
                    vm.floatingMenuCtrl.botoes = botoes;
                }

                this.$onInit = function init() {
                }
                this.$postLink = function(){
                    document.execCommand('styleWithCSS', null, true)
                    document.execCommand("enableObjectResizing", false, false);
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

                vm.ngcWysiwyg.undoController.gravarPasso(function () {
                    vm.callback()
                    vm.ngcWysiwyg.atualizarModel()
                })

                $event.preventDefault()
            }
        }
    }

}());
(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('ngcWysiwygEditable', function ($sce, $timeout, $compile, NgcWysiwygUtilService) {
            return {
                restrict: 'A', // only activate on element attribute
                require: '^^ngcWysiwyg', // get a hold of NgModelController
                link: function (scope, element, attrs, ngcWysiwyg) {

                    // Specify how UI should be updated
                    var addStepTimeout
                    var stepGravando;

                    ngcWysiwyg.divEditableElement = element
                    ngcWysiwyg.atualizarHtml = atualizarHtml;
                    ngcWysiwyg.atualizarModel = atualizarModel;
                    ngcWysiwyg.mudouValor = mudouValor;

                    ngcWysiwyg.ngModelCtrl.$viewChangeListeners.push(function () {
                        scope.$eval(attrs.ngChange);
                        ngcWysiwyg.aoMudarValor()
                    });
                    element.on('dragstart', function () {
                        ngcWysiwyg.undoController.gravarPassoTimeout()
                    })
                    element.on('click', function () {
                        scope.$apply();
                    })
                    element.on('cut', function () {
                        scope.$apply(function () {
                            ngcWysiwyg.undoController.gravarPassoTimeout()
                        });
                    })
                    element.on('paste', function (event) {
                        if (document.queryCommandSupported('insertHTML')) {
                            scope.$apply(function () {
                                ngcWysiwyg.undoController.gravarPasso(function () {
                                    var clipboardData = event.clipboardData || window.clipboardData
                                    var texto = clipboardData.getData('text')
                                    document.execCommand('insertHTML', null, texto)
                                })
                                event.preventDefault()
                            });
                        }
                    })
                    // Listen for change events to enable binding
                    element.on('keyup', function () {
                        // atualiza a model
                        atualizarModel()

                    })
                    element.on('mscontrolselect', function (evt) {
                        evt.preventDefault();
                    });
                    element.on('keydown', function (event) {
                        // inicia a gravação do step, para salvar primeiro a seleção
                        // deletar
                        scope.$apply(function () {
                            if (event.ctrlKey) {
                                if (event.key == 'b') {
                                    executarComando('Bold');
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
                                    if (stepGravando) {
                                        $timeout.cancel(addStepTimeout)
                                        stepGravando.rollback()
                                        stepGravando = null;
                                    } else {
                                        ngcWysiwyg.undoController.undo();
                                    }
                                    event.preventDefault()
                                    return false;
                                }
                                if (event.key == 'y') {
                                    if (stepGravando) {
                                        $timeout.cancel(addStepTimeout)
                                        stepGravando.rollback()
                                        stepGravando = null;
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
                                if (!stepGravando) {
                                    console.log('iniciou a gravar')
                                    stepGravando = ngcWysiwyg.undoController.iniciarGravacaoParcial()
                                }

                                // gerencia um delay para terminar de gravar quando parar de escrever
                                $timeout.cancel(addStepTimeout)

                                addStepTimeout = $timeout(function () {
                                    stepGravando.finalizar();
                                    stepGravando = null;
                                }, 2000)
                            }

                        });

                    });

                    function executarComando(comando, value) {
                        ngcWysiwyg.undoController.gravarPasso(function () {
                            document.execCommand(comando, false, value)
                        })
                    }

                    function init() {

                        atualizarHtml()

                        compileImgs();

                        atualizarModel();
                        ngcWysiwyg.undoController.passos.push({
                            html: element.html(),
                            selection: null
                        })

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


                    function atualizarModel(html) {
                        var html = html || element.html();
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
                var vm = this;
                vm.teste = function () {
                    vm.ngcWysiwyg.setImageSelected($element)
                }
                this.$onInit = function () {
                    // $element.on('DOMCharacterDataModified mouseup', function ($event) {
                    //     vm.ngcWysiwyg.triggerChange()
                    // })

                    $element.on('DOMNodeInserted', function (event) {

                        /** @todo mover para o componente de upload quando existir */
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
                            var isResizer = !!angular.element(event.target).controller('ngcWysiwygImageResizer')
                            /** @todo o que é mais performatico? */
                            // isFloatingButton(event.target)
                            var isFloatingButton = !!angular.element(event.target).controller('ngcWysiwygFloatingMenu')

                            if (!isImage && !isFloatingButton && !isResizer) {
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
(function () {
    'use strict';

    angular
        .module('myApp')
        .component('ngcWysiwygInputMenu', component());

    function component() {

        function surroundSelection(element) {
            if (window.getSelection) {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var range = sel.getRangeAt(0)
                    content = range.extractContents();
                    element.appendChild(content);

                    // sel.removeAllRanges();
                    // sel.addRange(range);
                }
            }
        }

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
                    icone: 'format_list_bulleted',
                    titulo: 'Lista não ordenada',
                    callback: function () {
                        document.execCommand('insertUnorderedList', null, false);
                    }
                },
                {
                    icone: 'format_list_numbered',
                    titulo: 'Lista ordenada',
                    callback: function () {
                        document.execCommand('insertOrderedList', null, false);
                    }
                },
                {
                    icone: 'format_quote',
                    titulo: 'Inserir comentário',
                    callback: function () {
                         document.execCommand('formatBlock', null, "BLOCKQUOTE");
                        //surroundSelection(angular.element('<blockquote teste="true"></blockquote>')[0])
                    }
                },
                {
                    icone: 'format_underlined',
                    titulo: 'Lista não ordenada',
                    callback: function () {
                        document.execCommand('formatBlock', null, "P");
                        document.execCommand('insertHorizontalRule  ', null, false);
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
            controllerAs: 'vm',
            templateUrl: './public/ngcWysiwygTextMenu/ngcWysiwygTextMenu.html',
            bindings: {}
        }

        function componentController(NgcWysiwygUtilService) {
            var vm = this;

            vm.setBold = setText('Bold')
            vm.setItalic = setText('Italic')
            vm.setStrikeThrough = setText('StrikeThrough')
            vm.setUnderLine = setText('UnderLine')
            vm.isCursorText = isCursorText;
            vm.isSelectionInsideContent = isSelectionInsideContent

            function isSelectionInsideContent (){
                return NgcWysiwygUtilService.isInsideContentEditable();
            }
            function setText(type) {
                return function () {
                    document.execCommand(type, null, false);
                }
            }
            function isCursorText(type, alternativo) {
                return NgcWysiwygUtilService.queryCommand(type, alternativo)
            }

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
        this.$onInit = function init() {

        }
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
                    iniciarGravacaoParcial: iniciarGravacaoParcial,
                    atualizarComponenteParaPasso: atualizarComponenteParaPasso,
                    undo: undo,
                    afterUndo: [],
                    canUndo: canUndo,
                    redo: redo,
                    canRedo: canRedo,
                    gravacaoAtual: null
                }



                function iniciarGravacaoParcial() {
                    var self = this;
                    this.gravacaoAtual = {
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
                    return this.gravacaoAtual
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

                function prepararRange(range, final) {

                    var nodeInicial = final ? range.endContainer : range.startContainer
                    if (!NgcWysiwygUtilService.isInsideContentEditable(node)) {
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
                function montarRange() {


                    var range = NgcWysiwygUtilService.copyRange()
                    if (!range) {
                        return null;
                    }
                    var selectedText = range.cloneContents().textContent
                    var originalStart = prepararRange(range, false)
                    var originalEnd = prepararRange(range, true)

                    if (!originalEnd || !originalStart) {
                        return null
                    }

                    var retornoNormalizeStart
                    var retornoNormalizeEnd
                    if (originalStart.node !== originalEnd.node) {
                        retornoNormalizeStart = normalize(originalStart.parent, originalStart.node, originalStart.offset)
                        if (!NgcWysiwygUtilService.isConnected(originalEnd.node)) {
                            retornoNormalizeEnd = {
                                nodeSelected: retornoNormalizeStart.nodeSelected,
                                //offset: originalStart.offset + selectedText.length
                                offset: retornoNormalizeStart.offset + selectedText.length
                            }
                        } else {
                            retornoNormalizeEnd = normalize(originalEnd.parent, originalEnd.node, originalEnd.offset)
                        }
                    } else {
                        retornoNormalizeStart = normalize(originalStart.parent, originalStart.node, originalStart.offset)
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
                    this.ngcWysiwyg.atualizarModel(this.passos[this.passoAtualIndex].html);
                    this.ngcWysiwyg.atualizarHtml()
                    NgcWysiwygUtilService.setRange(
                        NgcWysiwygUtilService.getNodeFromTree(rangeInicial.startNodeTree, this.ngcWysiwyg), rangeInicial.startOffset,
                        NgcWysiwygUtilService.getNodeFromTree(rangeInicial.endNodeTree, this.ngcWysiwyg), rangeInicial.endOffset
                    );
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
                    if (this.gravacaoAtual) {
                        this.gravacaoAtual.finalizar();
                    }
                    passo()
                    finalizarGravacao.call(this, rangeInicial)
                }
                function gravarPassoTimeout(passo) {
                    var self = this;
                    var rangeInicial = iniciarGravacao.call(this)
                    if (this.gravacaoAtual) {
                        this.gravacaoAtual.finalizar();
                    }
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
                    if (this.passoAtualIndex > index) {
                        var range = this.passos[index + 1].rangeInicial
                        if (range) {
                            NgcWysiwygUtilService.setRange(
                                NgcWysiwygUtilService.getNodeFromTree(range.startNodeTree, this.ngcWysiwyg), range.startOffset,
                                NgcWysiwygUtilService.getNodeFromTree(range.endNodeTree, this.ngcWysiwyg), range.endOffset
                            );
                            return
                        }
                    } else {
                        var range = this.passos[index].rangeFinal
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
                function redo(params) {
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
            this.encapsularSelecionado = encapsularSelecionado;
            this.copyRange = copyRange;
            this.setRange = setRange;
            this.clearSelection = clearSelection;
            this.isLetraNumero = isLetraNumero;
            this.getNodeTree = getNodeTree;
            this.getNodeFromTree = getNodeFromTree;
            this.isInsideContentEditable = isInsideContentEditable;
            this.isConnected = isConnected;
            this.getNearestTextNode = getNearestTextNode;
            this.queryCommand = queryCommand;

            function queryCommand(type, alternativo) {
                if (getRange()) {
                    var queryComandResult = document.queryCommandValue(type);
                    return queryComandResult === 'true' || queryComandResult === true || queryComandResult === alternativo;
                }
                return false;
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
            function encapsularSelecionado(node) {
                var range = getRange()
                var selectedTagInicial = range.startContainer.substringData(range.startOffset, range.startContainer.length)
                var selectedTagFinal = range.endContainer.substringData(0, range.endOffset)
                /** @todo problema com as nodes #text quando vai dar o ctrl Y depois de boldear e desboldear o mesmo texto, salva com #text separada, mas quando da ctrl Y não existe mais as #text */
            }

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
                $window.getSelection().selectAllChildren(elementNode)
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
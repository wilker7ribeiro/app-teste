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
                    element.on('click', function () {
                        scope.$apply();
                    })
                    element.on('cut', function (event) {
                        scope.$apply(function () {
                            ngcWysiwyg.undoController.gravarPassoTimeout()
                            //event.preventDefault()
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
                    element.on('keyup', function ($event) {
                        // atualiza a model
                        atualizarModel()

                    })
                    element.on('keydown', function (event) {
                        // inicia a gravação do step, para salvar primeiro a seleção
                        // deletar
                        scope.$apply(function () {
                            if (ngcWysiwyg.imagemSelecionada) {
                                ngcWysiwyg.removerImagemSelecionada();
                            }
                            if (event.ctrlKey) {
                                if (event.key == 'z') { // CTRL + C
                                    if (stepGravando) {
                                        $timeout.cancel(addStepTimeout)
                                        stepGravando.rollback()
                                        stepGravando = null;
                                    } else {
                                        ngcWysiwyg.undoController.undo();
                                    }
                                    event.preventDefault()
                                    return false;
                                } else if (event.key == 'y') {
                                    if (stepGravando) {
                                        $timeout.cancel(addStepTimeout)
                                        stepGravando.rollback()
                                        stepGravando = null;
                                    } else {
                                        ngcWysiwyg.undoController.redo();
                                    }
                                    event.preventDefault()
                                    return false;
                                } else if (event.key == 'v') {
                                    if (!document.queryCommandSupported('insertHTML')) {
                                        ngcWysiwyg.undoController.gravarPasso(function () {
                                            document.execCommand('Paste');
                                            // var startContainer = window.getSelection().getRangeAt(0).startContainer;
                                            // startContainer.innerHTML = startContainer.innerHTML
                                            //window.getSelection().getRangeAt(0).endContainer.parentNode.innerHTML = window.getSelection().getRangeAt(0).endContainer.parentNode.innerHTML
                                        })
                                        event.preventDefault()
                                    }
                                }

                            }
                            // certifica que o html mudou pra poder atualizar a model e começar a gravar um step
                            else if (NgcWysiwygUtilService.isLetraNumero(event)) {
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
                        angular.element(imgs).attr('ngc-wysiwyg-image', true)
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
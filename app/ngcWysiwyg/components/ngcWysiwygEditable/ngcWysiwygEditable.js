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
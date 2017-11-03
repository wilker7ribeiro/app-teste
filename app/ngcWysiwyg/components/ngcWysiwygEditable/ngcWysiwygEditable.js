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

                    // Listen for change events to enable binding
                    element.on('keydown', function (event) {

                        // inicia a gravação do step, para salvar primeiro a seleção


                        scope.$apply(function () {

                            if (ngcWysiwyg.imagemSelecionada) {
                                ngcWysiwyg.removerImagemSelecionada();
                            }

                            if (event.key == 'z' && event.ctrlKey) { // CTRL + C
                                if (stepGravando) {
                                    $timeout.cancel(addStepTimeout)
                                    stepGravando.rollback()
                                    stepGravando = null;

                                } else {
                                    ngcWysiwyg.undoController.undo();
                                }
                                event.preventDefault()
                                return false;
                            } else if (event.key == 'y' && event.ctrlKey) {
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
                            // certifica que o html mudou pra poder atualizar a model e começar a gravar um step
                            if (NgcWysiwygUtilService.isLetraNumero(event)) {
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

                                // atualiza a model
                                atualizarModel()
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
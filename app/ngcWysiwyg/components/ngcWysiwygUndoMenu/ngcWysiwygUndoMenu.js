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
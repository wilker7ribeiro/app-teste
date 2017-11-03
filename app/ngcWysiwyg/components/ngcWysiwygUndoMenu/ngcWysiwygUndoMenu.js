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
            controller: function componentController(NgcWysiwygUndoFactory) {
                var vm = this;

                vm.undo = undo;
                vm.redo = redo;
                vm.canUndo = canUndo;
                vm.canRedo = canRedo;

                function undo(type) {
                    vm.ngcWysiwyg.undoController.undo()
                }
                function redo(type) {
                    vm.ngcWysiwyg.undoController.redo()
                }
                function canUndo(type) {
                    return vm.ngcWysiwyg.undoController.canUndo()
                }
                function canRedo(type) {
                    return vm.ngcWysiwyg.undoController.canRedo()
                }

            }
        })
}());
;(function(){
    'use strict';

    angular
        .module( 'ZS.checkbox' )
        .directive( 'zsCheckbox', zsCheckbox );

    zsCheckbox.$inject = [];

    function zsCheckbox(){
        var directive = {
            restrict : 'EA',
            scope : {
                selected    : '=selected',
                onChange    : '&?',                                     // 复选框状态发生改变的时候触发
                options     : '=?'                                      // 复选框onChange事件触发的时候传入的参数对象
            },
            templateUrl : '/components/zscheckbox/index.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){

            scope.toggle = toggle;

            function toggle($event){
                /*取消事件冒泡*/
                $event.stopPropagation();
                scope.selected = ( 1 + scope.selected )%2;

            }

            scope.$watch( function(){
                return scope.selected;
            }, function(){
                if( typeof scope.onChange === 'function' && typeof scope.selected !== 'undefined' ){
                    scope.onChange()({
                        options     : scope.options,
                        selected    : scope.selected
                    });
                }
            });

        }

    }

    /*
     * @desc 使用示例
     * <zs-checkbox selected=0></zs-checkbox>
     * <div zs-checkbox selected=1></div>
     */
})();

;(function(){
    'use strict';

    angular
        .module( 'ZS.radio' )
        .directive( 'zsRadio', zsRadio );

    zsRadio.$inject = [];

    function zsRadio(){
        var directive = {
            restrict : 'EA',
            scope : {
                selectedValue : '=selectedvalue',
                options : '=options'
            },
            templateUrl : '/components/zsradio/index.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){

            scope.select = select;

            setSelectedIndexByValue( scope.selectedValue );

            // 根据值设置索引
            function setSelectedIndexByValue( value ){
                for( var i = 0 ; i < scope.options.length; i++ ){
                    if( scope.options[i].value === value ){
                        scope.selectedIndex = i;
                        break;
                    }
                }
            }

            function select( index ){
                scope.selectedIndex = index;
                scope.selectedValue = scope.options[index].value;
            }


            scope.$watch( 'selectedValue' , function(){
                setSelectedIndexByValue( scope.selectedValue );
            });
        }
    }

    /*
     * @desc 使用示例
     * <div zs-radio options="[{ name : 'abc', value : 1},{ name : 'bbc', value : 2 }, { name : 'cbc', value : 3}]" selectedValue=1></div>
     * <zs-radio options="[{ name : 'abc', value : 1},{ name : 'bbc', value : 2 }, { name : 'cbc', value : 3}]" selectedValue=2></zs-radio>
     */
})();

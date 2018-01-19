;(function(){
    'use strict';

    angular 
        .module( 'ZS.select' )
        .directive( 'zsSelect', zsSelect );

    zsSelect.$inject = [ '$rootScope', '$document' ];

    function zsSelect( $rootScope, $document ){
        var directive = {
            restrict : 'EA',
            scope : {
                selectedValue : '=selectedvalue',
                options : '=options',
                onChange : '&?'
            },
            templateUrl : '/components/zsselect/index.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){

            if( typeof scope.options === 'undefined' ){
                throw "必须初始化options数组";
            }
            if( typeof scope.selectedValue === 'undefined' ){
                throw "必须初始化selectedValue";
            }

            scope.randomId                = 'zsSelect' + Math.ceil( (new Date().getTime() )*Math.random() );

            scope.setSelectedItem   = setSelectedItem;
            scope.toggleSelectList  = toggleSelectList;

            scope.selectedItemIndex = 0;                // 被选中的值在下拉列列表数组中的索引
            scope.listVisible       = false;            // 下拉列表是否可见

            // 查看options中是否有初始选中的值
            getItemIndexByValue();

            /*
             * 通过value获取数组index值
             */
            function getItemIndexByValue(){
                for( var i = 0 ; i < scope.options.length; i++ ){
                    if( typeof scope.options[i].value !== typeof scope.selectedValue ){
                        throw "选中的值的类型不匹配";
                    }else{
                        if( scope.options[i].value === scope.selectedValue ){
                            scope.selectedItemIndex = i;
                            break;
                        }
                    }
                }
            }

            /*
             * @desc 设置索引值index对应的选项为当前选中的选项
             * @param { Number } index
             */
            function setSelectedItem( index ){
                scope.selectedItemIndex = index;
                scope.selectedValue = scope.options[scope.selectedItemIndex].value;
            }

            /**
             * 切换下拉菜单显示和隐藏
             */
            function toggleSelectList(){
                scope.listVisible = !scope.listVisible;
            }

            /**
             * 监听文档点击事件，判断是否点击了当前的下拉菜单
             */
            function responseForClickEvent( e ){
                if( $( e.target ).closest( '#' + scope.randomId ).length === 0 ){
                    scope.$apply( function(){
                        scope.listVisible = false;
                    });
                }
            }

            $document.on( 'click', responseForClickEvent );

            scope.$on( '$destroy', function(){
                $document.off( 'click', responseForClickEvent );
            });

            scope.$watch( function(){ return scope.selectedValue; }, function( newValue, oldValue ){
                //console.log( scope.selectedValue );
                if( newValue !== oldValue ){
                    getItemIndexByValue();
                    if( typeof scope.onChange === 'function' && typeof scope.selectedValue !== 'undefined' ){
                        //console.log( scope.selectedValue );
                        scope.onChange()( scope.selectedItemIndex );
                    }
                }
            });

        }
    }

    /* 
     * @desc 使用示例
     * <zs-select options="[{ 'name': '条','value':0},{ 'name' : 'M', 'value':1},{ 'name' : 'G', 'value':2},{ 'name' : 'T', 'value':3}]" selectedvalue=1></zs-select>
     * <zs-select options="[{ 'name': '条','value':0},{ 'name' : 'M', 'value':1},{ 'name' : 'G', 'value':2},{ 'name' : 'T', 'value':3}]" selectedvalue=1></zs-select>
     */

})();

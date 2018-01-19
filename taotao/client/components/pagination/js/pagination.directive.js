;(function(){
    'use strict';

    angular
        .module( 'Datatao.pagination' )
        .directive( 'paginationDirective', paginationDirective );

    paginationDirective.$inject = [ '$rootScope', '$state' ];

    /**
     * binddata
     * binddata.getPage // 获取某一页的数据，所有的操作以此为基础
     * binddata.params // 获取页面数据使用的参数
     */

    function paginationDirective( $rootScope, $state ){
        var directive = {
            restrict : 'EA',
            scope : {
                //binddata : "=binddata"
                pageIndex : "=pageIndex",
                pageTotal : "=pageTotal"
            },
            templateUrl : '/components/pagination/index.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){
            scope.zsPagination = {
                prevPage : prevPage,
                nextPage : nextPage,
                getPage : getPage,
                range : range,
                pageTotal : scope.pageTotal,
                pageIndex : scope.pageIndex
            };

            function prevPage(){
                scope.zsPagination.pageIndex--;
                scope.pageIndex = scope.zsPagination.pageIndex;
                //binddata.params.curPage = scope.zsPagination.pageIndex;
                //binddata.getPage( binddata.params );
            }
            function nextPage(){
                scope.zsPagination.pageIndex++;
                scope.pageIndex = scope.zsPagination.pageIndex;
                //binddata.params.curPage = scope.zsPagination.pageIndex;
                //binddata.getPage( binddata.params );
            }
            function getPage( pageIndex ){
                scope.zsPagination.pageIndex = pageIndex;
                scope.pageIndex = pageIndex;
                //binddata.params.curPage = scope.zsPagination.pageIndex;
                //binddata.getPage( binddata.params );
            }

            function range(min, max, step){
                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step){
                    input.push(i);
                }
                return input;
            }

            scope.$watch( 'pageIndex',  function( newValue, oldValue ){
                scope.zsPagination.pageIndex = scope.pageIndex;
                // 仅仅当非初始化的时候才对监听到的更改应用url变更
                if( newValue !== oldValue ){
                    $state.go( $state.current.name, { page : scope.pageIndex }, { notify : false } );
                }
            });
            scope.$watch( 'pageTotal', function(){
                scope.zsPagination.pageTotal = scope.pageTotal;
            });
        }

    }

})();

;(function(){
    'use strict';

    angular
        .module( 'Datatao.header' )
        .directive( 'headerTopnav', headerTopnav);

    headerTopnav.$inject = [ '$state', 'localStorageService', '$rootScope', '$uibModal' ];

    function headerTopnav( $state, localStorageService, $rootScope, $uibModal ){
        var directive = {
            restrict : 'EA',
            scope : {
            },
            replace : true,
            templateUrl : '/components/header/header_topnav.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){

            /*
            var token   = localStorageService.get( 'token' );
            if( token ){
                var user = localStorageService.get( 'user' );
                if( user.exp*1000 > new Date().getTime() ){
                    scope.isLogin = true;
                }else{
                    scope.isLogin = false;
                }
            }
            //console.log( localStorageService.get( 'token' ) );
            */

            /*
             * 提示登录
             * @param {number} msgType - 提示类型，data表示是数据，demand表示是定制
             */
            scope.promptLogin = function( msgType ){
                var popMsg = '';
                if( msgType === 'data' ){
                    popMsg = '嗨，发布数据需要您先登录哟！<p>给您带来不便，非常抱歉。</p>';
                }else if( msgType === 'demand' ){
                    popMsg = '嗨，数据定制需要您先登录哟！<p>给您带来不便，非常抱歉。</p>';
                }
                var modalInstance = $uibModal.open({
                    animation       : true,
                    templateUrl     : '/components/poplayer/poplayer.normal.html',
                    controller      : 'poplayerNormalCtrl',
                    controllerAs    : 'vm',
                    resolve         : {
                        popInData : function(){
                            return {
                                popMsg      : popMsg,
                                okBtn       : '马上登录',
                                showCancel  : false,
                                headTitle   : '请先登录'
                            };
                        }
                    }
                });

                modalInstance.result.then( function( resultObj ){
                    $state.go( 'signIn' );
                });
            };
            
            scope.logout = function(){
                localStorageService.remove( 'token' );
                localStorageService.remove( 'user' );
                if( $state.includes( 'userCenter' ) ){
                    $state.go( 'home' );
                }else{
                    $rootScope.isLogin = false;
                }
            };

        }
    }
})();

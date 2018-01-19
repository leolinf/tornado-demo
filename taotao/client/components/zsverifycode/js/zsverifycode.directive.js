;(function(){
    'use strict';

    angular
        .module( 'ZS.verifycode' )
        .directive( 'zsVerifycode', zsVerifycode );

    zsVerifycode.$inject = [ '$uibModal', '$timeout', 'VerifycodeImgFactory' ];
    
    /**
     * binddata = {
     *     key                  : '',       // 存储后端返回的值，用于获取手机验证码
     *     waitTime             : 60,       // 倒计时开始时间,默认是60秒
     *     verifyCodeType       : 0         // 0/1 注册/找回密码
     * }
     */

    function zsVerifycode( $uibModal, $timeout, VerifycodeImgFactory ){
        var directive = {
            restrict : 'EA',
            scope : {
                binddata : '=binddata',
                username : '=username',
            },
            templateUrl : '/components/zsverifycode/index.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){

            var VerifycodeImgInstance = VerifycodeImgFactory;

            scope.getVerifycode = getVerifycode;
            scope.waitTime      = scope.binddata.waitTime ? scope.binddata.waitTime : 60;

            scope.count = {
                countTime : scope.waitTime,
                showCount : false
            };

            var stopCountDown   = false;        // 终止倒计时标记

            function getVerifycode(){
                var modalInstance = $uibModal.open({
                    templateUrl : '/components/zsverifycode/poplayer.tpl.html',
                    controller : 'zsVerifycodeCtrl',
                    controllerAs : 'vm',
                    resolve : {
                        popData : function(){
                            return scope.binddata;
                        }
                    }
                });
                modalInstance.result.then( function( res ){
                    if( res.status ){
                        scope.count.showCount = true;
                        countDown( scope.count );
                        // send mobile verifycode
                        VerifycodeImgInstance.sendCode({
                            username : scope.username,
                            verifyType : res.verifyCodeType,
                            key : res.key,
                            imgCode : res.imgCode
                        })
                        .then( function( res ){
                            //console.log( res );
                        }, function( res ){
                            console.log( res );
                        });
                    }else{
                        console.log( '图形验证码验证失败' );
                    }
                });
            }

            /**
             * 倒计时
             * @param {Object} obj - 对象，方便外部使用倒计时的值
             * @param {Number} obj.countTime - 倒计时时间，每1秒减1，直到0
             * @param {Boolean} obj.showCount - 显示倒计时标记
             */
            function countDown( obj ){
                // 如果设置了终止倒计时，则还原倒计时计数
                if( stopCountDown ){
                    obj.countTime = scope.waitTime;
                }else if( obj.countTime > 0 ){
                    $timeout( function(){
                        obj.countTime--;
                        countDown( obj );
                    }, 1000 );
                }else{
                    obj.showCount = false;
                    obj.coutTime = scope.waitTime;              // 计时结束,恢复计时起点
                }
            }

        }
    }
})();

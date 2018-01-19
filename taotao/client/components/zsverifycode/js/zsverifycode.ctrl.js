;(function(){
    'use strict';

    angular 
        .module( 'ZS.verifycode', [] )
        .controller( 'zsVerifycodeCtrl', zsVerifycodeCtrl );

    zsVerifycodeCtrl.$inject = [ '$uibModalInstance', '$timeout', 'popData', 'VerifycodeImgFactory', 'errorCode' ];

    function zsVerifycodeCtrl( $uibModalInstance, $timeout, popData, VerifycodeImgFactory, errorCode ){
        /*jshint validthis: true */
        var vm = this;

        var verifycodeImgInstance   = VerifycodeImgFactory;
        var key                     = '';

        vm.refreshVerifycodeImg = getVerifycodeImg;
        vm.ok                   = ok;
        vm.cancel               = cancel;
        vm.showError            = false;
        vm.errMsg               = "";
        vm.imgVerifycode        = "";
    
        activate();

        /**
         * 控制器内逻辑的启动器
         */
        function activate(){
            getVerifycodeImg();
        }

        /**
         * 获取验证码图片
         */
        function getVerifycodeImg(){
            verifycodeImgInstance.getVerifycodeImg( {} ).then( function( res ){
                if( res.errorCode === errorCode.SUCCESS ){
                    vm.verifycodeImg = "data:image/jpg;base64," + res.data.image;
                    key = popData.key = res.data.key;
                }else{
                    alert( '验证码获取失败，请重新获取验证码' );
                    //console.log( '针对获取验证码失败进行错误处理' );
                }
            });
        }

        /**
         * 点击确定按钮，验证验证码，并且关闭弹出层
         */
        function ok(){
            vm.errMsg = "";
            vm.showError = false;
            if( vm.imgVerifycode.trim() === '' ){
                vm.showError = true;
            }else{
                vm.showError = false;
            }
            var params = {
                key : key,
                imgCode : vm.imgVerifycode
            };
            verifycodeImgInstance.verifyCode( params ).then( function( res ){
                if( res.errorCode === errorCode.SUCCESS  ){
                    $uibModalInstance.close( {
                        status : true,
                        key : key,
                        verifyCodeType : popData.verifyCodeType,
                        imgCode : vm.imgVerifycode
                    } );
                }else if( res.errorCode === errorCode.INVALID_IMAGE_CODE ){
                    vm.showError    = true;
                    vm.errMsg       = "验证码错误";
                    $timeout( function(){
                        vm.showError = false;
                    }, 1000 );
                }
            });
        }

        /**
         * 点击取消按钮，关闭弹出层
         */
        function cancel(){
            $uibModalInstance.dismiss();
        }

    }
})();

;(function(){
	'use strict';
	angular
        .module( 'Datatao.poplayer' )
        .controller( 'poplayerNormalCtrl', poplayerNormalCtrl );

    poplayerNormalCtrl.$inject = [ '$uibModalInstance', 'popInData', '$sce' ];

    function poplayerNormalCtrl( $uibModalInstance, popInData, $sce ){
        /*jshint validthis:true*/
        var vm = this;

        vm.ok       = ok;
        vm.cancel   = cancel;
        vm.close    = close;

        // 是否显示ok按钮，默认显示
        vm.showOk           = typeof popInData.showOk !== 'undefined' ? popInData.showOk : true;
        // ok按钮的文字，默认“确定”
        vm.okBtn            = typeof popInData.okBtn !== 'undefined' ? popInData.okBtn : '确定';
        // ok按钮的皮肤颜色，默认为蓝色
        vm.okBtnTheme       = typeof popInData.okBtnTheme !== 'undefined' ? popInData.okBtnTheme : 'blue';
        // 是否现实cancel按钮，默认显示
        vm.showCancel       = typeof popInData.showCancel !== 'undefined' ? popInData.showCancel : true;
        // cancel按钮的文字，默认为取消
        vm.cancelBtn        = typeof popInData.cancelBtn !== 'undefined' ? popInData.cancelBtn : '取消';
        // cancel按钮的皮肤颜色，默认为红色
        vm.cancelBtnTheme   = typeof popInData.cancelBtn !== 'undefined' ? popInData.cancelBtnTheme : 'red';
        // 是否显示弹出层标题
        vm.showHead         = typeof popInData.showHead !== 'undefined' ? popInData.showHead : true;
        // 弹出层标题文字，默认为“提示信息”
        vm.headTitle        = typeof popInData.headTitle !== 'undefined' ? popInData.headTitle : '提示信息';

        // 弹出层上信息，默认为“提示信息”，可以是富文本内容
        vm.popMsg           = typeof popInData.popMsg !== 'undefined' ? popInData.popMsg : '提示信息';
        vm.popMsg           = $sce.trustAsHtml( vm.popMsg );

        /**
         * 确定按钮绑定事件
         */
        function ok(){
            $uibModalInstance.close({
                status : true
            });
        }

        /**
         * 取消按钮绑定事件
         */
        function cancel(){
            $uibModalInstance.close({
                status : false
            });
        }

        /**
         * 右上角关闭按钮绑定事件
         */
        function close(){
            $uibModalInstance.dismiss('cancel');
        }
    }
})();

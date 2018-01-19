/**
 * 添加意见反馈
 */
(function(){
	'use strict';

	angular
		.module('Datatao.userCenter')
		.controller('feedbackCtrl',feedbackCtrl);

		feedbackCtrl.$inject = ['$uibModal','UserCenterFeedbackFactory','errorCode'];

		//用户反馈执行函数
		function feedbackCtrl($uibModal,UserCenterFeedbackFactory,errorCode){
			//jshint validthis:true
			var vm = this;
			vm.feedback = feedback;
			vm.checkInfo = checkInfo;
			vm.open = open;
			vm.content = "";

			active();

			function active(){
				
			}

			/**
			 * 检查输入信息是否正确
			 */
			function checkInfo(){
				var contentLength = vm.content.trim().length;
				if(contentLength<=0){
					var params = {
						showOk:true,
						showCancel:false,
						// okBtn:true,
						popMsg:"<p>内容不能为空</p>",
						showHead	: false
  				  	};
					open(params);
				}else{
					//提交数据
					feedback();			
				}
			}

			function open(params){
				var modalInstance = $uibModal.open({
  					animation: true,
  					backdrop: 'static',
  					templateUrl: '/components/poplayer/poplayer.normal.html',
  					controller: 'poplayerNormalCtrl',
  					controllerAs : 'vm',
  					resolve: {
  				  		popInData: params
  				  	}
  				  });
	
  				modalInstance.result.then(
  					function (selectedItem) {
  						vm.selected = selectedItem;
  					}, 
  					function () {
  				    	//$log.info('Modal dismissed at: ' + new Date());
  					}
  				);
			}

			/*向后台提交意见反馈*/
			function feedback(){
				var params = {
					content : vm.content
				};
				console.log("params.content:   "+params.content);
				UserCenterFeedbackFactory.submitFeedback(params)
				.then(function(response){
					if(response.errorCode === errorCode.SUCCESS){
						var addGoOn = open({
							showCancel:false,
							popMsg:"<p>提交成功！</p>",
  				  		});  				  		
					}else{
						open({
							showOk:false,
							showCancel:false,
							popMsg:"<p>对不起，由于网络等原因<br />您的反馈提交失败，请稍后再试！</p>",
  				  		}); 
					}
				});
			}

		}
})();
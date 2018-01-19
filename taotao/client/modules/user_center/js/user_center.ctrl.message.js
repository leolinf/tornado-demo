(function(){
	'use strict';

	angular
		.module('Datatao.userCenter')
		.controller('messageCtrl',messageCtrl);

		messageCtrl.$inject = ['MessageFactory','errorCode','defaults','messageTypeObj','messageTypeArr'];

		function messageCtrl(MessageFactory,errorCode,defaults,messageTypeObj,messageTypeArr){
			//jshint validthis:true
			var vm = this;

			//获取消息列表
			vm.getMessageList = getMessageList;

			//查看消息详情
			vm.viewMessageDetail = viewMessageDetail;
			vm.messageTypeObj = messageTypeObj;
			vm.messageTypeArr = messageTypeArr;
			vm.selectedReviewStatus = messageTypeObj.all.value;

			var getMessageListParams = {
				start : defaults.pageStart,
				count : defaults.pageCount,
				msgType : messageTypeObj.systemMessage.value
			};
			// console.log(getMessageListParams.start+"   "+getMessageListParams.count+"   "+getMessageListParams.msgType);
			active();

			function active(){
				getMessageList(getMessageListParams);
			}

			/**
			 * 获取消息列表
			 * @param  {[type]} params [description]
			 * @return {[type]}        [description]
			 */
			function getMessageList(params){
				MessageFactory.getMessageList(params)
				.then(function(response){
					if(response.errorCode === errorCode.SUCCESS){
						vm.messageList = response.data.msgList;
					}else{
						console.log(response);
					}
				});
			}


			/**
			 * 查看信息详情
			 * @return {[type]} [description]
			 */
			function viewMessageDetail(id){
				$state.go('dataDetail',{id:id});
			}

		}
})();

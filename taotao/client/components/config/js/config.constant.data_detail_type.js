;(function(){
	'use strict';

	angular
		.module('Datatao.config')
		.constant('dataDetailType', {
			dataDetail:{
				value:1,
				name:"数据详情"
			},
			rebackExample:{
				value:2,
				name:"返回样例"
			},
			apiInfo:{
				value:3,
				name:"接口信息"
			}
		});
})();
;(function(){
	'use strict';

	angular
		.module('Datatao')
		.filter('dataSizeFilter',dataSizeFilter );

		dataSizeFilter.$inject = ['$filter'];

		//设置数据大小
		function dataSizeFilter($filter){
			return function(num){
				num = parseInt(num);
				var returnNum = 0;
				var baseNum = 1000;
				if(num < baseNum){
					returnNum = num+"B";		//B
				}else if(num>=baseNum && num<(Math.pow(baseNum,2))){
					returnNum = (num/baseNum).toFixed(2)+"KB";			//KB
				}else if(num>=(Math.pow(baseNum,2) && num<(Math.pow(baseNum,3)))){
					returnNum = (num/(Math.pow(baseNum,2))).toFixed(2)+"MB";		//MB
				}else if(num>=(Math.pow(baseNum,3) && num<(Math.pow(baseNum,4)))){
					returnNum = (num/(Math.pow(baseNum,3))).toFixed(2)+"GB";		//GB
				}else if(num>=(Math.pow(baseNum,4) && num<(Math.pow(baseNum,5)))){
					returnNum = (num/(Math.pow(baseNum,4))).toFixed(2)+"TB";		//TB
				}
				return returnNum;
			};
		}
})();

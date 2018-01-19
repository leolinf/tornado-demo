;(function(){
	'use strict';

	angular
		.module('Datatao')
		.filter('dataRowsFilter',dataRowsFilter );

	    dataRowsFilter.$inject = [];

		//设置数据大小
		function dataRowsFilter(){
			return function(num){
				num = parseInt(num);
				var returnNum = 0;
				var baseNum = 10000;
				if(num<baseNum){
					returnNum = num;
				}else if(num>=baseNum && num<baseNum*baseNum){
					returnNum = (num/baseNum).toFixed(2)+"万";
				}else{
					returnNum = (num/(baseNum*baseNum)).toFixed(2)+"亿";
				}
				return returnNum;
			};
		}
})();

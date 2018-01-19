(function(){
	'use strict';

	angular
		.module('Datatao.qualityData')
		.controller('qualityDataCategoryCtrl',qualityDataCategoryCtrl);

		qualityDataCategoryCtrl.$inject = ['$scope','errorCode','qualityDataCategoryArr'];

		function qualityDataCategoryCtrl($scope,errorCode,qualityDataCategoryArr){
			// jshint validthis : true
			var vm = this;
			
			vm.qualityDataCategoryArr = qualityDataCategoryArr;

			vm.setQualityDataCategory = setQualityDataCategory;
			vm.setTag = setTag;

			active();

			function active(){
				init();
			}

			/**
			 * 初始化分类和tag
			 */
			function init(){
				vm.selecteQualitydDataCategory = "";		//默认的是天猫数据被选中			
				vm.selectedTag = "";			//默认没有tag被选中
			}

			/**
			 * 设置选中的数据分类
			 * @param {number} [category] 数据分类对应的编号
			 */			
			function setQualityDataCategory(category){
				vm.setQualityDataCategory = category;		//设置选中的数据分类
				vm.selectedTag = "";
			}


			/**
			 * 设置选中的tag
			 * @param {String} tag 标签名
			 */
			function setTag(tag){
				vm.selectedTag = tag;
			}
		}
})();
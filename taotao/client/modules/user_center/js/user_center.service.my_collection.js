;(function(){
	'use strict';

	angular
		.module('Datatao.userCenter')
		.factory('MyCollectionFactory',MyCollectionFactory);

		MyCollectionFactory.$inject = ['$http'];

		function MyCollectionFactory($http){
			return{ 
				getMyCollectionList : getMyCollectionList,
				removeCollection	: removeCollection
			};

			//获取我的收藏列表
			function getMyCollectionList(params){
				return $http.get('/v3/api/user/favorite',{
					params:params
				})
				.then(function(response){
					return response.data;
				});
			}

			//移除一条收藏
			function removeCollection(params){
				return $http.post('/v3/api/user/favorite', params )
				.then(function(response){
					return response.data;
				});
			}
		}
})();
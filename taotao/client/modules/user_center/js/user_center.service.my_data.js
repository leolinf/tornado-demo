;(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .factory( 'MyDataFactory', MyDataFactory );

    MyDataFactory.$inject = [ '$http' ];

    function MyDataFactory( $http ){
        return {
            saveData        : saveData,
            getMyDataList   : getMyDataList,
        };

        /**
         * 保存数据
         * @param {Object} params           - 保存数据的参数对象
         * @param {string} attachment       - 要发布的数据带有的附件的地址
         * @param {number} category         - 要发布的数据所属的一级分类
         * //@param {number} secondCategory   - 要发布的数据所属的二级分类
         * //@param {number} thirdCategory    - 要发布的数据所属的三级分类
         * @param {string} contact          - 要发布数据人的联系方式
         * @param {string} cost             - 要发布的数据的标价
         * @param {string} dataId           - 要发布的数据的id（初次发布不需要）
         * @param {number} dataRows         - 要发布的数据包含的条目数
         * @param {number} dataSize         - 要发布的数据的大小，以Byte为单位进行换算
         * @param {number} dataFormat       - 要发布的数据的格式
         * @param {string} interface        - 要发布的数据的接口信息（富文本）
         * @param {string} intro            - 要发布的数据的简介
         * @param {number} isSample         - 要发布的数据的附件是否为样本数据
         * @param {string} linkman          - 要发布的数据的联系人
         * @param {number} priceType        - 要发布的数据的结算方式
         * @param {string} sample           - 要发布的数据的样例（富文本）
         * @param {string[]} tags           - 要发布的数据包含的标签
         * @param {string} title            - 要发布的数据的标题
         */
        function saveData( params ){
            return $http.post( '/v3/api/user/data', params )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 获取我的数据列表
         * @param {Object} params       - 获取我的数据列表参数对象
         * @param {number} count        - 获取的列表每页数量
         * @param {number} reviewStatus - 审核状态
         * @param {number} start        - 获取的列表的起始位置
         */
        function getMyDataList( params ){
            return $http.get( '/v3/api/user/data',{
                params : params
            })
            .then( function( response ){
                return response.data;
            });
        }

    }
})();

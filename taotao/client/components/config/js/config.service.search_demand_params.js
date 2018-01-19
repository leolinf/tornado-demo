;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .factory( 'SearchDemandParams', SearchDemandParams );

    SearchDemandParams.$inject = [ 'dataCategoryObj', 'demandOrderObj', 'defaults' ];

    function SearchDemandParams( dataCategoryObj, demandOrderObj, defaults ){
        var searchDemandParams = {
            start                   : defaults.pageStart,
            count                   : defaults.pageCount,
            page                    : defaults.curPage,
            content                 : "",
            selectedDemandCategory  : dataCategoryObj.all.value,
            selectedDemandOrder     : demandOrderObj.all.value,
        
            resetOrder              : resetOrder,
        };

        return searchDemandParams;

        /**
         * 重置排序条件
         */
        function resetOrder(){
            searchDemandParams.selectedDemandOrder = demandOrderObj.all.value;
        }
    }

})();

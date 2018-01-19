;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .factory( 'SearchParams', SearchParams );

    SearchParams.$inject = [ 'dataCategoryObj', 'dataFormatObj', 'priceTypeObj', 'hasAttachmentObj', 'dataOrderObj', 'defaults' ];

    function SearchParams( dataCategoryObj, dataFormatObj, priceTypeObj, hasAttachmentObj, dataOrderObj, defaults ){
        // -1 都表示全部，当值为-1的时候，根据约定，不允许出现在传递给后端接口的参数中
        var searchParams = {
            start                   : defaults.pageStart,
            count                   : defaults.pageCount,
            page                    : defaults.curPage,
            content                 : "",
            selectedDataCategory    : dataCategoryObj.all.value,
            selectedTag             : "",
            selectedDataFormat      : dataFormatObj.all.value,
            selectedPriceType       : priceTypeObj.all.value,
            selectedHasAttachment   : hasAttachmentObj.all.value,
            selectedDataOrder       : dataOrderObj.all.value,
            
            resetOrder              : resetOrder,
            resetFilter             : resetFilter,
        };

        return searchParams;

        /**
         * 重置排序条件
         */
        function resetOrder(){
            searchParams.start              = defaults.pageStart;
            searchParams.count              = defaults.pageCount;
            searchParams.page               = defaults.curPage;
            searchParams.selectedDataOrder  = dataOrderObj.all.value;
        }

        /**
         * 重置筛选条件（会递归的重置排序条件）
         */
        function resetFilter(){
            resetOrder();
            searchParams.selectedDataFormat     = dataFormatObj.all.value;
            searchParams.selectedPriceType      = priceTypeObj.all.value;
            searchParams.selectedHasAttachment = hasAttachmentObj.all.value;
        }
        
        /**
         * 重置分类条件（会递归的重置筛选和排序条件）
         */
        function resetCategory(){
            searchParams.selectedCategory = dataCategoryObj.all.value;
            searchParams.selectedTag    = "";
            resetFilter();
        }
    }

})();

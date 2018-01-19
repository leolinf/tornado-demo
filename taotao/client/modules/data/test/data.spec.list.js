describe( '数据列表筛选测试', function(){
    'use strict';
    
    var $httpBackend,
        $rootScope,
        $DataFactory,
        $controller,
        $errorCode,
        $defaults,
        $state,
        dataListCtrl,
        SearchParams,
        dataFormatObj,
        priceTypeObj,
        hasAttachmentObj,
        dataOrderObj,
        responseDataList;

    beforeEach( module( 'Datatao.data' ) );
    beforeEach( module( 'ui.router' ) );
    beforeEach( module( 'Datatao.config' ) );

    beforeEach( inject( function( _$rootScope_, _$httpBackend_, _DataFactory_, _$controller_, _SearchParams_, _errorCode_, _defaults_, _dataFormatObj_, _priceTypeObj_, _hasAttachmentObj_, _dataOrderObj_, _$state_ ){
        $rootScope          = _$rootScope_;
        $httpBackend        = _$httpBackend_;
        $DataFactory        = _DataFactory_;
        $controller         = _$controller_;
        $errorCode          = _errorCode_;
        $defaults           = _defaults_;
        $state              = _$state_;
        SearchParams        = _SearchParams_;
        dataFormatObj       = _dataFormatObj_;
        priceTypeObj        = _priceTypeObj_;
        dataOrderObj        = _dataOrderObj_;
        hasAttachmentObj   = _hasAttachmentObj_;

        var scope           = $rootScope.$new();

        //dataListCtrl        = $controller( 'dataListCtrl', {});
        dataListCtrl        = $controller( 'dataListCtrl', {
            $scope : scope
        });

        spyOn( $state, 'go' );

        /*
        jasmine.getJSONFixtures().fixturesPath = 'base/json_data';

        responseDataList = getJSONFixture( 'data_search.mock.json' );

        $httpBackend.whenGET( '/v3/api/data/search?count=' + $defaults.pageCount ).respond( responseDataList );
        */
    }) );

    describe( '数据列表项测试', function(){
        it( '已定义dataListCtrl控制器', function(){
            expect( dataListCtrl ).toBeDefined();
        });

        it( '已定义getList函数', function(){
            expect( $DataFactory.getList ).toBeDefined();
        });

        xit( '调用获取搜索列表数据接口返回相应的数据', function(){
            $httpBackend.expectGET( '/v3/api/data/search?count=' + $defaults.pageCount );

            var searchedData,
                pageCount   = $defaults.pageCount,
                promise     = $DataFactory.getList({count:pageCount});

            promise.then( function( response ){
                searchedData = response;
            });

            $httpBackend.flush();
            expect( searchedData.errorCode ).toEqual( $errorCode.SUCCESS );
            expect( searchedData.data.total ).toBeGreaterThan( 0 );
            expect( searchedData.data.dataList.length ).toBeGreaterThan( 0 );
        });
    });

    describe( '设置数据格式测试', function(){
        it( '默认选择数据格式全部', function(){
            expect( dataListCtrl.selectedDataFormat ).toEqual( dataFormatObj.all.value );
        });
    
        it( '已定义设置数据格式函数', function(){
            expect( dataListCtrl.setDataFormat ).toBeDefined();
        });

        xit( '设置数据格式函数可以切换当前选择的数据格式', function(){
            dataListCtrl.setDataFormat( -1 );
            expect( dataListCtrl.selectedDataFormat ).toEqual( dataFormatObj.all.value );
            dataListCtrl.setDataFormat( 0 )
            expect( dataListCtrl.selectedDataFormat ).toEqual( dataFormatObj.text.value );
            dataListCtrl.setDataFormat( 1 )
            expect( dataListCtrl.selectedDataFormat ).toEqual( dataFormatObj.audio.value );
            dataListCtrl.setDataFormat( 2 )
            expect( dataListCtrl.selectedDataFormat ).toEqual( dataFormatObj.video.value );
            dataListCtrl.setDataFormat( 3 )
            expect( dataListCtrl.selectedDataFormat ).toEqual( dataFormatObj.graphic.value );
            dataListCtrl.setDataFormat( 4 )
            expect( dataListCtrl.selectedDataFormat ).toEqual( dataFormatObj.api.value );
        });
    });

    describe( '设置标价方式测试', function(){
        it( '默认选择标价方式全部', function(){
            expect( dataListCtrl.selectedPriceType ).toEqual( priceTypeObj.all.value );
        });

        it( '已定义设置标价方式函数', function(){
            expect( dataListCtrl.setPriceType ).toBeDefined();
        });

        xit( '设置标价方式函数可以切换当前选择的标价方式', function(){
            dataListCtrl.setPriceType( -1 );
            expect( dataListCtrl.selectedPriceType ).toEqual( priceTypeObj.all.value );
            dataListCtrl.setPriceType( 0 );
            expect( dataListCtrl.selectedPriceType ).toEqual( priceTypeObj.charge.value );
            dataListCtrl.setPriceType( 1 );
            expect( dataListCtrl.selectedPriceType ).toEqual( priceTypeObj.free.value );
            dataListCtrl.setPriceType( 2 );
            expect( dataListCtrl.selectedPriceType ).toEqual( priceTypeObj.discuss.value );
        });
    });

    describe( '设置下载属性测试', function(){
        it( '默认选择提供下载属性全部', function(){
            expect( dataListCtrl.selectedHasAttachment ).toEqual( hasAttachmentObj.all.value );
        });

        it( '已定义设置下载属性函数', function(){
            expect( dataListCtrl.setHasAttachment ).toBeDefined();
        });

        xit( '设置下载属性函数可以切换当前选择下载属性', function(){
            dataListCtrl.setHasAttachment( -1 );
            expect( dataListCtrl.selectedHasAttachment ).toEqual( hasAttachmentObj.all.value );
            dataListCtrl.setHasAttachment( 1 );
            expect( dataListCtrl.selectedHasAttachment ).toEqual( hasAttachmentObj.downloadAble.value );
            dataListCtrl.setHasAttachment( 2 );
            expect( dataListCtrl.selectedHasAttachment ).toEqual( hasAttachmentObj.notDownloadAble.value );
        });
    });

    describe( '设置数据排序方式测试', function(){
        it( '已定义设置数据排序方式函数', function(){
            expect( dataListCtrl.setDataOrder ).toBeDefined();
        });
        
        xit( '设置数据排序方式函数可以切换当前选择的数据排序方式', function(){
            dataListCtrl.setDataOrder( 1 );
            expect( dataListCtrl.selectedDataOrder ).toEqual( dataOrderObj.hot.value );
            dataListCtrl.setDataOrder( 2 );
            expect( dataListCtrl.selectedDataOrder ).toEqual( dataOrderObj.price.value );
            dataListCtrl.setDataOrder( 3 );
            expect( dataListCtrl.selectedDataOrder ).toEqual( dataOrderObj.time.value );
        });
    });
});

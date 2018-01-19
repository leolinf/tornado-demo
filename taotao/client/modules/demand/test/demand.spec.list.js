/**
 * 需求列表筛选测试
 */
describe( '数据列表筛选测试', function(){
    'use strict';
    
    var $httpBackend,
        $rootScope,
        $DemandFactory,
        $controller,
        $errorCode,
        $defaults,
        demandListCtrl,
        dataCategoryObj,
        demandOrderObj,
        responseDemandList;

    beforeEach( module( 'Datatao.demand' ) );
    beforeEach( module( 'ui.router' ) );
    beforeEach( module( 'Datatao.config' ) );

    beforeEach( inject( function( _$rootScope_, _$httpBackend_, _DemandFactory_, _$controller_, _errorCode_, _defaults_, _dataCategoryObj_, _demandOrderObj_ ){
        $rootScope          = _$rootScope_;
        $httpBackend        = _$httpBackend_;
        $DemandFactory      = _DemandFactory_;
        $controller         = _$controller_;
        $errorCode          = _errorCode_;
        $defaults           = _defaults_;
        dataCategoryObj     = _dataCategoryObj_;
        demandOrderObj      = _demandOrderObj_;

        var scope           = $rootScope.$new();
        
        demandListCtrl      = $controller( 'demandListCtrl', {
            $scope : scope
        });
    
        jasmine.getJSONFixtures().fixturesPath = 'base/json_data';

        responseDemandList = getJSONFixture( 'demand_list.mock.json' );

        $httpBackend.whenGET( '/v3/api/demand?count=' + $defaults.pageCount ).respond( responseDemandList );
    }) );

    describe( '需求列表项测试', function(){
        it( '已定义demandListCtrl控制器', function(){
            expect( demandListCtrl ).toBeDefined();
        });
    
        it( '已定义getList函数', function(){
            expect( $DemandFactory.getList ).toBeDefined();
        });
    
        xit( '能够获取数据', function(){
            $httpBackend.expectGET( '/v3/api/demand?count=' + $defaults.pageCount );

            var demandData,
                pageCount   = $defaults.pageCount,
                promise     = $DemandFactory.getList({count:pageCount});

            promise.then( function( response ){
                demandData = response;
            });

            $httpBackend.flush();

            expect( demandData.errorCode ).toEqual( $errorCode.SUCCESS );
            expect( demandData.data.total ).toBeGreaterThan( 0 );
            expect( demandData.data.demandList.length ).toBeGreaterThan( 0 );
        });
    });

    describe( '需求分类筛选测试', function(){
        xit( '默认分类应该为全部', function(){
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.all.value );
        });
    
        xit( '应该可以设置数据分类', function(){
            demandListCtrl.setDataCategory( -1 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.all.value );
            demandListCtrl.setDataCategory( 1 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.socialNetwork.value );
            demandListCtrl.setDataCategory( 2 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.eCommerce.value );
            demandListCtrl.setDataCategory( 3 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.enterpriseInfo.value );
            demandListCtrl.setDataCategory( 4 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.financialData.value );
            demandListCtrl.setDataCategory( 5 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.tourist.value );
            demandListCtrl.setDataCategory( 6 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.lifeService.value );
            demandListCtrl.setDataCategory( 7 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.research.value );
            demandListCtrl.setDataCategory( 8 );
            expect( demandListCtrl.selectedDataCategory ).toEqual( dataCategoryObj.others.value );
        });
    });

    describe( '需求排序筛选测试', function(){
        it( '默认排序规则应该为全部', function(){
            expect( demandListCtrl.selectedDemandOrder ).toEqual( demandOrderObj.all.value );
        });

        xit( '应该可以设置需求排序规则', function(){
            demandListCtrl.setDemandOrder( -1 );
            expect( demandListCtrl.selectedDemandOrder ).toEqual( demandOrderObj.all.value );
            demandListCtrl.setDemandOrder( 2 );
            expect( demandListCtrl.selectedDemandOrder ).toEqual( demandOrderObj.price.value );
            demandListCtrl.setDemandOrder( 3 );
            expect( demandListCtrl.selectedDemandOrder ).toEqual( demandOrderObj.time.value );
        });
    });

});

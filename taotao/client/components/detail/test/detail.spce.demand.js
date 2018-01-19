describe( '需求详情测试', function(){
    'use strict';

    var $httpBackend,
        $DetailFactory,
        $controller,
        $errorCode,
        $defaults,
        $stateParams,
        demandDetailCtrl,
        responseDemandDetail;

    beforeEach( module( 'Datatao.detail' ) );
    beforeEach( module( 'ui.bootstrap' ) );
    beforeEach( module( 'ui.router' ) );
    beforeEach( module( 'Datatao.config' ) );

    beforeEach( inject( function( _$httpBackend_, _DetailFactory_, _$controller_, _errorCode_, _defaults_ ){
        $httpBackend    = _$httpBackend_;
        $DetailFactory  = _DetailFactory_;
        $controller     = _$controller_;
        $errorCode      = _errorCode_;
        $defaults       = _defaults_;

        $stateParams = {};

        demandDetailCtrl = $controller( 'demandDetailCtrl', {
            $stateParams    : $stateParams
        });

        /*
        jasmine.getJSONFixtures().fixturesPath = 'base/json_data';

        responseDemandDetail  = getJSONFixture( 'demand_detail.mock.json' );

        $httpBackend.whenGET( '/json_data/demand_detail.mock.json' ).respond( responseDemandDetail );
        */

    }) );

    describe( '数据详情接口测试', function(){
        it( '已定义getDemandDetail函数', function(){
            expect( $DetailFactory.getDemandDetail ).toBeDefined();
        });
        
        xit( '给定id可以获取对应的需求详情', function(){
            $httpBackend.expectGET( '/json_data/demand_detail.mock.json' );
                  
            var detailDemand,
                demandId  = '111111111111111111111111',
                promise = $DetailFactory.getDemandDetail({demandId : demandId });
            
            promise.then( function( response ){
                detailDemand = response;
            });
             
            $httpBackend.flush();
             
            expect( detailDemand.errorCode ).toEqual( $errorCode.SUCCESS );
            /*
            expect( demandData.data.attachment ).toBeDefined();
            expect( demandData.data.attachmentDown ).toBeDefined();
            expect( demandData.data.comeFrom ).toBeDefined();
            expect( demandData.data.cost ).toBeDefined();
            expect( demandData.data.dataSize ).toBeDefined();
            expect( demandData.data.hits ).toBeDefined();
            expect( demandData.data.intro ).toBeDefined();
            expect( demandData.data.isFavored ).toBeDefined();
            expect( demandData.data.releaseTime ).toBeDefined();
            expect( demandData.data.title ).toBeDefined();
            */
        });
    });
});

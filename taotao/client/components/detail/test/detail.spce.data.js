describe( '数据详情测试', function(){
    'use strict';

    var $httpBackend,
        $DetailFactory,
        $controller,
        $errorCode,
        $defaults,
        $stateParams,
        $uibModal,
        dataDetailCtrl,
        responseDataDetail;

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

        dataDetailCtrl = $controller( 'dataDetailCtrl', {
            $stateParams    : $stateParams,
            $uibModal       : $uibModal
        });

        /*
        jasmine.getJSONFixtures().fixturesPath = 'base/json_data';

        responseDataDetail  = getJSONFixture( 'data_detail.mock.json' );

        $httpBackend.whenGET( '/v3/api/data/' ).respond( responseDataDetail );
        */

    }) );

    describe( '数据详情接口测试', function(){
        it( '已定义getDataDetail函数', function(){
            expect( $DetailFactory.getDataDetail ).toBeDefined();
        });
        
        xit( '给定id可以获取对应的详情', function(){
            $httpBackend.expectGET( '/v3/api/data/' );
                  
            var detailData,
                dataId  = '111111111111111111111111',
                promise = $DetailFactory.getDataDetail({dataId : dataId });
            
            promise.then( function( response ){
                detailData = response;
            });
             
            $httpBackend.flush();
             
            expect( detailData.errorCode ).toEqual( $errorCode.SUCCESS );
            expect( detailData.data.attachment ).toBeDefined();
            expect( detailData.data.attachmentDown ).toBeDefined();
            expect( detailData.data.comeFrom ).toBeDefined();
            expect( detailData.data.cost ).toBeDefined();
            expect( detailData.data.dataSize ).toBeDefined();
            expect( detailData.data.hits ).toBeDefined();
            expect( detailData.data.intro ).toBeDefined();
            expect( detailData.data.isFavored ).toBeDefined();
            expect( detailData.data.releaseTime ).toBeDefined();
            expect( detailData.data.title ).toBeDefined();
        });
    });
});

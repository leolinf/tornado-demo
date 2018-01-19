describe( '用户发布数据和编辑数据测试', function(){
    'use strict';

    var $httpBackend,
        $rootScope,
        $controller,
        $errorCode,
        $defaults,
        $MyDataFactory,
        _,
        dataEditCtrl,
        releaseResult;

    beforeEach( module( 'Datatao.userCenter' ) );
    beforeEach( module( 'Datatao.detail' ) );
    beforeEach( module( 'underscore' ) );
    beforeEach( module( 'Datatao.config' ) );
    beforeEach( module( 'ui.router' ) );

    beforeEach( inject( function( ___, _$rootScope_, _$httpBackend_, _$controller_, _MyDataFactory_, _SearchParams_, _errorCode_, _defaults_, _dataFormatObj_, _priceTypeObj_, _hasAttachmentObj_, _dataOrderObj_ ){
        $rootScope          = _$rootScope_;
        $httpBackend        = _$httpBackend_;
        $controller         = _$controller_;
        $errorCode          = _errorCode_;
        $defaults           = _defaults_;
        $MyDataFactory      = _MyDataFactory_;
        _                   = ___;

        dataEditCtrl        = $controller( 'dataEditCtrl', {
        });

        jasmine.getJSONFixtures().fixturesPath = 'base/json_data/user_center';

        releaseResult = getJSONFixture( 'release_data_result.mock.json' );

        $httpBackend.whenGET( '/json_data/user_center/release_data_result.mock.json' ).respond( releaseResult );

    }));

    describe( '用户发布数据测试', function(){
        it( '发布数据控制器', function(){
            expect( dataEditCtrl ).toBeDefined();
        });

        it( '已定义提交数据函数', function(){
            expect( dataEditCtrl.saveData ).toBeDefined();
        });
    });
});

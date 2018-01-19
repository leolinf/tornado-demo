describe( '首页单元测试', function(){
    'use strict';

    var $httpBackend,
        $rootScope,
        $indexFactory,
        $controller,
        $errorCode,
        $defaults,
        indexCtrl,
        responseRank;

    beforeEach( module( 'Datatao.bootstrap' ) );
    beforeEach( module( 'Datatao.config' ) );

    beforeEach( inject( function( _$rootScope_, _$httpBackend_,  _IndexFactory_, _$controller_, _errorCode_, _defaults_ ){
        $rootScope      = _$rootScope_;
        $httpBackend    = _$httpBackend_;
        $indexFactory   = _IndexFactory_;
        $controller     = _$controller_;
        $errorCode      = _errorCode_;
        $defaults       = _defaults_;

        window._hmt = {
            push    : function(){}
        }
        
        jasmine.getJSONFixtures().fixturesPath = 'base/json_data';

        responseRank = getJSONFixture( 'index.mock.json' );

        $httpBackend.whenGET( '/v3/api/index?count=' + $defaults.rankCount ).respond( responseRank );

        indexCtrl = $controller( 'indexCtrl', {
            $scope : {
            }
        });
    }) );

    describe( '首页内容控制器测试', function(){
        it( '已定义首页接口数据获取服务', function(){
            expect( $indexFactory ).toBeDefined();
            expect( $indexFactory.getRank ).toBeDefined();
        });
        
        it( '已定义indexCtrl控制器', function(){
            expect( indexCtrl ).toBeDefined();
        });

        it( '已定义getRank函数', function(){
            expect( $indexFactory.getRank ).toBeDefined();
        });
        it( '调用获取数据接口返回相应数据', function(){
            $httpBackend.expectGET( '/v3/api/index?count=' + $defaults.rankCount );
            
            var returnData,
                rankCount = $defaults.rankCount,
                promise = $indexFactory.getRank({count:rankCount});

            promise.then( function( data ){
                returnData = data;
            });

            $httpBackend.flush();

            expect( returnData ).toEqual( responseRank );
            expect( returnData.errorCode ) .toEqual( $errorCode.SUCCESS );

            expect( returnData.data ).toBeDefined();

            expect( returnData.data.attachmentRank ).toBeDefined();
            expect( returnData.data.attachmentRank.length ).toEqual( rankCount );
            expect( returnData.data.attachmentRank[0].attachmentDown ).toBeDefined();
            expect( returnData.data.attachmentRank[0].id ).toBeDefined();
            expect( returnData.data.attachmentRank[0].title ).toBeDefined();
            
            expect( returnData.data.hotRank ).toBeDefined();
            expect( returnData.data.hotRank.length ).toEqual( rankCount );
            expect( returnData.data.hotRank[0].hits ).toBeDefined();
            expect( returnData.data.hotRank[0].id ).toBeDefined();
            expect( returnData.data.hotRank[0].title ).toBeDefined();
        });
        /*
        it( '调用获取数据接口返回成功', function(){
            //$httpBackend.expectGET( '/v3/api/index' ).respond( 200 );
            IndexFactory.getRank();
        });
        */
    });

});

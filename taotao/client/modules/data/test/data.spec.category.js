describe( '数据分类测试', function(){
    'use strict';

    var $httpBackend,
        $DataFactory,
        $controller,
        $errorCode,
        $defaults,
        dataCategoryCtrl;

    //beforeEach( module( 'Datatao.data' ) );
    beforeEach( module( 'Datatao.data' ) );
    //beforeEach( module( 'Datatao.config' ) );
    beforeEach( module( 'Datatao.config' ) );

    beforeEach( inject( function( _$httpBackend_, _DataFactory_, _$controller_, _errorCode_, _defaults_ ){
        $httpBackend    = _$httpBackend_;
        $DataFactory    = _DataFactory_;
        $controller     = _$controller_;
        $errorCode      = _errorCode_;
        $defaults       = _defaults_;

        dataCategoryCtrl = $controller( 'dataCategoryCtrl', {});

        /*
        jasmine.getJSONFixtures().fixturesPath = 'base/json_data';

        responseRankHot         = getJSONFixture( 'data_rank_hot.mock.json' );
        responseRankDownload    = getJSONFixture( 'data_rank_download.mock.json' );

        $httpBackend.whenGET( '/json_data/data_rank_hot.mock.json?count=' + $defaults.rankCount + '&start=' + $defaults.pageStart ).respond( responseRankHot );
        $httpBackend.whenGET( '/json_data/data_rank_download.mock.json?count=' +$defaults.rankCount + '&start=' + $defaults.pageStart ).respond( responseRankDownload );
        */
    }) );

    describe( '分类数据测试', function(){
        xit( '已定义getHotRank函数', function(){
            expect( $DataFactory.getCategoryDataCount ).toBeDefined();
        });

        xit( '可以获取各个分类下数据总量', function(){
        });
            
        /*
        it( '获取各个分类数据量', function(){
            $httpBackend.expectGET( '/json_data/data_rank_hot.mock.json?count=' + $defaults.rankCount + '&start=' + $defaults.pageStart );
    
            var hotRankData,
                rankCount   = $defaults.rankCount,
                rankStart   = $defaults.pageStart,
                promise     = $DataFactory.getHotRank({ count : rankCount, start : rankStart});

            promise.then( function( response ){
                hotRankData = response;
            });

            $httpBackend.flush();
            expect( hotRankData.errorCode ).toEqual( $errorCode.SUCCESS );
            expect( hotRankData.data.total ).toBeGreaterThan( 0 );
            expect( hotRankData.data.dataList.length ).toBeGreaterThan( 0 );
        });
        */
    });

});

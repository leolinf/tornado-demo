describe( '数据排行榜测试', function(){
    'use strict';

    var $httpBackend,
        $DataFactory,
        $controller,
        $errorCode,
        $defaults,
        dataRankCtrl,
        responseRankHot,
        responseRankDownload;

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

        dataRankCtrl        = $controller( 'dataRankCtrl', {});

        jasmine.getJSONFixtures().fixturesPath = 'base/json_data';

        responseRankHot         = getJSONFixture( 'data_rank_hot.mock.json' );
        responseRankDownload    = getJSONFixture( 'data_rank_download.mock.json' );

        $httpBackend.whenGET( '/v3/api/data/hot?count=' + $defaults.rankCount + '&start=' + $defaults.pageStart ).respond( responseRankHot );
        $httpBackend.whenGET( '/v3/api/data/attachment?count=' +$defaults.rankCount + '&start=' + $defaults.pageStart ).respond( responseRankDownload );
    }) );

    describe( '热门数据排行榜测试', function(){
        it( '已定义getHotRank函数', function(){
            expect( $DataFactory.getHotRank ).toBeDefined();
        });
            
        it( '获取热门数据排行榜数据列表', function(){
            $httpBackend.expectGET( '/v3/api/data/hot?count=' + $defaults.rankCount + '&start=' + $defaults.pageStart );
    
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
    });

    describe( '最新下载排行榜测试', function(){
        it( '已定义getDownloadRank函数', function(){
            expect( $DataFactory.getDownloadRank ).toBeDefined();
        });
    
        it( '获取最新下载排行榜数据列表', function(){
            $httpBackend.expectGET( '/v3/api/data/attachment?count=' + $defaults.rankCount + '&start=' + $defaults.pageStart );
    
            var downloadRankData,
                rankCount   = $defaults.rankCount,
                rankStart   = $defaults.pageStart,
                promise     = $DataFactory.getDownloadRank({ count : rankCount, start : rankStart});

            promise.then( function( response ){
                downloadRankData = response;
            });

            $httpBackend.flush();
            expect( downloadRankData.errorCode ).toEqual( $errorCode.SUCCESS );
            expect( downloadRankData.data.total ).toBeGreaterThan( 0 );
            expect( downloadRankData.data.dataList.length ).toBeGreaterThan( 0 );
        });
    });

});

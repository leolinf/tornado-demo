describe( '登录单元测试', function(){
    'use strict';

    var $httpBackend,
        $controller,
        $errorCode,
        $SigninFactory,
        $localStorageService,
        signinCtrl,
        responseTokenData;
    
    beforeEach( module( 'LocalStorageModule' ) );
    beforeEach( module( 'Datatao.signin' ) );
    beforeEach( module( 'underscore' ) );
    beforeEach( module( 'Datatao.config' ) );

    beforeEach( inject( function( _$httpBackend_, _SigninFactory_, _localStorageService_, _$controller_, _errorCode_ ){
        $httpBackend            = _$httpBackend_;
        $SigninFactory          = _SigninFactory_;
        $localStorageService    = _localStorageService_;
        $controller             = _$controller_;
        $errorCode              = _errorCode_;

        signinCtrl = $controller( 'signinCtrl', {
        });

        jasmine.getJSONFixtures().fixturesPath = 'base/json_data';

        responseTokenData = getJSONFixture( 'signin.mock.json' );

        $httpBackend.whenPOST( '/v3/api/token', { username : 'wanglei', password : '123456' } ).respond( responseTokenData );
    }));

    describe( '登录接口测试', function(){
        it( '已定义登录函数getToken', function(){
            expect( $SigninFactory.getToken ).toBeDefined();
        });
    
        it( '应该使用给定的用户名密码可以成功登录', function(){
            $httpBackend.expectPOST( '/v3/api/token', { username : 'wanglei', password : '123456' } );

            var tokenData,
                username    = 'wanglei',
                password    = '123456',
                promise     = $SigninFactory.getToken({ username : username, password : password } );

            promise.then( function( response ){
                tokenData = response;
            });

            $httpBackend.flush();

            expect( tokenData.errorCode ).toEqual( $errorCode.SUCCESS );
            expect( tokenData.data.token ).toBeDefined();
        });
    });
});

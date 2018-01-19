describe( '注册测试', function(){

    var $controller,
        $AccountFactory,
        $errorCode,
        signupCtrl;

    beforeEach( module( 'Datatao.config' ) );
    beforeEach( module( 'Datatao.account' ) );
    beforeEach( module( 'ui.router' ) );
    beforeEach( module( 'ui.bootstrap' ) );

    beforeEach( inject( function( _$controller_, _AccountFactory_, _errorCode_ ){
        $controller     = _$controller_;
        $AccountFactory = _AccountFactory_;
        $errorCode      = _errorCode_;

        window._hmt = {
            push    : function(){}
        }
        
        signupCtrl = $controller( 'signupCtrl',{
        });
    }));

    it( '已定义注册控制器', function(){
        expect( signupCtrl ).toBeDefined();
    });

    it( '已定义注册函数', function(){
        expect( signupCtrl.signup ).toBeDefined();
    });

    it( '已定义注册函数服务', function(){
        expect( $AccountFactory ).toBeDefined();
        expect( $AccountFactory.signup ).toBeDefined();
    });

});

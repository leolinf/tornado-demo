describe( '验证器测试', function(){

    var $controller,
        $AccountValidatorFactory,
        $errorCode,
        signupCtrl;

    beforeEach( module( 'Datatao.config' ) );
    beforeEach( module( 'Datatao.account' ) );

    beforeEach( inject( function( _$controller_, _AccountValidatorFactory_, _errorCode_ ){
        $controller                 = _$controller_;
        $AccountValidatorFactory    = _AccountValidatorFactory_;
        $errorCode                  = _errorCode_;
        
    }));

    it( '已定义验证器服务', function(){
        expect( $AccountValidatorFactory ).toBeDefined();
    });

    describe( '用户名验证函数测试', function(){
        it( '已定义用户名验证函数', function(){
            expect( $AccountValidatorFactory.validateUsername).toBeDefined();
        });

        it( '用户名为空，应该不能通过验证', function(){
            var username = "";
            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( false );
        });

        it( '用户名不是有效的手机号码和邮箱，应该不能通过验证', function(){

            var username = '11111111111';

            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( false );

            username    = 'abcdedgag';
            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( false );

            username    = 'abcdedgag@gmail';
            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( false );
        });

        it( '用户名是有效的手机号，应该能通过验证', function(){
            var username = '13413567623';

            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( true );
        });

        it( '用户名是有效的邮箱，应该能通过验证', function(){
            var username = 'test@wolongdata.com';

            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( true );

            username = '1427904968@qq.com';
            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( true );

            username = 'automobile@163.com';
            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( true );

            username = 'automobile@126.com';
            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( true );

            username = 'automobile@gmail.com';
            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( true );

            username = 'automobile@hotmail.com';
            expect( $AccountValidatorFactory.validateUsername( username ) ).toEqual( true );
        });
    });

    describe( '密码验证函数测试', function(){
        it( '已定义密码验证函数', function(){
            expect( $AccountValidatorFactory.validatePassword ).toBeDefined();
        });
    });

    describe( '确认密码验证函数测试', function(){
        it( '已定义确认密码验证函数', function(){
            expect( $AccountValidatorFactory.validatePasswordConfirm ).toBeDefined();
        });
    });

    describe( '验证码验证函数测试', function(){
        it( '已定义验证码验证函数', function(){
            expect( $AccountValidatorFactory.validateVerifyCode ).toBeDefined();
        });
    });

});

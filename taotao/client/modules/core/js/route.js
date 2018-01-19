;(function(){
    'use strict';

    angular
        .module( 'Datatao' )
        .config( config )
        .run( [ '$rootScope', '$state', '$stateParams', 'localStorageService', 'SearchParams', function( $rootScope, $state, $stateParams, localStorageService, SearchParams ){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on( '$stateChangeSuccess', function( event, toState, toParams, fromState, fromParams ){
                $rootScope.prevState        = fromState;
                $rootScope.prevStateParams  = fromParams;

                setLoginFlag();

                if( $state.includes( 'userCenter' ) && !$rootScope.isLogin ){
                    $state.go( 'signIn' );
                }

                if( !$state.is( 'dataList' ) && !$state.is( 'dataDetail' ) ){
                    SearchParams.content = "";
                }
            });

            /**
             * 设置正确的登录状态
             */
            function setLoginFlag(){
                var token   = localStorageService.get( 'token' ),
                    user    = localStorageService.get( 'user' );
                if( token && user && user.exp*1000 > new Date().getTime() ){
                    $rootScope.isLogin = true;
                }else{
                    $rootScope.isLogin = false;
                }
            }
        }]) ;

    config.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'ngRapProvider' ];
    //injectToken.$inject = [ '$q', '$location', '$localStorage' ];
    injectToken.$inject = [ '$q', '$location', 'localStorageService' ];

    function config($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, ngRapProvider ){
        /*
        ngRapProvider.script = 'http://cn.rapapi.net/rap.plugin.js?projectId=1619';      // replce nnn with your project id
        ngRapProvider.enable({
            mode: 2
        });
        $httpProvider.interceptors.push( 'rapMockInterceptor' );
        */

        $stateProvider
            // 首页
            .state('home', {
                /*
                resolve : {
                    indexData : [ 'IndexFactory', function( IndexFactory ){
                        return IndexFactory.getRank({count:10});
                    }]
                },
                */
                url             : '/',
                templateUrl     : '/modules/bootstrap/index.tpl.html',
                controller      : 'indexCtrl',
                controllerAs    : 'vm'
            })                    
             //登录
            .state('signIn',{
                url             : '/signin',
                templateUrl     : '/components/signin/index.tpl.html',
                controller      : 'signinCtrl',
                controllerAs    : 'vm'
            })
            //注册
            .state('signup',{
                url             : '/signup',
                templateUrl     : '/modules/account/signup.tpl.html',
                controller      : 'signupCtrl',
                controllerAs    : 'vm'
            })
            //忘记密码
            .state('forgerPassword',{
                url             : '/forgetpassword',
                templateUrl     : '/modules/account/forget_password.tpl.html',
                controller      : 'forgetPasswordCtrl',
                controllerAs    : 'vm'
            })
            //用户协议
            .state('userAgreement',{
                url             : '/useragreement',
                templateUrl     : '/modules/account/user_agreement.tpl.html',
                // controller   : 'userAgreementCtrl',
                // controllerAs : 'vm'
            })
            // 数据列表
            .state( 'dataList', {
                url             : '/search/list?category&comeFrom&content&dataFormat&priceType&hasAttachment&order&count&page',
                templateUrl     : '/modules/data/list.tpl.html',
            })
            .state( 'dataDetail', {
                url             : '/search/detail/:id?isFromMyData',
                templateUrl     : '/components/detail/detail_data.tpl.html',
                controller      : 'dataDetailCtrl',
                controllerAs    : 'vm'
            })
            // 需求列表
            .state('demandList', {
                url: '/demand/list?category&order&count&page',
                templateUrl: 'modules/demand/list.tpl.html',
                controller:'demandListCtrl',
                controllerAs:'vm'
            })
            // 需求详情
            .state('demandDetail', {
                url: '/demand/detail/:id?isFromMyDemand',
                templateUrl: '/components/detail/detail_demand.tpl.html',
                controller:'demandDetailCtrl',
                controllerAs:'vm'
            })
             // 普通用户个人中心
            // 这个HTML里面有ui-view 做嵌套视图
            .state('userCenter', {
                url: '/user_center',
                templateUrl: '/modules/user_center/user_sidebar.tpl.html',
                //controller: 'userCenterCtrl',
                //controllerAs:'vm'
            })
            // 账号设置
            .state('userCenter.account_set', {
                url: '/account_set',
                templateUrl: '/modules/user_center/account_set.tpl.html',
                controller:'accountSetCtrl',
                controllerAs:'vm'
            })
            // 修改密码
            .state('userCenter.change_password', {
                url: '/change_password',
                templateUrl: '/modules/user_center/change_password.tpl.html',
                controller:'changePasswordCtrl',
                controllerAs:'vm'
            })
            // 我的下载
            .state('userCenter.my_download', {
                url: '/my_download?category&count&page',
                templateUrl: '/modules/user_center/my_download.tpl.html',
                controller:'myDownloadCtrl',
                controllerAs:'vm'
            })
            // 我的收藏
            .state('userCenter.my_collection', {
                url: '/my_collection?count&page',
                templateUrl: '/modules/user_center/my_collection.tpl.html',
                controller:'myCollectionCtrl',
                controllerAs:'vm'
            })
            // 我的数据
            .state('userCenter.my_data', {
                url: '/my_data?count&page&reviewStatus',
                templateUrl: '/modules/user_center/my_data.tpl.html',
                controller:'myDataListCtrl',
                controllerAs:'vm'
            })
            // 编辑数据
            .state('userCenter.edit_data', {
                url: '/edit_data?dataId',
                templateUrl: '/modules/user_center/edit_data.tpl.html',
                controller:'dataEditCtrl',
                controllerAs:'vm'
            })
            // 我的定制
            .state('userCenter.my_demand', {
                url: '/my_demand?count&page&reviewStatus',
                templateUrl: '/modules/user_center/my_demand.tpl.html',
                controller:'myDemandListCtrl',
                controllerAs:'vm'
            })
            // 消息
            .state('userCenter.message', {
                url: '/message',
                templateUrl: '/modules/user_center/message.tpl.html',
                controller:'messageCtrl',
                controllerAs:'vm'
            })
            // 消息详情
            .state('message_detail', {
                url: '/account/message_detail',
                templateUrl: '/modules/user_center/message_detail.tpl.html',
                //controller:'accountSetCtrl',
                //controllerAs:'vm'
            })
            // 意见反馈
            .state('userCenter.feedback', {
                url: '/feedback',
                templateUrl: '/modules/user_center/feedback.tpl.html',
                controller:'feedbackCtrl',
                controllerAs:'vm'
            })
            // 编辑定制
            .state('userCenter.edit_demand', {
                url: '/edit_demand?demandId',
                templateUrl: '/modules/user_center/edit_demand.tpl.html',
                controller:'demandEditCtrl',
                controllerAs:'vm'
            })
            //关于我们
            .state('aboutUs',{
                url:'/about_us',
                templateUrl:'/modules/others/about_us.tpl.html',
                controller: 'aboutusCtrl',
                controllerAs: 'vm'
            })
            // //帮助中心
            .state('helpCenter',{
                url:'/help_center/:step',
                templateUrl:'/modules/others/help_center.tpl.html',
                controller: 'helpCenterCtrl',
                controllerAs: 'vm'
            })
            //精品数据总和
            .state( 'qualityData', {
                url : '/quality_data?category&count&page',
                templateUrl : 'modules/quality_data/quality_data.tpl.html',
                controller : 'qualityDataCtrl',
                controllerAs : 'vm'
            })

            //精品数据-天猫数据
            .state( 'qualityDataTianmao', {
                url : '/qualityData/tianmao',
                templateUrl : 'modules/quality_data/quality_data_tianmao.tpl.html',
                controller : 'qualityDataTianmaoCtrl',
                controllerAs : 'vm'
            })
            //精品数据-企业数据
            .state( 'qualityDataEnterprise', {
                url : '/qualityData/enterprise',
                templateUrl : 'modules/quality_data/quality_data_enterprise.tpl.html',
                // controller : 'componentsExampleZsselectCtrl',
                // controllerAs : 'vm'
            })
            //精品数据-博客数据
            .state( 'qualityDataMicroblog', {
                url : '/qualityData/microblog',
                templateUrl : 'modules/quality_data/quality_data_microblog.tpl.html',
                // controller : 'componentsExampleZsselectCtrl',
                // controllerAs : 'vm'
            })
            //精品数据-本地数据
            .state( 'qualityDataLocal', {
                url : '/qualityData/local',
                templateUrl : 'modules/quality_data/quality_data_local.tpl.html',
                // controller : 'componentsExampleZsselectCtrl',
                // controllerAs : 'vm'
            })
            //平台特色
            .state( 'platformFeature', {
                url : '/platformFeature',
                templateUrl : 'modules/platform_feature/platform_feature.html',
                controller : 'platformFeatureCtrl',
                controllerAs : 'vm'
            });
            /*
            // 组件测试
            .state( 'componentcommon', {
                url : '/components/index',
                templateUrl : '/modules/components_example/index.tpl.html',
            })
            .state( 'zsselect', {
                url : '/components/zsselect',
                templateUrl : 'modules/components_example/zsselect.tpl.html',
                controller : 'componentsExampleZsselectCtrl',
                controllerAs : 'vm'
            })
            .state( 'poplayer', {
                url : '/components/poplayer',
                templateUrl : 'modules/components_example/poplayer.tpl.html',
                controller : 'componentsExamplePoplayerCtrl',
                controllerAs : 'vm'
            })
            //测试日历
            .state( 'calendar', {
                url : '/components/calendar',
                templateUrl : 'modules/components_example/calendar.tpl.html',
                controller : 'componentsExampleCalendarCtrl',
                controllerAs : 'vm'
            })
            */

        $locationProvider.html5Mode( true );

        // 每一个请求都带上token
        $httpProvider.interceptors.push( injectToken );
    }

    function injectToken( $q, $location, localStorageService ){
        return {
            'request' : function( config ){
                config.headers = config.headers || {};

                var token = localStorageService.get( 'token' );

                if( token && token.trim() !== '' ){
                    config.headers.token = token;
                }

                return config;
            },
            'responseError' : function( response ){
                if( response.status === 401 || response.status === 403 ){
                    window.location = '';
                }
                return $q.reject( response );
            }
        };
    }
})();

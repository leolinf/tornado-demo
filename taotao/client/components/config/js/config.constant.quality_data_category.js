;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        //分类规则:1级分类从0-999,二级分类从1000-999999,三级分类从1000000开始
        .constant( 'qualityDataCategoryArr', [
            {
                'name' : '天猫数据',
                'value' : 2001,
                'icon'  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#shopping',
                'subCategory' : [{
                    'name' : '商品信息',
                    'value' : 2001000
                },{
                    'name' : '店铺商品',
                    'value' : 2001001
                },{
                    'name' : '商品评论',
                    'value' : 2001002
                },{
                    'name' : '商品销量',
                    'value' : 2001003
                },{
                    'name' : '店铺信息',
                    'value' : 2001004
                },{
                    'name' : '店铺销量',
                    'value' : 2001005
                },{
                    'name' : '品牌销量',
                    'value' : 2001006
                }]
            },
            { 
                'name' : '企业信息', 
                'value': 3,
                'icon'  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#briefcase',
                'subCategory' : [{
                    'name' : '企业证书',
                    'value' : 3000000
                },{
                    'name' : '法院公告',
                    'value' : 3000001
                },{
                    'name' : '著作权',
                    'value' : 3000002
                },{
                    'name' : '专利',
                    'value' : 3000003
                },{
                    'name' : '被执行人',
                    'value' : 3000004
                },{
                    'name' : '失信信息',
                    'value' : 3000005
                },{
                    'name' : '对外投资',
                    'value' : 3000006
                }]
            },{
                'name' : '微博数据',
                'value' : 1000,
                'icon'  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#weibo',
                'subCategory' : [{
                    'name' : '蓝V',
                    'value' : 1000000
                },{
                    'name' : '橙V',
                    'value' : 1000001
                },{
                    'name' : '个人认证',
                    'value' : 1000002
                },{
                    'name' : '企业认证',
                    'value' : 1000003
                },{
                    'name' : '自媒体认证',
                    'value' : 1000004
                }]
            },{
                'name' : '本地生活', 
                'value' : 6005,
                'icon'  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#building',
                'subCategory' : [
                    { 'name' : '美食', 'value' : 6005000},
                    { 'name' : '电影', 'value' : 6005001},
                    { 'name' : '休闲娱乐', 'value' : 6005002},
                    { 'name' : '酒店', 'value' : 6005003},
                    { 'name' : '丽人', 'value' : 6005004},
                    { 'name' : '运动健身', 'value' : 6005005},
                    { 'name' : '景点', 'value' : 6005006},
                    { 'name' : '亲子', 'value' : 6005007},
                    { 'name' : '结婚', 'value' : 6005008},
                    { 'name' : '购物', 'value' : 6005009},
                    { 'name' : '宠物', 'value' : 6005010},
                    { 'name' : '生活服务', 'value' : 6005011},
                    { 'name' : '教育培训', 'value' : 6005012},
                    { 'name' : '爱车', 'value' : 6005013},
                    { 'name' : '医疗健康', 'value' : 6005014},
                    { 'name' : '家装', 'value' : 6005015},
                ]
            }
        ])
        .constant( 'qualityDataCategoryReverseObj',{
            2001    : {
                'name' : '天猫',
                'icon'  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#shopping',
                'subCategory' : [{
                    'name' : '商品信息',
                    'value' : 2001000
                },{
                    'name' : '店铺商品',
                    'value' : 2001001
                },{
                    'name' : '商品评论',
                    'value' : 2001002
                },{
                    'name' : '商品销量',
                    'value' : 2001003
                },{
                    'name' : '店铺信息',
                    'value' : 2001004
                },{
                    'name' : '店铺销量',
                    'value' : 2001005
                },{
                    'name' : '品牌销量',
                    'value' : 2001006
                }]
            },
            3       : {
                'name' : '企业信息', 
                'icon'  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#briefcase',
                'subCategory' : [{
                    'name' : '企业证书',
                    'value' : 3000000
                },{
                    'name' : '法院公告',
                    'value' : 3000001
                },{
                    'name' : '著作权',
                    'value' : 3000002
                },{
                    'name' : '专利',
                    'value' : 3000003
                },{
                    'name' : '被执行人',
                    'value' : 3000004
                },{
                    'name' : '失信信息',
                    'value' : 3000005
                },{
                    'name' : '对外投资',
                    'value' : 3000006
                }]
            },
            1000    : {
                'name' : '微博',
                'icon'  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#weibo',
                'subCategory' : [{
                    'name' : '蓝V',
                    'value' : 1000000
                },{
                    'name' : '橙V',
                    'value' : 1000001
                },{
                    'name' : '个人认证',
                    'value' : 1000002
                },{
                    'name' : '企业认证',
                    'value' : 1000003
                },{
                    'name' : '自媒体认证',
                    'value' : 1000004
                }]
            },
            6005    : {
                'name' : '本地生活', 
                'icon'  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#building',
                'subCategory' : [
                    { 'name' : '美食', 'value' : 6005000},
                    { 'name' : '电影', 'value' : 6005001},
                    { 'name' : '休闲娱乐', 'value' : 6005002},
                    { 'name' : '酒店', 'value' : 6005003},
                    { 'name' : '丽人', 'value' : 6005004},
                    { 'name' : '运动健身', 'value' : 6005005},
                    { 'name' : '景点', 'value' : 6005006},
                    { 'name' : '亲子', 'value' : 6005007},
                    { 'name' : '结婚', 'value' : 6005008},
                    { 'name' : '购物', 'value' : 6005009},
                    { 'name' : '宠物', 'value' : 6005010},
                    { 'name' : '生活服务', 'value' : 6005011},
                    { 'name' : '教育培训', 'value' : 6005012},
                    { 'name' : '爱车', 'value' : 6005013},
                    { 'name' : '医疗健康', 'value' : 6005014},
                    { 'name' : '家装', 'value' : 6005015},
                ]
            } 
        })
        .constant( 'qualityDataCategoryObj',{
            tianmao:{
                value:2001,
                name:'天猫',
                icon  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#shopping',
            },
            enterprise:{
                value:3,
                name:'企业数据',
                icon  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#briefcase',
            },
            microblog:{
                value:1000,
                name:'微博',
                icon  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#weibo',
            },
            local:{
                value:6005,
                name:'本地生活',
                icon  : '/assets/icon_svgs/symbol/svg/sprite.symbol.svg#building',
            }
        });

})();

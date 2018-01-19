;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        //分类规则:1级分类从0-999,二级分类从1000-999999,三级分类从1000000开始
        .constant( 'dataCategoryArr', [
            { 
                'name' : '社交网络',
                'value': 1,
                'subCategory' : [
                    {
                        'name' : '微博',
                        'value' : 1000,
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
                    {
                        'name' : '微信',
                        'value' : 1001
                    },
                ],
                'defaultTags' : [
                    '社交',
                    '用户',
                    '微信',
                    '微博',
                    '百度',
                    '问答',
                    '论坛',
                    '粉丝',
                    '评论',
                    '用户信息',
                    '微博内容',
                    '关注列表'
                ]
            },
            { 
                'name' : '电子商务', 
                'value': 2,
                'subCategory' : [
                    {
                        'name' : '淘宝',
                        'value' : 2000
                    },
                    {
                        'name' : '天猫',
                        'value' : 2001,
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
                    }
                ],
                'defaultTags' : [
                    '淘宝',
                    '天猫',
                    '京东',
                    '网站',
                    '大众点评',
                    '团购',
                    '店铺',
                    '品牌',
                    '商品',
                ]
            },
            { 
                'name' : '企业信息', 
                'value': 3,
                'subCategory' : [
                    {
                        'name' : '基本信息',
                        'value' : 3000,
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
                        'name' : '招聘信息',
                        'value' : 3001
                    },{
                        'name' : '税务数据',
                        'value' : 3002
                    },{
                        'name' : '企业关联数据',
                        'value' : 3003
                    }
                ],
                'defaultTags' : [
                    '企业',
                    '股东',
                    '诉讼',
                    '招聘信息',
                    '法人信息',
                    '楼盘信息',
                    '税务数据'
                ]
            },
            {
                'name' : '金融数据',
                'value' : 4,
                'subCategory' : [{
                    'name' : '产业数据',
                    'value' : 4000
                },{
                    'name' : '政府数据',
                    'value' : 4001
                }],
                'defaultTags' : [
                    '征信',
                    '工商',
                    '企业',
                    'P2P',
                    '股票',
                    '投资',
                    '理财',
                    '基金'
                ]
            },
            { 
                'name' : '旅游交通', 
                'value' :5,
                'subCategory' : [
                    {
                        'name' : '旅游',
                        'value' : 5000,
                        'subCategory' : [
                            { 'name' : '景点', 'value' : 5000000},
                            { 'name' : '机票', 'value' : 5000001},
                            { 'name' : '酒店', 'value' : 5000002},
                        ]
                    },
                    {
                        'name' : '交通',
                        'value' : 5001,
                        'subCategory' : [
                            { 'name' : 'POI', 'value' : 5001000},
                            { 'name' : '公交', 'value' : 5001001},
                            { 'name' : '地铁', 'value' : 5001002},
                            { 'name' : '火车', 'value' : 5001003},
                            { 'name' : '航班', 'value' : 5001004},
                        ]
                    }
                ],
                'defaultTags' : [
                    'POI',
                    '景点',
                    '门票',
                    '机票',
                    '出租车',
                    '地铁',
                    '火车',
                    '公交',
                    '违章',
                    '空气质量',
                    '城市',
                    '地点',
                    '地理信息',
                    '交通路线',
                    '查询'
                ]
            },
            { 
                'name' : '生活服务', 
                'value': 6,
                'subCategory' : [
                    {
                        'name' : '汽车',
                        'value' : 6000
                    },
                    {
                        'name' : '楼盘房产',
                        'value' : 6001
                    },
                    {
                        'name' : '医疗健康',
                        'value' : 6002
                    },
                    {
                        'name' : '新闻数据',
                        'value' : 6003
                    },
                    { 
                        'name' : '本地生活', 
                        'value' : 6005,
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
                ],
                'defaultTags' : [
                    '汽车',
                    '楼盘房产',
                    '医疗健康',
                    '新闻数据',
                    '美食',
                    '电影',
                    '休闲娱乐',
                    '酒店',
                    '丽人',
                    '运动健身',
                    '亲子',
                    '结婚',
                    '购物',
                    '宠物',
                    '生活服务',
                    '教育培训'
                ]
            },
            {
                'name' : '科研开发',
                'value' : 7,
                'defaultTags' : [
                    '统计年鉴',
                    '语音',
                    '图像',
                    '新闻语料',
                    '科研文献'
                ]
            },
            { 
                'name' : '其他', 
                'value' : 8,
                'subCategory' : [
                    { 'name' : '歌曲', 'value' : 8001},
                    { 'name' : '图书', 'value' : 8002},
                    { 'name' : '娱乐', 'value' : 8003},
                    { 'name' : '菜谱', 'value' : 8004},
                ],
                'defaultTags' : [
                    '歌曲',
                    '图书',
                    '娱乐',
                    '菜谱',
                    '电话号码'
                ]
            }
        ])
        .constant( 'dataCategoryObj', {
            all             : {
                value   : -1,
                name    : '全部'
            },
            socialNetwork   : {
                value   : 1,
                name    : '社交网络'
            },
            eCommerce       : {
                value   : 2,
                name    : '电子商务'
            },
            enterpriseInfo  : {
                value   : 3,
                name    : '企业信息'
            },
            financialData   : {
                value   : 4,
                name    : '金融数据'
            },
            tourist         : {
                value   : 5,
                name    : '旅游交通'
            },
            lifeService     : {
                value   : 6,
                name    : '生活服务'
            },
            research        : {
                value   : 7,
                name    : '科研开发'
            },
            others          : {
                value   : 8,
                name    : '其他'
            }
        })
        .constant( 'dataCategoryReverseObj', {
            1 : {
                'name'  : '社交网络',
                'defaultTags' : [
                    '社交',
                    '用户',
                    '微信',
                    '微博',
                    '百度',
                    '问答',
                    '论坛',
                    '粉丝',
                    '评论',
                    '用户信息',
                    '微博内容',
                    '关注列表'
                ]
            },
            2 : {
                'name'  : '电子商务', 
                'defaultTags' : [
                    '淘宝',
                    '天猫',
                    '京东',
                    '网站',
                    '大众点评',
                    '团购',
                    '店铺',
                    '品牌',
                    '商品',
                ]
            },
            3 : {
                'name'  : '企业信息', 
                'defaultTags' : [
                    '企业',
                    '股东',
                    '诉讼',
                    '招聘信息',
                    '法人信息',
                    '楼盘信息',
                    '税务数据'
                ]
            },
            4 : {
                'name'  : '金融数据',
                'defaultTags' : [
                    '征信',
                    '工商',
                    '企业',
                    'P2P',
                    '股票',
                    '投资',
                    '理财',
                    '基金'
                ]
            },
            5 : {
                'name'  : '旅游交通', 
                'defaultTags' : [
                    'POI',
                    '景点',
                    '门票',
                    '机票',
                    '出租车',
                    '地铁',
                    '火车',
                    '公交',
                    '违章',
                    '空气质量',
                    '城市',
                    '地点',
                    '地理信息',
                    '交通路线',
                    '查询'
                ]
            },
            6 : {
                'name'  : '生活服务', 
                'defaultTags' : [
                    '汽车',
                    '楼盘房产',
                    '医疗健康',
                    '新闻数据',
                    '美食',
                    '电影',
                    '休闲娱乐',
                    '酒店',
                    '丽人',
                    '运动健身',
                    '亲子',
                    '结婚',
                    '购物',
                    '宠物',
                    '生活服务',
                    '教育培训'
                ]
            },
            7 : {
                'name'  : '科研开发',
                'defaultTags' : [
                    '统计年鉴',
                    '语音',
                    '图像',
                    '新闻语料',
                    '科研文献'
                ]
            },
            8 : {
                'name'  : '其他', 
                'defaultTags' : [
                    '歌曲',
                    '图书',
                    '娱乐',
                    '菜谱',
                    '电话号码'
                ]
            }
        });

})();

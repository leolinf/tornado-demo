;(function(){
    'use strict';

    angular
        .module("ZS.tag")
        .directive("zsTag",zsTag);

    zsTag.$inject=['$rootScope'];

    function zsTag($rootScope){
        var directive={
            restrict:"EA",
            scope:{
                options:"=options",
                hastagsoptions:"=hastagsoptions",
                maxtaglen:"=?",
                tagwordlen:"=?"
            },
            templateUrl:"/components/zstag/index.tpl.html",
            link:link
        };

        return directive;

        function link(scope,element,attrs){

            if(typeof scope.options === 'undefined'){
                throw '必须初始化options数组或者options数组不能为空.';
            }

            if(typeof scope.hastagsoptions === 'undefined'){
                throw '必须传入已有选项的值,如果没有请传入空.';
            }

            if(scope.maxtaglen < scope.hastagsoptions.length){
                throw '最大tag长度必须大于等于现有的tag数量';
            }

            var tagobject={
                //tag对象入口
                init:function(){
                    var _this=this;
                },
                //取消选择当前tag函数
                cleantag:function(index){
                    //对选中tag的数组做删除操作
                    scope.hastagsoptions.splice(index,1);
                },
                //添加选项到已选择的数组里面
                setselectoptions:function (index){
                    //判断已选择tag的数组的长度是否小于最大长度
                    tagobject.judgeMax(tagobject.pushHasOptions,index);
                },
                //判断最大tag数量
                judgeMax:function (callback,data){
                    if(scope.maxtaglen){
                        //判断已选择项的长度是否小于最大长度
                        if(scope.hastagsoptions.length < scope.maxtaglen){
                            callback(data);
                        }
                    }else{
                        callback(data);
                    }
                },
                //把tag相关数据push到已选择项里面
                pushHasOptions:function (index){
                    //判断当前项是否在已选择tag的数组里面
                    if(tagobject.itemIsInarray(scope.options[index],scope.hastagsoptions)){
                        scope.hastagsoptions.push(scope.options[index]);
                    }
                },
                //检测一个item是否存在数组里面
                itemIsInarray:function (str,arr){
                    for(var i= 0,j=arr.length;i<j;i++){
                        if(str === arr[i]){
                            return false;
                        }
                    }
                    return true;
                },
                //监听input  keydown事件
                keydownfn:function (event){
                    //组装数据
                    var keycode=event.keyCode,
                        data    = scope.tagvalue;
                        /*
                        json={
                            name:scope.tagvalue,
                            value:Math.random()*10
                        };
                        */

                    //判断是否是空格或者回车
                    if(keycode === 32 || keycode === 13){
                        //tagobject.judgeMax(tagobject.pushoptions,json);
                        tagobject.judgeMax(tagobject.pushoptions,data);
                    }
                },
                pushoptions:function (json){
                    //判断是否重复
                    if(tagobject.itemIsInarray(scope.tagvalue,scope.hastagsoptions)){
                        //value的值必须为真才会进入下一步操作
                        if(scope.tagvalue){
                            //插入数据到已选择的数组中
                            scope.hastagsoptions.push(json);
                            scope.tagvalue="";
                        }
                    }

                }
            };

            tagobject.init();

            //取消选择当前tag函数
            scope.cleanTag=tagobject.cleantag;
            //默认的tag数组
            scope.setSelectOptions=tagobject.setselectoptions;
            //输入框按钮抬起事件
            scope.keydownFn=tagobject.keydownfn;
        }
    }
})();

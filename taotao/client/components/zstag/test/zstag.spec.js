/**
 * Created by hulgy on 16/3/28.
 */

describe('tag指令测试', function() {
    //加载tag指令模块
    beforeEach(module('ZS.tag'));
    beforeEach(module('ZS.catstring'));

    var element,scope;

    //beforeEach(module('views/index.tpl.html'));

    beforeEach(inject(function($rootScope,$compile){

        element=angular.element(
            '<div class="zs-tags-init">'
            +'<div class="zs-tags-main">'
            +'<div class="includetags" ng-if="!maxtaglen || maxtaglen>=hastagsoptions.length" ng-repeat="tag in hastagsoptions">{{tag.name | zsCatString:tagwordlen}}<a href="javascript:;" ng-click="cleanTag( $index )">x</a></div>'
            +'<input type="text" placeholder="请输入标签..." ng-model="tagvalue" ng-keydown="keydownFn( $event )">'
            +'</div>'
            +'<div class="zs-tags-list">'
            +'<div class="tagitems" ng-repeat="option in options" ng-click="setSelectOptions( $index )">{{option.name | zsCatString:tagwordlen}}</div>'
            +'</div>'
            +'</div>');

        scope=$rootScope;
        $compile(element)(scope);
        scope.$digest();
    }));

    //验证是否存在options初始数组
    it('应该存在options数组',function(){
        var opt=scope.options?true:false;
        expect(!opt).toBeTruthy();
    });

    it("options为空字符串不应该有数据",function(){
        scope.options="";
        scope.$digest();

        var eles=element.find(".tagitems");

        expect(eles.length).toBe(0);
    });

    it("options为字符串不应该有数据",function(){
        scope.options="string";
        var eles=element.find(".tagitems");

        expect(eles.length).toBe(0);
    });

    it('应该存在hastagoptions数组',function(){
        var hasopt=scope.hastagsoptions?true:false;

        expect(!hasopt).toBeTruthy();
    });

    it('hastagoptions为空字符串时不应该有数据',function(){
        scope.hastagsoptions='';

        var eles=element.find(".includetags");

        expect(eles.length).toBe(0);
    });

    it('hastagoptions为字符串时不应该有数据',function(){
        scope.hastagsoptions="string";

        var eles=element.find(".includetags");

        expect(eles.length).toBe(0);
    });
});

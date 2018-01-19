;(function(){
    angular
        .module("ZS.catstring",[])
        .filter("zsCatString",catstring);

    catstring.$inject=[];

    function catstring(){
        return function(string,index){
            var filterindex=index || 1000000;

            if(string && string.length>0){
                if(string.length>filterindex){
                    return string.substring(0,filterindex)+'...';
                }
            }

            return string;
        };
    }
})();

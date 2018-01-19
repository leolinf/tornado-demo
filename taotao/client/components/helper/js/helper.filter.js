;(function(){
    'use strict';

    angular
        .module( 'Datatao.helper' )
        .filter( 'setNumber', setNumber );

    setNumber.$inject = [ '$filter' ];

    function setNumber( $filter ){
        return function( input, place ){
            if( isNaN( input ) ) return input;
            if( typeof input === 'number' ){
                return input.toFixed( place );
            }else{
                if( input%1 === 0 ){
                    return input;
                }else{
                    return Number( input ).toFixed( place );
                }
            }
        };
    }

})();

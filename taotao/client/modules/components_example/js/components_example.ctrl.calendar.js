/*;(function(){
  'use strict';
  angular
    .module('ui.bootstrap.demo')
    .controller('componentsExampleCalendarCtrl',componentsExampleCalendarCtrl);

    componentsExampleCalendarCtrl.$inject = ['ngAnimate','$scope'];

    function componentsExampleCalendarCtrl(ngAnimate,$scope){
      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };
    
    
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
      $scope.popup1 = {
        opened: false  
      };
    
      $scope.popup2 = {
        opened: false
      };
    
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);
      $scope.events = [{
        date: tomorrow,
        status: 'full'
      }, {
        date: afterTomorrow,
        status: 'partially'
      }];
    }

})();*/










angular.module('Datatao.componentsExample' )
.controller('componentsExampleCalendarCtrl', componentsExampleCalendarCtrl );

componentsExampleCalendarCtrl.$inject = [ '$scope' ];

function componentsExampleCalendarCtrl($scope) {


  $scope.open2 = function() {
    $scope.popup2.opened = true;
    $scope.showButtonBar = false;
  };



  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [{
    date: tomorrow,
    status: 'full'
  }, {
    date: afterTomorrow,
    status: 'partially'
  }];

  $scope.dateOptions = {
    showWeeks : false    
  };

}









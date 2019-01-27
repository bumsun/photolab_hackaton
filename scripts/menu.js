
app.controller('menuController', function($scope, $http, $window, Data, $rootScope) {
//console.log("menuController laoded");
  $scope.createNewOrder = function(){
    $window.location.href = 'https://upmob.ru/neworder';
  };

if ($window.localStorage.getItem("email") == "zhenekvv@gmail.com" ||
$window.localStorage.getItem("email") == "bumsun@yandex.ru" ||
 $window.localStorage.getItem("email") == "beowolf@nm.ru" ||
 $window.localStorage.getItem("email") == "tsentro.bet@yandex.ru" ||
 $window.localStorage.getItem("email") == "slaver-om@mail.ru"
){
  $scope.historyStyle = {
    'visibility' : 'visible',
    'display' : 'block'
  }
} else {
  $scope.historyStyle = {
    'visibility' : 'collapse',
    'display' : 'none'
  }
}
// console.log("money_count_public changed = " + $scope.count_money_r);
//
// $scope.$watch('$window.localStorage.getItem("moneyCount")', function() {
//
//     $scope.balance = $window.localStorage.getItem("moneyCount");
//     console.log("$scope.balance changed = " + $scope.balance);
//   });

    $rootScope.$watch(function () { return $rootScope.count_money_r; }, function (newValue, oldValue) {
         $scope.balance = newValue;
      //  console.log("$scope.balance = " + $scope.balance);
    });
    //$scope.balance = $rootScope.count_money_r;
  //  $rootScope.count_money_r = $scope.count_money_r;


//   $http({
//     method: 'POST',
//     url: 'https://upmob.ru/api/getMyInfo',
//     data : {
//       'token' : $window.localStorage.getItem("token")
//     }
//   }).then(function successCallback(response) {
// if (response.data.response == 1) {
//     $scope.balance = response.data.customer.count_money_r;
// }
//
//   }, function errorCallback(response) {
//
//   });
});
app.directive('myMenu', function() {

    return {
      restrict : "E",
      templateUrl: 'menu.html',
      link : function(scope, element, attrs) {

      }
    }

});

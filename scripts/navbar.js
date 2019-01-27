
app.controller('navbarController', function($scope, $http, $window, Data, $rootScope) {

  $scope.first_name = $window.localStorage.getItem("first_name");
  $scope.email = $window.localStorage.getItem("email");

  $http({
    method: 'POST',
    url: 'https://upmob.ru/api/getMyInfo',
    data : {
      'token' : $window.localStorage.getItem("token")
    }
  }).then(function successCallback(response) {
    if (response.data.response == 1) {
  //  console.log("$scope.count_money_r loaded 1 = " + $scope.count_money_r);
    $scope.count_money_r = response.data.customer.count_money_r;
    $rootScope.count_money_r = $scope.count_money_r;
    //$rootScope.$apply();
    $scope.first_name = response.data.customer.first_name;
    $scope.email = response.data.customer.email;


    $window.localStorage.setItem("moneyCount", $scope.count_money_r);
    $window.localStorage.setItem("myId", response.data.customer._id);
    $window.localStorage.setItem("email", $scope.email);
    $window.localStorage.setItem("first_name", response.data.customer.first_name);
    Data.setMoneyCount($scope.count_money_r);
  //  console.log("$scope.count_money_r loaded = " + $scope.count_money_r);

  $rootScope.$watch(function () { return $rootScope.count_money_r; }, function (newValue, oldValue) {
       $scope.count_money_r = newValue;
    //  console.log("$scope.balance = " + $scope.balance);
  });

}
  }, function errorCallback(response) {

  });
  $scope.visibleStyleF = function() {
    $scope.visibleStyle  = {

      'width' : '50px',
       'height' : '50px',
       'display' : 'none'
    }
    $scope.invisibleStyle = {
      'width' : '50px',
       'height' : '50px',
       'display' : 'block'
    }
  }
  $scope.invisibleStyleF = function() {
    $scope.visibleStyle  = {
      'width' : '50px',
       'height' : '50px',
       'display' : 'block'


    }
    $scope.invisibleStyle = {
      'width' : '50px',
       'height' : '50px',
       'display' : 'none'
    }
  }

  $scope.logoutClicked = function(){
    $window.localStorage.clear();
    $window.location.href = 'https://upmob.ru/auth';
  };

});
app.directive('myNavbar', function() {

  return {
    restrict : "E",
    templateUrl: 'navbar.html',
    link : function(scope, element, attrs) {

    }
  }

});

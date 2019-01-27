
app.controller('myReferalController', function($scope, $http, $window, $mdDialog, payment, $location) {

  if ($window.localStorage.getItem("token") == undefined) {
    $window.location.href = 'https://upmob.ru/auth';
    return;
  }

  $scope.myId = $window.localStorage.getItem("myId");

  $scope.copyToClip = function() {
    
  }

  $http({
    method: 'POST',
    url: 'https://upmob.ru/api/getMyInfo',
    data : {
      'token' : $window.localStorage.getItem("token")
    }
  }).then(function successCallback(response) {
    console.log("response = " + response.data.response);
    if (response.data.response == 1) {
      var refs = response.data.customer.referal_earning_list_new;
      var finalRefs = [];
      if (refs.length > 0) {
        $scope.refsText = "Ниже показан отчет о прибыли с ваших друзей.";
        for (var i = 0; i < refs.length; i++) {

         refs[i].date = refs[i].modified.substring(0, 10);
        //  finalRefs.push(arr);

        }


      } else {
        $scope.refsText = "Ниже будет показан отчет о прибыли с ваших друзей, как только кто-нибудь из них сделает свой первый заказ.";
        $scope.refsListStyle = {
          'visibility' : 'collapse',
          'display' : 'none'
        }
      }
        $scope.referals = refs;

    }

  }, function errorCallback(response) {

  });

});

app.directive('myReferals', function() {

  return {
    restrict : "E",
    templateUrl: 'referalsTemplate.html',
    link : function(scope, element, attrs) {

    }
  }



});

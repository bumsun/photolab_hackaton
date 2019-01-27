
app.service('payment', function() {
  this.paymentType = "";


  this.setPaymentType = function(type) {
        this.paymentType = type;
  };

  this.getPaymentType = function() {
        return this.paymentType;
  };

});
app.controller('myShopController', function($scope, $http, $window, $mdDialog, payment) {

  if ($window.localStorage.getItem("token") == undefined) {
    $window.location.href = 'https://upmob.ru/auth';
    return;
  }

  $scope.buyYandex = function(){
      $window.localStorage.setItem("paymentType", "Яндекс.Деньги");
      $window.localStorage.setItem("moneyAbr", "PC");

      $window.location.href = 'https://upmob.ru/pay';

    };
    $scope.bankCard = function(){
        $window.localStorage.setItem("paymentType", "Банковская карта");
$window.localStorage.setItem("moneyAbr", "AC");
        $window.location.href = 'https://upmob.ru/pay';

      };
      $scope.beznal = function(){
          $window.localStorage.setItem("paymentType", "Безналичный расчет");
          $window.localStorage.setItem("moneyAbr", "PB");

          $window.location.href = 'https://upmob.ru/pay';

        };
        $scope.qiwi = function(){
            $window.localStorage.setItem("paymentType", "Qiwi кошелек");
            $window.localStorage.setItem("moneyAbr", "QW");

            $window.location.href = 'https://upmob.ru/pay';

          };
          $scope.coupons = function(){
              $window.localStorage.setItem("paymentType", "Купоны");
            //  $window.localStorage.setItem("moneyAbr", "QW");

              $window.location.href = 'https://upmob.ru/pay';

            };

});

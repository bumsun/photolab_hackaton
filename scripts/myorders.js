var fullOrders = undefined;
app.controller('myOrdersController', function($scope, $http, $window, $mdDialog, Data) {
  if ($window.localStorage.getItem("token") == undefined) {
    $window.location.href = 'https://upmob.ru/auth';
    return;
  }
  //$window.localStorage.setItem("moneyCount", "12143312");
  // $http({
  //   method: 'POST',
  //   url: 'https://upmob.ru/api/checkCustomerToken',
  //   data : {
  //     'token' : $window.localStorage.getItem("token"),
  //     'email' : $window.localStorage.getItem("email"),
  //     'first_name' : $window.localStorage.getItem("first_name"),
  //     'count_money_r' : $window.localStorage.getItem("moneyCount")
  //   }
  // }).then(function successCallback(response) {
  //   //console.log("response checkCustomerToken = " + response.data);
  //       if (response.data.response == -1) {
  //         $mdDialog.show({
  //           controller: changePassController,
  //           templateUrl: 'registerDialog.html',
  //           dataToPass:{"asd" : "asdasd"},
  //           focusOnOpen: false,
  //           clickOutsideToClose:false
  //         })
  //         .then(function(answer) {
  //           //console.log("OK");
  //         }, function() {
  //         //  console.log("Cancel");
  //         });
  //       }
  //
  // }, function errorCallback(response) {
  //
  // });

  var changePassController = function ($scope, dataToPass, $mdDialog, $window, $http) {

    $scope.changePass = function() {
    $mdDialog.hide();
      $http({
        method: 'POST',
        url: 'https://upmob.ru/api/recoveryRegisterCustomer',
        data : {
          'email' : $window.localStorage.getItem("email"),
          'first_name' : $window.localStorage.getItem("first_name"),
          'count_money_r' : $window.localStorage.getItem("moneyCount"),
          'pass_hash' : SHA256($scope.newPasswordET)
        }
      }).then(function successCallback(response) {

      //  console.log("response recoveryRegisterCustomer = " + response.data);
        if (response.data.response == 1) {

          var confirm = $mdDialog.confirm()
          .clickOutsideToClose(false)
          .title('Пароль успешно обновлен')
          .textContent('Здравствуйте! У нас произошла техническая авария на сервере. К сожалению, данные о некоторых заказах были удалены. Вам нужно создать новый заказ самостоятельно. Денежные срества на Ваш баланс должны зачислиться автоматически. Если этого не произошло, то обратитесь в службу поддержки. Можете сделать это через онлайн консультанта в правом нижнем углу.')
          .ok('Ок');

          $mdDialog.show(confirm).then(function() {
        //    console.log("Ok");
              $window.location.href = 'https://upmob.ru/orders';
            //$window.location.go = "http://upmob.ru/site";
          }, function() {
          //  console.log("Cancel");
              $window.location.href = 'https://upmob.ru/orders';
            //  $window.location.go = "http://upmob.ru/site";
          });




        }

      }, function errorCallback(response) {
          // console.log(response);
      });




    };


  }
  $scope.$watch(function () { return Data.getMoneyCount(); }, function (newValue, oldValue) {
      if (newValue !== oldValue) $scope.count_money_r = newValue;
      //console.log("$scope.count_money_r = " + $scope.count_money_r);
  });
//   $http({
//     method: 'POST',
//     url: 'https://upmob.ru/api/getMyInfo',
//     data : {
//       'token' : $window.localStorage.getItem("token")
//     }
//   }).then(function successCallback(response) {
// if (response.data.response == 1) {
//     $scope.count_money_r = response.data.customer.count_money_r;
//     $scope.first_name = response.data.customer.first_name;
// }
//
//   }, function errorCallback(response) {
//
//   });
  // $scope.$watch('$window.localStorage.getItem("moneyCount")', function() {
  //     //  alert('hey, myVar has changed!');
  //     $scope.count_money_r = $window.localStorage.getItem("moneyCount");
  //     $scope.first_name = $window.localStorage.getItem("first_name");
  //     console.log("count_money_r changed = " + $scope.count_money_r);
  // });

//  $scope.count_money_r = $window.localStorage.getItem("moneyCount");
  // if ($window.localStorage.getItem("filter") != undefined) {
  //    $scope.selectFilter = $window.localStorage.getItem("filter");
  // } else {
  //   $window.localStorage.setItem("filter", "Все");
  //   $scope.selectFilter = "Все";
  // }

  $scope.showFilters = function() {
    $scope.filters = ["Все", "Выполняются", "Пауза", "Завершены"];
    $scope.filtersListStyle = {
      'visibility' : 'visible'
    }
  };
  $scope.filterGroup = function(filter) {
   $window.localStorage.setItem("filter", filter);
    $scope.selectFilter = filter;
    if (fullOrders != undefined) {
      $scope.orders = fullOrders.filter(function(order) {

        if (filter == "Все") {
          return true;
        } else if(filter == "Выполняются"){
          return (order.count_money_r >= order.price_one_install && order.state == 1);
        } else if(filter == "Пауза"){
          return (order.count_money_r >= order.price_one_install && order.state == 0);
        } else {
          return (order.count_money_r < order.price_one_install);
        }



      });
    }


  };
  $scope.createNewOrder = function(){
    $window.location.href = 'https://upmob.ru/neworder';
  };
  loadOrders = function(){
    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/getMyOrders',
      data : {
        'token' : $window.localStorage.getItem("token")
      }
    }).then(function successCallback(response) {
      if (response.data.response == 1) {


      if (response.data.orders.length > 0) {
        $scope.orders = response.data.orders.reverse();

      } else {
        $scope.myOrdersStyle = {

          'visibility' : 'collapse',
          'display' : 'none'

        }
        $scope.myOrdersCreateStyle = {

          'visibility' : 'visible',
          'display' : 'block'

        }
      }


      fullOrders = $scope.orders;
      if ($window.localStorage.getItem("filter") != undefined) {
         $scope.selectFilter = $window.localStorage.getItem("filter");
      } else {
        $window.localStorage.setItem("filter", "Все");
        $scope.selectFilter = "Все";
      }
      $scope.filterGroup($scope.selectFilter);
}
    }, function errorCallback(response) {
      //alert('ошибка');
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };
  loadOrders();
    getOrdersDet = function(){
      return fullOrders;
    }
    setOrdersDet = function(ords){
      fullOrders = ords;
      // $scope.orders = ords;
      // fullOrders = $scope.orders;
      $scope.selectFilter = $window.localStorage.getItem("filter");
      $scope.filterGroup($scope.selectFilter);
    }
  var mdDialogIps = function ($scope, dataToPass, $mdDialog, $window, $http) {
    $scope.orderIps = dataToPass.employers_ips;
    //console.log("orderIps = " + $scope.orderIps);
    $scope.answer = function() {

      $mdDialog.hide();
    };
  }
  $scope.showIpAdresses = function(id) {
    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/getOrderDetails',
      data : {
        'order_id' : id
      }
    }).then(function successCallback(response) {

      $mdDialog.show({
        controller: mdDialogIps,
        templateUrl: 'ipsDialog.html',
        //  parent: angular.element(document.body),,
        focusOnOpen: false,
        locals:{dataToPass: response.data.order},

        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
      //  $mdDialog.hide();
      //  console.log("OK");
      }, function() {
      //  $mdDialog.hide();
      //  console.log("Cancel");
      });

    }, function errorCallback(response) {

    });
  };
  $scope.addMoney = function(order, ev){
    if ($scope.count_money_r <= 0 ) {
      var confirm = $mdDialog.confirm()
      .clickOutsideToClose(true)
      .title('Недостаточно денег')
      .textContent('Необходимо пополнить счет аккаунта')
      .ok('Пополнить')
      .cancel('Закрыть')
      .targetEvent(ev);

      $mdDialog.show(confirm).then(function() {
      //  console.log("Ok");
        $window.location.href = "https://upmob.ru/pay";
      }, function() {
      //  console.log("Cancel");
        //  $window.location.go = "http://upmob.ru/site";
      });

      return;
    }
    $mdDialog.show({
      controller: addMoneyDialogMd,
      templateUrl: 'addMoneyDialog.html',
      //  parent: angular.element(document.body),,
      focusOnOpen: false,
      locals:{dataToPass: order},
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
    //  console.log("OK");
    }, function() {
    //  console.log("Cancel");
    });
  };
  var updateOrders  = function(response){

    $scope.count_money_r = response.data.count_money_r;

    $scope.orders =  response.data.orders.reverse();
  };

  var addMoneyDialogMd = function ($scope, dataToPass, $mdDialog, $window, $http, $rootScope) {
    $scope.sumET = 1000;

    $scope.currentOrder = dataToPass;
    $scope.countInstalls = Math.floor($scope.sumET / $scope.currentOrder.price_one_install);
    $scope.realSum = $scope.currentOrder.price_one_install * $scope.countInstalls;
    $scope.sumChanged = function(){
      $scope.countInstalls = Math.floor($scope.sumET / $scope.currentOrder.price_one_install);
      $scope.realSum = $scope.currentOrder.price_one_install * $scope.countInstalls;
    };
    $scope.addMoney = function() {

      //console.log("index = " + ind);
      $http({
        method: 'POST',
        url: 'https://upmob.ru/api/addCoinsToOrder',
        data : {
          'token' : $window.localStorage.getItem("token"),
          'count_money_r' : $scope.realSum,
          '_id' : $scope.currentOrder._id,
          'count_installs' : $scope.countInstalls
        }
      }).then(function successCallback(response) {
        //updateOrders(response);

        if (response.data.response == -2) {
          var confirm = $mdDialog.confirm()
          .clickOutsideToClose(true)
          .title('Недостаточно денег')
          .textContent('Необходимо пополнить счет аккаунта')
          .ok('Пополнить')
          .cancel('Закрыть')
          .targetEvent(ev);

          $mdDialog.show(confirm).then(function() {
          //  console.log("Ok");
            $window.location.href = "https://upmob.ru/pay";
          }, function() {
          //  console.log("Cancel");
            //  $window.location.go = "http://upmob.ru/site";
          });

          return;
        } else if (response.data.response == 1) {

           $rootScope.count_money_r = $rootScope.count_money_r - $scope.realSum
           var a = getOrdersDet().indexOf($scope.currentOrder);
           var ords = getOrdersDet();
           var ord = $scope.currentOrder;
           ord.count_money_r += $scope.realSum;
           ord.max_count_installs += $scope.countInstalls;
           ords[a] = ord;
           setOrdersDet(ords);
           //console.log("index = " + a);




        }





      //  console.log("response add money = " + response.data.orders);

      }, function errorCallback(response) {
        alert('ошибка');
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

      $mdDialog.hide();


    };

    $scope.cancelAddMoney = function() {

      $mdDialog.hide();
    };
  }

  $scope.infoClicked = function(order, ev){
    $scope.currentOrder = order;
    $mdDialog.show({
      controller: mdDialogCtrl,
      templateUrl: 'infoDialog.html',
      //  parent: angular.element(document.body),,
      focusOnOpen: false,
      locals:{dataToPass: order},
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
    //  console.log("OK");
    }, function() {
    //  console.log("Cancel");
    });

  };

  var mdDialogCtrl = function ($scope, dataToPass, $mdDialog, $window, $http) {
    $scope.currentOrder = dataToPass;
    var limits = undefined;
    var params = undefined;
    var visibleStyle = {
      'visibility' : 'visible',
      'display' : 'flex'
    }
    $scope.percents = parseInt(($scope.currentOrder.count_installed / $scope.currentOrder.max_count_installs) * 100);
    if ($scope.currentOrder.search_request != undefined && $scope.currentOrder.search_request != "") {
      $scope.searchStyle = visibleStyle;
    }
    // if ($window.localStorage.getItem("email") == "zhenekvv@gmail.com") {
    //   $scope.trackUrlStyle = visibleStyle;
    // }

    if ($scope.currentOrder.limit_day != 99999) {
      limits = $scope.currentOrder.limit_day + "(в день)";
    }
    if ($scope.currentOrder.limit_hour != 99999) {
      limits = limits + ", " + $scope.currentOrder.limit_hour + "(в час)";
    }
    if ($scope.currentOrder.limit_minute != 99999) {
      limits = limits + ", " + $scope.currentOrder.limit_minute + "(в минуту)";
    }
    if (limits != undefined) {
      $scope.limits = limits;
      $scope.limitsStyle = visibleStyle;
    }

    if ($scope.currentOrder.open_3_day) {
      params = "с открытием на 3-й день";
    }
    if ($scope.currentOrder.with_review) {
      if (params == undefined) {
        params = "с отзывом";
        if ($scope.currentOrder.review_words != undefined && $scope.currentOrder.review_words != "") {
          params = "с отзывом (" + $scope.currentOrder.review_words + ")";
        }
      } else {

        if ($scope.currentOrder.review_words != undefined && $scope.currentOrder.review_words != "") {
          params = params + ", " + "с отзывом (" + $scope.currentOrder.review_words + ")";
        } else {
          params = params + ", " + "с отзывом";
        }
      }
    }
    if ($scope.currentOrder.good_review_top) {
      if (params == undefined) {
        params = "с поднятием хороших отзывов";
      } else {
        params = params + ", " + "с поднятием хороших отзывов";
      }
    }
    if (params != undefined) {
      $scope.params = params;
      $scope.paramsStyle = visibleStyle;
    }

    $scope.checkBundle = function(info){

      var isReturn = false;
      for (var i = 0; i < info.length; i++) {
        var item = info[i];

        if (item.bundleId == $scope.currentOrder.bundle) {
          isReturn = true;
          return i + 1;
        }
      }

    };

    if ($scope.currentOrder.type_os != "android") {

      $http({
        method: 'GET',
        url: 'https://itunes.apple.com/search?limit=200&country=ru&entity=software&term=' + $scope.currentOrder.search_request
      }).then(function successCallback(response) {


        var info = response.data.results;
        var searchPosition = $scope.checkBundle(info);

        if (searchPosition == undefined) {
          return;
        }

        if ($scope.currentOrder.search_position != undefined) {
          $scope.search_position = "до накрутки - " + $scope.currentOrder.search_position + ", текущая - " + searchPosition;
        } else {
          $scope.search_position =  "текущая - " + searchPosition;
        }


      }, function errorCallback(response) {

      });


    } else {



      $http({
        method: 'POST',
        url: 'https://upmob.ru/api/searchApp',
        //token, count_money_r, with_review, open_3_day, search_request, count_in_day, bundle, name, icon, category, type_os
        data:{
          'bundle' : $scope.currentOrder.bundle,
          'query' : $scope.currentOrder.search_request,
          'country' : "RU",
          'type_os' : $scope.currentOrder.type_os

        }
      }).then(function successCallback(response) {
        if (response.data.response != 1) {
          return;
        }


      //  console.log(response.data);
        if (response.data.info == 0) {

          return;
        }

        if ($scope.currentOrder.search_position != undefined) {
          $scope.search_position = "до накрутки - " + $scope.currentOrder.search_position + ", текущая - " + response.data.info;
        } else {
          $scope.search_position =  "текущая - " + response.data.info;
        }
        //$scope.currentOrder.current_position = response.data.info;

      }, function errorCallback(response) {

      });
    }

    $scope.getStats = function() {
      $window.localStorage.setItem("bundle", dataToPass.bundle);
      $window.localStorage.setItem("typeos", dataToPass.type_os);
      $window.localStorage.setItem("appname", dataToPass.name);
      $mdDialog.hide();
      $window.location.href = 'https://upmob.ru/statistics';

    };

    $scope.answer = function() {

      $mdDialog.hide();
    };
  }
  $scope.setStateOrderPause = function(id, order, index, ev){
    if (order.moderated == 0) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Заказ на модерации')
        .textContent('Компания поставлена паузу, после окончания модерации вам нужно будет запустить заказ в ручную.')
        .ok('ОК')
        .targetEvent(ev)
      );
    }

    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/setStateOrder',
      data : {
        'token' : $window.localStorage.getItem("token"),
        '_id' : id,
        'state' : 0
      }
    }).then(function successCallback(response) {
      if (response.data.response == 1) {

        $scope.orders[index].state = 0;
      //  console.log("orders = " + $scope.orders[index].state);
      }


    }, function errorCallback(response) {


    });
  };

  $scope.setStateOrderPlay = function(id, order, index, ev){
    if ($scope.count_money_r < 0 ) {
      var confirm = $mdDialog.confirm()
      .clickOutsideToClose(true)
      .title('Недостаточно денег')
      .textContent('Необходимо пополнить счет аккаунта')
      .ok('Пополнить')
      .cancel('Закрыть')
      .targetEvent(ev);

      $mdDialog.show(confirm).then(function() {
      //  console.log("Ok");
        $window.location.href = "https://upmob.ru/pay";
      }, function() {
      //  console.log("Cancel");
        //  $window.location.go = "http://upmob.ru/site";
      });

      return;
    }


    if (order.moderated == 0) {
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Заказ на модерации')
        .textContent('Компания будет запущена сразу, после окончания модерации.')
        .ok('ОК')
        .targetEvent(ev)
      );
    }

    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/setStateOrder',
      data : {
        'token' : $window.localStorage.getItem("token"),
        '_id' : id,
        'state' : 1
      }
    }).then(function successCallback(response) {

      if (response.data.response == 1) {

        $scope.orders[index].state = 1;
      //  console.log("orders = " + $scope.orders[index].state);
      }


    }, function errorCallback(response) {


    });
  };


  $scope.deleteOrder = function(id){
    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/removeOrder',
      data : {
        'token' : $window.localStorage.getItem("token"),
        '_id' : id
      }
    }).then(function successCallback(response) {
      // loadOrders();
      // $scope.count_money_r = response.count_money_r;
      $window.location.href = 'https://upmob.ru/orders';
    //  console.log("deleteOrder" + response.count_money_r );

    }, function errorCallback(response) {


    });


  };

  if ($window.location.href.indexOf("#paid") !== -1) {

    var confirm = $mdDialog.confirm()
    .clickOutsideToClose(true)
    .title('Оплата прошла успешно')
    .textContent('Средства зачислены на ваш аккаунт')
    .ok('Ок');

    $mdDialog.show(confirm).then(function() {
      //console.log("Ok");
      //$window.location.go = "http://upmob.ru/site";
    }, function() {
    //  console.log("Cancel");
      //  $window.location.go = "http://upmob.ru/site";
    });


  }

  if ($window.location.href.indexOf("#notpaid") !== -1) {

    var confirm = $mdDialog.confirm()
    .clickOutsideToClose(true)
    .title('Оплата не прошла')
    .textContent('Средства не были зачислине на ваш аккаунт')
    .ok('Ок');

    $mdDialog.show(confirm).then(function() {
    //  console.log("Ok");
      //$window.location.go = "http://upmob.ru/site";
    }, function() {
    //  console.log("Cancel");
      //  $window.location.go = "http://upmob.ru/site";
    });


  }


});
app.directive('myOrders', function() {

  return {
    restrict : "E",
    templateUrl: 'ordersTemplate.html',
    link : function(scope, element, attrs) {

    }
  }



});

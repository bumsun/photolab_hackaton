var app = angular.module('siteModule', ['daterangepicker' , 'chart.js','ngRoute', 'ngMaterial', 'ngclipboard']);
var apps = {};
var myPackage = "";
var typ_os = "";
var genre = "";
var isCutIconUrl = false;
var isClosedDropDown = true;
var rub = " Р";
var money_count_public = "";
var MINIMAL_PRICE_CUSTOMER = 3;
var REVIEW_PRICE_CUSTOMER = 2;
var THIRD_DAY_PRICE_CUSTOMER = 2;
var GOOD_REVIEW_TOP_CUSTOMER = 2;
//myCounterYandex.reachGoal('1234');
var MINIMAL_PRICE_CUSTOMER_IOS = 7;
var REVIEW_PRICE_CUSTOMER_IOS = 4;
var THIRD_DAY_PRICE_CUSTOMER_IOS = 4;
var GOOD_REVIEW_TOP_CUSTOMER_IOS = 4;
var isWordsFound = false;
var visStyle =  {
  'visibility' : 'visible',
  'display' : 'block'
};

var invisStyle =  {

  'visibility' : 'collapse',
  'display' : 'none'

};
app.factory('Data', function () {

    var data = {
        MoneyCount: ''
    };

    return {
        getMoneyCount: function () {
            return data.MoneyCount;
        },
        setMoneyCount: function (moneyCount) {
            data.MoneyCount = moneyCount;
        }
    };
});
app.controller('myAppController', function($scope, $http, $window,$route, $routeParams, $location, $mdDialog, $document) {

  var myToken = $location.search().token;
  if (myToken != undefined) {
    $window.localStorage.setItem("token", myToken);
    try {
      yaCounter46775670.reachGoal('1235');
    } catch (e) {

    }

  }
  if ($window.localStorage.getItem("token") == undefined) {
    $window.location.href = 'https://upmob.ru/auth';
    return;
  }
  $scope.minCountReviews = "Минимальное количество установок в заказе - 100."
  $scope.trackUrlStyle = visStyle;
  // if ($window.localStorage.getItem("email") == "zhenekvv@gmail.com" || $window.localStorage.getItem("email") == "bumsun@yandex.ru") {
  //   $scope.trackUrlStyle = visStyle;
  // } else {
  //   $scope.trackUrlStyle = invisStyle;
  // }
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
  //
  //       if (response.data.response == -1) {
  //         $mdDialog.show({
  //           controller: changePassController,
  //           templateUrl: 'registerDialog.html',
  //           dataToPass:{"asd" : "asdasd"},
  //           focusOnOpen: false,
  //           clickOutsideToClose:false
  //         })
  //         .then(function(answer) {
  //         //  console.log("OK");
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
           console.log(response);
      });




    };


  }



  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.limitDayET = 100;
  $scope.limitHourET = 10;
  $scope.limitMinuteET = 1;
  $scope.installsCountET = 100;
  $scope.count_money = 300;
  $scope.myStyleSearch = invisStyle;


  $http({
    method: 'POST',
    url: 'https://upmob.ru/api/getPriceConfig',
    //bundle
    data:{'url' : "asd"
  }
}).then(function successCallback(response) {
  MINIMAL_PRICE_CUSTOMER = response.data.MINIMAL_PRICE_CUSTOMER;
  REVIEW_PRICE_CUSTOMER = response.data.REVIEW_PRICE_CUSTOMER;
  THIRD_DAY_PRICE_CUSTOMER = response.data.THIRD_DAY_PRICE_CUSTOMER;
  GOOD_REVIEW_TOP_CUSTOMER = response.data.GOOD_REVIEW_TOP_CUSTOMER;

  MINIMAL_PRICE_CUSTOMER_IOS = response.data.MINIMAL_PRICE_CUSTOMER_IOS;
  REVIEW_PRICE_CUSTOMER_IOS = response.data.REVIEW_PRICE_CUSTOMER_IOS;
  THIRD_DAY_PRICE_CUSTOMER_IOS = response.data.THIRD_DAY_PRICE_CUSTOMER_IOS;
  GOOD_REVIEW_TOP_CUSTOMER_IOS = response.data.GOOD_REVIEW_TOP_CUSTOMER_IOS;


}, function errorCallback(response) {
  //alert('ошибка');
  // called asynchronously if an error occurs
  // or server returns response with an error status.
});
//myYandex($document, $window, "yandex_metrika_callbacks");

$http({
  method: 'POST',
  url: 'https://upmob.ru/api/getMyApps',
  data : {
    'token' : $window.localStorage.getItem("token")
  }
}).then(function successCallback(response) {

 if (response.data.response == 1) {


  apps = response.data.apps;


  var orderBundle = $location.search().bundle;
  var orderWord = $location.search().word;
  var typeOs = $location.search().os;

  if (orderBundle != undefined && orderWord!= undefined && typeOs != undefined) {
    var findedApp = apps.filter(function(app) {

if (typeOs == "android") {
    return (app.bundle == orderBundle);
} else {
    return (app.appstore_id == orderBundle);
}

    });

    //console.log("apps bundle = " + apps[4].bundle);
    //app.name, app.icon, app.bundle, app.type_os, app.genre, app.price, app.version_os


    if (findedApp != undefined) {

      if (findedApp.length == 0) {
        //appName, icon, bundle, type_os, genre, price, version_os, appstore_id
        $scope.getAppName(undefined, undefined, orderBundle, typeOs,undefined,undefined, undefined, orderBundle);

      } else {
      $scope.getAppName(findedApp[0].name,  findedApp[0].icon, findedApp[0].bundle, findedApp[0].type_os, findedApp[0].genre, findedApp[0].price, findedApp[0].version_os, findedApp[0].appstore_id);

    }
    $scope.installsWordSwitch = true;
    $scope.installsWordSwitchClicked();
    $scope.searchTextET = orderWord;
      //$scope.getAppPosition();
    }



  }
}
}, function errorCallback(response) {

});

calc = function(){

  var upGoodReviewsSwitch = $scope.upGoodReviewsSwitch;
  var openIn3d = $scope.openIn3dSwitch;
  var review = $scope.reviewSwitch;
  // if ($scope.app_data == undefined) {
  //   return;
  // }
  var priceInStore;
  if ($scope.app_data != undefined) {

    priceInStore = $scope.app_data.price;
    //console.log("priceInStore = " + $scope.app_data.price);
  } else {
    $scope.app_data = {};
    $scope.app_data.type_os = "android";
  priceInStore = 0;
  count_money = MINIMAL_PRICE_CUSTOMER;
  if (upGoodReviewsSwitch) {
    count_money += GOOD_REVIEW_TOP_CUSTOMER;
  }
  if (openIn3d) {
    count_money += THIRD_DAY_PRICE_CUSTOMER;
  }
  if (review) {
    count_money += REVIEW_PRICE_CUSTOMER;
  }
  if (priceInStore != undefined && priceInStore > 0) {
    count_money += priceInStore;

  }
  $scope.count_money = count_money * $scope.installsCountET;
  return;
  }


  var count_money = 0;
  if ($scope.app_data.type_os == undefined || $scope.app_data.type_os == "android") {
    count_money = MINIMAL_PRICE_CUSTOMER;
    if (upGoodReviewsSwitch) {
      count_money += GOOD_REVIEW_TOP_CUSTOMER;
    }
    if (openIn3d) {
      count_money += THIRD_DAY_PRICE_CUSTOMER;
    }
    if (review) {
      count_money += REVIEW_PRICE_CUSTOMER;
    }
  } else {
    count_money = MINIMAL_PRICE_CUSTOMER_IOS;
    if (upGoodReviewsSwitch) {
      count_money += GOOD_REVIEW_TOP_CUSTOMER_IOS;
    }
    if (openIn3d) {
      count_money += THIRD_DAY_PRICE_CUSTOMER_IOS;
    }
    if (review) {
      count_money += REVIEW_PRICE_CUSTOMER_IOS;
    }
  }

  if (priceInStore != undefined && priceInStore > 0) {
    count_money += priceInStore;

  }
  $scope.count_money = count_money * $scope.installsCountET;


};

$scope.calculate = function(){
  calc();

};
$scope.showApps = function(){
  $scope.apps = apps;
//  console.log("apps" + apps);
  if (apps.length > 0) {

if (isClosedDropDown) {
  isClosedDropDown = false;
  $scope.appsListStyle = {

    'visibility' : 'visible',
    'display' : 'block'

  }
} else {
  isClosedDropDown = true;
  $scope.appsListStyle = {

    'visibility' : 'collapse',
    'display' : 'none'


  }
}

  }
};
$scope.getAppName = function(appName, icon, bundle, type_os, genre, price, version_os, appstore_id){
  //НЕ ДОДЕЛАНО
  //   $scope.app_data = {};
  //   isCutIconUrl = false;
  //   $scope.app_data.type_os = type_os;
  //   $scope.app_data.version_os = version_os;
  //   $scope.app_data.price = price;
  //
  //   if (type_os == "android") {
  //     $scope.app_data.appId = bundle;
  //     $scope.app_data.genre = genre;
  //
  //   } else {
  //     $scope.app_data.id = bundle;
  //     $scope.app_data.genre = [];
  //     $scope.app_data.genre.push(genre);
  //   }
  //
  //
  //
  //   $scope.packageET = appName;
  //   $scope.appsListStyle = {
  //
  //     'visibility' : 'hidden'
  //
  //   }
  //   $scope.app_icon = icon;
  //   $scope.app_name =  appName;
  //
  //   $scope.myStyle = {
  //
  //     'visibility' : 'visible',
  //     'display' : 'flex',
  //     'margin-top' : '0px',
  //     'vertical-align' : 'middle'
  //   }
  //   calc();
  // console.log("version_os = " + $scope.app_data.version_os);
  var url = "";
  if (type_os == "android") {
    url = "https://play.google.com/store/apps/details?id=" + bundle;
  } else {
    url = "https://itunes.apple.com/ru/app/id" + appstore_id;
  }

  $scope.packageET = url;
  $scope.sendRequest(url);

  if ($scope.searchTextET != undefined) {
    if (type_os == "android") {
        $scope.getAppPosition();
    } else {
      $scope.getAppPositionIOS();
    }

  }
};
$scope.getAppPositionIOS = function(){

  $http({
    method: 'GET',
    url: 'https://itunes.apple.com/search?limit=500&country=ru&entity=software&term=' + $scope.searchTextET
  }).then(function successCallback(response) {


    var info = response.data.results;
    var searchPosition = $scope.checkBundle(info);

    if (searchPosition == undefined) {
      searchPosition = 0;
    }
    $scope.progressStyle = invisStyle;


    if (searchPosition == 0) {
      $scope.search_pos = undefined;
      $scope.myStyleSearch = invisStyle;

      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Вашего приложения нет в поисковой выдаче по данному запросу.')
        .textContent('Если вы уверены, что ваше приложение есть по этому запросу, можете продолжить создание заказа.')
        .ok('Ок')

      );

      return;
    }
    $scope.search_pos = searchPosition;
    $scope.myStyleSearch = {

      'visibility': 'visible',

      'display' : 'flex',
      'margin-top' : '0px',
      'vertical-align' : 'middle'
    }


  }, function errorCallback(response) {

  });
};

$scope.checkBundle = function(info){

  var isReturn = false;
  for (var i = 0; i < info.length; i++) {
    var item = info[i];

    if (item.bundleId == $scope.app_data.appId) {
      isReturn = true;
      return i + 1;
    }
  }

};
$scope.getAppPosition = function(){

  if ($scope.packageET == undefined) {
    return;
  }

  if ($scope.app_data.type_os == "ios") {
    $scope.progressStyle = visStyle;
    $scope.getAppPositionIOS();
    return;
  }

  $scope.progressStyle = visStyle;
  if ( $scope.app_data.appId == undefined) {
     $scope.app_data.appId = myPackage;
     $scope.app_data.type_os = "android";
  }
//  console.log("$scope.app_data.appId = " + $scope.app_data.appId);
//  console.log("$scope.app_data.type_os = " + $scope.app_data.type_os);

  $http({
    method: 'POST',
    url: 'https://upmob.ru/api/searchApp',
    //token, count_money_r, with_review, open_3_day, search_request, count_in_day, bundle, name, icon, category, type_os
    data:{
      'bundle' : $scope.app_data.appId,
      'query' : $scope.searchTextET,
      'country' : "RU",
      'type_os' : $scope.app_data.type_os

    }
  }).then(function successCallback(response) {
    isWordsFound = true;
    $scope.progressStyle = invisStyle;
    if (response.data.response != 1) {
      return;
    }


  //  console.log(response.data);
    if (response.data.info == 0) {
      $scope.search_pos = undefined;
      $scope.myStyleSearch = invisStyle;

      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Вашего приложения нет в поисковой выдаче по данному запросу.')
        .textContent('Если вы уверены, что ваше приложение есть по этому запросу, можете продолжить создание заказа.')
        .ok('Ок')

      );

      return;
    }
    $scope.search_pos = response.data.info;
    $scope.myStyleSearch = {

      'visibility': 'visible',

      'display' : 'flex',
      'margin-top' : '0px',
      'vertical-align' : 'middle'
    }

  }, function errorCallback(response) {

    var timerId = setInterval(function() {
      if (isWordsFound) {

        $scope.getAppPosition();
        clearInterval(timerId);
      }
    }, 300);

  });
};
$scope.sendRequest = function (url){
  var realUrl = url;
  if (realUrl == undefined){
    realUrl = $scope.packageET;
  }
// console.log("realUrl = " + realUrl);
// console.log("realUrl = " + realUrl.indexOf("play.google.com"));
// if (realUrl.indexOf("play.google.com") != -1) {
//   $scope.appsListStyle = {
//
//     'visibility' : 'collapse',
//     'display' : 'none'
//
//
//   }
//   $mdDialog.show(
//     $mdDialog.alert()
//     .parent(angular.element(document.querySelector('#popupContainer')))
//     .clickOutsideToClose(true)
//     .title('Технические неполадки')
//     .textContent('Создание заказов для андроид приложений временно отключено, за подробностями обратитесь к менеджеру.')
//     .ok('Ок')
//
//   );
//   return;
// }
$scope.progressPackageStyle = visibleStyle;
$scope.appsListStyle = {

  'visibility' : 'collapse',
  'display' : 'none'


};
// $http({
//   method: 'GET',
//   headers: {
//                   'Access-Control-Allow-Origin': '*',
//                   'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
//                   'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
//               },
//   url: realUrl + "&hl=ru",
//   //bundle
//
// }).then(function successCallback(response) {
//   console.log("get response = " + response.getElementsByClassName("T75of ujDFqe")[0]);
// }, function errorCallback(response) {
// });

  $http({
    method: 'POST',
    timeout : 15000,
    url: 'https://upmob.ru/api/getAppInfo',
    //bundle
    data:{'url' : realUrl,
    'email' : $window.localStorage.getItem("email")
  }
}).then(function successCallback(response) {
  //alert(response.data.response);
  myPackage = realUrl.substring(realUrl.indexOf("id=") + 3, realUrl.length);

  $scope.progressPackageStyle = invisStyle;
  if (response.data.response == -1) {
    $scope.appsListStyle = {

      'visibility' : 'collapse',
      'display' : 'none'


    };
  //  console.log("myPackage = " + myPackage);

      setTimeout(function () {
        $scope.costUpGoodReviewsTV = "+" + GOOD_REVIEW_TOP_CUSTOMER + rub;
        $scope.costWithReviewsTV = "+" +  REVIEW_PRICE_CUSTOMER + rub;
        $scope.costOpen3dDayTV = "+" + THIRD_DAY_PRICE_CUSTOMER + rub;
    //    console.log("$scope.costOpen3dDayTV = " + $scope.costOpen3dDayTV);

        $scope.$apply();

        calc();
      }, 1000);
    return;
  }


  isCutIconUrl = true;
  isClosedDropDown = true;
  $scope.appsListStyle = {

    'visibility' : 'collapse',
    'display' : 'none'


  }
  var url = ""
  if (response.data.info.icon.indexOf("https://") == -1) {
    url = response.data.info.icon.substring(2, response.data.info.icon.length);
  }  else {
    url = response.data.info.icon.substring(8, response.data.info.icon.length);
  }
  if (url.indexOf("tp://") == -1 ) {

  } else {
    url = url.substring(5, url.length)
  }
  $scope.app_icon = url;

  $scope.app_data = response.data.info;
  $scope.app_data.type_os = response.data.type_os;

  if ($scope.app_data.type_os == "android") {
    if ($scope.app_data.price != 0) {
    //  console.log("$scope.app_data.price = " + $scope.app_data.price);
      $scope.app_data.price = $scope.app_data.price + "";
      if ($scope.app_data.price.indexOf(",") != -1) {
        $scope.app_data.price = Number($scope.app_data.price.substring(0, $scope.app_data.price.indexOf(',')));
      }

    //  console.log("$scope.app_data.price 2 = " + $scope.app_data.price);
    }

  $scope.app_data.version_os = $scope.app_data.androidVersion;


  } else {
  $scope.app_data.version_os = $scope.app_data.requiredOsVersion;



  }
$scope.app_name =  response.data.info.title;
$scope.app_name_price = response.data.info.title;
if ($scope.app_data.price != undefined && $scope.app_data.price > 0) {
  $scope.app_name_price = $scope.app_name + " (цена в сторе - " + $scope.app_data.price + "руб.)"
}
  $scope.myStyle = {

    'visibility' : 'visible',
    'display' : 'flex',
    'margin-top' : '0px',
    'vertical-align' : 'middle'
  }
//  console.log($scope.app_icon);
  calc();
  if ($scope.searchTextET != undefined) {
    $scope.getAppPosition();
  }
  if ($scope.app_data.type_os == "android") {
    setTimeout(function () {
      $scope.costUpGoodReviewsTV = "+" + GOOD_REVIEW_TOP_CUSTOMER + rub;
      $scope.costWithReviewsTV = "+" +  REVIEW_PRICE_CUSTOMER + rub;
      $scope.costOpen3dDayTV = "+" + THIRD_DAY_PRICE_CUSTOMER + rub;
    //  console.log("$scope.costOpen3dDayTV = " + $scope.costOpen3dDayTV);
      $scope.$apply();
    }, 1000);
  } else {
    setTimeout(function () {
      $scope.costUpGoodReviewsTV = "+" +  GOOD_REVIEW_TOP_CUSTOMER_IOS + rub;
      $scope.costWithReviewsTV = "+" +  REVIEW_PRICE_CUSTOMER_IOS + rub;
      $scope.costOpen3dDayTV = "+" +  THIRD_DAY_PRICE_CUSTOMER_IOS + rub;
      $scope.$apply();
    }, 1000);
  }


}, function errorCallback(response) {
  //alert('ошибка');
  $scope.progressPackageStyle = invisStyle;
  $scope.appsListStyle = {

    'visibility' : 'collapse',
    'display' : 'none'


  };
  myPackage = realUrl.substring(realUrl.indexOf("id=") + 3, realUrl.length);
  //console.log("myPackage = " + myPackage);

    setTimeout(function () {
      $scope.costUpGoodReviewsTV = "+" + GOOD_REVIEW_TOP_CUSTOMER + rub;
      $scope.costWithReviewsTV = "+" +  REVIEW_PRICE_CUSTOMER + rub;
      $scope.costOpen3dDayTV = "+" + THIRD_DAY_PRICE_CUSTOMER + rub;
    //  console.log("$scope.costOpen3dDayTV = " + $scope.costOpen3dDayTV);

      $scope.$apply();

      calc();
    }, 1000);


  // called asynchronously if an error occurs
  // or server returns response with an error status.
});
};

$scope.createTask = function() {

  if ($scope.packageET == undefined || $scope.packageET == "") {
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#popupContainer')))
      .clickOutsideToClose(true)
      .title('Не все поля заполнены')
      .textContent('Пожалуйста, укажите имя пакета приложения')
      .ok('Ок')

    );
    return;
  }
  if (!$scope.reviewSwitch) {
if ($window.localStorage.getItem("email") == "viktor@app-great.com"  || $window.localStorage.getItem("email") == "bumsun@yandex.ru") {
  if ($scope.installsCountET < 50) {
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#popupContainer')))
      .clickOutsideToClose(true)
      .title('Увеличьте количество установок')
      .textContent('Необходимый минимум для заказа - 100 установок')
      .ok('Ок')

    );
    return;
  }
} else {
  if ($scope.installsCountET < 100) {
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#popupContainer')))
      .clickOutsideToClose(true)
      .title('Увеличьте количество установок')
      .textContent('Необходимый минимум для заказа - 100 установок')
      .ok('Ок')

    );
    return;
}
}
}
  var upGoodReviewsSwitch = $scope.upGoodReviewsSwitch;
  var openIn3d = $scope.openIn3dSwitch;
  var review = $scope.reviewSwitch;
  var count_money = 0;
  if ($scope.app_data == undefined) {
    $scope.app_data = {};
  }
  if ($scope.app_data.type_os == undefined || $scope.app_data.type_os == "android") {
    count_money = MINIMAL_PRICE_CUSTOMER;
    if (upGoodReviewsSwitch) {
      count_money += GOOD_REVIEW_TOP_CUSTOMER;
    }
    if (openIn3d) {
      count_money += THIRD_DAY_PRICE_CUSTOMER;
    }
    if (review) {
      count_money += REVIEW_PRICE_CUSTOMER;
    }
  } else {
    count_money = MINIMAL_PRICE_CUSTOMER_IOS;
    if (upGoodReviewsSwitch) {
      count_money += GOOD_REVIEW_TOP_CUSTOMER_IOS;
    }
    if (openIn3d) {
      count_money += THIRD_DAY_PRICE_CUSTOMER_IOS;
    }
    if (review) {
      count_money += REVIEW_PRICE_CUSTOMER_IOS;
    }
  }
  if (!review) {
    $scope.reviewWordET = undefined;
    $scope.wishET = undefined;
  }

  if (!$scope.installsWordSwitch) {
    $scope.searchTextET = undefined;
    $scope.search_pos = undefined;
  }
  var limitDay = 99999;
  var limitHour = 99999;
  var limitMinute = 99999;

  if ($scope.toFewDaysSwitch) {
    limitDay = $scope.limitDayET;
  }

  if ($scope.toFewHoursSwitch) {
    limitHour = $scope.limitHourET;
  }
  if ($scope.toFewMinutesSwitch) {
    limitMinute = $scope.limitMinuteET;
  }

  // var cache = $cacheFactory('cacheId');
//  console.log("$scope.upGoodReviewsSwitch = " + $scope.upGoodReviewsSwitch);
  var priceInStore = $scope.app_data.price;
//  console.log("priceInStore = " + $scope.app_data.price);
  if (priceInStore != undefined && priceInStore > 0) {
    count_money += priceInStore;
  }
  count_money = count_money * $scope.installsCountET;

  if ($scope.app_data.type_os == "android") {
    if ($scope.app_data.genre != undefined) {
      genre = $scope.app_data.genre;
    } else {
      genre = $scope.app_data.category;
    }

    if ($scope.app_data.appId != undefined) {
      myPackage = $scope.app_data.appId;
    } else {
        myPackage = $scope.app_data.store_id;
    }

  } else {

    genre = $scope.app_data.genres[0];
    myPackage = $scope.app_data.appId;
  }
//  console.log("price_app_in_store = " + $scope.app_data.price);
//  console.log("version_os = " + $scope.app_data.version_os);

  if ($scope.installsWordSwitch && ($scope.searchTextET == undefined || $scope.search_pos == undefined)) {
    // if ($scope.app_data.type_os == "android") {
    //
    // }
    // $mdDialog.show(
    //   $mdDialog.alert()
    //   .parent(angular.element(document.querySelector('#popupContainer')))
    //   .clickOutsideToClose(true)
    //   .title('Неверный поисковый запрос')
    //   .textContent('По данному запросу вашего приложения нет в поисковой выдаче.')
    //   .ok('Ок')
    //
    // );
    // return;
  }

//console.log("myPackage addNewOrder = " + myPackage);
  $http({
    method: 'POST',
    url: 'https://upmob.ru/api/addNewOrder',
    //token, count_money_r, with_review, open_3_day, search_request, count_in_day, bundle, name, icon, category, type_os
    data:{
      'bundle' : myPackage,
      'with_review' : $scope.reviewSwitch,
      'open_3_day' : $scope.openIn3dSwitch,
      'search_request' : $scope.searchTextET,
      'search_position' : $scope.search_pos,
      //limit_day, limit_hour, limit_minute
      'limit_day' : limitDay,
      'limit_hour' : limitHour,
      'limit_minute' : limitMinute,
      //'search_request' : $scope.searchTextET,
      'count_money_r' : count_money,
      'token' : $window.localStorage.getItem("token"),
      'max_count_installs' : $scope.installsCountET,
      'name' : $scope.app_name,
      'icon' : $scope.app_icon,
      'review_words' : $scope.reviewWordET,
      'review_wish' : $scope.wishET,
      'category' : genre,
      'price_one_install' : count_money/$scope.installsCountET,
      'good_review_top' : $scope.upGoodReviewsSwitch,
      'type_os' : $scope.app_data.type_os,
      'price_app_in_store' : $scope.app_data.price,
      'version_os' : $scope.app_data.version_os,
      'appstore_id' : $scope.app_data.id,
      'track_url' : $scope.trackUrlET,
      'description_step1' : $scope.descriptionText1ET

    }
  }).then(function successCallback(response) {

//console.log("response.data.response = " + response.data.response);
//console.log("response.data.status = " + response.data.status);
    if (response.data.response == 1) {
      $window.location.href = 'https://upmob.ru/orders';
    }


  }, function errorCallback(response) {
    //alert('ошибка');
    //console.log(response);
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });






};

$scope.minusDaysClicked = function(){
  if($scope.limitDayET > 1){
    $scope.limitDayET -= 1;
  }

};

$scope.plusDaysClicked = function(){
  $scope.limitDayET += 1;
};

$scope.minusHoursClicked = function(){
  if($scope.limitHourET > 1){
    $scope.limitHourET -= 1;
  }

};

$scope.plusHoursClicked = function(){
  $scope.limitHourET += 1;
};

$scope.minusMinutesClicked = function(){
  if($scope.limitMinuteET > 1){
    $scope.limitMinuteET -= 1;
  }

};

$scope.plusMinutesClicked = function(){
  $scope.limitMinuteET += 1;
};

$scope.installsWordSwitchClicked = function(){
  if ($scope.installsWordSwitch) {

    $scope.installsWordSwitchStyle = visStyle;

    if ($scope.searchTextET != undefined) {
      $scope.getAppPosition();
    }

  } else {

    $scope.installsWordSwitchStyle = invisStyle;
    $scope.myStyleSearch = invisStyle;
  }
};
$scope.trackUrlSwitchClicked = function(){
  if ($scope.trackUrlSwitch) {
    $scope.trackUrlSwitchStyle = visStyle;
  } else {
    $scope.trackUrlSwitchStyle = invisStyle;
    $scope.trackUrlET = undefined;
    $scope.descriptionText1ET = undefined;
  }
};

$scope.toFewDaysSwitchClicked = function(){

  if ($scope.toFewDaysSwitch) {

    $scope.toFewDaysSwitchStyle = visStyle;
  } else {

    $scope.toFewDaysSwitchStyle = invisStyle;
  }
  if ($scope.toFewHoursSwitch) {
    $scope.toFewHoursSwitch = false;
    $scope.toFewHoursSwitchClicked();
  }
};

$scope.toFewHoursSwitchClicked = function(){

  if ($scope.toFewHoursSwitch) {

    $scope.toFewHoursSwitchStyle = visStyle;
  } else {

    $scope.toFewHoursSwitchStyle = invisStyle;
  }

  if ($scope.toFewMinutesSwitch) {
    $scope.toFewMinutesSwitch = false;
    $scope.toFewMinutesSwitchClicked();
  }
};

$scope.toFewMinutesSwitchClicked = function(){

  if ($scope.toFewMinutesSwitch) {

    $scope.toFewMinutesSwitchStyle = visStyle;
  } else {

    $scope.toFewMinutesSwitchStyle = invisStyle;
  }
};

$scope.rewiewSwitchClicked = function(){
  calc();
  if ($scope.reviewSwitch) {
    $scope.minCountReviews = "Минимальное количество установок в заказе - 10."
  } else {
    $scope.minCountReviews = "Минимальное количество установок в заказе - 100."
  }

  if ($scope.reviewSwitch) {
    $scope.rewiewSwitchStyle = visStyle;
  } else {
    $scope.rewiewSwitchStyle = invisStyle;
  }

};


var myPrize = $location.search().prize;
if (myPrize != undefined) {
  var confirm = $mdDialog.confirm()
  .clickOutsideToClose(true)
  .title('Добро пожаловать!')
  .textContent('Ваш выигрыш по промокоду составил ' + myPrize + " руб.")
  .ok('Спасибо');

  $mdDialog.show(confirm).then(function() {

  }, function() {

  });

}

// function getElements(){
// var all = document.getElementsByClassName("r");
//                     for (var i=0, max=all.length; i < max; i++) {
//                        if (all[i].getElementsByTagName("a")[0].href.indexOf("shakin") !== -1){
//                          all[i].getElementsByTagName("a")[0].click();
//                          return "stop";
//                        } else if (i == (all.length - 1)){
//                          return "next";
//                        }
//                     }
//                   };
// var result = getElements();
// console.log(result);

// function getElements(){
// var all = document.getElementsByClassName("organic__title-wrapper");
//                     for (var i=0, max=all.length; i < max; i++) {
//                        if (all[i].getElementsByClassName("link_theme_normal")[0].href.indexOf("qmobasdi") !== -1){
//                          all[i].getElementsByClassName("link_theme_normal")[0].click();
//                          return "stop";
//                        } else if (i == (all.length - 1)){
//                          return "next";
//                        }
//                     }
//                   };
// var result = getElements();
// console.log(result);
if ($window.location.href.indexOf("#paid") !== -1) {

  var confirm = $mdDialog.confirm()
  .clickOutsideToClose(true)
  .title('Оплата прошла успешно')
  .textContent('Средства зачислены на ваш аккаунт')
  .ok('Ок');

  $mdDialog.show(confirm).then(function() {

  }, function() {

  });
  try {
    yaCounter46775670.reachGoal('1234');
  } catch (e) {

  }



}

if ($window.location.href.indexOf("#notpaid") !== -1) {

  var confirm = $mdDialog.confirm()
  .clickOutsideToClose(true)
  .title('Оплата не прошла')
  .textContent('Средства не были зачислены на ваш аккаунт')
  .ok('Ок');

  $mdDialog.show(confirm).then(function() {

  }, function() {

  });


}
});
function SHA256(s){




  var chrsz   = 8;


  var hexcase = 0;




  function safe_add (x, y) {


    var lsw = (x & 0xFFFF) + (y & 0xFFFF);


    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);


    return (msw << 16) | (lsw & 0xFFFF);


  }




  function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }


  function R (X, n) { return ( X >>> n ); }


  function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }


  function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }


  function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }


  function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }


  function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }


  function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }




  function core_sha256 (m, l) {


    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);


    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);


    var W = new Array(64);


    var a, b, c, d, e, f, g, h, i, j;


    var T1, T2;




    m[l >> 5] |= 0x80 << (24 - l % 32);


    m[((l + 64 >> 9) << 4) + 15] = l;




    for ( var i = 0; i<m.length; i+=16 ) {


      a = HASH[0];


      b = HASH[1];


      c = HASH[2];


      d = HASH[3];


      e = HASH[4];


      f = HASH[5];


      g = HASH[6];


      h = HASH[7];




      for ( var j = 0; j<64; j++) {


        if (j < 16) W[j] = m[j + i];


        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);




        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);


        T2 = safe_add(Sigma0256(a), Maj(a, b, c));




        h = g;


        g = f;


        f = e;


        e = safe_add(d, T1);


        d = c;


        c = b;


        b = a;


        a = safe_add(T1, T2);


      }




      HASH[0] = safe_add(a, HASH[0]);


      HASH[1] = safe_add(b, HASH[1]);


      HASH[2] = safe_add(c, HASH[2]);


      HASH[3] = safe_add(d, HASH[3]);


      HASH[4] = safe_add(e, HASH[4]);


      HASH[5] = safe_add(f, HASH[5]);


      HASH[6] = safe_add(g, HASH[6]);


      HASH[7] = safe_add(h, HASH[7]);


    }


    return HASH;


  }




  function str2binb (str) {


    var bin = Array();


    var mask = (1 << chrsz) - 1;


    for(var i = 0; i < str.length * chrsz; i += chrsz) {


      bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);


    }


    return bin;


  }




  function Utf8Encode(string) {


    string = string.replace(/\r\n/g,"\n");


    var utftext = "";




    for (var n = 0; n < string.length; n++) {




      var c = string.charCodeAt(n);




      if (c < 128) {


        utftext += String.fromCharCode(c);


      }


      else if((c > 127) && (c < 2048)) {


        utftext += String.fromCharCode((c >> 6) | 192);


        utftext += String.fromCharCode((c & 63) | 128);


      }


      else {


        utftext += String.fromCharCode((c >> 12) | 224);


        utftext += String.fromCharCode(((c >> 6) & 63) | 128);


        utftext += String.fromCharCode((c & 63) | 128);


      }




    }




    return utftext;


  }




  function binb2hex (binarray) {


    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";


    var str = "";


    for(var i = 0; i < binarray.length * 4; i++) {


      str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +


      hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);


    }


    return str;


  }




  s = Utf8Encode(s);


  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));



}

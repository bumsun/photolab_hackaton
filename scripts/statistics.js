// var app = angular.module('siteModule', ['daterangepicker' , 'chart.js', 'ngRoute']);
var apps = {};
var newD = {};
var bundle = "";
var typeOs = "";
var installsData = [];
var dateLabels = [];
var orderSearchKeys = [];
var isStatsRequested = false;
app.controller('myStatisticsController', function($scope, $http, $window) {
  if ($window.localStorage.getItem("token") == undefined) {
    $window.location.href = 'https://upmob.ru/auth';
    return;
  }
  $scope.date = {
    startDate: moment().subtract(6, "days"),
    endDate: moment().add(1, 'day')
  };
//   $http({
//     method: 'POST',
//     url: 'https://upmob.ru/api/checkCustomerToken',
//     data : {
//       'token' : $window.localStorage.getItem("token"),
//       'email' : $window.localStorage.getItem("email"),
//       'first_name' : $window.localStorage.getItem("first_name"),
//       'count_money_r' : $window.localStorage.getItem("moneyCount")
//     }
//   }).then(function successCallback(response) {
// //  console.log("response checkCustomerToken = " + response.data);
//         if (response.data.response == -1) {
//           $mdDialog.show({
//             controller: changePassController,
//             templateUrl: 'registerDialog.html',
//             dataToPass:{"asd" : "asdasd"},
//             focusOnOpen: false,
//             clickOutsideToClose:false
//           })
//           .then(function(answer) {
//           //  console.log("OK");
//           }, function() {
//           //  console.log("Cancel");
//           });
//         }
//
//   }, function errorCallback(response) {
//
//   });

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
          //  console.log("Ok");
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






  //console.log("date = "  + moment().format("DD MM YYYY"))

  $scope.type = "Поисковый запрос";

  $scope.reviewsClicked = function(){
    $scope.type = "Отзывы";
    if ($scope.selectBTN != undefined) {
    $scope.getStatsReviews();
  }
  };

  $scope.searchRequestClicked = function(){
    $scope.type = "Поисковый запрос";
    if ($scope.selectBTN != undefined) {
      console.log("$scope.searchRequestClicked");
        $scope.getStats();
    }
  };

  $scope.labels = dateLabels;
  $scope.series = orderSearchKeys;
  $scope.data = installsData;

  $scope.onClick = function (points, evt) {
  //  console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  //  Chart.defaults.global.colors = [rgba(0, 0, 255, 0.3)];
  // $scope.colors = [
  //      {
  //          borderColor: 'rgba(159,204,0,0.2)',
  //
  //      }, {
  //           borderColor: 'rgba(159,204,0,0.2)',
  //
  //       } , {
  //            borderColor: 'rgba(159,204,0,0.2)',
  //
  //        }  ];
  $scope.options = {
    // elements: {
    //   line: {
    //     borderWidth: 20,
    //     fill: false,
    //   //  borderColor: 'hsla(120, 60%, 70%, 0.3)'
    //
    //   },
    //   point: {
    //     radius: 0
    //   }
    // },
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };

  $http({
    method: 'POST',
    url: 'https://upmob.ru/api/getMyApps',
    data : {
      'token' : $window.localStorage.getItem("token")
    }
  }).then(function successCallback(response) {
    apps = response.data.apps;
  }, function errorCallback(response) {
  //  alert('ошибка');
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
  //$scope.datePicker.date = {startDate: null, endDate: null};

  $scope.getStats = function(){
    if (isStatsRequested) {
      return;
    }
    isStatsRequested = true;
    //console.log("$scope.getStats");
    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/getOrderStatistic',
      data : {

        'bundle' : bundle,
        'typeOs' : typeOs,
        'token' : $window.localStorage.getItem("token"),

        'day1' : newD.startDate.format("DD"),
        'month1' : newD.startDate.format("MM"),
        'year1' : newD.startDate.format("YYYY"),

        'day2' : newD.endDate.format("DD"),
        'month2' : newD.endDate.format("MM"),
        'year2' : newD.endDate.format("YYYY")

      }
    }).then(function successCallback(response) {
    //   console.log("response stats = " + response.data.response);
    // if (response.data.response != 1) {
    //   return;
    // }
      if (installsData.length > 0) {
        installsData = [];
        orderSearchKeys = [];
      }
      for (var myOrder in response.data){

        var employers_dates = response.data[myOrder].employers_dates;

        if (employers_dates.length > 0) {
        //  console.log("employers_dates.length = " + employers_dates.length);

          var searchReq = response.data[myOrder].search_request;
          if (searchReq != undefined || searchReq != "") {
              orderSearchKeys.push(response.data[myOrder].search_request);
          } else {
              orderSearchKeys.push("без запроса");
          }

          var installs = [];


          for (var j in dateLabels) {

            var date = dateLabels[j];

            for (var i in employers_dates) {
              var employer_date = employers_dates[i];

              // console.log("date = " + date);
              // console.log("substring = " + employer_date.date.substring(0, 10));
              if (date == employer_date.date.substring(0, 10)) {
          //      console.log("check true = " + employer_date.count_installs);
                installs.push(employer_date.count_installs);
                break;

              } else if(i == employers_dates.length - 1){
                installs.push(0);
              }
            }
        //    console.log("installs = " + installs);
          }



          installsData.push(installs);
      //    console.log("installs Data = " + installsData.length);

        }
        $scope.labels = dateLabels;
        $scope.data = installsData;
        $scope.series = orderSearchKeys;


      }
    //  console.log("installs Data = " + installsData.length);
      if (installsData.length == 0) {
      //  console.log("installs Data2 = " + installsData.length);
        $scope.graphicStyle = {
          'visibility' : 'collapse',
          'display' : 'none'
        }
        if ($scope.statTextTV == undefined) {
          $scope.statTextTV = "Выберите приложение, чтобы увидеть статистику.";
        }else {
          $scope.statTextTV = "Статистика по приложению за данный период отсутствует.";
        }

        $scope.noStatsStyle = {

          'visibility' : 'visible',
          'display' : 'block'
        }
      } else {
        $scope.noStatsStyle = {

          'visibility' : 'collapse',
          'display' : 'none'
        }
        $scope.graphicStyle = {
          'visibility' : 'visible',
          'display' : 'block'
        }
      }
      isStatsRequested = false;
    }, function errorCallback(response) {
      //alert('ошибка');
      isStatsRequested = false
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };

  $scope.getStatsReviews = function(){
    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/getOrderReviewStatistic',
      data : {

        'bundle' : bundle,
        'token' : $window.localStorage.getItem("token"),

        'day1' : newD.startDate.format("DD"),
        'month1' : newD.startDate.format("MM"),
        'year1' : newD.startDate.format("YYYY"),

        'day2' : newD.endDate.format("DD"),
        'month2' : newD.endDate.format("MM"),
        'year2' : newD.endDate.format("YYYY")

      }
    }).then(function successCallback(response) {
     console.log("response review = " + response.data);
      if (installsData.length > 0) {
        installsData = [];
        orderSearchKeys = [];
      }
      for (var myOrder in response.data){

        var employers_dates = response.data[myOrder].employers_dates_review;

        if (employers_dates.length > 0) {
        //  console.log("employers_dates.length = " + employers_dates.length);
          orderSearchKeys.push(response.data[myOrder].search_request);
          var installs = [];


          for (var j in dateLabels) {

            var date = dateLabels[j];

            for (var i in employers_dates) {
              var employer_date = employers_dates[i];

            //  console.log("date = " + date);
            //  console.log("substring = " + employer_date.date.substring(0, 10));
              if (date == employer_date.date.substring(0, 10)) {
              //  console.log("check true = " + employer_date.count_reviews);
                installs.push(employer_date.count_reviews);
                break;

              } else if(i == employers_dates.length - 1){
                installs.push(0);
              }
            }
          //  console.log("installs = " + installs);
          }



          installsData.push(installs);
          //console.log("installs Data = " + installsData.length);

        }
        $scope.labels = dateLabels;
        $scope.data = installsData;
        $scope.series = orderSearchKeys;


      }
    //  console.log("installs Data = " + installsData.length);
      if (installsData.length == 0) {
      //  console.log("installs Data2 = " + installsData.length);
        $scope.graphicStyle = {
          'visibility' : 'collapse',
          'display' : 'none'
        }
        if ($scope.statTextTV == undefined) {
          $scope.statTextTV = "Выберите приложение, чтобы увидеть статистику.";
        }else {
          $scope.statTextTV = "Статистика по приложению за данный период отсутствует.";
        }

        $scope.noStatsStyle = {

          'visibility' : 'visible',
          'display' : 'block'
        }
      } else {
        $scope.noStatsStyle = {

          'visibility' : 'collapse',
          'display' : 'none'
        }
        $scope.graphicStyle = {
          'visibility' : 'visible',
          'display' : 'block'
        }
      }
    }, function errorCallback(response) {
      alert('ошибка');
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };
  //$scope.statTextTV = "Выберите приложение, чтобы увидеть статистику.";
  $scope.showApps = function(){
  //  console.log("showApps = "  + apps.length)
    $scope.apps = apps;
    if (apps.length > 0) {

      $scope.appsListStyle = {
        'visibility' : 'visible',
      }
    }
  };

  $scope.getAppName = function(appBundle, appName, type_os){

   console.log("showApps = "  + appName + " (" + appName + ")");
    bundle = appBundle;
    typeOs = type_os;
    $scope.selectBTN = appName + " (" + bundle + ")";

    if ($scope.type == "Поисковый запрос") {
      $scope.getStats();
    } else {
      $scope.getStatsReviews();
    }

  };

  //if ($window.localStorage.getItem("bundle") != undefined) {

    // setTimeout(function() {
    //   bundle = $window.localStorage.getItem("bundle");
    //   typeOs = $window.localStorage.getItem("typeos");
    //   var appName = $window.localStorage.getItem("appname");
    //   $scope.selectBTN = appName + " (" + bundle + ")";
    // //  console.log("$scope.selectBTN = " + $scope.selectBTN);
    //   if ($scope.type == "Поисковый запрос") {
    //     $scope.getStats();
    //   } else {
    //     $scope.getStatsReviews();
    //
    //   }
    //
    // }, 1000);

    dateLabels = getDates($scope.date.startDate, $scope.date.endDate);

    $scope.$watch('date', function(newDate) {
      newD = newDate;
      dateLabels = getDates(newDate.startDate, newDate.endDate);

      if ($window.localStorage.getItem("bundle") != undefined) {
        bundle = $window.localStorage.getItem("bundle");
        typeOs = $window.localStorage.getItem("typeos");
        var appName = $window.localStorage.getItem("appname");
        $scope.selectBTN = appName + " (" + bundle + ")";
    //  console.log("getDates");
      if ($scope.type == "Поисковый запрос") {
        $scope.getStats();
      } else {
        $scope.getStatsReviews();

      }
    } else {
      $scope.statTextTV = "Выберите приложение, чтобы увидеть статистику.";
    }

    //  console.log('New date set: ', newDate.startDate.format("DD MM YYYY"));
    //  console.log('dates = ', getDates(newDate.startDate, newDate.endDate));
    }, false);


});


function getDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate);
  var stopDate = moment(stopDate);
  while (currentDate <= stopDate) {
    dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
};

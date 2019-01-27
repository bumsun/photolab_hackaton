// var app = angular.module('siteModule', ['daterangepicker' , 'chart.js', 'ngRoute']);
var apps = {};
var newD = {};
var bundle = "";
var typeOs = "";
var installsDataHistory = [];
var dateLabelsHistory = [];
var orderSearchKeysHistory = [];
app.controller('myHistoryController', function($scope, $http, $window) {
  if ($window.localStorage.getItem("token") == undefined) {
    $window.location.href = 'https://upmob.ru/auth';
    return;
  }
  $scope.date = {
    startDate: moment().subtract(6, "days"),
    endDate: moment().add(1, 'day')
  };

  var moneySpent = 0;




  dateLabelsHistory = getDates($scope.date.startDate, $scope.date.endDate);
  $scope.$watch('date', function(newDate) {
    newD = newDate;
    dateLabelsHistory = getDates(newDate.startDate, newDate.endDate);
    if ($scope.type == "Поисковый запрос") {
      $scope.getStats();
    } else {
      $scope.getStatsReviews();

    }
    console.log('New date set: ', newDate.startDate.format("DD MM YYYY"));
    console.log('dates = ', getDates(newDate.startDate, newDate.endDate));
  }, false);

  console.log("date = "  + moment().format("DD MM YYYY"))

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
        $scope.getStats();
    }
  };

  $scope.labelsHistory = dateLabelsHistory;
  $scope.seriesHistory = orderSearchKeysHistory;
  $scope.dataHistory = installsDataHistory;

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
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
    alert('ошибка');
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
  //$scope.datePicker.date = {startDate: null, endDate: null};

  $scope.getStats = function(){
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
      console.log("response = " + response.data);
      if (installsDataHistory.length > 0) {
        installsDataHistory = [];
        orderSearchKeysHistory = [];
        moneySpent = 0;
      }
      for (var myOrder in response.data){

        var employers_dates = response.data[myOrder].employers_dates;

        if (employers_dates.length > 0) {
          console.log("employers_dates.length = " + employers_dates.length);

var searchReq = response.data[myOrder].search_request;
          if (searchReq != undefined || searchReq != "") {
              orderSearchKeysHistory.push(response.data[myOrder].search_request);
          } else {
              orderSearchKeysHistory.push("без запроса");
          }

          var installs = [];


          for (var j in dateLabelsHistory) {

            var date = dateLabelsHistory[j];

            for (var i in employers_dates) {
              var employer_date = employers_dates[i];

            //  console.log("date = " + date);
            //  console.log("substring = " + employer_date.date.substring(0, 10));
              if (date == employer_date.date.substring(0, 10)) {
              //  console.log("check true = " + employer_date.count_installs);
              if (response.data[myOrder].type_os == "ios"){
                var countInstall = response.data[myOrder].price_one_install  - (response.data[myOrder].price_app_in_store * 0.7);
                if (response.data[myOrder].good_review_top) {
                  //countInstall -= 4;
                }
                if (response.data[myOrder].open_3_day) {
                  //countInstall -= 4;
                }
                if (response.data[myOrder].with_review) {
                  //countInstall -= 4;
                }
                moneySpent += employer_date.count_installs * countInstall;
                installs.push(employer_date.count_installs * countInstall);
              } else {
                var countInstall = response.data[myOrder].price_one_install  - (response.data[myOrder].price_app_in_store * 0.7);
                if (response.data[myOrder].good_review_top) {
                  //countInstall -= 2;
                }
                if (response.data[myOrder].open_3_day) {
                  //countInstall -= 2;
                }
                if (response.data[myOrder].with_review) {
                  //countInstall -= 2;
                }
                moneySpent += employer_date.count_installs * countInstall;
                installs.push(employer_date.count_installs * countInstall);
              }
                break;

              } else if(i == employers_dates.length - 1){
                installs.push(0);
              }
            }
          //  console.log("installs = " + installs);
          }



          installsDataHistory.push(installs);
          console.log("installs Data = " + installsDataHistory.length);

        }
        $scope.labelsHistory = dateLabelsHistory;
        $scope.dataHistory = installsDataHistory;
        $scope.seriesHistory = orderSearchKeysHistory;
        $scope.moneySpent = "Потрачено в сумме: " + parseInt(moneySpent) + " руб.";


      }
      console.log("installs Data = " + installsDataHistory.length);
      if (installsDataHistory.length == 0) {
        console.log("installs Data2 = " + installsDataHistory.length);
        $scope.graphicStyleHistory = {
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
        $scope.graphicStyleHistory = {
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
      console.log("response = " + response.data);
      if (installsDataHistory.length > 0) {
        installsDataHistory = [];
        orderSearchKeysHistory = [];
        moneySpent = 0;
      }
      for (var myOrder in response.data){

        var employers_dates = response.data[myOrder].employers_dates_review;

        if (employers_dates.length > 0) {
          console.log("employers_dates.length = " + employers_dates.length);
          orderSearchKeysHistory.push(response.data[myOrder].search_request);
          var installs = [];


          for (var j in dateLabelsHistory) {

            var date = dateLabelsHistory[j];

            for (var i in employers_dates) {
              var employer_date = employers_dates[i];

            //  console.log("date = " + date);
            //  console.log("substring = " + employer_date.date.substring(0, 10));
              if (date == employer_date.date.substring(0, 10)) {
                if (response.data[myOrder].type_os == "ios"){
                  var countInstall = response.data[myOrder].price_one_install - 4 - (response.data[myOrder].price_app_in_store * 0.7);
                  if (response.data[myOrder].good_review_top) {
                    countInstall -= 4;
                  }
                  if (response.data[myOrder].open_3_day) {
                    countInstall -= 4;
                  }
                  if (response.data[myOrder].with_review) {
                    countInstall -= 4;
                  }
                  moneySpent += employer_date.count_reviews * countInstall;
                  installs.push(employer_date.count_reviews * countInstall);
                } else {
                  var countInstall = response.data[myOrder].price_one_install - 2 - (response.data[myOrder].price_app_in_store * 0.7);
                  if (response.data[myOrder].good_review_top) {
                    countInstall -= 2;
                  }
                  if (response.data[myOrder].open_3_day) {
                    countInstall -= 2;
                  }
                  if (response.data[myOrder].with_review) {
                    countInstall -= 2;
                  }
                  moneySpent += employer_date.count_reviews * countInstall;
                  installs.push(employer_date.count_reviews * countInstall);
                }
              //  installs.push(employer_date.count_reviews * response.data[myOrder].price_one_install);
                break;

              } else if(i == employers_dates.length - 1){
                installs.push(0);
              }
            }
            console.log("installs = " + installs);
          }



          installsDataHistory.push(installs);
          console.log("installs Data = " + installsDataHistory.length);

        }
        $scope.labelsHistory = dateLabelsHistory;
        $scope.dataHistory = installsDataHistory;
        $scope.seriesHistory = orderSearchKeysHistory;
        $scope.moneySpent = "Потрачено в сумме: " + parseInt(moneySpent) + " руб.";

      }
      //console.log("installs Data = " + installsDataHistory.length);
      if (installsDataHistory.length == 0) {
      //  console.log("installs Data2 = " + installsDataHistory.length);
        $scope.graphicStyleHistory = {
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
        $scope.graphicStyleHistory = {
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
    console.log("showApps = "  + apps.length)
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

  if ($window.localStorage.getItem("bundle") != undefined) {
    setTimeout(function() {
      bundle = $window.localStorage.getItem("bundle");
      typeOs = $window.localStorage.getItem("typeos");
      var appName = $window.localStorage.getItem("appname");
      $scope.selectBTN = appName + " (" + bundle + ")";

      if ($scope.type == "Поисковый запрос") {
        $scope.getStats();
      } else {
        $scope.getStatsReviews();

      }

    }, 1000);


  }

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

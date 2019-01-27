// var app = angular.module('siteModule', ['daterangepicker' , 'chart.js', 'ngRoute']);
var apps = {};
var newD = {};
var bundle = "";
var realBundle = "";
var installsData = [];
var dateLabelsSEO = [];
var orderSearchKeys = [];
var colors = [];
var data = [];
var isWordsFound = false;
var keyWordsResponse = [];
var isClosedDropDown = true;
var typeOs = "android";

var highKeys = [];
var mediumKeys = [];
var lowKeys = [];
var dayMonthLabels = [];

var highPositions = [];
var mediumPositions = [];
var lowPositions = [];

var highSeries = [];
var mediumSeries = [];
var lowSeries = [];

var highColors = [];
var mediumColors = [];
var lowColors = [];
var allSearchRequests = [];
var invisibleStyle = {
  'visibility' : 'collapse',
  'display' : 'none'
}
var visibleStyle = {
  'visibility' : 'visible',
  'display' : 'block'
}
app.controller('mySeoController', function($scope, $http, $window) {
  if ($window.localStorage.getItem("token") == undefined) {
    $window.location.href = 'https://upmob.ru/auth';
    return;
  }
  $scope.date = {
    startDate: moment().subtract(6, "days"),
    endDate: moment()
  };
  installsData = [];
  dateLabelsSEO = [];
  orderSearchKeys = [];
  colors = [];
  data = [];



  dateLabelsSEO = getDatesSEO($scope.date.startDate, $scope.date.endDate);
  dayMonthLabels = getDaysMonthes($scope.date.startDate, $scope.date.endDate);

  console.log("date = "  + moment().format("DD MM YYYY"))

  $scope.type = "Отзывы";

  $scope.reviewsClicked = function(){
    $scope.type = "Отзывы";
  };

  $scope.searchRequestClicked = function(){
    $scope.type = "Поисковый запрос";
  };

  // $scope.labels = dateLabels;
  // $scope.series = orderSearchKeys;
  // $scope.dataSEO = installsData;

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];

  $scope.options = {

    elements: {
      line: {
        borderWidth: 10,
        fill: false,
        //  borderColor: 'hsla(120, 60%, 70%, 0.3)'

      },
      gridLines: {
         display: false
       },
      point: {
        radius: 0
      }
    },
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            labelString: 'Позиция',
            display : true,
            reverse: true
          }
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

  });

  $scope.sendRequest = function (url){
    var realUrl = url;
    if (realUrl == undefined){
      realUrl = $scope.packageET;
    }

    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/getAppInfo',
      //bundle
      data:{'url' : realUrl
    }
  }).then(function successCallback(response) {
    //alert(response.data.response);
    console.log("response = " + response.data);
    if (response.data.response != 1) {
      return;
    }

    if (response.data.type_os == "ios") {
      $scope.getAppName(response.data.info.appId, response.data.info.app_name, response.data.type_os, response.data.info.id);
    } else {
      $scope.getAppName(response.data.info.store_id, response.data.info.title, response.data.type_os, response.data.info.id);

    }





  }, function errorCallback(response) {
    alert('ошибка');

  });
  };

  $scope.graphicStyleSEO = invisibleStyle;
  if ($scope.statTextTV == undefined) {
    if (apps.length > 0) {
      $scope.statTextTV = "Выберите приложение, чтобы увидеть статистику.";
    } else {
      $scope.statTextTV = "Создайте заказ и вы сможете увидеть анализ по приложению.";

    }
  }
  $scope.noStatsStyleSEO = visibleStyle;
  $scope.requestsTabelStyle = invisibleStyle;
  $scope.progressStyle = invisibleStyle;

  $scope.upgradeClick = function(index, word){
    console.log("budle = " + realBundle + " word = " + word);
    $window.open('https://upmob.ru/neworder' + "?bundle=" + realBundle + "&word=" + word + "&os=" + typeOs, '_blank');
    //$window.location.href = 'https://upmob.ru/neworder' + "?bundle=" + bundle + "&word=" + word;

  }
  $scope.getStats = function(){
    $scope.requestsTabelStyle = invisibleStyle;
    $scope.progressStyle = visibleStyle;
    $scope.noStatsStyleSEO = invisibleStyle;
    $scope.graphicStyleSEO = invisibleStyle;

    console.log("getKeyWordsHistory bundle = " + bundle);
    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/getKeyWordsHistory',
      data : {

        'bundle' : bundle,
        'typeOs' : typeOs


      }
    }).then(function successCallback(response) {

      data = response.data.data.content;
      //console.log("response = " + data.length);
      if (installsData.length > 0) {
        installsData = [];
        orderSearchKeys = [];
      }

      $scope.labelsSEO = dateLabelsSEO;



      var timerId = setInterval(function() {
        if (isWordsFound) {

          $scope.sortResponses();
          clearInterval(timerId);
        }
      }, 300);
    }, function errorCallback(response) {
      console.log("getKeyWordsHistory error response = " + response);
    //  alert('ошибка');
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };
  //$scope.statTextTV = "Выберите приложение, чтобы увидеть статистику.";
  $scope.showApps = function(){
    console.log("showApps = "  + apps.length)
    $scope.apps = apps;
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
  $scope.checkClicked = function(){
    var finalPositions = [];
    var finalSeries = [];
    var finalColors = [];

  if (!$scope.highCheck && !$scope.mediumCheck && !$scope.lowCheck) {
    $scope.highCheck = true;
    $scope.checkClicked();
    return;
  }
     if ($scope.highCheck) {
     finalPositions = finalPositions.concat(highPositions);
     finalSeries = finalSeries.concat(highSeries);
     finalColors = finalColors.concat(highColors);
     console.log("final pos h = " + finalPositions);
     }
     if ($scope.mediumCheck) {
       finalPositions = finalPositions.concat(mediumPositions)
       finalSeries = finalSeries.concat(mediumSeries);
       finalColors = finalColors.concat(mediumColors);
console.log("final pos m = " + finalPositions);
     }
     if ($scope.lowCheck) {
       finalPositions = finalPositions.concat(lowPositions)
       finalSeries = finalSeries.concat(lowSeries);
       finalColors = finalColors.concat(lowColors);
       console.log("final pos l = " + finalPositions);
     }
     $scope.dataSEO = finalPositions;
     $scope.series = finalSeries;
     $scope.colors = finalColors;

     if (finalPositions.length == 0) {

      if ($scope.highCheck == false && $scope.mediumCheck == false && $scope.lowCheck == false) {
        $scope.highCheck = true;
        $scope.mediumCheck = true;
        $scope.lowCheck = true;
        $scope.checkClicked();
      }



     }

  };
  $scope.getAppName = function(appBundle, appName, type_os, appstore_id){

    console.log("showApps = "  + appName + " (" + appName + ")");
    console.log("getAppName type_os = "  + type_os);
    isClosedDropDown = true;
    $scope.appsListStyle = {

      'visibility' : 'collapse',
      'display' : 'none'


    }
    bundle = appBundle;
    realBundle = appBundle;
    var url = "";
    if (type_os == "android") {
      url = "https://play.google.com/store/apps/details?id=" + bundle;
      typeOs = "android";
    } else {
      url = "https://itunes.apple.com/ru/app/id" + appstore_id;
      typeOs = "Iphone";
      realBundle = appstore_id;
    }
    bundle = url;
    $scope.packageET = url;
    console.log("bundle = " + bundle);
    console.log("typeOs = " + typeOs);
  //  $scope.sendRequest(url);
    $scope.getStats();
    $scope.getKeyWordsQuality();
  };

  if ($window.localStorage.getItem("bundle") != undefined) {

    // bundle = $window.localStorage.getItem("bundle");
    // var appName = $window.localStorage.getItem("appname");
    $scope.selectBTN = "Выберите приложение";

    //  $scope.getStats();
  }

  $scope.getKeyWordsQuality = function(){
    console.log("getKeyWordsQuality bundle = " + bundle);
    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/getKeyWordsQuality',
      data : {
        'bundle' : bundle,
        'typeOs' : typeOs
      }
    }).then(function successCallback(response) {
      isWordsFound = true;
      keyWordsResponse = response.data.data.content;
    }, function errorCallback(response) {

    });

  };

  $scope.sortResponses = function (){
    highKeys = [];
    mediumKeys = [];
    lowKeys = [];

    highPositions = [];
    mediumPositions = [];
    lowPositions = [];

    highSeries = [];
    mediumSeries = [];
    lowSeries = [];

     highColors = [];
     mediumColors = [];
     lowColors = [];

    allSearchRequests = [];
    //console.log("keyWordsResponse size = " + keyWordsResponse.length);
    var j = 0;
    for (var search_request in data){
      //  console.log("search_request = " + search_request);
      for (var i = 0; i < keyWordsResponse.length; i++ ) {
        //  console.log(" i = " + i);
        var keyObject = keyWordsResponse[i];
        if (search_request.toLowerCase() == keyObject.word.toLowerCase()) {


          if (keyObject.popularity == "high") {
            //  console.log("word = " + keyObject.word + " search_request = " + search_request);

            highKeys.push(addMissedDays(data[search_request], keyObject.popularity));

          } else if (keyObject.popularity == "medium") {
            mediumKeys.push(addMissedDays(data[search_request], keyObject.popularity));
          } else if (keyObject.popularity == "low"){
            lowKeys.push(addMissedDays(data[search_request], keyObject.popularity));
          }
          break;


        }

      }
    }

    $scope.day1 = dayMonthLabels[0];
    $scope.day2 = dayMonthLabels[1];
    $scope.day3 = dayMonthLabels[2];
    $scope.day4 = dayMonthLabels[3];
    $scope.day5 = dayMonthLabels[4];
    $scope.day6 = dayMonthLabels[5];
    $scope.day7 = dayMonthLabels[6];


    if (highPositions.length == 0) {
      $scope.checkClicked();
    } else {
      $scope.dataSEO = highPositions;
      $scope.series = highSeries;
      $scope.colors = highColors;
      $scope.highCheck = true;
    }

    console.log("highPositions size = " + highPositions.length);
    console.log("highSeries size = " + highSeries.length);

    allSearchRequests = allSearchRequests.concat(highKeys);
    allSearchRequests = allSearchRequests.concat(mediumKeys);
    allSearchRequests = allSearchRequests.concat(lowKeys);

    $scope.noStatsStyleSEO = invisibleStyle;
    $scope.progressStyle = invisibleStyle;
    $scope.graphicStyleSEO = visibleStyle;
    $scope.requestsTabelStyle = visibleStyle;

    if (highKeys.length == 0) {
      $scope.keyWordsResponse = allSearchRequests;
    } else {
      $scope.keyWordsResponse = highKeys;
    }
    $scope.$apply();

  };

  $scope.filtering = function(){

    if ($scope.filterTextET == undefined || $scope.filterTextET == "") {
      if (highKeys.length == 0) {
        $scope.keyWordsResponse = allSearchRequests;
      } else {
        $scope.keyWordsResponse = highKeys;
      }

      return;
    }

    var positiveArr = allSearchRequests.filter(function(highKey) {
      //console.log("highKey = " + highKey);
      return highKey[0].word.indexOf($scope.filterTextET) !== -1;
    });
    $scope.keyWordsResponse = positiveArr;

  };


});
app.directive('keywords', function() {

  return {
    restrict : "E",
    templateUrl: 'keywordsTemplate.html',
    link : function(scope, element, attrs) {

    }
  }

});
function addMissedDays(req, level) {
  var searches = req.reverse();
  var weekInstalls = [];
  var searchReq = "";
  var highColor = {
    borderColor: 'rgba(51,192,255,0.02)'
  }
  var mediumColor = {
    borderColor: 'rgba(255,46,45,0.02)'
  }
  var lowColor = {
    borderColor: 'rgba(25,255,60,0.02)'
  }

  for (var i = 0; i < 7; i++) {

    if (i < searches.length) {
      if (i > 0) {
        var lastPos = searches[i-1].position;
        var currPost = searches[i].position;
        if (lastPos > currPost) {
          searches[i].interval = (lastPos - currPost);
        } else if (lastPos < currPost){
          searches[i].interval = (lastPos - currPost);
        }
      }

    } else {
      searches[i] = {
        "position" : searches[i-1].position,
        "word" : searches[i-1].word
      }
    }
    weekInstalls.push(searches[i].position);

  }
  searchReq = searches[0].word;

  if (level == "high") {

    highPositions.push(weekInstalls);
    highSeries.push(searchReq);
    highColors.push(highColor);
  } else if (level == "medium") {
    mediumPositions.push(weekInstalls);
    mediumSeries.push(searchReq);
    mediumColors.push(highColor);
  } else {
    lowPositions.push(weekInstalls);
    lowSeries.push(searchReq);
    lowColors.push(highColor);
  }

  return searches;
}
function getDatesSEO(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate);
  var stopDate = moment(stopDate);
  while (currentDate <= stopDate) {
    dateArray.push( moment(currentDate).format('DD/MM') )
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
};
function getDaysMonthes(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate);
  var stopDate = moment(stopDate);
  while (currentDate <= stopDate) {
    dateArray.push( moment(currentDate).format('DD/MM') )
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
};

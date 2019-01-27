var app = angular.module('siteModule', ['ngRoute', 'ngMaterial', 'ngclipboard', 'angularCroppie']);
var croppedFile = {};
var allScope = {};
var fakeUrl = "";
var realUrl = "";
var canvas = {};
var differences = [];
var visStyle =  {
  'visibility' : 'visible',
  'display' : 'block'
};
var invisStyle =  {

  'visibility' : 'collapse',
  'display' : 'none'

};
var visStyleInline =  {
  'visibility' : 'visible',
  'display' : 'flex'
};


app.controller('mainController', function($scope, $http, $window,$route, $routeParams, $location, $mdDialog, $document, $mdToast) {
  allScope = $scope;
  $scope.cropped = {
    source: 'https://raw.githubusercontent.com/Foliotek/Croppie/master/demo/demo-1.jpg'
  };
  $scope.fakeUrl = '/icon/text_3.png';
  $scope.realUrl = '/icon/text-1.png';
  $scope.addPhoto = function(){
    console.log("button clicked");

  }
  var img = document.getElementById("fakeImage");
  canvas = document.getElementById("gameCanvas");
  canvas.style.position = "absolute";
  canvas.style.left = img.offsetLeft;
  canvas.style.top = img.offsetTop;
  $scope.reloadPhoto = function(){
    $scope.fakeUrl = "";
    fakeUrl = "";
    $scope.sendToServer();
  };
  $scope.sendToServer = function(){
    $scope.loadingPhoto = visStyleInline;
    $scope.regularStyle = visStyle;
    $scope.cropperPickStyle = invisStyle;
    // canvas.getContext("2d").clear(true);
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    var fd = new FormData();
    var imgBlob = dataURItoBlob($scope.cropped.image);
    fd.append('file1', imgBlob, 'file1.jpg');
    $http.post(
      'http://78.46.19.175/api/registerUser',
      fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      }
    ).then(function successCallback(response) {
      $scope.loadingPhoto = invisStyle;
      console.log(response.data);
      console.log(response.data.fake_url);
      fakeUrl = response.data.fake_url;
      realUrl = response.data.original_url;
      $scope.fakeUrl = fakeUrl;
      $scope.realUrl = realUrl;
      $scope.findDifferences();
    }, function errorCallback(response) {
      console.log(response);
    });

    $scope.findDifferences = function(){
      $http({
        method: 'POST',
        url: 'http://78.46.19.175/api/findDifference',
        data : {
          'image_url_1' : realUrl,
          'image_url_2' : fakeUrl

        }
      }).then(function successCallback(response) {
        console.log("findDifference = " + response.data);
        differences = response.data;


      }, function errorCallback(response) {
        console.log(response);
      });
    }

    canvas.addEventListener("mousedown", function (e) {
      getCursorPosition(canvas, e);
    });
    $scope.showAllDifferences = function(){
      for (var i = 0; i < differences.length; i++) {
        var item =  differences[i];
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        //ctx.arc(item.x + item.w/2, item.y + item.h/2, item.w/2, 0, 2*Math.PI, false);
        ctx.rect(item.x, item.y, item.w, item.h);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#11f600';
        ctx.stroke();
      }
    };
    function getCursorPosition(canvas, event) {
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      console.log("x: " + x + " y: " + y);

var deleteIndex = -1;
      for (var i = 0; i < differences.length; i++) {

        var item = differences[i];
        if (x >= item.x && y >= item.y && x <= (item.x + item.w) && y <= (item.y + item.h)) {
          console.log("x: " + item.x + " y: " + item.y + " w: " + (item.w + item.x) + " h: " + (item.y + item.h));
          console.log("detected");
           deleteIndex = i;
           var ctx = canvas.getContext("2d");
           ctx.beginPath();
           //ctx.arc(item.x + item.w/2, item.y + item.h/2, item.w/2, 0, 2*Math.PI, false);
           ctx.rect(item.x, item.y, item.w, item.h);
           ctx.lineWidth = 3;
           ctx.strokeStyle = '#11f600';
           ctx.stroke();
           break;
        }

      }
      if (deleteIndex != -1) {
        differences.splice(deleteIndex, 1);
      }


    }


  }
  function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  // Assign blob to component when selecting a image
  $('#upload').on('change', function () {
    var input = this;

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        // bind new Image to Component
        $scope.$apply(function () {
          $scope.cropped.source = e.target.result;
          $scope.regularStyle = invisStyle;
          $scope.cropperPickStyle = visStyle;

        });
      }

      reader.readAsDataURL(input.files[0]);
    }
  });


});

app.directive('file', function () {
  return {
    scope: {
      file: '='
    },
    link: function (scope, el, attrs) {
      el.bind('change', function (event) {
        var file = event.target.files[0];
        scope.file = file ? file : undefined;
        scope.$apply();
      });
    }
  };
});
app.directive("fileread", [
  function() {
    return {
      scope: {
        fileread: "="
      },
      link: function(scope, element, attributes) {
        element.bind("change", function(changeEvent) {
          var reader = new FileReader();
          reader.onload = function(loadEvent) {
            scope.$apply(function() {
              scope.fileread = loadEvent.target.result;
            });
          }
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  }
]);

// var app = angular.module("siteModule", ["ngRoute"]);
//Модуль находтся в файле authorization.html
var invisibleStyle = {
  'visibility' : 'collapse',
  'display' : 'none'
}
var visibleStyle = {
  'visibility' : 'visible',
  'display' : 'block'
}
app.controller('registrationController', function($scope, $http, $window, $cacheFactory, $mdDialog, $location) {
  //Срабатывает при клипе по кнопке Регистрация, после заполнения формы, проверок на пустые строки нет.
  console.log("registrationController start");
  if ($window.localStorage.getItem("token") != undefined) {
    $window.location.href = 'https://upmob.ru/neworder';
    return;
  }
var pasHash = $location.search().hash;
$scope.promoTVClicked = function() {
  $scope.promoTVStyle = invisibleStyle;
  $scope.promoETStyle = visibleStyle;

};
var changePassController = function ($scope, dataToPass, $mdDialog, $window, $http) {

  $scope.changePass = function() {

    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/setPassword',
      data : {
        'old_pass_hash' : pasHash,
        'new_pass_hash' : SHA256($scope.newPasswordET)
      }
    }).then(function successCallback(response) {

      if (response.data.response == 1) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Пароль успешно изменен')
          .textContent('Авторизуйтесь, используя новый пароль.')
          .ok('Ок')

        );
      }

    }, function errorCallback(response) {
console.log(response);
    });

      $mdDialog.hide();


  };

  $scope.cancelChangePass = function() {

    $mdDialog.hide();
  };
}

  if (pasHash != undefined) {
    $mdDialog.show({
      controller: changePassController,
      templateUrl: 'changePassDialog.html',
      dataToPass:{"asd" : "asdasd"},
      //  parent: angular.element(document.body),,
      focusOnOpen: false,

      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      console.log("OK");
    }, function() {
      console.log("Cancel");
    });
  }



  $scope.forgotPass = function(ev){

    var confirm = $mdDialog.prompt()
         .title('Восстановление пароля')
         .textContent('Введите свой email.')
         .clickOutsideToClose(true)
         .targetEvent(ev)

         .ok('Отправить');


       $mdDialog.show(confirm).then(function(result) {

         $http({
           method: 'POST',
           url: 'https://upmob.ru/api/forgotPassword',
           data:{
             'email' : result
           }
         }).then(function successCallback(response) {
           if (response.data.response == -1) {
             $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.querySelector('#popupContainer')))
               .clickOutsideToClose(true)
               .title('Неверный email')
               .textContent('Проверьте правильность введенного email')
               .ok('Ок')
               .targetEvent(ev)
             );
           }
           if (response.data.response == 1) {
             $mdDialog.show(
               $mdDialog.alert()
               .parent(angular.element(document.querySelector('#popupContainer')))
               .clickOutsideToClose(true)
               .title('Завершите восстановление пароля')
               .textContent('Письмо успешно отправлено на ваш email')
               .ok('Ок')
               .targetEvent(ev)
             );
           }
           console.log(response.data);

         }, function errorCallback(response) {

         });
       }, function() {

       });


  };


  $scope.registration = function(ev) {

    if ($scope.emailET == undefined ||
      $scope.passwordET == undefined ||
      $scope.userNameET == undefined ||
      // $scope.phoneVal == undefined ||
      $scope.emailET == "" ||
      $scope.passwordET == "" ||
      $scope.userNameET == ""
      // $scope.phoneVal == ""
      ) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Не все поля заполнены')
          .textContent('Пожалуйста, заполните все данные')
          .ok('Закрыть')
          .targetEvent(ev)
        );
        return;
      }
//alert($location.search().referal);
      $http({
        method: 'POST',
        url: 'https://upmob.ru/api/registerCustomer',
        data:{'email' : $scope.emailET.toLowerCase(),
        'pass_hash' :  SHA256($scope.passwordET),
        'first_name' : $scope.userNameET,
        // 'phone' : $scope.phoneVal,
        'promo_id' : $location.search().referal,
        'promocode' : $scope.promoET
      }
    }).then(function successCallback(response) {
      if (response.data.response == -1) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Ошибка')
          .textContent('Такой почтовый ящик уже используется')
          .ok('Закрыть')
          .targetEvent(ev)
        );
        return;
      }
      if (response.data.response == 1) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Завершите регистрацию')
          .textContent('На ваш почтовый ящик отправлено письмо с ссылкой для подтверждения регистрации')
          .ok('Ок')
          .targetEvent(ev)
        );


      }


      console.log(response.data);

    }, function errorCallback(response) {

    });

  };




  //Срабатывает при клике по кнопке Логин.
  $scope.auth = function(ev) {


    $http({
      method: 'POST',
      url: 'https://upmob.ru/api/authCustomer',
      data:{'email' : $scope.authEmailET.toLowerCase(),
       'pass_hash' : SHA256($scope.authPasswordET)}
    }).then(function successCallback(response) {

      console.log(response.data.response);
      if (response.data.response == -1) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Неверный логин или пароль')
          .textContent('Попробуйте еще раз')
          .ok('Закрыть')
          .targetEvent(ev)
        );
        return;
      }
      if (response.data.response == 1) {
        $window.localStorage.setItem("token", response.data.token);
        $window.localStorage.setItem("email", response.data.email);
        $window.location.href = 'http://upmob.ru/neworder';
      }
    }, function errorCallback(response) {
      //  alert('ошибка');


      // $location.path('file:///Users/spbiphones/Documents/site/site.html');
      // $location.replace();
      //expect($location.path()).toBe('/a');



    });

  };
});
app.directive('phoneInput', function($filter, $browser) {
  return {
    require: 'ngModel',
    link: function($scope, $element, $attrs, ngModelCtrl) {
      var listener = function() {
        var value = $element.val().replace(/[^0-9]/g, '');
        $element.val($filter('tel')(value, false));
      };

      // This runs when we update the text field
      ngModelCtrl.$parsers.push(function(viewValue) {
        return viewValue.replace(/[^0-9]/g, '').slice(0,10);
      });

      // This runs when the model gets updated on the scope directly and keeps our view in sync
      ngModelCtrl.$render = function() {
        $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
      };

      $element.bind('change', listener);
      $element.bind('keydown', function(event) {
        var key = event.keyCode;
        // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
        // This lets us support copy and paste too
        if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
          return;
        }
        $browser.defer(listener); // Have to do this or changes don't get picked up properly
      });

      $element.bind('paste cut', function() {
        $browser.defer(listener);
      });
    }

  };
});
app.filter('tel', function () {
  return function (tel) {
    console.log(tel);
    if (!tel) { return ''; }

    var value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    var country, city, number;

    switch (value.length) {
      case 1:
      case 2:
      case 3:
      city = value;
      break;

      default:
      city = value.slice(0, 3);
      number = value.slice(3);
    }

    if(number){
      if(number.length>3){
        number = number.slice(0, 3) + '-' + number.slice(3,7);
      }
      else{
        number = number;
      }

      return ("(" + city + ") " + number).trim();
    }
    else{
      return "(" + city;
    }

  };
});

// function SHA256(s){
//
//
//
//
//   var chrsz   = 8;
//
//
//   var hexcase = 0;
//
//
//
//
//   function safe_add (x, y) {
//
//
//     var lsw = (x & 0xFFFF) + (y & 0xFFFF);
//
//
//     var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
//
//
//     return (msw << 16) | (lsw & 0xFFFF);
//
//
//   }
//
//
//
//
//   function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
//
//
//   function R (X, n) { return ( X >>> n ); }
//
//
//   function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
//
//
//   function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
//
//
//   function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
//
//
//   function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
//
//
//   function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
//
//
//   function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
//
//
//
//
//   function core_sha256 (m, l) {
//
//
//     var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
//
//
//     var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
//
//
//     var W = new Array(64);
//
//
//     var a, b, c, d, e, f, g, h, i, j;
//
//
//     var T1, T2;
//
//
//
//
//     m[l >> 5] |= 0x80 << (24 - l % 32);
//
//
//     m[((l + 64 >> 9) << 4) + 15] = l;
//
//
//
//
//     for ( var i = 0; i<m.length; i+=16 ) {
//
//
//       a = HASH[0];
//
//
//       b = HASH[1];
//
//
//       c = HASH[2];
//
//
//       d = HASH[3];
//
//
//       e = HASH[4];
//
//
//       f = HASH[5];
//
//
//       g = HASH[6];
//
//
//       h = HASH[7];
//
//
//
//
//       for ( var j = 0; j<64; j++) {
//
//
//         if (j < 16) W[j] = m[j + i];
//
//
//         else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
//
//
//
//
//         T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
//
//
//         T2 = safe_add(Sigma0256(a), Maj(a, b, c));
//
//
//
//
//         h = g;
//
//
//         g = f;
//
//
//         f = e;
//
//
//         e = safe_add(d, T1);
//
//
//         d = c;
//
//
//         c = b;
//
//
//         b = a;
//
//
//         a = safe_add(T1, T2);
//
//
//       }
//
//
//
//
//       HASH[0] = safe_add(a, HASH[0]);
//
//
//       HASH[1] = safe_add(b, HASH[1]);
//
//
//       HASH[2] = safe_add(c, HASH[2]);
//
//
//       HASH[3] = safe_add(d, HASH[3]);
//
//
//       HASH[4] = safe_add(e, HASH[4]);
//
//
//       HASH[5] = safe_add(f, HASH[5]);
//
//
//       HASH[6] = safe_add(g, HASH[6]);
//
//
//       HASH[7] = safe_add(h, HASH[7]);
//
//
//     }
//
//
//     return HASH;
//
//
//   }
//
//
//
//
//   function str2binb (str) {
//
//
//     var bin = Array();
//
//
//     var mask = (1 << chrsz) - 1;
//
//
//     for(var i = 0; i < str.length * chrsz; i += chrsz) {
//
//
//       bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
//
//
//     }
//
//
//     return bin;
//
//
//   }
//
//
//
//
//   function Utf8Encode(string) {
//
//
//     string = string.replace(/\r\n/g,"\n");
//
//
//     var utftext = "";
//
//
//
//
//     for (var n = 0; n < string.length; n++) {
//
//
//
//
//       var c = string.charCodeAt(n);
//
//
//
//
//       if (c < 128) {
//
//
//         utftext += String.fromCharCode(c);
//
//
//       }
//
//
//       else if((c > 127) && (c < 2048)) {
//
//
//         utftext += String.fromCharCode((c >> 6) | 192);
//
//
//         utftext += String.fromCharCode((c & 63) | 128);
//
//
//       }
//
//
//       else {
//
//
//         utftext += String.fromCharCode((c >> 12) | 224);
//
//
//         utftext += String.fromCharCode(((c >> 6) & 63) | 128);
//
//
//         utftext += String.fromCharCode((c & 63) | 128);
//
//
//       }
//
//
//
//
//     }
//
//
//
//
//     return utftext;
//
//
//   }
//
//
//
//
//   function binb2hex (binarray) {
//
//
//     var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
//
//
//     var str = "";
//
//
//     for(var i = 0; i < binarray.length * 4; i++) {
//
//
//       str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
//
//
//       hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
//
//
//     }
//
//
//     return str;
//
//
//   }
//
//
//
//
//   s = Utf8Encode(s);
//
//
//   return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
//
//
//
// }

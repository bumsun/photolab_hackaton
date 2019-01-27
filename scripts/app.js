
app.config(function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
    .when("/auth", {
        templateUrl : "authorization.html",
        // controller : "registrationController"
    })
    .when("/pay", {
        templateUrl : "pay.html",
        // controller : "registrationController"
    })
    .when("/license", {
        templateUrl : "license.html",
        // controller : "registrationController"
    })
    .when("/shop", {
        templateUrl : "shop.html",
        // controller : "myShopController"
    })
    .when("/neworder", {
        templateUrl : "site2.html",
        // controller : "myAppController"
    })
    .when("/orders", {
        templateUrl : "myorders.html",
        // controller : "myOrdersController"
    })
    .when("/referals", {
        templateUrl : "referals.html",
        // controller : "myOrdersController"
    })
    .when("/seo", {
        templateUrl : "seo.html",
        // controller : "myOrdersController"
    })
    .when("/history", {
        templateUrl : "moneyHistory.html",
        // controller : "myOrdersController"
    })
    .when("/statistics", {
        templateUrl : "statistics.html",
        // controller : "myStatisticsController"
    });
    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

  //  console.log("routeProvider loaded");
    $locationProvider.html5Mode(true);
});

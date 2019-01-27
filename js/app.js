app.config(function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
    .when("/", {
        templateUrl : "main.html",
    });
    $locationProvider.html5Mode(true);
});

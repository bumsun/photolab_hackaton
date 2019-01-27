app.config(function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
    .when("/main", {
        templateUrl : "photos.html",
    });
    $locationProvider.html5Mode(true);
});

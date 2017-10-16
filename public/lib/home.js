app.controller('homeController', function($scope,$http, checkUserLogin) {
	//$scope.sliders=;
	checkUserLogin.redirectToLogin();
	$scope.myInterval = 5000;
	var slides;
	$http.get('data/home.json')
	.success(function(data, status, headers, config) {
	  $scope.slides = [];
		//console.log(data);
		$scope.slides=data;
		//console.log("from scope  "+$scope.slides[0].offerID);
		  
	}).error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
	});

}); 

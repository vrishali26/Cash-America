app.controller('changeLocController', function($scope, $http) {
	
	$http({
		method : 'GET',
		url : url+'/getStates',
	}).success(function(data, status) {
		// alert("sentto");
	$scope.states=data.States;
		
	}).error(function(data, status) {

	});
	var user_data = JSON.parse(localStorage.getItem("userdata"));
	$scope.chengeZipCode = function(zc) {
		console.log(zc);
		user_data.Zip_code=zc;
		var data_send=JSON.stringify(user_data);
		localStorage.setItem("userdata",data_send);
		var new_data= JSON.parse(localStorage.getItem("userdata"));
		$http.post(url+'/changeLocation',new_data)
		.success(function(data, status) {
			// alert("sentto");
			console.log(status);
			
		}).error(function(data, status) {
	
		});
	};
	

});

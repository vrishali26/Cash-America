var app=angular.module('app', ['ui.router'], function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider.state("login", {
        url: "/login",
        templateUrl: "Login.html"
    }).state("signup", {
        url: "/signup",
        templateUrl:"signup.html"

    }).state("Signin", {
        url: "/Signin",
        templateUrl:"Signin.html"

    }).state("sociallogin", {
        url: "/sociallogin",
        templateUrl:"sociallogin.html"

    });

});
app.controller('validateCtrl', function($scope,$http) {
    $scope.signupdata={};
		$scope.send=function(){
			console.log($scope.signupdata.Name);
			    $scope.signupdata ={
			    	"Name":$scope.signupdata.Name,
			    	
			    	"Email_Id":$scope.signupdata.Email_Id,
			    	"Zip_code":$scope.signupdata.Zip_code,
			    	"Age":$scope.signupdata.Age
			    };
			    
			      
			    // console.log($scope.signupdata);
			       if ($scope.userForm.$valid) {
                      console.log("data valid");
                  }
            
            $http.post('//172.20.131.218:3000/post',$scope.signupdata).
  			success(function(data, status) {
  				$scope.signupdata=data;
    		    alert($scope.signupdata);
         }).
           error(function(data, status) {
            alert("Not Done");
            });
            
            
            
		};
		
    
});

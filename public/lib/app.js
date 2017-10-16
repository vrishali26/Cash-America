var app=angular.module('app', ['ui.bootstrap','ui.router','facebook'], function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");
    var url;
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
        
    }).state("home", {
        url: "/home",
        templateUrl:"Home.html"

    }).state("offers", {
        url: "/offers",
        templateUrl:"offres.html"

    }).state("offersdetails", {
        url: "/offersdetails",
        templateUrl:"offersdetails.html"

    }).state("products", {
        url: "/products",
        templateUrl:"products.html"

	}).state("productsDetail", {
        url: "/productsDetail",
        templateUrl:"productsDetail.html"

	}).state("stores", {
        url: "/stores",
        templateUrl:"stores.html"

	  }).state("changeLocation", {
        url: "/changeLocation",
        templateUrl:"change_location.html"

	  }).state("storesdetails", {
        url: "/storesdetails",
        templateUrl:"storesdetails.html"
        
	  });
});

app.config(function(FacebookProvider) {
          FacebookProvider.init('1374997872738828');
});
app.run(function($http) {
     //$http.get('properties/cash_america.properties').then(function (response) {
     	//url="http://localhost:5000";
		url="http://172.20.131.229:5000";
	 // });
});


app.controller('fbcontroller', function ($scope, Facebook, checkUserLogin) {
	checkUserLogin.checkLogin();
          $scope.loginStatus = 'disconnected';
          $scope.facebookIsReady = false;
          $scope.user = null;

          $scope.login = function () {
			  Facebook.login(function(response) {
              $scope.loginStatus = response.status;
			  if($scope.loginStatus == "connected"){
				 Facebook.api('/me', function(response) {
             		 $scope.user = response;
					 
					 $http.post(url+'/facebookLogin',$scope.user)
  				.success(function(data, status) {
					// console.log('0');
        	  }).
          	   error(function(data, status) {
          			// console.log('1');
           	  });
			  
           		 });
			  }
			   
			      
            });
          };

        });

app.controller('socialCtrl', function(checkUserLogin){
	checkUserLogin.checkLogin();
});

app.controller('validateCtrl', function($scope,$http, $state, checkUserLogin) {
	checkUserLogin.checkLogin();
    $scope.signupdata={};
		$scope.send=function(){
			    $scope.signupdata ={
			    	"user_name":$scope.signupdata.Name,
			    	"Email_Id":$scope.signupdata.Email_Id,
			    	"Zip_code":$scope.signupdata.Zip_code,
			    	"Age":$scope.signupdata.Age,
			    	"gender":$scope.signupdata.gender
			    };
	       if ($scope.signupdata.user_name && $scope.signupdata.Email_Id && $scope.signupdata.Zip_code && $scope.signupdata.Age ) {
             //alert(2);
             $http.post(url+'/signup',$scope.signupdata).success(function(data, status) {
                  localStorage.setItem("userData", JSON.stringify(data));
                  $scope.retrievedObject = localStorage.getItem('data');
				  $state.go('home');
                  console.log($scope.retrievedObject);
                }).error(function(data, status) {
				 console.log('status: '+data);
                 	alert("Not Done");
                });
          }else{
              //alert(0);
              $state.go('signup');
          }
              
        		
  
			   // console.log($scope.signupdata);    
		};
		$scope.sentto=function(){
			$http({method:'GET', url:url+'/validateuser',params:{"user_name":$scope.signupdata.Name}}) 
  			.success(function(data, status) {
  				// alert("sentto");
                    console.log(data);
  				  		 if(data == 1){
  				  		 	   $scope.boleanvalue=false;
  				  		    }
  				  	     else{
  				  			 $scope.boleanvalue=true;
  				  			 $scope.changegreen=function(){
			                   $scope.boleanvalue=false;
		                      };
  				  						  			
  			  		}
   		
         }).error(function(data, status) {
             
            });
		
		};
		
		
		  $scope.senttovalidate=function(){
			  	  $scope.boleanemail=false;
			  	  if(/^[a-zA-Z0-9- ]*$/.test($scope.signupdata.Email_Id) == false) {
    		     $scope.boleanemail=true;
			}
			  	  
		  };
			
			   $scope.changegreentick=function(){
			      $scope.boleanage=false; 
			   };
	 
	
		 $scope.labelclickmale=function(){
		 	if($('.btn-primary').find("input")){
				var age=$( "#male" ).val();
				//console.log(age);
				if(age == "male"){
					$scope.signupdata.gender="male";
				}
				
			}
		 };
		 $scope.labelclickfemale=function(){
		 	if($('.btn-primary').find("input")){
				var age2=$( "#female" ).val();
				//console.log(age2);
				if(age2 == "female"){
					$scope.signupdata.gender="female";
				}
				
			}
		 };
		
		$scope.sentage=function(){
			 if($scope.signupdata.Age>0){
			   $scope.boleanage=true;	
			 }
			 else{
			 	 $scope.boleanage=false;	
			 }
				// console.log($scope.signupdata.Age);
			
		};
    
});

app.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(element.attr("class") == "rounded_corner") {
                  
                    element.addClass(attrs.toggleClass);
                } else {
                    element.removeClass(attrs.toggleClass);
                  
                }
            });
        }
    };
});
app.controller('signinctrllr', function ($scope,$http,$state, checkUserLogin) {
	checkUserLogin.checkLogin();
	var usersiginindata;
     $scope.signin=function(){
 	    $http({method:'GET', url:url+'/signin',params:{"Email_Id":$scope.signin.valemail}}) 
	     .success(function(data, status) {  
	     	//console.log(data);
	     localStorage.setItem('userData', JSON.stringify(data));
      //var widgets = localStorage.getItem('userD');
      //console.log(widgets.Email_Id);
      
      var myObj = JSON.parse(localStorage.getItem("userData"));
      var email = myObj["Email_Id"];
      console.log(email);
      
  		      if(email== undefined){
  		      	 //alert(0);
  		      	 $state.go('Signin');
  		      }else{
  		      	 //alert(10);
  		      	 $state.go('home');
  		       }
  		   	// if (localStorage !== null) {
	 		// //	alert("not empty!");
	 		// var app=angular.module('app', ['ui.router'], function ($stateProvider, $urlRouterProvider) {
    			// $stateProvider.state("home", {
        			// url: "/home",
        		// templateUrl: "home.html"
    			// });
// 
			// });
	 			// if(usersiginindata.Zip_code == null){
	 					// var app=angular.module('app', ['ui.router'], function ($stateProvider, $urlRouterProvider) {
    			// $stateProvider.state("home", {
        			// url: "/home",
        		// templateUrl: "home.html"
    			// });
// 
			// });
// 	 				
	 			// }
			// }
			// else{
				// var app=angular.module('app', ['ui.router'], function ($stateProvider, $urlRouterProvider) {
    			// $stateProvider.state("sociallogin", {
        			// url: "/sociallogin",
        		// templateUrl: "sociallogin.html"
    			// });
// 
			// });
			// }
    		
          })
          .error(function(data, status) {
           });
          };
	
	
});

app.controller('offersController', function($scope,$http, $rootScope, checkUserLogin) {
	checkUserLogin.redirectToLogin();
    var offerList;
    //$rootScope = $scopeofferlist.offerID;
    //console.log($stateParams.offerID);
    $http.get(url+'/offers').success(function(data) {
        $scope.offerlist = data;
        //$rootScope.oid = $scope.offerlist.offerID;
        //console.log( JSON.stringify($scope.offerlist[0].offerID));
        localStorage.setItem("offerlist", JSON.stringify(data));  
        $rootScope.checkWidth();
        $scope.specialOffer=function(oid){
          //console.log(oid);
         $rootScope.oid = oid;
            
        };
        
    });
  
});

app.controller('specialOffersController', function($scope,$http, $rootScope, checkUserLogin) {
	checkUserLogin.redirectToLogin();
    //alert($rootScope.oid);
      $http({method:'GET', url:url+'/offersdetails',params:{"offerID":$rootScope.oid}})
      .success(function(data, status) {
          //console.log(data);
           $scope.offerdetail = data;

       }).error(function(data, status) {
             
        });


});

app.controller('productCtrl', function ($scope,$http, $rootScope, checkUserLogin) {
	checkUserLogin.redirectToLogin();
	$scope.autoScroll = true;
	$scope.catagory=[];
	$scope.mainCategory =[];
    $scope.subCategory =[];
 	    $http.get(url+"/getCatgoryJson").success(function(data) {
			$scope.catagory=data;
			for(var i=0; i<data.length;i++){
				if(data[i].parentID==0){
					$scope.mainCategory.push(data[i]);
				}
			}
			  $scope.product_Detail=function(pid,pname){
		         $rootScope.pid = pid;
				  $rootScope.pname = pname;
		       };
		     $rootScope.checkWidth();
			 
		});
		$scope.getSubcatagory=function($event){
			var elm=$event.target;
		var cat_cod=elm.attributes.data.value;
		$('.collapse').on('shown.bs.collapse', function(){
		$(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
		}).on('hidden.bs.collapse', function(){
		$(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
		});
		$scope.subCategory=[];
			for(var i=0; i<$scope.catagory.length;i++){
			if($scope.catagory[i].parentID==cat_cod){
					$scope.subCategory.push($scope.catagory[i]);
				}
			}
		};

		//-------------vrishali search
			$scope.searchKeys=function(){

			$http({method:'GET', url:url+'/searchStores',params:{"sk":$scope.searchKey.key}}) 
  			.success(function(data, status) {
  				if($scope.searchKey.key == ""){
  					$scope.searchResults = "";
				}else{
					$scope.searchResults = data;
				}

  				//alert($scope.searchResults);
                // console.log($scope.searchResults);
   		
	         }).
	           error(function(data, status) {
	         //    alert(data);
	            });
			
			};
		//--------------vrishali search end
});
app.controller('productdetailController', function($scope,$http, $rootScope, checkUserLogin) {
	checkUserLogin.redirectToLogin();
    var productdetail;
    var d;
     $http({method:'GET', url:url+'/subcat',params:{"categoryCode":$rootScope.pid}})
      .success(function(data, status) {
           $scope.productdetail =data;
          console.log($scope.productdetail);
       }).error(function(data, status) {
        });
});

app.controller('storesctrl', function ($scope, $http, $rootScope, checkUserLogin) {
	checkUserLogin.redirectToLogin();
	$scope.mainCategoryStore =[];
	$scope.subCategoryStore=[];
 	    $http.get(url+'/storeList').success(function(data) {
			 for(var i=0; i<data.length;i++){
				 // if(data[i].parentID==0){
					$scope.mainCategoryStore.push(data[i]);
					 }

			$scope.storedDeatils=function(storeNumber){
		         $rootScope.storeNumber = storeNumber;
				// alert( $rootScope.pid);
		      };

			 $rootScope.checkWidth()			
		}).error(function(data, status) {
         //    alert("1");
            });
});

app.controller('storesDetailctrl', function($scope,$http, $rootScope, checkUserLogin) {
	checkUserLogin.redirectToLogin()
    //alert($rootScope.storeNumber);
    var storedetail;
    //var d;
     $http({method:'GET', url:url+'/store_details',params:{"storeNumber":$rootScope.storeNumber}})
      .success(function(data, status) {

          //console.log(data);
         // alert(1);
           $scope.storedetail =data;
         // $scope.d = $scope.storedetail;
         //console.log(storedetail.phone);

       }).error(function(data, status) {
             
        });
         $scope.showhours=function(openTime,closeTime){
          //alert(openTime);
          $scope.openTime=openTime;
          $scope.closeTime=closeTime;
         // console.log($scope.storedetail);
         	
         };


});

app.run(function($rootScope, $state) {
	$rootScope.checkWidth = function(val){
		var height=$(window).height()-102;
		//alert(height);
		$('.pan_height').css("height",height);
		// var contentHeight = height-61;
		// alert(contentHeight);		
	        // $('.pan_height').height( $(window).height() -  $('ul.nav-tabs').height() );
	};
    //$rootScope.exHandler = function(val) {
    //  console.log()
    //  //alert(val);
    //  var userData = localStorage.getItem('userData');
    //
    // console.log(userData);
    //   if (userData) {
    //    if(val == "products"){
    //      $state.go('products');
    //
    //    }else if(val == "home"){
    //      $state.go('home');
    //
    //    }else if(val == "offers"){
    //      $state.go('offers');
    //
    //    }else if(val == "stores"){
    //      $state.go('stores');
    //
    //    }
    //    //else{
    //    //  alert("empty");
    //    //  $state.go('login');
    //    //}
    //
    //  }else{
    //      console.log('login');
		//   $state.go('login');
    //  }
    //
    //};
});

    app.factory('checkUserLogin', function ($state) {
        return {
            checkLogin: function () {
                var userData = localStorage.getItem("userData");
                if (userData) {
                    $state.go('home');
                }
            },
            redirectToLogin: function () {
                var userData = localStorage.getItem("userData");
                if (!userData) {
                    $state.go('login');
                }
            }

        }
    });

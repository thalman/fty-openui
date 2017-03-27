function setCookie(cname, cvalue, expire) {
    var d = new Date();
    d.setTime(d.getTime() + (expire*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function newAuth() {
    return (function () {
        var user = "";
        var pass = ""
        var onLoginCallback = null;
        var onLoginFailCallback = null;

        var token = function() {
            return getCookie ("ftyAccessToken");
        };

        var setToken = function (token) {
            setCookie ("ftyAccessToken", token, 3600);
        };

        var login = function (aUser, aPass) {
	        setToken ("");
	        user = aUser;
	        pass = aPass;
	        $.ajax ({
	            url: '/api/v1/oauth2/token',
	            type: 'POST',
	            data: JSON.stringify ({ grant_type : "password", username: user, password: pass }),
	            contentType: 'application/json',
	            dataType: "json",
	            success: function (response) {
		            setToken (response.access_token);
                    $.ajaxSetup({
                        headers: { 'Authorization': "Bearer " + token () }
                    });
		            if (onLoginCallback) onLoginCallback ();
	            },
	            error: function () {
		            if (onLoginFailCallback) onLoginFailCallback ("Login failed");
	            }
	        });
        };

        var loggedIn = function () {
            var mytoken = token ();
            if (mytoken != "") {
                $.ajaxSetup({
                    headers: { 'Authorization': "Bearer " + token() }
                });
                return true;
            }
	        return false;
        };

        var logout = function () {
	        setToken ("");
	        user = "";
	        pass = "";
            $.ajaxSetup({
                headers: { 'Authorization': null }
            });
        }
        var onLoginSuccess = function (callback) {
            onLoginCallback = callback;
        }
        var onLoginFail = function (callback) {
            onLoginFailCallback = callback;
        }

        return {
            login: login,
            loggedIn: loggedIn,
            logout: logout,
            onLoginSuccess: onLoginSuccess,
            onLoginFail: onLoginFail,
        }
    })();
}

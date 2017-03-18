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

var ftyAuth = {
    user: "",
    pass: "",
    onLogin: null,
    onLoginFail: null,

    token: function() {
        return getCookie ("ftyAccessToken");
    },
    setToken: function (token) {
        setCookie ("ftyAccessToken", token, 3600);
    },
    login: function (user, pass) {
	ftyAuth.setToken ("");
	ftyAuth.user = user;
	ftyAuth.pass = pass;
	$.ajax ({
	    url: '/api/v1/oauth2/token',
	    type: 'POST',
	    data: JSON.stringify ({ grant_type : "password", username: user, password: pass }),
	    contentType: 'application/json',
	    dataType: "json",
	    success: function (response) {
		    ftyAuth.setToken (response.access_token);
            $.ajaxSetup({
                headers: { 'Authorization': "Bearer " + ftyAuth.token() }
            });
		    if (ftyAuth.onLogin) ftyAuth.onLogin ();
	    },
	    error: function () {
		if (ftyAuth.onLoginFail) ftyAuth.onLoginFail ();
	    }
	});
    },

    loggedIn: function () {
        var token = ftyAuth.token ();
        if (token != "") {
            $.ajaxSetup({
                headers: { 'Authorization': "Bearer " + token }
            });
            return true;
        }
	    return false;
    },

    logout: function () {
	    ftyAuth.setToken ("");
	    ftyAuth.user = "";
	    ftyAuth.pass = "";
        $.ajaxSetup({
            headers: { 'Authorization': null }
        });
    }
}

function ftyLoginPageSetError () {
    $("#loginAlert").html ('<div class="alert alert-danger">Login failed</div>')
}

function ftyDrawLoginPage () {
    $("#container").html (
	    '<div class="row">' +
            '  <div class="col-md-offset-5 col-md-3">' +
            '    <div>' +
            '      <h4>FTY login</h4>' +
            '      <div id="loginAlert"></div>' +
            '      <input type="text" id="userName" class="form-control input-sm chat-input" placeholder="username" /><br/>' +
            '      <input type="password" id="userPassword" class="form-control input-sm chat-input" placeholder="password" /><br/>' +
            '      <div class="wrapper">' +
            '        <span class="group-btn">' +
            '        <a href="#/assets" class="btn btn-primary btn-md" id="loginButton">login<i class="fa fa-sign-in"></i></a>' +
            '        </span>'+
            '      </div>' +
            '    </div>' +
            '  </div>' +
	    '</div>'
    );
    $("#loginButton").click(function () {ftyAuth.login ($("#userName").val (), $("#userPassword").val ()); return true; });
}

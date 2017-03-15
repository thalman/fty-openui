var ftyAuth = {
    token: null,
    user: "",
    pass: "",
    onLogin: null,
    onLoginFail: null,

    login: function (user, pass) {
	ftyAuth.token = "";
	ftyAuth.user = user;
	ftyAuth.pass = pass;
	$.ajax ({
	    url: '/api/v1/oauth2/token',
	    type: 'POST',
	    data: JSON.stringify ({ grant_type : "password", username: user, password: pass }),
	    contentType: 'application/json',
	    dataType: "json",
	    success: function (response) {
		ftyAuth.token = response.access_token;
		if (ftyAuth.onLogin) ftyAuth.onLogin ();
	    },
	    error: function () {
		if (ftyAuth.onLoginFail) ftyAuth.onLoginFail ();
	    }
	});
    },

    loggedIn: function () {
	return (ftyAuth.token != null);
    },

    logout: function () {
	ftyAuth.token = null;
	ftyAuth.user = "";
	ftyAuth.pass = "";
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

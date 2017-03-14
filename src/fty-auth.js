var ftyToken = "";

function ftyDoLogin () {
    var user = $("#userName").val();
    var pass = $("#userPassword").val();
    console.log ("cred " + user + " " + pass);
    data = jQuery.param({ username: user, password: pass, grant_type : "password" });
    console.log ("data " + data);
    $.ajax ({
	url: '/api/v1/oauth2/token',
	type: 'POST',
	data: JSON.stringify ({ grant_type : "password", username: user, password: pass }),
	contentType: 'application/json',
	dataType: "json",
	success: function (response) {
	    alert ("ok");
	    ftyToken = response.access_token;
	},
	error: function () {
	    alert ("error");
	},
    });
}

function ftyLoginPage () {
    $("#container").html (
	    '<div class="row">' + 
            '  <div class="col-md-offset-5 col-md-3">' +
            '    <div>' +
            '      <h4>FTY login</h4>' +
            '      <input type="text" id="userName" class="form-control input-sm chat-input" placeholder="username" /><br/>' +
            '      <input type="password" id="userPassword" class="form-control input-sm chat-input" placeholder="password" /><br/>' +
            '      <div class="wrapper">' +
            '        <span class="group-btn">' +
            '        <a href="#" class="btn btn-primary btn-md" id="loginButton">login<i class="fa fa-sign-in"></i></a>' +
            '        </span>'+
            '      </div>' +
            '    </div>' +
            '  </div>' +
	    '</div>'
    );
    $("#loginButton").click(function () {ftyDoLogin(); return false; });
}


function ftyStart () {
    ftyLoginPage ();
}

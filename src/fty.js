function ftyInnerPage () {
    $("#container").html (
	ftyNavigation () +
	'<div class="row">' + 
        '  <div class="col-md-offset-5 col-md-3">' +
        '    <div>' +
        '      <h2>Welcome</h2>' +
        '      <a href="#" class="btn btn-primary btn-md" id="logoutButton">logout<i class="fa fa-sign-in"></i></a>' +
        '    </div>' +
        '  </div>' +
	'</div>'
    );
    $("#logoutButton").click(function () {
	ftyAuth.logout ();
	ftyDrawPage ();
	return false;
    });
}

function ftyDrawPage () {
    console.log ($(location).attr ('hash'));
    if (! ftyAuth.loggedIn ()) {
	    ftyDrawLoginPage ();
	    return;
    }
    ftyInnerPage ();
}

ftyAuth.onLogin = ftyDrawPage;
ftyAuth.onLoginFail = ftyLoginPageSetError;

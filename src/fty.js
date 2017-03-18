function ftyDrawPage () {
    var hash = $(location).attr ('hash');
    if (! ftyAuth.loggedIn ()) {
	    ftyDrawLoginPage ();
	    return;
    }
    switch (hash) {
    case "#/assets":
    default:
        ftyAssetPage.show();
    }
    $("#navbarLogout").click (function () {
        ftyAuth.logout ();
        ftyDrawPage ();
        return false;
    });
}

ftyAuth.onLogin = ftyDrawPage;
ftyAuth.onLoginFail = ftyLoginPageSetError;

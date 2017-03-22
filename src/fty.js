function ftyDrawPage (whatPage) {
    var hash = $(location).attr ('hash');
    if (typeof (whatPage) == "string") {
        hash = whatPage;
    }
    console.log("draw page with " + hash);
    if (! ftyAuth.loggedIn ()) {
	    ftyDrawLoginPage ();
	    return;
    }
    switch (hash) {
    case "#/alerts":
        ftyAlertPage.show();
        ftyAssetPage.hide();
        break;
    case "#/assets":
    default:
        ftyAlertPage.hide();
        ftyAssetPage.show();
    }
    $("#navbarLogout").click (function () {
        ftyAuth.logout ();
        ftyDrawPage ();
        return false;
    });
    $('.dropdown-toggle').dropdown();
}

var ftyAlertPage = newAlertPage ();

ftyAuth.onLogin = ftyDrawPage;
ftyAuth.onLoginFail = ftyLoginPageSetError;

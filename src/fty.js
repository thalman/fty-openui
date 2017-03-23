var pages = {
    assetPage: newAssetPage (),
    alertPage: newAlertPage (),
    loginPage: newLoginPage (),
}

var auth = newAuth ();


function ftyShowPage (name) {
    for (var key in pages) {
        if (pages.hasOwnProperty (key)) {
            if (name != key) {
                pages[key].hide();
            }
        }
    }
    pages[name].show();
}

function ftyDrawPage (whatPage) {
    var hash = $(location).attr ('hash');
    if (typeof (whatPage) == "string") {
        hash = whatPage;
    }

    if (! auth.loggedIn ()) {
	    ftyShowPage ("loginPage");
	    return;
    }
    switch (hash) {
    case "#/alerts":
        ftyShowPage("alertPage");
        break;
    case "#/assets":
    default:
        ftyShowPage("assetPage");
        break;
    }
    $("#navbarLogout").click (function () {
        auth.logout ();
        ftyDrawPage ();
        return false;
    });
}

auth.onLogin(function () { ftyDrawPage("#/assets"); });
pages.loginPage.onLogin (auth.login);

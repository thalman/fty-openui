var pages = {
    assetPage: newAssetPage (),
    alertPage: newAlertPage (),
    loginPage: newLoginPage (),
    settingsPage: newSettingsPage (),
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
    navigation.show();
    switch (hash) {
    case "#/settings":
        ftyShowPage("settingsPage");
        break;
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

auth.onLoginSuccess(function () {
    pages.loginPage.hide ();
    ftyDrawPage("#/assets");
});
auth.onLoginFail (pages.loginPage.onAuthenticationFinished);
pages.loginPage.onLoginClick (auth.login);
navigation.onNavigationClick (ftyDrawPage);

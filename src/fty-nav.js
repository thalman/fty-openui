
var navigation = (function () {
    var onNavigationCallback = null;

    var hide = function () { };

    var show = function () {
        if ($("#filter").length) return;
        $("#navigation").html (render());
        $("#navbarAssetsA").click (function() { onClick ("#/assets"); });
        $("#navbarAlertsA").click (function() { onClick ("#/alerts"); });
        $("#navbarSettings").click (function() { onClick ("#/settings"); });
        select ($(location).attr ('hash'));
    };

    var render = function () {
        return (
            '<nav class="navbar navbar-default">' +
            '  <div class="container-fluid">' +
            '    <div class="navbar-header">' +
            '      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#fty-navbar-collapse" aria-expanded="false">' +
            '        <span class="sr-only">Toggle navigation</span>' +
            '        <span class="icon-bar"></span>' +
            '        <span class="icon-bar"></span>' +
            '        <span class="icon-bar"></span>' +
            '      </button>' +
            '      <a class="navbar-brand" href="#">Fty</a>' +
            '    </div>' +
            '    <div class="collapse navbar-collapse" id="fty-navbar-collapse">' +
            '      <ul class="nav navbar-nav">' +
            '        <li class="dropdown">' +
            '          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"' +
            '             aria-haspopup="true" aria-expanded="false" id="navbardc">Datacenter<span class="caret"></span></a>' +
            '          <ul class="dropdown-menu" id="navbardclist">' +
            '            <li><a href="#">DC</a></li>'+
            '          </ul>' +
            '        </li>' +
            '        <li>' +
            '          <form class="navbar-form navbar-left" role="search">' +
            '            <div class="form-group"><input type="text" class="form-control" placeholder="Search" id="filter"></div>' +
            '          </form>' +
            '        </li>'+
            '        <li id="navbarAssets"><a href="#/assets" id="navbarAssetsA">Assets</a></li>'+
            '        <li id="navbarAlerts"><a href="#/alerts" id="navbarAlertsA">Alerts</a></li>'+
            '        <li id="navbarSettings"><a href="#/settings" id="navbarSettingsA">Settings</a></li>'+
            '      </ul>' +
            '      <ul class="nav navbar-nav navbar-right">' + // what is on right
            '        <li><a href="#/logout" id="navbarLogout">Logout</a></li>' +
            '      </ul>' +
            '    </div>' +
            '  </div>' +
            '</nav>'
        );
    };

    var select = function (what) {
        ["#navbarAlerts", "#navbarAssets", "#navbarSettings"].map ( function (i) {
            $(i).removeClass ("active");
        } );
        switch (what) {
        case "#/assets":
            $("#navbarAssets").addClass ("active");
            break;
        case "#/alerts":
            $("#navbarAlerts").addClass ("active");
            break;
        case "#/settings":
            $("#navbarSettings").addClass ("active");
            break;
        };
    };

    var onClick = function (what) {
        select (what);
        if (onNavigationCallback) onNavigationCallback (what);
    };

    var onNavigationClick = function (callback) {
        onNavigationCallback = callback;
    };

    return {
        show: show,
        hide: hide,
        render: render,
        onNavigationClick, onNavigationClick,
    }
})();

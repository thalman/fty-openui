
var navigation = (function () {
    var datacenters = [];
    var selectedDC = -1;
    var requestedDC = null;
    var requestedDCAlerts = null;
    var assets = {};
    var alerts = {};
    var onNavigationCallback = null;

    var hide = function () { }

    var show = function () {
        if ($("#filter").length) return;
        $("#navigation").html (render());
        $("#navbarAssetsA").click (function() { onClick ("#/assets"); });
        $("#navbarAlertsA").click (function() { onClick ("#/alerts"); });
        $("#navbarSettings").click (function() { onClick ("#/settings"); });
        select ($(location).attr ('hash'));
        requestDCs ();
        requestAlerts ();
        requestAssets ();
    }

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
            '      <a class="navbar-brand" href="#"><img src="images/fty128x68.png" alt="FTY" height="25pt"></img></a>' +
            '    </div>' +
            '    <div class="collapse navbar-collapse" id="fty-navbar-collapse">' +
            '      <ul class="nav navbar-nav">' +
            '        <li class="dropdown">' +
            '          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"' +
            '             aria-haspopup="true" aria-expanded="false" id="navbardc">[All DCs]<span class="caret"></span></a>' +
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
            '</nav>' +
            '<div class="modal" id="disablePage" data-backdrop="static" data-keyboard="false">' +
            '  <div class="modal-body">' +
            '    <div id="ajax_loader">' +
            '      <img src="images/loader.gif" style="display: block; margin-left: auto; margin-right: auto; z-index: 999;">' +
            '    </div>' +
            '  </div>' +
            '</div>'
        );
    }

    var selectedDCs = function () {
        if (selectedDC >= 0) {
            return [ datacenters[selectedDC] ];
        }
        return datacenters;
    }

    var selectedAssets = function () {
        var result = [];
        var sdc = selectedDCs();
        for (var dc in sdc) {
            var set = assets [sdc [dc].id]
            for (var i in set) {
                result.push (set[i]);
            }
        }
        return result;
    }

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
        }
    }

    var onClick = function (what) {
        select (what);
        if (onNavigationCallback) onNavigationCallback (what);
    }

    var onNavigationClick = function (callback) {
        onNavigationCallback = callback;
    }

    var onDCChange = function () {
        var label = "";
        if (this.id == "ftyDCSelectorAll") {
            label = "All DCs";
            selectedDC = -1;
        } else {
            var dcid = this.id.substring (14);
            for (var i in datacenters) {
                if (datacenters[i].id == dcid) {
                    label = datacenters[i].name;
                    selectedDC = i;
                    break;
                }
            }
        }
        $("#navbardc").html ("[" + label + '] <span class="caret"></span>');
        return true;
    }

    var updateNavbar = function() {
        var label = "All DCs";
        var list = '<li><a href="#" class="ftyDCSelector" id="ftyDCSelectorAll">' + label + '</a></li>'
        if (selectedDC >= 0) label = datacenters [selectedDC].name
        $("#navbardc").html ("[" + label + '] <span class="caret"></span>');
        for (i = 0; i < datacenters.length; i++) {
            list += '<li><a href="#" class="ftyDCSelector" id="ftyDCSelector-' + datacenters [i].id + '">' +datacenters [i].name + '</a></li>';
        }
        $("#navbardclist").html (list);
        $(".ftyDCSelector").click (onDCChange);
    }

    var DCIdIndex = function (DC) {
        for (var i in datacenters) {
            if (datacenters[i].id == DC.id) return i;
        }
        return -1;
    }

    var severityToNumber = function (severity) {
        switch (severity.toLowerCase ()) {
        case "ok":
            return 0;
        case "warning":
            return 1;
        case "critical":
            return 2;
        default:
            return -1;
        }
    }

    var getAssetMaxSeverity = function (dcid, elementid) {
        var severity = -1;

        if (! alerts.hasOwnProperty(dcid)) return severity;

        for (var i = 0; i < alerts [dcid].length; i++) {
            if (alerts[dcid][i].element_id == elementid) {
                var s = severityToNumber (alerts [dcid][i].severity);
                if (s > severity) severity = s;
                if (s >= 2) return s;
            }
        }
        return severity;
    }

    var updateAssetStatuses = function () {
        for (var dc = 0; dc < datacenters.length; dc++) {
            var dcid = datacenters [dc].id;
            if (assets.hasOwnProperty(dcid)) {
                for (var dev = 0; dev < assets [dcid].length; dev++) {
                    assets[dcid][dev].state = getAssetMaxSeverity (dcid, assets[dcid][dev].id);
                }
            }
        }
    }

    var requestDCs = function () {
        $.get ('/api/v1/asset/datacenters', null, onDCs);
    }
    var onDCs = function (data) {
        var newdcs = [];
        if (data.hasOwnProperty ("datacenters")) {
            newdcs = data.datacenters;
            newdcs.sort (
                function(a,b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return +1;
                    return 0;
                }
            );
            if ((datacenters.length != newdcs.length) || (JSON.stringify(datacenters) != JSON.stringify(newdcs))) {
                selectedDC = -1;
                datacenters = newdcs;
                updateNavbar ();
            }
        }
        setTimeout (requestDCs, 10000);
    }

    var requestAssets = function () {
        if (datacenters.length == 0) {
            requestedDC = null;
            setTimeout (requestAssets, 1000);
            return;
        }
        if (selectedDC >=0) {
            requestedDC = datacenters[selectedDC];
            $.get (
                '/api/v1/assets',
                { in: requestedDC.id, type: "device" },
                onAssets);
        } else {
            if (requestedDC == null) {
                requestedDC = datacenters[0];
            } else {
                var i = DCIdIndex (requestedDC) + 1;
                if (i >= datacenters.length) i = 0;
                requestedDC = datacenters [i];
            }
            $.get (
                '/api/v1/assets',
                { in: requestedDC.id, type: "device" },
                onAssets);
        }
    }
    var onAssets = function (data) {
        devices = data;
        devices.sort (
            function(a,b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return +1;
                return 0;
            }
        );
        assets [requestedDC.id] = devices;
        updateAssetStatuses ();
        setTimeout (requestAssets, 10000);
    }

    var requestAlerts = function () {
        if (datacenters.length == 0) {
            requestedDCAlerts = null;
            setTimeout (requestAlerts, 5000);
            return;
        }
        if (requestedDCAlerts == null) {
            requestedDCAlerts = datacenters[0];
        } else {
            var i = DCIdIndex (requestedDCAlerts) + 1;
            if (i >= datacenters.length) i = 0;
            requestedDCAlerts = datacenters [i];
        }
        $.get (
            '/api/v1/alerts/activelist',
            { state: 'ALL', recursive: true, asset: requestedDCAlerts.id },
            onAlerts
        );
    }
    var onAlerts = function (data) {
        alerts [requestedDCAlerts.id] = data;
        updateAssetStatuses ();
        setTimeout (requestAlerts, 5000);
    }
    var allAlerts = function () {
        var result = [];
        for (var dc in datacenters) {
            result.concat (datacenters [dc]);
        }
        return result;
    }

    return {
        show: show,
        hide: hide,
        render: render,
        selectedDCs: selectedDCs,
        selectedAssets: selectedAssets,
        allAlerts: allAlerts,
        onNavigationClick, onNavigationClick,
    }
})();

function waiting() {
    $("#disablePage").modal ();
}

function nowaiting () {
    $("#disablePage").modal ('hide');
}

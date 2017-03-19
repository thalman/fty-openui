// page with assets

function newAssetPage () {
    return (function () {
        var datacenters = [];
        var selectedDC = -1;
        var devices = [];
        var active = false;

        var show = function () {
            active = true;
            $("#container").html (
                ftyNavigation () +
                    '<div class="row" id="assetBoxes">' +
                    '</div>'
            );
            showDevices ();
            $("#filter").keyup (onFilter);
            $("#filter").focus ();
            requestAllAssets ();
        };

        var showDevices = function () {
            var filter = $("#filter").val().toLowerCase ();
            var html = "";
            for(i=0; i<devices.length; i++) {
                if (
                    (devices [i].name.toLowerCase().indexOf (filter) != -1) ||
                        (devices [i].type.toLowerCase().indexOf (filter) != -1) ||
                        (devices [i].sub_type.toLowerCase().indexOf (filter) != -1)
                ) {
                    html += deviceHtml (i);
                }
            }
            $("#assetBoxes").html (html);
        };

        var deviceHtml = function (idx) {
            return '<div class="col-xs-6 col-md-3">'+
                '<div>' +
                devices[idx].name +
                '</div>'+
                '</div>';
        };

        var updateNavbar = function() {
            if (datacenters.length) {
                $("#navbardc").html ("[" + datacenters [selectedDC].name + '] <span class="caret"></span>');
                var list = ""
                for (i = 0; i < datacenters.length; i++) {
                    list += '<li><a href="#">' +datacenters [i].name + '</a></li>';
                    // TOTO: dropdown plugin
                }
                $("#navbardclist").html (list);
            } else {
                $("#navbardc").text ('Datacenter <span class="caret"></span>');
                $("#navbardclist").html ('');
            }
        };

        var hide = function () {
            active = false;
        };

        var requestDCs = function () {
            $.get ('/api/v1/asset/datacenters', null, onDCs);
        };

        var requestDevices = function () {
            if (selectedDC >=0) {
                var dc = datacenters[selectedDC];
                $.get (
                    '/api/v1/assets',
                    { in: dc.id, type: "device" },
                    onDevices);
            }
        };

        var requestAllAssets = function () {
            requestDCs ();
        };

        // ajax callbacks
        var onDevices = function (data) {
            devices = data;
            devices.sort (
                function(a,b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return +1;
                    return 0;
                }
            );
            showDevices ();
        };

        var onDCs = function (data) {
            datacenters = [];
            if (data.hasOwnProperty ("datacenters")) {
                datacenters = data.datacenters;
                if (datacenters.length) {
                    selectedDC = 0;
                } else {
                    selectedDC = -1;
                }
            }
            datacenters.sort (
                function(a,b) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return +1;
                    return 0;
                }
            );
            // update DC combobox
            updateNavbar();
            // ask for DC devices
            requestDevices ();
        };

        var onFilter = function () {
            showDevices ();
        };

        // return public api
        return {
            show: show,
            hide: hide,
        };
    })();
}


var ftyAssetPage = newAssetPage ();

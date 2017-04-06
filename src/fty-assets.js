// page with assets

function newAssetPage () {
    return (function () {
        var datacenters = [];
        var selectedDC = -1;
        var devices = [];
        var active = false;
        var alerts = [];

        var show = function () {
            active = true;
            $("#content").html (
                '<div class="row" id="assetBoxes">' +
                '</div>' +
                '<div class="modal fade" id="settingsModal" role="dialog">' +
                '  <div class="modal-dialog" role="document">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '          <span aria-hidden="true">&times;</span>' +
                '        </button>' +
                '        <h3 class="modal-title" id="settingsModalTitle">Title</h3>' +
                '      </div>' +
                '      <div class="modal-body" id="settingsModalBody">' +
                '      </div>' +
                '      <div class="modal-footer" id="settingsModalFooter">' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
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
            $(".ftyclickable").click (onAssetClick);
        };

        var stateToImage = function (state) {
            switch (state) {
            case 0:
                return "ok.png";
            case 1:
                return "warning.png";
            case 2:
                return "critical.png";
            default:
                return "unknown.png";
            }
        };

        var deviceHtml = function (idx) {
            var name = devices[idx].name;
            return '<div class="col-xs-6 col-md-3">'+
                '<div class="ftyasset ftyclickable" id="assetid-' + devices[idx].id + '">' +
                '<img src="images/' + stateToImage (devices[idx].state) + '" id="state' + devices[idx].id + '" height="20pt"></img>&nbsp;' + name +
                '</div>'+
                '</div>';
        };

        var assetById = function (id) {
            for (var i in devices) {
                if (devices [i].id == id) return devices [i];
            }
            return null;
        }

        var updateNavbar = function() {
            if (datacenters.length) {
                $("#navbardc").html ("[" + datacenters [selectedDC].name + '] <span class="caret"></span>');
                var list = ""
                for (i = 0; i < datacenters.length; i++) {
                    list += '<li><a href="#">' +datacenters [i].name + '</a></li>';
                }
                $("#navbardclist").html (list);
            } else {
                $("#navbardc").text ('Datacenter <span class="caret"></span>');
                $("#navbardclist").html ('');
            }
        };

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
        };

        var assetSeverity = function (elementid) {
            var severity = -1;
            for (var i = 0; i < alerts.length; i++) {
                if (alerts[i].element_id == elementid) {
                    var s = severityToNumber (alerts [i].severity);
                    if (s > severity) severity = s;
                }
            }
            return severity;
        };

        var updateAlertStatuses = function () {
            for (var i = 0; i< devices.length; i++) {
                devices[i].state = assetSeverity (devices[i].id);
                var imageid = '#state' + devices[i].id;
                $(imageid).attr('src','images/' + stateToImage (devices[i].state));
            }
        };

        var deviceType = function (device) {
            if (device.type == "device") return device.sub_type;
            return device.type;
        }

        var onAssetClick = function () {
            console.log (this.id);
            var assetId = this.id.substring (this.id.indexOf ("-") + 1);
            var d = assetById (assetId);

            $('#settingsModalTitle').html (d.name + " (" + deviceType (d) + ")");
            $('#settingsModalBody').html ("asset details");
            $('#settingsModalFooter').html (
                '<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>'
            );
            $('#settingsModal').modal ();
        }

        var hide = function () {
            active = false;
        };

        // ajax requests
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
            requestAlerts ();
        };

        var requestAlerts = function () {
            $.get (
                '/api/v1/alerts/activelist',
                { state: 'ALL'},
                onAlerts
            );
        };
        var onAlerts = function (data) {
            if (!active) return;

            alerts = data;
            updateAlertStatuses();
            setTimeout (requestAlerts, 10000);
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
            for(i=0; i<devices.length; i++) {
                devices[i].state = assetSeverity (devices[i].id);
            }
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
            active: active,
            show: show,
            hide: hide,
        };
    })();
}

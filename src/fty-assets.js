// page with assets

var ftyAssetPage = {
    datacenters: [],
    selectedDC: -1,
    devices: [],
    active: false,

    show: function () {
        ftyAssetPage.active = true;
        $("#container").html (
	        ftyNavigation () +
                '<div class="row" id="assetBoxes">' +
                '</div>'
        );
        ftyAssetPage.showDevices ();
        $("#filter").keyup (ftyAssetPage.onFilter);
        $("#filter").focus ();
        ftyAssetPage.requestAllAssets ();
    },
    showDevices: function () {
        var filter = $("#filter").val ().toLowerCase ();
        var html = "";
        for(i=0; i<ftyAssetPage.devices.length; i++) {
            if (
                (ftyAssetPage.devices [i].name.toLowerCase().indexOf (filter) != -1) ||
                (ftyAssetPage.devices [i].type.toLowerCase().indexOf (filter) != -1) ||
                (ftyAssetPage.devices [i].sub_type.toLowerCase().indexOf (filter) != -1)
            ) {
                html += ftyAssetPage.deviceHtml (i);
            }
        }
        $("#assetBoxes").html (html);
    },
    deviceHtml: function (idx) {
        return '<div class="col-xs-6 col-md-3">'+
            '<div>' +
            ftyAssetPage.devices[idx].name +
            '</div>'+
            '</div>';
    },
    updateNavbar: function() {
        if (ftyAssetPage.datacenters.length) {
            $("#navbardc").html ("[" + ftyAssetPage.datacenters [ftyAssetPage.selectedDC].name + '] <span class="caret"></span>');
            var list = ""
            for (i = 0; i < ftyAssetPage.datacenters.length; i++) {
                list += '<li><a href="#">' +ftyAssetPage.datacenters [i].name + '</a></li>';
                // TOTO: dropdown plugin
            }
            $("#navbardclist").html (list);
        } else {
            $("#navbardc").text ('Datacenter <span class="caret"></span>');
            $("#navbardclist").html ('');
        }
    },
    hide: function () {
        ftyAssetPage.active = false;
    },
    requestDCs: function () {
        $.get ('/api/v1/asset/datacenters', null, ftyAssetPage.onDCs);
    },
    requestDevices: function () {
        if (ftyAssetPage.selectedDC >=0) {
            var dc = ftyAssetPage.datacenters[ftyAssetPage.selectedDC];
            $.get (
                '/api/v1/assets',
                { in: dc.id, type: "device" },
                ftyAssetPage.onDevices);
        }
    },
    requestAllAssets: function () {
        ftyAssetPage.requestDCs ();
    },

    // ajax callbacks
    onDevices: function (data) {
        ftyAssetPage.devices = data;
        ftyAssetPage.devices.sort (
            function(a,b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return +1;
                return 0;
            }
        );
        ftyAssetPage.showDevices ();
	},
    onDCs: function (data) {
        ftyAssetPage.datacenters = [];
        if (data.hasOwnProperty ("datacenters")) {
            ftyAssetPage.datacenters = data.datacenters;
            if (ftyAssetPage.datacenters.length) {
                ftyAssetPage.selectedDC = 0;
            } else {
                ftyAssetPage.selectedDC = -1;
            }
        }
        ftyAssetPage.datacenters.sort (
            function(a,b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return +1;
                return 0;
            }
        );
        // update DC combobox
        ftyAssetPage.updateNavbar();
        // ask for DC devices
        ftyAssetPage.requestDevices ();
	},
    onFilter: function () {
        ftyAssetPage.showDevices ();
    }
}

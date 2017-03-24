function newAlertPage () {
    return (function () {
        var active = false;
        var alerts = [];

        var show = function () {
            active = true;
            $("#content").html (
                '<div class="container" id="alertList"></div>'
            );
            $("#filter").keyup (onFilter);
            $("#filter").focus ();
            requestAlerts ();
        };
        var hide = function () {
            active = false;
        };

        var showAlerts = function () {
            var filter = $("#filter").val().toLowerCase ();
            alerts.sort (
                function (a,b) {
                    if (severityToNumber (a.severity) > severityToNumber (b.severity)) return -1;
                    if (severityToNumber (a.severity) < severityToNumber (b.severity)) return +1;
                    if (a.element_name > b.element_name) return -1;
                    if (a.element_name < b.element_name) return +1;
                    return 0;
                }
            );
            var html = "";
            for (var i = 0; i < alerts.length; i++) {
                if (
                    alerts[i].element_name.toLowerCase().indexOf (filter) != -1 ||
                    alerts[i].element_type.toLowerCase().indexOf (filter) != -1 ||
                    alerts[i].element_sub_type.toLowerCase().indexOf (filter) != -1 ||
                    alerts[i].description.toLowerCase().indexOf (filter) != -1
                ) {
                    html += alertHtml (alerts[i]);
                }
            }
            $("#alertList").html (html);
        };

        var severityToImage = function (severity) {
            switch (severity.toLowerCase ()) {
            case 'ok':
                return "ok.png";
            case 'warning':
                return "warning.png";
            case 'critical':
                return "critical.png";
            default:
                return "unknown.png";
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

        var alertHtml = function (alert) {
            return '<div class="row"><div class="col">' +
                '<img src="images/' + severityToImage (alert.severity) + '" width="30pt"></img> ' +
                alert.element_name +": " + alert.description +
                '</div></div>';
        };

        var onFilter = function() {
            showAlerts ();
        };

        // ajax functions
        var requestAlerts = function () {
            $.get (
                '/api/v1//alerts/activelist',
                { state: 'ALL'},
                onAlerts
            );
        };
        var onAlerts = function (data) {
            if (!active) return;

            alerts = data;
            showAlerts();
            setTimeout (requestAlerts, 10000);
        };

        // return public api
        return {
            active: active,
            show: show,
            hide: hide,
        };
    })();
}

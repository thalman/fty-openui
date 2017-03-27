function newSettingsPage () {
    return (function () {
        var active = false;

        var show = function () {
            active = true;
            $("#content").html (
                render()
            );
            $("#settingsExport").click (onExportClick);
        }

        var hide = function () {
            active = false;
        }

        var render = function () {
            return (
                '<div class="container" id="alertList">' +
                '  <div class="row">'+
                '    <a href="#/settings/export" class="btn btn-default" id="settingsExport">Export</a>' +
                '  </div>' +
                '</div>'
            );
        }

        var onExportClick = function () {
            $.get('/api/v1/asset/export', null, function(retData) {
                console.log (retData);
                var a = window.document.createElement('a');
                a.href = window.URL.createObjectURL(new Blob([retData], {type: 'text/csv'}));
                a.download = window.location.hostname + '.csv';
                // Append anchor to body.
                document.body.appendChild(a)
                a.click();
                // Remove anchor from body
                document.body.removeChild(a)
            });
            return false;
        }

        // return public api
        return {
            show: show,
            hide: hide,
        };
    })();
}

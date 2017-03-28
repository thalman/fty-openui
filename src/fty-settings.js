function newSettingsPage () {
    return (function () {
        var active = false;

        var show = function () {
            active = true;
            $("#content").html (
                render()
            );
            $("#settingsExport").click (onExportClick);
            //$("#settingsImport").click (onImportClick);
        }

        var hide = function () {
            active = false;
        }

        var render = function () {
            return (
                '<div class="container" id="alertList">' +
                '  <div class="row">'+
                '    <a href="#/settings/export" class="btn btn-default" id="settingsExport">Export CSV</a>' +
                '    <button type="button" class="btn btn-default" data-toggle="modal" data-target="#settingsModal">Import CSV</button>' +
                '  </div>' +
                '</div>' +
                '<div class="modal fade" id="settingsModal" role="dialog">' +
                '  <div class="modal-dialog" role="document">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '          <span aria-hidden="true">&times;</span>' +
                '        </button>' +
                '        <h3 class="modal-title" id="settingsModalLabel">Title</h3>' +
                '      </div>' +
                '      <div class="modal-body">' +
                '        <p>Modal body.</p>' +
                '      </div>' +
                '      <div class="modal-footer">' +
                '        <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>' +
                '        <button type="button" class="btn btn-secondary" data-dismiss="modal">Ok</button>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>'
            );
        }

        var onExportClick = function () {
            $.get('/api/v1/asset/export', null, function(retData) {
                console.log (retData);
                var a = window.document.createElement('a');
                a.href = window.URL.createObjectURL(new Blob([retData], {type: 'text/csv'}));
                var time = new Date();
                var date = time.getFullYear () + "-" + ("0" + (time.getMonth() + 1)).slice (-2) + "-" + ("0" + time.getDate ()).slice (-2);
                a.download = window.location.hostname + "-" + date + '.csv';
                // Append anchor to body.
                document.body.appendChild(a)
                a.click();
                // Remove anchor from body
                document.body.removeChild(a)
            });
            return false;
        }

        var onImportClick = function () {
        }

        // return public api
        return {
            show: show,
            hide: hide,
        };
    })();
}

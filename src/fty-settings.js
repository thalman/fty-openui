function newSettingsPage () {
    return (function () {
        var active = false;

        var show = function () {
            active = true;
            $("#content").html (
                render()
            );
            $("#settingsExport").click (onExportClick);
            $("#settingsImport").click (onImportClick);
        }

        var hide = function () {
            active = false;
        }

        var render = function () {
            return (
                '<div class="container" id="alertList">' +
                '  <div class="row">'+
                '    <a href="#/settings/export" class="btn btn-default" id="settingsExport">Export CSV</a>' +
                '    <button type="button" class="btn btn-default" id="settingsImport">Import CSV</button>' +
                '  </div>' +
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
                '        <p>Modal body.</p>' +
                '      </div>' +
                '      <div class="modal-footer" id="settingsModalFooter">' +
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

        var showMessage = function (title, text) {
            $('#settingsModalTitle').html (title);
            $('#settingsModalBody').html (text);
            $('#settingsModalFooter').html (
                '<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>'
            );
            $('#settingsModal').modal ();
        }

        var onImportClick = function () {
            $('#settingsModalTitle').html ("CSV Import");
            $('#settingsModalBody').html (
                '<label class="btn btn-default">' +
                'Browse <input type="file" id="settingsUploadFile" hidden="1">' +
                '</label>'
            );
            $('#settingsModalFooter').html (
                '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                '<button type="button" class="btn btn-default" id="settingsModalUpload">Upload</button>'
            );
            $('#settingsModalUpload').click(onUploadClick);
            $('#settingsModal').modal ();
        }

        var onUploadClick = function () {
            $('#settingsModal').modal ('hide');

            var file = $('#settingsUploadFile')[0].files[0];
            var formData = new FormData();
            formData.append('assets', file);
            $.ajax({
                url : '/api/v1/asset/import',
                type : 'POST',
                data : formData,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                success : function(data) {
                    console.log(data);
                    var text = data.imported_lines + ' assets has been successfuly imported.';
                    if (data.errors.length) {
                        text += "<br>Import errors:<br>"
                        for (var i in data.errors) {
                            text += "line " + data.errors[i][0] + ": " + data.errors[i][1] + "<br>";
                        }
                    }
                    showMessage ("CVS Import", text);
                },
                error: function (data) {
                    showMessage ("Error", "Unexpected error during CSV upload!");
                }
            });

            console.log(file);
        }
        // return public api
        return {
            show: show,
            hide: hide,
        };
    })();
}

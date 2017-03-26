function newSettingsPage () {
    return (function () {
        var active = false;

        var show = function () {
            active = true;
            $("#content").html (
                '<div class="container" id="alertList">Comming soon</div>'
            );
        };
        var hide = function () {
            active = false;
        };


        // return public api
        return {
            show: show,
            hide: hide,
        };
    })();
}

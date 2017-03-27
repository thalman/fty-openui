function newLoginPage () {
    return (function () {
        var active = false;
        var onLoginCallback = null;

        var hide = function () {
            if (active) {
                $("body").html (applicationFrames());
            }
            active = false;
        }

        var onLoginClick = function (callback) {
            onLoginCallback = callback;
        }
        var onLoginClickForm = function () {
            $("input").prop('disabled', true);
            $("#loginButton").click(function () {return false;});
            $("#loginButton").addClass("disabled");
            if (onLoginCallback) {
                onLoginCallback ($("#userName").val (), $("#userPassword").val ());
            }
        }

        var onAuthenticationFinished = function (errormessage) {
            $('input').prop('disabled', false);
            $("#loginButton").click(function () {onLoginClickForm(); return true;});
            $("#loginButton").removeClass("disabled");
            if (typeof errormessage == "string" && errormessage.length > 0) {
                $("#loginAlert").html ('<div class="alert alert-danger">' + errormessage + '</div>');
            }
        }

        var show = function () {
            active = true;
            $("body").html (render ());
            $("#loginButton").click(function () {onLoginClickForm(); return true;});
        }

        var render = function() {
            return '<div class="container" id="container">' +
                '<div class="row">' +
                '  <div class="col-md-offset-5 col-md-3">' +
                '    <div>' +
                '      <h4>FTY login</h4>' +
                '      <div id="loginAlert"></div>' +
                '      <input type="text" id="userName" class="form-control input-sm chat-input" placeholder="username" /><br/>' +
                '      <input type="password" id="userPassword" class="form-control input-sm chat-input" placeholder="password" /><br/>' +
                '      <div class="wrapper">' +
            '        <span class="group-btn">' +
                '        <a href="#/assets" class="btn btn-primary btn-md" id="loginButton">login<i class="fa fa-sign-in"></i></a>' +
                '        </span>'+
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>' +
                '</div>';
        }

        var applicationFrames = function() {
            return '<div class="container" id="container">' +
                '<div id="navigation"></div>' +
                '<div id="content"></div>' +
                '</div>';
        }

        return {
            active: active,
            show: show,
            hide: hide,
            onLoginClick: onLoginClick,
            onAuthenticationFinished, onAuthenticationFinished,
        }
    })();
}

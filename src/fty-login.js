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

        var onLogin = function (callback) {
            onLoginCallback = callback;
        }
        var onLoginClick = function () {
            if (onLoginCallback) {
                onLoginCallback ($("#userName").val (), $("#userPassword").val ());
            }
        }

        var show = function () {
            active = true;
            $("body").html (render ());
            $("#loginButton").click(function () {onLoginClick(); return true;});
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
	            '</div>';
        }

        return {
            active: active,
            show: show,
            hide: hide,
            onLogin: onLogin,
        }
    })();
}

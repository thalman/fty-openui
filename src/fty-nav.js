function ftyNavigation () {
    return (
        '<nav class="navbar navbar-default">' +
	        '  <div class="container-fluid">' +
	        '    <div class="navbar-header">' +
	        '      <a class="navbar-brand" href="#">Fty</a>' +
	        '    </div>' +
	        '    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
	        '      <ul class="nav navbar-nav">' +
            '        <li class="dropdown">' +
            '          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"' +
            '             aria-haspopup="true" aria-expanded="false" id="navbardc">Datacenter<span class="caret"></span></a>' +
            '          <ul class="dropdown-menu" id="navbardclist">' +
            '            <li><a href="#">DC</a></li>'+
            '          </ul>' +
            '        </li>' +
            '        <li>' +
            '          <form class="navbar-form navbar-left" role="search">' +
            '            <div class="form-group"><input type="text" class="form-control" placeholder="Search" id="filter"></div>' +
            '          </form>' +
            '        </li>'+
            '        <li><a href="#/assets" onclick="ftyDrawPage(\'#/assets\'); return true;">Assets</a></li>'+
            '        <li><a href="#/alerts" onclick="ftyDrawPage(\'#/alerts\'); return true;">Alerts</a></li>'+
	        '      </ul>' +
            '      <ul class="nav navbar-nav navbar-right">' + // what is on right
            '        <li><a href="#/logout" id="navbarLogout">Logout</a></li>' +
            '      </ul>' +
	        '    </div>' +
	        '  </div>' +
	        '</nav>'
    );
}

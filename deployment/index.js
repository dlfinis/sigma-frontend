// set up ======================================================================
var port  	 = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080; 
var port_api = 1337	// set the api port
var ipaddr   = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var morgan   = require('morgan');
var compression = require('compression');
var proxy = require('express-http-proxy');

var express  = require('express');
var app      = express(); 								// create our app w/ express


// configuration ===============================================================

app.use(express.static(__dirname)); 		// set the static files location 
app.use(morgan('dev')); // log every request to the console
app.use(compression());


// New hostname+path
var apiProxy = proxy(ipaddr+':'+port_api+'/api', {
    forwardPath: function (req, res) {
		try{
	        return require('url').parse(req.baseUrl).path;
		}
		catch (e){
			console.log.err(e);
			console.log.err('Error of conection with api service');		
		}
    }
});


app.use('/api/*', apiProxy);


// listen (start app with node server.js) ======================================
app.listen(port,ipaddr);
console.log("Sigma Frontend listening on port " + port ,'& IP Address :',ipaddr);

var express = require('express');
var tracekit = require('../temp/tracekit');

/*
create express app
register handler
take in error
*/

var app = express();
app.use(express.bodyParser());
app.get('/report', function(req, res) {
	console.log(req.body);
	return 'werd';
});
var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());

app.get('/',function(req,res){
	res.redirect('/index.html');
});

app.use(express.static('./public'));

module.exports = app;

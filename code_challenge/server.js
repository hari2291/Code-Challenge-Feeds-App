
/* 
	This file creates a simple HTTP server for the application using express.js
	The initial index.html file is sent to the server and the path is set for accessing the other static files in our directory.
*/

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.get('/viewFeeds', function(req, res)
{
    res.sendFile(__dirname+'/src/index.html');
});

app.get('/viewFeeds/*', function(req, res)
{
    res.sendFile(__dirname+'/src/index.html');
});

app.get('/', function(req, res)
{
    res.redirect('/viewFeeds');
});

app.use(express.static(__dirname+'/src'));

app.listen(port, () =>{
	console.log('Application server has started on, and is listening to '+port);
});




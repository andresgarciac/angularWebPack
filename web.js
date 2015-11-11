var bodyParser = require('body-parser');
var compress = require('compression')();
var serveStatic = require('serve-static');
var express = require('express');
var app = express();

app.use(bodyParser());
app.disable('x-powered-by');
app.use(compress);

app.use(serveStatic(__dirname + '/dist', { maxAge: 64800000 }));
var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

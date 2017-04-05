require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var sync = require('synchronize');
var typeahead = require('./api/typeahead');
var pem = require('pem');
var https = require('https');

var app = express();


// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://compose.mixmax.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get('/typeahead', function(req, res, next) {
    typeahead(req, res, function(res) {
        console.log('body: ' + JSON.stringify(res.body));
        if (res.statusCode != 200 || !res.body) {
            res.status(500).send('Errors');
        }
        console.log(res.body)
        res.json(res.body);
    });
});



app.get('/resolver', function(req, res, next) {
    res.sendStatus(200);
});


app.get('/', function(req, res, next) {
    res.sendStatus(200);
});


if (process.env.NODE_ENV === 'production') {
    app.listen(process.env.PORT || 5000);
} else {
    pem.createCertificate({ days: 1, selfSigned: true }, function(err, keys) {
        if (err) throw err;

        https.createServer({
            key: keys.serviceKey,
            cert: keys.certificate
        }, app).listen(process.env.PORT || 5000);
    });
}

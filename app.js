require('dotenv').config();
var express = require('express');
var typeahead = require('./api/typeahead');
var resolver = require('./api/resolver');
var pem = require('pem');
var https = require('https');

var app = express();


// Enable CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://compose.mixmax.com');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});


app.get('/typeahead', function (req, res) {
    typeahead(req, res, function (res) {
        if (res.statusCode != 200 || !res.body) {
            res.status(500).send('Errors');
        }
        res.json(res.body);
    });
});


app.get('/resolver', function (req, res) {
    res.json({
        body: resolver(req.query.text)
    });
});


if (process.env.NODE_ENV === 'production') {
    app.listen(process.env.PORT || 5000);
} else {
    pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
        if (err) {
            throw err;
        }

        https.createServer({
            key: keys.serviceKey,
            cert: keys.certificate
        }, app).listen(process.env.PORT || 5000);
    });
}

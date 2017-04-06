require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var sync = require('synchronize');
var _ = require('underscore')
var app = express();
var Handlebars = require('handlebars');
var fs = require('file-system');

var photoTemplate = Handlebars.compile(fs.readFileSync(__dirname + '/../templates/resolver-template.handlebars', { encoding: 'UTF-8' }))

function buildResponse(url) {
    var values = { image_url: url };
    var html = photoTemplate(values);

    return html;
}


module.exports = function(photoURL) {
	return buildResponse(photoURL);
}
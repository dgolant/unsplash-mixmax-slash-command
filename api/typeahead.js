require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var sync = require('synchronize');
var _ = require('underscore')
var app = express();



function fetchPhotos(searchTerm, callback) {
    request({
        url: 'https://api.unsplash.com/search/photos/',
        qs: {
            client_id: process.env.UNSPLASH_APP_ID,
            query: searchTerm
        }
    }, callback);
}



function buildHTML() {
    return '<div><img src="https://images.unsplash.com/photo-1456796148441-485386946471?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&s=fd39246851797e74fbd5f00cd0f3f7ae"><br><b>Category: </b>Nature<br>By: <i><a href="http://unsplash.com/@asiquealam">User</a></i></div>'
}

module.exports = function(req, res, callback) {
    searchTerm = req.query.text ? req.query.text : '';
    res.statusCode = 200;
    if (searchTerm.trim() == '') {
        res.body = [{
            title: '<i>(please enter a search string)</i>',
            text: ''
        }];
        callback(res);
    } else {
        fetchPhotos(searchTerm, function(error, response, body) {
            body = JSON.parse(body);
            if (error) {
                console.log('Error occurred while finding photos: ' + error);
                res.statusCode = 500
                res.body = [{
                    title: 'There was an error fetching photos',
                    text: ''
                }]
            } else {
                console.log(body.results);
                photos = _.map(body.results, function(result) {
                    return {
                        title: buildHTML(),
                        text: ''
                    };
                });
                console.log('photos: ' + photos.length);
                res.body = photos;
            }
            callback(res);
        });
    }
}

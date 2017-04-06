require('dotenv').config();
var request = require('request');
var _ = require('underscore');
var Handlebars = require('handlebars');
var fs = require('file-system');


// our typeahead output template
var photoTemplate = Handlebars.compile(fs.readFileSync(__dirname + '/../templates/typeahead-template.handlebars', { encoding: 'UTF-8' }));

function fetchPhotos (searchTerm, callback) {
    request({
        url: 'https://api.unsplash.com/search/photos/',
        qs: {
            client_id: process.env.UNSPLASH_APP_ID,
            query: searchTerm
        }
    }, callback);
}



function buildResponse (photoObject) {

    // Get all the fields we need to fill the template
    var thumbnail_url = photoObject.urls.thumb;
    var user_url = photoObject.user.links.html;
    var user_name = photoObject.user.name;
    var photo_categories = 'No category listed';

    // Categories is occasionally null or not null  but still empty
    if (photoObject.categories && photoObject.categories[0] && photoObject.categories[0].title) {
        photo_categories = _.map(photoObject.categories, function (category) {
            return category.title;
        }).join(', ');
    }

    // build our template
    var values = {
        thumbnail_url: thumbnail_url,
        userprofile_url: user_url,
        username: user_name,
        category: photo_categories
    };
    var html = photoTemplate(values);

    return {
        title: html,
        text: photoObject.urls.small
    };
}

module.exports = function (req, res, callback) {

    // If, somehow, an null search term is passed, we can treat it as empty
    var searchTerm = req.query && req.query.text ? req.query.text : '';
    res.statusCode = 200;

    // If the term is blank or whitespace, we assume that the user just hasn't typed
    if (searchTerm.trim() == '') {
        res.body = [{
            title: '<i>(please enter a search string)</i>',
            text: ''
        }];
        callback(res);
    } else {
        fetchPhotos(searchTerm, function (error, response, body) {
            body = JSON.parse(body);
            if (error) {
                res.statusCode = 500;
                res.body = [{
                    title: 'There was an error fetching photos: ' + error,
                    text: ''
                }];
            } else {
                // Build our list of photo objects
                if (body.results && body.results.length > 0) {
                    var photos = _.map(body.results, function (result) {
                        return buildResponse(result);
                    });
                    res.body = photos;
                } else {
                    res.body = [{
                        title: 'No results found',
                        text: ''
                    }];
                }
            }
            callback(res);
        });
    }
};

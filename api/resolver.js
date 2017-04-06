require('dotenv').config();
var Handlebars = require('handlebars');
var fs = require('file-system');


// our resolver output template
var photoTemplate = Handlebars.compile(fs.readFileSync(__dirname + '/../templates/resolver-template.handlebars', { encoding: 'UTF-8' }));

function buildResponse (url) {
    var values = { image_url: url };
    var html = photoTemplate(values);

    return html;
}


module.exports = function (photoURL) {
    // Since we already have our image URL, we are just using this for styling
    return buildResponse(photoURL);
};
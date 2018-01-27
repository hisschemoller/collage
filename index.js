/**
 * @see https://stackoverflow.com/questions/40812254/how-to-get-a-random-image-from-the-images-directory-in-an-express-environment
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    fs = require('fs');

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/json', function (req, res) {
    res.json({"foo": "bar"});
});

app.use(express.static('dist'));

function getRandFile() {
    const imageDir = '../public/images/';
    fs.readdir(imageDir, (err, files) => {
        files.forEach(file => {
            //will add file name to an array and then return a random file name
        });
    });
}

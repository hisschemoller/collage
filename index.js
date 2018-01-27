/**
 * @see https://stackoverflow.com/questions/40812254/how-to-get-a-random-image-from-the-images-directory-in-an-express-environment
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    fs = require('fs'),
    imageArray;

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/json', function (req, res) {
    console.log('arr', imageArray);
    res.json({images: imageArray});
});

app.use(express.static('dist'));

getRandomFile().then(data => {
    imageArray = data;
});

function getRandomFile() {
    return new Promise((resolve, reject) => {
        const imageDir = '../../../Pictures/Google8/',
        imageArray = [];
        fs.readdir(imageDir, (err, files) => {
            files.forEach(file => {
                imageArray.push(file);
            });
            resolve(imageArray);
        });
    });
}

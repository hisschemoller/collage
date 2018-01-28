/**
 * @see https://stackoverflow.com/questions/40812254/how-to-get-a-random-image-from-the-images-directory-in-an-express-environment
 * @see https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    fs = require('fs'),
    path = require('path'),
    imageDirectories,
    allData = [];

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/json', function (req, res) {
    const data = allData[Math.floor(Math.random() * allData.length)];
    res.json({
        dir: data.dir,
        image: data.images[Math.floor(Math.random() * data.images.length)]
    });
});

app.get('/image', function (req, res) {
    const url = `${req.query.dir}${req.query.img}`;
    res.sendFile(path.resolve(url));
});

app.use(express.static('dist'));

imageDirectories = [
    '../../../Pictures/Google1/',
    '../../../Pictures/Google2/',
    '../../../Pictures/Google8/'
];

getAllDirectories(imageDirectories, allData);

function getAllDirectories(dirs, allData) {
    let promise = getAllFiles(dirs[0], allData);
    for (let i = 1, n = dirs.length; i < n; i++) {
        promise = promise.then(() => {
            return getAllFiles(dirs[i], allData);
        });
    }
}

function getAllFiles(dir, allData) {
    return new Promise((resolve, reject) => {
        let images = [];
        fs.readdir(dir, (err, files) => {
            files.forEach(file => {
                images.push(file);
            });
            allData.push({
                dir: dir,
                images: images
            }); 
            resolve();
        });
    });
}

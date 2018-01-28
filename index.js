/**
 * @see https://stackoverflow.com/questions/40812254/how-to-get-a-random-image-from-the-images-directory-in-an-express-environment
 * @see https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    fs = require('fs'),
    path = require('path'),
    config = require('./config.json'),
    allData = [];

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/json', function (req, res) {
    switch (req.query.type) {
        case 'image':
            const data = allData[Math.floor(Math.random() * allData.length)];
            res.json({
                dir: data.dir,
                image: data.images[Math.floor(Math.random() * data.images.length)]
            });
            break;
        case 'config':
            res.json(config);
            break;
    }
});

app.get('/image', function (req, res) {
    const url = `${req.query.dir}${req.query.img}`;
    res.sendFile(path.resolve(url));
});

app.use(express.static('dist'));

getAllDirectories(config.imageDirectories, allData);

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

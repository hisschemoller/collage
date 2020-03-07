/**
 * @see https://stackoverflow.com/questions/40812254/how-to-get-a-random-image-from-the-images-directory-in-an-express-environment
 * @see https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 */

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3002;
const config = require('./config.json');
const allData = [];
let numImages = 0;

server.listen(port, () => {
    console.log('listening on %d', port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/json', function (req, res) {
    switch (req.query.type) {
        case 'image':
            const data = [];
            for (let i = 0, n = req.query.amount; i < n; i++) {
                const imgIndex = Math.floor(Math.random() * numImages);
                allData.forEach(dirData => {
                    if (imgIndex >= dirData.startIndex && imgIndex < dirData.startIndex + dirData.images.length) {
                        data.push({
                            dir: dirData.dir,
                            image: dirData.images[imgIndex - dirData.startIndex]
                        });
                    }
                });
            }
            res.json(data);
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

getAllDirectories(config.imageDirectories);

function getAllDirectories(dirs) {
    Promise.all(dirs.map(getAllFiles)).then(() => {
        numImages = 0;
        allData.forEach(dirData => {
            dirData.startIndex = numImages;
            numImages += dirData.images.length;
            console.log(`dir data: ${dirData.startIndex} - ${dirData.images.length} - ${numImages}`);
        });
        console.log('num images', numImages);
    });
}

function getAllFiles(dir) {
    return new Promise((resolve, reject) => {
        let images = [];
        fs.readdir(dir, (err, files) => {
            files.forEach(filename => {
                if ((/[^\s]+(\.(jpg|jpeg|png|gif|bmp))$/i).test(filename)) {
                    images.push(filename);
                }
            });
            allData.push({
                dir: dir,
                images: images
            });
            resolve();
        });
    });
}

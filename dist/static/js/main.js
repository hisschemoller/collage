document.addEventListener('DOMContentLoaded', function(e) {
    let config,
        canvas,
        ctx,
        images;

    const init = () => {
        loadJSON('json?type=config').then(result => {
            config = result;
            canvas = document.getElementById('canvas');
            canvas.width = config.width;
            canvas.height = config.height;
            ctx = canvas.getContext('2d');
            document.getElementById('create-btn').addEventListener('click', createCollage);
            document.addEventListener('keyup', e => { e.keyCode === 13 ? createCollage() : null });
        });
    };

    const createCollage = () => {
        images = [];
        const numImages = 3;
        loadJSON(`json?type=image&amount=${numImages}`).then(data => {
            loadAllImages(data, images).then(() => {
                console.log(images);
            });
        });
    };

    const loadAllImages = (imageData, images) => {
        return new Promise((resolve, reject) => {
            let promise = loadImage(imageData, images, 0);
            for (let i = 1, n = imageData.length; i < n; i++) {
                promise = promise.then(img => { loadImage(imageData, images, i) });
            }
            promise.then(img => { resolve() });
        });
    };

    const loadImage = (imageData, images, index) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `image?dir=${imageData[index].dir}&img=${imageData[index].image}`;
            img.onload = () => { 
                images.push({
                    image: img,
                    filename: imageData[index].image,
                    filepath: imageData[index].dir
                })
                resolve();
            };
        });
    };
    
    const loadJSON = (url) => {
        return new Promise((resolve, reject) => {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType('application/json');
            xobj.open('GET', url, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == '200') {
                    resolve(JSON.parse(xobj.responseText));
                }
            };
            xobj.send(null);  
        });
    };
    
    init();
});


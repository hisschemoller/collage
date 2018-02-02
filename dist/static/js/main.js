document.addEventListener('DOMContentLoaded', function(e) {
    let config,
        canvas,
        ctx;

    const init = () => {
        loadJSON('json?type=config').then(result => {
            config = result;
            canvas = document.getElementById('canvas');
            canvas.width = config.width;
            canvas.height = config.height;
            ctx = canvas.getContext('2d');
            document.getElementById('create-btn').addEventListener('click', createCollage);
            document.addEventListener('keyup', e => { e.keyCode === 39 ? createCollage() : null });
        });
    };

    const createCollage = () => {
        const numImages = 5;
        loadJSON(`json?type=image&amount=${numImages}`).then(data => {
            console.log(data);
            Promise.all(data.map(loadImage)).then(drawAll);
        });
    };

    const loadImage = imageData => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = `image?dir=${imageData.dir}&img=${imageData.image}`;
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
    
    const drawAll = images => {
        drawBackground(images[0]);
        drawMidDistance(images[1]);
        return;
        for (let i = 2, n = images.length; i < n; i++) {
            if (images[i]) {
                let img = images[i],
                    sWidth = 100 + Math.random() * (img.width - 100),
                    sHeight = 100 + Math.random() * (img.height - 100),
                    sx = Math.random() * (img.width - sWidth),
                    sy = Math.random() * (img.height - sHeight),
                    scale = Math.random() * 1.4,
                    dWidth = sWidth * scale,
                    dHeight = sHeight * scale,
                    dx = Math.random() * (canvas.width - dWidth),
                    dy = Math.random() * (canvas.height - dHeight);
                // console.log(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        }
    };

    const drawBackground = img => {
        let sWidth = 100 + Math.random() * (img.width - 100),
            sHeight = 100 + Math.random() * (img.height - 100),
            sx = Math.random() * (img.width - sWidth),
            sy = Math.random() * (img.height - sHeight),
            scale = Math.max(canvas.width / sWidth, canvas.height / sHeight),
            dWidth = sWidth * scale,
            dHeight = sHeight * scale,
            dx = 0,
            dy = 0;
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    const drawMidDistance = img => {
        let sWidth = 100 + Math.random() * (img.width - 100),
            sHeight = 100 + Math.random() * (img.height - 100),
            sx = Math.random() * (img.width - sWidth),
            sy = Math.random() * (img.height - sHeight),
            scale = Math.max(canvas.width / sWidth, canvas.height / sHeight),
            dWidth = sWidth * scale,
            dHeight = sHeight * scale,
            isLeft = !!Math.round(Math.random()),
            xPosition = (canvas.width / 4) + (Math.random() * (canvas.width / 2))
            dx = isLeft ? xPosition - dWidth : xPosition,
            dy = 0;
        
        // console.log(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
    
    init();
});


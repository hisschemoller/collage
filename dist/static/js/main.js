/**
 * @see https://jmperezperez.com/drawing-edges-svg/
 */

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
            createCollage();
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
        for (let i = 0, n = images.length, num = 0; i < n; i++) {
            if (images[i]) {
                switch (num) {
                    case 0:
                        drawBackground(images[i]);
                        break;
                    case 1:
                        drawMidDistance(images[i]);
                        break;
                    case 2:
                        drawCloseDistance(images[i]);
                        break;
                }
                num++;
            }
        }
    };

    const drawBackground = img => {
        let sWidth = 100 + (Math.random() * (img.width - 100)),
            sHeight = (canvas.height / canvas.width) * sWidth,
            sx = Math.random() * (img.width - sWidth),
            sy = (img.height / 2) - (sHeight / 2),
            scale = Math.max(1, Math.max(canvas.width / sWidth, canvas.height / sHeight)),
            dWidth = sWidth * scale,
            dHeight = sHeight * scale,
            dx = Math.random() * (canvas.width - dWidth),
            dy = (canvas.height / 2) - (dHeight / 2);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    const drawMidDistance = img => {
        const clipWidth = (canvas.width * 0.2) + (Math.random() * (canvas.width * 0.6)),
            clipHeight = canvas.height,
            isLeft = !!Math.round(Math.random());
        
        createPath(clipWidth, clipHeight, isLeft);
        ({sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} = processImage(img, clipWidth, clipHeight, isLeft));
        ctx.save();
        ctx.clip();
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctx.restore();
        ctx.lineWidth = 8;
        // ctx.strokeStyle = '#ff0000';
        // ctx.stroke();
    }
    
    const drawCloseDistance = img => {
        const clipWidth = (canvas.width * 0.2) + (Math.random() * (canvas.width * 0.4)),
            clipHeight = canvas.height,
            isLeft = !!Math.round(Math.random());
        
        createPath(clipWidth, clipHeight, isLeft);
        ({sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} = processImage(img, clipWidth, clipHeight, isLeft));
        ctx.save();
        ctx.clip();
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctx.restore();
        // ctx.strokeStyle = '#00ff00';
        // ctx.stroke();
    };


    const createPath = (clipWidth, clipHeight, isLeft) => {
        const x = isLeft ? 0 : canvas.width - clipWidth,
            y = 0,
            w = clipWidth,
            h = canvas.height,
            hasMidPoint = Math.random() > 0.3,
            inSet = (Math.random() * 0.7) * clipWidth,
            topInset = Math.round(Math.random()) * inSet,
            midInset = Math.round(Math.random()) * inSet,
            btmInset = Math.round(Math.random()) * inSet;
        
        ctx.beginPath();
        if (isLeft) {
            ctx.lineTo(x + w - topInset, y);
            if (hasMidPoint) {
                ctx.lineTo(x + w - midInset, y + (h / 2));
            }
            ctx.lineTo(x + w - btmInset, y + h);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x, y);
        } else {
            ctx.moveTo(x + topInset, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x + btmInset, y + h);
            if (hasMidPoint) {
                ctx.lineTo(x + midInset, y + (h / 2));
            }
            ctx.lineTo(x + topInset, y);
        }
        ctx.closePath();
    };

    const processImage = (img, clipWidth, clipHeight, isLeft) => {
        const sWidth = 100 + Math.random() * (img.width - 100),
            sHeight = Math.min(sWidth, img.height),
            sx = Math.random() * (img.width - sWidth),
            sy = (img.height / 2) - (sHeight / 2),
            scale = Math.max(1, Math.max(clipWidth / sWidth, clipHeight / sHeight)),
            dWidth = sWidth * scale,
            dHeight = sHeight * scale,
            dx = isLeft ? 0 : canvas.width - clipWidth,
            dy = (canvas.height / 2) - (dHeight / 2);

        return {sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight};
    };
    
    init();
});

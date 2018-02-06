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
        // console.log(Math.round(sx), Math.round(sy), Math.round(sWidth), Math.round(sHeight), Math.round(dx), Math.round(dy), Math.round(dWidth), Math.round(dHeight), scale);
        // console.log((sHeight / sWidth).toFixed(3), (dHeight / dWidth).toFixed(3));
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    const drawMidDistance = img => {
        let sWidth = 100 + Math.random() * (img.width - 100),
            sHeight = Math.min(sWidth, img.height),
            sx = Math.random() * (img.width - sWidth),
            sy = (img.height / 2) - (sHeight / 2),
            scale = Math.max(1, Math.max(canvas.width / sWidth, canvas.height / sHeight)),
            dWidth = sWidth * scale,
            dHeight = sHeight * scale,
            isLeft = !!Math.round(Math.random()),
            xPosition = (canvas.width / 4) + (Math.random() * (canvas.width / 2)),
            dx = isLeft ? canvas.width - xPosition - dWidth : xPosition,
            dy = (canvas.height / 2) - (dHeight / 2),
            x, y, w, h;
        
        ctx.save();
        ctx.beginPath();
        if (isLeft) {
            x = 0;
            y = 0;
            w = dWidth + dx;
            h = canvas.height;
            ctx.lineTo(x + w - 100, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x, y);
            
        } else {
            x = dx;
            y = 0;
            w = canvas.width - dx;
            h = canvas.height
            ctx.moveTo(x + 100, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x + 100, y);
        }
        console.log(x, y, w, h);
        ctx.clip();
        // ctx.fillStyle = '#ffff00';
        // ctx.fillRect(x, y, w, h);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctx.restore();
    }
    
    const drawCloseDistance = img => {
        let sWidth = 100 + Math.random() * (img.width - 100),
            sHeight = Math.min(sWidth, img.height),
            sx = Math.random() * (img.width - sWidth),
            sy = (img.height / 2) - (sHeight / 2),
            scale = Math.max(1, Math.max(canvas.width / sWidth, canvas.height / sHeight)),
            dWidth = sWidth * scale,
            dHeight = sHeight * scale,
            isLeft = !!Math.round(Math.random()),
            xPosition = (canvas.width * 0.7) + (Math.random() * (canvas.width * 0.3))
            dx = isLeft ? canvas.width - xPosition - dWidth : xPosition,
            dy = (canvas.height / 2) - (dHeight / 2);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
    
    init();
});

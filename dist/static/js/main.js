/**
 * @see https://stackoverflow.com/questions/16221005/determine-orientation-of-photos-in-javascript
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
        const numImages = 3;
        loadJSON(`json?type=image&amount=${numImages}`).then(data => {
            console.log(data);
            Promise.all(data.map(loadImage)).then(images => {
                Promise.all(images.map(getIPhoneRotated)).then(drawAll);
            });
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

    const fixIPhoneRotation = (img) => {
        return new Promise((resolve, reject) => {
            if (!img) {
                resolve(null);
            }
            EXIF.getData(img, function() {
                const make = EXIF.getTag(this, 'Make');
                if (make && make.indexOf('Apple') > -1 && EXIF.getTag(this, 'Orientation') === 6) {
                    console.log('fixIPhoneRotation', img.src);
                    const angle = Math.PI / 2;
            
                    const canvas = document.createElement('canvas');
                    canvas.width = img.height;
                    canvas.height = img.width;    
                    
                    const ctx = canvas.getContext('2d');
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(angle);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    ctx.restore();

                    const rotatedImage = new Image();
                    rotatedImage.src = canvas.toDataURL();
                    rotatedImage.onload = () => {
                        console.log('fixIPhoneRotation done');
                        resolve(rotatedImage);
                    };
                } else {
                    resolve(img);
                }
            });
        });
    };

    const getIPhoneRotated = (img) => {
        return new Promise((resolve, reject) => {
            if (!img) {
                resolve({ img, isRotated: false });
            }
            EXIF.getData(img, function() {
                const make = EXIF.getTag(this, 'Make');
                if (make && make.indexOf('Apple') > -1 && EXIF.getTag(this, 'Orientation') === 6) {
                    console.log('This is a rotated iPhone photo', img.src);
                    resolve({ img, isRotated: true });
                } else {
                    resolve({ img, isRotated: false });
                }
            });
        });
    };
    
    const drawAll = (imageData) => {
        let count = 0;
        imageData.forEach(data => {
            if (data.img) {
                switch (count) {
                    case 0:
                        // test(data.img, data.isRotated);
                        drawBackground(data.img, data.isRotated);
                        break;
                    case 1:
                        drawMidDistance(data.img, data.isRotated);
                        break;
                    case 2:
                        drawCloseDistance(data.img, data.isRotated);
                        break;
                }
                count++;
            }
        });
    };

    const test = (img, isRotated) => {
        let sx = 100,
            sy = 200,
            sWidth = 800,
            sHeight = 600,
            dx = 100,
            dy = 200,
            dWidth = 400,
            dHeight = 300,
            strength = 0.5;
        
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.bezierCurveTo(dx + (sWidth * strength), dy, dx + dWidth, dy+ dHeight - (dHeight * strength), dx + dWidth, dy+ dHeight);
        ctx.lineTo(dx, dy + dHeight);
        ctx.lineTo(dx, dy);
        ctx.closePath();
        ctx.clip();
        
        if (isRotated) {
            ({sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} = rotateCoordinates(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight));
        }     

        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        ctx.lineWidth = 8;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
        ctx.restore();
    };

    const rotateCoordinates = (img, _sx, _sy, _sWidth, _sHeight, _dx, _dy, _dWidth, _dHeight) => {
        return {
            sx: _sy,
            sy: img.height - _sWidth - _sx,
            sWidth: _sHeight,
            sHeight: _sWidth,
            dx: _dy,
            dy: 0 - _dWidth - _dx,
            dWidth: _dHeight,
            dHeight: _dWidth
        };
    };

    const drawBackground = (img, isRotated) => {
        const imgWidth = isRotated ? img.height : img.width,
            imgHeight = isRotated ? img.width : img.height;

        let sWidth = 100 + (Math.random() * (imgWidth - 100)),
            sHeight = (canvas.height / canvas.width) * sWidth,
            sx = Math.random() * (imgWidth - sWidth),
            sy = (imgHeight / 2) - (sHeight / 2),
            scale = Math.max(1, Math.max(canvas.width / sWidth, canvas.height / sHeight)),
            dWidth = sWidth * scale,
            dHeight = sHeight * scale,
            dx = Math.random() * (canvas.width - dWidth),
            dy = (canvas.height / 2) - (dHeight / 2);
        
        if (isRotated) {
            ({sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} = rotateCoordinates(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight));
        }

        ctx.save();

        if (isRotated) {
            ctx.rotate(Math.PI / 2);
        }
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        ctx.restore();
    };

    const drawMidDistance = (img, isRotated) => {
        const imgWidth = isRotated ? img.height : img.width,
            imgHeight = isRotated ? img.width : img.height;

        const clipWidth = (canvas.width * 0.2) + (Math.random() * (canvas.width * 0.6)),
            clipHeight = canvas.height,
            isLeft = !!Math.round(Math.random());

        let {sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} = processImage(imgWidth, imgHeight, clipWidth, clipHeight, isLeft);
        
        createPath(clipWidth, clipHeight, isLeft, 0.7);

        ctx.save();
        ctx.clip();

        if (isRotated) {
            ({sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} = rotateCoordinates(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight));
        }

        if (isRotated) {
            ctx.rotate(Math.PI / 2);
        }
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        
        // ctx.lineWidth = 8;
        // ctx.strokeStyle = '#ff0000';
        // ctx.stroke();

        ctx.restore();
    }
    
    const drawCloseDistance = (img, isRotated) => {
        const imgWidth = isRotated ? img.height : img.width,
            imgHeight = isRotated ? img.width : img.height;

        const clipWidth = (canvas.width * 0.2) + (Math.random() * (canvas.width * 0.5)),
            clipHeight = canvas.height,
            isLeft = !!Math.round(Math.random());
        
        let {sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} = processImage(imgWidth, imgHeight, clipWidth, clipHeight, isLeft);
        
        createPath(clipWidth, clipHeight, isLeft, 0.9);

        ctx.save();
        ctx.clip();

        if (isRotated) {
            ({sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} = rotateCoordinates(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight));
        }

        if (isRotated) {
            ctx.rotate(Math.PI / 2);
        }
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        
        // ctx.lineWidth = 8;
        // ctx.strokeStyle = '#00ff00';
        // ctx.stroke();

        ctx.restore();
    };


    const createPath = (clipWidth, clipHeight, isLeft, maxInset) => {
        const x = isLeft ? 0 : canvas.width - clipWidth,
            y = 0,
            w = clipWidth,
            h = canvas.height,
            hasMidPoint = Math.random() > 0.3,
            inSet = (Math.random() * maxInset) * clipWidth,
            topInset = Math.round(Math.random()) * inSet,
            midInset = Math.round(Math.random()) * inSet,
            btmInset = Math.round(Math.random()) * inSet,
            hasCurve = Math.random() > 0.5,
            hasCurve2 = Math.random() > 0.5;
        
        let x1, y1, x2, y2, x3, y3;
        
        ctx.beginPath();
        if (isLeft) {
            x1 = x + w - topInset;
            y1 = y;
            x2 = x + w - midInset;
            y2 = y + (h / 2);
            x3 = x + w - btmInset;
            y3 = y + h;
            ctx.lineTo(x1, y1);
            if (hasMidPoint) {
                if (hasCurve) {
                    createCurve(x1, y1, x2, y2);
                } else {
                    ctx.lineTo(x2, y2);
                }
                if (hasCurve2) {
                    createCurve(x2, y2, x3, y3);
                } else {
                    ctx.lineTo(x3, y3);
                }
            } else {
                if (hasCurve) {
                    createCurve(x1, y1, x3, y3);
                } else {
                    ctx.lineTo(x3, y3);
                }
            }
            ctx.lineTo(x, y + h);
            ctx.lineTo(x, y);
        } else {
            x1 = x + topInset;
            y1 = y;
            x2 = x + midInset;
            y2 = y + (h / 2);
            x3 = x + btmInset;
            y3 = y + h;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x3, y3);
            if (hasMidPoint) {
                if (hasCurve) {
                    createCurve(x3, y3, x2, y2);
                } else {
                    ctx.lineTo(x2, y2);
                }
                if (hasCurve) {
                    createCurve(x2, y2, x1, y1);
                } else {
                    ctx.lineTo(x1, y1);
                }
            } else {
                if (hasCurve) {
                    createCurve(x3, y3, x1, y1);
                } else {
                    ctx.lineTo(x1, y1);
                }
            }
        }
        ctx.closePath();
    };

    const processImage = (imgWidth, imgHeight, clipWidth, clipHeight, isLeft) => {
        const sWidth = 100 + Math.random() * (imgWidth - 100),
            sHeight = Math.min(sWidth, imgHeight),
            sx = Math.random() * (imgWidth - sWidth),
            sy = (imgHeight / 2) - (sHeight / 2),
            scale = Math.max(1, Math.max(clipWidth / sWidth, clipHeight / sHeight)),
            dWidth = sWidth * scale,
            dHeight = sHeight * scale,
            dx = isLeft ? 0 : canvas.width - clipWidth,
            dy = (canvas.height / 2) - (dHeight / 2);
        return {sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight};
    };

    const createCurve = (x1, y1, x2, y2) => {
        let cp1x, cp1y, cp2x, cp2y;
        const isConvex = Math.random() > 0.5,
            strength = 0.3 + (Math.random() * 0.5);
        if (isConvex) {
            cp1x = x1 + ((x2 - x1) * strength);
            cp1y = y1;
            cp2x = x2;
            cp2y = y2 - ((y2 - y1) * strength);
        } else {
            cp1x = x1;
            cp1y = y1 + ((y2 - y1) * strength);
            cp2x = x2 - ((x2 - x1) * strength);
            cp2y = y2;
        }
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    };
    
    init();
});

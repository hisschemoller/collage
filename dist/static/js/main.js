document.addEventListener('DOMContentLoaded', function(e) {
    let config,
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

    const createCollage = () => {
        loadJSON('json?type=image').then(data => {
            console.log(data);
            let img = new Image();
            img.src = `image?dir=${data.dir}&img=${data.image}`;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            }
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
    
    loadJSON('json?type=config').then(data => {
        config = data;
        canvas.width = config.width;
        canvas.height = config.height;
        document.getElementById('create-btn').addEventListener('click', createCollage);
    });
});


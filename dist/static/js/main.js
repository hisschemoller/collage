document.addEventListener('DOMContentLoaded', function(e) {
    let config;

    const createCollage = () => {
        loadJSON('json?type=image').then(data => {
            console.log(data);
            let image = new Image();
            image.src = `image?dir=${data.dir}&img=${data.image}`;
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
        document.getElementById('create-btn').addEventListener('click', createCollage);
    });
});


document.addEventListener('DOMContentLoaded', function(e) {
    document.getElementById('create-btn').addEventListener('click', createCollage);
});

function createCollage() {
    loadJSON().then(data => {
        console.log(data);
    });
}

function loadJSON() {
    return new Promise((resolve, reject) => {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType('application/json');
        xobj.open('GET', 'json/', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == '200') {
                resolve(JSON.parse(xobj.responseText));
            }
        };
        xobj.send(null);  
    });
 }
let data_obj = new FormData(); 

window.addEventListener("unload", () => {
    const b = navigator.sendBeacon("http://localhost:8080/",data_obj)
});

const callback = data => {
    let field;
    for (field in data) {
        data_obj.append(field, data[`${field}`])
    }
}

(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://geolocation-db.com/jsonp";
    const initScript = document.getElementsByTagName('script')[0];
    initScript.parentNode.insertBefore(script, initScript);
})();

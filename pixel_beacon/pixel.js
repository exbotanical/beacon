function callback(data) {
    let data_obj = data;
    (() => {
        if (!("nav9" in window)) {
            window.nav9 = () => {
                window.nav9.queue.push(["toQueryString", data_obj]);
            };
            window.nav9.queue = [["toQueryString", data_obj],["send", 0]];
        }
        const script = document.createElement('script');
        script.src = `${process.env.URI}/script.js`;
        script.async = true;
        const initScript = document.getElementsByTagName('script')[0];
        initScript.parentNode.insertBefore(script, initScript);
    })();
}

(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://geolocation-db.com/jsonp";
    const initScript = document.getElementsByTagName('script')[0];
    initScript.parentNode.insertBefore(script, initScript);
})();

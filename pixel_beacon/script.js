(() => {
    var api = {}; // simulacrum api
    var params = [];
    // convert fields in data obj to query strings
    api.toQueryString = (data_obj) => {
        let field;
        for (field in data_obj) {
            params.push(`${field}=${encodeURIComponent(data_obj[field])}`);
        }
    };
   // join query strings and interpolate into URI
    api.send = (pid) => {
        params = params.join("&");
        const pixel = document.createElement("img");
        pixel.src = `${process.env.URI}/${pid}/pixel.png?${params}`;
        document.body.appendChild(pixel);
    };

    // pull methods from global queue obj and execute
    const execute = () => {
        /* 
        * Sequentially loads called methods into client script via queue window object.
        * Presumes queue entries are two-element arrays e.g. [method, params])
        */ 
        while (window.nav9.queue.length >= 1) {
            let command = window.nav9.queue.shift();
            let func = command[0];
            let parameters = command[1];
            if (typeof api[func] === "function") {
                api[func].call(window, parameters);
            } else {
                continue;
            }
        }
    };
    execute();
})();

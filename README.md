# Web Beacons

This repository collates experiments concerned with establishing *low-resource* web-beacons, automating remote data-logging, and utilizing many of the more esoteric HTTP status codes and the myriad interesting things we can do with them.

To date, the following endeavors have endured trial successfully[^1]:
 - Embedding a counter beacon inside of image byte-code. 
 - Data harvesting via Beacon API
 - Data harvesting via pure JS tracking pixel (written from scratch; no pre-generated tokens)


## Embedding an Executable Binary Inside of a JPG (OS-agnostic)
Documentation pending. For now, enjoy the demonstration:
![Demo](https://github.com/MatthewZito/WebBeacons/blob/master/image_beacon/imgbeacon.gif)

## Tracking Pixel
Tracking pixels have long been relied upon as a lightweight solution for analytics and data harvesting. The theory is quite simple, albeit clever: We take a standard GET request and transmogrify it (or so it seems, given the many [often esoteric] nuanced behaviors of HTTP) into a vehicle for delivering data.

We utilize the 'GET conduit' by collating the desired data into query parameters which are then interpolated into what is the src for a 1x1 pixel GIF (a GIF because it is essentially the smallest resource you can render). The GIF is criticial here: we need to serve an img tag in out webpage (or email) so the client will request said resource.

The client will indeed request the GIF resource, however, this request carries with it all of the harvested parameters, formatted and ready to be persisted into a database.

I've been using MongoDB across my tracking campaigns. I typically assign my pixels a tracking ID; database collections are instantiated dynamically and correlate to the pixel ID itself:

```
const upsertEntryQuaIpv4 = async (dbClient, ipv4Address, entryData, pixelIdentifier) => {
    const result = await dbClient.db(`tracking_pixel_${pixelIdentifier}`).collection("user_data")
        .updateOne(
            { ipv4_address: ipv4Address }, 
            { $set: entryData, $setOnInsert: { createdAt: new Date() }, $currentDate: { "lastModified": true }, $inc: { "pings": 1 } },
            { upsert: true }
        );
}
```
You can see that we will also set a few fields upon insert: date created (e.g. the first date our pixel has tracked *n* ipv4 address), last modified (data we last encountered a *n* ipv4 address), and pings, or the number of traces applicable to *n* ipv4 address. 

So, what happens when the request is made? This is where tracking pixels and beacons are strange. We'll discuss the Beacon API later (making POST requests to which a 204 Status Code is returned), but even in this particular instance, we are not expecially concerned with handling errors (we just elect to 'pass', or do nothing, rather). Unlike the Beacon, we *do* need to serve the requested 1x1 pixel GIF.

Most tracking pixel designs I've seen actually serve a static file (what a waste!). In fact, tracking pixels are such proprietary technology, you're perhaps looking at the only wholly open-source tracking pixel that isn't using an API-generated tracking script or token. 

Instead, we are going to generate our pixel ad hoc. That is, when the resource is requested, we create it: 
```
const imgData = [
    0x47,0x49, 0x46,0x38, 0x39,0x61, 0x01,0x00, 0x01,0x00, 0x80,0x00, 0x00,0xFF, 0xFF,0xFF,
    0x00,0x00, 0x00,0x21, 0xf9,0x04, 0x04,0x00, 0x00,0x00, 0x00,0x2c, 0x00,0x00, 0x00,0x00,
    0x01,0x00, 0x01,0x00, 0x00,0x02, 0x02,0x44, 0x01,0x00, 0x3b
    ];

const imgBuf = Buffer.from(imgData);

app.get("/:id/pixel.png", async (req, res) => {
        // collate data
        ...
        try {
            // persist to DB
            ...
            res.writeHead(200,{
                'Content-Type': 'image/gif',
                'Content-Length': imgData.length,
                });
        } 
        finally {
        res.end(imgBuf);
        }
    });
```

[^1]: What constitutes a *trial* (and *success* thereof) will be elucidated in an imminent update to this document.

Disclaimer: This software and all contents therein were created for research use only. I neither condone nor hold, in any capacity, responsibility for the actions of those who might intend to use this software in a manner malicious or otherwise illegal.
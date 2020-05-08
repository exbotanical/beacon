const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const assert = require("assert");
require('dotenv').config();

const main = async () => {
    /** 
    * Instantiate server, listen for GIF requests. Pull request query parameters, persist to database 
    * contingent on tracking pixel identification string.
    **/
    const dbURI = process.env.URI;
    app.use(express.static('public'));

    const imgData = [
        0x47,0x49, 0x46,0x38, 0x39,0x61, 0x01,0x00, 0x01,0x00, 0x80,0x00, 0x00,0xFF, 0xFF,0xFF,
        0x00,0x00, 0x00,0x21, 0xf9,0x04, 0x04,0x00, 0x00,0x00, 0x00,0x2c, 0x00,0x00, 0x00,0x00,
        0x01,0x00, 0x01,0x00, 0x00,0x02, 0x02,0x44, 0x01,0x00, 0x3b
        ];
    const imgBuf = Buffer.from(imgData);

    app.get("/:id/pixel.png", async (req, res) => {
            let data = {
                country_code: req.query.country_code,
                country_name: req.query.country_name,
                state_name: req.query.state,
                city_name: req.query.city,
                postal_code: req.query.postal,
                latitude: req.query.latitude,
                longitude: req.query.longitude,
                ipv4_address: req.query.IPv4
            };

            try {
                MongoClient.connect(dbURI, { useUnifiedTopology: true }, async (err, db) => {
                    assert.equal(null, err);
                    await upsertEntryQuaIpv4(db, req.query.IPv4, data, String(req.params.id));
                        console.log("added")
                        db.close();
                    });
                console.log(data);
                res.writeHead(200,{
                    'Content-Type': 'image/gif',
                    'Content-Length': imgData.length,
                    });
            } 
            finally {
            res.end(imgBuf);
            }
        });
    app.listen(8080, ()=>console.log("Listening on Port 8080"));
}

/**
 * Update an user_data entry qua ipv4 address
 * @param {MongoClient} client Given MongoClient; connected to user-specified cluster   
 * @param {string} ipv4Address Entry IPv4 Address, used to create/update entry
 * @param {object} entryData Data object, collation of user_data fields
 * @param {string} pixelIdentifier Tracking pixel identifier string, used to identify given ID-contingent database into which user data is collated
 */
const upsertEntryQuaIpv4 = async (dbClient, ipv4Address, entryData, pixelIdentifier) => {
    const result = await dbClient.db(`tracking_pixel_${pixelIdentifier}`).collection("user_data")
        .updateOne(
            { ipv4_address: ipv4Address }, 
            { $set: entryData, $setOnInsert: { createdAt: new Date() }, $currentDate: { "lastModified": true }, $inc: { "pings": 1 } },
            { upsert: true }
        );
}

main().catch(console.error);
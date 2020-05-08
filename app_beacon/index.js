const express = require("express");
const app = express();
var multer  = require("multer");
var upload = multer();
var { MongoClient } = require("mongodb");
var assert = require("assert");
require('dotenv').config();

async function main() {
    /** 
    *  Instantiate server, listen for beacon responses and persist to database.
    **/
    const dbURI = process.env.URI;
    
    app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));

    app.get("/img/:id", (req, res)=> {
        const id = req.params.id;
        res.sendFile(`${__dirname}/img/${id}`);
    });

    app.post("/", upload.none(), async function(req, res) {
        
        let data = {
            country_code: req.body.country_code,
            country_name: req.body.country_name,
            state_name: req.body.state,
            city_name: req.body.city,
            postal_code: req.body.postal,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            ipv4_address: req.body.IPv4
        };

        try {
            // Connect to the MongoDB cluster
            MongoClient.connect(dbURI, { useUnifiedTopology: true }, async function (err, db) {
                assert.equal(null, err);
                await upsertEntryQuaIpv4(db, req.body.IPv4, data);
                    db.close();
                });
        } 
        finally {
            res.sendStatus(204);
        }
    });
    app.listen(8080, ()=>console.log("Listening on Port 8080"));
}

/**
 * Update an user_data entry qua ipv4 address
 * @param {MongoClient} client Given MongoClient; connected to user-specified cluster   
 * @param {string} ipv4Address Entry IPv4 Address, used to create/update entry
 * @param {object} entryData Data object, collation of user_data fields
 */
async function upsertEntryQuaIpv4(dbClient, ipv4Address, entryData) {
    const result = await dbClient.db("test").collection("user_data")
        .updateOne(
            { ipv4_address: ipv4Address }, 
            { $set: entryData, $setOnInsert: { createdAt: new Date() }, $currentDate: { "lastModified": true }, $inc: { "pings": 1 } },
            { upsert: true }
        );
}

main().catch(console.error)
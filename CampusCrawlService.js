
 
/**
 * This module implements a REST-inspired webservice for the Campus Crawl DB.
 * The database is hosted on ElephantSQL.
 *
 * @author: avolzer
 * @date: Fall, 2020
 */

// Set up the database connection.
const pgp = require('pg-promise')();
const db = pgp({
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    database: process.env.DB_USER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/locations", readLocations);
router.get("/locations/:id", readLocation);

app.use(router);
app.use(errorHandler);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function errorHandler(err, req, res) {
    if (app.get('env') === "development") {
        console.log(err);
    }
    res.sendStatus(err.status || 500);
}

function returnDataOr404(res, data) {
    if (data == null) {
        res.sendStatus(404);
    } else {
        res.send(data);
    }
}

function readHelloMessage(req, res) {
    res.send('Team B data service');
}

function readLocations(req, res, next) {
    db.many("SELECT * FROM Location")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readLocation(req, res, next) {
    db.oneOrNone('SELECT * FROM Location WHERE id=${id}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}
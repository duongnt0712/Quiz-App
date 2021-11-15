const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const attempts = require('./routes/attempts.js');
const app = express();
//
const DATABASE_NAME = 'wpr-quiz';
const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.disable('etag');

let db = null;
let collectionQ = null;
let collectionA = null;

async function startServer() {
    const client = await MongoClient.connect(MONGO_URL);
    db = client.db();
    console.log('DB connected!');

    collectionQ = db.collection('questions');
    collectionA = db.collection('attempts');
    function setCollection(req,res,next) {
        req.collectionQ = collectionQ;
        req.collectionA = collectionA;
        next();
    }
    
    app.use(setCollection);
    app.use('/attempts', attempts);

    await app.listen(3000, function() {
        console.log('Server listening on port 3000!')
    });
}

startServer();
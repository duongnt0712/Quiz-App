const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const app = express();

const questions = require('./routes/questions.js');

const DATABASE_NAME = 'wpr-quiz';
const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.disable('etag');

let db = null;
let collection = null;

async function startServer() {
    const client = await MongoClient.connect(MONGO_URL);
    db = client.db();
    console.log('DB connected!');

    collection = db.collection('questions');
    function setCollection(req,res,next) {
        req.collection = collection;
        next();
    }

    //Allow cross-origin access
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    app.use(setCollection);
    app.use('/questions', questions);

    await app.listen(3001, function() {
        console.log('Server listening on port 3001!')
    });
}
startServer();

app.get('/', function(req,res){
    res.redirect(302, '/questions');
});


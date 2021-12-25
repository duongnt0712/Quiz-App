const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

router.get('/', async function(req,res,next) {
    const questionContainer = await req.collection.find().toArray();
    let questionArray = [];
    for(const quest in questionContainer) {
        let question = {
            _id: questionContainer[quest]._id,
            text: questionContainer[quest].text,
            answers: questionContainer[quest].answers,
            correctAnswer: questionContainer[quest].correctAnswer
        } 
        questionArray.push(question);
    }
    res.json(questionArray);
});

router.post('/', async function(req,res,next) {
    const text = req.body.text;
    const answers = req.body.answers;
    const correctAnswer = req.body.correctAnswer;

    const newQuestion = {
        text: text,
        answers: answers,
        correctAnswer: correctAnswer
    };

    //TODO: save into db
    const savedQuestion = await req.collection.insertOne(newQuestion);
    res.json(savedQuestion);
});

router.get('/:id', async function(req,res,next) {
    const id = req.params.id;  

    // check if question exist
    const dbQuestion = await req.collection.findOne({_id: ObjectId(`${id}`.trim())});
    if (dbQuestion === null) {
        return res.status(404).end(); 
    }

    const question = {
        text: dbQuestion.text,
        answers: dbQuestion.answers,
        correctAnswer: dbQuestion.correctAnswer
    }
    res.json(question);
});

router.put('/:id', async function(req,res,next) {
    //TODO: Update question
    const id = req.params.id; 
    const text = req.body.text;
    const answers = req.body.answers;
    const correctAnswer = req.body.correctAnswer;

    // check if question exist
    const dbQuestion = await req.collection.findOne({_id: ObjectId(`${id}`)});
    if (dbQuestion === null) {
        return res.status(404).end(); 
    }
    if(text === null || answers === null || correctAnswer === null) {
        return res.status(400).end();
    }

    //update attempt in db
    const filter = {_id: ObjectId(`${id}`)}
    const update = {
        $set: { 
            text: text,
            answers: answers, 
            correctAnswer: correctAnswer
        }
    };
    const params = {upsert:true};

    await req.collection.updateOne(filter, update, params);
    const updatedQuestion = await req.collection.find({_id:ObjectId(`${id}`)}).toArray();
    res.json(updatedQuestion);
});

router.delete('/:id', async function(req,res,next) {
    const id = req.params.id;

    const deletedQuestion = await req.collection.deleteOne({_id: ObjectId(`${id}`)});
    res.json(deletedQuestion);
});

module.exports = router;
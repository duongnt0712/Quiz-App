const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

router.post('/', async function(req, res, next) {
    const questionContainer = await req.collectionQ.find().toArray();
    let attempt = {};
    let questionArray = [];
    for(const q in questionContainer) {
        let question = {
            _id: questionContainer[q]._id,
            answers: questionContainer[q].answers,
            text: questionContainer[q].text,
            __v: 0
        }
        questionArray.push(question);
    }

    const questionArrayShuffle = questionArray.sort(() => 0.5 - Math.random());
    const tenQuestionArray = questionArrayShuffle.slice(0, 10);
    let startedAt = new Date();
    attempt = {
        questions: tenQuestionArray,
        completed: false,
        score: 0,
        startedAt: startedAt
    }
    const attempts = await req.collectionA.insertOne(attempt);
    res.json(attempt);
})

router.post('/:id/submit', async function(req,res,next) {
    const id = req.params.id;
    const answers = req.body.answers;
    const attempt = await req.collectionA.findOne({_id: ObjectId(`${id}`)})
    let score = 0;
    let scoreText = null;

    //get array correctAnswers
    const correctAnswers = {};
    const questionContainer = await req.collectionQ.find().toArray();
    for(const q in questionContainer) {
        correctAnswers[questionContainer[q]._id] = questionContainer[q].correctAnswer;
    }
    
    //compare answers vs correctAnswer[answer]
    for(const a in answers) {
        for(const c in correctAnswers) {
            if(a == c && answers[a] === correctAnswers[c]) {
                score++;
            }
        }
    }
    //score condition
    if (score < 5) {
        scoreText = 'Practice more to improve it :D';
    } else if (score < 7) {
        scoreText = 'Good, keep up!';
    } else if (score < 9) {
        scoreText = 'Well done!';
    } else {
        scoreText = 'Perfect!!';
    }

    //update attempt in db
    const filter = {_id: ObjectId(`${id}`)}
    const update = {
        $set: { 
            questions: attempt.questions, 
            completed: true, 
            score: score,
            correctAnswers: correctAnswers, 
            startedAt: attempt.startedAt,
            answers: answers, 
            scoreText: scoreText
        }
    };
    const params = {upsert:true};

    await req.collectionA.updateOne(filter, update, params);
    const updatedAttempt = await req.collectionA.find({_id:ObjectId(`${id}`)}).toArray();
    res.json(updatedAttempt)
})

module.exports = router;
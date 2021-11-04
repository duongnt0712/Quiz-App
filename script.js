// TODO(you): Write the JavaScript necessary to complete the assignment.

//DOM elememts
const body = document.querySelector('body');

const btnStart = document.querySelector('.btn-start');
const btnSubmit = document.querySelector('.btn-submit');
const btnReview = document.querySelector('.btn-review');

const attempQuiz = document.querySelector('#attempt-quiz');
const reviewQuiz = document.querySelector('#review-quiz');

const questionContainerAQ = attempQuiz.querySelector('.question-container');
const questionContainerRQ = reviewQuiz.querySelector('.question-container');

let packId; // store 

//Screen 1: Introduction
//Hide screen 2 & 3
document.querySelector('#attempt-quiz').classList.add('hidden');
document.querySelector('#review-quiz').classList.add('hidden');

function onResponse(response) {
    return response.json();
}

//Starting the quiz: Create received questions
function createQuestions(response) {
    packId= response._id;
    const questions = response.questions;

    for (let quest of questions){
        const question = document.createElement('div');
        question.classList.add('question');
        question.id = quest._id;
        questionContainerAQ.appendChild(question);

        const questionNumber = document.createElement('h2');
        questionNumber.innerHTML = `Question ${questions.indexOf(quest) + 1} of 10`;
        question.appendChild(questionNumber);

        const questionContent = document.createElement('p');
        questionContent.textContent = quest.text;
        question.appendChild(questionContent);

        const options = document.createElement('div');
        options.classList.add('option');
        question.appendChild(options);

        //create answers radio input
        const answers = quest.answers;
        let index = 0;
        for(let answer in answers) {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.name = `question${questions.indexOf(quest) + 1}`;
            input.id = index;
            input.type = 'radio';
            input.value = answers[answer];
            index++;

            const content = document.createTextNode(answers[answer]);            

            label.appendChild(input);
            label.appendChild(content);
            options.appendChild(label);
        }
    }
}

// Click and changing between answer
function onHighlight() {
    const questions = attempQuiz.querySelectorAll('.question');
    for (const question of questions){
        const answers = question.querySelectorAll('label');
        for (let answer of answers) {
            answer.addEventListener('click', function(event) {
                const selectText = question.querySelector('.checked');
                if(selectText) {
                    selectText.classList.remove('checked');
                }
                //Selected answer
                const label = event.currentTarget;
                label.classList.add('checked');
            });
        }
    }
}

//Calling the provided API and Displaying received questions on the Screen 2: Attempt quiz
btnStart.addEventListener('click', function(){
    body.scrollIntoView();
    document.querySelector('#introduction').classList.add('hidden');
    document.querySelector('#attempt-quiz').classList.remove('hidden');

    fetch('https://wpr-quiz-api.herokuapp.com/attempts', {
        method: "POST",
        headers:{
            'Content-Type':'application/json'
        }
    }).then(onResponse).then(createQuestions).then(onHighlight);
});

//Answer quiz questions: Get answers from user
function getAnswers(answers) {
    answers = {
        'answers': {}
    }
    const questions = document.querySelectorAll('.question');
    for (let question of questions) {
        const option = question.querySelector('.option');
        const labels = option.querySelectorAll('label');
        let index = 0;
        for(let label of labels) {
            if(label.querySelector('input').checked === true) {
                answers['answers'][question.id] = index;
            }
            index++;
        }
    }
    return answers;
}

//Create the label for correct answer 
function isCorrect(label) {
    const labelCheck = document.createElement('div');
    labelCheck.classList.add('label-check');
    label.appendChild(labelCheck);

    const span = document.createElement('span');
    span.innerHTML = "Correct answer";
    labelCheck.appendChild(span);
}

//Create the label for wrong answer 
function isWrong(label) {
    label.classList.add('wrong');
    label.classList.remove('checked');

    const labelCheck = document.createElement('div');
    labelCheck.classList.add('label-check');
    label.appendChild(labelCheck);

    const span = document.createElement('span');
    span.innerHTML = "Your answer";
    labelCheck.appendChild(span);
}

function reviewAnswers(response) {
    //disable all inputs
    const inputs = reviewQuiz.querySelectorAll('input');
    for(let input of inputs) {
        input.disabled = true;
    }

    //make label for each answer
    const correctAnswers = response.correctAnswers;
    const questions = reviewQuiz.querySelectorAll('.question');
    for(let question of questions){
        const correctId = JSON.stringify(correctAnswers[question.id]);
        const option = question.querySelector('.option');
        const labels = option.querySelectorAll('label');
        for(let label of labels) {
            const input = label.querySelector('input');
            if(input.checked === true && input.id === correctId) { //Correct answer
                label.classList.add('correct');
                label.classList.remove('checked');
                isCorrect(label);
            } else if (input.checked === true && input.id !== correctId) { //Wrong answer
                isWrong(label);
            } else if (input.id === correctId && !label.classList.contains('correct')) { //Correct answer for unselected answer
                label.classList.add('checked');
                isCorrect(label);
            }
        }
    }
    //Display score
    document.querySelector('.score').textContent = `${response.score}/10`;
    document.querySelector('.percent').textContent = `${response.score*10}%`;
    document.querySelector('.text-review').textContent = response.scoreText;
}

//Submit and Reivew answers
btnSubmit.addEventListener('click', function(){
    const confirmBox = window.confirm('Are you sure to continue?');
    if(confirmBox){
        body.scrollIntoView();
        document.querySelector('#attempt-quiz').classList.add('hidden');
        document.querySelector('#review-quiz').classList.remove('hidden');

        //display review questions in screen 3 by cloning screen 2
        const questionsAQ = attempQuiz.querySelectorAll('.question');
        for (let question of questionsAQ) {
            questionContainerRQ.appendChild(question.cloneNode(true));
        }

        //Call API and display review screen
        const answerPack = getAnswers();
        fetch(`https://wpr-quiz-api.herokuapp.com/attempts/${packId}/submit`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(answerPack)
        }).then(onResponse).then(reviewAnswers);
    }  
});

//Back to Screen 1
btnReview.addEventListener('click', function(){
    body.scrollIntoView();
    document.querySelector('#review-quiz').classList.add('hidden');
    document.querySelector('#introduction').classList.remove('hidden');
    //Remove existed data
    const allQuestions = document.querySelectorAll(".question");
    for(let question of allQuestions) {
        question.remove();
    }
});
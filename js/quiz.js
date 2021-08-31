// Constants for connecting to HTML elements to JS
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const questionImage = document.getElementById("questionImage");

// Quiz Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;

// Variables
let finishedRule = false;
let finishedSign = false;
let acceptingAnswers = false;

let signScore = 0;
let ruleScore = 0;
let questionCounter = 0;

let currentQuestion = {};

let avaliableQuestions = [];
let questionSign = [];
let questionRule = [];
let allRoadSignQuestions = [];
let allRoadRuleQuestions = [];


// Fetch JSON Files of questions for the test
// startQuiz() is used when data is resolved
fetch('/questions/roadSigns.json')
.then(
    function(response) {
    if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
        response.status);
        return;
    }
    // Examine the text in the response
    response.json().then(function(data) {
        allRoadSignQuestions= data;
        questionSign = chooseRandomQuestion(allRoadSignQuestions);
    });
    }
)
.catch(function(err) {
    console.log('Fetch Error :-S', err);
});

fetch('/questions/roadRules.json')
.then(
    function(response) {
    if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
        response.status);
        return;
    }
    // Examine the text in the response
    response.json().then(function(data) {
        allRoadRuleQuestions = data;
        questionRule = chooseRandomQuestion(allRoadRuleQuestions);
        console.log(questionRule);
        startQuiz();
    });
    }
)
.catch(function(err) {
    console.log('Fetch Error :-S', err);
});


const chooseRandomQuestion = (questions) => {
    // this function takes in all questions and
    // generates a list of 20 random questions taken from all the questions

    let usedIndex = [];

    let randomIndex = Math.floor(Math.random() * questions.length);
    let randomQuestionList = [];

    while (randomQuestionList.length < MAX_QUESTIONS) {
        if (!(randomQuestionList.includes(questions[randomIndex]))) {
            randomQuestionList.push(questions[randomIndex]);
            usedIndex.push(randomIndex);
        }
        randomIndex = Math.floor(Math.random() * questions.length);
    }
    return randomQuestionList;
};



/* startQuiz 'Main Game' Fnction
- initalize score, questionCounter
*/
startQuiz = () => {
    questionCounter = 0;
    score = 0;

    // later add if statement for whatt he user chooses (just sign, just rule or all);
    // defualt setitng = all
    avaliableQuestions = [...questionSign];
    console.log(questionRule, questionSign);
    getNewQuestion();
};

/* getNewQuestion Function
========================
- increment questionCounter
- selects random question in 'questions'
*/
getNewQuestion = () => {

    // terminal (base) cases
    if (avaliableQuestions.length == 0 && !finishedSign) {
        finishedSign = true;
        localStorage.setItem('recentSignScore', signScore); // not needed?

        // unload img foor sign quiz
        questionImage.classList.add("hide");
        avaliableQuestions = [...questionRule];
        questionCounter = 0;

        // unhide the result box
        // setTimeout(() => {
        //     // hide the result box


        // }, 1000);
    }
    if (avaliableQuestions.length == 0 && finishedSign) {
        finishedRule = true;
    }
    // When the quiz ends, save score and move to 'end.html'
    if (avaliableQuestions.length == 0 && finishedRule) {
        localStorage.setItem('recentRuletScore', ruleScore); // not needed?
        return window.location.assign('end.html');
    }

    // if (finishedSign && !finishedRule) {
    //     avaliableQuestions = [...questionRule];
    //     // switch off to resolve ^ 
    //     finishedSign = false;
    //     questionCounter = 0;
    //     // switch to random end of sign questions, beginning rules


    // }
    
    // Updating questionCounter
    questionCounter++;
    // questionCounterText.innerText = `${questionCounter} / ${MAX_QUESTIONS}`;
    progressText.innerText = `Question ${questionCounter} / ${MAX_QUESTIONS}`;
    
    // Update the progrss bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;


    const questionIndex = Math.floor(Math.random() * avaliableQuestions.length);
    currentQuestion = avaliableQuestions[questionIndex];
    // console.log(currentQuestion, avaliableQuestions);

    // Change question text
    question.innerText = currentQuestion.question;

    if (!finishedSign) {
        questionImage.src = currentQuestion.image;
    }

    // Printing Choices on HTML
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    avaliableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

//
choices.forEach(choice => {
    choice.addEventListener('click', e => {

        if (!acceptingAnswers) {
            return;
        }

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number']

        // ans is based on 0 index (+ 1 to correct to normal counting)
        const classToApply = 
            selectedAnswer == currentQuestion.answer + 1 ? "correct" : "incorrect";
        

        // Increment the Score
        if (classToApply === "correct")
            incrementScore(CORRECT_BONUS);

        // Visual effect for selected 'correct' or 'incorrect' choice
        selectedChoice.parentElement.classList.add(classToApply);

        //setTimeout; delays 1000 ms (1 sec) and getNewQuestion()
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
             }, 1000);
    });
});

// incrementScore function
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};
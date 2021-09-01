// Constants for connecting to HTML elements to JS
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const questionImage = document.getElementById("questionImage");
const game = document.getElementById("game");

const selectBox = document.querySelector(".select-box");
const resultBox = document.querySelector(".result-box");
const resultText = resultBox.querySelector(".result-text");     
const scoreFinal = resultBox.querySelector(".score");

// HTML Buttons
const options = document.querySelector(".options");
const rules = selectBox.querySelector(".rules");
const signs = selectBox.querySelector(".signs");
const all = selectBox.querySelector(".all");
const again = resultBox.querySelector(".again");
const home = resultBox.querySelector(".home");

// Quiz Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;

// Variables
let finishedRule = false;
let finishedSign = false;
let acceptingAnswers = false;
let onlySign = false;
let onlyRule = false;
let buttonPressed = false;

let signScore = 0;
let ruleScore = 0;
let questionCounter = 0;

let currentQuestion = {};

let avaliableQuestions = [];
let questionSign = [];
let questionRule = [];
let allRoadSignQuestions = [];
let allRoadRuleQuestions = [];


window.onload = () => {
    signs.onclick = () => {
        onlySign = true;
        displayQuiz();
    };

    rules.onclick = () => {
        onlyRule = true;
        displayQuiz();
    };

    all.onclick = () => {
        displayQuiz();
    };
};

// wait function used to delay until user has pressed button
const waitForIt = () => {
    if (!buttonPressed) {
        setTimeout(waitForIt, 500);
    } else {
        buttonPressed = true;
        startQuiz();
    }
};

// display 'hide/unhide' elems on html
const displayQuiz = () => {
    buttonPressed = true;
    setTimeout(() => {
        game.classList.remove("hide");
        selectBox.classList.add("hide");
    }, 300);
};


const displayResult = (scoreSection, isSign) => {
    let testType = isSign == true ? 'Sign' : 'Rule';

    game.classList.add("hide");
    resultBox.classList.remove("hide");
    scoreFinal.innerHTML = scoreSection;

    if (scoreSection >= 160) {
        resultText.innerHTML = `You have successful passed the ${testType}'s section with ${scoreSection / CORRECT_BONUS} / ${MAX_QUESTIONS} answered!`;
    } else {
        resultText.innerHTML = `Unforunately you have failed the ${testType}'s section with ${scoreSection / CORRECT_BONUS} / ${MAX_QUESTIONS} answered :(.`;
    }
    
    // button onclick to leave or retake
    again.onclick = () => {
        setTimeout(() => {
            return window.location.assign("quiz.html");
        }, 500);
    }

    home.onclick = () => {
        setTimeout(() => {
            return window.location.assign("index.html");
        }, 500);
    }
};


/* Fetch JSON Files of questions for the test
startQuiz() is used when data is resolved */
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
    let randomQuestionList = [];

    let randomIndex = Math.floor(Math.random() * questions.length);

    while (randomQuestionList.length < MAX_QUESTIONS) {

        if (!(randomQuestionList.includes(questions[randomIndex]))) {
            randomQuestionList.push(questions[randomIndex]);
            usedIndex.push(randomIndex);
        }
        randomIndex = Math.floor(Math.random() * questions.length);
    }
    return randomQuestionList;
};

/* startQuiz 'Main Game' Function
===================
- initalize score, questionCounter */
startQuiz = () => {
    questionCounter = 0;
    score = 0;

    if(!buttonPressed) {
        waitForIt();
    }
    // defualt setitng = all
    else {
        if (onlyRule) {
            avaliableQuestions = [...questionRule];
            questionImage.classList.add("hide");
            finishedSign = true;

        } 
        else {
            avaliableQuestions = [...questionSign];
        }
        console.log(questionRule, questionSign);
        getNewQuestion();
    }
};


/* getNewQuestion Function
========================
- increment questionCounter
- selects random question in 'questions' */
getNewQuestion = () => {

    // terminal (base) cases
    // if there are no more sign questions and you HAVEN'T finished SIGNS
    if (avaliableQuestions.length == 0 && !finishedSign) {
        // localStorage.setItem('recentRuletScore', ruleScore); // not needed?
        // reset the score, question counter and image
        signScore = score;
        score = 0;
        scoreText.innerHTML = 0;
        questionCounter = 0;
        questionImage.classList.add("hide");

        // make sure the program knows you finished the signs test and queue next set of questions
        finishedSign = true;
        avaliableQuestions = [...questionRule];

        // if user didn't choose signs (doing whole quiz)
        if (!onlySign) {
            // remove option to leave
            again.classList.add("hide");
            home.classList.add("hide")

            displayResult(signScore, true);
            setTimeout(() => {
                displayQuiz();
                resultBox.classList.add("hide");
            }, 8000);
        } 
        else {
            displayResult(signScore, true);
        }
    }
    // if the user has no more questions and finished signs (means they finished rules as well!)
    if (avaliableQuestions.length == 0 && finishedSign) {
        finishedRule = true;
    }
    // if you finished the rules
    if (avaliableQuestions.length == 0 && finishedRule) {
        // localStorage.setItem('recentRuletScore', ruleScore); // not needed?
        ruleScore = score;
        displayResult(ruleScore, false);
        // for whole quiz, if hidden; then unhide
        again.classList.remove("hide");
        home.classList.remove("hide");
    }
    
    // if there are still questions to do
    if (avaliableQuestions.length !== 0) {
        // Updating questionCounter
        questionCounter++;
        // questionCounterText.innerText = `${questionCounter} / ${MAX_QUESTIONS}`;
        progressText.innerText = `Question ${questionCounter} / ${MAX_QUESTIONS}`;
        
        // Update the progrss bar
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

        // grab a random question from the availableQuestion array
        const questionIndex = Math.floor(Math.random() * avaliableQuestions.length);
        currentQuestion = avaliableQuestions[questionIndex];

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
    }
};

// checking onclick property of all available choices
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
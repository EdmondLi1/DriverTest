// Constants for connecting to HTML elements to JS
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

// const questionCounterText = document.getElementById("questionCounter");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");


// Quiz Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;

// Variables
let finishedRule = false;
let finishedSign = false;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let avaliableQuestions = [];
let questionSign = [];
let questionRule = [];


// Questions in stored in array using Objects (use JSON)
/* Fetch .json file then convert to json (readable), 
store in an Array and then catch errors. */
let roadSignQuestions = [];
let roadRuleQuestions = [];

// insert json file here using fetch api
fetch("questions/roadSigns.json")
    .then(response => {
        return response.json(); 
    })
    .then(loadedQuestions => {
        roadSignQuestions = loadedQuestions;
    })
    .catch(error => {
       console.error(error); 
    });
    
// insert json file here using fetch api
fetch("questions/roadRules.json")
    .then(response => {
        return response.json(); 
    })
    .then(loadedQuestions => {
        roadRuleQuestions = loadedQuestions;
        startQuiz();
    })
    .catch(error => {
       console.error(error); 
    });

/* startQuiz 'Main Game' Fnction
- initalize score, questionCounter
- loads avaliableQuestion 'questions' JSON (line 18 to ~) */ 

const chooseRandomQuestion = (questions) => {
    const MAX_SUB_QUESTIONS = 20;
    let usedIndex = [];

    let randomIndex = Math.floor(Math.random() * questions.length);
    let randomQuestionList = [];

    while (randomQuestionList.length < MAX_SUB_QUESTIONS) {
        if (!(questions[randomIndex] in randomQuestionList)) {
            randomQuestionList.push(questions[randomIndex]);
            usedIndex.push(randomIndex);
        }
        randomIndex = Math.floor(Math.random() * questions.length);
    }
    return randomQuestionList;
};

startQuiz = () => {
    questionCounter = 0;
    score = 0;

    questionSign = chooseRandomQuestion(roadSignQuestions);
    questionRule = chooseRandomQuestion(roadRuleQuestions);
    console.log(questionSign);

    // allQuestions = roadSignQuestions.concat(roadRuleQuestions)
    avaliableQuestions = [...questionSign];

    getNewQuestion();
};

// getNewQuestion Function
/*
- increment questionCounter
- selects random question in 'questions'
*/
getNewQuestion = () => {
    if (avaliableQuestions.length == 0 && !finishedSign) {
        finishedSign = true;
    }

    if (finishedSign && !finishedRule) {
        avaliableQuestions = [...questionRule];
        // switch off to resolve ^ 
        finishedSign = false;
        questionCounter = 0;
        // switch to random end of sign questions, beginning rules

        // unload img foor sign quiz

    }
    // When the quiz ends, save score and move to 'end.html'
    else if (avaliableQuestions.length == 0 && finishedRule) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('end.html');
    }

   
    // Updating questionCounter
    questionCounter++;
    // questionCounterText.innerText = `${questionCounter} / ${MAX_QUESTIONS}`;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // Update the progrss bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;


    const questionIndex = Math.floor(Math.random() * avaliableQuestions.length);
    currentQuestion = avaliableQuestions[questionIndex];
    // Change question text
    question.innerText = currentQuestion.question;

    // change image text
    if (!finishedSign) {
        // laod img for sign quiz
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


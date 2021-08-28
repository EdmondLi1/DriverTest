// HTML Reference Constants
const username = document.getElementById("username");
const saveScoreButton = document.getElementById("saveScoreButton");
const finalScore = document.getElementById("finalScore");

// localStorage stores in String Lateral
const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Change Score to mostRecentScore
finalScore.innerText = mostRecentScore;

// if user types a username, 'Save' button has :hover [CSS STYLE]
username.addEventListener("keyup", () => {
    saveScoreButton.disabled = !username.value;
});



// when user clicks 'Save' button
saveHighScore = e => {
    // console.log('clicked the save button');
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
        };

    // Sorting Top 5 Highscores decrementing from top to bottom
    highScores.push(score);
    highScores.sort((a,b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("index.html");
};




const highScoresList = document.getElementById("highScoresList");
// store this in a data base to really make it secure
// people can tinker with localStorage with inspect tool
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];


highScoresList.innerHTML = 
highScores.map(score => {
    return `<li class="high-score"> ${score.name} - ${score.score}</li>`;
    }
).join("");


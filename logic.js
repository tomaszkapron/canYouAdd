var score = 0;
var backgroundArray = [];

function nextQuestion() {
    const n1 = Math.round(Math.random() * 5);
    document.getElementById('n1').innerHTML = n1;
    const n2 = Math.round(Math.random() * 5);
    document.getElementById('n2').innerHTML = n2;
    const correctAnswer = n1 + n2;
    return correctAnswer;
}

function checkAnswer(answer, correctAnswer) {
    console.log(`${answer} == ${correctAnswer}`);
    
    if(answer == correctAnswer){
        score++;
        console.log(`ok ${score}`);
        if(score <= 6){
            backgroundArray.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = backgroundArray;
        }else{
            alert('Well done!');
            score = 0;
            backgroundArray = [];
            document.body.style.backgroundImage = backgroundArray;
        }
    }
    else{
        if(score > 0){
            score--;
            backgroundArray.pop();
            document.body.style.backgroundImage = backgroundArray;
        }
        console.log(`not ok ${score}`);    
    }
}
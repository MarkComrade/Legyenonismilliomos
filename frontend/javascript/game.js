document.addEventListener('DOMContentLoaded', () => {
    getMethodFetch('/api/getQuestion')
        .then((data) => {
            loadQuestion(data);
        })
        .catch((error) => {
            console.error(error);
        });

    document.getElementById('backToMainBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    document.getElementById('newGameBtn').addEventListener('click', () => {
        location.reload();
    });
});

const loadQuestion = async (data) => {
    window.currentRound = data.question.nehezseg;
    const questionElement = document.getElementById('questionBody');

    questionElement.textContent = data.question.kerdes;

    data.answers.forEach((answer, index) => {
        const answerButton = document.getElementById(`answer${index + 1}`);
        answerButton.textContent = answer.valasz;

        answerButton.onclick = () => {
            checkAnswer(answer);
        };
    });
};

const checkAnswer = async (answer) => {
    if (answer.helyes == 1) {
        window.currentRound++;
        
        if (window.currentRound > 15) {
            showEndScreen('Gratulálok, megnyerted a főnyereményt: 150 000 000 Ft!', 150000000, 15);
            return;
        }

        try {
            await postMethodFetch('/api/updateGameState', { round: window.currentRound, money: 0 });
            const data = await getMethodFetch('/api/getQuestion');
            loadQuestion(data);
        } catch (error) {
            console.error(error);
        }
    } else {
        showEndScreen('Sajnos a válasz helytelen. Vesztettél! Nyereményed: 0 Ft', 0, window.currentRound - 1);
    }
};

const showEndScreen = async (message, money, level) => {
    document.getElementById('mainGameContainer').style.display = 'none';
    
    const endScreen = document.getElementById('endGameScreen');
    document.getElementById('endGameMessage').textContent = message;
    endScreen.style.display = 'block';

    try {
        await postMethodFetch('/api/endGame', { money: money, level: level });
    } catch (error) {
        console.error(error);
    }
};
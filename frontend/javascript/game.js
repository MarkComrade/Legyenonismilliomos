let currentRound = 1;

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

const highlightLevel = (level) => {
    for (let i = 1; i <= 15; i++) {
        const levelDiv = document.getElementById(`level${i}`);
        if (levelDiv) {
            levelDiv.style.border = 'none';
            levelDiv.style.backgroundColor = 'transparent';
            levelDiv.style.borderRadius = '0';
        }
    }
    
    const currentLevelDiv = document.getElementById(`level${level}`);
    if (currentLevelDiv) {
        currentLevelDiv.style.border = '2px solid blue';
        currentLevelDiv.style.borderRadius = '8px';
    }
};

const loadQuestion = async (data) => {
    currentRound = data.question.nehezseg;
    highlightLevel(currentRound);

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
        currentRound++;
        
        if (currentRound > 15) {
            showEndScreen('Kijutottál a puttonyból: 150 000 000 Ft!', 150000000, 15);
            return;
        }

        try {
            await postMethodFetch('/api/updateGameState', { round: currentRound, money: 0 });
            const data = await getMethodFetch('/api/getQuestion');
            loadQuestion(data);
        } catch (error) {
            console.error(error);
        }
    } else {
        let money = 0;
        let nyeremeny = "0 Ft";
        
        if (currentRound > 10) {
            money = 5000000;
            nyeremeny = "5 000 000 Ft";
        } else if (currentRound > 5) {
            money = 300000;
            nyeremeny = "300 000 Ft";
        }

        showEndScreen(`Lefőttél! Nyereményed: ${nyeremeny}`, money, currentRound - 1);
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
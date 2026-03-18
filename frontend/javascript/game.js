document.addEventListener('DOMContentLoaded', async () => {
    const backToMainBtn = document.getElementById('backToMainBtn');
    if (backToMainBtn) {
        backToMainBtn.addEventListener('click', async () => {
            await postMethodFetch('/api/resetGame', {});
            window.location.href = 'index.html';
        });
    }

    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', async () => {
            document.getElementById('endGameContainer').style.display = 'none';
            document.getElementById('mainGameContainer').style.display = 'flex';
            
            try {
                await postMethodFetch('/api/resetGame', {});
                const data = await getMethodFetch('/api/getQuestion');
                await loadQuestion(data);
            } catch (error) {
                console.error(error);
            }
        });
    }

    const continueYesBtn = document.getElementById('continueYesBtn');
    if (continueYesBtn) {
        continueYesBtn.addEventListener('click', async () => {
            document.getElementById('continueModal').style.display = 'none';
            document.getElementById('questionBody').style.display = 'block';
            document.getElementById('answers').style.display = 'flex';
            
            const helpRow = document.getElementById('helpRow');
            if (helpRow) helpRow.style.display = 'flex';
            
            try {
                const data = await getMethodFetch('/api/getQuestion');
                await loadQuestion(data);
            } catch (error) {
                console.error(error);
            }
        });
    }

    const continueNoBtn = document.getElementById('continueNoBtn');
    if (continueNoBtn) {
        continueNoBtn.addEventListener('click', async () => {
            document.getElementById('continueModal').style.display = 'none';
            document.getElementById('questionBody').style.display = 'block';
            document.getElementById('answers').style.display = 'flex';
            
            const helpRow = document.getElementById('helpRow');
            if (helpRow) helpRow.style.display = 'flex';
            
            const state = await getMethodFetch('/api/getGameState');
            const safeRound = state.round - 1;
            const prizeData = await postMethodFetch('/api/getPrizeInfo', { level: safeRound });
            await showEndScreen(`Megálltál! Nyereményed: ${prizeData.text}`, safeRound, prizeData.amount);
        });
    }

    document.getElementById('answers').addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('valaszBtn')) {
            const answerText = e.target.value;
            await checkAnswer({ valasz: answerText });
        }
    });

    document.getElementById('fiftyFifty').addEventListener('click', async (e) => {
        const data = await getMethodFetch('/api/getQuestion');
        await helpAnswer(e.target, data.answers);
    });

    document.getElementById('phoneAFriend').addEventListener('click', async (e) => {
        const data = await getMethodFetch('/api/getQuestion');
        await helpAnswer(e.target, data.answers);
    });

    document.getElementById('askTheAudience').addEventListener('click', async (e) => {
        const data = await getMethodFetch('/api/getQuestion');
        await helpAnswer(e.target, data.answers);
    });

    try {
        const data = await getMethodFetch('/api/getQuestion');
        await loadQuestion(data);
    } catch (error) {
        console.error(error);
    }
});

const loadQuestion = async (data) => {
    const currentRound = data.question.nehezseg;

    for (let i = 1; i <= 15; i++) {
        const levelDiv = document.getElementById(`level${i}`);
        if (levelDiv) {
            levelDiv.style.border = 'none';
            levelDiv.style.backgroundColor = 'transparent';
            levelDiv.style.borderRadius = '0';
        }
    }
    
    const currentLevelDiv = document.getElementById(`level${currentRound}`);
    if (currentLevelDiv) {
        currentLevelDiv.style.border = '2px solid blue';
        currentLevelDiv.style.borderRadius = '8px';
    }

    const helpRow = document.getElementById('helpRow');
    if (helpRow) helpRow.style.display = 'flex';

    const questionElement = document.getElementById('questionBody');
    questionElement.textContent = data.question.kerdes;

    data.answers.forEach((answer, index) => {
        const answerButton = document.getElementById(`answer${index + 1}`);
        if (answerButton) {
            answerButton.disabled = false;
            answerButton.value = answer.valasz;
        }
    });

    const fiftyBtn = document.getElementById('fiftyFifty');
    const phoneBtn = document.getElementById('phoneAFriend');
    const askBtn = document.getElementById('askTheAudience');

    if (fiftyBtn) fiftyBtn.disabled = false;
    if (phoneBtn) phoneBtn.disabled = false;
    if (askBtn) askBtn.disabled = false;

    try {
        const helpState = await getMethodFetch('/api/getHelpState');
        if (helpState.fiftyFifty && fiftyBtn) fiftyBtn.disabled = true;
        if (helpState.phoneAFriend && phoneBtn) phoneBtn.disabled = true;
        if (helpState.askTheAudience && askBtn) askBtn.disabled = true;
    } catch (error) {
        console.error(error);
    }
};

const checkAnswer = async (answer) => {
    try {
        const response = await postMethodFetch('/api/checkAnswer', { answer });
        
        if (response.correct) {
            const nextRound = response.nextRound;
            
            if (nextRound > 15) {
                await showEndScreen('Vége a puttyon életenek, mostmár kazdag vagy: 150 000 000 Ft!', 15, 150000000);
                return;
            }

            const justCompletedRound = nextRound - 1;
            await askContinue(justCompletedRound, nextRound);
            
        } else {
            await showEndScreen(`Húha te lefőttél! Nyereményed: ${response.nyeremeny}`, response.currentRound - 1, response.money);
        }
    } catch (error) {
        console.error(error);
    }
};

const askContinue = async (currentRound, nextRound) => {
    const prizeData = await postMethodFetch('/api/getPrizeInfo', { level: currentRound });
    const nyeremeny = prizeData.text;

    document.getElementById('questionBody').style.display = 'none';
    document.getElementById('answers').style.display = 'none';
    
    const helpRow = document.getElementById('helpRow');
    if (helpRow) helpRow.style.display = 'none';

    const modal = document.getElementById('continueModal');
    const message = document.getElementById('continueMessage');
    
    message.innerHTML = '';
    
    const h4 = document.createElement('h4');
    h4.textContent = 'Az igen!';
    message.appendChild(h4);
    
    const p1 = document.createElement('p');
    p1.style.fontSize = '18px';
    p1.style.fontWeight = 'bold';
    p1.textContent = `Eddigi nyereményed: ${nyeremeny}`;
    message.appendChild(p1);
    
    const p2 = document.createElement('p');
    p2.textContent = `Megállsz, vagy továbbmész a ${nextRound}. szintre?`;
    message.appendChild(p2);
    
    modal.style.display = 'block';
};

const showEndScreen = async (message, level, money) => {
    document.getElementById('mainGameContainer').style.display = 'none';
    
    const endScreen = document.getElementById('endGameScreen');
    if(endScreen) {
        document.getElementById('endGameMessage').textContent = message;
        endScreen.parentElement.style.display = 'flex';
        endScreen.style.display = 'block';
    }

    try {
        await postMethodFetch('/api/endGame', { money: money, level: level });
    } catch (error) {
        console.error(error);
    }
};

const helpAnswer = async (button,data) => {
    switch (button.id) {
        case 'fiftyFifty': {
            let disableAnswer = 0;
            document.getElementById('fiftyFifty').disabled = true;
            await postMethodFetch('/api/useHelp', { helpType: 'fiftyFifty' });

            let j = 0;
            while (disableAnswer < 2 && j < 50) {
                let random = Math.floor(Math.random() * 4);
                if (data[random].helyes == 0) {
                    const answerButton = document.getElementById(`answer${random + 1}`);
                    if (!answerButton.disabled) {
                        answerButton.disabled = true;
                        disableAnswer++;
                    }
                }
                j++;
            }
            break;
        }
        case 'phoneAFriend': {
            await getMethodFetch('/api/getGameState')
            .then(async (gameState) => {
                const currentRound = gameState.round;
                document.getElementById('phoneAFriend').disabled = true;
                await postMethodFetch('/api/useHelp', { helpType: 'phoneAFriend' });

                    let random = Math.floor(Math.random() * 100) + 1;

                    let j = 0;
                    while(j < data.length && data[j].helyes != 1) {
                        j++;
                    }

                    if(random > 0 + (currentRound * 3)) {
                        alert(`A barátod azt mondta: ${data[j].valasz} a válasz`);
                    }
                    else {
                        while(data[j].helyes != 0) {
                            j = Math.floor(Math.random() * 4);
                        }
                        alert(`A barátod azt mondta: ${data[j].valasz} a válasz`);
                    }
                })
            break;
        }
        case 'askTheAudience': {
                await getMethodFetch('/api/getGameState')
                .then(async (gameState) => {
                    const currentRound = gameState.round;
                    document.getElementById('askTheAudience').disabled = true;
                    await postMethodFetch('/api/useHelp', { helpType: 'askTheAudience' });

                    let random = Math.floor(Math.random() * 100) + 1;

                    let j = 0;
                    while(j < data.length && data[j].helyes != 1) {
                        j++;
                    }

                    if(random > 0 + (currentRound * 4)) {
                        alert(`A közönség szerint a helyes válasz: ${data[j].valasz}`);
                    }
                    else {
                        while(data[j].helyes != 0) {
                            j = Math.floor(Math.random() * 4);
                        }
                        alert(`A közönség szerint a helyes válasz: ${data[j].valasz}`);
                    }
                })
            break;
        }
        default:
    }
}
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

    const takeWinBtn = document.getElementById('takeWinBtn');
    if (currentRound === 5 || currentRound === 10) {
        takeWinBtn.parentElement.style.display = 'block';
        takeWinBtn.onclick = () => {
            confirmEnd(currentRound);
        };
    } else {
        takeWinBtn.parentElement.style.display = 'none';
    }

    data.answers.forEach((answer, index) => {
        const answerButton = document.getElementById(`answer${index + 1}`);
        answerButton.textContent = answer.valasz;

        answerButton.onclick = () => {
            checkAnswer(answer, currentRound);
        };
    });

    document.getElementById('fiftyFifty').addEventListener('click', (e) => {

        getMethodFetch('/api/getHelpCountSession')
            .then((helpData) => {
                if (helpData.fiftyFiftyUsed) {
                    alert('Ezt a segítséget már használtad!');
                    return;
                }
                else {
                    helpAnswer(e.target,data.answers)
                }

            })
            .catch((error) => {
                console.error(error);
            });
    });

    document.getElementById('phoneAFriend').addEventListener('click', (e) => {

        getMethodFetch('/api/getHelpCountSession')
            .then((helpData) => {
                if (helpData.phoneAFriendUsed) {
                    alert('Ezt a segítséget már használtad!');
                    return;
                }
                else {
                    helpAnswer(e.target,data.answers)
                }

            })
            .catch((error) => {
                console.error(error);
            });
    });

    document.getElementById('askTheAudience').addEventListener('click', (e) => {

        getMethodFetch('/api/getHelpCountSession')
        .then((helpData) => {
            if (helpData.askTheAudienceUsed) {
                alert('Ezt a segítséget már használtad!');
                return;
            }
            else {
                helpAnswer(e.target,data.answers)
            }

        })
        .catch((error) => {
            console.error(error);
        });
    });
};

const confirmEnd = async (level) => {
    let garantaltNyeremeny = "0 Ft";
    
    if (level === 5) {
        garantaltNyeremeny = "300 000 Ft";
    } else if (level === 10) {
        garantaltNyeremeny = "5 000 000 Ft";
    }

    const confirmed = confirm(`Bitosan abbahagyod a játekot és elviszed a ${garantaltNyeremeny} nyereményt?`);
    
    if (confirmed) {
        showEndScreen(`Gratulálunk! Nyereményed: ${garantaltNyeremeny}`, level);
    }
};

const checkAnswer = async (answer, currentRound) => {
    if (answer.helyes == 1) {
        const nextRound = currentRound + 1;
        
        if (nextRound > 15) {
            showEndScreen('Kijutottál a puttonyból: 150 000 000 Ft!', 15);
            return;
        }

        try {
            await postMethodFetch('/api/updateGameState', { round: nextRound });
            const data = await getMethodFetch('/api/getQuestion');
            loadQuestion(data);
        } catch (error) {
            console.error(error);
        }
    } else {
        endGameWithMoney(currentRound);
    }
};

const endGameWithMoney = async (level) => {
    let money = 0;
    let nyeremeny = "0 Ft";
    
    if (level > 10) {
        money = 5000000;
        nyeremeny = "5 000 000 Ft";
    } else if (level > 5) {
        money = 300000;
        nyeremeny = "300 000 Ft";
    } else {
        money = 0;
        nyeremeny = "0 Ft";
    }

    showEndScreen(`Lefőttél! Nyereményed: ${nyeremeny}`, level, money);
};

const askContinue = async (currentRound) => {
    let nyeremeny = "0 Ft";
    
    if (currentRound === 5) {
        nyeremeny = "300 000 Ft";
    } else if (currentRound === 10) {
        nyeremeny = "5 000 000 Ft";
    } else {
        const prevMoney = getPrevLevelMoney(currentRound - 1);
        nyeremeny = prevMoney;
    }

    const confirmed = confirm(`Jól válaszoltál! Nyereményed: ${nyeremeny}\n\nTovábblépel a ${currentRound + 1}. szintre?`);
    
    if (confirmed) {
        try {
            await postMethodFetch('/api/updateGameState', { round: currentRound + 1 });
            const data = await getMethodFetch('/api/getQuestion');
            loadQuestion(data);
        } catch (error) {
            console.error(error);
        }
    } else {
        showEndScreen(`Gratulálunk! Nyereményed: ${nyeremeny}`, currentRound, getPrevLevelMoneyAmount(currentRound - 1));
    }
};

const getPrevLevelMoney = (level) => {
    const moneys = {
        1: "0 Ft",
        2: "500 Ft",
        3: "1 000 Ft",
        4: "2 000 Ft",
        5: "300 000 Ft",
        6: "5 000 Ft",
        7: "10 000 Ft",
        8: "20 000 Ft",
        9: "50 000 Ft",
        10: "5 000 000 Ft",
        11: "100 000 Ft",
        12: "500 000 Ft",
        13: "1 000 000 Ft",
        14: "25 000 000 Ft",
        15: "150 000 000 Ft"
    };
    return moneys[level] || "0 Ft";
};

const getPrevLevelMoneyAmount = (level) => {
    const moneys = [0, 0, 500, 1000, 2000, 300000, 5000, 10000, 20000, 50000, 5000000, 100000, 500000, 1000000, 25000000, 150000000];
    return moneys[level] || 0;
};

const confirmQuit = async (level) => {
    let garantaltNyeremeny = "0 Ft";
    
    if (level === 5) {
        garantaltNyeremeny = "300 000 Ft";
    } else if (level === 10) {
        garantaltNyeremeny = "5 000 000 Ft";
    }

    const confirmed = confirm(`Biztosan abbahagyod a játékot és elviszed a garantált ${garantaltNyeremeny} nyereményt?`);
    
    if (confirmed) {
        const money = level === 5 ? 300000 : level === 10 ? 5000000 : 0;
        showEndScreen(`Gratulálunk! Nyereményed: ${garantaltNyeremeny}`, level, money);
    }
};

const showEndScreen = async (message, level, money) => {
    document.getElementById('mainGameContainer').style.display = 'none';
    document.getElementById('endGameMessage').textContent = message;
    document.getElementById('endGameScreen').style.display = 'block';

    try {
        await postMethodFetch('/api/endGame', { level: level, money: money });
    } catch (error) {
        console.error(error);
    }
};

const helpAnswer = (button,data) => {
    switch (button.id) {
        case 'fiftyFifty':
            let disableAnswer = 0;
            document.getElementById('fiftyFifty').disabled = true;

            let j = 0;
            while (disableAnswer < 2 && j < data.length) {
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

        case 'phoneAFriend':
            getMethodFetch('/api/getGameState')
            .then((gameState) => {
                const currentRound = gameState.round;

                document.getElementById('phoneAFriend').disabled = true;

                let random = Math.floor(Math.random() * 100) + 1;


                let j = 0;
                while(j < data.length) {
                    if (data[j].helyes == 1 && random > 0 + (currentRound * 3)) {
                        const answerButton = document.getElementById(`answer${j + 1}`);
                        answerButton.style.backgroundColor = 'green';
                        alert(`A barátod szerint a helyes válasz: ${answerButton.textContent}`);
                        break;
                    }
                    else if (data[j].helyes == 0 && random <= 0 + (currentRound * 3)) {
                        const answerButton = document.getElementById(`answer${j + Math.floor(Math.random() * 4) + 1}`);
                        answerButton.style.backgroundColor = 'green';
                        alert(`A barátod szerint a helyes válasz: ${answerButton.textContent}`);
                        break;
                    }
                    j++;
                }     
            })  
            break;
        case 'askTheAudience':
                getMethodFetch('/api/getGameState')
                .then((gameState) => {
                    const currentRound = gameState.round;
                    document.getElementById('askTheAudience').disabled = true;

                    let random = Math.floor(Math.random() * 100) + 1;

                    let j = 0;
                    while(j < data.length) {
                        if (data[j].helyes == 1 && random > 0 + (currentRound * 4)) {
                            const answerButton = document.getElementById(`answer${j + 1}`);
                            answerButton.style.backgroundColor = 'green';
                            alert(`A közönség szerint a helyes válasz: ${answerButton.textContent}`);
                            break;
                        }
                        else if (data[j].helyes == 0 && random <= 0 + (currentRound * 4)) {
                            const answerButton = document.getElementById(`answer${j + Math.floor(Math.random() * 4) + 1}`);
                            answerButton.style.backgroundColor = 'green';
                            alert(`A közönség szerint a helyes válasz: ${answerButton.textContent}`);
                            break;
                        }
                        j++;
                    }
                })
            break;
        default:
    }
}

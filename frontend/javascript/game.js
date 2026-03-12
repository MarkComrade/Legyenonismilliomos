document.addEventListener('DOMContentLoaded', () => {
    getMethodFetch('/api/getQuestion')
        .then((data) => {
            console.log('Kérdés sikeresen lekérve!', data);
            loadQuestion(data);
        })
        .catch((error) => {
            alert(`Hiba történt: ${error.message}`);
        });
});

const loadQuestion = async (data) => {
    const questionElement = document.getElementById('question');

    questionElement.textContent = data.question.kerdes;

    data.answers.forEach((answer, index) => {
        const answerButton = document.getElementById(`answer${index + 1}`);
        answerButton.textContent = answer.valasz;

            answerButton.addEventListener('click', () => {
                checkAnswer(answer);
            });
    });
};

const checkAnswer = async (answer) => {

};

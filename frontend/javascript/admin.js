document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitBtn').addEventListener('click', async () => {
        const question = document.getElementById('questionBody').value;
        const difficulty = document.getElementById('difficultySelect').value;
        const answer1 = document.getElementById('answer1').value;
        const answer2 = document.getElementById('answer2').value;
        const answer3 = document.getElementById('answer3').value;
        const answer4 = document.getElementById('answer4').value;
        const correctAnswer = document.querySelector('input[name="correctAnswer"]:checked').id;

        const data = {
            question,
            difficulty,
            answer1,
            answer2,
            answer3,
            answer4,
            correctAnswer
        };

        await postMethodFetch('/api/addQuestion', data)
            .then((response) => {
                console.log('Kérdés sikeresen hozzáadva!', response);
                document.getElementById('questionForm').reset();
            })
            .catch((error) => {
                alert(`Hiba történt: ${error.message}`);
            });
    });

    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
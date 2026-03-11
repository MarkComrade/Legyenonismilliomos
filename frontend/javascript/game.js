document.addEventListener('DOMContentLoaded', () => {
    getMethodFetch('/api/getQuestion')
        .then((data) => {
            console.log('Kérdés sikeresen lekérve!', data);

        })
        .catch((error) => {
            alert(`Hiba történt: ${error.message}`);
        });
    getMethodFetch('/api/getAnswers')
        .then((data) => {
            console.log('Válaszok sikeresen lekérve!', data);
        })
        .catch((error) => {
            alert(`Hiba történt: ${error.message}`);
        });
});

const loadQuestion = async () => { 

}
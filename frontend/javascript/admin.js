document.addEventListener('DOMContentLoaded', () => {
    getMethodFetch(url)
        .then((data) => {
            console.log('Fetch eredménye: ', data);
        })
        .catch((error) => {
            console.error('Hiba: ', error.message);
        });
});

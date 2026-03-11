document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gameBtn').addEventListener('click', () => {
        window.location.href = "game.html"
    })

    document.getElementById('loginBtn').addEventListener('click', () => {
        window.location.href = "login.html"
    })

    document.getElementById('adminBtn').addEventListener('click', () => {
        window.location.href = "admin.html"
    })
});

const getMethodFetch = async() => {
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`GET hipa: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch(error){
        throw new Error(`Hipa: `, error);
    }
}

const postMethodFetch = async() => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify();
        });
        if(!response.ok){
            throw new Error(`GET hipa: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch(error){
        throw new Error(`Hipa: `, error);
    }
}

const login = async() =>{
    try{

    } catch(error){
        console.error(error);
    }
}
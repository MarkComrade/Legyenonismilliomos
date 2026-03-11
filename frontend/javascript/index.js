document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginContainer = document.getElementById('loginContainer');
    const gameContainer = document.getElementById('gameContainer');
    const userNameSpan = document.getElementById('userName');

    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    registerBtn.addEventListener('click', () => {
        window.location.href = 'register.html';
    });

    startGameBtn.addEventListener('click', () => {
        window.location.href = 'game.html';
    });

    logoutBtn.addEventListener('click', async () => {
        await fetch('/api/logout', {
            method: 'GET',
            credentials: 'include'
        });
        location.reload();
    });

    async function checkSession() {
        try {
            const response = await fetch('/api/check-session', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.loggedIn) {
                loginContainer.style.display = 'none';
                gameContainer.style.display = 'block';
                userNameSpan.textContent = data.userName;
            } else {
                loginContainer.style.display = 'block';
                gameContainer.style.display = 'none';
            }
        } catch (error) {
            console.error('Hiba:', error);
        }
    }

    checkSession();
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

const postMethodFetch = async (url, data) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if(!response.ok){
            throw new Error(`POST hiba: ${response.status}`);
        }

        return await response.json();
    } catch(error){
        throw error;
    }
}



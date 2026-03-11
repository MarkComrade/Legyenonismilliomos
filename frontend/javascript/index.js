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
            console.log(data);
            
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
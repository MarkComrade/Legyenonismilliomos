document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginContainer = document.getElementById('loginContainer');
    const gameContainer = document.getElementById('gameContainer');
    const userNameSpan = document.getElementById('userName');
    const adminBtn = document.getElementById('adminBtn');

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
        try {
            await getMethodFetch('/api/logout');
            location.reload();
        } catch (error) {
            console.error('Hiba:', error);
        }
    });

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    async function checkSession() {
        try {
            const data = await getMethodFetch('/api/check-session');
            console.log(data);
            
            if (data.loggedIn) {
                loginContainer.style.display = 'none';
                gameContainer.style.display = 'block';
                userNameSpan.textContent = data.userName;

                if (data.role === 'admin' && adminBtn) {
                    adminBtn.style.display = 'block';
                }
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
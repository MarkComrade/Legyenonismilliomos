document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const gameBtn = document.getElementById('gameBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const notLoggedIn = document.getElementById('notLoggedIn');
    const loggedIn = document.getElementById('loggedIn');
    const adminBtn = document.getElementById('adminBtn');

    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    registerBtn.addEventListener('click', () => {
        window.location.href = 'register.html';
    });

    gameBtn.addEventListener('click', () => {
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

            if (data.loggedIn) {
                notLoggedIn.style.display = 'none';
                loggedIn.style.display = 'flex';

                if (data.role !== 'admin' && adminBtn) {
                    adminBtn.style.display = 'none';
                }

                const statsData = await getMethodFetch('/api/getUserStats');
                if (statsData.loggedIn) {
                    document.getElementById('totalMoney').textContent = statsData.total_money;
                    document.getElementById('maxLevel').textContent = statsData.max_level;
                    document.getElementById('statsContainer').style.display = 'block';
                }

            } else {
                notLoggedIn.style.display = 'flex';
                loggedIn.style.display = 'none';
                document.getElementById('statsContainer').style.display = 'none';
            }
        } catch (error) {
            console.error('Hiba:', error);
        }
    }

    checkSession();
});
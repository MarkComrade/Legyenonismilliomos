document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const gameBtn = document.getElementById('gameBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const notLoggedIn = document.getElementById('notLoggedIn');
    const loggedIn = document.getElementById('loggedIn');
    const adminBtn = document.getElementById('adminBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }

    if (gameBtn) {
        gameBtn.addEventListener('click', async () => {
            try {
                await postMethodFetch('/api/resetGame', {});
                window.location.href = 'game.html';
            } catch (error) {
                console.error(error);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await postMethodFetch('/api/resetGame', {});
                await getMethodFetch('/api/logout');
                location.reload();
            } catch (error) {
                console.error('Hiba:', error);
            }
        });
    }

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    const checkSession = async () => {
        try {
            const data = await getMethodFetch('/api/check-session');

            if (data.loggedIn) {
                if (notLoggedIn) notLoggedIn.style.display = 'none';
                if (loggedIn) loggedIn.style.display = 'flex';

                if (data.role !== 'admin' && adminBtn) {
                    adminBtn.style.display = 'none';
                }

                const statsData = await getMethodFetch('/api/getUserStats');
                if (statsData.loggedIn) {
                    const totalMoneySpan = document.getElementById('totalMoney');
                    const maxLevelSpan = document.getElementById('maxLevel');
                    const statsContainer = document.getElementById('statsContainer');

                    if (totalMoneySpan) totalMoneySpan.textContent = statsData.total_money;
                    if (maxLevelSpan) maxLevelSpan.textContent = statsData.max_level;
                    if (statsContainer) statsContainer.style.display = 'block';
                }

            } else {
                if (notLoggedIn) notLoggedIn.style.display = 'flex';
                if (loggedIn) loggedIn.style.display = 'none';
                
                const statsContainer = document.getElementById('statsContainer');
                if (statsContainer) statsContainer.style.display = 'none';
            }
        } catch (error) {
            console.error(error);
        }
    };

    checkSession();
});
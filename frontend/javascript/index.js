document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gameBtn').addEventListener('click', () => {
        window.location.href = 'game.html';
    });

    document.getElementById('loginBtn').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    document.getElementById('adminBtn').addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
});

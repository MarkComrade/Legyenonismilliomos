document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const messageDiv = document.getElementById("message");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userName = document.getElementById("userName").value;
        const password = document.getElementById("password").value;

        try {
            const data = await postMethodFetch("/api/login", { userName, password });

            if (data.success) {
                messageDiv.textContent = "Sikeres bejelentkezés!";
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            } else {
                messageDiv.textContent = "Sikertelen bejelentkezés: " + data.message;
            }

        } catch (err) {
            console.error(err);
            messageDiv.textContent = "Hiba történt!";
        }
    });
});
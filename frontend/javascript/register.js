document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const messageDiv = document.getElementById("message");

    if (!registerForm || !messageDiv) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userName = document.getElementById("userName").value;
        const password = document.getElementById("password").value;

        try {
            const data = await postMethodFetch("/api/register", { userName, password });

            if (data.success) {
                messageDiv.textContent = "Sikeres regisztráció!";
                setTimeout(() => window.location.href = "login.html", 1000);
            } else {
                messageDiv.textContent = data.message;
            }
        } catch (err) {
            console.error(err);
            messageDiv.textContent = "Hiba történt!";
        }
    });
});
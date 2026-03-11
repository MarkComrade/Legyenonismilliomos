document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const messageDiv = document.getElementById("message");

    if (!registerForm || !messageDiv) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userName = document.getElementById("userName").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, password })
            });

            const data = await response.json();

            if (data.success) {
                messageDiv.textContent = "Sikeres regisztráció!";
                setTimeout(() => window.location.href = "login.html", 1500);
            } else {
                messageDiv.textContent = data.message;
            }
        } catch (err) {
            console.error(err);
            messageDiv.textContent = "Hiba történt!";
        }
    });
});
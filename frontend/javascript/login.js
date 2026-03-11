document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const messageDiv = document.getElementById("message");

    if (!loginForm || !messageDiv) {
        console.error("Nem található loginForm vagy messageDiv!");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userName = document.getElementById("userName").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userName, password })
            });

            const data = await response.json();

            if (data.success) {
                messageDiv.textContent = "Sikeres bejelentkezés!";
                setTimeout(() => {
                    if (data.isAdmin) window.location.href = "admin.html";
                    else window.location.href = "index.html";
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
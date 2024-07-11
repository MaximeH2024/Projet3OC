const userInfo = document.getElementById("login-form");
userInfo.addEventListener("submit", function(event){
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("pwd").value.trim();

    const logInInfo = {
        email: email,
        password: password,
    }
    logInCheck(logInInfo);
});

async function logInCheck(logInInfo) {
    try {
        const userAnswer = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            // comprendre cette partie.
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(logInInfo),  
        });

        if (!userAnswer.ok) {
            throw new Error("Erreur lors de la connexion à l'API");
        }

        const user = await userAnswer.json();
        console.log(user);
        window.localStorage.setItem("Token", user.token);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Erreur :", error);
    }
}
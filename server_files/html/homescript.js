document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("login-form");
    const user_field = document.getElementById("username");
    const pw_field = document.getElementById("pw");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        login(user_field.value, pw_field.value);
    });

    const reg_form = document.getElementById("registration-form");
    const reg_user_field = document.getElementById("reg_username");
    const reg_pw_field = document.getElementById("reg_pw");

    reg_form.addEventListener("submit", function (event) {
        event.preventDefault();
        register(reg_user_field.value, reg_pw_field.value);
    });
});

async function login(username, password) {
    let data = JSON.stringify({ username: username, password: password });

    await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Login failed:", data.error);
                alert("Login failed: " + data.error);
                return;
            }

            const { id, username, role } = data.user;

            // Store credentials and info in sessionStorage
            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('role', role);

            // Redirect based on role
            if (role === 0) {
                window.location.href = '/itemlog';
            } else if (role === 1) {
                window.location.href = '/admin';
            } else {
                console.warn("Unknown role:", role);
            }
        })
        .catch(error => {
            console.error("Error during login:", error);
            alert("Something went wrong. Try again.");
        });
}

//Registering from the home-page, std users only
async function register(username, password) {
    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password})
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle specific error cases
            if (data.message === "User already exists") {
                alert("Error: Username already exists");
                return;
            } else {
                console.error("Registration failed:", data.error || "Unknown error");
                alert("Registration failed: " + (data.error || "Please try again"));
                return;
            }
        }

        // Only attempt login if registration was successful
        if (data.message === "User registered successfully") {
            await login(username, password);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("Registration failed. Please try again.");
    }
}
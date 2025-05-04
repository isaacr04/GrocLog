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

const login = (username, password) => {
    let data = JSON.stringify({ username: username, password: password });

    fetch("/api/login", {
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
};

//Registering from the home-page, std users only
const register = (username, password) => {
    let data = JSON.stringify({ username: username, password: password });

    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Registration failed:", data.error);
                alert("Registration failed: " + data.error);
                return;
            }

            if(data.message = "User already exists"){
                alert("Error: User already exists");
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
            alert("Registration failed.");
        });
};
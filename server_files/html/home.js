document.addEventListener("DOMContentLoaded", function())
    const form = document.getElementById("login-form")
    const user_field = document.getElementById("username")
    const pw_field = document.getElementById("pw")


    form.addEventListener("submit", function(event) {

        event.preventDefault()
        login(user_field.value,pw_field.value)


    })

let login = (user, pw) => {

    let data = JSON.stringify({user: user, pw: pw})

    console.log("doing the fetch")
    fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
}
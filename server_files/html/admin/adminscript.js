const itemList = document.getElementById('item-list');

function addButtons(li, entry) {
    //Create Buttons
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-container");
    // Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editUser(entry);

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteUser(entry);

    //Add Buttons to list item
    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(deleteButton);
    li.appendChild(buttonDiv);
}

// Function to load users from database
async function loadUsers() {
    const response = await fetch("/api/getusers", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    const results = await response.json();
    itemList.innerHTML = "";
    results.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.user_id}: Username: ${entry.username} Password: ${entry.password} Perm: ${entry.perm}`;

        addButtons(li, entry);
        itemList.appendChild(li);
    });
}

// Function to handle adding a user
async function addUser(event) {
    event.preventDefault();

    const username = document.getElementById("usernameAdd").value;
    const password = document.getElementById("passwordAdd").value;
    const perm = document.getElementById("permAdd").value;

    await fetch("/api/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, perm })
    });

    // Reload users after adding
    loadUsers();
}

// Function to handle deleting a user
async function deleteUser(entry) {
    await fetch('/api/deleteuser', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({user_id : entry.user_id}),
    });
    loadUsers();
}

loadUsers();

document.getElementById("Add").addEventListener("submit", addUser);
//document.getElementById("Search").addEventListener("submit", searchUsers);
document.getElementById("Search").addEventListener("reset", loadUsers);
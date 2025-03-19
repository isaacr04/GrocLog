const itemList = document.getElementById('item-list');

function addButtons(li, entry) {
    //Create Buttons
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button-container");
    // Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editItem(entry);

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteItem(entry);

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

loadUsers();
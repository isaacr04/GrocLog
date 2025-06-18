const itemList = document.getElementById('item-list');
const totalSpend = document.getElementById('total-spend');
const filteredSpend = document.getElementById('filtered-spend');
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
const dateDropdownBtn = document.getElementById("dateDropdownBtn");
const dateDropdown = document.getElementById("dateDropdown");
const atDateCheckbox = document.getElementById("atDateCheckbox");
const rangeDateCheckbox = document.getElementById("rangeDateCheckbox");
const dateSearch = document.getElementById("dateSearch");
const dateRange = document.getElementById("dateRange");
const priceDropdownBtn = document.getElementById("priceDropdownBtn");
const priceDropdown = document.getElementById("priceDropdown");
const atPriceCheckbox = document.getElementById("atPriceCheckbox");
const rangePriceCheckbox = document.getElementById("rangePriceCheckbox");
const priceSearch = document.getElementById("priceSearch");
const priceRangeStart = document.getElementById("priceRangeStart");
const priceRangeEnd = document.getElementById("priceRangeEnd");
const userId = parseInt(sessionStorage.getItem('userId'));


// Returns formatted date string:
// Default (forHuman == false): YYYY-MM-DD
// forHuman == true: (Short Month), dd, yyyy
function formatDate(dateString, forHuman = false) {
    const date = new Date(dateString);
    let dateStr = date.toISOString().split('T')[0]; //Extracts simple YYYY-MM-DD string
    if (forHuman) {
        dateStr = date.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    }

    return dateStr;
}

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

function addListItem(list, entry) {
    const li = document.createElement("li");
    const formattedDate = formatDate(entry.purchaseDate, true);

    // Create item display text
    const itemText = document.createElement("div");
    itemText.classList.add("item-display");

    // Bold the item name
    const itemName = document.createElement("strong");
    itemName.textContent = entry.item;
    itemText.appendChild(itemName);

    // Add quantity, price, and date (not bold)
    const totalPrice = parseInt(entry.quantity) * parseFloat(entry.price);
    itemText.append(` (${entry.quantity}) @ (${USDollar.format(entry.price)}) - ${USDollar.format(totalPrice)} on ${formattedDate} `);

    // Add Location if available
    if (entry.location) {
        const locationSpan = document.createElement("span");
        locationSpan.innerHTML = `<strong>Location:</strong> ${entry.location} `;
        itemText.appendChild(locationSpan);
    }

    // Add Brand if available
    if (entry.brand) {
        const brandSpan = document.createElement("span");
        brandSpan.innerHTML = `<strong>Brand:</strong> ${entry.brand} `;
        itemText.appendChild(brandSpan);
    }

    // Add Type if available
    if (entry.type) {
        const typeSpan = document.createElement("span");
        typeSpan.innerHTML = `<strong>Type:</strong> ${entry.type} `;
        itemText.appendChild(typeSpan);
    }

    li.appendChild(itemText);
    addButtons(li, entry);
    list.appendChild(li);
}

async function loadItems() {
    const response = await fetch("/api/searchitem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId })
    });
    const results = await response.json();
    itemList.innerHTML = "";
    let totalSpendValue = 0;

    results.forEach(entry => {
        totalSpendValue += (parseFloat(entry.price) * parseFloat(entry.quantity));
        addListItem(itemList, entry);
    });

    totalSpend.textContent = `${USDollar.format(totalSpendValue)}`;
}

// Function to handle adding an item
async function addItem(event) {
    event.preventDefault();

    const item = document.getElementById("nameAdd").value;
    const price = document.getElementById("priceAdd").value;
    const quantity = document.getElementById("quantityAdd").value;
    const purchaseDate = document.getElementById("dateAdd").value;
    const location = document.getElementById("locationAdd").value.trim();
    const brand = document.getElementById("brandAdd").value.trim();
    const type = document.getElementById("typeAdd").value.trim();

    await fetch("/api/additem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            item,
            price,
            quantity,
            purchaseDate,
            location,
            brand,
            type
        })
    });

    loadItems();
}


// Function to handle deleting an item
async function deleteItem(entry) {
    await fetch("/api/deleteitem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: userId,
            item: entry.item,
            price: entry.price,
            quantity: entry.quantity,
            purchaseDate: formatDate(entry.purchaseDate), // Original date format
        })
    });
    loadItems();
}

// Function to handle editing an item
async function editItem(entry) {
    const editForm = `
        <div class="edit-form">
            <label>Item Name: <input type="text" id="editItemName" value="${entry.item}"></label>
            <label>Price: <input type="number" step="0.01" id="editItemPrice" value="${entry.price}"></label>
            <label>Quantity: <input type="number" step="1" id="editItemQuantity" value="${entry.quantity}"></label>
            <label>Date: <input type="date" id="editItemDate" value="${formatDate(entry.purchaseDate)}"></label>
            <label>Location: <input type="text" id="editItemLocation" list="locationOptions" value="${entry.location || ''}"></label>
            <label>Brand: <input type="text" id="editItemBrand" list="brandOptions" value="${entry.brand || ''}"></label>
            <label>Type: <input type="text" id="editItemType" list="typeOptions" value="${entry.type || ''}"></label>
        </div>
    `;

    // Show edit dialog
    const confirmed = await Swal.fire({
        title: 'Edit Item',
        html: editForm,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        preConfirm: () => {
            return {
                item: document.getElementById('editItemName').value.trim(),
                price: parseFloat(document.getElementById('editItemPrice').value),
                quantity: parseInt(document.getElementById('editItemQuantity').value),
                date: document.getElementById('editItemDate').value,
                location: document.getElementById('editItemLocation').value.trim(),
                brand: document.getElementById('editItemBrand').value.trim(),
                type: document.getElementById('editItemType').value.trim()
            };
        }
    });

    if (confirmed.isConfirmed) {
        const { item, price, quantity, date, location, brand, type } = confirmed.value;

        // Retrieve userId from sessionStorage
        const userId = parseInt(sessionStorage.getItem('userId'), 10);

        if (item && !isNaN(price) && !isNaN(quantity) && date && userId) {
            await fetch("/api/edititem", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    item: entry.item,
                    price: Number(entry.price),
                    quantity: Number(entry.quantity),
                    purchaseDate: new Date (entry.purchaseDate).toISOString(),

                    newItem: item,
                    newPrice: price,
                    newQuantity: quantity,
                    newDate: new Date (date).toISOString(),

                    newLocation: location || null,
                    newBrand: brand || null,
                    newType: type || null
                }),
            });

            loadItems(); // Refresh the list after editing
        } else {
            alert("Missing or invalid fields in form.");
        }
    }
}


async function searchItems(event) {
    event.preventDefault();

    const item = document.getElementById("nameSearch").value;
    const quantity = document.getElementById("quantitySearch").value;
    const priceSearchValue = document.getElementById("priceSearch").value;
    const priceRangeStartValue = document.getElementById("priceRangeStart").value;
    const priceRangeEndValue = document.getElementById("priceRangeEnd").value;
    const dateSearchValue = document.getElementById("dateSearch").value;
    const dateRangeValue = document.getElementById("dateRange").value;
    const location = document.getElementById("locationSearch").value.trim();
    const brand = document.getElementById("brandSearch").value.trim();
    const type = document.getElementById("typeSearch").value.trim();

    const searchParams = {
        userId,
        item,
        quantity,
        location,
        brand,
        type
    };

    // Add Price filter based on which checkbox is checked
    if (atPriceCheckbox.checked && priceSearchValue) {
        searchParams.price = priceSearchValue;
    }
    else if (rangePriceCheckbox.checked && priceRangeStartValue && priceRangeEndValue) {
        searchParams.start_price = parseFloat(priceRangeStartValue);
        searchParams.end_price = parseFloat(priceRangeEndValue);

        // Validate price range
        if (searchParams.start_price > searchParams.end_price) {
            alert("Minimum price must be less than maximum price");
            return;
        }
    }

    // Add date filter based on which checkbox is checked
    if (atDateCheckbox.checked && dateSearchValue) {
        searchParams.purchaseDate = dateSearchValue;
    }
    else if (rangeDateCheckbox.checked && dateRangeValue) {
        const dates = dateRangeValue.split(" to ");
        if (dates.length === 2) {
            searchParams.start_date = dates[0];
            searchParams.end_date = dates[1];
        }
    }

    const response = await fetch("/api/searchitem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams)
    });

    const results = await response.json();
    itemList.innerHTML = "";
    let filteredSpendValue = 0;

    results.forEach(entry => {
        filteredSpendValue += (parseFloat(entry.price) * parseFloat(entry.quantity));
        addListItem(itemList, entry);
    });

    filteredSpend.textContent = `${USDollar.format(filteredSpendValue)}`;
}

function activateAtDate() {
    atDateCheckbox.checked = true;
    rangeDateCheckbox.checked = false;
}

function activateRangeDate() {
    rangeDateCheckbox.checked = true;
    atDateCheckbox.checked = false;
}

function activateAtPrice() {
    atPriceCheckbox.checked = true;
    rangePriceCheckbox.checked = false;
}

function activateRangePrice() {
    rangePriceCheckbox.checked = true;
    atPriceCheckbox.checked = false;
}

function quickSearch(cat,param){
    console.log("quicksearch");
    console.log("cat: ",cat);
    console.log("param: ",param);
    let field;
    switch(cat){
        case 'type':field=document.getElementById("typeSearch");break;
        case 'location':field=document.getElementById("locationSearch");break;
    }
    field.value=param;
}

document.addEventListener("DOMContentLoaded", async function () {
    userRole = parseInt(sessionStorage.getItem("role"));
    console.log("role returned:", userRole);

    if (userRole === 0) {
        loadItems();
    }
    else {
        console.error("Invalid user role, skipping item loading.");
        window.location.href = '/';
    }
});

// Connect form buttons
document.getElementById("Add").addEventListener("submit", addItem);
document.getElementById("Search").addEventListener("submit", searchItems);
document.getElementById("Search").addEventListener("reset", function() {
    loadItems();
    filteredSpend.textContent = "$0";
});

// Connect the Analytics navigation button
document.getElementById("goAnalytics").addEventListener("click", async function () {
    window.location.href = '/analytics';
})

//Formatting for Search Form's Price Button
// Toggle dropdown on button click
priceDropdownBtn.addEventListener("click", function(e) {
    e.stopPropagation(); // Prevent event from bubbling up
    priceDropdown.classList.toggle("show");
});
// Close dropdown when clicking outside
document.addEventListener("click", function(e) {
    if (!e.target.closest('.dropdown')) {
        priceDropdown.classList.remove("show");
    }
});
// Prevent dropdown from closing when interacting with its contents
priceDropdown.addEventListener("click", function(e) {
    e.stopPropagation();
});
// Checkbox click behavior
atPriceCheckbox.addEventListener("change", () => {
    if (atPriceCheckbox.checked) {
        rangePriceCheckbox.checked = false;
    }
});
rangePriceCheckbox.addEventListener("change", () => {
    if (rangePriceCheckbox.checked) {
        atPriceCheckbox.checked = false;
    }
});
// Input focus triggers checkbox
priceSearch.addEventListener("focus", activateAtPrice);
priceRangeStart.addEventListener("focus", activateRangePrice);
priceRangeEnd.addEventListener("focus", activateRangePrice);
// Value change also toggles checkbox
priceSearch.addEventListener("input", activateAtPrice);
priceRangeStart.addEventListener("input", activateRangePrice);
priceRangeEnd.addEventListener("input", activateRangePrice);


//Formatting for Search Form's Date Button
// Toggle dropdown on button click
dateDropdownBtn.addEventListener("click", function(e) {
    e.stopPropagation(); // Prevent event from bubbling up
    dateDropdown.classList.toggle("show");
});
// Close dropdown when clicking outside
document.addEventListener("click", function(e) {
    if (!e.target.closest('.dropdown')) {
        dateDropdown.classList.remove("show");
    }
});
// Prevent dropdown from closing when interacting with its contents
dateDropdown.addEventListener("click", function(e) {
    e.stopPropagation();
});
// Checkbox click behavior
atDateCheckbox.addEventListener("change", () => {
    if (atDateCheckbox.checked) {
        rangeDateCheckbox.checked = false;
    }
});
rangeDateCheckbox.addEventListener("change", () => {
    if (rangeDateCheckbox.checked) {
        atDateCheckbox.checked = false;
    }
});
// Input focus triggers checkbox
dateSearch.addEventListener("focus", activateAtDate);
dateRange.addEventListener("focus", activateRangeDate);
// Value change also toggles checkbox
dateSearch.addEventListener("input", activateAtDate);
dateRange.addEventListener("input", activateRangeDate);
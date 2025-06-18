
const userId = parseInt(sessionStorage.getItem('userId'));
if (!userId) {
    window.location.href = '/';
}

// Chart instances
let spendingOverTimeChart, locationChart, brandChart, typeChart, priceTrendChart;

// Initialize all charts
function initCharts() {
    // Spending Over Time Chart
    const spendingCtx = document.getElementById('spendingOverTimeChart').getContext('2d');
    spendingOverTimeChart = new Chart(spendingCtx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Total Spending', data: [], backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    // Location Chart
    const locationCtx = document.getElementById('locationChart').getContext('2d');
    locationChart = new Chart(locationCtx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Spending by Location', data: [], backgroundColor: 'rgba(255, 99, 132, 0.2)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    // Brand Chart
    const brandCtx = document.getElementById('brandChart').getContext('2d');
    brandChart = new Chart(brandCtx, {
        type: 'pie',
        data: { labels: [], datasets: [{ label: 'Spending by Brand', data: [], backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'] }] },
        options: { responsive: true }
    });

    // Type Chart
    const typeCtx = document.getElementById('typeChart').getContext('2d');
    typeChart = new Chart(typeCtx, {
        type: 'doughnut',
        data: { labels: [], datasets: [{ label: 'Spending by Type', data: [], backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'] }] },
        options: { responsive: true }
    });

    // Price Trend Chart
    const priceCtx = document.getElementById('priceTrendChart').getContext('2d');
    priceTrendChart = new Chart(priceCtx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Average Price', data: [], backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

// Load data and update charts
async function loadAnalytics(days = 30) {
    try {
        // Handle "Lifetime" selection (days = 0)
        const requestBody = { userId };
        if (days > 0) {
            requestBody.days = days;
        }

        const response = await fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, days })
        });
        const data = await response.json();

        // Update Spending Over Time chart
        updateChart(spendingOverTimeChart, data.spendingOverTime.labels, data.spendingOverTime.values);

        // Update Location chart
        updateChart(locationChart, data.spendingByLocation.labels, data.spendingByLocation.values);

        // Update Brand chart
        updateChart(brandChart, data.spendingByBrand.labels, data.spendingByBrand.values);

        // Update Type chart
        updateChart(typeChart, data.spendingByType.labels, data.spendingByType.values);

        // Populate item options for price trends
        populateItemOptions(data.items);
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Update chart data
function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// Populate item options for price trends
function populateItemOptions(items) {
    const datalist = document.getElementById('itemOptions');
    datalist.innerHTML = '';
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        datalist.appendChild(option);
    });
}

// Load price trend data for selected item
async function loadPriceTrends(itemName) {
    if (!itemName) return;

    try {
        const response = await fetch("/api/pricetrends", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, item: itemName })
        });

        const data = await response.json();
        updateChart(priceTrendChart, data.labels, data.values);
    } catch (error) {
        console.error('Error loading price trends:', error);
    }
}

// Event listeners
document.getElementById("goItemlog").addEventListener("click", async function () {
    window.location.href = '/itemlog';
})

document.getElementById('timePeriod').addEventListener('change', function() {
    const value = this.value;
    if (value === 'custom') {
        document.getElementById('customRangeContainer').style.display = 'block';
    } else {
        document.getElementById('customRangeContainer').style.display = 'none';
        loadAnalytics(parseInt(value));
    }
});

document.getElementById('applyCustomRange').addEventListener('click', function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    // Calculate days between dates
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    loadAnalytics(diffDays);
});

document.getElementById('itemSelect').addEventListener('change', function() {
    loadPriceTrends(this.value);
});

// Initialize
initCharts();
loadAnalytics(30); // Default to last 30 days
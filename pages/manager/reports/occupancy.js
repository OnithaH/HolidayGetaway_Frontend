const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('daily-date').value = today;
    document.getElementById('proj-from').value = today;

    // Auto load today
    loadDailyOccupancy();
});

function checkAuth() {
    const token = localStorage.getItem('staffToken');
    if (!token) window.location.href = '../signin/signin.html';
}

async function loadDailyOccupancy() {
    const date = document.getElementById('daily-date').value;
    const token = localStorage.getItem('staffToken');

    if (!date) return alert("Please select a date");

    try {
        const response = await axios.get(`${API_URL}/manager/reports/occupancy/daily?date=${date}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = response.data.data;
        const total = data.total_rooms;
        const occupied = data.occupied_rooms;
        const available = total - occupied; // Simple calc, or backend provided

        document.getElementById('daily-total').textContent = total;
        document.getElementById('daily-occupied').textContent = occupied;
        document.getElementById('daily-available').textContent = available; // Backend actually provides this too or calc

        const rate = total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;
        document.getElementById('daily-progress').style.width = `${rate}%`;
        document.getElementById('daily-rate').textContent = `${rate}%`;

        document.getElementById('daily-results').classList.remove('hidden');

    } catch (error) {
        console.error("Error loading daily report:", error);
        alert("Failed to load daily report.");
    }
}

async function loadProjectedOccupancy() {
    const from = document.getElementById('proj-from').value;
    const to = document.getElementById('proj-to').value;
    const token = localStorage.getItem('staffToken');
    const tableBody = document.getElementById('projected-table-body');

    if (!from || !to) return alert("Please select date range");

    try {
        const response = await axios.get(`${API_URL}/manager/reports/occupancy/projected?from_date=${from}&to_date=${to}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = response.data.data;
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center">No data found for this range.</td></tr>';
            return;
        }

        data.forEach(day => {
            const total = day.occupied_rooms + day.available_rooms; // Implicit total
            const rate = total > 0 ? ((day.occupied_rooms / total) * 100).toFixed(1) : 0;

            // Highlight high occupancy
            let rowClass = "bg-white border-b";
            if (rate > 80) rowClass = "bg-red-50 border-b";

            const tr = document.createElement('tr');
            tr.className = rowClass;
            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-900">${day.date}</td>
                <td class="px-6 py-4">${day.occupied_rooms}</td>
                <td class="px-6 py-4">${day.available_rooms}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <span class="mr-2">${rate}%</span>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${rate}%"></div>
                        </div>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading projected report:", error);
        alert("Failed to load projected report.");
    }
}

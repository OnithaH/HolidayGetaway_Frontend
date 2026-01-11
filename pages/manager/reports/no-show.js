const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadNoShowReport();
});

function checkAuth() {
    const token = localStorage.getItem('staffToken');
    if (!token) window.location.href = '../signin/signin.html';
}

function clearDates() {
    document.getElementById('from-date').value = '';
    document.getElementById('to-date').value = '';
    loadNoShowReport();
}

async function loadNoShowReport() {
    const from = document.getElementById('from-date').value;
    const to = document.getElementById('to-date').value;
    const token = localStorage.getItem('staffToken');
    const tbody = document.getElementById('noshow-table-body');

    let url = `${API_URL}/manager/reports/no-shows?`;
    if (from) url += `from_date=${from}&`;
    if (to) url += `to_date=${to}`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = response.data.data;
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center">No "No-Show" reservations found for this period.</td></tr>';
            return;
        }

        data.forEach(res => {
            const checkInDate = new Date(res.check_in_date).toDateString();

            const tr = document.createElement('tr');
            tr.className = "bg-white border-b hover:bg-gray-50";
            tr.innerHTML = `
                <td class="px-6 py-4 font-bold">#${res.reservation_id}</td>
                <td class="px-6 py-4">${res.customer}</td>
                <td class="px-6 py-4">${checkInDate}</td>
                <td class="px-6 py-4">${res.rooms}</td>
                <td class="px-6 py-4">${res.branch}</td>
                <td class="px-6 py-4">
                    <button class="font-medium text-blue-600 hover:underline">View Details</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading no-show report:", error);
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">Error loading data.</td></tr>';
    }
}

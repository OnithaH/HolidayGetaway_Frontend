const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardStats();

    const name = localStorage.getItem('staffName');
    if (name) document.getElementById('manager-name').textContent = name;
});

function checkAuth() {
    const token = localStorage.getItem('staffToken');
    if (!token) window.location.href = '../signin/signin.html';
}

async function loadDashboardStats() {
    const token = localStorage.getItem('staffToken');
    const today = new Date().toISOString().split('T')[0];

    try {
        // 1. Fetch Occupancy
        const occResponse = await axios.get(`${API_URL}/manager/reports/occupancy/daily?date=${today}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const occData = occResponse.data.data;
        const occPercentage = ((occData.occupied_rooms / occData.total_rooms) * 100).toFixed(1);
        document.getElementById('stat-occupancy').textContent = `${occData.occupied_rooms}/${occData.total_rooms} (${occPercentage}%)`;

        // 2. Fetch Revenue (For today)
        const revResponse = await axios.get(`${API_URL}/manager/reports/revenue?from_date=${today}&to_date=${today}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const revData = revResponse.data.data;
        // revData is object { total_revenue: ... } because no groupBy
        const totalRev = revData.total_revenue || 0;
        document.getElementById('stat-revenue').textContent = `$${totalRev.toLocaleString()}`;

        // 3. Fetch No-Shows (For today) - Though effectively these are generated at 7PM
        const noShowResponse = await axios.get(`${API_URL}/manager/reports/no-shows?from_date=${today}&to_date=${today}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const noShows = noShowResponse.data.data || [];
        document.getElementById('stat-no-show').textContent = noShows.length;

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
        // Fallback or nice error UI
        if (error.response?.status === 401 || error.response?.status === 403) {
            alert("Session expired or unauthorized. Please sign in again.");
            logout();
        }
    }
}

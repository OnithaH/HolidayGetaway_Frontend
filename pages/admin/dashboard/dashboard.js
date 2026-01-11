const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardStats();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !role) { // || role !== 'Admin' (Loose check for now)
        window.location.href = '../signin/signin.html';
        return;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '../signin/signin.html';
}

async function loadDashboardStats() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
        // Fetch Users Count
        // Re-using the get users endpoint with limit=1 just to get the 'total' count from metadata
        const usersRes = await axios.get(`${API_URL}/admin/users?limit=1`, { headers });
        if (usersRes.data && usersRes.data.total !== undefined) {
            document.getElementById('total-users').innerText = usersRes.data.total;
        } else {
            document.getElementById('total-users').innerText = "0";
        }

        // Fetch Rooms Count - There isn't a direct "count" endpoint for rooms, but we can try fetching rooms
        // Ideally the backend should provide a dashboard stats endpoint.
        // For now, we might leave this as placeholder or try to hit an endpoint if available.
        // Actually, there isn't a GET /admin/rooms endpoint in the swagger I saw earlier?
        // Wait, looking at admin.routes.js:
        // router.post('/rooms', ...)
        // router.put('/rooms/:id', ...)
        // There is NO GET /admin/rooms endpoint? 
        // Let's check clerk.routes.js -> GET /api/clerk/rooms/status exists.
        // Admin might need to use that or we assume Admin implies Manager/Clerk permissions.

        // We will try the Clerk endpoint since specific admin get rooms is missing
        const roomsRes = await axios.get(`${API_URL}/clerk/rooms/status`, { headers });
        if (roomsRes.data && roomsRes.data.data) {
            document.getElementById('total-rooms').innerText = roomsRes.data.data.length;
        } else {
            document.getElementById('total-rooms').innerText = "-";
        }

    } catch (error) {
        console.error("Error loading stats:", error);
        document.getElementById('total-users').innerText = "Err";
        document.getElementById('total-rooms').innerText = "Err";
    }
}

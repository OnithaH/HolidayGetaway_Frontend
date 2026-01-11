const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUsers();

    document.getElementById('add-user-form').addEventListener('submit', handleAddUser);
});

function checkAuth() {
    const token = localStorage.getItem('staffToken');
    if (!token) window.location.href = '../signin/signin.html';
}

async function loadUsers() {
    const tableBody = document.getElementById('users-table-body');
    const token = localStorage.getItem('staffToken');

    try {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const users = response.data.users || [];
        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center">No users found.</td></tr>';
            return;
        }

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.className = "bg-white border-b hover:bg-gray-50";

            const roleName = user.role ? user.role.role_name : `Role ${user.role_id}`;
            const branchName = user.branch ? user.branch.name : (user.branch_id ? `Branch ${user.branch_id}` : 'Global/None');

            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${user.username}</td>
                <td class="px-6 py-4">${user.email}</td>
                <td class="px-6 py-4"><span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">${roleName}</span></td>
                <td class="px-6 py-4">${branchName}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading users:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-red-500">
                    Failed to load users.
                </td>
            </tr>
        `;
    }
}

async function handleAddUser(e) {
    e.preventDefault();
    const token = localStorage.getItem('staffToken');

    const payload = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role_id: parseInt(document.getElementById('role_id').value)
    };

    const branchId = document.getElementById('branch_id').value;
    if (branchId) payload.branch_id = parseInt(branchId);

    try {
        await axios.post(`${API_URL}/admin/users`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert("User created successfully!");
        location.reload();
    } catch (error) {
        console.error("Error adding user:", error);
        alert(`Failed to create user: ${error.response?.data?.message || error.message}`);
    }
}

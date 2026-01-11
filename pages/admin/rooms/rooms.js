const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadRooms();
    loadRoomTypes();

    document.getElementById('add-room-form').addEventListener('submit', handleAddRoom);
    document.getElementById('add-type-form').addEventListener('submit', handleAddRoomType);
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '../../signin/signin.html';
}

async function loadRooms() {
    const tableBody = document.getElementById('rooms-table-body');
    const token = localStorage.getItem('token');

    try {
        // Attempting to use Clerk endpoint for listing rooms as Admin doesn't have a specific one
        const response = await axios.get(`${API_URL}/clerk/rooms/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const rooms = response.data.data;
        tableBody.innerHTML = '';

        if (rooms.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center">No rooms found.</td></tr>';
            return;
        }

        rooms.forEach(room => {
            const tr = document.createElement('tr');
            tr.className = "bg-white border-b hover:bg-gray-50";

            // Status colors
            let statusColor = 'text-gray-500';
            if (room.status === 'Available') statusColor = 'text-green-600 font-bold';
            if (room.status === 'Occupied') statusColor = 'text-red-600 font-bold';

            // Safe access to nested properties
            const typeName = room.roomtype ? room.roomtype.type_name : 'N/A';
            const branchName = room.branch ? room.branch.name : `Branch ${room.branch_id}`;

            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${room.room_number || 'N/A'}</td>
                <td class="px-6 py-4">${typeName}</td>
                <td class="px-6 py-4">${branchName}</td>
                 <td class="px-6 py-4 ${statusColor}">${room.status}</td>
                <td class="px-6 py-4">$${room.price_per_night || '-'}</td>
                <td class="px-6 py-4">
                    <button onclick="editRoom(${room.id})" class="font-medium text-blue-600 hover:underline">Edit</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading rooms:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-red-500">
                    Failed to load rooms. <br>
                    <span class="text-xs text-gray-400">Error: ${error.response ? error.response.status : error.message} (You may not have permission)</span>
                </td>
            </tr>
        `;
    }
}

async function loadRoomTypes() {
    const select = document.getElementById('room_type');
    try {
        const response = await axios.get(`${API_URL}/public/rooms`);
        // Assuming response structure based on public controller
        // public route returns: res.status(200).json(roomTypes); or similar
        // Let's assume it returns an array directly or {data: []}

        const types = Array.isArray(response.data) ? response.data : (response.data.data || []);

        select.innerHTML = '<option value="">Select type</option>';
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = `${type.type_name} ($${type.base_price})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading room types:", error);
    }
}

async function handleAddRoom(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Construct payload
    const payload = {
        room_number: document.getElementById('room_number').value,
        room_type_id: parseInt(document.getElementById('room_type').value),
        branch_id: parseInt(document.getElementById('branch_id').value),
        status: 'Available' // Default
    };

    const price = document.getElementById('price_per_night').value;
    if (price) payload.price_per_night = parseFloat(price);

    try {
        await axios.post(`${API_URL}/admin/rooms`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert("Room added successfully!");
        location.reload(); // Simple reload to refresh table
    } catch (error) {
        console.error("Error adding room:", error);
        alert(`Failed to add room: ${error.response?.data?.message || error.message}`);
    }
}

async function handleAddRoomType(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
        type_name: document.getElementById('type_name').value,
        base_price: parseFloat(document.getElementById('base_price').value),
        description: document.getElementById('description').value
    };

    try {
        await axios.post(`${API_URL}/admin/room-types`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert("Room Type added successfully!");
        // Refresh types and close modal ideally, but reload is easier
        location.reload();
    } catch (error) {
        console.error("Error adding room type:", error);
        alert(`Failed to add room type: ${error.response?.data?.message || error.message}`);
    }
}

function editRoom(id) {
    alert("Edit feature would open a modal pre-filled with room details. (Not fully implemented in this demo)");
}

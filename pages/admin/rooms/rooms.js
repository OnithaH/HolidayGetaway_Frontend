const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadRooms(); // Will loads types/summary now
    loadRoomTypes();

    document.getElementById('add-room-form').addEventListener('submit', handleAddRoom);
    document.getElementById('add-type-form').addEventListener('submit', handleAddRoomType);
});

function checkAuth() {
    const token = localStorage.getItem('staffToken');
    if (!token) window.location.href = '../signin/signin.html';
}

async function loadRooms() {
    const tableBody = document.getElementById('rooms-table-body');

    // Switch to displaying Room Types since Admin cannot list individual rooms via Clerk API
    // and /public/rooms returns aggregated data
    try {
        const response = await axios.get(`${API_URL}/public/rooms`);
        // public controller returns json(result), where result is [ ... ]
        // or json({data: ...})? Step 175 shows res.json({success, data: result})
        const types = response.data.data || [];

        tableBody.innerHTML = '';

        // Update Table Headers to reflect we are showing Types/Summary
        const thead = document.querySelector('thead tr');
        thead.innerHTML = `
            <th scope="col" class="px-6 py-3">Room Type</th>
            <th scope="col" class="px-6 py-3">Base Price</th>
            <th scope="col" class="px-6 py-3">Total Rooms</th>
            <th scope="col" class="px-6 py-3">Availability (By Branch)</th>
            <th scope="col" class="px-6 py-3">Action</th>
        `;

        if (types.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center">No room types found.</td></tr>';
            return;
        }

        types.forEach(type => {
            const tr = document.createElement('tr');
            tr.className = "bg-white border-b hover:bg-gray-50";

            // Format branches availability
            let branchesHtml = '';
            if (type.branches && type.branches.length > 0) {
                branchesHtml = type.branches.map(b =>
                    `<div class="text-xs text-gray-600">${b.branch_name}: ${b.available_rooms} avail</div>`
                ).join('');
            } else {
                branchesHtml = '<span class="text-xs text-gray-400">No rooms configured</span>';
            }

            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-900">${type.type_name}</td>
                <td class="px-6 py-4">$${type.base_price}</td>
                <td class="px-6 py-4">${type.total_rooms}</td>
                <td class="px-6 py-4">${branchesHtml}</td>
                <td class="px-6 py-4">
                     <button class="text-gray-400 cursor-not-allowed" title="Edit via API only">Edit</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading rooms:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-red-500">
                    Failed to load room summaries.
                </td>
            </tr>
        `;
    }
}

async function loadRoomTypes() {
    const select = document.getElementById('room_type');
    try {
        const response = await axios.get(`${API_URL}/public/rooms`);
        const types = response.data.data || [];

        select.innerHTML = '<option value="">Select type</option>';
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.room_type_id; // Public API maps 'id' to 'room_type_id'? 
            // In Step 179: mapped to { room_type_id: type.id }
            option.textContent = `${type.type_name} ($${type.base_price})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading room types:", error);
    }
}

async function handleAddRoom(e) {
    e.preventDefault();
    const token = localStorage.getItem('staffToken');

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
        location.reload();
    } catch (error) {
        console.error("Error adding room:", error);
        alert(`Failed to add room: ${error.response?.data?.message || error.message}`);
    }
}

async function handleAddRoomType(e) {
    e.preventDefault();
    const token = localStorage.getItem('staffToken');

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
        location.reload();
    } catch (error) {
        console.error("Error adding room type:", error);
        alert(`Failed to add room type: ${error.response?.data?.message || error.message}`);
    }
}

function editRoom(id) {
    alert("Edit feature not fully implemented.");
}

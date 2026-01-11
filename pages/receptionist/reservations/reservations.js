const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadReservations();
    loadRoomTypes();

    document.getElementById('create-reservation-form').addEventListener('submit', handleCreateReservation);
});

function checkAuth() {
    const token = localStorage.getItem('staffToken');
    if (!token) window.location.href = '../signin/signin.html';
}

async function loadReservations() {
    const tableBody = document.getElementById('reservations-table-body');
    const search = document.getElementById('table-search').value;
    const token = localStorage.getItem('staffToken');

    let url = `${API_URL}/clerk/reservations?limit=100`; // Fetch many
    if (search) url += `&customer=${search}`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = response.data.data;
        const reservations = data.reservations || [];
        tableBody.innerHTML = '';

        if (reservations.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center">No reservations found.</td></tr>';
            return;
        }

        reservations.forEach(res => {
            const tr = document.createElement('tr');
            tr.className = "bg-white border-b hover:bg-gray-50";

            let statusColor = 'text-gray-500';
            if (res.reservation_status === 'Confirmed') statusColor = 'text-green-600 font-bold';
            if (res.reservation_status === 'Cancelled') statusColor = 'text-red-600';
            if (res.reservation_status === 'Checked_in' || res.reservation_status === 'Checked-in' || res.reservation_status === 'CheckedIn') statusColor = 'text-blue-600 font-bold';

            let actionBtn = '';
            if (res.reservation_status === 'Confirmed') {
                actionBtn = `<button onclick="handleCheckIn(${res.id})" class="font-medium text-blue-600 hover:underline">Check In</button>`;
            } else {
                actionBtn = `<span class="text-gray-400">-</span>`;
            }

            const checkIn = res.check_in_date ? res.check_in_date.split('T')[0] : '';
            const checkOut = res.check_out_date ? res.check_out_date.split('T')[0] : '';

            tr.innerHTML = `
                <td class="px-6 py-4">#${res.id}</td>
                <td class="px-6 py-4">
                    <div class="font-semibold">${res.customer ? res.customer.full_name : 'N/A'}</div>
                    <div class="text-xs text-gray-500">${res.customer ? res.customer.email : ''}</div>
                </td>
                <td class="px-6 py-4">${checkIn} to ${checkOut}</td>
                 <td class="px-6 py-4">${res.number_of_rooms} Room(s) / ${res.number_of_occupants} Guest(s)</td>
                <td class="px-6 py-4 ${statusColor}">${res.reservation_status}</td>
                <td class="px-6 py-4">${actionBtn}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading reservations:", error);
    }
}

async function loadRoomTypes() {
    const select = document.getElementById('room_type');
    try {
        const response = await axios.get(`${API_URL}/public/rooms`);
        const types = Array.isArray(response.data) ? response.data : (response.data.data || []);

        select.innerHTML = '<option value="">Select type</option>';
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.room_type_id;
            option.textContent = `${type.type_name}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading room types:", error);
    }
}

async function handleCreateReservation(e) {
    e.preventDefault();
    const token = localStorage.getItem('staffToken');

    // Construct payload per Clerk API requirement
    const payload = {
        customer: {
            full_name: document.getElementById('full_name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        },
        branch_id: parseInt(document.getElementById('branch_id').value),
        check_in_date: document.getElementById('check_in_date').value,
        check_out_date: document.getElementById('check_out_date').value,
        number_of_occupants: parseInt(document.getElementById('number_of_occupants').value),
        room_type_id: parseInt(document.getElementById('room_type').value),
        number_of_rooms: parseInt(document.getElementById('number_of_rooms').value)
    };

    try {
        await axios.post(`${API_URL}/clerk/reservations`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert("Reservation created successfully!");
        location.reload();
    } catch (error) {
        console.error("Error creating reservation:", error);
        alert(`Failed to create reservation: ${error.response?.data?.message || error.message}`);
    }
}

async function handleCheckIn(id) {
    if (!confirm(`Are you sure you want to check in reservation #${id}? This will assign a room.`)) return;

    const token = localStorage.getItem('staffToken');
    try {
        await axios.post(`${API_URL}/clerk/check-in`, { reservationId: id }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert("Check-in successful! Room Assigned."); // Ideally show assigned room number
        loadReservations();
    } catch (error) {
        console.error("Error checking in:", error);
        alert(`Check-in failed: ${error.response?.data?.message || error.message}`);
    }
}

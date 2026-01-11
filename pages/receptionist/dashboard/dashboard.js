const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadRoomStatus();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '../../signin/signin.html';
}

async function loadRoomStatus() {
    const grid = document.getElementById('room-grid');
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${API_URL}/clerk/rooms/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const rooms = response.data.data;
        grid.innerHTML = '';

        if (rooms.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center text-gray-500">No rooms found.</div>';
            return;
        }

        rooms.forEach(room => {
            const card = document.createElement('div');

            let bgClass = 'bg-gray-100 border-gray-300';
            let icon = 'fa-bed';

            if (room.status === 'Available') {
                bgClass = 'bg-green-100 border-green-300 text-green-800';
            } else if (room.status === 'Occupied') {
                bgClass = 'bg-red-100 border-red-300 text-red-800';
                icon = 'fa-user-lock';
            } else if (room.status === 'Maintenance') {
                bgClass = 'bg-gray-200 border-gray-400 text-gray-600';
                icon = 'fa-tools';
            }

            card.className = `p-4 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition ${bgClass}`;
            card.innerHTML = `
                <i class="fa-solid ${icon} text-2xl mb-2"></i>
                <span class="font-bold text-lg">${room.room_number}</span>
                <span class="text-xs uppercase mt-1">${room.roomtype ? room.roomtype.type_name : ''}</span>
            `;

            // Interaction to view details could be added here
            card.onclick = () => {
                if (room.status === 'Available') {
                    // Maybe prompt to create reservation/checkin?
                    // For now just alert
                    // alert(`Room ${room.room_number} is available.`);
                }
            };

            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading rooms:", error);
        grid.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load room status.</div>';
    }
}

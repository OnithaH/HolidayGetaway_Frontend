document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Context
    const user = JSON.parse(localStorage.getItem('customerUser'));
    const token = localStorage.getItem('customerToken');
    const selectedRoom = JSON.parse(sessionStorage.getItem('selectedRoom'));

    // 2. Auth Check
    if (!user || !token) {
        Swal.fire('Login Required', 'Please login to continue.', 'warning')
            .then(() => window.location.href = '../signin/signin.html');
        return;
    }

    // 3. Pre-fill Form (Visuals only)
    if (selectedRoom) {
        if(document.getElementById('roomType')) document.getElementById('roomType').value = selectedRoom.roomType;
        if(document.getElementById('price')) document.getElementById('price').value = selectedRoom.price;
    } else {
        // Handle direct access without selecting a room
        Swal.fire('No Room Selected', 'Please select a room from the Rooms page.', 'info')
            .then(() => window.location.href = '../rooms/rooms.html');
    }

    // 4. Handle Submission
    document.getElementById('reservationForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Data Preparation
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const occupants = parseInt(document.getElementById('guests').value);
        
        // Backend Payload
        const payload = {
            branch_id: selectedRoom ? selectedRoom.branchId : 1, 
            room_ids: [selectedRoom ? parseInt(selectedRoom.roomId) : 0], // Must be array
            check_in_date: checkIn,
            check_out_date: checkOut,
            number_of_occupants: occupants,
            number_of_rooms: 1 // Default to 1 for now
        };

        // Note: We intentionally IGNORE 'arrivalTime', 'specialRequests', 'airportPickup'
        // because the backend does not support them.

        try {
            const response = await fetch('http://localhost:5000/api/customer/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Booking Confirmed!',
                    text: 'Your reservation has been placed.',
                    icon: 'success'
                }).then(() => {
                    sessionStorage.removeItem('selectedRoom'); // Clear cache
                    window.location.href = '../dashboard/dashboard.html';
                });
            } else {
                throw new Error(data.message || 'Booking failed');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message, 'error');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
        window.location.href = '../signin/signin.html';
        return;
    }
    
    fetchReservations(token);
});

async function fetchReservations(token) {
    try {
        const response = await fetch('http://localhost:5000/api/customer/reservations/my', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();
        
        // Backend returns { data: [...] }
        if (response.ok && result.data) {
            renderTable(result.data);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function renderTable(reservations) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear fake data

    reservations.forEach(res => {
        // Format Date
        const checkIn = new Date(res.check_in_date).toLocaleDateString();
        const checkOut = new Date(res.check_out_date).toLocaleDateString();
        
        // Status Color
        let statusColor = 'bg-secondary';
        if (res.reservation_status === 'Confirmed') statusColor = 'bg-success';
        if (res.reservation_status === 'Cancelled') statusColor = 'bg-danger';
        if (res.reservation_status === 'Pending') statusColor = 'bg-warning text-dark';

        const row = `
            <tr>
                <td>#${res.id}</td>
                <td>${res.branch ? res.branch.name : 'Main Branch'}</td>
                <td>${checkIn}</td>
                <td>${checkOut}</td>
                <td>${res.number_of_occupants}</td>
                <td><span class="badge ${statusColor}">${res.reservation_status}</span></td>
                <td>
                    ${res.reservation_status !== 'Cancelled' ? 
                        `<button class="btn btn-sm btn-danger" onclick="cancelBooking(${res.id})">Cancel</button>` : 
                        '<span class="text-muted">Cancelled</span>'
                    }
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Global function for the Cancel button
window.cancelBooking = async function(id) {
    const token = localStorage.getItem('customerToken');
    
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/api/customer/reservation/${id}/cancel`, {
                    method: 'PATCH', // Note: PATCH not DELETE
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    Swal.fire('Cancelled!', 'Your reservation has been cancelled.', 'success');
                    fetchReservations(token); // Refresh table
                } else {
                    Swal.fire('Error', 'Could not cancel reservation.', 'error');
                }
            } catch (err) {
                console.error(err);
            }
        }
    });
};
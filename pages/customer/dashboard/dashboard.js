// Auth Check
const token = localStorage.getItem('customerToken');
if (!token) {
  window.location.href = '../signin/signin.html';
}

const user = JSON.parse(localStorage.getItem('customerUser') || '{}');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.dashboard-title').textContent = `Welcome back, ${user.name || 'Customer'}!`;

  fetchReservations();
  // We could also fetch billing stats here if the API supports a summary. 
  // For now, we'll focus on reservations.
});

async function fetchReservations() {
  const container = document.querySelector('.reservations-section .card-body');
  container.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-warning" role="status"></div><p>Loading reservations...</p></div>';

  try {
    const res = await fetch('http://localhost:5000/api/customer/reservations/my', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch reservations');

    const json = await res.json();
    const reservations = json.data || [];

    renderReservations(reservations);
    updateStats(reservations);

  } catch (err) {
    console.error(err);
    container.innerHTML = `<div class="alert alert-danger">Error loading reservations: ${err.message}</div>`;
  }
}

function renderReservations(reservations) {
  const container = document.querySelector('.reservations-section .card-body');

  if (reservations.length === 0) {
    container.innerHTML = `
            <div class="text-center p-5">
                <div class="mb-3" style="font-size: 3rem;">📭</div>
                <h5>No Reservations Found</h5>
                <p class="text-muted">You haven't made any reservations yet.</p>
                <a href="../rooms/rooms.html" class="btn btn-warning mt-2">Book a Room</a>
            </div>
        `;
    return;
  }

  let html = '';

  // Sort by date (newest first)
  reservations.sort((a, b) => new Date(b.check_in_date) - new Date(a.check_in_date));

  reservations.forEach(res => {
    // Determine status style
    let statusClass = 'status-pending';
    let statusText = res.reservation_status || 'Pending';

    if (statusText === 'Confirmed') statusClass = 'status-confirmed';
    else if (statusText === 'Cancelled') statusClass = 'status-cancelled';
    else if (statusText === 'Completed') statusClass = 'status-completed';

    // Format dates
    const checkIn = new Date(res.check_in_date).toLocaleDateString();
    const checkOut = new Date(res.check_out_date).toLocaleDateString();

    html += `
            <div class="reservation-block mb-4">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <div class="reservation-info">
                    <h5 class="reservation-title mb-2">Reservation #${res.id}</h5>
                    <div class="reservation-details">
                      <span class="detail-item">
                        <i class="detail-icon">📅</i>
                        <strong>Check-in:</strong> ${checkIn}
                      </span>
                      <span class="detail-item">
                        <i class="detail-icon">📅</i>
                        <strong>Check-out:</strong> ${checkOut}
                      </span>
                      <span class="detail-item">
                        <i class="detail-icon">👥</i>
                        <strong>Guests:</strong> ${res.number_of_occupants}
                      </span>
                      <span class="detail-item">
                        <i class="detail-icon">🏨</i>
                        <strong>Rooms:</strong> ${res.number_of_rooms}
                      </span>
                    </div>
                    <div class="reservation-meta mt-2">
                      <span class="reservation-id">Booked on: ${new Date(res.created_at || Date.now()).toLocaleDateString()}</span>
                      <span class="status-badge ${statusClass} ms-3">${statusText}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 text-md-end">
                  <div class="action-buttons">
                    ${statusText === 'Pending' || statusText === 'Confirmed' ? `
                        <button class="btn btn-outline-danger btn-sm me-2 mb-2" onclick="cancelReservation('${res.id}')">
                          <span>Cancel</span>
                        </button>
                    ` : ''}
                    ${statusText === 'Confirmed' ? `
                        <button class="btn btn-success btn-sm mb-2" onclick="completeReservation('${res.id}')">
                          <span>Complete/Check-out</span>
                        </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
        `;
  });

  container.innerHTML = html;
}

function updateStats(reservations) {
  const activeCount = reservations.filter(r => ['Pending', 'Confirmed'].includes(r.reservation_status)).length;
  const totalCount = reservations.length;

  // Update DOM if elements exist
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length >= 2) {
    stats[0].textContent = activeCount;
    stats[1].textContent = totalCount;
    // Total spent is harder without billing data in this API response
    // stats[2].textContent = '...'; 
  }
}

async function cancelReservation(id) {
  const result = await Swal.fire({
    title: 'Cancel Reservation?',
    text: "Are you sure you want to cancel this reservation?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it!'
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`http://localhost:5000/api/customer/reservation/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Cancelled!', 'Your reservation has been cancelled.', 'success');
        fetchReservations(); // Refresh
      } else {
        Swal.fire('Error', data.message || 'Could not cancel.', 'error');
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}

async function completeReservation(id) {
  // This implies "Checking Out" or "Completing Stay".
  // The backend has `PATCH /customer/reservation/:id/complete`
  try {
    const res = await fetch(`http://localhost:5000/api/customer/reservation/${id}/complete`, {
      method: 'PATCH', // Assumed PATCH based on routes
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      Swal.fire('Success', 'Reservation marked as complete.', 'success');
      fetchReservations();
    } else {
      Swal.fire('Error', 'Failed to complete reservation.', 'error');
    }
  } catch (err) {
    console.error(err);
  }
}

// Logout function
function logout() {
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#6c757d'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');

      Swal.fire({
        title: 'Logging out...',
        timer: 1500,
        showConfirmButton: false,
        willClose: () => {
          window.location.href = '../../../index.html';
        }
      });
    }
  });
}

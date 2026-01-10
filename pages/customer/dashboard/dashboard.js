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
  const currentContainer = document.getElementById('currentReservationsContainer');
  const pastContainer = document.getElementById('pastReservationsContainer');

  // Loading States
  if (currentContainer) currentContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-warning" role="status"></div><p>Loading active reservations...</p></div>';
  if (pastContainer) pastContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-warning" role="status"></div><p>Loading past reservations...</p></div>';

  try {
    // 1. Fetch Reservations
    const resReservations = await fetch('http://localhost:5000/api/customer/reservations/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const reservationsData = await resReservations.json();
    const reservations = resReservations.ok ? (reservationsData.data || []) : [];

    // 2. Fetch Billing (For Total Spent Stats)
    const resBilling = await fetch('http://localhost:5000/api/customer/billing', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const billingData = await resBilling.json();
    const bills = resBilling.ok ? (billingData.data || []) : [];

    // 3. Render
    renderReservations(reservations);
    updateStats(reservations, bills);

  } catch (err) {
    console.error(err);
    if (currentContainer) currentContainer.innerHTML = `<div class="alert alert-danger">Error loading data: ${err.message}</div>`;
    if (pastContainer) pastContainer.innerHTML = `<div class="alert alert-danger">Error loading data: ${err.message}</div>`;
  }
}

function renderReservations(reservations) {
  const currentContainer = document.getElementById('currentReservationsContainer');
  const pastContainer = document.getElementById('pastReservationsContainer');

  const activeReservations = [];
  const pastReservations = [];

  // Sort by date (newest first)
  reservations.sort((a, b) => new Date(b.check_in_date) - new Date(a.check_in_date));

  reservations.forEach(res => {
    if (['Pending', 'Confirmed'].includes(res.reservation_status)) {
      activeReservations.push(res);
    } else {
      pastReservations.push(res);
    }
  });

  // Render Active
  if (currentContainer) {
    if (activeReservations.length === 0) {
      currentContainer.innerHTML = `
        <div class="text-center p-5">
            <div class="mb-3" style="font-size: 3rem;">📭</div>
            <h5>No Active Reservations</h5>
            <p class="text-muted">You have no upcoming trips.</p>
            <a href="../rooms/rooms.html" class="btn btn-warning mt-2">Book a Room</a>
        </div>`;
    } else {
      currentContainer.innerHTML = activeReservations.map(res => generateReservationHTML(res, true)).join('');
    }
  }

  // Render Past
  if (pastContainer) {
    if (pastReservations.length === 0) {
      pastContainer.innerHTML = `
        <div class="text-center p-5">
            <p class="text-muted">No past reservation history.</p>
        </div>`;
    } else {
      pastContainer.innerHTML = pastReservations.map(res => generateReservationHTML(res, false)).join('');
    }
  }
}

function generateReservationHTML(res, isActive) {
  let statusClass = 'status-pending';
  let statusText = res.reservation_status || 'Pending';

  if (statusText === 'Confirmed') statusClass = 'status-confirmed';
  else if (statusText === 'Cancelled') statusClass = 'status-cancelled text-danger border-danger';
  else if (statusText === 'Completed') statusClass = 'status-completed text-success border-success';
  else if (statusText === 'No_show') statusClass = 'status-cancelled bg-dark text-white';

  const checkIn = new Date(res.check_in_date).toLocaleDateString();
  const checkOut = new Date(res.check_out_date).toLocaleDateString();

  // Branch Name Helper (Assuming included in response or Fallback)
  const branchName = res.branch ? res.branch.name : `Branch #${res.branch_id || '?'}`;

  // Room Types helper
  let roomSummary = `${res.number_of_rooms} Room(s)`;
  if (res.bookedrooms && res.bookedrooms.length > 0) {
    // Try to get type from first room
    if (res.bookedrooms[0].room && res.bookedrooms[0].room.roomtype) {
      roomSummary = `${res.number_of_rooms} x ${res.bookedrooms[0].room.roomtype.type_name}`;
    }
  }

  return `
        <div class="reservation-block mb-4 border rounded p-3 bg-light">
          <div class="row align-items-center">
            <div class="col-md-8">
              <div class="reservation-info">
                <h5 class="reservation-title mb-2">Reservation #${res.id} <small class="text-muted fs-6">(${branchName})</small></h5>
                
                <div class="reservation-details d-flex flex-wrap gap-3">
                  <span class="detail-item"><i class="detail-icon">📅</i> <strong>Check-in:</strong> ${checkIn}</span>
                  <span class="detail-item"><i class="detail-icon">📅</i> <strong>Check-out:</strong> ${checkOut}</span>
                  <span class="detail-item"><i class="detail-icon">👥</i> <strong>Guests:</strong> ${res.number_of_occupants}</span>
                  <span class="detail-item"><i class="detail-icon">🏨</i> <strong>${roomSummary}</strong></span>
                </div>

                <div class="reservation-meta mt-2">
                  <span class="reservation-id text-muted" style="font-size: 0.85rem;">Booked on: ${new Date(res.created_at || Date.now()).toLocaleDateString()}</span>
                  <span class="status-badge ${statusClass} ms-2 px-2 py-1 rounded border" style="font-size: 0.85rem;">${statusText}</span>
                </div>
              </div>
            </div>
            
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
              <div class="action-buttons">
                ${isActive && statusText !== 'Cancelled' ? `
                    <button class="btn btn-outline-danger btn-sm me-2" onclick="cancelReservation('${res.id}')">Cancel</button>
                    ${statusText === 'Confirmed' ? `
                        <button class="btn btn-success btn-sm" onclick="completeReservation('${res.id}')">Check-Out</button>
                    ` : ''}
                ` : ''}
                ${!isActive ? `<button class="btn btn-outline-secondary btn-sm" disabled>Archived</button>` : ''}
              </div>
            </div>
          </div>
        </div>
    `;
}

// Price Map (Frontend Estimates based on Mock Data)
const ROOM_PRICES = {
  'Deluxe Room': 240,
  'Deluxe Room - Ocean View': 240,
  'Presidential Suite': 500,
  'Standard Room': 120,
  'Suite': 280,
  'Suite - Garden View': 280,
  'Residential Suite': 200
};

function updateStats(reservations, bills) {
  const activeCount = reservations.filter(r => ['Pending', 'Confirmed'].includes(r.reservation_status)).length;
  const totalCount = reservations.length;

  let totalSpent = 0;

  // 1. Try Real Billing API First
  if (bills && Array.isArray(bills) && bills.length > 0) {
    console.log('Billing Data Received:', bills);
    totalSpent = bills.reduce((sum, bill) => {
      const status = (bill.status || 'Unpaid').toString();
      const amt = parseFloat(bill.total_amount || 0);
      if (status.toLowerCase() === 'paid') return sum + amt;
      return sum;
    }, 0);
  }

  // 2. Fallback: If Billing API returned nothing (backend issue), calculate from Reservations
  if (totalSpent === 0 && reservations.length > 0) {
    console.log('Billing API empty or 0. Calculating from Reservations...');

    reservations.forEach(res => {
      // Only count Completed, No-Show, or Confirmed (if paid)
      // For Total Spent, usually we count what is ALREADY paid. 
      // Assuming 'Confirmed' means deposit paid, 'Completed' means fully paid.
      const status = res.reservation_status;
      if (['Completed', 'Confirmed', 'No-Show', 'No_show'].includes(status)) {

        // Calculate Duration
        const start = new Date(res.check_in_date);
        const end = new Date(res.check_out_date);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

        // Determine Price
        let pricePerNight = 150; // Default fallback
        if (res.bookedrooms && res.bookedrooms.length > 0) {
          const type = res.bookedrooms[0].room?.roomtype?.type_name;
          if (type && ROOM_PRICES[type]) {
            pricePerNight = ROOM_PRICES[type];
          }
        }

        const cost = nights * pricePerNight * (res.number_of_rooms || 1);
        totalSpent += cost;
      }
    });
  }

  // Update DOM
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length >= 2) {
    stats[0].textContent = activeCount;
    stats[1].textContent = totalCount;
  }

  // Update Total Spent (ID we added)
  const spentEl = document.getElementById('totalSpentStat');
  if (spentEl) {
    spentEl.textContent = '$' + totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

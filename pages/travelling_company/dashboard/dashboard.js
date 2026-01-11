// Auth Check
const token = localStorage.getItem('tc_token');
if (!token) {
  window.location.href = '../signin/signin.html';
}

const user = JSON.parse(localStorage.getItem('tc_user') || '{}');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.dashboard-title').textContent = `Welcome back, ${user.company_name || 'Partner'}!`;

  fetchDashboardData();
});

async function fetchDashboardData() {
  const activeContainer = document.getElementById('tcActiveContainer');
  const pastContainer = document.getElementById('tcPastContainer');

  try {
    // Fetch Reservations
    // Endpoint: GET /api/travelCompany/reservations/my
    const resRes = await fetch('http://localhost:5000/api/travelCompany/reservations/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const resData = await resRes.json();
    // The backend might return { data: [...] } or just [...] depend on implementation
    const reservations = resRes.ok ? (resData.data || []) : [];

    // Fetch Billing (for stats)
    // Endpoint: GET /api/travelCompany/billing
    // Assuming this returns a list of bills
    let bills = [];
    try {
      const resBill = await fetch('http://localhost:5000/api/travelCompany/billing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const billData = await resBill.json();
      bills = resBill.ok ? (billData.data || []) : [];
    } catch (ignored) {
      console.warn("Billing fetch failed", ignored);
    }

    renderReservations(reservations);
    updateStats(reservations, bills);

  } catch (err) {
    console.error(err);
    if (activeContainer) activeContainer.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    if (pastContainer) pastContainer.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
  }
}

function renderReservations(reservations) {
  const activeContainer = document.getElementById('tcActiveContainer');
  const pastContainer = document.getElementById('tcPastContainer');

  if (!activeContainer || !pastContainer) return;

  // Separate Active vs Past
  // For blocked bookings, 'Confirmed' is usually active. 
  // 'Cancelled' or past dates are past.
  const now = new Date();
  const activeRes = [];
  const pastRes = [];

  reservations.forEach(res => {
    const end = new Date(res.end_date);
    const isPast = end < now;
    const isCancelled = res.status === 'Cancelled';

    if (isCancelled || isPast) {
      pastRes.push(res);
    } else {
      activeRes.push(res);
    }
  });

  // Render Active
  if (activeRes.length === 0) {
    activeContainer.innerHTML = `
        <div class="text-center p-5">
            <h5>No Active Block Bookings</h5>
            <p class="text-muted">You have no upcoming group stays.</p>
            <a href="../reservation/reservation.html" class="btn btn-warning mt-2">Make New Block</a>
        </div>`;
  } else {
    activeContainer.innerHTML = activeRes.map(res => generateBlockHTML(res, true)).join('');
  }

  // Render Past
  if (pastRes.length === 0) {
    pastContainer.innerHTML = `
        <div class="text-center p-5">
            <p class="text-muted">No past booking history.</p>
        </div>`;
  } else {
    pastContainer.innerHTML = pastRes.map(res => generateBlockHTML(res, false)).join('');
  }
}

function generateBlockHTML(res, isActive) {
  // Mapping Status
  let statusClass = 'status-confirmed';
  if (res.status === 'Cancelled') statusClass = 'status-cancelled';

  // Dates
  const start = new Date(res.start_date).toLocaleDateString();
  const end = new Date(res.end_date).toLocaleDateString();

  return `
    <div class="reservation-block mb-4 border rounded p-3 bg-light">
      <div class="row align-items-center">
        <div class="col-md-8">
          <div class="reservation-info">
            <h5 class="reservation-title mb-2">Block #${res.id} <small class="text-muted">(${res.branch_id} - ${res.room_type_id})</small></h5>
            
            <div class="reservation-details d-flex flex-wrap gap-3">
              <span class="detail-item"><i class="detail-icon">📅</i> <strong>Check-in:</strong> ${start}</span>
              <span class="detail-item"><i class="detail-icon">📅</i> <strong>Check-out:</strong> ${end}</span>
              <span class="detail-item"><i class="detail-icon">🚪</i> <strong>Rooms:</strong> ${res.number_of_rooms}</span>
            </div>

            <div class="reservation-meta mt-2">
              <span class="reservation-id text-muted" style="font-size: 0.85rem;">Created: ${new Date(res.created_at).toLocaleDateString()}</span>
              <span class="badge ${statusClass} ms-2 px-2 py-1">${res.status || 'Confirmed'}</span>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 text-md-end mt-3 mt-md-0">
          <div class="action-buttons">
            ${isActive && res.status !== 'Cancelled' ? `
                <button class="btn btn-outline-danger btn-sm" onclick="cancelBooking('${res.id}')">Cancel Block</button>
            ` : ''}
            ${!isActive ? `<button class="btn btn-outline-secondary btn-sm" disabled>Archived</button>` : ''}
          </div>
        </div>
      </div>
    </div>
    `;
}

function updateStats(reservations, bills) {
  // 1. Active Bookings
  const activeCount = reservations.filter(r => r.status !== 'Cancelled').length;

  // 2. Total Bookings
  const totalCount = reservations.length;

  // 3. Total Spent
  // Logic: Sum of all bills if available, else 0
  let totalSpent = 0;
  if (Array.isArray(bills)) {
    totalSpent = bills.reduce((acc, bill) => acc + parseFloat(bill.total_amount || 0), 0);
  }

  // DOM Updates
  // Indices: 0->Active, 1->Total, 2->Spent
  const stats = document.querySelectorAll('.stat-number');
  if (stats[0]) stats[0].textContent = activeCount;
  if (stats[1]) stats[1].textContent = totalCount;
  if (stats[2]) stats[2].textContent = '$' + totalSpent.toLocaleString();
}

// Actions
function cancelBooking(id) {
  Swal.fire({
    title: 'Cancel Booking?',
    text: 'This will cancel the entire block.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Yes, cancel it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/travelCompany/reservations/${id}/cancel`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();

        if (res.ok) {
          Swal.fire('Cancelled!', 'The booking has been cancelled.', 'success');
          fetchDashboardData(); // Refresh
        } else {
          Swal.fire('Error', data.message || 'Failed to cancel.', 'error');
        }
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  });
}

function logout() {
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('tc_token');
      localStorage.removeItem('tc_user');
      window.location.href = '../../../index.html';
    }
  });
}
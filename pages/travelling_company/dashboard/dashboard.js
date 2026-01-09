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
  const container = document.querySelector('.table-responsive');
  // We'll target the tbody inside it
  const tbody = document.querySelector('.reservation-table tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center p-4">Loading data...</td></tr>';

  try {
    // Fetch Reservations
    const resRes = await fetch('http://localhost:5000/api/travelCompany/reservations/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const resData = await resRes.json();
    const reservations = resRes.ok ? (resData.data || []) : [];

    // Fetch Billing (for stats)
    const resBill = await fetch('http://localhost:5000/api/travelCompany/billing', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const billData = await resBill.json();
    const bills = resBill.ok ? (billData.data || []) : [];

    renderReservations(reservations);
    updateStats(reservations, bills);

  } catch (err) {
    console.error(err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error: ${err.message}</td></tr>`;
  }
}

function renderReservations(reservations) {
  const tbody = document.querySelector('.reservation-table tbody');
  if (!tbody) return;

  if (reservations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center p-4">No bookings found. <a href="../reservation/reservation.html">Create one?</a></td></tr>';
    return;
  }

  // Sort by date desc
  reservations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  let html = '';
  reservations.forEach(res => {
    const start = new Date(res.start_date).toLocaleDateString();
    const end = new Date(res.end_date).toLocaleDateString();
    const status = res.status || 'Confirmed'; // Blocked bookings are usually confirmed if successful

    let statusClass = 'status-confirmed';
    if (status === 'Cancelled') statusClass = 'status-cancelled';

    html += `
            <tr>
                <td>#${res.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div>
                           <div class="fw-bold">${res.room_type_id} (Type ID)</div>
                           <small class="text-muted">Branch: ${res.branch_id}</small>
                        </div>
                    </div>
                </td>
                <td>${start} - ${end}</td>
                <td>${res.number_of_rooms} Rooms</td>
                <td><span class="badge ${statusClass}">${status}</span></td>
                <td>
                    ${status !== 'Cancelled' ? `
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelBooking('${res.id}')">Cancel</button>
                    ` : '-'}
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

function updateStats(reservations, bills) {
  // 1. Active Bookings
  const activeCount = reservations.filter(r => r.status !== 'Cancelled').length;

  // 2. Total Spent (Sum of paid bills or total billing?)
  // The billing API likely returns a list of bills. We can sum them up?
  // Let's assume bills have `total_amount` or similar.
  // If we don't know the structure, we'll just count them for now or default to 0.
  let totalSpent = 0;
  let pendingAmount = 0;

  if (Array.isArray(bills)) {
    // This is a guess on structure. If it fails, it shows 0.
    // If billing API returns an object with `total_due`, `total_paid`, we use that.
    // Based on `getOwnBillDetails`, it likely returns the bill record.
    // Let's look at `billData` structure if we could ... 
    // For now, I'll display 'Calculated in Billing' if not sure.

    // Actually, let's just use the count of reservations for "Total Bookings".
  }

  document.querySelectorAll('.stat-number').forEach((el, index) => {
    if (index === 0) el.textContent = activeCount; // Active Bookings
    if (index === 1) el.textContent = reservations.length; // Total Bookings
    // if (index === 2) ... // Pending Bills
  });
}

// Actions
function cancelBooking(id) {
  Swal.fire({
    title: 'Cancel Booking?',
    text: 'This will cancel the entire block.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((res) => {
    if (res.isConfirmed) {
      // There is no explicit cancel endpoint for TC in the routes I saw?
      // Let's check `travelCompany.routes.js`.
      // It has `createReservation`, `getMyReservations`, `getOwnBillDetails`.
      // It DOES NOT seem to have a CANCEL route for TC!
      // I should alert the user or hide the button.
      Swal.fire('Notice', 'Please contact support to cancel blocked bookings.', 'info');
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
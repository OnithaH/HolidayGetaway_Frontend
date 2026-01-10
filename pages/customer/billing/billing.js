// Auth Check
const token = localStorage.getItem('customerToken');
if (!token) {
    window.location.href = '../signin/signin.html';
}

document.addEventListener('DOMContentLoaded', function () {
    fetchBills();
});

const ROOM_PRICES = {
    'Deluxe Room': 240, 'Deluxe Room - Ocean View': 240, 'Presidential Suite': 500,
    'Standard Room': 120, 'Suite': 280, 'Suite - Garden View': 280, 'Residential Suite': 200
};

async function fetchBills() {
    const tableBody = document.querySelector('.billing-table tbody');
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center p-5"><div class="spinner-border text-warning"></div><p>Loading bills...</p></td></tr>';

    try {
        // 1. Fetch Real Bills
        const resBilling = await fetch('http://localhost:5000/api/customer/billing', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const billingData = await resBilling.json();
        let bills = resBilling.ok ? (billingData.data || []) : [];

        // 2. Fetch Reservations (For Synthetic Bills fallback)
        const resRes = await fetch('http://localhost:5000/api/customer/reservations/my', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await resRes.json();
        const reservations = resRes.ok ? (resData.data || []) : [];

        // 3. Fallback Generation
        if (bills.length === 0 && reservations.length > 0) {
            console.log("Generating synthetic bills from reservations...");
            bills = generateSyntheticBills(reservations);
        }

        renderBills(bills);
        updateStats(bills);

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error: ${err.message}</td></tr>`;
    }
}

function generateSyntheticBills(reservations) {
    return reservations.map(res => {
        // Calculate Cost
        const start = new Date(res.check_in_date);
        const end = new Date(res.check_out_date);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

        let price = 150;
        let typeName = 'Standard Room';
        if (res.bookedrooms && res.bookedrooms.length > 0) {
            typeName = res.bookedrooms[0].room?.roomtype?.type_name || typeName;
            if (ROOM_PRICES[typeName]) price = ROOM_PRICES[typeName];
        }
        const total = nights * price * (res.number_of_rooms || 1);

        // Determine Status based on Reservation
        let status = 'Unpaid';
        if (res.reservation_status === 'Completed') status = 'Paid';
        if (res.reservation_status === 'No_show' || res.reservation_status === 'No-Show') status = 'Paid'; // Assumed charged
        if (res.payment_status === 'Paid') status = 'Paid';

        return {
            reservation_id: res.id,
            billing_date: res.check_out_date, // estimate
            total_amount: total,
            status: status,
            description: `${nights} Night(s) - ${typeName}` // Helper field
        };
    });
}

function renderBills(bills) {
    const tableBody = document.querySelector('.billing-table tbody');

    if (bills.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center p-5">No billing records found.</td></tr>';
        return;
    }

    // Sort by billing_date desc
    bills.sort((a, b) => new Date(b.billing_date || Date.now()) - new Date(a.billing_date || Date.now()));

    let html = '';
    bills.forEach(bill => {
        const date = new Date(bill.billing_date || Date.now()).toLocaleDateString();
        const status = bill.status || 'Unpaid';
        let statusClass = 'status-unpaid';
        if (status === 'Paid') statusClass = 'status-paid';

        // Ensure amount is a number
        const amount = parseFloat(bill.total_amount || 0).toFixed(2);
        const desc = bill.description || 'Reservation Charge';

        html += `
            <tr class="bill-row" data-status="${status.toLowerCase()}">
                <td>
                    <div class="reservation-info">
                        <strong class="reservation-id">#${bill.reservation_id || 'N/A'}</strong>
                        <small class="reservation-date">${date}</small>
                    </div>
                </td>
                <td>
                    <div class="room-info">
                        <span class="room-type">${desc}</span>
                    </div>
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                    <div class="cost-breakdown">
                        <strong class="total-cost">$${amount}</strong>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${status}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${status !== 'Paid' ? `
                        <button class="btn btn-warning btn-sm" onclick="alert('Payment integration pending')">
                          <span>Pay Now</span>
                        </button>` : ''}
                        <button class="btn btn-outline-info btn-sm" onclick="alert('Invoice generation pending')">
                          <span>View Invoice</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function updateStats(bills) {
    let total = 0;
    let paid = 0;
    let pending = 0;

    bills.forEach(b => {
        const amt = parseFloat(b.total_amount || 0);
        total += amt;
        const status = b.status || 'Unpaid';

        if (status === 'Paid') paid += amt;
        else pending += amt;
    });

    // Update Main Stats Cards
    const statTotal = document.getElementById('statTotalBilled');
    const statPaid = document.getElementById('statTotalPaid');
    const statPending = document.getElementById('statPending');
    const statNoShow = document.getElementById('statNoShow');

    if (statTotal) statTotal.textContent = `$${total.toFixed(2)}`;
    if (statPaid) statPaid.textContent = `$${paid.toFixed(2)}`;
    if (statPending) statPending.textContent = `$${pending.toFixed(2)}`;
    if (statNoShow) statNoShow.textContent = `$0.00`; // No real No-Show bills in this schema

    // Update Header Summary
    const headerPaid = document.getElementById('headerTotalPaid');
    const headerPending = document.getElementById('headerPending');

    if (headerPaid) headerPaid.textContent = `$${paid.toFixed(2)}`;
    if (headerPending) headerPending.textContent = `$${pending.toFixed(2)}`;
}

// Global functions for filters (kept from original but simplified)
window.filterBills = function (status) {
    const rows = document.querySelectorAll('.bill-row');
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-filter="${status}"]`)?.classList.add('active');

    rows.forEach(row => {
        if (status === 'all' || row.dataset.status === status) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
};

function logout() {
    Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('customerToken');
            localStorage.removeItem('customerUser');
            window.location.href = '../../../index.html';
        }
    });
}
window.logout = logout;


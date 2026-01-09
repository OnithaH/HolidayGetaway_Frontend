// Auth Check
const token = localStorage.getItem('customerToken');
if (!token) {
    window.location.href = '../signin/signin.html';
}

document.addEventListener('DOMContentLoaded', function () {
    fetchBills();
});

async function fetchBills() {
    const tableBody = document.querySelector('.billing-table tbody');
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center p-5"><div class="spinner-border text-warning"></div><p>Loading bills...</p></td></tr>';

    try {
        const res = await fetch('http://localhost:5000/api/customer/billing', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        let bills = [];
        if (res.ok) {
            const json = await res.json();
            bills = json.data || [];
        } else {
            console.error('Failed to load bills');
            // If it fails, maybe empty array.
        }

        renderBills(bills);
        updateStats(bills);

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error: ${err.message}</td></tr>`;
    }
}

function renderBills(bills) {
    const tableBody = document.querySelector('.billing-table tbody');

    if (bills.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center p-5">No billing records found.</td></tr>';
        return;
    }

    // Sort by date desc
    bills.sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));

    let html = '';
    bills.forEach(bill => {
        const date = new Date(bill.created_at || Date.now()).toLocaleDateString();
        const status = bill.payment_status || 'Pending';
        let statusClass = 'status-unpaid';
        if (status === 'Paid') statusClass = 'status-paid';
        if (status === 'No-Show') statusClass = 'status-no-show';

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
                        <span class="room-type">${bill.description || 'Reservation Charge'}</span>
                    </div>
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                    <div class="cost-breakdown">
                        <strong class="total-cost">$${bill.amount || '0.00'}</strong>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${status}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${status === 'Pending' ? `
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
        const amt = parseFloat(b.amount || 0);
        total += amt;
        if (b.payment_status === 'Paid') paid += amt;
        else pending += amt;
    });

    const stats = document.querySelectorAll('.stat-number');
    if (stats.length >= 3) {
        stats[0].textContent = `$${total.toFixed(2)}`;
        stats[1].textContent = `$${paid.toFixed(2)}`;
        stats[2].textContent = `$${pending.toFixed(2)}`;
    }
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


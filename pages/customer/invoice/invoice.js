const token = localStorage.getItem('customerToken');
if (!token) {
    window.location.href = '../signin/signin.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    // Get Reservation ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('id');

    if (!reservationId) {
        Swal.fire('Error', 'No Reservation ID provided', 'error');
        return;
    }

    fetchInvoiceDetails(reservationId);
});

async function fetchInvoiceDetails(id) {
    try {
        const res = await fetch(`http://localhost:5000/api/customer/reservations/${id}/invoice`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();

        if (res.ok && json.data) {
            renderInvoice(json.data);
        } else {
            document.getElementById('invoiceItems').innerHTML = '<tr><td colspan="2" class="text-center text-danger">Invoice not found or not yet generated.</td></tr>';
            Swal.fire('Notice', 'Invoice data not found. Ensure reservation is completed or paid.', 'warning');
        }
    } catch (err) {
        console.error(err);
        document.getElementById('invoiceItems').innerHTML = '<tr><td colspan="2" class="text-center text-danger">Network Error</td></tr>';
    }
}

function renderInvoice(data) {
    // Basic Info
    const date = new Date(data.billing?.billing_date || Date.now()).toLocaleDateString();
    document.getElementById('invoiceDate').textContent = date;
    document.getElementById('invoiceId').textContent = data.billing?.id || 'PENDING';
    document.getElementById('reservationId').textContent = data.reservationId;

    // Status
    const status = data.billing?.status || 'Unpaid';
    const statusEl = document.getElementById('paymentStatus');
    statusEl.textContent = status.toUpperCase();
    statusEl.className = status === 'Paid' ? 'badge bg-success fs-6 px-3 py-2' : 'badge bg-danger fs-6 px-3 py-2';

    // Populate Customer & Stay Info (Assumption: data includes reservation details or we fetch them separately? 
    // The endpoint response usually just has billing. Let's handle if some data is nested in 'reservation')
    // Note: If the backend endpoint only returns billing, we might miss Customer Name if not included.
    // However, looking at the schema, 'getReservationInvoice' likely includes reservation relation.

    if (data.reservation) {
        // If the backend returns the nested reservation object
        const res = data.reservation;
        document.getElementById('checkInDate').textContent = new Date(res.check_in_date).toLocaleDateString();
        document.getElementById('checkOutDate').textContent = new Date(res.check_out_date).toLocaleDateString();

        // Use user from local storage for name if not in response
        const user = JSON.parse(localStorage.getItem('customerUser') || '{}');
        document.getElementById('customerName').textContent = user.full_name || 'Valued Customer';
        document.getElementById('customerEmail').textContent = user.email || '';
    }

    // Line Items
    const tbody = document.getElementById('invoiceItems');
    let html = '';

    const total = parseFloat(data.billing?.total_amount || 0);
    const tax = parseFloat(data.billing?.tax_amount || 0);
    const other = parseFloat(data.billing?.other_charges || 0);

    // Calculate Room Charge (Total - Tax - Other)
    const roomCharge = total - tax - other;

    html += `
        <tr>
            <td>Room Charges (Reservation #${data.reservationId})</td>
            <td class="text-end">$${roomCharge.toFixed(2)}</td>
        </tr>
    `;

    if (other > 0) {
        html += `
            <tr>
                <td>Other Services (Restaurant, Laundry, etc.)</td>
                <td class="text-end">$${other.toFixed(2)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = html;

    // Totals
    document.getElementById('subTotal').textContent = '$' + (roomCharge + other).toFixed(2);
    document.getElementById('taxAmount').textContent = '$' + tax.toFixed(2);
    document.getElementById('totalAmount').textContent = '$' + total.toFixed(2);
}

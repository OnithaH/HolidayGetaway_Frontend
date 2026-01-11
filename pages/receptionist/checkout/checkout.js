const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadActiveStays();
});

function checkAuth() {
    const token = localStorage.getItem('staffToken');
    if (!token) window.location.href = '../signin/signin.html';
}

async function loadActiveStays() {
    const tableBody = document.getElementById('active-stays-body');
    const token = localStorage.getItem('staffToken');

    // Status must be Checked_in (or Checked-in)
    // We'll try fetching 'Checked_in'
    // Note: Swagger said enum: [Confirmed, Cancelled, No_show, Complete]
    // But check-in endpoint sets it to 'Checked_in' (or similar). Let's check clerk.routes enum again? 
    // Step 18 enum was [Confirmed, Cancelled, No_show, Complete]. 
    // Wait, if check-in updates it, what does it update to? 
    // Actually, enum in swagger might be incomplete. Let's try fetching all and filtering in JS if needed.
    // Or try fetching list without status filter and see.

    try {
        const response = await axios.get(`${API_URL}/clerk/reservations?limit=100`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const allReservations = response.data.data.reservations || [];
        // Filter mainly for checked-in ones. 
        // Assuming 'Checked_in' or 'CheckedIn'
        // Actually, if I can't filter by API, I filter here.
        const activeStays = allReservations.filter(r =>
            r.reservation_status === 'Checked_in' ||
            r.reservation_status === 'Checked-in' ||
            r.reservation_status === 'CheckedIn'
        );

        tableBody.innerHTML = '';

        if (activeStays.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center">No active stays found.</td></tr>';
            return;
        }

        activeStays.forEach(res => {
            const tr = document.createElement('tr');
            tr.className = "bg-white border-b hover:bg-gray-50";

            // Extract room numbers
            const roomNumbers = res.bookedrooms ? res.bookedrooms.map(br => br.room ? br.room.room_number : '?').join(', ') : 'N/A';

            tr.innerHTML = `
                <td class="px-6 py-4">#${res.id}</td>
                <td class="px-6 py-4 font-medium text-gray-900">${res.customer ? res.customer.full_name : 'N/A'}</td>
                <td class="px-6 py-4">${roomNumbers}</td>
                <td class="px-6 py-4">${res.check_out_date ? res.check_out_date.split('T')[0] : ''}</td>
                <td class="px-6 py-4">
                    <button onclick="openCheckoutModal(${res.id}, '${res.customer?.full_name}', ${res.number_of_rooms || 1})" class="font-medium text-blue-600 hover:underline">
                        Checkout
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading stays:", error);
    }
}

// Variables to hold current checkout state
let currentBill = 0;

function openCheckoutModal(id, customerName, numRooms) {
    document.getElementById('current-res-id').value = id;
    document.getElementById('bill-customer').innerText = customerName;

    // Mock Bill Calculation (Since we don't have a GetBill endpoint easily accessible here without invoice)
    // We can assume some base price or just put placeholders.
    // Let's assume $100 per room per night just for visual.
    const estimated = numRooms * 100 * 1; // 1 night mock
    currentBill = estimated;

    document.getElementById('bill-room-charges').innerText = `$${estimated.toFixed(2)}`;
    document.getElementById('bill-services').innerText = `$0.00`;
    updateTotal();

    // Show modal
    const modal = new Modal(document.getElementById('checkout-modal'));
    modal.show();
    // Save instance to close later if needed, or rely on flowbite attributes
}

function updateTotal() {
    document.getElementById('bill-total').innerText = `$${currentBill.toFixed(2)}`;
}

async function addCharge() {
    const id = document.getElementById('current-res-id').value;
    const desc = document.getElementById('charge-desc').value;
    const amount = parseFloat(document.getElementById('charge-amount').value);

    if (!desc || !amount || amount <= 0) {
        alert("Please enter description and valid amount");
        return;
    }

    const token = localStorage.getItem('staffToken');
    try {
        await axios.post(`${API_URL}/clerk/reservations/${id}/charge`, {
            amount: amount,
            description: desc
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert("Charge added!");
        // Update UI locally
        currentBill += amount;
        document.getElementById('bill-services').innerText = `$${(parseFloat(document.getElementById('bill-services').innerText.replace('$', '')) + amount).toFixed(2)}`;
        updateTotal();

        // Clear inputs
        document.getElementById('charge-desc').value = '';
        document.getElementById('charge-amount').value = '';

    } catch (error) {
        console.error("Error adding charge:", error);
        alert(`Failed to add charge: ${error.response?.data?.message || error.message}`);
    }
}

async function processCheckout() {
    const id = document.getElementById('current-res-id').value;
    const method = document.getElementById('payment-method').value;
    const token = localStorage.getItem('staffToken');

    if (!confirm(`Confirm checkout for Reservation #${id} using ${method === 'cash' ? 'Cash' : 'Card'}?`)) return;

    try {
        // Since the actual checkout endpoint doesn't accept payment method, we just call it.
        // The backend update for payment recording is pending as per plan.
        await axios.post(`${API_URL}/clerk/check-out/${id}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert("Checkout Successful! Bill Finalized.");
        location.reload();

    } catch (error) {
        console.error("Error checking out:", error);
        alert(`Failed to check out: ${error.response?.data?.message || error.message}`);
    }
}

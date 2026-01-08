document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('customerToken');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:5000/api/customer/billing', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        const container = document.getElementById('billingContainer'); // Ensure your HTML has this ID

        if (response.ok && Array.isArray(data)) {
            let html = '<ul class="list-group">';
            data.forEach(bill => {
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>Invoice #${bill.id}</h5>
                            <small>Date: ${new Date(bill.billing_date).toLocaleDateString()}</small>
                        </div>
                        <span class="badge bg-primary rounded-pill">$${bill.total_amount}</span>
                    </li>
                `;
            });
            html += '</ul>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>No billing history found.</p>';
        }
    } catch (error) {
        console.error(error);
    }
});
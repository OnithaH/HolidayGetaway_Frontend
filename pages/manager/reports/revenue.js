const API_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Default dates: First day of month to today
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];

    document.getElementById('from-date').value = firstDay;
    document.getElementById('to-date').value = today;

    loadRevenueReport();
});

function checkAuth() {
    const token = localStorage.getItem('staffToken');
    if (!token) window.location.href = '../signin/signin.html';
}

async function loadRevenueReport() {
    const from = document.getElementById('from-date').value;
    const to = document.getElementById('to-date').value;
    const groupBy = document.getElementById('group-by').value;
    const token = localStorage.getItem('staffToken');

    if (!from || !to) return alert("Please select date range");

    let url = `${API_URL}/manager/reports/revenue?from_date=${from}&to_date=${to}`;
    if (groupBy) url += `&groupBy=${groupBy}`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = response.data.data;
        const summarySection = document.getElementById('summary-section');
        const tableSection = document.getElementById('table-section');

        if (!groupBy) {
            // Show Summary Cards
            summarySection.classList.remove('hidden');
            tableSection.classList.add('hidden');

            document.getElementById('sum-total').textContent = `$${(data.total_revenue || 0).toLocaleString()}`;
            document.getElementById('sum-tax').textContent = `$${(data.tax || 0).toLocaleString()}`;
            document.getElementById('sum-other').textContent = `$${(data.other_charges || 0).toLocaleString()}`;
            document.getElementById('sum-count').textContent = data.paid_reservations || 0;
        } else {
            // Show Table
            summarySection.classList.add('hidden');
            tableSection.classList.remove('hidden');
            const tbody = document.getElementById('revenue-table-body');
            tbody.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center">No data found.</td></tr>';
                return;
            }

            data.forEach(row => {
                const total = (row.total_revenue || 0) + (row.tax || 0); // Note: Backend implementation of total_revenue usually *includes* tax? verifying...
                // Looking at manager.service.js: finalAmount = totalAmount + taxAmount; billing.total_amount has the fina amount.
                // The API returns total_amount, tax_amount, other_charges. 
                // So row.total_revenue IS the total.

                const tr = document.createElement('tr');
                tr.className = "bg-white border-b hover:bg-gray-50";
                tr.innerHTML = `
                    <td class="px-6 py-4 font-medium text-gray-900">${row.period}</td>
                    <td class="px-6 py-4">$${(row.total_revenue - row.tax).toLocaleString()}</td> 
                    <td class="px-6 py-4 text-red-600">$${(row.tax || 0).toLocaleString()}</td>
                    <td class="px-6 py-4">$${(row.other_charges || 0).toLocaleString()}</td>
                    <td class="px-6 py-4 font-bold text-green-600">$${(row.total_revenue || 0).toLocaleString()}</td>
                `;
                // Note: The second column (Revenue) calculation `total - tax` is an assumption that total_revenue includes tax. 
                // If the backend sums 'total_amount' from billing table, and billing table 'total_amount' = rent + tax, then yes.

                tbody.appendChild(tr);
            });
        }

    } catch (error) {
        console.error("Error loading revenue report:", error);
        alert("Failed to load revenue report.");
    }
}

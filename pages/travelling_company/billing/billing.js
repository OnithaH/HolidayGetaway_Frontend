function filterBills(status) {
    const rows = document.querySelectorAll('.bill-row');
    const buttons = document.querySelectorAll('.btn-filter');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${status}"]`).classList.add('active');
    
    // Show/hide rows based on status
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = 'table-row';
        } else {
            if (row.getAttribute('data-status') === status) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
    
    // Update filter counts
    updateFilterCounts();
    
    // Add smooth transition effect
    rows.forEach(row => {
        row.style.opacity = '0';
        setTimeout(() => {
            if (row.style.display !== 'none') {
                row.style.opacity = '1';
            }
        }, 100);
    });
}

// Filter bills by date range
function filterByDate(days) {
    const rows = document.querySelectorAll('.bill-row');
    const currentDate = new Date();
    
    rows.forEach(row => {
        const dateText = row.querySelector('.reservation-date').textContent;
        const billDate = parseDateFromText(dateText);
        
        if (days === 'all') {
            row.style.display = 'table-row';
        } else {
            const daysDiff = Math.ceil((currentDate - billDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= parseInt(days)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        }
    });
    
    updateFilterCounts();
}

// Parse date from text format (e.g., "May 15-18, 2025")
function parseDateFromText(dateText) {
    // This is a simplified parser for the demo
    const year = dateText.match(/\d{4}/)[0];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    let month = 0;
    monthNames.forEach((monthName, index) => {
        if (dateText.includes(monthName.substring(0, 3))) {
            month = index;
        }
    });
    
    const dayMatch = dateText.match(/(\d{1,2})-?\d*/);
    const day = dayMatch ? parseInt(dayMatch[1]) : 1;
    
    return new Date(year, month, day);
}

// Update filter button counts
function updateFilterCounts() {
    const allRows = document.querySelectorAll('.bill-row');
    const visibleRows = document.querySelectorAll('.bill-row[style*="table-row"], .bill-row:not([style*="none"])');
    
    // Count by status
    let paidCount = 0, unpaidCount = 0, noShowCount = 0;
    
    visibleRows.forEach(row => {
        const status = row.getAttribute('data-status');
        switch(status) {
            case 'paid': paidCount++; break;
            case 'unpaid': unpaidCount++; break;
            case 'no-show': noShowCount++; break;
        }
    });
    
    // Update button counts
    document.querySelector('[data-filter="all"] .filter-count').textContent = `(${visibleRows.length})`;
    document.querySelector('[data-filter="paid"] .filter-count').textContent = `(${paidCount})`;
    document.querySelector('[data-filter="unpaid"] .filter-count').textContent = `(${unpaidCount})`;
    document.querySelector('[data-filter="no-show"] .filter-count').textContent = `(${noShowCount})`;
}

// View invoice function
function viewInvoice(reservationId) {
    // Create modal for invoice view
    const modal = createModal('Invoice Details', `
        <div class="invoice-content">
            <div class="invoice-header">
                <h4>Hotel Invoice</h4>
                <p><strong>Reservation ID:</strong> ${reservationId}</p>
            </div>
            <div class="invoice-body">
                <p>Invoice details would be displayed here...</p>
                <div class="alert alert-info">
                    <strong>Note:</strong> This is a UI demonstration. 
                    In a full system, detailed invoice information would be fetched from the database.
                </div>
            </div>
        </div>
    `);
    
    showModal(modal);
}

// Download receipt function
function downloadReceipt(reservationId) {
    // Simulate download process
    showNotification(`Downloading receipt for ${reservationId}...`, 'info');
    
    setTimeout(() => {
        showNotification(`Receipt for ${reservationId} downloaded successfully!`, 'success');
    }, 2000);
}

// Pay bill function
function payBill(reservationId) {
    const modal = createModal('Payment', `
        <div class="payment-form">
            <h5>Pay Bill for ${reservationId}</h5>
            <form>
                <div class="mb-3">
                    <label class="form-label">Payment Method</label>
                    <select class="form-select" id="paymentMethod">
                        <option value="credit">Credit Card</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>
                <div class="mb-3" id="cardDetails">
                    <label class="form-label">Card Number</label>
                    <input type="text" class="form-control" placeholder="1234 5678 9012 3456">
                </div>
                <div class="row mb-3" id="cardExtraDetails">
                    <div class="col-6">
                        <label class="form-label">Expiry</label>
                        <input type="text" class="form-control" placeholder="MM/YY">
                    </div>
                    <div class="col-6">
                        <label class="form-label">CVV</label>
                        <input type="text" class="form-control" placeholder="123">
                    </div>
                </div>
                <div class="alert alert-warning">
                    <strong>Note:</strong> This is a UI demonstration only. No actual payment processing occurs.
                </div>
            </form>
        </div>
    `, 'Process Payment');
    
    showModal(modal);
    
    // Add event listener for payment method change
    document.getElementById('paymentMethod').addEventListener('change', function() {
        const cardDetails = document.getElementById('cardDetails');
        const cardExtraDetails = document.getElementById('cardExtraDetails');
        
        if (this.value === 'cash') {
            cardDetails.style.display = 'none';
            cardExtraDetails.style.display = 'none';
        } else {
            cardDetails.style.display = 'block';
            cardExtraDetails.style.display = 'flex';
        }
    });
}

// Create modal function
function createModal(title, content, buttonText = 'Close') {
    const modalHtml = `
        <div class="modal fade" id="dynamicModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        ${buttonText !== 'Close' ? `<button type="button" class="btn btn-warning">${buttonText}</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modalHtml;
}

// Show modal function
function showModal(modalHtml) {
    // Remove existing modal if any
    const existingModal = document.getElementById('dynamicModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal (assuming Bootstrap is available)
    const modal = document.getElementById('dynamicModal');
    modal.classList.add('show');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
    
    // Close modal function
    const closeModal = () => {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        backdrop.remove();
        setTimeout(() => modal.remove(), 300);
    };
    
    // Add event listeners for closing
    modal.querySelectorAll('[data-bs-dismiss="modal"], .btn-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    backdrop.addEventListener('click', closeModal);
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close btn-close-sm ms-2"></button>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Manual close
    notification.querySelector('.btn-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
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
      // Simulate logout
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
// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-toast {
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border-radius: 10px;
        backdrop-filter: blur(10px);
    }
    
    .bill-row {
        transition: opacity 0.3s ease;
    }
    
    .modal-content {
        border-radius: 15px;
        backdrop-filter: blur(15px);
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .invoice-content, .payment-form {
        padding: 20px;
    }
    
    .invoice-header {
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(style);

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial filter counts
    updateFilterCounts();
    
    // Add smooth hover effects for table rows
    const rows = document.querySelectorAll('.bill-row');
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add loading animation for action buttons
    const actionButtons = document.querySelectorAll('.action-buttons .btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
    
    // Initialize tooltips for status badges
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
        badge.title = `Status: ${badge.textContent}`;
    });
    
    console.log('Billing page JavaScript initialized successfully!');
});

// Export functions for global access
window.filterBills = filterBills;
window.filterByDate = filterByDate;
window.viewInvoice = viewInvoice;
window.downloadReceipt = downloadReceipt;
window.payBill = payBill;

// Reservation management functions (non-functional for UI demo)
function changeReservation(reservationId) {
  alert(`Change reservation functionality would be implemented here.\nReservation ID: ${reservationId}\n\nThis would redirect to a form to modify dates, room type, or guest count.`);
}

function cancelReservation(reservationId) {
  if (confirm(`Are you sure you want to cancel reservation ${reservationId}?\n\nCancellation may be subject to fees depending on your booking terms.`)) {
    alert(`Reservation ${reservationId} would be cancelled.\n\nIn a real application, this would:\n- Update the reservation status\n- Process any applicable refunds\n- Send confirmation email`);
  }
}

function checkIn(reservationId) {
  alert(`Check-in functionality would be implemented here.\nReservation ID: ${reservationId}\n\nThis would:\n- Verify reservation details\n- Assign room number\n- Generate room key\n- Update reservation status`);
}

function secureReservation(reservationId) {
  alert(`Secure reservation functionality would redirect to payment page.\nReservation ID: ${reservationId}\n\nThis would:\n- Collect credit card information\n- Process payment authorization\n- Update reservation status to confirmed`);
}

function viewInvoice(reservationId) {
  alert(`Invoice viewer would be implemented here.\nReservation ID: ${reservationId}\n\nThis would display detailed billing information including:\n- Room charges\n- Additional services\n- Taxes and fees\n- Payment history`);
}

function rebookStay(reservationId) {
  alert(`Rebook functionality would be implemented here.\nOriginal Reservation ID: ${reservationId}\n\nThis would:\n- Pre-fill reservation form with previous details\n- Allow date and room modifications\n- Create new reservation`);
}

function contactSupport() {
  alert(`Contact Support options:\n\n📞 Phone: +94 77 678 6535\n📧 Email: info@onitha.com\n💬 Live Chat: Available 24/7\n\nIn a real application, this would open:\n- Live chat widget\n- Support ticket system\n- Contact form`);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Add any initialization code here
  console.log('Customer Dashboard loaded successfully');
  
  // Simulate real-time updates for demonstration
  // In a real application, this would connect to your backend API
});

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

// Auto-refresh functionality (for demo purposes)
function simulateDataRefresh() {
  // In a real application, this would fetch latest reservation data
  console.log('Refreshing reservation data...');
}




// Set up periodic refresh (commented out for demo)
// setInterval(simulateDataRefresh, 300000); // Refresh every 5 minutes
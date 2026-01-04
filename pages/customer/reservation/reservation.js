// Handle payment option changes
document.querySelectorAll('input[name="paymentOption"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const creditCardSection = document.getElementById('creditCardSection');
    const cardFields = creditCardSection.querySelectorAll('input, select');
    
    if (this.value === 'creditCard') {
      creditCardSection.style.display = 'block';
      // Make credit card fields required
      cardFields.forEach(field => {
        if (['cardNumber', 'cardName', 'expiryMonth', 'expiryYear', 'cvv'].includes(field.id)) {
          field.required = true;
        }
      });
    } else {
      creditCardSection.style.display = 'none';
      // Remove required attribute from credit card fields
      cardFields.forEach(field => {
        field.required = false;
      });
    }
  });
});

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkinDate').min = today;
  document.getElementById('checkoutDate').min = today;
});

// Update checkout date when checkin date changes
document.getElementById('checkinDate').addEventListener('change', function() {
  const checkinDate = new Date(this.value);
  const nextDay = new Date(checkinDate);
  nextDay.setDate(checkinDate.getDate() + 1);
  
  const checkoutInput = document.getElementById('checkoutDate');
  checkoutInput.min = nextDay.toISOString().split('T')[0];
  
  // Clear checkout date if it's before new minimum
  if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
    checkoutInput.value = '';
  }
});

// Format card number input
document.getElementById('cardNumber').addEventListener('input', function() {
  let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  this.value = formattedValue;
});

// CVV input restriction
document.getElementById('cvv').addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '');
});

// Reservation Form submission
document.getElementById('reservationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const paymentOption = formData.get('paymentOption');
  
  // Basic validation
  const requiredFields = ['fullName', 'email', 'phone', 'roomType', 'guests', 'checkinDate', 'checkoutDate'];
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!formData.get(field)) {
      isValid = false;
      document.getElementById(field).classList.add('is-invalid');
    } else {
      document.getElementById(field).classList.remove('is-invalid');
    }
  });
  
  // Validate credit card fields if payment option is credit card
  if (paymentOption === 'creditCard') {
    const cardFields = ['cardNumber', 'cardName', 'expiryMonth', 'expiryYear', 'cvv'];
    cardFields.forEach(field => {
      if (!formData.get(field)) {
        isValid = false;
        document.getElementById(field).classList.add('is-invalid');
      } else {
        document.getElementById(field).classList.remove('is-invalid');
      }
    });
  }
  
  if (isValid) {
    if (paymentOption === 'noCreditCard') {
      alert('⚠️ Reservation submitted successfully!\n\nIMPORTANT: Your reservation will be automatically cancelled at 7 PM daily unless secured with a credit card.\n\nReservation Details:\n- Name: ' + formData.get('fullName') + '\n- Room: ' + formData.get('roomType') + '\n- Check-in: ' + formData.get('checkinDate') + '\n- Check-out: ' + formData.get('checkoutDate'));
    } else {
      alert('🎉 Reservation confirmed successfully!\n\nYour reservation has been secured with your credit card.\n\nReservation Details:\n- Name: ' + formData.get('fullName') + '\n- Room: ' + formData.get('roomType') + '\n- Check-in: ' + formData.get('checkinDate') + '\n- Check-out: ' + formData.get('checkoutDate') + '\n\nA confirmation email will be sent shortly.');
    }
    
    // In a real application, you would redirect to a confirmation page
    // window.location.href = 'reservation-confirmation.php';
  } else {
    alert('Please fill in all required fields.');
  }
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
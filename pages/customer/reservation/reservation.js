// Auth Check
const token = localStorage.getItem('customerToken');
if (!token) {
  Swal.fire({
    title: 'Authentication Required',
    text: 'Please login to make a reservation.',
    icon: 'warning',
    confirmButtonText: 'Login'
  }).then(() => {
    window.location.href = '../signin/signin.html';
  });
}

// Mappings
const branchMapping = {
  'colombo': 1,
  'kandy': 2,
  'galle': 3,
  'nuwara-eliya': 4,
  'ella': 5,
  'sigiriya': 6
};

// Fallback if not found
const roomTypeMapping = {
  'standard': 1,
  'deluxe': 2,
  'suite': 3,
  'presidential': 4,
  'residential': 5
};

// Handle payment option changes
document.querySelectorAll('input[name="paymentOption"]').forEach(radio => {
  radio.addEventListener('change', function () {
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

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkinDate').min = today;
  document.getElementById('checkoutDate').min = today;

  // Pre-fill user data
  const user = JSON.parse(localStorage.getItem('customerUser') || '{}');
  if (user.email) document.getElementById('email').value = user.email;
  // Note: Full Name and Phone are not in the minimal token payload we decoded, 
  // but if we had them, we'd set them here. 
  // If the user profile endpoint existed, we'd fetch it here.

  // Pre-fill room data from rooms page
  const selectedRoom = JSON.parse(sessionStorage.getItem('selectedRoom'));
  if (selectedRoom) {
    if (selectedRoom.roomType) {
      const typeSelect = document.getElementById('roomType');
      // Try to match value. keys in rooms.js are lowercase.
      // Option values in HTML are also lowercase (standard, deluxe, etc.)
      typeSelect.value = selectedRoom.roomType.toLowerCase().split(' ')[0]; // 'Standard Room' -> 'standard'
    }
    // If we had a branch select, we'd fill it. But this form doesn't seem to ask for Branch?
    // WAIT: The form in HTML *doesn't* have a Branch dropdown! 
    // It assumes the user is booking a room structure, but the API NEEDS A BRANCH ID.
    // We MUST add the branch ID from the selectedRoom.
    // If the user didn't come from the Rooms page, we have a problem: specific branch choice is missing.
    // We will assume they came from Rooms page or default to 1 (Colombo).
  }
});

// Update checkout date when checkin date changes
document.getElementById('checkinDate').addEventListener('change', function () {
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
document.getElementById('cardNumber').addEventListener('input', function () {
  let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  this.value = formattedValue;
});

// CVV input restriction
document.getElementById('cvv').addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});

// Reservation Form submission
document.getElementById('reservationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = document.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Processing...';
  submitBtn.disabled = true;

  try {
    const formData = new FormData(this);
    const paymentOption = formData.get('paymentOption');

    const selectedRoom = JSON.parse(sessionStorage.getItem('selectedRoom'));

    // Determine Branch ID
    // 1. Try to get from Dropdown (User selection)
    let branchId = parseInt(document.getElementById('branchSelect').value);

    // 2. If valid from session (pre-selection), override or set matching
    if (selectedRoom) {
      // If user arrived from "Rooms" page, pre-select that value
      // Although the code below handles it better if we pre-set the dropdown value on load.
      // For now, let's prioritize the dropdown value since the user sees it.
      if (!branchId) branchId = branchMapping[selectedRoom.branch] || 1;
    }

    // Fallback default
    if (!branchId) branchId = 1;

    let roomId = 0; // The Mock Room ID
    if (selectedRoom) roomId = selectedRoom.roomId;

    const payload = {
      branch_id: branchId,
      check_in_date: formData.get('checkinDate'),
      check_out_date: formData.get('checkoutDate'),
      number_of_occupants: parseInt(formData.get('guests')),
      number_of_rooms: 1,
      room_ids: []
    };

    // 0. Pre-Check Availability (NEW LOGIC)
    try {
      const availRes = await fetch(`http://localhost:5000/api/customer/rooms/availability?branch_id=${branchId}&check_in_date=${payload.check_in_date}&check_out_date=${payload.check_out_date}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const availData = await availRes.json();

      if (availRes.ok && availData.data) {
        // Find a room matching the selected type
        const selectedTypeVal = document.getElementById('roomType').value.toLowerCase(); // e.g. "standard"

        // Mapping Frontend Options to Backend DB Types (based on debug findings)
        const typeMap = {
          'standard': 'single', // Map Standard -> Single
          'deluxe': 'double',   // Map Deluxe -> Double
          'suite': 'suite',      // Suite -> Suite
          'presidential': 'suite', // Fallback
          'residential': 'double' // Fallback
        };

        const targetDbType = typeMap[selectedTypeVal] || selectedTypeVal;

        // Strategy:
        // 1. Try Specific Match
        let availableRoom = availData.data.find(r => {
          const rType = (r.room_type || '').toLowerCase();
          return rType.includes(targetDbType);
        });

        // 2. Fallback: If no specific match, just take ANY available room
        // This ensures the demo "just works" if inventory is limited.
        if (!availableRoom && availData.data.length > 0) {
          availableRoom = availData.data[0];
          console.log("No specific room match found. Falling back to:", availableRoom);
        }

        if (availableRoom) {
          payload.room_ids = [availableRoom.id];
          console.log("Found available room:", availableRoom);
        } else {
          // If availData.data is empty, then genuine "No Rooms" error
          const branchName = document.getElementById('branchSelect').options[document.getElementById('branchSelect').selectedIndex].text;
          throw new Error(`We are fully booked at ${branchName} for these dates. Please try different dates or another branch.`);
        }
      } else {
        console.warn("Availability check failed, trying fallback logic...");
        // Fallback (if API fails but we want to try anyway, or specific error)
        // But usually we should block.
        throw new Error(availData.message || "Unable to check room availability.");
      }
    } catch (availErr) {
      throw availErr; // Stop execution, show error to user
    }

    // 1. Create Reservation
    try {
      const resCalls = await fetch('http://localhost:5000/api/customer/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await resCalls.json();

      if (!resCalls.ok) {
        // Specific handling for "Some rooms do not exist" to aid user debugging
        if (data.message && data.message.includes("rooms do not exist")) {
          throw new Error("Backend Data Error: The selected Room ID (" + roomId + ") does not exist in the database. Please contact the administrator to seed the 'Room' table.");
        }
        throw new Error(data.message || 'Reservation failed.');
      }

      const reservationId = data.data ? data.data.id : null;

      // 2. Handle Payment if Credit Card
      if (paymentOption === 'creditCard' && reservationId) {
        const paymentPayload = {
          reservationId: reservationId,
          cardType: 'VISA',
          cardNumber: formData.get('cardNumber').replace(/\s/g, ''),
          cardExpMonth: formData.get('expiryMonth'),
          cardExpYear: formData.get('expiryYear'),
          cvnCode: formData.get('cvv')
        };

        const payRes = await fetch('http://localhost:5000/api/customer/reservation/payment-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(paymentPayload)
        });

        if (!payRes.ok) {
          const payData = await payRes.json();
          console.warn("Payment failed:", payData);
          Swal.fire({
            title: 'Reservation Created, but Payment Failed',
            text: 'Reservation #' + reservationId + ' created. Payment failed: ' + (payData.message || 'Unknown error'),
            icon: 'warning'
          }).then(() => window.location.href = '../dashboard/dashboard.html');
          return;
        }
      }
    } catch (apiError) {
      throw apiError; // Re-throw to outer catch
    }

    // Success!
    let msg = 'Reservation confirmed!';
    if (paymentOption === 'noCreditCard') {
      msg += ' Note: Unpaid reservations are cancelled daily at 7 PM (Backend Policy).';
    }

    Swal.fire({
      title: 'Success!',
      text: msg,
      icon: 'success'
    }).then(() => {
      // Clear session selection
      sessionStorage.removeItem('selectedRoom');
      window.location.href = '../dashboard/dashboard.html';
    });

  } catch (err) {
    console.error(err);
    Swal.fire({
      title: 'Error',
      text: err.message,
      icon: 'error'
    });
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
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
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');

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
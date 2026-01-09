// Auth Check
const token = localStorage.getItem('tc_token');
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
const branchMapping = { 'colombo': 1, 'kandy': 2, 'galle': 3, 'nuwara-eliya': 4, 'ella': 5, 'sigiriya': 6 };
const roomTypeMapping = { 'standard': 1, 'deluxe': 2, 'suite': 3, 'presidential': 4, 'residential': 5 };

document.addEventListener('DOMContentLoaded', function () {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkinDate').min = today;
  document.getElementById('checkoutDate').min = today;

  // Hide Payment Options for Travel Company (Billed to Account)
  const paySection = document.querySelector('.payment-options');
  if (paySection) paySection.style.display = 'none';
  const payTitle = document.querySelector('.payment-section-title');
  if (payTitle) payTitle.style.display = 'none';
  const ccSection = document.getElementById('creditCardSection');
  if (ccSection) ccSection.style.display = 'none';

  // Pre-fill company data
  const user = JSON.parse(localStorage.getItem('tc_user') || '{}');
  if (user.email) document.getElementById('email').value = user.email;
  if (user.company_name) document.getElementById('fullName').value = user.company_name; // Using Name field for Company Name
});

document.getElementById('checkinDate').addEventListener('change', function () {
  const checkinDate = new Date(this.value);
  const nextDay = new Date(checkinDate);
  nextDay.setDate(checkinDate.getDate() + 1);
  const checkoutInput = document.getElementById('checkoutDate');
  checkoutInput.min = nextDay.toISOString().split('T')[0];
  if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
    checkoutInput.value = '';
  }
});

document.getElementById('reservationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const submitBtn = document.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Blocking Rooms...';
  submitBtn.disabled = true;

  try {
    const formData = new FormData(this);

    // Determine IDs (Default to 1 if not selected, though specific selection implies we need a generic "Branch" dropdown or assume one)
    // Since the form doesn't have Branch, we'll assume Branch 1 (Colombo) or whatever default.
    // Ideally we'd add a Branch Select to the HTML.
    // For now, hardcode Branch 1.
    const branchId = 1;

    const roomTypeStr = formData.get('roomType');
    const roomTypeId = roomTypeMapping[roomTypeStr] || 1;

    const payload = {
      branchId: branchId,
      roomTypeId: roomTypeId,
      startDate: formData.get('checkinDate'),
      endDate: formData.get('checkoutDate'),
      numberOfRooms: parseInt(formData.get('numberOfRooms') || 1)
    };

    const res = await fetch('http://localhost:5000/api/travelCompany/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Booking failed.');
    }

    Swal.fire({
      title: 'Success!',
      text: 'Rooms blocked successfully! Bill added to your account.',
      icon: 'success'
    }).then(() => {
      window.location.href = '../dashboard/dashboard.html';
    });

  } catch (err) {
    console.error(err);
    Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

function logout() {
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('tc_token');
      localStorage.removeItem('tc_user');
      window.location.href = '../../../index.html';
    }
  });
}
// Receptionist Dashboard JavaScript

// Sample Data
const sampleData = {
  reservations: [
    { id: 'RES001', firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', phone: '+94771234567', branch: 'colombo', roomType: 'deluxe', checkIn: '2024-06-12', checkOut: '2024-06-15', adults: 2, children: 0, status: 'confirmed', confirmationTime: '14:30' },
    { id: 'RES002', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@email.com', phone: '+94772345678', branch: 'galle', roomType: 'suite', checkIn: '2024-06-12', checkOut: '2024-06-14', adults: 2, children: 1, status: 'pending', confirmationTime: '16:00' },
    { id: 'RES003', firstName: 'Michael', lastName: 'Chen', email: 'mchen@email.com', phone: '+94773456789', branch: 'kandy', roomType: 'standard', checkIn: '2024-06-12', checkOut: '2024-06-13', adults: 1, children: 0, status: 'confirmed', confirmationTime: '10:15' }
  ],
  
  currentGuests: [
    { room: '201', firstName: 'David', lastName: 'Brown', checkIn: '2024-06-10', checkOut: '2024-06-13', nights: 3, status: 'checked-in', amount: 450 },
    { room: '305', firstName: 'Emma', lastName: 'Wilson', checkIn: '2024-06-11', checkOut: '2024-06-14', nights: 3, status: 'checked-in', amount: 650 },
    { room: '102', firstName: 'James', lastName: 'Taylor', checkIn: '2024-06-09', checkOut: '2024-06-12', nights: 3, status: 'checkout-due', amount: 380 },
    { room: '408', firstName: 'Lisa', lastName: 'Anderson', checkIn: '2024-06-11', checkOut: '2024-06-15', nights: 4, status: 'checked-in', amount: 890 }
  ],
  
  todaysCheckouts: [
    { room: '102', guest: 'James Taylor', time: '11:30 AM' },
    { room: '206', guest: 'Maria Garcia', time: '10:45 AM' },
    { room: '301', guest: 'Robert Lee', time: '12:15 PM' }
  ],
  
  guestHistory: [
    { confirmation: 'RES001', dates: '2024-06-12 to 2024-06-15', branch: 'Colombo', roomType: 'Deluxe', amount: 450, status: 'completed' },
    { confirmation: 'RES045', dates: '2024-05-20 to 2024-05-23', branch: 'Galle', roomType: 'Suite', amount: 780, status: 'completed' },
    { confirmation: 'RES023', dates: '2024-04-15 to 2024-04-18', branch: 'Kandy', roomType: 'Standard', amount: 320, status: 'completed' }
  ]
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  initializeDateInputs();
  loadInitialData();
  setupEventListeners();
  setupFormValidation();
  
  console.log('Receptionist Dashboard initialized successfully!');
});

// Initialize date inputs
function initializeDateInputs() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const checkInDate = document.getElementById('checkInDate');
  const checkOutDate = document.getElementById('checkOutDate');
  
  if (checkInDate) {
    checkInDate.min = today.toISOString().split('T')[0];
    checkInDate.value = today.toISOString().split('T')[0];
  }
  
  if (checkOutDate) {
    checkOutDate.min = tomorrow.toISOString().split('T')[0];
    checkOutDate.value = tomorrow.toISOString().split('T')[0];
  }
}

// Setup event listeners
function setupEventListeners() {
  // Check-in date change
  const checkInDate = document.getElementById('checkInDate');
  if (checkInDate) {
    checkInDate.addEventListener('change', function() {
      const checkOutDate = document.getElementById('checkOutDate');
      const selectedDate = new Date(this.value);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      
      checkOutDate.min = nextDay.toISOString().split('T')[0];
      if (checkOutDate.value && new Date(checkOutDate.value) <= selectedDate) {
        checkOutDate.value = nextDay.toISOString().split('T')[0];
      }
    });
  }
  
  // Form submissions
  const newReservationForm = document.getElementById('newReservationForm');
  if (newReservationForm) {
    newReservationForm.addEventListener('submit', handleNewReservation);
  }
  
  const walkinForm = document.getElementById('walkinCheckinForm');
  if (walkinForm) {
    walkinForm.addEventListener('submit', handleWalkinCheckin);
  }
}

// Setup form validation
function setupFormValidation() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
}

// Load initial data
function loadInitialData() {
  populateTodaysReservations();
  populatePendingCheckins();
  populateCurrentGuests();
  populateTodaysCheckouts();
}

// Populate today's reservations
function populateTodaysReservations() {
  const tbody = document.getElementById('todaysReservationsTable');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  sampleData.reservations.forEach(reservation => {
    const row = `
      <tr>
        <td>${reservation.firstName} ${reservation.lastName}</td>
        <td>${reservation.roomType}</td>
        <td>${reservation.confirmationTime}</td>
        <td><span class="status-badge ${reservation.status}">${reservation.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-info" onclick="viewReservation('${reservation.id}')">View</button>
            <button class="btn btn-primary" onclick="modifyReservation('${reservation.id}')">Edit</button>
            <button class="btn btn-danger" onclick="cancelReservation('${reservation.id}')">Cancel</button>
          </div>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Populate pending check-ins
function populatePendingCheckins() {
  const tbody = document.getElementById('pendingCheckinsTable');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  sampleData.reservations.filter(r => r.status === 'confirmed').forEach(reservation => {
    const row = `
      <tr>
        <td>${reservation.id}</td>
        <td>${reservation.firstName} ${reservation.lastName}</td>
        <td>${reservation.roomType}</td>
        <td>${reservation.confirmationTime}</td>
        <td>${reservation.adults + reservation.children}</td>
        <td><span class="status-badge pending">Pending Check-in</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-success" onclick="processCheckin('${reservation.id}')">Check-in</button>
            <button class="btn btn-info" onclick="viewReservation('${reservation.id}')">View</button>
          </div>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Populate current guests
function populateCurrentGuests() {
  const tbody = document.getElementById('currentGuestsTable');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  sampleData.currentGuests.forEach(guest => {
    const row = `
      <tr>
        <td>${guest.room}</td>
        <td>${guest.firstName} ${guest.lastName}</td>
        <td>${formatDate(guest.checkIn)}</td>
        <td>${formatDate(guest.checkOut)}</td>
        <td>${guest.nights}</td>
        <td><span class="status-badge ${guest.status.replace('-', '_')}">${guest.status}</span></td>
        <td>
          <div class="action-buttons">
            ${guest.status === 'checkout-due' ? 
              `<button class="btn btn-warning" onclick="processCheckout('${guest.room}')">Check-out</button>` : 
              `<button class="btn btn-info" onclick="extendStay('${guest.room}')">Extend</button>`
            }
            <button class="btn btn-primary" onclick="viewGuestBill('${guest.room}')">Bill</button>
          </div>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Populate today's checkouts
function populateTodaysCheckouts() {
  const tbody = document.getElementById('todaysCheckoutsTable');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  sampleData.todaysCheckouts.forEach(checkout => {
    const row = `
      <tr>
        <td>${checkout.room}</td>
        <td>${checkout.guest}</td>
        <td>${checkout.time}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Handle new reservation
function handleNewReservation(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const reservationData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    branch: document.getElementById('branch').value,
    roomType: document.getElementById('roomType').value,
    checkIn: document.getElementById('checkInDate').value,
    checkOut: document.getElementById('checkOutDate').value,
    adults: document.getElementById('adults').value,
    children: document.getElementById('children').value,
    specialRequests: document.getElementById('specialRequests').value
  };
  
  if (!validateReservationData(reservationData)) {
    return;
  }
  
  showLoading(true);
  
  // Simulate API call
  setTimeout(() => {
    showLoading(false);
    
    const confirmationNumber = generateConfirmationNumber();
    
    Swal.fire({
      icon: 'success',
      title: 'Reservation Created',
      html: `
        <div class="text-start">
          <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
          <p><strong>Guest:</strong> ${reservationData.firstName} ${reservationData.lastName}</p>
          <p><strong>Email:</strong> ${reservationData.email}</p>
          <p><strong>Check-in:</strong> ${formatDate(reservationData.checkIn)}</p>
          <p><strong>Check-out:</strong> ${formatDate(reservationData.checkOut)}</p>
          <p><strong>Room Type:</strong> ${reservationData.roomType}</p>
          <p><strong>Guests:</strong> ${reservationData.adults} adults, ${reservationData.children} children</p>
        </div>
      `,
      confirmButtonColor: '#ff9f1c',
      confirmButtonText: 'Print Confirmation'
    }).then((result) => {
      if (result.isConfirmed) {
        printConfirmation(confirmationNumber, reservationData);
      }
    });
    
    // Clear form
    e.target.reset();
    e.target.classList.remove('was-validated');
    
    // Refresh reservations
    populateTodaysReservations();
  }, 2000);
}

// Handle walk-in check-in
function handleWalkinCheckin(e) {
  e.preventDefault();
  
  const walkinData = {
    firstName: document.getElementById('walkinFirstName').value,
    lastName: document.getElementById('walkinLastName').value,
    email: document.getElementById('walkinEmail').value,
    phone: document.getElementById('walkinPhone').value,
    branch: document.getElementById('walkinBranch').value,
    roomType: document.getElementById('walkinRoomType').value,
    nights: document.getElementById('walkinNights').value,
    guests: document.getElementById('walkinGuests').value
  };
  
  showLoading(true);
  
  // Simulate room assignment and check-in
  setTimeout(() => {
    showLoading(false);
    
    const roomNumber = assignRoom(walkinData.roomType);
    const totalAmount = calculateAmount(walkinData.roomType, walkinData.nights);
    
    Swal.fire({
      icon: 'success',
      title: 'Walk-in Check-in Successful',
      html: `
        <div class="text-start">
          <p><strong>Guest:</strong> ${walkinData.firstName} ${walkinData.lastName}</p>
          <p><strong>Room:</strong> ${roomNumber}</p>
          <p><strong>Room Type:</strong> ${walkinData.roomType}</p>
          <p><strong>Nights:</strong> ${walkinData.nights}</p>
          <p><strong>Guests:</strong> ${walkinData.guests}</p>
          <p><strong>Total Amount:</strong> $${totalAmount}</p>
          <hr>
          <p class="text-muted">Room key cards have been issued.</p>
        </div>
      `,
      confirmButtonColor: '#ff9f1c',
      confirmButtonText: 'Print Receipt'
    });
    
    // Clear form
    e.target.reset();
    e.target.classList.remove('was-validated');
    
    // Refresh current guests
    populateCurrentGuests();
  }, 1500);
}

// Search reservation
function searchReservation() {
  const searchMethod = document.getElementById('searchMethod').value;
  const searchValue = document.getElementById('searchValue').value;
  
  if (!searchValue.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Search Value Required',
      text: 'Please enter a search value.',
      confirmButtonColor: '#ff9f1c'
    });
    return;
  }
  
  showLoading(true);
  
  // Simulate search
  setTimeout(() => {
    showLoading(false);
    
    // Find matching reservation (simulate)
    const reservation = sampleData.reservations.find(r => 
      r.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      (r.firstName + ' ' + r.lastName).toLowerCase().includes(searchValue.toLowerCase()) ||
      r.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      r.phone.includes(searchValue)
    );
    
    if (reservation) {
      displaySearchResults(reservation);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No Reservation Found',
        text: 'No reservation found matching your search criteria.',
        confirmButtonColor: '#ff9f1c'
      });
    }
  }, 1000);
}

// Display search results
function displaySearchResults(reservation) {
  const searchResults = document.getElementById('searchResults');
  const reservationDetails = document.getElementById('reservationDetails');
  
  reservationDetails.innerHTML = `
    <h6>Reservation Found</h6>
    <div class="reservation-details">
      <div class="detail-item">
        <span class="detail-label">Confirmation</span>
        <span class="detail-value">${reservation.id}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Guest Name</span>
        <span class="detail-value">${reservation.firstName} ${reservation.lastName}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Email</span>
        <span class="detail-value">${reservation.email}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Phone</span>
        <span class="detail-value">${reservation.phone}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Check-in</span>
        <span class="detail-value">${formatDate(reservation.checkIn)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Check-out</span>
        <span class="detail-value">${formatDate(reservation.checkOut)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Room Type</span>
        <span class="detail-value">${reservation.roomType}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Guests</span>
        <span class="detail-value">${reservation.adults} adults, ${reservation.children} children</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Status</span>
        <span class="detail-value"><span class="status-badge ${reservation.status}">${reservation.status}</span></span>
      </div>
    </div>
    <div class="mt-3">
      <button class="btn btn-success me-2" onclick="processCheckin('${reservation.id}')">Check-in Guest</button>
      <button class="btn btn-primary me-2" onclick="modifyReservation('${reservation.id}')">Modify</button>
      <button class="btn btn-danger" onclick="cancelReservation('${reservation.id}')">Cancel</button>
    </div>
  `;
  
  searchResults.style.display = 'block';
  searchResults.classList.add('fade-in');
}

// Process check-in
function processCheckin(reservationId) {
  const reservation = sampleData.reservations.find(r => r.id === reservationId);
  if (!reservation) return;
  
  Swal.fire({
    title: 'Confirm Check-in',
    html: `
      <div class="text-start">
        <p><strong>Guest:</strong> ${reservation.firstName} ${reservation.lastName}</p>
        <p><strong>Room Type:</strong> ${reservation.roomType}</p>
        <p><strong>Dates:</strong> ${formatDate(reservation.checkIn)} to ${formatDate(reservation.checkOut)}</p>
        <p><strong>Guests:</strong> ${reservation.adults} adults, ${reservation.children} children</p>
        <hr>
        <p>Assign room number:</p>
        <input type="text" id="assignedRoom" class="swal2-input" placeholder="Room number" value="${assignRoom(reservation.roomType)}">
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Complete Check-in',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#6c757d',
    preConfirm: () => {
      const roomNumber = document.getElementById('assignedRoom').value;
      if (!roomNumber) {
        Swal.showValidationMessage('Please enter a room number');
        return false;
      }
      return roomNumber;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const roomNumber = result.value;
      
      showLoading(true);
      
      setTimeout(() => {
        showLoading(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Check-in Completed',
          html: `
            <div class="text-start">
              <p><strong>Guest:</strong> ${reservation.firstName} ${reservation.lastName}</p>
              <p><strong>Room:</strong> ${roomNumber}</p>
              <p><strong>Key Cards:</strong> 2 issued</p>
              <p><strong>WiFi Password:</strong> HolidayGuest2024</p>
              <hr>
              <p class="text-muted">Welcome package has been prepared.</p>
            </div>
          `,
          confirmButtonColor: '#ff9f1c',
          confirmButtonText: 'Print Welcome Package'
        });
        
        // Update reservation status
        reservation.status = 'checked-in';
        
        // Refresh tables
        populatePendingCheckins();
        populateCurrentGuests();
      }, 1000);
    }
  });
}

// Quick checkout
function quickCheckout() {
  const roomNumber = document.getElementById('checkoutRoom').value;
  
  if (!roomNumber.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Room Number Required',
      text: 'Please enter a room number.',
      confirmButtonColor: '#ff9f1c'
    });
    return;
  }
  
  const guest = sampleData.currentGuests.find(g => g.room === roomNumber);
  
  if (!guest) {
    Swal.fire({
      icon: 'error',
      title: 'Guest Not Found',
      text: 'No guest found in the specified room.',
      confirmButtonColor: '#ff9f1c'
    });
    return;
  }
  
  // Display bill summary
  displayBillSummary(guest);
}

// Display bill summary
function displayBillSummary(guest) {
  const billSummary = document.getElementById('billSummary');
  const billDetails = billSummary.querySelector('.bill-details');
  
  const roomRate = getRoomRate(guest.room);
  const taxes = Math.round(guest.amount * 0.1);
  const total = guest.amount + taxes;
  
  billDetails.innerHTML = `
    <div class="bill-item">
      <span>Room Charges (${guest.nights} nights)</span>
      <span>${guest.amount}</span>
    </div>
    <div class="bill-item">
      <span>Service Charge</span>
      <span>$0</span>
    </div>
    <div class="bill-item">
      <span>Taxes (10%)</span>
      <span>${taxes}</span>
    </div>
    <div class="bill-item total">
      <span>Total Amount</span>
      <span>${total}</span>
    </div>
    <div class="mt-3">
      <button class="btn btn-warning w-100" onclick="finalizeCheckout('${guest.room}', ${total})">Process Check-out</button>
    </div>
  `;
  
  billSummary.style.display = 'block';
  billSummary.classList.add('fade-in');
}

// Finalize checkout
function finalizeCheckout(roomNumber, amount) {
  Swal.fire({
    title: 'Payment Method',
    text: 'How would the guest like to pay?',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Cash',
    denyButtonText: 'Card',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#28a745',
    denyButtonColor: '#17a2b8'
  }).then((result) => {
    if (result.isConfirmed || result.isDenied) {
      const paymentMethod = result.isConfirmed ? 'Cash' : 'Card';
      
      showLoading(true);
      
      setTimeout(() => {
        showLoading(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Check-out Completed',
          html: `
            <div class="text-start">
              <p><strong>Room:</strong> ${roomNumber}</p>
              <p><strong>Amount:</strong> ${amount}</p>
              <p><strong>Payment:</strong> ${paymentMethod}</p>
              <p><strong>Status:</strong> Paid</p>
              <hr>
              <p class="text-muted">Room is now available for housekeeping.</p>
            </div>
          `,
          confirmButtonColor: '#ff9f1c',
          confirmButtonText: 'Print Receipt'
        });
        
        // Clear checkout form
        document.getElementById('checkoutRoom').value = '';
        document.getElementById('billSummary').style.display = 'none';
        
        // Update guest status
        const guestIndex = sampleData.currentGuests.findIndex(g => g.room === roomNumber);
        if (guestIndex !== -1) {
          sampleData.currentGuests[guestIndex].status = 'checked-out';
        }
        
        // Refresh tables
        populateCurrentGuests();
        populateTodaysCheckouts();
      }, 1500);
    }
  });
}

// Search guest
function searchGuest() {
  const searchType = document.getElementById('guestSearchType').value;
  const searchValue = document.getElementById('guestSearchValue').value;
  
  if (!searchValue.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Search Value Required',
      text: 'Please enter a search value.',
      confirmButtonColor: '#ff9f1c'
    });
    return;
  }
  
  showLoading(true);
  
  // Simulate search
  setTimeout(() => {
    showLoading(false);
    
    // Find guest (simulate with reservation data)
    const guest = sampleData.reservations.find(r => 
      (r.firstName + ' ' + r.lastName).toLowerCase().includes(searchValue.toLowerCase()) ||
      r.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      r.phone.includes(searchValue) ||
      r.id.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    if (guest) {
      displayGuestInfo(guest);
      populateGuestHistory(guest);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Guest Not Found',
        text: 'No guest found matching your search criteria.',
        confirmButtonColor: '#ff9f1c'
      });
    }
  }, 1000);
}

// Display guest information
function displayGuestInfo(guest) {
  const guestInfo = document.getElementById('guestInfo');
  
  const initials = guest.firstName.charAt(0) + guest.lastName.charAt(0);
  
  guestInfo.innerHTML = `
    <div class="guest-card">
      <div class="guest-header">
        <div class="guest-avatar">${initials}</div>
        <div>
          <h5 class="guest-name">${guest.firstName} ${guest.lastName}</h5>
          <p class="guest-email">${guest.email}</p>
          <p class="guest-phone">${guest.phone}</p>
        </div>
      </div>
      <div class="guest-details">
        <div class="row">
          <div class="col-6">
            <small class="text-muted">Total Reservations</small>
            <div class="fw-bold">3</div>
          </div>
          <div class="col-6">
            <small class="text-muted">Total Spent</small>
            <div class="fw-bold">$1,550</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  guestInfo.classList.add('fade-in');
}

// Populate guest history
function populateGuestHistory(guest) {
  const tbody = document.getElementById('guestHistoryTable');
  
  tbody.innerHTML = '';
  
  sampleData.guestHistory.forEach(history => {
    const row = `
      <tr>
        <td>${history.confirmation}</td>
        <td>${history.dates}</td>
        <td>${history.branch}</td>
        <td>${history.roomType}</td>
        <td>${history.amount}</td>
        <td><span class="status-badge ${history.status}">${history.status}</span></td>
        <td>
          <button class="btn btn-info btn-sm" onclick="viewReservationDetails('${history.confirmation}')">View</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Utility functions
function validateReservationData(data) {
  const errors = [];
  
  if (!data.firstName.trim()) errors.push('First name is required');
  if (!data.lastName.trim()) errors.push('Last name is required');
  if (!data.email.trim()) errors.push('Email is required');
  if (!data.phone.trim()) errors.push('Phone is required');
  if (!data.branch) errors.push('Branch is required');
  if (!data.roomType) errors.push('Room type is required');
  if (!data.checkIn) errors.push('Check-in date is required');
  if (!data.checkOut) errors.push('Check-out date is required');
  if (!data.adults) errors.push('Number of adults is required');
  
  if (new Date(data.checkOut) <= new Date(data.checkIn)) {
    errors.push('Check-out date must be after check-in date');
  }
  
  if (errors.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      html: errors.map(error => `• ${error}`).join('<br>'),
      confirmButtonColor: '#ff9f1c'
    });
    return false;
  }
  
  return true;
}

function generateConfirmationNumber() {
  return 'RES' + Date.now().toString().slice(-6);
}

function assignRoom(roomType) {
  const roomNumbers = {
    standard: ['101', '102', '103', '201', '202'],
    deluxe: ['301', '302', '303', '401', '402'],
    suite: ['501', '502', '503'],
    presidential: ['601', '602']
  };
  
  const available = roomNumbers[roomType] || roomNumbers.standard;
  return available[Math.floor(Math.random() * available.length)];
}

function calculateAmount(roomType, nights) {
  const rates = {
    standard: 120,
    deluxe: 180,
    suite: 280,
    presidential: 450
  };
  
  return (rates[roomType] || rates.standard) * parseInt(nights);
}

function getRoomRate(roomNumber) {
  // Simulate room rate lookup
  if (roomNumber.startsWith('1') || roomNumber.startsWith('2')) return 120;
  if (roomNumber.startsWith('3') || roomNumber.startsWith('4')) return 180;
  if (roomNumber.startsWith('5')) return 280;
  return 450;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  overlay.style.display = show ? 'flex' : 'none';
}

function printConfirmation(confirmationNumber, data) {
  // Simulate printing
  console.log('Printing confirmation:', confirmationNumber, data);
  Swal.fire({
    icon: 'info',
    title: 'Printing...',
    text: 'Confirmation is being printed.',
    timer: 1500,
    showConfirmButton: false
  });
}

// Additional functions for buttons
function viewReservation(reservationId) {
  const reservation = sampleData.reservations.find(r => r.id === reservationId);
  if (!reservation) return;
  
  Swal.fire({
    title: 'Reservation Details',
    html: `
      <div class="text-start">
        <p><strong>Confirmation:</strong> ${reservation.id}</p>
        <p><strong>Guest:</strong> ${reservation.firstName} ${reservation.lastName}</p>
        <p><strong>Email:</strong> ${reservation.email}</p>
        <p><strong>Phone:</strong> ${reservation.phone}</p>
        <p><strong>Branch:</strong> ${reservation.branch}</p>
        <p><strong>Room Type:</strong> ${reservation.roomType}</p>
        <p><strong>Check-in:</strong> ${formatDate(reservation.checkIn)}</p>
        <p><strong>Check-out:</strong> ${formatDate(reservation.checkOut)}</p>
        <p><strong>Guests:</strong> ${reservation.adults} adults, ${reservation.children} children</p>
        <p><strong>Status:</strong> <span class="status-badge ${reservation.status}">${reservation.status}</span></p>
      </div>
    `,
    confirmButtonColor: '#ff9f1c',
    confirmButtonText: 'Close'
  });
}

function modifyReservation(reservationId) {
  Swal.fire({
    title: 'Modify Reservation',
    text: 'What would you like to modify?',
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Change Dates',
    denyButtonText: 'Change Room Type',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff9f1c',
    denyButtonColor: '#17a2b8'
  }).then((result) => {
    if (result.isConfirmed) {
      modifyDates(reservationId);
    } else if (result.isDenied) {
      modifyRoomType(reservationId);
    }
  });
}

function modifyDates(reservationId) {
  Swal.fire({
    title: 'Change Dates',
    html: `
      <div class="row g-3">
        <div class="col-6">
          <label class="form-label">New Check-in Date</label>
          <input type="date" id="newCheckin" class="form-control">
        </div>
        <div class="col-6">
          <label class="form-label">New Check-out Date</label>
          <input type="date" id="newCheckout" class="form-control">
        </div>
      </div>
    `,
    confirmButtonText: 'Update Dates',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff9f1c',
    preConfirm: () => {
      const newCheckin = document.getElementById('newCheckin').value;
      const newCheckout = document.getElementById('newCheckout').value;
      
      if (!newCheckin || !newCheckout) {
        Swal.showValidationMessage('Please select both dates');
        return false;
      }
      
      if (new Date(newCheckout) <= new Date(newCheckin)) {
        Swal.showValidationMessage('Check-out must be after check-in');
        return false;
      }
      
      return { checkin: newCheckin, checkout: newCheckout };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Dates Updated',
        text: 'Reservation dates have been successfully updated.',
        confirmButtonColor: '#ff9f1c'
      });
    }
  });
}

function modifyRoomType(reservationId) {
  Swal.fire({
    title: 'Change Room Type',
    input: 'select',
    inputOptions: {
      standard: 'Standard Room',
      deluxe: 'Deluxe Room',
      suite: 'Suite',
      presidential: 'Presidential Suite'
    },
    inputPlaceholder: 'Select new room type',
    confirmButtonText: 'Update Room Type',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff9f1c',
    inputValidator: (value) => {
      if (!value) {
        return 'Please select a room type';
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Room Type Updated',
        text: `Room type changed to ${result.value}.`,
        confirmButtonColor: '#ff9f1c'
      });
    }
  });
}

function cancelReservation(reservationId) {
  Swal.fire({
    title: 'Cancel Reservation',
    text: 'Are you sure you want to cancel this reservation?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Cancel',
    cancelButtonText: 'No, Keep',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d'
  }).then((result) => {
    if (result.isConfirmed) {
      showLoading(true);
      
      setTimeout(() => {
        showLoading(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Reservation Cancelled',
          text: 'The reservation has been successfully cancelled.',
          confirmButtonColor: '#ff9f1c'
        });
        
        // Update reservation status
        const reservation = sampleData.reservations.find(r => r.id === reservationId);
        if (reservation) {
          reservation.status = 'cancelled';
        }
        
        // Refresh tables
        populateTodaysReservations();
        populatePendingCheckins();
      }, 1000);
    }
  });
}

function extendStay(roomNumber) {
  Swal.fire({
    title: 'Extend Stay',
    html: `
      <div class="text-start">
        <p><strong>Room:</strong> ${roomNumber}</p>
        <label class="form-label">New Check-out Date</label>
        <input type="date" id="extendDate" class="form-control">
      </div>
    `,
    confirmButtonText: 'Extend Stay',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff9f1c',
    preConfirm: () => {
      const extendDate = document.getElementById('extendDate').value;
      if (!extendDate) {
        Swal.showValidationMessage('Please select a new check-out date');
        return false;
      }
      return extendDate;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Stay Extended',
        text: `Check-out date updated to ${formatDate(result.value)}.`,
        confirmButtonColor: '#ff9f1c'
      });
    }
  });
}

function viewGuestBill(roomNumber) {
  const guest = sampleData.currentGuests.find(g => g.room === roomNumber);
  if (!guest) return;
  
  const taxes = Math.round(guest.amount * 0.1);
  const total = guest.amount + taxes;
  
  Swal.fire({
    title: 'Guest Bill',
    html: `
      <div class="text-start">
        <p><strong>Guest:</strong> ${guest.firstName} ${guest.lastName}</p>
        <p><strong>Room:</strong> ${guest.room}</p>
        <p><strong>Stay:</strong> ${formatDate(guest.checkIn)} to ${formatDate(guest.checkOut)}</p>
        <hr>
        <div class="bill-details">
          <div class="bill-item">
            <span>Room Charges (${guest.nights} nights)</span>
            <span>${guest.amount}</span>
          </div>
          <div class="bill-item">
            <span>Taxes (10%)</span>
            <span>${taxes}</span>
          </div>
          <div class="bill-item total">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
    `,
    confirmButtonColor: '#ff9f1c',
    confirmButtonText: 'Print Bill'
  });
}

function refreshReservations() {
  showLoading(true);
  setTimeout(() => {
    populateTodaysReservations();
    showLoading(false);
    
    Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'Reservations have been refreshed.',
      timer: 1500,
      showConfirmButton: false
    });
  }, 1000);
}

function refreshCurrentGuests() {
  showLoading(true);
  setTimeout(() => {
    populateCurrentGuests();
    showLoading(false);
    
    Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'Current guests list has been refreshed.',
      timer: 1500,
      showConfirmButton: false
    });
  }, 1000);
}

function viewReservationDetails(confirmationId) {
  viewReservation(confirmationId);
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

// Export functions for global access
window.searchReservation = searchReservation;
window.searchGuest = searchGuest;
window.quickCheckout = quickCheckout;
window.finalizeCheckout = finalizeCheckout;
window.processCheckin = processCheckin;
window.viewReservation = viewReservation;
window.modifyReservation = modifyReservation;
window.cancelReservation = cancelReservation;
window.extendStay = extendStay;
window.viewGuestBill = viewGuestBill;
window.refreshReservations = refreshReservations;
window.refreshCurrentGuests = refreshCurrentGuests;
window.viewReservationDetails = viewReservationDetails;
window.logout = logout;
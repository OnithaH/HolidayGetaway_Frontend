// --- CONFIGURATION & MAPPING ---
// Maps frontend branch keys to Backend Database IDs (Check your 'branch' table in MySQL!)
const branchIdMap = {
  "colombo": 1,
  "kandy": 2,
  "galle": 3,
  "nuwara-eliya": 4,
  "ella": 5,
  "sigiriya": 6
};

// Room Type Data
const roomTypes = {
  standard: {
    id: 1,
    type: "Standard Room",
    description: "Comfortable rooms with essential amenities for a pleasant stay",
    base_price: 89
  },
  deluxe: {
    id: 2,
    type: "Deluxe Room", 
    description: "Spacious rooms with enhanced comfort and premium amenities",
    base_price: 129
  },
  suite: {
    id: 3,
    type: "Suite",
    description: "Luxurious suites with separate living area and exclusive services",
    base_price: 199
  },
  presidential: {
    id: 4,
    type: "Presidential Suite",
    description: "Ultimate luxury with panoramic views and personalized butler service",
    base_price: 359
  }
};

// Branch Data (Display Names)
const branches = {
  colombo: "Holiday Getaway Colombo",
  kandy: "Holiday Getaway Kandy", 
  galle: "Holiday Getaway Galle",
  "nuwara-eliya": "Holiday Getaway Nuwara Eliya",
  ella: "Holiday Getaway Ella",
  sigiriya: "Holiday Getaway Sigiriya"
};

// Room Data (Hardcoded Display Data)
// Note: 'id' here should ideally match 'id' in your 'room' database table.
const roomsData = [
  // Colombo Rooms
  {
    id: 101,
    room_number: "101",
    branch_id: "colombo",
    room_type_id: "standard",
    price_per_night: 149,
    status: "available",
    image: "../../../assets/images/rooms/standard-colombo.jpg",
    amenities: ["🛏️ King Bed", "📺 Smart TV", "🌐 WiFi", "☕ Coffee Maker", "❄️ AC"]
  },
  {
    id: 201,
    room_number: "201", 
    branch_id: "colombo",
    room_type_id: "deluxe",
    price_per_night: 189,
    status: "available",
    image: "../../../assets/images/rooms/deluxe-colombo.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Seating Area", "📺 Smart TV", "🌐 WiFi", "🛁 Bathtub", "☕ Minibar"]
  },
  {
    id: 301,
    room_number: "301",
    branch_id: "colombo", 
    room_type_id: "suite",
    price_per_night: 299,
    status: "occupied",
    image: "../../../assets/images/rooms/suite-colombo.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Living Room", "📺 Smart TV", "🌐 WiFi", "🛁 Jacuzzi", "🍾 Minibar", "🏢 City View"]
  },
  {
    id: 401,
    room_number: "401",
    branch_id: "colombo",
    room_type_id: "presidential", 
    price_per_night: 449,
    status: "available",
    image: "../../../assets/images/rooms/presidential-colombo.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Living Room", "🍽️ Dining Area", "📺 Smart TV", "🌐 WiFi", "🛁 Jacuzzi", "🍾 Premium Minibar", "🏢 Panoramic View"]
  },

  // Kandy Rooms
  {
    id: 102,
    room_number: "102",
    branch_id: "kandy",
    room_type_id: "standard",
    price_per_night: 129,
    status: "available", 
    image: "../../../assets/images/rooms/standard-kandy.jpg",
    amenities: ["🛏️ Queen Bed", "📺 TV", "🌐 WiFi", "☕ Tea Set", "❄️ AC", "🏔️ Mountain View"]
  },
  {
    id: 202,
    room_number: "202",
    branch_id: "kandy",
    room_type_id: "deluxe",
    price_per_night: 169,
    status: "maintenance",
    image: "../../../assets/images/rooms/deluxe-kandy.jpg", 
    amenities: ["🛏️ King Bed", "🛋️ Balcony", "📺 Smart TV", "🌐 WiFi", "🛁 Bathtub", "🏛️ Temple View"]
  },
  {
    id: 302,
    room_number: "302",
    branch_id: "kandy",
    room_type_id: "suite",
    price_per_night: 249,
    status: "available",
    image: "../../../assets/images/rooms/suite-kandy.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Living Area", "📺 Smart TV", "🌐 WiFi", "🛁 Jacuzzi", "🚤 Lake View", "🎭 Cultural Decor"]
  },

  // Galle Rooms  
  {
    id: 103,
    room_number: "103",
    branch_id: "galle",
    room_type_id: "standard",
    price_per_night: 179,
    status: "available",
    image: "../../../assets/images/rooms/standard-galle.jpg",
    amenities: ["🛏️ Queen Bed", "📺 TV", "🌐 WiFi", "☕ Coffee Maker", "❄️ AC", "🌊 Ocean Breeze"]
  },
  {
    id: 203,
    room_number: "203", 
    branch_id: "galle",
    room_type_id: "deluxe",
    price_per_night: 219,
    status: "occupied",
    image: "../../../assets/images/rooms/deluxe-galle.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Sea Balcony", "📺 Smart TV", "🌐 WiFi", "🛁 Bathtub", "🌅 Ocean View"]
  },
  {
    id: 303,
    room_number: "303",
    branch_id: "galle", 
    room_type_id: "suite",
    price_per_night: 329,
    status: "available",
    image: "../../../assets/images/rooms/suite-galle.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Living Room", "📺 Smart TV", "🌐 WiFi", "🛁 Jacuzzi", "🏖️ Private Beach Access", "🌅 Sunset View"]
  },

  // Nuwara Eliya Rooms
  {
    id: 104,
    room_number: "104",
    branch_id: "nuwara-eliya",
    room_type_id: "standard", 
    price_per_night: 109,
    status: "available",
    image: "../../../assets/images/rooms/standard-nuwara.jpg",
    amenities: ["🛏️ Twin Beds", "📺 TV", "🌐 WiFi", "☕ Tea Station", "🔥 Fireplace", "🍃 Garden View"]
  },
  {
    id: 204,
    room_number: "204",
    branch_id: "nuwara-eliya",
    room_type_id: "deluxe",
    price_per_night: 149,
    status: "available",
    image: "../../../assets/images/rooms/deluxe-nuwara.jpg", 
    amenities: ["🛏️ King Bed", "🛋️ Reading Nook", "📺 Smart TV", "🌐 WiFi", "🛁 Bathtub", "🏔️ Hill View", "🍃 Tea Plantation"]
  },

  // Ella Rooms
  {
    id: 105,
    room_number: "105", 
    branch_id: "ella",
    room_type_id: "standard",
    price_per_night: 119,
    status: "available",
    image: "../../../assets/images/rooms/standard-ella.jpg",
    amenities: ["🛏️ Queen Bed", "📺 TV", "🌐 WiFi", "☕ Coffee Set", "❄️ AC", "🌄 Valley View"]
  },
  {
    id: 205,
    room_number: "205",
    branch_id: "ella",
    room_type_id: "deluxe", 
    price_per_night: 159,
    status: "occupied",
    image: "../../../assets/images/rooms/deluxe-ella.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Mountain Balcony", "📺 Smart TV", "🌐 WiFi", "🛁 Bathtub", "🌄 Sunrise View"]
  },

  // Sigiriya Rooms
  {
    id: 106,
    room_number: "106",
    branch_id: "sigiriya",
    room_type_id: "standard",
    price_per_night: 139,
    status: "available",
    image: "../../../assets/images/rooms/standard-sigiriya.jpg",
    amenities: ["🛏️ Queen Bed", "📺 TV", "🌐 WiFi", "☕ Coffee Maker", "❄️ AC", "🏛️ Rock View"]
  },
  {
    id: 206,
    room_number: "206", 
    branch_id: "sigiriya",
    room_type_id: "deluxe",
    price_per_night: 179,
    status: "available",
    image: "../../../assets/images/rooms/deluxe-sigiriya.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Heritage Balcony", "📺 Smart TV", "🌐 WiFi", "🛁 Bathtub", "🏛️ Ancient View", "🎨 Cultural Art"]
  },
  {
    id: 306,
    room_number: "306",
    branch_id: "sigiriya",
    room_type_id: "suite",
    price_per_night: 279,
    status: "available", 
    image: "../../../assets/images/rooms/suite-sigiriya.jpg",
    amenities: ["🛏️ King Bed", "🛋️ Living Area", "📺 Smart TV", "🌐 WiFi", "🛁 Jacuzzi", "🏛️ Fortress View", "🦌 Safari Access"]
  }
];

// Global variables for filtering
let filteredRooms = [...roomsData];
let currentFilters = {
  branch: '',
  roomType: '', 
  price: ''
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  displayRooms(roomsData);
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Filter change listeners
  const branchFilter = document.getElementById('branchFilter');
  const roomTypeFilter = document.getElementById('roomTypeFilter');
  const priceFilter = document.getElementById('priceFilter');

  if (branchFilter) branchFilter.addEventListener('change', handleFilterChange);
  if (roomTypeFilter) roomTypeFilter.addEventListener('change', handleFilterChange);
  if (priceFilter) priceFilter.addEventListener('change', handleFilterChange);
  
  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
}

// Handle filter changes
function handleFilterChange() {
  currentFilters.branch = document.getElementById('branchFilter').value;
  currentFilters.roomType = document.getElementById('roomTypeFilter').value;
  currentFilters.price = document.getElementById('priceFilter').value;
  
  filterRooms();
}

// Filter rooms function
function filterRooms() {
  showLoading();
  
  setTimeout(() => {
    filteredRooms = roomsData.filter(room => {
      // Branch filter
      if (currentFilters.branch && room.branch_id !== currentFilters.branch) {
        return false;
      }
      
      // Room type filter  
      if (currentFilters.roomType && room.room_type_id !== currentFilters.roomType) {
        return false;
      }
      
      // Price filter
      if (currentFilters.price) {
        const price = room.price_per_night;
        switch (currentFilters.price) {
          case '0-100':
            if (price > 100) return false;
            break;
          case '100-200':
            if (price < 100 || price > 200) return false;
            break;
          case '200-300':
            if (price < 200 || price > 300) return false;
            break;
          case '300+':
            if (price < 300) return false;
            break;
        }
      }
      
      return true;
    });
    
    displayRooms(filteredRooms);
  }, 300); // Reduced delay for better UX
}

// Display rooms
function displayRooms(rooms) {
  const container = document.getElementById('roomsContainer');
  
  if (!container) return; // Guard clause

  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="no-results">
          <h3>No rooms found</h3>
          <p>Try adjusting your filters to see more options.</p>
          <button class="btn btn-primary mt-2" onclick="clearFilters()">Clear Filters</button>
        </div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = rooms.map(room => createRoomCard(room)).join('');
}

// Create room card HTML
function createRoomCard(room) {
  const roomType = roomTypes[room.room_type_id];
  const branchName = branches[room.branch_id];
  const statusClass = room.status === 'available' ? 'available' : 
                      room.status === 'occupied' ? 'occupied' : 'maintenance';
  
  const isBookable = room.status === 'available';
  
  return `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="room-card h-100 shadow-sm">
        <div class="room-image-container position-relative">
          <img src="${room.image}" alt="${roomType.type}" class="room-image w-100" style="height: 200px; object-fit: cover;">
          <div class="room-type-badge position-absolute top-0 start-0 m-2 badge bg-primary">${roomType.type}</div>
          <div class="room-status ${statusClass} position-absolute top-0 end-0 m-2 badge">${room.status.toUpperCase()}</div>
        </div>
        
        <div class="room-details p-3">
          <h4>${roomType.type}</h4>
          <p class="room-branch text-muted"><i class="fas fa-map-marker-alt"></i> ${branchName}</p>
          <p class="room-description small text-secondary">${roomType.description}</p>
          
          <div class="room-amenities mb-3">
            ${room.amenities.map(amenity => `<span class="badge bg-light text-dark me-1 mb-1 border">${amenity}</span>`).join('')}
          </div>
          
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <div class="room-price">
              <span class="price h5 text-primary">$${room.price_per_night}</span>
              <span class="per-night small text-muted">/night</span>
              <div class="room-number small text-muted">Room ${room.room_number}</div>
            </div>
            
            <div class="room-actions d-flex gap-2">
              <button class="btn btn-outline-info btn-sm" onclick="viewRoomDetails('${room.id}')">
                Details
              </button>
              <button class="btn btn-primary btn-sm ${!isBookable ? 'disabled' : ''}" 
                      onclick="bookRoom('${room.id}')" 
                      ${!isBookable ? 'disabled' : ''}>
                ${isBookable ? 'Book' : 'N/A'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Show loading state
function showLoading() {
  const container = document.getElementById('roomsContainer');
  if(container) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }
}

// Clear all filters
function clearFilters() {
  const branch = document.getElementById('branchFilter');
  const type = document.getElementById('roomTypeFilter');
  const price = document.getElementById('priceFilter');

  if(branch) branch.value = '';
  if(type) type.value = '';
  if(price) price.value = '';
  
  currentFilters = { branch: '', roomType: '', price: '' };
  displayRooms(roomsData);
}

// View room details
function viewRoomDetails(roomId) {
  const room = roomsData.find(r => r.id == roomId);
  if (!room) return;
  
  const roomType = roomTypes[room.room_type_id];
  const branchName = branches[room.branch_id];
  
  Swal.fire({
    title: roomType.type,
    html: `
      <div class="text-start">
        <p><strong>Location:</strong> ${branchName}</p>
        <p><strong>Room Number:</strong> ${room.room_number}</p>
        <p><strong>Price:</strong> $${room.price_per_night}/night</p>
        <p><strong>Status:</strong> <span class="badge bg-${room.status === 'available' ? 'success' : room.status === 'occupied' ? 'danger' : 'warning'}">${room.status.toUpperCase()}</span></p>
        <p class="mt-2"><strong>Description:</strong><br>${roomType.description}</p>
        <div class="mt-3">
          <strong>Amenities:</strong>
          <div class="d-flex flex-wrap gap-1 mt-2">
            ${room.amenities.map(amenity => `<span class="badge bg-light text-dark border">${amenity}</span>`).join('')}
          </div>
        </div>
      </div>
    `,
    imageUrl: room.image,
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: roomType.type,
    showCloseButton: true,
    showCancelButton: room.status === 'available',
    confirmButtonText: room.status === 'available' ? 'Book This Room' : 'Close',
    cancelButtonText: 'Close',
    confirmButtonColor: '#ff9f1c',
    cancelButtonColor: '#6c757d'
  }).then((result) => {
    if (result.isConfirmed && room.status === 'available') {
      bookRoom(roomId);
    }
  });
}

// --- BOOKING LOGIC (CONNECTED TO BACKEND IDS) ---
function bookRoom(roomId) {
  // 1. Find Room Data
  const room = roomsData.find(r => r.id == roomId);
  if (!room || room.status !== 'available') {
    Swal.fire({
      title: 'Unavailable',
      text: 'This room is not available for booking.',
      icon: 'error',
      confirmButtonColor: '#ff9f1c'
    });
    return;
  }
  
  const roomType = roomTypes[room.room_type_id];
  const branchName = branches[room.branch_id];

  // 2. Map Frontend String ID to Backend Integer ID
  // This ensures the backend receives "1" instead of "colombo"
  const realBranchId = branchIdMap[room.branch_id] || 1; 
  // Ensure Room ID is an integer
  const realRoomId = parseInt(room.id); 

  Swal.fire({
    title: 'Book Room',
    html: `
      <div class="text-start">
        <h5>${roomType.type} - Room ${room.room_number}</h5>
        <p><strong>Location:</strong> ${branchName}</p>
        <p class="h4 text-primary mt-2">$${room.price_per_night}<small class="text-muted">/night</small></p>
        <hr>
        <p class="small text-muted">Proceed to reservation to select dates.</p>
      </div>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Proceed',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff9f1c',
    cancelButtonColor: '#6c757d'
  }).then((result) => {
    if (result.isConfirmed) {
      // 3. Save Data for Reservation Page
      // This object structure is exactly what reservation.js expects
      sessionStorage.setItem('selectedRoom', JSON.stringify({
        roomId: realRoomId,       // Integer ID for DB
        roomNumber: room.room_number,
        branchId: realBranchId,   // Integer ID for DB
        branchName: branchName,
        roomType: roomType.type,
        price: room.price_per_night
      }));
      
      // 4. Redirect
      window.location.href = '../reservation/reservation.html';
    }
  });
}

// Newsletter form handler
function handleNewsletterSubmit(e) {
  e.preventDefault();
  
  const emailInput = e.target.querySelector('input[type="email"]');
  const email = emailInput.value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subscribing...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    Swal.fire({
      title: 'Subscribed!',
      text: `We'll send updates to ${email}`,
      icon: 'success',
      confirmButtonColor: '#ff9f1c',
      timer: 2000,
      showConfirmButton: false
    });
    
    e.target.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

// Logout function
function logout() {
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Logout',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');
      
      Swal.fire({
        title: 'Logged Out',
        timer: 1000,
        showConfirmButton: false,
        icon: 'success'
      }).then(() => {
        window.location.href = '../../../index.html';
      });
    }
  });
}

// Export for global access
window.filterRooms = filterRooms;
window.clearFilters = clearFilters;
window.viewRoomDetails = viewRoomDetails;
window.bookRoom = bookRoom;
window.logout = logout;

console.log('Holiday Getaway Rooms page initialized successfully!');
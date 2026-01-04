// Room Type Data based on ER diagram
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

// Branch Data
const branches = {
  colombo: "Holiday Getaway Colombo",
  kandy: "Holiday Getaway Kandy", 
  galle: "Holiday Getaway Galle",
  "nuwara-eliya": "Holiday Getaway Nuwara Eliya",
  ella: "Holiday Getaway Ella",
  sigiriya: "Holiday Getaway Sigiriya"
};

// Room Data based on ER diagram structure
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
  document.getElementById('branchFilter').addEventListener('change', handleFilterChange);
  document.getElementById('roomTypeFilter').addEventListener('change', handleFilterChange);
  document.getElementById('priceFilter').addEventListener('change', handleFilterChange);
  
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
  }, 500);
}

// Display rooms
function displayRooms(rooms) {
  const container = document.getElementById('roomsContainer');
  
  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="no-results">
          <h3>No rooms found</h3>
          <p>Try adjusting your filters to see more options.</p>
          <button class="btn" onclick="clearFilters()">Clear Filters</button>
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
    <div class="col-lg-4 col-md-6">
      <div class="room-card">
        <div class="room-image-container">
          <img src="${room.image}" alt="${roomType.type}" class="room-image">
          <div class="room-type-badge">${roomType.type}</div>
          <div class="room-status ${statusClass}">${room.status}</div>
        </div>
        
        <div class="room-details">
          <h4>${roomType.type}</h4>
          <p class="room-branch">📍 ${branchName}</p>
          <p class="room-description">${roomType.description}</p>
          
          <div class="room-amenities">
            ${room.amenities.map(amenity => `<span class="room-amenity">${amenity}</span>`).join('')}
          </div>
          
          <div class="room-price-section">
            <div class="room-price">
              <span class="price">${room.price_per_night}</span>
              <span class="per-night">/night</span>
            </div>
            <div class="room-number">Room ${room.room_number}</div>
          </div>
          
          <div class="room-actions">
            <button class="btn btn-view" onclick="viewRoomDetails('${room.id}')">
              View Details
            </button>
            <button class="btn btn-book ${!isBookable ? 'disabled' : ''}" 
                    onclick="bookRoom('${room.id}')" 
                    ${!isBookable ? 'disabled' : ''}>
              ${isBookable ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Show loading state
function showLoading() {
  const container = document.getElementById('roomsContainer');
  container.innerHTML = `
    <div class="col-12">
      <div class="loading-state">
        <div class="loading-spinner"></div>
      </div>
    </div>
  `;
}

// Clear all filters
function clearFilters() {
  document.getElementById('branchFilter').value = '';
  document.getElementById('roomTypeFilter').value = '';
  document.getElementById('priceFilter').value = '';
  
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
        <p><strong>Price:</strong> ${room.price_per_night}/night</p>
        <p><strong>Status:</strong> <span class="badge bg-${room.status === 'available' ? 'success' : room.status === 'occupied' ? 'danger' : 'warning'}">${room.status}</span></p>
        <p><strong>Description:</strong> ${roomType.description}</p>
        <div class="mt-3">
          <strong>Amenities:</strong>
          <div class="d-flex flex-wrap gap-1 mt-2">
            ${room.amenities.map(amenity => `<span class="badge bg-light text-dark">${amenity}</span>`).join('')}
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

// Book room
function bookRoom(roomId) {
  const room = roomsData.find(r => r.id == roomId);
  if (!room || room.status !== 'available') {
    Swal.fire({
      title: 'Booking Unavailable',
      text: 'This room is not available for booking at the moment.',
      icon: 'error',
      confirmButtonText: 'Okay',
      confirmButtonColor: '#ff9f1c'
    });
    return;
  }
  
  const roomType = roomTypes[room.room_type_id];
  const branchName = branches[room.branch_id];
  
  Swal.fire({
    title: 'Book Room',
    html: `
      <div class="text-start">
        <h5>${roomType.type} - Room ${room.room_number}</h5>
        <p><strong>Location:</strong> ${branchName}</p>
        <p><strong>Price:</strong> ${room.price_per_night}/night</p>
        <hr>
        <p>You will be redirected to the reservation page to complete your booking.</p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Continue to Booking',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff9f1c',
    cancelButtonColor: '#6c757d'
  }).then((result) => {
    if (result.isConfirmed) {
      // Store room info for reservation page
      sessionStorage.setItem('selectedRoom', JSON.stringify({
        roomId: room.id,
        roomNumber: room.room_number,
        roomType: roomType.type,
        branch: room.branch_id,
        branchName: branchName,
        price: room.price_per_night
      }));
      
      // Redirect to reservation page
      window.location.href = '../reservation/reservation.html';
    }
  });
}

// Newsletter form handler
function handleNewsletterSubmit(e) {
  e.preventDefault();
  
  const email = e.target.querySelector('input[type="email"]').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Show loading state
  const originalText = submitBtn.textContent;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subscribing...';
  submitBtn.disabled = true;
  
  // Simulate subscription process
  setTimeout(() => {
    Swal.fire({
      title: 'Successfully Subscribed!',
      text: `Thank you for subscribing to Holiday Getaway updates! You'll receive exclusive offers at ${email}`,
      icon: 'success',
      confirmButtonText: 'Great!',
      confirmButtonColor: '#ff9f1c'
    });
    
    e.target.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 2000);
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
// Export for global access
window.filterRooms = filterRooms;
window.clearFilters = clearFilters;
window.viewRoomDetails = viewRoomDetails;
window.bookRoom = bookRoom;

console.log('Holiday Getaway Rooms page initialized successfully!');
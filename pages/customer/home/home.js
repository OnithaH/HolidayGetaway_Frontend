const branchData = {
  colombo: {
    name: "Holiday Getaway Colombo",
    description: "Located in the heart of Sri Lanka's commercial capital, perfect for business travelers and urban explorers. Walking distance to major shopping centers and business districts.",
    features: ["🏢 Business Center", "🛍️ Shopping Access", "✈️ Airport Shuttle", "🌆 City Views", "🍽️ Rooftop Dining"],
    availableRooms: "28",
    startingPrice: "$149/night",
    image: "../../../assets/images/locations/colombo.jpg" // Adjusted path for pages/customer/home
  },
  kandy: {
    name: "Holiday Getaway Kandy",
    description: "Immerse yourself in Sri Lanka's cultural heart with views of the sacred Temple of the Tooth and beautiful Kandy Lake. Rich heritage and serene landscapes await.",
    features: ["🏛️ Temple Access", "🚤 Lake Views", "🎭 Cultural Shows", "🌸 Royal Gardens", "🎨 Art Gallery"],
    availableRooms: "22",
    startingPrice: "$129/night",
    image: "../../../assets/images/locations/kandy.jpg"
  },
  galle: {
    name: "Holiday Getaway Galle",
    description: "Beachfront paradise combining colonial charm with modern luxury. Steps away from the UNESCO World Heritage Galle Fort and pristine beaches.",
    features: ["🏖️ Private Beach", "🏄 Water Sports", "🌅 Ocean Views", "🏰 Fort Access", "🐠 Diving Center"],
    availableRooms: "35",
    startingPrice: "$199/night",
    image: "../../../assets/images/locations/galle.jpg"
  },
  "nuwara-eliya": {
    name: "Holiday Getaway Nuwara Eliya",
    description: "Escape to the cool climate of Sri Lanka's hill country. Surrounded by tea plantations and colonial architecture in 'Little England'.",
    features: ["🍃 Tea Tours", "🏔️ Mountain Views", "🌡️ Cool Climate", "🚂 Train Station", "🏌️ Golf Course"],
    availableRooms: "18",
    startingPrice: "$109/night",
    image: "../../../assets/images/locations/nuwara-eliya.jpg"
  },
  ella: {
    name: "Holiday Getaway Ella",
    description: "Adventure seeker's paradise nestled in the mountains. Famous for hiking trails, scenic train rides, and breathtaking sunrise views.",
    features: ["🥾 Hiking Trails", "🚂 Train Rides", "🌄 Sunrise Views", "🐒 Wildlife", "☕ Coffee Tours"],
    availableRooms: "15",
    startingPrice: "$119/night",
    image: "../../../assets/images/locations/ella.jpg"
  },
  sigiriya: {
    name: "Holiday Getaway Sigiriya",
    description: "Experience ancient wonders and wildlife adventures. Gateway to the famous Sigiriya Rock Fortress and Dambulla Cave Temples.",
    features: ["🏛️ Ancient Sites", "🦌 Safari Access", "🎨 Cave Paintings", "🌳 Nature Walks", "🦅 Bird Watching"],
    availableRooms: "20",
    startingPrice: "$139/night",
    image: "../../../assets/images/locations/sigiriya.jpg"
  }
};

// Update branch information when selection changes
function updateBranchInfo() {
  const select = document.getElementById('branchSelect');
  const display = document.getElementById('branchInfoDisplay');
  const branchValue = select.value;
  
  if (branchValue && branchData[branchValue]) {
    const branch = branchData[branchValue];
    
    // Update content
    document.getElementById('branchName').textContent = branch.name;
    document.getElementById('branchDescription').textContent = branch.description;
    document.getElementById('availableRooms').textContent = branch.availableRooms;
    document.getElementById('startingPrice').textContent = branch.startingPrice;
    
    // Update features
    const featuresContainer = document.getElementById('branchFeatures');
    featuresContainer.innerHTML = '';
    branch.features.forEach(feature => {
      const featureSpan = document.createElement('span');
      featureSpan.className = 'branch-feature';
      featureSpan.textContent = feature;
      featuresContainer.appendChild(featureSpan);
    });
    
    // Show the display with animation
    display.style.display = 'block';
    display.classList.add('show');
    
    // Store selected branch for form submission
    sessionStorage.setItem('selectedBranch', branchValue);
    
  } else {
    display.style.display = 'none';
    display.classList.remove('show');
    sessionStorage.removeItem('selectedBranch');
  }
}

// Handle hero branch button clicks
document.addEventListener('DOMContentLoaded', function() {
  // Check Login Status for Navbar (Optional Enhancement)
  const user = localStorage.getItem('customerUser');
  if(user) {
      console.log("User is logged in");
      // You could update UI here if needed
  }

  // Set minimum dates for booking form
  const today = new Date().toISOString().split('T')[0];
  const arrivalInput = document.getElementById('arrivalDate');
  const departureInput = document.getElementById('departureDate');

  if(arrivalInput && departureInput) {
      arrivalInput.min = today;
      departureInput.min = today;
      
      // Handle arrival date change
      arrivalInput.addEventListener('change', function() {
        const arrivalDate = new Date(this.value);
        const nextDay = new Date(arrivalDate);
        nextDay.setDate(arrivalDate.getDate() + 1);
        
        departureInput.min = nextDay.toISOString().split('T')[0];
        
        // Clear departure date if it's before new minimum
        if (departureInput.value && new Date(departureInput.value) <= arrivalDate) {
          departureInput.value = '';
        }
      });
  }
  
  // Handle hero branch button clicks
  const branchButtons = document.querySelectorAll('.branch-btn[data-branch]');
  branchButtons.forEach(button => {
    button.addEventListener('click', function() {
      const branchValue = this.getAttribute('data-branch');
      
      if (branchValue === 'all') {
        // Scroll to locations section
        document.querySelector('.featured-locations').scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        // Select the branch and scroll to booking form
        const select = document.getElementById('branchSelect');
        if(select) {
            select.value = branchValue;
            updateBranchInfo();
            
            // Scroll to booking form
            document.querySelector('.booking-form').scrollIntoView({
              behavior: 'smooth'
            });
        }
        
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      }
    });
  });
  
  // Handle quick booking form submission
  const bookingForm = document.getElementById('quickBookingForm');
  if (bookingForm) {
      bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedBranch = document.getElementById('branchSelect').value;
        const arrivalDate = document.getElementById('arrivalDate').value;
        const departureDate = document.getElementById('departureDate').value;
        const adults = document.getElementById('adults').value;
        const children = document.getElementById('children').value;
        
        if (!selectedBranch) {
          Swal.fire('Missing Info', 'Please select a location.', 'warning');
          return;
        }
        
        if (!arrivalDate || !departureDate) {
          Swal.fire('Missing Dates', 'Please select arrival and departure dates.', 'warning');
          return;
        }
        
        // Store booking parameters
        const bookingParams = {
          branch: selectedBranch,
          arrival: arrivalDate,
          departure: departureDate,
          adults: adults !== 'Adults' ? adults : '2',
          children: children !== 'Children' ? children : '0'
        };
        
        sessionStorage.setItem('bookingParams', JSON.stringify(bookingParams));
        
        // Redirect to ROOMS page first to pick a room type
        // IMPORTANT: The path assumes this file is in pages/customer/home/
        window.location.href = '../rooms/rooms.html'; 
      });
  }
  
  // Add smooth scrolling for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Newsletter form handling
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const submitBtn = this.querySelector('button[type="submit"]');
      
      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subscribing...';
      submitBtn.disabled = true;
      
      // Simulate subscription process
      setTimeout(() => {
        Swal.fire('Subscribed!', `Updates will be sent to ${email}`, 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
  
  // Initialize any saved branch selection
  const savedBranch = sessionStorage.getItem('selectedBranch');
  if (savedBranch) {
    const select = document.getElementById('branchSelect');
    if(select) {
        select.value = savedBranch;
        updateBranchInfo();
    }
  }
  
  console.log('Holiday Getaway Chain home page initialized successfully!');
});

// Global functions for external access
window.updateBranchInfo = updateBranchInfo;

// Logout function
function logout() {
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear Data
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');
      sessionStorage.clear();

      Swal.fire({
        title: 'Logged Out',
        timer: 1000,
        showConfirmButton: false,
        icon: 'success'
      }).then(() => {
        window.location.href = '../../../index.html'; // Go back to Landing Page
      });
    }
  });
}

// Export for other pages
window.HolidayGetawayChain = {
  branchData
};
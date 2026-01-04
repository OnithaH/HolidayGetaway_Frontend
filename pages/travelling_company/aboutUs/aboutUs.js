// About Us Page JavaScript

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeCounters();
  setupScrollAnimations();
  setupNewsletterForm();
  
  console.log('Holiday Getaway About Us page initialized successfully!');
});

// Counter Animation for Stats Section
function initializeCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const options = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, options);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Animate individual counter
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    // Format number with commas for large numbers
    element.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// Setup scroll animations
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.mission-card, .vision-card, .value-item, .team-member');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        // Add staggered delay for multiple elements
        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
        entry.target.style.animationDelay = `${delay}ms`;
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    scrollObserver.observe(element);
  });
}

// Setup newsletter form
function setupNewsletterForm() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', handleNewsletterSubmit);
  });
}

// Handle newsletter form submission
function handleNewsletterSubmit(e) {
  e.preventDefault();
  
  const email = e.target.querySelector('input[type="email"]').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Validate email
  if (!isValidEmail(email)) {
    showAlert('Please enter a valid email address.', 'error');
    return;
  }
  
  // Show loading state
  const originalText = submitBtn.textContent;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subscribing...';
  submitBtn.disabled = true;
  
  // Simulate subscription process
  setTimeout(() => {
    showAlert(`Thank you for subscribing! You'll receive our latest updates at ${email}`, 'success');
    e.target.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show alert using SweetAlert2
function showAlert(message, type) {
  Swal.fire({
    title: type === 'success' ? 'Success!' : 'Error!',
    text: message,
    icon: type,
    confirmButtonText: 'Okay',
    confirmButtonColor: '#ff9f1c',
    timer: type === 'success' ? 3000 : null,
    timerProgressBar: true
  });
}

// Smooth scrolling for internal links
function setupSmoothScrolling() {
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
}

// Team member interaction effects
function setupTeamInteractions() {
  const teamMembers = document.querySelectorAll('.team-member');
  
  teamMembers.forEach(member => {
    member.addEventListener('mouseenter', function() {
      // Add hover effect
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    member.addEventListener('mouseleave', function() {
      // Reset transform
      this.style.transform = '';
    });
    
    member.addEventListener('click', function() {
      const name = this.querySelector('h5').textContent;
      const role = this.querySelector('.team-role').textContent;
      const bio = this.querySelector('.team-bio').textContent;
      
      showTeamMemberModal(name, role, bio);
    });
  });
}

// Show team member modal
function showTeamMemberModal(name, role, bio) {
  Swal.fire({
    title: name,
    html: `
      <div class="text-start">
        <p><strong>Position:</strong> ${role}</p>
        <p><strong>About:</strong> ${bio}</p>
        <hr>
        <p class="text-muted">Connect with ${name.split(' ')[0]} to learn more about Holiday Getaway's commitment to excellence.</p>
      </div>
    `,
    confirmButtonText: 'Close',
    confirmButtonColor: '#ff9f1c',
    showCloseButton: true,
    width: 500
  });
}

// Initialize additional features
function initializeAdditionalFeatures() {
  setupSmoothScrolling();
  setupTeamInteractions();
  
  // Add parallax effect to page header (optional)
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.page-header');
    
    if (header && scrolled < header.offsetHeight) {
      header.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

// Call additional features after DOM load
document.addEventListener('DOMContentLoaded', function() {
  // Delay additional features to ensure all content is loaded
  setTimeout(initializeAdditionalFeatures, 100);
});

// Utility functions
const AboutUtils = {
  // Format numbers with commas
  formatNumber: function(num) {
    return num.toLocaleString();
  },
  
  // Get current year for copyright
  getCurrentYear: function() {
    return new Date().getFullYear();
  },
  
  // Debounce function for scroll events
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};


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


// Export for use in other scripts if needed
window.AboutUsPage = {
  initializeCounters,
  setupScrollAnimations,
  showAlert,
  Utils: AboutUtils
};

// Add loading state management
window.addEventListener('load', function() {
  // Hide any loading states
  document.body.classList.add('loaded');
  
  // Initialize any lazy-loaded content
  initializeLazyContent();
});

function initializeLazyContent() {
  // Placeholder for any lazy-loaded content initialization
  console.log('All content loaded successfully!');
}

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    img.addEventListener('error', function() {
      // Replace broken images with placeholder
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEwxMDAgMTI1TDc1IDEwMEwxMDAgNzVaIiBmaWxsPSIjREREIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlPC90ZXh0Pgo8L3N2Zz4=';
      this.alt = 'Image not available';
    });
  });
});
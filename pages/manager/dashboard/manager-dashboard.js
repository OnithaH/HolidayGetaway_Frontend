// Manager Dashboard JavaScript

// Sample Data
const sampleData = {
  occupancy: [
    { date: '2024-06-01', branch: 'Colombo', occupied: 28, available: 35, rate: 80 },
    { date: '2024-06-01', branch: 'Kandy', occupied: 18, available: 25, rate: 72 },
    { date: '2024-06-01', branch: 'Galle', occupied: 32, available: 40, rate: 80 },
    { date: '2024-06-02', branch: 'Colombo', occupied: 30, available: 35, rate: 86 },
    { date: '2024-06-02', branch: 'Kandy', occupied: 20, available: 25, rate: 80 },
    { date: '2024-06-02', branch: 'Galle', occupied: 35, available: 40, rate: 88 },
    { date: '2024-06-03', branch: 'Colombo', occupied: 25, available: 35, rate: 71 },
    { date: '2024-06-03', branch: 'Kandy', occupied: 15, available: 25, rate: 60 },
    { date: '2024-06-03', branch: 'Galle', occupied: 28, available: 40, rate: 70 }
  ],
  
  financial: [
    { branch: 'Colombo', revenue: 42500, bookings: 120, avgRate: 149, growth: 12.5 },
    { branch: 'Kandy', revenue: 18900, bookings: 85, avgRate: 129, growth: 8.3 },
    { branch: 'Galle', revenue: 38750, bookings: 98, avgRate: 199, growth: 15.2 },
    { branch: 'Nuwara Eliya', revenue: 12300, bookings: 56, avgRate: 109, growth: 5.8 },
    { branch: 'Ella', revenue: 8950, bookings: 42, avgRate: 119, growth: 9.1 },
    { branch: 'Sigiriya', revenue: 16800, bookings: 67, avgRate: 139, growth: 7.4 }
  ],
  
  projections: [
    { date: '2024-06-15', occupancy: 85, revenue: 45200, confidence: 'High' },
    { date: '2024-06-16', occupancy: 78, revenue: 42800, confidence: 'High' },
    { date: '2024-06-17', occupancy: 92, revenue: 48900, confidence: 'Medium' },
    { date: '2024-06-18', occupancy: 88, revenue: 46500, confidence: 'High' },
    { date: '2024-06-19', occupancy: 95, revenue: 51200, confidence: 'Medium' },
    { date: '2024-06-20', occupancy: 82, revenue: 44300, confidence: 'High' },
    { date: '2024-06-21', occupancy: 89, revenue: 47800, confidence: 'Medium' }
  ],
  
  recentBookings: [
    { guest: 'John Smith', branch: 'Colombo', checkin: '2024-06-12', amount: 298, status: 'confirmed' },
    { guest: 'Sarah Johnson', branch: 'Galle', checkin: '2024-06-13', amount: 456, status: 'confirmed' },
    { guest: 'Michael Chen', branch: 'Kandy', checkin: '2024-06-14', amount: 189, status: 'pending' },
    { guest: 'Emma Wilson', branch: 'Ella', checkin: '2024-06-15', amount: 267, status: 'confirmed' },
    { guest: 'David Brown', branch: 'Sigiriya', checkin: '2024-06-16', amount: 345, status: 'confirmed' },
    { guest: 'Lisa Anderson', branch: 'Colombo', checkin: '2024-06-17', amount: 412, status: 'pending' },
    { guest: 'James Taylor', branch: 'Galle', checkin: '2024-06-18', amount: 523, status: 'confirmed' }
  ]
};

// Chart instances
let occupancyChart = null;
let revenueChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  initializeDateInputs();
  loadInitialData();
  initializeCharts();
  setupEventListeners();
  
  console.log('Manager Dashboard initialized successfully!');
});

// Initialize date inputs with default values
function initializeDateInputs() {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
  
  document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
  document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
}

// Load initial data into tables
function loadInitialData() {
  populateOccupancyTable();
  populateFinancialTable();
  populateProjectionsTable();
  populateBookingsTable();
  updateMetrics();
}

// Setup event listeners
function setupEventListeners() {
  // Chart period buttons
  document.querySelectorAll('.chart-controls .btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.chart-controls .btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      updateOccupancyChart(this.dataset.period);
    });
  });
}

// Initialize charts
function initializeCharts() {
  initializeOccupancyChart();
  initializeRevenueChart();
}

// Initialize occupancy trend chart
function initializeOccupancyChart() {
  const ctx = document.getElementById('occupancyChart').getContext('2d');
  
  const labels = ['Jun 1', 'Jun 2', 'Jun 3', 'Jun 4', 'Jun 5', 'Jun 6', 'Jun 7'];
  const colomboData = [80, 86, 71, 88, 92, 78, 85];
  const kandyData = [72, 80, 60, 75, 82, 70, 77];
  const galleData = [80, 88, 70, 85, 90, 82, 87];
  
  occupancyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Colombo',
          data: colomboData,
          borderColor: '#ff9f1c',
          backgroundColor: 'rgba(255, 159, 28, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Kandy',
          data: kandyData,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Galle',
          data: galleData,
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

// Initialize revenue chart
function initializeRevenueChart() {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  
  revenueChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Colombo', 'Galle', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella'],
      datasets: [{
        data: [42500, 38750, 16800, 18900, 12300, 8950],
        backgroundColor: [
          '#ff9f1c',
          '#e74c3c',
          '#3498db',
          '#2ecc71',
          '#9b59b6',
          '#f39c12'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  });
}

// Update occupancy chart based on period
function updateOccupancyChart(period) {
  // This would fetch new data based on the selected period
  console.log(`Updating occupancy chart for period: ${period}`);
  // For demo purposes, we'll just update the existing chart
}

// Populate occupancy table
function populateOccupancyTable() {
  const tbody = document.getElementById('occupancyTableBody');
  tbody.innerHTML = '';
  
  sampleData.occupancy.forEach(item => {
    const row = `
      <tr>
        <td>${new Date(item.date).toLocaleDateString()}</td>
        <td>${item.branch}</td>
        <td>${item.occupied}</td>
        <td>${item.available}</td>
        <td>
          <span class="badge ${item.rate >= 80 ? 'bg-success' : item.rate >= 60 ? 'bg-warning' : 'bg-danger'}">
            ${item.rate}%
          </span>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Populate financial table
function populateFinancialTable() {
  const tbody = document.getElementById('financialTableBody');
  tbody.innerHTML = '';
  
  sampleData.financial.forEach(item => {
    const row = `
      <tr>
        <td>${item.branch}</td>
        <td>${item.revenue.toLocaleString()}</td>
        <td>${item.bookings}</td>
        <td>${item.avgRate}</td>
        <td>
          <span class="metric-change ${item.growth > 0 ? 'positive' : 'negative'}">
            ${item.growth > 0 ? '+' : ''}${item.growth}%
          </span>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Populate projections table
function populateProjectionsTable() {
  const tbody = document.getElementById('projectionsTableBody');
  tbody.innerHTML = '';
  
  sampleData.projections.forEach(item => {
    const row = `
      <tr>
        <td>${new Date(item.date).toLocaleDateString()}</td>
        <td>${item.occupancy}%</td>
        <td>${item.revenue.toLocaleString()}</td>
        <td>
          <span class="badge ${item.confidence === 'High' ? 'bg-success' : item.confidence === 'Medium' ? 'bg-warning' : 'bg-danger'}">
            ${item.confidence}
          </span>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Populate bookings table
function populateBookingsTable() {
  const tbody = document.getElementById('bookingsTableBody');
  tbody.innerHTML = '';
  
  sampleData.recentBookings.forEach(item => {
    const row = `
      <tr>
        <td>${item.guest}</td>
        <td>${item.branch}</td>
        <td>${new Date(item.checkin).toLocaleDateString()}</td>
        <td>${item.amount}</td>
        <td>
          <span class="status-badge ${item.status}">
            ${item.status}
          </span>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Update metrics
function updateMetrics() {
  // Calculate current occupancy
  const totalOccupied = sampleData.occupancy.reduce((sum, item) => sum + item.occupied, 0);
  const totalAvailable = sampleData.occupancy.reduce((sum, item) => sum + item.available, 0);
  const currentOccupancy = Math.round((totalOccupied / totalAvailable) * 100);
  
  // Calculate total revenue
  const totalRevenue = sampleData.financial.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate total bookings
  const totalBookings = sampleData.financial.reduce((sum, item) => sum + item.bookings, 0);
  
  // Update DOM
  document.getElementById('currentOccupancy').textContent = `${currentOccupancy}%`;
  document.getElementById('totalRevenue').textContent = `${totalRevenue.toLocaleString()}`;
  document.getElementById('totalBookings').textContent = totalBookings;
}

// Generate reports based on filters
function generateReports() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const branch = document.getElementById('branchFilter').value;
  
  if (!startDate || !endDate) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Dates',
      text: 'Please select both start and end dates.',
      confirmButtonColor: '#ff9f1c'
    });
    return;
  }
  
  showLoading(true);
  
  // Simulate API call
  setTimeout(() => {
    showLoading(false);
    
    Swal.fire({
      icon: 'success',
      title: 'Reports Generated',
      text: `Reports generated for ${startDate} to ${endDate}${branch !== 'all' ? ` for ${branch}` : ' for all branches'}.`,
      confirmButtonColor: '#ff9f1c'
    });
    
    // Refresh data
    loadInitialData();
  }, 2000);
}

// Export report function
function exportReport(type) {
  Swal.fire({
    title: 'Export Report',
    text: `Export ${type} report as:`,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'PDF',
    denyButtonText: 'Excel',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff9f1c',
    denyButtonColor: '#28a745'
  }).then((result) => {
    if (result.isConfirmed) {
      exportToPDF(type);
    } else if (result.isDenied) {
      exportToExcel(type);
    }
  });
}

// Export to PDF
function exportToPDF(type) {
  showLoading(true);
  
  setTimeout(() => {
    showLoading(false);
    Swal.fire({
      icon: 'success',
      title: 'PDF Generated',
      text: `${type} report has been exported to PDF.`,
      confirmButtonColor: '#ff9f1c'
    });
  }, 1500);
}

// Export to Excel
function exportToExcel(type) {
  showLoading(true);
  
  setTimeout(() => {
    showLoading(false);
    Swal.fire({
      icon: 'success',
      title: 'Excel Generated',
      text: `${type} report has been exported to Excel.`,
      confirmButtonColor: '#ff9f1c'
    });
  }, 1500);
}

// Show/hide loading overlay
function showLoading(show) {
  const overlay = document.getElementById('loadingOverlay');
  overlay.style.display = show ? 'flex' : 'none';
}

// Refresh bookings
function refreshBookings() {
  showLoading(true);
  
  setTimeout(() => {
    populateBookingsTable();
    showLoading(false);
    
    Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'Booking data has been refreshed.',
      timer: 1500,
      showConfirmButton: false
    });
  }, 1000);
}

// Quick action functions
function generateFullReport() {
  Swal.fire({
    title: 'Generate Full Report',
    text: 'This will generate a comprehensive report including all metrics, occupancy data, and financial information.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Generate',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ff9f1c'
  }).then((result) => {
    if (result.isConfirmed) {
      showLoading(true);
      
      setTimeout(() => {
        showLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Report Generated',
          text: 'Full comprehensive report has been generated and sent to your email.',
          confirmButtonColor: '#ff9f1c'
        });
      }, 3000);
    }
  });
}

function viewAnalytics() {
  Swal.fire({
    title: 'Advanced Analytics',
    text: 'Redirecting to advanced analytics dashboard...',
    icon: 'info',
    timer: 1500,
    showConfirmButton: false
  });
}

function manageBranches() {
  Swal.fire({
    title: 'Branch Management',
    text: 'Redirecting to branch management panel...',
    icon: 'info',
    timer: 1500,
    showConfirmButton: false
  });
}

function viewReservations() {
  Swal.fire({
    title: 'Reservations',
    text: 'Redirecting to reservations management...',
    icon: 'info',
    timer: 1500,
    showConfirmButton: false
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

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Auto-refresh data every 5 minutes
setInterval(() => {
  console.log('Auto-refreshing dashboard data...');
  loadInitialData();
}, 300000);

// Export functions for global access
window.generateReports = generateReports;
window.exportReport = exportReport;
window.refreshBookings = refreshBookings;
window.generateFullReport = generateFullReport;
window.viewAnalytics = viewAnalytics;
window.manageBranches = manageBranches;
window.viewReservations = viewReservations;
window.logout = logout;
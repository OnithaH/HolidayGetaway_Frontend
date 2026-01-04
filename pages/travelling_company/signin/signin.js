
document.getElementById('signinForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Here you would normally validate credentials with your backend
  if (email && password) {
    Swal.fire({
      title: 'Sign In Successful!',
      text: 'Redirecting to home page...',
      icon: 'success',
      confirmButtonText: 'Okay'
    }).then(() => {
      window.location.href = '../home/home.html'; // Redirect to home page
    });
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'Please enter both email and password.',
      icon: 'error',
      confirmButtonText: 'Okay'
    });
  }
});


// Forgot Password Form submission
document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('resetEmail').value;
  
  if (email) {
    alert('Password reset link sent to your email!');
    bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
  }
});
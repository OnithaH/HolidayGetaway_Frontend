// Sign In Form Submission (Local Validation Only)
document.getElementById('signinForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    Swal.fire({
      title: 'Error!',
      text: 'Please enter both email and password.',
      icon: 'error',
      confirmButtonText: 'Okay'
    });
    return;
  }

  // Hardcoded credentials
  const validEmail = 'user@gmail.com';
  const validPassword = 'user123';

  if (email === validEmail && password === validPassword) {
    Swal.fire({
      title: 'Sign In Successful!',
      text: 'Redirecting to home page...',
      icon: 'success',
      confirmButtonText: 'Okay'
    }).then(() => {
      window.location.href = '../home/home.html';
    });
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'Invalid email or password.',
      icon: 'error',
      confirmButtonText: 'Okay'
    });
  }
});

// Forgot Password Form submission (unchanged)
document.getElementById('forgotPasswordForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('resetEmail').value;

  if (email) {
    alert('Password reset link sent to your email!');
    bootstrap.Modal.getInstance(
      document.getElementById('forgotPasswordModal')
    ).hide();
  }
});

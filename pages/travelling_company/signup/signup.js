// Password strength checker
document.getElementById('password').addEventListener('input', function() {
  const password = this.value;
  const indicator = document.getElementById('strengthIndicator');
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  indicator.className = 'strength-indicator';
  if (strength <= 2) indicator.classList.add('strength-weak');
  else if (strength === 3) indicator.classList.add('strength-fair');
  else if (strength === 4) indicator.classList.add('strength-good');
  else indicator.classList.add('strength-strong');
});

// Form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  // Here you would normally send the data to your backend
  alert('Account created successfully! Please check your email for verification.');
  window.location.href = '../signin/signin.html'; // Redirect to sign-in page
});
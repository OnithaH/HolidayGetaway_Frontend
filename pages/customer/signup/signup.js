document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // 1. Get Values from HTML
  const full_name = document.getElementById('full_name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // 2. Validate
  if (password !== confirmPassword) {
    Swal.fire({ title: 'Error', text: 'Passwords do not match', icon: 'error' });
    return;
  }

  try {
    const btn = document.querySelector('button[type="submit"]');
    btn.innerHTML = 'Creating Account...';
    btn.disabled = true;

    // 3. Send to Service 1
    const res = await fetch('http://localhost:5000/api/customer/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name,
        email,
        phone,
        address,
        password
      })
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({ title: 'Success', text: 'Account created! Please login.', icon: 'success' })
      .then(() => window.location.href = '../signin/signin.html');
    } else {
      throw new Error(data.message || 'Signup failed');
    }
  } catch (err) {
    Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
    document.querySelector('button[type="submit"]').innerHTML = 'Create Account';
    document.querySelector('button[type="submit"]').disabled = false;
  }
});
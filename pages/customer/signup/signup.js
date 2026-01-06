document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  console.log("1. Starting Signup Process..."); // Debug Log

  const full_name = document.getElementById('full_name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  console.log("2. Data Collected:", { full_name, email, phone, address }); // Debug Log

  if (password !== confirmPassword) {
    Swal.fire({ title: 'Error', text: 'Passwords do not match', icon: 'error' });
    return;
  }

  const btn = document.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Connecting to Server...';
  btn.disabled = true;

  try {
    console.log("3. Sending Request to Backend..."); // Debug Log
    
    const res = await fetch('http://localhost:5000/api/customer/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, phone, address, password })
    });

    console.log("4. Response Received:", res.status); // Debug Log

    const data = await res.json();

    if (res.ok) {
      console.log("5. Success!");
      Swal.fire({ title: 'Success', text: 'Account created! Please login.', icon: 'success' })
      .then(() => window.location.href = '../signin/signin.html');
    } else {
      console.error("5. Server Error:", data);
      throw new Error(data.message || 'Signup failed');
    }
  } catch (err) {
    console.error("6. Network/Code Error:", err);
    Swal.fire({ 
      title: 'Connection Failed', 
      text: 'Could not connect to the backend. Is the server running? Check Console (F12) for details.', 
      icon: 'error' 
    });
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});
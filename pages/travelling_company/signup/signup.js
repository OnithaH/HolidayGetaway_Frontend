document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // 1. Get Values (Mapping wrong HTML IDs to correct variables)
  // HTML ID is 'full_name', but it is actually the Company Name
  const company_name = document.getElementById('full_name').value;
  // HTML ID is 'person', this is the Contact Person
  const contact_person = document.getElementById('person').value;
  
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // 2. Validate
  if (password !== confirmPassword) {
    Swal.fire({ title: 'Error', text: 'Passwords do not match', icon: 'error' });
    return;
  }

  try {
    const btn = document.querySelector('button[type="submit"]');
    btn.innerHTML = 'Registering...';
    btn.disabled = true;

    // 3. Send to Service 1
    // We strictly use the keys the Backend expects: company_name, contact_person, discount_rate
    const res = await fetch('http://localhost:5000/api/travelCompany/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name, 
        contact_person,
        email,
        phone,
        password,
        discount_rate: 0 // Backend requires this, but HTML doesn't have it. Sending 0.
      })
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({ title: 'Success', text: 'Company Registered!', icon: 'success' })
      .then(() => window.location.href = '../signin/signin.html');
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  } catch (err) {
    Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
    document.querySelector('button[type="submit"]').innerHTML = 'Create Account';
    document.querySelector('button[type="submit"]').disabled = false;
  }
});
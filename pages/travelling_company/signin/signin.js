document.getElementById('signinForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    Swal.fire({ title: 'Error', text: 'Enter email and password', icon: 'error' });
    return;
  }

  try {
    const btn = document.querySelector('button[type="submit"]');
    btn.innerHTML = 'Signing In...';
    btn.disabled = true;

    // Connects to Service 1
    const res = await fetch('http://localhost:5000/api/travelCompany/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('tc_token', data.data.token);
      localStorage.setItem('tc_user', JSON.stringify(data.data.company));
      window.location.href = '../home/home.html';
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (err) {
    Swal.fire({ title: 'Failed', text: err.message, icon: 'error' });
    document.querySelector('button[type="submit"]').innerHTML = 'Sign In';
    document.querySelector('button[type="submit"]').disabled = false;
  }
});
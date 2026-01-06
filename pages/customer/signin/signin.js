// Helper function to extract data from the Token
function parseJwt (token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

document.getElementById('signinForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    Swal.fire({ title: 'Error', text: 'Please enter email and password.', icon: 'error' });
    return;
  }

  const submitBtn = document.querySelector('button[type="submit"]');
  submitBtn.innerText = 'Signing in...';
  submitBtn.disabled = true;

  try {
    // 1. Call Backend
    const response = await fetch('http://localhost:5000/api/customer/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // 2. Decode the Token manually (Since backend didn't send user details)
      const decodedUser = parseJwt(data.token);
      
      // 3. Construct the User Object from the token data
      // Note: The token only has ID and Email. We will use Email as the name for now.
      const userObject = {
          id: decodedUser.id || 0,
          email: decodedUser.email || email,
          name: decodedUser.email || "Customer", // Fallback because backend doesn't send Full Name
          role: "customer"
      };

      // 4. Save to Storage
      localStorage.setItem('customerToken', data.token);
      localStorage.setItem('customerUser', JSON.stringify(userObject));

      Swal.fire({
        title: 'Welcome!',
        text: 'Login successful.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = '../home/home.html';
      });

    } else {
      throw new Error(data.message || 'Invalid credentials');
    }

  } catch (error) {
    console.error(error);
    Swal.fire({ title: 'Login Failed', text: error.message, icon: 'error' });
  } finally {
    submitBtn.innerText = 'Sign In';
    submitBtn.disabled = false;
  }
});
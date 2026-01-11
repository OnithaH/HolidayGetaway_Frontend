document.getElementById('adminLoginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = 'Verifying...';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const role = (payload.role || '').toLowerCase();

            if (role.includes('admin') || role.includes('manager')) {
                localStorage.setItem('staffToken', data.token);
                localStorage.setItem('staffRole', payload.role);
                window.location.href = '../dashboard/dashboard.html';
            } else {
                throw new Error("Access Denied: You do not have Admin privileges.");
            }
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: err.message,
            confirmButtonColor: '#ff9f1c'
        });
        btn.disabled = false;
        btn.innerHTML = 'Login to Admin';
    }
});

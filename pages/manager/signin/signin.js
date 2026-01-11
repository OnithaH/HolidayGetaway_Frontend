const API_URL = "http://localhost:5000/api";

document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });

        const { token, user } = response.data;

        // Check if user is actually a Manager
        if (user.role !== 'Manager' && user.role !== 'Admin') { // Admins can probably access too, but let's stick to spec
            throw new Error("Access Denied. This portal is for Managers only.");
        }

        // Store credentials
        localStorage.setItem('staffToken', token);
        localStorage.setItem('staffRole', user.role);
        localStorage.setItem('staffName', user.full_name);

        // Redirect to dashboard
        window.location.href = '../dashboard/dashboard.html';

    } catch (error) {
        console.error("Login error:", error);
        alert(error.response?.data?.message || error.message || "Login failed");
    } finally {
        submitBtn.innerHTML = 'Sign In';
        submitBtn.disabled = false;
    }
});

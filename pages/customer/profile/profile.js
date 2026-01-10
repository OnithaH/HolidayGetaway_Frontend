const token = localStorage.getItem('customerToken');
if (!token) {
    window.location.href = '../signin/signin.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    fetchProfile();

    document.getElementById('profileForm').addEventListener('submit', handleUpdate);
});

async function fetchProfile() {
    try {
        const res = await fetch('http://localhost:5000/api/customer/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();

        if (res.ok && json.data) {
            const user = json.data;
            document.getElementById('fullName').value = user.full_name || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('address').value = user.address || '';
        } else {
            Swal.fire('Error', 'Failed to load profile data', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Network error fetching profile', 'error');
    }
}

async function handleUpdate(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('password').value;

    const payload = {
        full_name: fullName,
        phone: phone,
        address: address
    };

    if (password && password.trim() !== '') {
        payload.password = password;
    }

    try {
        const res = await fetch('http://localhost:5000/api/customer/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const json = await res.json();

        if (res.ok) {
            Swal.fire({
                title: 'Updated!',
                text: 'Your profile has been updated.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Update local storage user name if needed
                const currentUser = JSON.parse(localStorage.getItem('customerUser') || '{}');
                currentUser.full_name = fullName;
                localStorage.setItem('customerUser', JSON.stringify(currentUser));
            });
        } else {
            Swal.fire('Error', json.message || 'Update failed', 'error');
        }
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Network error updating profile', 'error');
    }
}

function logout() {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    window.location.href = '../signin/signin.html';
}

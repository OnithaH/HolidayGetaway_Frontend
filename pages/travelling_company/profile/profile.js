const token = localStorage.getItem('tc_token');
if (!token) {
    window.location.href = '../signin/signin.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    fetchProfile();

    document.getElementById('profileForm').addEventListener('submit', handleUpdate);
});

async function fetchProfile() {
    try {
        const res = await fetch('http://localhost:5000/api/travelCompany/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();

        if (res.ok && json.data) {
            const company = json.data;
            document.getElementById('companyName').value = company.company_name || '';
            document.getElementById('contactPerson').value = company.contact_person || '';
            document.getElementById('email').value = company.email || '';
            document.getElementById('phone').value = company.phone || '';
            document.getElementById('discountRate').value = company.discount_rate || '0';
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

    const companyName = document.getElementById('companyName').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const phone = document.getElementById('phone').value;
    // const password = document.getElementById('password').value;

    const payload = {
        company_name: companyName,
        contact_person: contactPerson,
        phone: phone
    };

    // if (password && password.trim() !== '') {
    //     payload.password = password;
    // }

    try {
        const res = await fetch('http://localhost:5000/api/travelCompany/profile', {
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
                text: 'Company profile has been updated.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Update local storage user name if needed
                const currentUser = JSON.parse(localStorage.getItem('tc_user') || '{}');
                currentUser.company_name = companyName;
                localStorage.setItem('tc_user', JSON.stringify(currentUser));
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
    localStorage.removeItem('tc_token');
    localStorage.removeItem('tc_user');
    window.location.href = '../signin/signin.html';
}

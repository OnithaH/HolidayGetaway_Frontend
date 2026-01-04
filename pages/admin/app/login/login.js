const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Initialize SweetAlert Toast
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

// Sign Up
const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
    signUpForm.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const data = {
            firstName: document.getElementById('firstName').value,
            secondName: document.getElementById('secondName').value,
            nic: document.getElementById('nic').value,
            telNo: document.getElementById('telNo').value
        };

        try {
            const response = await fetch('http://localhost:8080/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                Toast.fire({
                    icon: "success",
                    title: "User created successfully!"
                });

                setTimeout(() => {
                    window.location.href = './login.html';
                }, 1500);
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Failed to create user."
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Toast.fire({
                icon: "error",
                title: "An error occurred."
            });
        }
    });
}


// sign in 
const signInForm = document.querySelector('.sign-in-form');

if (signInForm) {
    signInForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = signInForm.querySelector('input[type="text"]').value.trim();
        const password = signInForm.querySelector('input[type="password"]').value.trim();

        if (username === 'user' && password === '123') {
            Toast.fire({
                icon: "success",
                title: "Signed in successfully!"
            });

            setTimeout(() => {
                window.location.href = '../user/dashbord/userDashboard.html';
            }, 1500);
        }if (username === 'admin' && password === '123') {
            Toast.fire({
                icon: "success",
                title: "Signed in successfully!"
            });

            setTimeout(() => {
                window.location.href = '../admin/dashboard/adminDashboard.html';
            }, 1500);
        } else {
            Toast.fire({
                icon: "error",
                title: "Invalid username or password!"
            });
        }
    });
}


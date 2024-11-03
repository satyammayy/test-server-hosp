document.addEventListener('DOMContentLoaded', function () {
    const adminLoginForm = document.getElementById('admin-login-form');

    adminLoginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;

        fetch('https://shrew-concrete-cobra.ngrok-free.app/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // Store JWT token in localStorage
                localStorage.setItem('adminToken', data.token);
                // Redirect to the admin dashboard
                window.location.href = 'admin-dashboard.html';
            } else {
                document.getElementById('login-status').textContent = 'Invalid login credentials';
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            document.getElementById('login-status').textContent = 'Login failed. Try again later.';
        });
    });
});

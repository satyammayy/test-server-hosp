document.addEventListener('DOMContentLoaded', function () {
    // Registration Form Handling
    const registerForm = document.getElementById('register-form');
    if (registerForm) { 
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            registerUser();
        });
    }

    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) { 
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            loginUser();
        });
    }

    // Logout Handling
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function () {
            logoutUser();
        });
    }
});

// Function to handle user registration with image upload
function registerUser() {
    const statusElement = document.getElementById('register-status');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const imageFile = document.getElementById('image').files[0]; // Get the selected image file

    // Prepare form data for sending with image
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', imageFile); // Add image file to form data

    fetch('https://shrew-concrete-cobra.ngrok-free.app/user/register-user', {
        method: 'POST',
        body: formData, // Send form data including the image file
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User registration successful') {
            statusElement.textContent = 'Registration successful! Redirecting to login...';
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page after registration
            }, 2000);
        } else {
            statusElement.textContent = 'Registration failed. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusElement.textContent = 'An error occurred during registration.';
    });
}

// Function to handle user login
// Function to handle user login
function loginUser() {
    const statusElement = document.getElementById('login-status');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('https://shrew-concrete-cobra.ngrok-free.app/user/login-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            // Store user data in localStorage
            localStorage.setItem('userData', JSON.stringify(data.user));

            statusElement.textContent = 'Login successful! Redirecting...';
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Redirect to your dashboard or another page
            }, 2000);
        } else {
            statusElement.textContent = 'Login failed. Please check your credentials.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusElement.textContent = 'An error occurred during login.';
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        // Display the user's avatar
        const userAvatar = document.getElementById('user-avatar');
        userAvatar.src = userData.image; // Set the user's avatar URL
        userAvatar.alt = `${userData.name}'s Avatar`; // Set alt text for accessibility

        // Display welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.textContent = `Welcome, ${userData.name}!`; // Display the user's name

        // Add click event to show user details
        userAvatar.addEventListener('click', function () {
            alert(`User Details:\nName: ${userData.name}\nEmail: ${userData.email}`);
            // You can also open a modal or redirect to a user detail page instead of an alert
        });
    }
});

function fetchHospitals() {
    const hospitalList = document.getElementById('hospital-list');

    fetch('https://shrew-concrete-cobra.ngrok-free.app/user/hospitals')
        .then(response => response.json())
        .then(data => {
            // Clear the list before adding new items
            hospitalList.innerHTML = '';

            if (data.length > 0) {
                data.forEach(hospital => {
                    const hospitalItem = document.createElement('div');
                    hospitalItem.className = 'hospital-item'; // Style this class in your CSS
                
                    // Create a structure for hospital information
                    hospitalItem.innerHTML = `
                        <img src="${hospital.imageUrl}" alt="${hospital.name}" class="hospital-image">
                        <div class="hospital-details">
                            <h3>${hospital.name}</h3>
                            <p>${hospital.about}</p> <!-- Wrap description in <p> -->
                        </div>
                    `;
                
                    // Append to the hospital list
                    hospitalList.appendChild(hospitalItem);
                });
            } else {
                hospitalList.innerHTML = '<p>No hospitals available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching hospitals:', error);
            hospitalList.innerHTML = '<p>An error occurred while fetching hospitals.</p>';
        });
}

// Call the fetchHospitals function when the dashboard page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchHospitals();
});


// Function to handle user logout
function logoutUser() {
    fetch('https://shrew-concrete-cobra.ngrok-free.app/user/logout-user', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logout successful') {
            // Redirect to login page
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

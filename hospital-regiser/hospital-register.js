document.addEventListener('DOMContentLoaded', function () {
    const hospitalRegisterForm = document.getElementById('hospital-register-form');

    hospitalRegisterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form values
        const name = document.getElementById('hospital-name').value;
        const email = document.getElementById('hospital-email').value;
        const address = document.getElementById('hospital-address').value;
        const contact = document.getElementById('hospital-contact').value;
        const lattitude = document.getElementById('hospital-latt').value;
        const longitude = document.getElementById('hospital-long').value;
        const about = document.getElementById('hospital-about').value;
        const imageFile = document.getElementById('hospital-image').files[0]; // Get the selected image file

        // Prepare form data to send to the backend
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('address', address);
        formData.append('lattitude', lattitude);
        formData.append('longitude', longitude); 
        formData.append('contact', contact);
        formData.append('about', about); // Changed to match 'description' in the backend
        formData.append('image', imageFile); // Add image file to form data

        // Send the form data to the backend using fetch API
        registerHospital(formData);
    });

    function registerHospital(formData) {
        const statusElement = document.getElementById('register-status');

        fetch('http://localhost:3000/hospital/register-hospital', {
            method: 'POST',
            body: formData, // Send form data including the image file
        })
        .then(response => response.text()) // Use .text() for simple string response
        .then(data => {
            statusElement.textContent = 'Registration successful! Awaiting admin approval.';
        })
        .catch(error => {
            console.error('Error:', error);
            statusElement.textContent = 'Registration failed. Please try again.';
        });
    }
});

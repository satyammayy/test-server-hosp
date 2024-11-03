document.addEventListener('DOMContentLoaded', async function () {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        // Display the user's avatar and welcome message
        const userAvatar = document.getElementById('user-avatar');
        userAvatar.src = userData.image;
        userAvatar.alt = `${userData.name}'s Avatar`;
        
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.textContent = `Welcome, ${userData.name}!`;

        userAvatar.addEventListener('click', function () {
            alert(`User Details:\nName: ${userData.name}\nEmail: ${userData.email}`);
        });
    }

    // Fetch hospitals and user location
    await fetchHospitalsAndCalculateDistances();
});

async function fetchHospitalsAndCalculateDistances() {
    const hospitalList = document.getElementById('hospital-list');

    try {
        // Get user location once
        const userPosition = await getUserLocation();
        const userLatitude = userPosition.coords.latitude;
        const userLongitude = userPosition.coords.longitude;

        // Fetch all hospitals
        const response = await fetch('https://shrew-concrete-cobra.ngrok-free.app/user/hospitals');
        const hospitals = await response.json();

        // Calculate distance and time for each hospital
        const hospitalsWithDistance = await Promise.all(hospitals.map(async hospital => {
            const { lattitude, longitude } = hospital;
            const { distanceInKm, durationInMinutes } = await getDistanceToHospital(userLatitude, userLongitude, lattitude, longitude);
            return { ...hospital, distanceInKm, durationInMinutes };
        }));

        // Sort hospitals by distance in ascending order
        hospitalsWithDistance.sort((a, b) => parseFloat(a.distanceInKm) - parseFloat(b.distanceInKm));

        // Clear and populate the hospital list
        hospitalList.innerHTML = '';
        if (hospitalsWithDistance.length > 0) {
            for (const hospital of hospitalsWithDistance) {
                const { name, about, imageUrl, distanceInKm, durationInMinutes, lattitude, longitude } = hospital;

                const hospitalItem = document.createElement('div');
                hospitalItem.className = 'hospital-item';
                hospitalItem.innerHTML = `
                    <img src="${imageUrl}" alt="${name}" class="hospital-image">
                    <div class="hospital-list">
                        <h3>${name}</h3>
                        <p>${about}</p>
                        <p>${distanceInKm} km away, ETA: ${durationInMinutes} minutes</p>
                        <div class="hospital-actions">
                            <button class="btn btn-secondary"><a href="https://www.google.com/maps/dir/Current+Location/${lattitude},${longitude}">Get Directions</a></button>
                        </div>
                    </div>
                `;
                hospitalList.appendChild(hospitalItem);
            }
        } else {
            hospitalList.innerHTML = '<p>No hospitals available.</p>';
        }
    } catch (error) {
        console.error('Error fetching hospitals or calculating distances:', error);
        hospitalList.innerHTML = '<p>An error occurred while fetching hospitals.</p>';
    }
}

// Get user location once
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, error => {
                console.error('Error getting user location:', error.message);
                reject(error);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
            reject(new Error('Geolocation not supported'));
        }
    });
}

// Calculate distance to a hospital
async function getDistanceToHospital(userLatitude, userLongitude, hospitalLatitude, hospitalLongitude) {
    const API_KEY = 'nO03xhdbTRnqj4MvBeMff6aA64Ekd7QProAtSD07';
    const apiUrl = `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${userLatitude},${userLongitude}&destinations=${hospitalLatitude},${hospitalLongitude}&api_key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl, { method: 'GET' });
        const data = await response.json();

        if (data && data.rows && data.rows[0] && data.rows[0].elements[0]) {
            const element = data.rows[0].elements[0];
            const distanceInMeters = element.distance;
            const durationInSeconds = element.duration;

            const distanceInKm = (distanceInMeters / 1000).toFixed(2);
            const durationInMinutes = (durationInSeconds / 60).toFixed(2);
            return { distanceInKm, durationInMinutes };
        } else {
            console.warn('Unexpected data format:', data);
            return { distanceInKm: 'N/A', durationInMinutes: 'N/A' };
        }
    } catch (error) {
        console.error('Error fetching distance data:', error);
        return { distanceInKm: 'N/A', durationInMinutes: 'N/A' };
    }
}

// Logout function
function logoutUser() {
    fetch('https://shrew-concrete-cobra.ngrok-free.app/user/logout-user', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logout successful') {
            localStorage.removeItem('userData');
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin-login.html'; // Redirect to login if token is missing
        return;
    }

    // Fetch pending hospitals from the backend
    fetchPendingHospitals(token);

    function fetchPendingHospitals(token) {
        fetch('http://localhost:3000/admin/pending-hospitals', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const hospitalList = document.getElementById('hospital-list');
            hospitalList.innerHTML = ''; // Clear the list

            data.forEach(hospital => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>${hospital.name}</strong><br>
                    <p>${hospital.about}</p>
                    <img src="${hospital.imageUrl}" alt="${hospital.name}" style="width: 100px;"><br>
                    <button onclick="approveHospital('${hospital._id}')">Approve</button>
                    <button onclick="rejectHospital('${hospital._id}')">Reject</button>
                `;
                hospitalList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching pending hospitals:', error));
    }

    // Approve hospital function
    window.approveHospital = function (hospitalId) {
        fetch(`http://localhost:3000/admin/approve-hospital/${hospitalId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            alert('Hospital approved successfully');
            fetchPendingHospitals(token); // Refresh list after approval
        })
        .catch(error => console.error('Error approving hospital:', error));
    };

    // Reject hospital function
    window.rejectHospital = function (hospitalId) {
        fetch(`https://shrew-concrete-cobra.ngrok-free.app/admin/reject-hospital/${hospitalId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            alert('Hospital rejected successfully');
            fetchPendingHospitals(token); // Refresh list after rejection
        })
        .catch(error => console.error('Error rejecting hospital:', error));
    };
});

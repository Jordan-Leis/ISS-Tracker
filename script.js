// Function to fetch ISS position
async function getISSPosition() {
    try {
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching ISS position:', error);
        throw error; // Throw error for better error handling
    }
}

// Function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Function to update distance and visual
async function updateDistance() {
    try {
        const userLocation = await getUserLocation();
        const issPosition = await getISSPosition();

        const userLat = userLocation.latitude;
        const userLon = userLocation.longitude;
        const issLat = parseFloat(issPosition.iss_position.latitude);
        const issLon = parseFloat(issPosition.iss_position.longitude);

        const distance = calculateDistance(userLat, userLon, issLat, issLon);

        document.getElementById('distance').textContent = distance;

        // Visual representation
        const maxDistance = 40000; // Assuming max distance from user to ISS is 40000km
        const distancePercentage = (distance / maxDistance) * 100;
        const visualElement = document.getElementById('distance-visual');
        visualElement.innerHTML = `<p>Distance Visual:</p><div class="visual-bar"><div class="visual-fill" style="width: ${distancePercentage}%;"></div></div>`;
    } catch (error) {
        console.log('Error updating distance:', error);
    }
}

// Function to get user's location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, error => {
                reject('Error getting user location: ' + error.message);
            });
        } else {
            reject('Geolocation is not supported by this browser.');
        }
    });
}

// Update distance on page load
updateDistance();
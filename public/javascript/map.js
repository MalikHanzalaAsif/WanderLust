let listing = data.geometry.coordinates.reverse();
 // Step 3: Initialize the Map
 var map = L.map('map').setView([30.3753, 69.3451], 13); // Coordinates for New York City

 // Step 4: Add the OpenStreetMap tile layer
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);

 // Step 5: Add a marker at the specified location
 var marker = L.marker([30.3753, 69.3451]).addTo(map);
 marker.bindPopup("<b>New York City</b><br>Central Location.").openPopup();

// Check if coordinates are defined and have two values
if (listing && listing.length === 2) {
    // Update map center and marker position using latitude and longitude
    map.setView([listing[0], listing[1]], 13); // Center map on new coordinates
    marker.setLatLng([listing[0], listing[1]]); // Move marker to new location
    marker.bindPopup(`<b>${data.location}</b><br>exact location provided after booking.`).openPopup();

} else{
    console.error("location is not defined correctly");
    listing = [30.3753, 69.3451];
    map.setView([listing[0], listing[1]], 13); // Center map on new coordinates
    marker.setLatLng([listing[0], listing[1]]); // Move marker to new location
    marker.bindPopup(`<b>provided location is invalid!</b><br>contact to confirm the location.`).openPopup();
}
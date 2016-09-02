
// Use current location to get list of restaurants that are open.
// Determine distance of each restaurant.
// Sort restaurants by distance.
// Pick closest 4 restaurants.
// Make detailed search on those 4.
// Display details.

var currentPosition;
getCurrentLocation();

// Searches for current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);

    }

}

// Callback method for getCurrentLocation.
// Does the nearby search call.
function success(position) {
    currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    
    searchForNearbyRestaurants(currentPosition);

}

function error() {

}

function options() {

}

// Searches for nearby restaurants in order of distance
function searchForNearbyRestaurants(pos) {
    var map = new google.maps.Map(document.createElement('div'));
    var service = new google.maps.places.PlacesService(map);
    
    var request = {
        location: new google.maps.LatLng(pos.lat, pos.lng),
        types: ['restaurant'],
        rankBy: google.maps.places.RankBy.DISTANCE,
        openNow: true,
        
    }

    service.nearbySearch(request, processRestaurants);

}

// callback method for searchForNearbyRestaurants.
// processes the results
function processRestaurants(restaurants, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        
        for (var i = 0; i < 4; i++) {
            console.log(restaurants[i].name);
        }

    } else {
        console.log(status);
    }
}

function calculateDistance(positionOne, positionTwo) {

}
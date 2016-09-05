
// Pick closest 4 restaurants.
// Make detailed search on those 4.
// Display details.
var map;
var service;
var currentPosition;
var nearestRestaurants = new Array();

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
    map = new google.maps.Map(document.createElement('div'));
    service = new google.maps.places.PlacesService(map);
    
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
            var request = {
                placeId: restaurants[i].place_id,
            }
            service.getDetails(request, processIndividualRestaurant);
            
        }

    } else {
        console.log(status);
    }
}

// call back method for processRestaurants.
// processes the individual restaurants.
function processIndividualRestaurant(restaurantDetails, status) {
    var name = restaurantDetails.name;
    
    if (restaurantDetails.photos != undefined) {
        var photoURL = restaurantDetails.photos[0].getUrl({ 'maxWidth': 210, 'maxHeight': 144 });
    } else {
        // set to default image;
        var photoURL = "Insert default link here";
    }

    var openingHours = getOpeningHours(restaurantDetails.opening_hours.weekday_text);
    var position = restaurantDetails.geometry.location

    // Add details to a new variable
    var restaurant = {
        name,
        photoURL,
        openingHours,
        position,

    }

    // Add to array
    nearestRestaurants.push(restaurant);

    // Add details to the page once 4 restaurants have been processed
    if (nearestRestaurants.length == 4) {
        addDetailsToPage(nearestRestaurants);
    }

    
}

// Used to determine the opening hours for the current day
function getOpeningHours(arrayOfHours) {

    // Get current weekday (0-6)
    // -1 because google places uses Monday as 0, but Date uses Sunday as 0
    var currentDay = new Date().getDay() - 1;

    // wrap around to 6
    if (currentDay == -1) {
        currentDay = 6;
    }

    // Split today's hours into an array by whitespace
    var hoursForToday = arrayOfHours[currentDay].split(' ');
    var hours = "";

    // Cycle through and recreate string, ignoring first token
    for (var i = 1; i < hoursForToday.length; i++) {
        hours += hoursForToday[i] + " ";

    }

    return hours;
    

}


function calculateDistance(positionOne, positionTwo) {
    // to do
}

// This function adds the details of the restaurants on the web app
function addDetailsToPage(nearestRestaurants) {

    for (var i = 0; i < nearestRestaurants.length; i++) {
        document.getElementById("img-" + i).src = nearestRestaurants[i].photoURL;
        document.getElementById("name-" + i).innerHTML = nearestRestaurants[i].name;
        document.getElementById("hours-" + i).innerHTML = nearestRestaurants[i].openingHours;

        // Allows the restaurant tile to be clicked.
        var button = document.getElementById("restaurant-" + i);
        button.restaurant = nearestRestaurants[i];
        button.addEventListener("click", function () {
            displayMap(this.restaurant)});

    }

}

// This function displays the map with the location
// of the clicked restaurant
function displayMap(restaurant) {
    console.log(restaurant.name);

}

// TO DO:
// Display map with markers
// Implement distance function .

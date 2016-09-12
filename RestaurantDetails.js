
// Pick closest 4 restaurants.
// Make detailed search on those 4.
// Display details.
var map;
var service;
var currentPosition;
var nearestRestaurants = new Array();
var restaurantsLowDetail;
var currentRow;

window.onload = function () {
    var button = document.getElementById("show-me-more-button");
    button.addEventListener("click", function () {
        if (restaurantsLowDetail.length != 0) {
            addMoreRestaurants();
        }
        
    });

    getCurrentLocation();
}

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
        restaurantsLowDetail = restaurants;
        for (var i = 0; i < 4; i++) {
            var restaurant = restaurantsLowDetail.shift();
            var request = {
                placeId: restaurant.place_id,
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
        var photoURL = restaurantDetails.photos[0].getUrl({ 'maxWidth': 400, 'maxHeight': 400 });
    } else {
        // set to default image;
        var photoURL = "images/img-not-found.png";
    }

    var openingHours = getOpeningHours(restaurantDetails.opening_hours.weekday_text);
    var position = restaurantDetails.geometry.location;

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

    addDistance(nearestRestaurants);



}

function addDistance(nearestRestaurants) {
    var service = new google.maps.DistanceMatrixService();
    var restaurantDestinations = new Array();

    var length = nearestRestaurants.length;
    
    for (var i = 0; i < length; i++) {
        restaurantDestinations.push(nearestRestaurants[0].position);
        nearestRestaurants.shift();
    }

    var request = {
        origins: [currentPosition],
        destinations: restaurantDestinations,
        travelMode: 'WALKING',
    }

    service.getDistanceMatrix(request, distanceCallback);

}

function distanceCallback(response, status) {
    var results = response.rows[0].elements;
    for (var i = 0; i < results.length; i++) {
        var element = results[i];
        document.getElementById("distance-" + i).innerHTML = "Distance: " + element.distance.text;
    }

}

// This function displays the map with the location
// of the clicked restaurant
function displayMap(restaurant) {
    console.log(restaurant.name);

    document.getElementById("map").style.height = '700px';
    document.getElementById("content").style.display = 'none';

    var options = {
        center: currentPosition,
        zoom: 17,
    }

    map = new google.maps.Map(document.getElementById('map'), options);

    var markers = new Array();

    var currentPositionMarker = new google.maps.Marker({
        position: currentPosition,
        map: map,
    });

    var restaurantLocationMarker = new google.maps.Marker({
        position: restaurant.position,
        map: map,
        icon: "http://maps.gstatic.com/mapfiles/circle.png",
    });

    markers.push(currentPositionMarker);
    markers.push(restaurantLocationMarker);

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }

    map.fitBounds(bounds);

}

// This is the function that is called when the
// show me more button is pressed.
// It adds a new row of restaurants.
function addMoreRestaurants() {
    // TODO: USE restaurantsLowDetail to display information on newly created rows
    var newRow = document.createElement("div");

    for(var i = 0; i < 2; i++) {
        var column = document.createElement("div");

        if (i == 0) {
            column.className = "col-sm-offset-2 col-sm-4";
        } else {
            column.className = "col-sm-4";
        }

        createColumn(column);
        newRow.appendChild(column);

        column.photo = column.firstChild.childNodes[0].firstChild;
        column.name = column.firstChild.childNodes[1];
        column.openingHours = column.firstChild.childNodes[2];
        column.distance = column.firstChild.childNodes[3];
    }

    var element = document.getElementById("container");
    var child = document.getElementById("show-me-more-row");
    element.insertBefore(newRow, child);

    currentRow = newRow;

    for (var i = 0; i < 2; i++) {
        var restaurant = restaurantsLowDetail.shift();
        var request = {
            placeId: restaurant.place_id,
        }
        service.getDetails(request, processIndividualRestaurantShowMeMore);
    }
}

// This function creates and appends the HTML elements required
// to display the restaurant details
function createColumn(column) {
    var imgHover = document.createElement("div");
    imgHover.className = "img-hover";

    var border = document.createElement("figure");
    border.className = "border";

    var img = document.createElement("img");
    img.className = "img-responsive center-block";
    img.style = "width: 50%; height: 50%";
    img.src = "images/pacman.gif";

    var name = document.createElement("p");
    var openingHours = document.createElement("p");
    var distance = document.createElement("p");

    imgHover.appendChild(border);
    imgHover.appendChild(name);
    imgHover.appendChild(openingHours);
    imgHover.appendChild(distance);

    border.appendChild(img);

    column.appendChild(imgHover);

}

function processIndividualRestaurantShowMeMore(restaurantDetails, status) {
    var name = restaurantDetails.name;

    if (restaurantDetails.photos != undefined) {
        var photoURL = restaurantDetails.photos[0].getUrl({ 'maxWidth': 210, 'maxHeight': 144 });
    } else {
        // set to default image;
        var photoURL = "images/img-not-found.png";
    }

    var openingHours = getOpeningHours(restaurantDetails.opening_hours.weekday_text);
    var position = restaurantDetails.geometry.location;

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
    if (nearestRestaurants.length == 2) {
        addDetailsToPageShowMeMore(nearestRestaurants);
    }

}

function addDetailsToPageShowMeMore(nearestRestaurants) {
    for (var i = 0; i < nearestRestaurants.length; i++) {
        currentRow.childNodes[i].photo.src = nearestRestaurants[i].photoURL;
        currentRow.childNodes[i].name.innerHTML = nearestRestaurants[i].name;
        currentRow.childNodes[i].openingHours.innerHTML = nearestRestaurants[i].openingHours;
        

        // Allows the restaurant tile to be clicked.
        var button = currentRow.childNodes[i].firstChild;
        button.restaurant = nearestRestaurants[i];
        button.addEventListener("click", function () {
            displayMap(this.restaurant)
        });

    }

    addDistanceShowMeMore(nearestRestaurants);

}

function addDistanceShowMeMore(nearestRestaurants) {
    var service = new google.maps.DistanceMatrixService();
    var restaurantDestinations = new Array();

    var length = nearestRestaurants.length;

    for (var i = 0; i < length; i++) {
        restaurantDestinations.push(nearestRestaurants[0].position);
        nearestRestaurants.shift();
    }

    var request = {
        origins: [currentPosition],
        destinations: restaurantDestinations,
        travelMode: 'WALKING',
    }

    service.getDistanceMatrix(request, distanceCallbackShowMeMore);

}

function distanceCallbackShowMeMore(response, status) {
    var results = response.rows[0].elements;
    for (var i = 0; i < results.length; i++) {
        var element = results[i];
        currentRow.childNodes[i].distance.innerHTML = "Distance: " + element.distance.text;
    }

}

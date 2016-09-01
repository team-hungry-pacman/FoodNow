// Global variables
var map;
var service;
var infoWindow;
var pos;
var places = new Array();
var i;
useCurrentLocation();

function useCurrentLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            searchUsingLocation(pos);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });



    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


function searchUsingLocation(pos) {
    map = new google.maps.Map(document.createElement('div'));
    service = new google.maps.places
    .PlacesService(map);

    var request = {
        location: new google.maps.LatLng(pos.lat, pos.lng),
        radius: 1000,
        type: "restaurant",
    }

    service.nearbySearch(request, callback);



}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results.length);
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            console.log(place.name);
            var request = {
                placeId: place.place_id,

            }
            service.getDetails(request, callbackTwo);

        }
    }
}

function callbackTwo(place, status) {
    if (place !== null) {
        if (place.opening_hours !== undefined) {
            if (place.opening_hours.open_now) {
                if (place.opening_hours.weekday_text[6] !== undefined) {
                    if (place.photos !== undefined) {
                        var restaurant = {
                            name: place.name, // name
                            address: place.formatted_address, // address
                            icon: place.icon, // icon
                            photos: place.photos, // array of photos
                            website: place.website, // website
                            rating: place.rating, // rating
                            position: place.geometry.location, // location
                            times: place.opening_hours.weekday_text[6], // opening times

                        }
                        

                        places.push(restaurant);
                        if (places.length === 4) {
                            document.getElementById("restaurant-one").src = places[0].photos[0].getUrl({ 'maxWidth': 210, 'maxHeight': 144 });
                            document.getElementById("name-one").innerHTML = places[0].name;
                            document.getElementById("hours-one").innerHTML = places[0].times.substring(7, places[0].times.length);

                            document.getElementById("restaurant-two").src = places[1].photos[0].getUrl({ 'maxWidth': 210, 'maxHeight': 144 });
                            document.getElementById("name-two").innerHTML = places[1].name;
                            document.getElementById("hours-two").innerHTML = places[1].times.substring(7, places[1].times.length);

                            document.getElementById("restaurant-three").src = places[2].photos[0].getUrl({ 'maxWidth': 210, 'maxHeight': 144 });
                            document.getElementById("name-three").innerHTML = places[2].name;
                            document.getElementById("hours-three").innerHTML = places[2].times.substring(7, places[2].times.length);

                            document.getElementById("restaurant-four").src = places[3].photos[0].getUrl({ 'maxWidth': 210, 'maxHeight': 144 });
                            document.getElementById("name-four").innerHTML = places[3].name;
                            document.getElementById("hours-four").innerHTML = places[3].times.substring(7, places[3].times.length);

                            var images = document.getElementsByTagName("img");

                            var img1 = images[1];
                            img1.addEventListener("click", function () {
                                var place = places[0];
                                initMap(pos, place)
                            });

                            var img2 = images[2];
                            img2.addEventListener("click", function () {
                                var place = places[1];
                                initMap(pos, place)
                            });

                            var img3 = images[3];
                            img3.addEventListener("click", function () {
                                var place = places[2];
                                initMap(pos, place)
                            });

                            var img4 = images[4];
                            img4.addEventListener("click", function () {
                                var place = places[3];
                                initMap(pos, place)
                            });
                        }
                    }
                }
            }
        }

    } else {
        console.log(status);
    }

}
function initMap(pos, place) {
    document.getElementById("map").style.height = '700px';
    document.getElementById("content").style.display = 'none';
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15,
        styles: [{
            stylers: [{ visibility: 'simplified' }]
        }, {
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }]
    });

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    var marker = new google.maps.Marker({
        position: pos,
        map: map,
    });

    addMarker(place);

}

function addMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.position,
        icon: {
            url: 'http://maps.gstatic.com/mapfiles/circle.png',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(10, 17)
        }
    });

    google.maps.event.addListener(marker, 'click', function (place) {
        infoWindow.setContent(place.name);
        infoWindow.open(map, marker);
    });
}
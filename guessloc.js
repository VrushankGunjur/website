let display_pano;
let map;
let dist_disp;
let giveupbutton;
let nextbutton;
let guess = null;

function initSite(){

    var coords = getRandCoords();
    giveupbutton = document.getElementById("giveup");
    nextbutton = document.getElementById("next");
    dist_disp = document.getElementById("dist");
    display_pano = new google.maps.StreetViewPanorama(document.getElementById("pano"), {addressControl: false});
    const pos = new google.maps.LatLng(coords.lat, coords.lng);
    const sv = new google.maps.StreetViewService();
    sv.getPanorama({location: pos, radius: 5000000000}).then(processData);

}

function processData({data}){
    const ret_loc = data.location;

    display_pano.setPano(ret_loc.pano);
    display_pano.setPov({
        heading: 34,
        pitch: 10,
    });
    display_pano.setVisible(true);

    map = new google.maps.Map(document.getElementById("map"), {center: {lat: 10, lng: 0}, zoom: 3, streetViewControl: false});
    map.addListener("click", (event) => {
        //console.log(dist(event.latLng, data.location.latLng));
        if(guess != null) {
            guess.setMap(null);
        } 
        guess = new google.maps.Marker({
            position: event.latLng,
            map,
            label: 'G',
        });
        dist_disp.innerHTML = "Distance: " + (Math.sqrt(dist(event.latLng, data.location.latLng)) * 100).toFixed(4); 
    });
    giveupbutton.onclick = function () {
        giveupbutton.value = "Location Revealed";
        const marker = new google.maps.Marker({
            position: data.location.latLng,
            map,
            label: 'R',
        });
    }
    nextbutton.onclick = function () {
        location.reload();
    }
}

function getRandCoords() {
    // TODO change to avoid bodies of water
    var latsign;
    Math.random() < 0.5 ? latsign = -1 : latsign = 1;
    var lngsign;
    Math.random() < 0.5 ? lngsign = -1 : lngsign = 1;
    return {lat: Math.random() * 90 * latsign, lng: Math.random() * 180 * lngsign};
}


// can't just use euclidean distance due to toroidal wrapping
function dist(l1, l2) {
    // make 0-180
    lat1 = l1.lat() + 90;
    lat2 = l2.lat() + 90;
    // make 0-360
    lng1 = l1.lng() + 180;
    lng2 = l2.lng() + 180;

    var dx = Math.abs(lng1 - lng2);
    if(dx > 180) {
        dx = (180*2) - dx;
    }
    dy = Math.abs(lat1 - lat2);
    if(dy > 90) {
        dy = (90*2) - dy;
    }

    return (dy**2) + (dx**2);
}
let display_pano;
let map;
let dist_disp;
let giveupbutton;
let nextbutton;
let guess = null;

const location_pool = [
    {tl: {lat: 49.122742, lng: -125.695567}, br: {lat: 25.036513, lng: -80.336451}},    // US West to Florida
    {tl: {lat: 48.557534, lng: -80.336451}, br: {lat: 30.893671, lng: -64.767057}},     // US East Coast 
    {tl: {lat: 73.323326, lng: -140.839314}, br: {lat: 48.5557534, lng: -53.158033}},   // Canada
    {tl: {lat: 76.502212, lng: -48.426092}, br: {lat: 53.754238, lng: -140.338997}},    // E Russia + Alaska
    {tl: {lat: 69.005337, lng: -53.954070}, br: {lat: 59.344382, lng: -12.661704}},     // Iceland + Greenland   
    {tl: {lat: 62.421596, lng: -10.763519}, br: {lat: 50.492477, lng: 1.779839}},       // Ireland + UK
    {tl: {lat: 53.573586, lng: -4.440274}, br: {lat: 44.989035, lng: 38.246904}},       // Most of Europe
    {tl: {lat: 44.989035, lng: 7.172272}, br: {lat: 34.932150, lng: 41.236812}},        // Lower Europe
    {tl: {lat: 43.393266, lng: -10.270030}, br: {lat: 4.375531, lng: 6.251929}},        // Spain + W Africa
    {tl: {lat: 14.194688, lng: -16.863500}, br: {lat: 3.793862, lng: 50.984294}},       // African Band
    {tl: {lat: 3.793862, lng: 9.504620}, br: {lat: 35.059588, lng: 51.482600}},         // Lower Africa (!)
    {tl: {lat: 24.107721, lng: -107.799907}, br: {lat: 14.548842, lng: -83.307058}},    // Mexico
    {tl: {lat: 12.041314, lng: -86.902941}, br: {lat: -8.797692, lng: -34.373290}},     // N S America
    {tl: {lat: 8.797692, lng: -78.759950}, br: {lat: -29.503244, lng: -39.924923}},     // Mid S America
    {tl: {lat: -29.892466, lng: -72.312993}, br: {lat: -55.524003, lng: -52.965199}},   // S S America
    {tl: {lat: 23.463870, lng: -84.689752}, br: {lat: 12.806639, lng: -59.049301}},     // Cuba (!)
    {tl: {lat: 69.777385, lng: 2.609138}, br: {lat: 53.865490, lng: 40.183674}},        // Baltics
    {tl: {lat: 53.865490, lng: 40.183674}, br: {lat: 26.646481, lng: 115.569632}},      // Central Asia
    {tl: {lat: 28.595686, lng: 64.932891}, br: {lat: 6.024394, lng: 89.311485}},        // India (!)
    {tl: {lat: 25.917586, lng: 90.279956}, br: {lat: -8.315983, lng: 110.943365}},      // SE Asia (!)
    {tl: {lat: 36.852692, lng: 3.051205}, br: {lat: 13.709964, lng: 62.312668}},        // Mid East
    {tl: {lat: 26.077397, lng: 112.048452}, br: {lat: 16.039353, lng: 122.940823}},     // SE China + Taiwan
    {tl: {lat: -13.548322, lng: 112.671419}, br: {lat: -44.050905, lng: 153.882069}},   // Australia
];  // Still missing: Korea, Japan, Madagascar, New Zealand, Indonesia, Papua New Guinea, Hawaii

function initSite(){
    var coords = getRandCoords();
    giveupbutton = document.getElementById("giveup");
    nextbutton = document.getElementById("next");
    dist_disp = document.getElementById("dist");
    display_pano = new google.maps.StreetViewPanorama(document.getElementById("pano"), {addressControl: false});
    console.log(coords);
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
        giveupbutton.innerHTML = "Location Revealed";
        var lat = data.location.latLng.lat();
        // clamping
        if (lat > 85) lat = 85;
        if (lat < -85) lat = -85;
        map.setCenter({lat: lat, lng: data.location.latLng.lng()}, 3);
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
    var idx = Math.floor(Math.random() * (location_pool.length-1))
    var loc = location_pool[idx];
    console.log(idx);
    // max & min with negatives
    var longitude = Math.random() * (Math.abs(loc.br.lng - loc.tl.lng) + 1) + Math.min(loc.tl.lng, loc.br.lng);
    var latitude = Math.random() * (Math.abs(loc.br.lat - loc.tl.lat) + 1) + Math.min(loc.tl.lat, loc.br.lat);

    console.log(latitude);
    console.log(longitude);
    return {lat: latitude, lng: longitude};

    /*
    var latsign;
    Math.random() < 0.5 ? latsign = -1 : latsign = 1;
    var lngsign;
    Math.random() < 0.5 ? lngsign = -1 : lngsign = 1;
    return {lat: Math.random() * 90 * latsign, lng: Math.random() * 180 * lngsign};
    */
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
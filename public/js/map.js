mapboxgl.accessToken = mapToken;


const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 3 // starting zoom
});


const marker = new mapboxgl.Marker({color:'#33691e'})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML(`<h1><b>${listing.location}</b></h1><p>Exact location will be shared after booking.</p>`)) 
    .addTo(map);



    
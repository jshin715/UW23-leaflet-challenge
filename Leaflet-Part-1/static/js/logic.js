// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3.
d3.json(geoData).then(function(data) {
    createFeatures(data.features);
});

function createFeatures(eqData) {

    // Define a function to run once for each feature in the features array.
    // Give each feature a popup that shows earthquake data. 
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<p>Location: ${feature.properties.place}</p>
      <p>Magnitude: ${feature.properties.mag} mwr</p>
      <p>Depth: ${feature.geometry.coordinates[2]} km</p>`)
};


    //PointtoLayer allows circle markers
    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: feature.properties.mag *4,
            color: "white",
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.75,
            weight: 1

        })
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(eqData, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature
    });

    
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }


function createMap(eqData) {

    // Create the tile layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // add in the baseMap object
    let baseMap = {
    "Street": street
    };

  // Create an overlayMaps object
  let overlayMaps = {
    "Earthquake": eqData
  };
    // Create the map object with options.
  let map = L.map("map", {
    center: [39.83, -98.58],
    zoom: 5,
    layers: [street, eqData]
  });

  //Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMap, overlayMaps, {
    collapsed: false
  }).addTo(map);

  legend.addTo(map);
}

//Create function that returns marker color depending on depth
function chooseColor(depth){
    if (depth<10) return "#b2df8a";
    else if (depth<30) return "greenyellow";
    else if (depth<50) return "yellow";
    else if (depth<70) return "orange";
    else if (depth<90) return "darkorange";
    else return "red";
}

//Create legend
let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    div = L.DomUtil.create("div", "info legend"),
    limits = [-10, 10, 30, 50, 70, 90],
    labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"],

    div.innerHTML = '<strong>Depth Scale:</strong><br>';
        // Loop through the legend labels and colors
        for (i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(limits[i]+1) + '"></i> ' +
                labels[i] + '<br>';
        }
        return div;
  }

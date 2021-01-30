var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", 
{
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});
var myMap = L.map("mapid", 
{
    center: [0,0],
    zoom: 2,
});
streetmap.addTo(myMap);
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(queryUrl, function(data) 
{
    console.log(data);
    function mapStyle(features)
    {
        var style = 
        {
            fillColor: markerColor(features.geometry.coordinates[2]),
            radius: markerSize(features.properties.mag),
            fillOpacity: .75,
            weight: 1
        };
        return style;
    }
    function markerSize(mag) 
    {
        return mag *2.5;
    }  
    function markerColor(depth) 
    {
        if (depth <= 0) 
        {
            return "white";
        } 
        else if (depth <= 10) 
        {
            return "cyan";
        } 
        else if (depth <= 20) 
        {
            return "yellow";
        } 
        else if (depth <= 30) 
        {
            return "orange";
        } 
        else if (depth <= 40) 
        {
            return "red";
        } 
        else if (depth <= 50) 
        {
            return "brown";
        } 
        else 
        {
            return "purple";
        };
    }
    function onEachFeature(feature, layer)
    {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    L.geoJSON(data, 
    {
        pointToLayer: function(features, latlng)
            {
                return L.circleMarker(latlng)
            },
        style: mapStyle,
        onEachFeature: onEachFeature
    }).addTo(myMap);
});

var legend = L.control(
{ 
    position: "bottomright" 
});

legend.onAdd = function () 
{
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 1, 2, 3, 4, 5, 6];
    var colors = ["white", "cyan", "yellow", "orange", "red","brown", "purple"];
    var labels = [];
    var legendInfo = "<h1>Depth of Earthquake</h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
    div.innerHTML = legendInfo;
    limits.forEach(function (limit, index) 
    {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};
legend.addTo(myMap);

// MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent({latitude,longitude}) {
    console.log(latitude,longitude);
  return (
    <div style={{ height: "400px", width: "100%",zIndex:"0" }}>
      <MapContainer
        center={[latitude,longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%",zIndex:"0" }}
        dragging={true}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={true}
        zoomControl={true}
        keyboard={false}
        boxZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            You are here. <br /> Hyderabad
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;

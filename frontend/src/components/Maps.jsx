import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { icon } from "leaflet";
import ilocation from '../assets/Icons/loc.svg'

const Map = () => {
    const locationDevice = [
        { lat: -6.2088, lng: 106.8456, name: "Jakarta" },
        { lat: -8.4095, lng: 115.1889, name: "Bali" },
      ];
    
      const costomIcon = new L.icon({
        iconUrl: ilocation,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    return(
        <div>
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              style={{ height: "500px", width: "100%" }}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {locationDevice.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.lat, location.lng]}
                  icon={costomIcon}
                >
                  <Popup>{location.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
        </div>
    )
}

export default Map
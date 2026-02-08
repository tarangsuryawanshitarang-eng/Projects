import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocationMap = ({ location }) => {
  const { lat, lng, city, country } = location;

  return (
    <div className="py-8 border-t border-border" id="location">
      <h3 className="text-xl font-semibold mb-6">Where you'll be</h3>
      
      {/* Map */}
      <div className="h-[400px] rounded-xl overflow-hidden mb-6">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>
              {city}, {country}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Location Info */}
      <h4 className="font-semibold mb-2">{city}, {country}</h4>
      <p className="text-text-secondary">
        This is a wonderful neighborhood with great restaurants, shops, and local attractions within walking distance. 
        Perfect for exploring the area on foot and experiencing the local culture.
      </p>
    </div>
  );
};

export default LocationMap;

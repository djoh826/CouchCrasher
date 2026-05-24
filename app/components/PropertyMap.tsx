"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MarkerData {
  lat: number;
  lng: number;
  label: string;
  href?: string;
}

interface Props {
  markers: MarkerData[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function PropertyMap({
  markers,
  center = [32.7767, -96.797],
  zoom = 11,
  height = "320px",
}: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%", borderRadius: "14px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]} icon={icon}>
          <Popup>
            {m.href ? (
              <a href={m.href} style={{ fontWeight: 600, color: "#534ab7" }}>
                {m.label}
              </a>
            ) : (
              <span style={{ fontWeight: 600 }}>{m.label}</span>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

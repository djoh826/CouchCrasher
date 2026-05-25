"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px; height: 28px;
    background: #534ab7;
    border: 3px solid #fff;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 6px rgba(83,74,183,0.35);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
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
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
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

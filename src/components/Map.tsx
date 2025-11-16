"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Employer } from "@/types/employer";
import { CompanyCardCompact } from "./CompanyCardCompact";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  employers: Employer[];
}

function MapUpdater({ employers }: { employers: Employer[] }) {
  const map = useMap();

  useEffect(() => {
    if (employers.length > 0) {
      const bounds = L.latLngBounds(
        employers.map((emp) => [emp.lat, emp.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [employers, map]);

  return null;
}

export function Map({ employers }: MapProps) {
  // Richmond, VA center coordinates
  const defaultCenter: [number, number] = [37.5407, -77.4360];
  const defaultZoom = 12;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {employers.map((employer) => (
          <Marker
            key={employer.id}
            position={[employer.lat, employer.lng]}
          >
            <Popup maxWidth={300} minWidth={280} className="company-popup">
              <CompanyCardCompact employer={employer} />
            </Popup>
          </Marker>
        ))}

        <MapUpdater employers={employers} />
      </MapContainer>
    </div>
  );
}

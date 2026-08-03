import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Coordenadas de la Universidad Politecnica de Aguascalientes
const UPA_coords: [number, number] = [21.807037, -102.296021];

interface MapRouteProps {
  originCoords?: L.LatLngExpression;
  originLabel?: string;
  destinationCoords?: L.LatLngExpression;
  destinationLabel?: string;
  className?: string;
}

export function MapRoute({ originCoords, originLabel, destinationCoords, destinationLabel, className = '' }: MapRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: UPA_coords,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Actualizar marcadores y ruta cuando cambia
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Limpiar marcadores y polyline anteriores
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    // Icono de origen (rojo)
    const originIcon = L.divIcon({
      html: `<div style="background:#ef4444;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><i class="bi bi-geo-alt-fill" style="color:white;font-size:12px"></i></div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Icono de destino (verde; con birrete si es la UPA)
    const isUpa = destinationLabel?.toLowerCase().includes('upa') ?? false;
    const destinationIcon = L.divIcon({
      html: `<div style="background:#10b981;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><i class="bi ${isUpa ? 'bi-mortarboard-fill' : 'bi-flag-fill'}" style="color:white;font-size:14px"></i></div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Caso 1: origen y destino conocidos → dibujar la ruta completa
    if (originCoords && destinationCoords) {
      const originMarker = L.marker(originCoords, { icon: originIcon })
        .addTo(map)
        .bindPopup(`<b>${originLabel ?? 'Origen'}</b><br>Punto de partida`);
      const destMarker = L.marker(destinationCoords, { icon: destinationIcon })
        .addTo(map)
        .bindPopup(`<b>${destinationLabel ?? 'Destino'}</b><br>Punto de llegada`);

      markersRef.current.push(originMarker, destMarker);

      const polyline = L.polyline([originCoords, destinationCoords], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 6',
        lineCap: 'round',
      }).addTo(map);

      polylineRef.current = polyline;

      const bounds = L.latLngBounds([originCoords as [number, number], destinationCoords as [number, number]]);
      map.fitBounds(bounds, { padding: [60, 60] });
      return;
    }

    // Caso 2: solo origen → dibujar hacia la UPA (comportamiento previo)
    if (originCoords) {
      const originMarker = L.marker(originCoords, { icon: originIcon })
        .addTo(map)
        .bindPopup(`<b>${originLabel ?? 'Origen'}</b><br>Punto de partida`);
      const upaMarker = L.marker(UPA_coords, { icon: destinationIcon })
        .addTo(map)
        .bindPopup('<b>Universidad Politecnica de Aguascalientes</b><br>Destino');

      markersRef.current.push(originMarker, upaMarker);

      const [oLat, oLng] = originCoords as [number, number];
      const [dLat, dLng] = UPA_coords;
      const midLat = (oLat + dLat) / 2;
      const midLng = (oLng + dLng) / 2;
      const offset = 0.02;

      const routePath = [
        originCoords,
        [midLat + offset, midLng - offset] as [number, number],
        UPA_coords,
      ];

      const polyline = L.polyline(routePath, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 6',
        lineCap: 'round',
      }).addTo(map);

      polylineRef.current = polyline;

      const bounds = L.latLngBounds([originCoords as [number, number], UPA_coords]);
      map.fitBounds(bounds, { padding: [60, 60] });
      return;
    }

    // Sin origen seleccionado, centrar en UPA
    map.setView(UPA_coords, 12);
  }, [originCoords, originLabel, destinationCoords, destinationLabel]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full ${className}`}
      style={{ background: '#1a1a2e' }}
    />
  );
}

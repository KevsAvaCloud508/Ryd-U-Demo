import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Coordenadas de la Universidad Politecnica de Aguascalientes
const UPA_coords: [number, number] = [21.807037, -102.296021];

interface MapRouteProps {
  originCoords?: L.LatLngExpression;
  originLabel?: string;
  className?: string;
}

export function MapRoute({ originCoords, originLabel, className = '' }: MapRouteProps) {
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

    // Marcador de UPA
    const upaIcon = L.divIcon({
      html: `<div style="background:#10b981;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><i class="bi bi-mortarboard-fill" style="color:white;font-size:14px"></i></div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker(UPA_coords, { icon: upaIcon })
      .addTo(map)
      .bindPopup('<b>Universidad Politecnica de Aguascalientes</b><br>Destino');

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Actualizar origen y ruta cuando cambia
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

    if (!originCoords) {
      // Sin origen seleccionado, centrar en UPA
      map.setView(UPA_coords, 12);
      return;
    }

    // Marcador de origen
    const originIcon = L.divIcon({
      html: `<div style="background:#ef4444;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><i class="bi bi-geo-alt-fill" style="color:white;font-size:12px"></i></div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const originMarker = L.marker(originCoords, { icon: originIcon })
      .addTo(map)
      .bindPopup(`<b>${originLabel ?? 'Origen'}</b><br>Punto de partida`);

    markersRef.current.push(originMarker);

    // Dibujar linea de ruta (curva suave)
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

    // Ajustar vista para mostrar ambos marcadores
    const bounds = L.latLngBounds([originCoords as [number, number], UPA_coords]);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [originCoords, originLabel]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full ${className}`}
      style={{ background: '#1a1a2e' }}
    />
  );
}

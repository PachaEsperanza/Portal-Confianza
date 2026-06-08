import { useEffect, useRef, useState, useCallback } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google: any;
    initGoogleMap?: () => void;
    gm_authFailure?: () => void;
  }
}

type MapTypeId = 'satellite' | 'roadmap' | 'terrain' | 'hybrid';

export interface ParcelaCoords {
  lat: number;
  lng: number;
  altitud?: string;
  perimetroRadio?: number; // metros, opcional
}

interface ParcelaMapPickerProps {
  value: ParcelaCoords | null;
  onChange: (coords: ParcelaCoords) => void;
}

const GMAPS_KEY = 'AIzaSyAEgkpN1aI0tna5cwQ6yGE9_k2HsMfHV2o';

let scriptLoaded = false;
let scriptLoading = false;
let scriptError = false;
const callbacks: (() => void)[] = [];
const errorCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(onSuccess: () => void, onError: () => void) {
  if (scriptLoaded) { onSuccess(); return; }
  if (scriptError) { onError(); return; }
  callbacks.push(onSuccess);
  errorCallbacks.push(onError);
  if (scriptLoading) return;
  scriptLoading = true;

  window.gm_authFailure = () => {
    scriptError = true; scriptLoading = false;
    errorCallbacks.forEach(fn => fn()); errorCallbacks.length = 0;
  };
  window.initGoogleMap = () => {
    scriptLoaded = true; scriptLoading = false;
    callbacks.forEach(fn => fn()); callbacks.length = 0;
  };

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&callback=initGoogleMap&libraries=streetview`;
  script.async = true; script.defer = true;
  script.onerror = () => {
    scriptError = true; scriptLoading = false;
    errorCallbacks.forEach(fn => fn()); errorCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

const DEFAULT_LAT = -12.8636;
const DEFAULT_LNG = -72.7011;

const RADIOS_RAPIDOS = [
  { label: '100 m', value: 100 },
  { label: '200 m', value: 200 },
  { label: '500 m', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
];

export default function ParcelaMapPicker({ value, onChange }: ParcelaMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const svPanoramaRef = useRef<any>(null);

  const [ready, setReady] = useState(scriptLoaded);
  const [mapError, setMapError] = useState(scriptError);
  const [mapTypeId, setMapTypeId] = useState<MapTypeId>('hybrid');
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [streetViewActive, setStreetViewActive] = useState(false);
  const [locating, setLocating] = useState(false);
  const [radioSeleccionado, setRadioSeleccionado] = useState<number | null>(value?.perimetroRadio ?? null);

  useEffect(() => {
    if (!scriptLoaded && !scriptError) {
      loadGoogleMapsScript(() => setReady(true), () => setMapError(true));
    }
  }, []);

  const updateCircle = useCallback((lat: number, lng: number, radio: number | null) => {
    if (!mapInstanceRef.current) return;
    if (circleRef.current) { circleRef.current.setMap(null); circleRef.current = null; }
    if (radio) {
      circleRef.current = new window.google.maps.Circle({
        center: { lat, lng },
        radius: radio,
        strokeColor: '#d97706',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#f59e0b',
        fillOpacity: 0.15,
        map: mapInstanceRef.current,
      });
    }
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const initLat = value?.lat ?? DEFAULT_LAT;
    const initLng = value?.lng ?? DEFAULT_LNG;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: initLat, lng: initLng },
      zoom: value ? 15 : 12,
      mapTypeId: 'hybrid',
      disableDefaultUI: false,
      streetViewControl: true,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      position: value ? { lat: value.lat, lng: value.lng } : null,
      map,
      draggable: true,
      title: 'Ubicación de la parcela',
      visible: !!value,
    });
    markerRef.current = marker;

    if (value && value.perimetroRadio) {
      updateCircle(value.lat, value.lng, value.perimetroRadio);
    }

    map.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      marker.setVisible(true);
      const newCoords = { lat, lng, altitud: value?.altitud, perimetroRadio: radioSeleccionado ?? undefined };
      onChange(newCoords);
      updateCircle(lat, lng, radioSeleccionado);
    });

    marker.addListener('dragend', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newCoords = { lat, lng, altitud: value?.altitud, perimetroRadio: radioSeleccionado ?? undefined };
      onChange(newCoords);
      updateCircle(lat, lng, radioSeleccionado);
    });

    const panorama = map.getStreetView();
    svPanoramaRef.current = panorama;
    panorama.addListener('visible_changed', () => setStreetViewActive(panorama.getVisible()));

    return () => { marker.setMap(null); if (circleRef.current) circleRef.current.setMap(null); };
  }, [ready]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setMapTypeId(mapTypeId);
  }, [mapTypeId]);

  // Update circle when radio changes
  const handleRadioChange = useCallback((radio: number | null) => {
    setRadioSeleccionado(radio);
    if (value) {
      updateCircle(value.lat, value.lng, radio);
      onChange({ ...value, perimetroRadio: radio ?? undefined });
    }
  }, [value, onChange, updateCircle]);

  const handleGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocating(false);
        if (mapInstanceRef.current) { mapInstanceRef.current.setCenter({ lat, lng }); mapInstanceRef.current.setZoom(17); }
        if (markerRef.current) { markerRef.current.setPosition({ lat, lng }); markerRef.current.setVisible(true); }
        const newCoords = { lat, lng, altitud: value?.altitud, perimetroRadio: radioSeleccionado ?? undefined };
        onChange(newCoords);
        updateCircle(lat, lng, radioSeleccionado);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onChange, value, radioSeleccionado, updateCircle]);

  const MAP_TYPES: { id: MapTypeId; label: string; icon: string }[] = [
    { id: 'roadmap', label: 'Mapa', icon: 'ri-road-map-line' },
    { id: 'hybrid', label: 'Satélite', icon: 'ri-earth-line' },
    { id: 'terrain', label: 'Terreno', icon: 'ri-landscape-line' },
  ];

  if (mapError) {
    return (
      <div className="w-full h-64 bg-stone-100 rounded-xl border-2 border-stone-300 flex flex-col items-center justify-center gap-2 text-stone-500">
        <i className="ri-map-2-line text-3xl text-red-400" />
        <p className="text-sm font-semibold">No se pudo cargar Google Maps</p>
        <p className="text-xs text-stone-400">Verifica tu conexión a internet</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="w-full h-64 bg-stone-100 rounded-xl border-2 border-amber-300 flex flex-col items-center justify-center gap-3">
        <span className="animate-spin w-8 h-8 border-2 border-amber-300 border-t-amber-600 rounded-full inline-block" />
        <span className="text-sm text-stone-500 font-medium">Cargando mapa satelital...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Info box azul — por qué pedimos esto */}
      <div className="p-3 rounded-lg border-2 border-blue-400 bg-blue-50 text-xs text-blue-800">
        <p className="font-bold mb-1"><i className="ri-map-2-line mr-1" /> <strong>¿Por qué pedimos esto?</strong></p>
        <p>La Unión Europea exige saber exactamente dónde está tu chacra para comprar tu cacao (Reglamento EUDR). Si no tienes GPS ahora, el técnico te ayudará a tomarlo en la próxima visita.</p>
      </div>

      {/* Instructions — fondo rojito */}
      <div className="p-3 rounded-lg border border-red-300 bg-red-50 text-xs text-red-800">
        <p className="font-bold mb-1">📍 Cómo marcar tu parcela:</p>
        <ul className="space-y-0.5 list-disc pl-4">
          <li>Toca <strong className="text-red-900">"Usar mi ubicación GPS"</strong> para centrar el mapa donde estás</li>
          <li>O toca cualquier punto del mapa para colocar el marcador en tu parcela</li>
          <li>Puedes arrastrar el marcador rojo para ajustar la posición exacta</li>
        </ul>
      </div>

      {/* GPS button */}
      <button type="button" onClick={handleGPS} disabled={locating}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-bold border-2 border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
        {locating
          ? <><span className="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-emerald-700 rounded-full" />Obteniendo ubicación GPS...</>
          : <><i className="ri-focus-3-line" />Usar mi ubicación GPS actual</>}
      </button>

      {/* Map */}
      <div className="relative w-full rounded-xl overflow-hidden border-2 border-stone-300" style={{ height: 340 }}>
        <div ref={mapRef} className="w-full h-full" />

        {/* Layers button */}
        <div className="absolute bottom-20 left-2 z-10">
          <button onClick={() => setLayersPanelOpen(v => !v)}
            className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
            <i className="ri-stack-line text-gray-600 text-lg" />
            <span className="text-[9px] text-gray-500 font-medium leading-none mt-0.5">Capas</span>
          </button>

          {layersPanelOpen && (
            <div className="absolute bottom-14 left-0 bg-white rounded-xl overflow-hidden" style={{ width: 220, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <div className="px-3 pt-3 pb-2">
                <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Tipo de mapa</div>
                <div className="flex gap-2">
                  {MAP_TYPES.map(mt => (
                    <button key={mt.id} onClick={() => { setMapTypeId(mt.id); setLayersPanelOpen(false); }}
                      className="flex flex-col items-center gap-1 cursor-pointer flex-1">
                      <div className={`w-full h-12 rounded-lg border-2 flex items-center justify-center transition-all ${mapTypeId === mt.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                        <i className={`${mt.icon} text-xl`} style={{ color: mapTypeId === mt.id ? '#16a34a' : '#9e9e9e' }} />
                      </div>
                      <span className={`text-[10px] font-medium whitespace-nowrap ${mapTypeId === mt.id ? 'text-emerald-600' : 'text-gray-500'}`}>{mt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 border-t border-gray-100 px-3 py-1.5 text-[10px] text-gray-400 text-center cursor-pointer hover:bg-gray-100"
                onClick={() => setLayersPanelOpen(false)}>Cerrar</div>
            </div>
          )}
        </div>

        {streetViewActive && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none z-10">
            <i className="ri-walk-line" /> Street View activo
          </div>
        )}

        {layersPanelOpen && <div className="absolute inset-0 z-[5]" onClick={() => setLayersPanelOpen(false)} />}
      </div>

      {/* Coords display + altitud */}
      {value ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5">Latitud</p>
            <p className="text-sm font-black text-emerald-800">{value.lat.toFixed(6)}°</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5">Longitud</p>
            <p className="text-sm font-black text-emerald-800">{value.lng.toFixed(6)}°</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-600 uppercase tracking-wide mb-1">Altitud (msnm)</p>
            <input type="number" placeholder="Ej. 1100" value={value.altitud || ''}
              onChange={e => onChange({ ...value, altitud: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500" />
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-center text-sm text-stone-400">
          <i className="ri-map-pin-line mr-1" /> Toca el mapa o usa el GPS para marcar la ubicación de la parcela
        </div>
      )}

      {/* Perimetro — opcional */}
      <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-stone-600 uppercase tracking-wide">
            <i className="ri-circle-line mr-1 text-amber-600" />
            Perímetro aproximado <span className="text-stone-400 normal-case font-normal">(opcional)</span>
          </p>
          {radioSeleccionado && (
            <button type="button" onClick={() => handleRadioChange(null)}
              className="text-[11px] text-red-500 hover:text-red-700 font-medium">
              Quitar
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {RADIOS_RAPIDOS.map(r => (
            <button key={r.value} type="button" onClick={() => handleRadioChange(radioSeleccionado === r.value ? null : r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${radioSeleccionado === r.value ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300'}`}>
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="50"
            placeholder="O escribe km personalizados Ej: 15"
            className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            onChange={e => {
              const val = e.target.value ? Number(e.target.value) * 1000 : null;
              handleRadioChange(val);
            }}
          />
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">km</span>
        </div>
        {radioSeleccionado && value && (
          <p className="text-[11px] text-amber-700 font-medium">
            <i className="ri-circle-line mr-1" />
            Círculo de {radioSeleccionado >= 1000 ? `${radioSeleccionado/1000} km` : `${radioSeleccionado} m`} dibujado en el mapa
          </p>
        )}
        {!value && radioSeleccionado && (
          <p className="text-[11px] text-stone-400">Marca primero la ubicación en el mapa para ver el perímetro</p>
        )}
      </div>
    </div>
  );
}

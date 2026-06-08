import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wxgqhhfgrddgvxkovcdk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Z3FoaGZncmRkZ3Z4a292Y2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjkwNTAsImV4cCI6MjA5MTUwNTA1MH0.n16R741D8J993Xs9c8QNO3iT4lTWvnRhvgmN1ph2lqs";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Registro {
  id: string;
  created_at: string;
  folio: string;
  fecha: string;
  nombre: string;
  dni: string;
  comunidad: string;
  distrito: string;
  provincia: string;
  telefono: string;
  nombre_acopiador: string;
  dni_acopiador: string;
  foto_productor: string;
  foto_acopiador_productor: string;
  tier: string;
  estimado_anual: string;
  tipo_acopio: string;
  estado_certificacion: string;
  lat_parcela: number;
  lng_parcela: number;
  altitud_gps: string;
  perimetro_radio: number;
  declaracion_jurada: boolean;
  [key: string]: unknown;
}

const CAMPOS_COMPLETOS: { label: string; key: string }[] = [
  { label: "Folio", key: "folio" },
  { label: "Fecha", key: "fecha" },
  { label: "Nombre completo", key: "nombre" },
  { label: "DNI", key: "dni" },
  { label: "Teléfono", key: "telefono" },
  { label: "Tel. familiar", key: "telefono_familiar" },
  { label: "Familiar", key: "nombre_familiar" },
  { label: "Provincia", key: "provincia" },
  { label: "Comunidad", key: "comunidad" },
  { label: "Distrito", key: "distrito" },
  { label: "Acopiador", key: "nombre_acopiador" },
  { label: "DNI acopiador", key: "dni_acopiador" },
  { label: "Zona/Ruta", key: "zona_ruta" },
  { label: "Personas trabajan parcela", key: "personas_trabajan" },
  { label: "Relación laboral", key: "relacion_laboral" },
  { label: "Años experiencia", key: "anios_experiencia" },
  { label: "Tiene cuenta bancaria", key: "tiene_cuenta" },
  { label: "Crédito agrario", key: "recibio_credito_agrario" },
  { label: "Tiene deuda", key: "tiene_deuda" },
  { label: "Razón comprador", key: "razon_comprador" },
  { label: "Disposición", key: "disposicion" },
  { label: "Tier", key: "tier" },
  { label: "Justificación tier", key: "justificacion_tier" },
  { label: "Nombre parcela", key: "nombre_parcela" },
  { label: "Título o constancia", key: "tiene_titulo" },
  { label: "Superficie total (ha)", key: "superficie_total" },
  { label: "Área Cacao Chuncho (ha)", key: "area_cacao" },
  { label: "Otros cultivos", key: "otros_cultivos" },
  { label: "Fuente hídrica", key: "fuente_hidrica" },
  { label: "Tipo de suelo", key: "tipo_suelo" },
  { label: "Sistema sombra", key: "sistema_sombra" },
  { label: "Distancia vía (km)", key: "distancia_via" },
  { label: "Tiempo flete (h)", key: "tiempo_flete" },
  { label: "Código parcela", key: "codigo_parcela" },
  { label: "Latitud parcela", key: "lat_parcela" },
  { label: "Longitud parcela", key: "lng_parcela" },
  { label: "Altitud GPS (msnm)", key: "altitud_gps" },
  { label: "Perímetro (m)", key: "perimetro_radio" },
  { label: "Edad plantas (años)", key: "edad_plantas" },
  { label: "Distanciamiento", key: "distanciamiento" },
  { label: "N.° plantas", key: "numero_plantas" },
  { label: "% producción", key: "pct_produccion" },
  { label: "Grados Brix", key: "grados_brix" },
  { label: "Fecha muestreo Brix", key: "fecha_muestreo_brix" },
  { label: "Color grano", key: "color_grano" },
  { label: "Prácticas postcosecha", key: "practicas_post_cosecha" },
  { label: "Herramienta cosecha", key: "herramienta_cosecha" },
  { label: "Notas sensoriales", key: "notas_sensoriales" },
  { label: "Estimado anual (kg baba)", key: "estimado_anual" },
  { label: "Rendimiento histórico", key: "rendimiento_historico" },
  { label: "Comprador actual", key: "comprador_actual" },
  { label: "Almacenamiento", key: "almacenamiento" },
  { label: "Tipo acopio", key: "tipo_acopio" },
  { label: "Transporte", key: "transporte" },
  { label: "Costo flete (S/.)", key: "costo_flete" },
  { label: "Meses cosecha", key: "meses_cosecha" },
  { label: "Plaga principal", key: "plaga_principal" },
  { label: "% afectación plaga", key: "pct_afectacion_principal" },
  { label: "Plaga secundaria", key: "plaga_secundaria" },
  { label: "Meses presión plaga", key: "meses_presion_plaga" },
  { label: "Productos control", key: "productos_control" },
  { label: "Frecuencia control", key: "frecuencia_control" },
  { label: "Estado certificación", key: "estado_certificacion" },
  { label: "Entidad certificadora", key: "entidad_certificadora" },
  { label: "N.° certificado", key: "numero_certificado" },
  { label: "Fecha vencimiento cert.", key: "fecha_vencimiento" },
  { label: "Obs. certificación", key: "obs_certificacion" },
  { label: "Tema capacitación", key: "tema_capacitacion" },
  { label: "ONG", key: "nombre_ong" },
  { label: "Comentarios productor", key: "comentarios_productor" },
  { label: "Confiabilidad", key: "confiabilidad" },
  { label: "Calidad grano", key: "calidad_grano" },
  { label: "Potencial estratégico", key: "potencial_estrategico" },
  { label: "Riesgo pérdida", key: "riesgo_perdida" },
  { label: "Acción fidelización", key: "accion_fidelizacion" },
  { label: "Fecha seguimiento", key: "fecha_seguimiento" },
  { label: "Notas confidenciales", key: "notas_confidenciales" },
  { label: "Fecha y lugar", key: "fecha_lugar" },
  { label: "Declaración jurada", key: "declaracion_jurada" },
];

function val(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "✅ Sí" : "❌ No";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export default function AdminPanel() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Registro | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registros")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { setError(error.message); setLoading(false); return; }
    setRegistros(data || []);
    setLoading(false);
  };

  const filtrados = registros.filter(r =>
    (r.nombre || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.comunidad || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.folio || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.dni || "").includes(search)
  );

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-amber-800 rounded-full" />
    </div>
  );

  if (error) return (
    <div className="p-4 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm">{error}</div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">Panel de Administración</p>
        <h2 className="text-2xl font-bold text-stone-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Registros de Productores
        </h2>
        <p className="text-sm text-stone-500">{registros.length} registro{registros.length !== 1 ? "s" : ""} en total</p>
      </div>

      {/* Búsqueda + actualizar */}
      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          placeholder="Buscar por nombre, comunidad, folio o DNI..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={fetchRegistros}
          className="px-4 py-2.5 rounded-lg text-sm font-bold bg-amber-600 text-white hover:bg-amber-700 transition-all">
          <i className="ri-refresh-line" />
        </button>
      </div>

      {/* Lista */}
      {!selected ? (
        <div className="space-y-2">
          {filtrados.length === 0 && (
            <div className="text-center py-10 text-stone-400 text-sm">No hay registros que coincidan con la búsqueda.</div>
          )}
          {filtrados.map(r => (
            <div key={r.id} onClick={() => setSelected(r)}
              className="rounded-xl bg-amber-50 border border-amber-200 p-4 cursor-pointer hover:border-amber-400 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                {r.foto_productor && (
                  <img src={r.foto_productor} alt="" className="w-14 h-14 rounded-lg object-cover border border-amber-200 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">#{r.folio}</span>
                    {r.tier && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: r.tier === "A" ? "#166534" : r.tier === "B" ? "#92400e" : "#44403c" }}>TIER {r.tier}</span>}
                    {r.declaracion_jurada && <span className="text-[10px] font-bold text-emerald-700">✅ DJ</span>}
                  </div>
                  <p className="text-sm font-bold text-stone-800 mt-1 truncate">{r.nombre || "Sin nombre"}</p>
                  <p className="text-xs text-stone-500">{r.comunidad || "—"} · {r.distrito || "—"} · {r.provincia || "—"}</p>
                  <p className="text-xs text-stone-400 mt-0.5">Acopiador: {r.nombre_acopiador || "—"} · {r.fecha || r.created_at?.slice(0,10)}</p>
                </div>
                {r.lat_parcela && r.lng_parcela && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${r.lat_parcela},${r.lng_parcela}`}
                    target="_blank" rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all">
                    <i className="ri-map-pin-line text-base" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detalle completo */
        <div className="space-y-4">
          <button onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-800 transition-colors">
            <i className="ri-arrow-left-line" /> Volver a la lista
          </button>

          {/* Fotos */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
            <div className="flex flex-wrap gap-4 justify-center">
              {selected.foto_productor && (
                <div className="text-center">
                  <img src={selected.foto_productor} alt="Productor" className="w-40 h-40 object-cover rounded-xl border-2 border-amber-300" />
                  <p className="text-xs font-bold text-amber-700 mt-2">Foto del productor</p>
                </div>
              )}
              {selected.foto_acopiador_productor && (
                <div className="text-center">
                  <img src={String(selected.foto_acopiador_productor)} alt="Conjunto" className="w-52 h-40 object-cover rounded-xl border-2 border-amber-300" />
                  <p className="text-xs font-bold text-amber-700 mt-2">Acopiador con productor</p>
                </div>
              )}
            </div>
          </div>

          {/* Mapa si tiene coords */}
          {selected.lat_parcela && selected.lng_parcela && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">📍 Ubicación de la parcela</p>
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${selected.lat_parcela},${selected.lng_parcela}&zoom=15&size=600x250&maptype=hybrid&markers=color:red|label:P|${selected.lat_parcela},${selected.lng_parcela}&key=AIzaSyAEgkpN1aI0tna5cwQ6yGE9_k2HsMfHV2o`}
                alt="Mapa parcela" className="w-full rounded-lg border border-amber-200"
              />
              <div className="flex gap-3 flex-wrap">
                <span className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg font-mono text-stone-700">Lat: {Number(selected.lat_parcela).toFixed(6)}°</span>
                <span className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg font-mono text-stone-700">Lng: {Number(selected.lng_parcela).toFixed(6)}°</span>
                {selected.altitud_gps && <span className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg font-mono text-stone-700">Alt: {selected.altitud_gps} msnm</span>}
                {selected.perimetro_radio && <span className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg font-mono text-stone-700">Radio: {Number(selected.perimetro_radio) >= 1000 ? `${Number(selected.perimetro_radio)/1000} km` : `${selected.perimetro_radio} m`}</span>}
                <a href={`https://www.google.com/maps/search/?api=1&query=${selected.lat_parcela},${selected.lng_parcela}`}
                  target="_blank" rel="noreferrer"
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition-all">
                  🗺️ Abrir en Google Maps
                </a>
              </div>
            </div>
          )}

          {/* Todos los campos */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4">Datos completos del registro</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CAMPOS_COMPLETOS.map(f => (
                <div key={f.key} className="bg-white border border-amber-100 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm font-medium text-stone-700 mt-0.5 break-words">{val(selected[f.key])}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

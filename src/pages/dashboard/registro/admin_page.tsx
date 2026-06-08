import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wxgqhhfgrddgvxkovcdk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Z3FoaGZncmRkZ3Z4a292Y2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjkwNTAsImV4cCI6MjA5MTUwNTA1MH0.n16R741D8J993Xs9c8QNO3iT4lTWvnRhvgmN1ph2lqs";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Registro { id: string; [key: string]: unknown; }

function val(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "✅ Sí" : "❌ No";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

const SECCIONES = [
  {
    num: "01", title: "Identidad del Productor",
    campos: [
      { label: "Nombre completo", key: "nombre" },
      { label: "DNI", key: "dni" },
      { label: "Teléfono / WhatsApp", key: "telefono" },
      { label: "Familiar / contacto", key: "nombre_familiar" },
      { label: "Tel. familiar", key: "telefono_familiar" },
      { label: "Provincia", key: "provincia" },
      { label: "Comunidad", key: "comunidad" },
      { label: "Distrito", key: "distrito" },
      { label: "Personas que trabajan parcela", key: "personas_trabajan" },
      { label: "Relación laboral", key: "relacion_laboral" },
      { label: "Años de experiencia", key: "anios_experiencia" },
      { label: "Tiene cuenta bancaria", key: "tiene_cuenta" },
      { label: "Crédito agrario", key: "recibio_credito_agrario" },
      { label: "Tiene deuda con otro comprador", key: "tiene_deuda" },
      { label: "Razón de venta a comprador actual", key: "razon_comprador" },
      { label: "Disposición a nuevas prácticas", key: "disposicion" },
      { label: "Tier estratégico", key: "tier" },
      { label: "Justificación del tier", key: "justificacion_tier" },
    ]
  },
  {
    num: "02", title: "Parcela y Georreferenciación",
    campos: [
      { label: "Nombre de la parcela", key: "nombre_parcela" },
      { label: "¿Tiene título o constancia?", key: "tiene_titulo" },
      { label: "Superficie total (ha)", key: "superficie_total" },
      { label: "Área Cacao Chuncho (ha)", key: "area_cacao" },
      { label: "Otros cultivos", key: "otros_cultivos" },
      { label: "Fuente hídrica", key: "fuente_hidrica" },
      { label: "Tipo de suelo", key: "tipo_suelo" },
      { label: "Sistema de sombra", key: "sistema_sombra" },
      { label: "Distancia a vía principal (km)", key: "distancia_via" },
      { label: "Tiempo de flete a acopio (h)", key: "tiempo_flete" },
      { label: "Código de parcela", key: "codigo_parcela" },
      { label: "Latitud", key: "lat_parcela" },
      { label: "Longitud", key: "lng_parcela" },
      { label: "Altitud GPS (msnm)", key: "altitud_gps" },
      { label: "Perímetro (m)", key: "perimetro_radio" },
    ]
  },
  {
    num: "03", title: "Características del Cultivo",
    campos: [
      { label: "Edad de las plantas (años)", key: "edad_plantas" },
      { label: "Distanciamiento entre plantas", key: "distanciamiento" },
      { label: "N.° estimado de plantas", key: "numero_plantas" },
      { label: "% plantas en producción", key: "pct_produccion" },
      { label: "Grados Brix", key: "grados_brix" },
      { label: "Fecha último muestreo Brix", key: "fecha_muestreo_brix" },
      { label: "Color predominante del grano", key: "color_grano" },
      { label: "Prácticas de post-cosecha", key: "practicas_post_cosecha" },
      { label: "Herramienta de cosecha", key: "herramienta_cosecha" },
      { label: "Notas sensoriales", key: "notas_sensoriales" },
    ]
  },
  {
    num: "04", title: "Producción y Cosecha",
    campos: [
      { label: "Estimado anual (kg baba)", key: "estimado_anual" },
      { label: "Rendimiento histórico", key: "rendimiento_historico" },
      { label: "Comprador actual", key: "comprador_actual" },
      { label: "Almacenamiento disponible", key: "almacenamiento" },
      { label: "Tipo de acopio", key: "tipo_acopio" },
      { label: "Forma de transporte", key: "transporte" },
      { label: "Costo de flete (S/.)", key: "costo_flete" },
      { label: "Meses de cosecha", key: "meses_cosecha" },
      { label: "Cosecha principal 1 — meses", key: "cosecha_principal1_meses" },
      { label: "Cosecha principal 1 — kg baba", key: "cosecha_principal1_baba" },
      { label: "Cosecha principal 1 — kg seco", key: "cosecha_principal1_seco" },
      { label: "Cosecha principal 1 — forma pago", key: "cosecha_principal1_pago" },
      { label: "Cosecha principal 2 — meses", key: "cosecha_principal2_meses" },
      { label: "Cosecha principal 2 — kg baba", key: "cosecha_principal2_baba" },
      { label: "Cosecha principal 2 — kg seco", key: "cosecha_principal2_seco" },
      { label: "Cosecha intermedia — meses", key: "cosecha_intermedia_meses" },
      { label: "Cosecha intermedia — kg baba", key: "cosecha_intermedia_baba" },
      { label: "Total anual — kg baba", key: "total_anual_baba" },
      { label: "Total anual — kg seco", key: "total_anual_seco" },
    ]
  },
  {
    num: "05", title: "Sanidad Vegetal",
    campos: [
      { label: "Plaga o enfermedad principal", key: "plaga_principal" },
      { label: "% afectación plaga principal", key: "pct_afectacion_principal" },
      { label: "Plaga secundaria", key: "plaga_secundaria" },
      { label: "% afectación plaga secundaria", key: "pct_afectacion_secundaria" },
      { label: "Meses de mayor presión de plaga", key: "meses_presion_plaga" },
      { label: "Otra plaga especificada", key: "plaga_otra" },
      { label: "Control ecológico / cultural", key: "control_ecologico" },
      { label: "Control biológico", key: "control_biologico" },
      { label: "Control químico", key: "control_quimico" },
      { label: "Sin control aplicado", key: "control_ninguno" },
      { label: "Productos y dosis utilizados", key: "productos_control" },
      { label: "Frecuencia de control", key: "frecuencia_control" },
    ]
  },
  {
    num: "06", title: "Certificación Orgánica",
    campos: [
      { label: "Estado de certificación", key: "estado_certificacion" },
      { label: "Entidad certificadora", key: "entidad_certificadora" },
      { label: "N.° de certificado", key: "numero_certificado" },
      { label: "Fecha de vencimiento", key: "fecha_vencimiento" },
      { label: "NOP — USDA Organic", key: "cert_nop" },
      { label: "EU Organic", key: "cert_eu" },
      { label: "JAS — Japón", key: "cert_jas" },
      { label: "Fairtrade", key: "cert_fairtrade" },
      { label: "Rainforest Alliance", key: "cert_rainforest" },
      { label: "Observaciones certificación", key: "obs_certificacion" },
    ]
  },
  {
    num: "07", title: "Capacitación y Asistencia Técnica",
    campos: [
      { label: "Capacitado por Municipalidad", key: "cap_municipalidad" },
      { label: "Capacitado por MIDAGRI", key: "cap_midgri" },
      { label: "Capacitado por GORE Cusco", key: "cap_gore" },
      { label: "Capacitado por DEVIDA", key: "cap_devida" },
      { label: "Capacitado por ONG", key: "cap_ong" },
      { label: "Capacitado por empresa compradora", key: "cap_empresa" },
      { label: "Capacitado por cooperativa", key: "cap_cooperativa" },
      { label: "Sin capacitación recibida", key: "cap_ninguna" },
      { label: "Nombre de ONG", key: "nombre_ong" },
      { label: "Tema de capacitación recibida", key: "tema_capacitacion" },
      { label: "Interés: Manejo agronómico", key: "tema_manejo" },
      { label: "Interés: Fermentación y secado", key: "tema_fermentacion" },
      { label: "Interés: Control de plagas", key: "tema_plagas" },
      { label: "Interés: Certificación orgánica", key: "tema_certificacion" },
      { label: "Interés: Gestión financiera", key: "tema_financiero" },
      { label: "Interés: Buenas prácticas", key: "tema_buenas_practicas" },
      { label: "Interés: Acceso a mercados", key: "tema_mercados" },
      { label: "Interés: Cambio climático", key: "tema_clima" },
      { label: "Interés: GPS y trazabilidad", key: "tema_gps" },
      { label: "Interés: Asociatividad", key: "tema_asociatividad" },
      { label: "Interés: Nutrición familiar", key: "tema_nutricion" },
      { label: "Comentarios del productor", key: "comentarios_productor" },
    ]
  },
  {
    num: "08", title: "Evaluación Interna del Acopiador",
    campos: [
      { label: "Confiabilidad del productor (1–5)", key: "confiabilidad" },
      { label: "Calidad promedio del grano", key: "calidad_grano" },
      { label: "Potencial estratégico", key: "potencial_estrategico" },
      { label: "Riesgo de pérdida ante competencia", key: "riesgo_perdida" },
      { label: "Acción de fidelización recomendada", key: "accion_fidelizacion" },
      { label: "Fecha de próximo seguimiento", key: "fecha_seguimiento" },
      { label: "Notas confidenciales del acopiador", key: "notas_confidenciales" },
    ]
  },
  {
    num: "09", title: "Declaración y Datos del Registro",
    campos: [
      { label: "Nombre del acopiador", key: "nombre_acopiador" },
      { label: "DNI del acopiador", key: "dni_acopiador" },
      { label: "Zona / ruta de acopio", key: "zona_ruta" },
      { label: "Folio", key: "folio" },
      { label: "Fecha del registro", key: "fecha" },
      { label: "Fecha y lugar del levantamiento", key: "fecha_lugar" },
      { label: "Declaración jurada", key: "declaracion_jurada" },
    ]
  },
];

export default function AdminPanel() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Registro | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchRegistros(); }, []);

  const fetchRegistros = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("registros").select("*").order("created_at", { ascending: false });
    if (error) { setError(error.message); setLoading(false); return; }
    setRegistros(data || []);
    setLoading(false);
  };

  const deleteRegistro = async (id: string) => {
    setDeleting(true);
    const { error } = await supabase.from("registros").delete().eq("id", id);
    setDeleting(false);
    setConfirmDelete(null);
    if (error) { setError(error.message); return; }
    setRegistros(prev => prev.filter(r => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtrados = registros.filter(r =>
    (String(r.nombre || "")).toLowerCase().includes(search.toLowerCase()) ||
    (String(r.comunidad || "")).toLowerCase().includes(search.toLowerCase()) ||
    (String(r.folio || "")).toLowerCase().includes(search.toLowerCase()) ||
    (String(r.dni || "")).includes(search)
  );

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-amber-800 rounded-full inline-block" />
    </div>
  );

  if (error) return <div className="p-4 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm">{error}</div>;

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

      {/* Búsqueda */}
      {!selected && (
        <div className="flex gap-2">
          <input className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            placeholder="Buscar por nombre, comunidad, folio o DNI..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={fetchRegistros}
            className="px-4 py-2.5 rounded-lg text-sm font-bold bg-amber-600 text-white hover:bg-amber-700 transition-all">
            <i className="ri-refresh-line" />
          </button>
        </div>
      )}

      {/* Lista */}
      {!selected ? (
        <div className="space-y-2">
          {filtrados.length === 0 && <div className="text-center py-10 text-stone-400 text-sm">No hay registros.</div>}
          {filtrados.map(r => (
            <div key={String(r.id)} onClick={() => setSelected(r)}
              className="rounded-xl bg-amber-50 border border-amber-200 p-4 cursor-pointer hover:border-amber-400 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                {r.foto_productor && (
                  <img src={String(r.foto_productor)} alt="" className="w-14 h-14 rounded-lg object-cover border border-amber-200 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">#{String(r.folio || "—")}</span>
                    {r.tier && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: r.tier === "A" ? "#166534" : r.tier === "B" ? "#92400e" : "#44403c" }}>TIER {String(r.tier)}</span>}
                    {r.declaracion_jurada && <span className="text-[10px] font-bold text-emerald-700">✅ DJ</span>}
                  </div>
                  <p className="text-sm font-bold text-stone-800 truncate">{String(r.nombre || "Sin nombre")}</p>
                  <p className="text-xs text-stone-500">{String(r.comunidad || "—")} · {String(r.distrito || "—")} · {String(r.provincia || "—")}</p>
                  <p className="text-xs text-stone-400 mt-0.5">Acopiador: {String(r.nombre_acopiador || "—")} · {String(r.fecha || "").slice(0, 10)}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {r.lat_parcela && r.lng_parcela && (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${r.lat_parcela},${r.lng_parcela}`}
                      target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all">
                      <i className="ri-map-pin-line text-base" />
                    </a>
                  )}
                  <button onClick={e => { e.stopPropagation(); setConfirmDelete(String(r.id)); }}
                    className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all">
                    <i className="ri-delete-bin-line text-base" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── DETALLE COMPLETO ── */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-800 transition-colors">
              <i className="ri-arrow-left-line" /> Volver a la lista
            </button>
            <button onClick={() => setConfirmDelete(String(selected.id))}
              className="flex items-center gap-2 text-sm font-bold text-red-600 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all">
              <i className="ri-delete-bin-line" /> Eliminar registro
            </button>
          </div>

          {/* Fotos */}
          {(selected.foto_productor || selected.foto_acopiador_productor) && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-4">Fotografías</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {selected.foto_productor && (
                  <div className="text-center">
                    <img src={String(selected.foto_productor)} alt="Productor" className="w-44 h-44 object-cover rounded-xl border-2 border-amber-300" />
                    <p className="text-xs font-bold text-amber-700 mt-2">Foto del productor</p>
                  </div>
                )}
                {selected.foto_acopiador_productor && (
                  <div className="text-center">
                    <img src={String(selected.foto_acopiador_productor)} alt="Conjunto" className="h-44 object-cover rounded-xl border-2 border-amber-300" />
                    <p className="text-xs font-bold text-amber-700 mt-2">Acopiador con productor</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mapa */}
          {selected.lat_parcela && selected.lng_parcela && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">📍 Ubicación satelital de la parcela</p>
              <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${selected.lat_parcela},${selected.lng_parcela}&zoom=15&size=600x250&maptype=hybrid&markers=color:red|label:P|${selected.lat_parcela},${selected.lng_parcela}&key=AIzaSyAEgkpN1aI0tna5cwQ6yGE9_k2HsMfHV2o`}
                alt="Mapa parcela" className="w-full rounded-lg border border-amber-200" />
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg font-mono text-stone-700">Lat: {Number(selected.lat_parcela).toFixed(6)}°</span>
                <span className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg font-mono text-stone-700">Lng: {Number(selected.lng_parcela).toFixed(6)}°</span>
                {selected.altitud_gps && <span className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg font-mono text-stone-700">Alt: {String(selected.altitud_gps)} msnm</span>}
                {selected.perimetro_radio && <span className="text-xs bg-white border border-amber-200 px-3 py-1.5 rounded-lg font-mono text-stone-700">Radio: {Number(selected.perimetro_radio) >= 1000 ? `${Number(selected.perimetro_radio)/1000} km` : `${selected.perimetro_radio} m`}</span>}
                <a href={`https://www.google.com/maps/search/?api=1&query=${selected.lat_parcela},${selected.lng_parcela}`}
                  target="_blank" rel="noreferrer"
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition-all">
                  🗺️ Abrir en Google Maps
                </a>
              </div>
            </div>
          )}

          {/* Secciones ordenadas */}
          {SECCIONES.map(sec => {
            const camposConDatos = sec.campos.filter(f => {
              const v = selected[f.key];
              return v !== null && v !== undefined && v !== "" && v !== false;
            });
            return (
              <div key={sec.num} className="rounded-xl bg-amber-50 border border-amber-200 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-amber-100 border-b border-amber-200">
                  <span className="w-7 h-7 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{sec.num}</span>
                  <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">{sec.title}</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sec.campos.map(f => (
                    <div key={f.key} className="bg-white border border-amber-100 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">{f.label}</p>
                      <p className={`text-sm font-medium mt-0.5 break-words ${val(selected[f.key]) === "—" ? "text-stone-300 italic" : "text-stone-700"}`}>
                        {val(selected[f.key])}
                      </p>
                    </div>
                  ))}
                  {camposConDatos.length === 0 && (
                    <p className="text-xs text-stone-400 italic col-span-2">No se completaron datos en esta sección.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-delete-bin-line text-red-600 text-lg" />
              </div>
              <div>
                <p className="font-bold text-stone-800">¿Eliminar este registro?</p>
                <p className="text-xs text-stone-500 mt-0.5">Esta acción no se puede deshacer. El registro se eliminará permanentemente de Supabase.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold border border-stone-300 text-stone-600 hover:bg-stone-50 transition-all">
                Cancelar
              </button>
              <button onClick={() => deleteRegistro(confirmDelete)} disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60">
                {deleting ? <><i className="ri-loader-4-line animate-spin mr-1" />Eliminando...</> : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

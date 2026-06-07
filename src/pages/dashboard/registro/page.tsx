import { useState, useRef } from "react";

// Etiquetas legibles para los campos obligatorios
const FIELD_LABELS: Partial<Record<string, string>> = {
  nombre: "Nombre completo",
  dni: "DNI",
  telefono: "Teléfono",
  comunidad: "Comunidad",
  distrito: "Distrito",
  fotoProductor: "Foto del productor",
  nombreParcela: "Nombre de la parcela",
  altitud: "Altitud",
  superficieTotal: "Superficie total",
  areaCacao: "Área de cacao",
  fuenteHidrica: "Fuente hídrica",
  edadPlantas: "Edad de plantas",
  distanciamiento: "Distanciamiento",
  gradosBrix: "Grados Brix",
  estimadoAnual: "Estimado anual",
  tipoAcopio: "Tipo de acopio",
  plagaPrincipal: "Plaga principal",
  pctAfectacionPrincipal: "% Afectación principal",
  estadoCertificacion: "Estado de certificación",
  firmaProductor: "Firma del productor",
  firmaAcopiador: "Firma del acopiador",
  declaracionJurada: "Declaración jurada (debe aceptarse)",
  viasTrocha: "Al menos una vía de acceso",
};

type SectionId = "identidad" | "parcela" | "cultivo" | "produccion" | "sanidad" | "certificacion" | "capacitacion" | "evaluacion" | "firmas";

interface FormData {
  folio: string; fecha: string; nombreAcopiador: string; zonaRuta: string; totalProductores: string;
  nombre: string; dni: string; telefono: string; telefonoFamiliar: string; nombreFamiliar: string;
  comunidad: string; distrito: string; fotoProductor: string; videoProductor: string;
  personasHogar: string; personasTrabajan: string; relacionLaboral: string; aniosExperiencia: string;
  tieneCuenta: string; recibioCreditoAgrario: string; tieneDeuda: string; antiguedadComprador: string;
  razonComprador: string; disposicion: string; tier: string; justificacionTier: string;
  nombreParcela: string; altitud: string; superficieTotal: string; areaCacao: string; otrosCultivos: string;
  viasTrocha: boolean; viasAfirmada: boolean; viasAsfaltado: boolean; viasHerradura: boolean; viasFluvial: boolean; viasPie: boolean;
  distanciaVia: string; tiempoFlete: string; tipoSuelo: string; sistemaSombra: string; fuenteHidrica: string;
  gpsVertices: { vertice: string; lat: string; lon: string; alt: string }[];
  codigoParcela: string;
  edadPlantas: string; distanciamiento: string; numeroPlantas: string; pctProduccion: string;
  gradosBrix: string; fechaMuestreoBrix: string; colorGrano: string; practicasPostCosecha: string;
  herramientaCosecha: string; notasSensoriales: string;
  estimadoAnual: string; rendimientoHistorico: string; compradorActual: string; precioKg: string;
  almacenamiento: string; tipoAcopio: string; transporte: string; costoFlete: string;
  mesesCosecha: string[];
  cosechaPrincipal1Meses: string; cosechaPrincipal1Baba: string; cosechaPrincipal1Seco: string; cosechaPrincipal1Pago: string; cosechaPrincipal1Obs: string;
  cosechaPrincipal2Meses: string; cosechaPrincipal2Baba: string; cosechaPrincipal2Seco: string; cosechaPrincipal2Pago: string; cosechaPrincipal2Obs: string;
  cosechaIntermediaMeses: string; cosechaIntermediaBaba: string; cosechaIntermediaSeco: string; cosechaIntermediaPago: string; cosechaIntermedaObs: string;
  totalAnualBaba: string; totalAnualSeco: string; totalAnualObs: string;
  plagaPrincipal: string; pctAfectacionPrincipal: string; plagaSecundaria: string; pctAfectacionSecundaria: string;
  mesesPresionPlaga: string; plagaOtra: string;
  controlEcologico: boolean; controlBiologico: boolean; controlQuimico: boolean; controlNinguno: boolean;
  productosControl: string; frecuenciaControl: string;
  estadoCertificacion: string; entidadCertificadora: string; numeroCertificado: string; fechaVencimiento: string;
  certNOP: boolean; certEU: boolean; certJAS: boolean; certFairtrade: boolean; certRainforest: boolean;
  obsCertificacion: string;
  capMunicipalidad: boolean; capMIDGRI: boolean; capGORE: boolean; capDEVIDA: boolean;
  capONG: boolean; capEmpresa: boolean; capCooperativa: boolean; capNinguna: boolean;
  nombreONG: string; temaCapacitacion: string;
  temaManejo: boolean; temaFermentacion: boolean; temaPlagas: boolean;
  temaCertificacion: boolean; temaFinanciero: boolean; temaBuenasPracticas: boolean;
  temaMercados: boolean; temaClima: boolean; temaGPS: boolean; temaAsociatividad: boolean; temaNutricion: boolean;
  comentariosProductor: string;
  confiabilidad: string; calidadGrano: string; potencialEstrategico: string;
  riesgoPerdida: string; accionFidelizacion: string; fechaSeguimiento: string; notasConfidenciales: string;
  firmaProductor: string; huellaProductor: string; firmaAcopiador: string; fechaLugar: string; declaracionJurada: boolean;
}

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const SECTIONS: { id: SectionId; num: string; title: string; icon: string; required: (keyof FormData)[] }[] = [
  { id: "identidad",    num: "01", title: "Identidad del Productor",      icon: "ri-user-line",           required: ["nombre","dni","telefono","comunidad","distrito","fotoProductor"] },
  { id: "parcela",      num: "02", title: "Parcela y Georreferenciación", icon: "ri-map-pin-line",         required: ["nombreParcela","altitud","superficieTotal","areaCacao","fuenteHidrica"] },
  { id: "cultivo",      num: "03", title: "Características del Cultivo",  icon: "ri-plant-line",           required: ["edadPlantas","distanciamiento","gradosBrix"] },
  { id: "produccion",   num: "04", title: "Producción y Cosecha",         icon: "ri-shopping-basket-line", required: ["estimadoAnual","tipoAcopio"] },
  { id: "sanidad",      num: "05", title: "Sanidad Vegetal",              icon: "ri-shield-line",          required: ["plagaPrincipal","pctAfectacionPrincipal"] },
  { id: "certificacion",num: "06", title: "Certificación Orgánica",       icon: "ri-award-line",           required: ["estadoCertificacion"] },
  { id: "capacitacion", num: "07", title: "Capacitación y Asistencia",    icon: "ri-book-open-line",       required: [] },
  { id: "evaluacion",   num: "08", title: "Evaluación del Acopiador",     icon: "ri-file-list-line",       required: [] },
  { id: "firmas",       num: "09", title: "Firmas y Declaración",         icon: "ri-pen-nib-line",         required: ["firmaProductor","firmaAcopiador","declaracionJurada"] },
];

const SECTION_LABELS: Record<SectionId, string> = {
  identidad: "01 · Identidad",
  parcela: "02 · Parcela",
  cultivo: "03 · Cultivo",
  produccion: "04 · Producción",
  sanidad: "05 · Sanidad",
  certificacion: "06 · Certificación",
  capacitacion: "07 · Capacitación",
  evaluacion: "08 · Evaluación",
  firmas: "09 · Firmas",
};

const init: FormData = {
  folio:"", fecha: new Date().toISOString().split("T")[0], nombreAcopiador:"", zonaRuta:"", totalProductores:"",
  nombre:"", dni:"", telefono:"", telefonoFamiliar:"", nombreFamiliar:"", comunidad:"", distrito:"",
  fotoProductor:"", videoProductor:"", personasHogar:"", personasTrabajan:"", relacionLaboral:"", aniosExperiencia:"",
  tieneCuenta:"", recibioCreditoAgrario:"", tieneDeuda:"", antiguedadComprador:"", razonComprador:"", disposicion:"", tier:"", justificacionTier:"",
  nombreParcela:"", altitud:"", superficieTotal:"", areaCacao:"", otrosCultivos:"",
  viasTrocha:false, viasAfirmada:false, viasAsfaltado:false, viasHerradura:false, viasFluvial:false, viasPie:false,
  distanciaVia:"", tiempoFlete:"", tipoSuelo:"", sistemaSombra:"", fuenteHidrica:"",
  gpsVertices:[{vertice:"V1",lat:"",lon:"",alt:""},{vertice:"V2",lat:"",lon:"",alt:""},{vertice:"V3",lat:"",lon:"",alt:""}],
  codigoParcela:"",
  edadPlantas:"", distanciamiento:"", numeroPlantas:"", pctProduccion:"", gradosBrix:"", fechaMuestreoBrix:"", colorGrano:"",
  practicasPostCosecha:"", herramientaCosecha:"", notasSensoriales:"",
  estimadoAnual:"", rendimientoHistorico:"", compradorActual:"", precioKg:"", almacenamiento:"", tipoAcopio:"", transporte:"", costoFlete:"",
  mesesCosecha:[],
  cosechaPrincipal1Meses:"", cosechaPrincipal1Baba:"", cosechaPrincipal1Seco:"", cosechaPrincipal1Pago:"", cosechaPrincipal1Obs:"",
  cosechaPrincipal2Meses:"", cosechaPrincipal2Baba:"", cosechaPrincipal2Seco:"", cosechaPrincipal2Pago:"", cosechaPrincipal2Obs:"",
  cosechaIntermediaMeses:"", cosechaIntermediaBaba:"", cosechaIntermediaSeco:"", cosechaIntermediaPago:"", cosechaIntermedaObs:"",
  totalAnualBaba:"", totalAnualSeco:"", totalAnualObs:"",
  plagaPrincipal:"", pctAfectacionPrincipal:"", plagaSecundaria:"", pctAfectacionSecundaria:"", mesesPresionPlaga:"", plagaOtra:"",
  controlEcologico:false, controlBiologico:false, controlQuimico:false, controlNinguno:false,
  productosControl:"", frecuenciaControl:"",
  estadoCertificacion:"", entidadCertificadora:"", numeroCertificado:"", fechaVencimiento:"",
  certNOP:false, certEU:false, certJAS:false, certFairtrade:false, certRainforest:false, obsCertificacion:"",
  capMunicipalidad:false, capMIDGRI:false, capGORE:false, capDEVIDA:false, capONG:false, capEmpresa:false, capCooperativa:false, capNinguna:false,
  nombreONG:"", temaCapacitacion:"",
  temaManejo:false, temaFermentacion:false, temaPlagas:false, temaCertificacion:false, temaFinanciero:false, temaBuenasPracticas:false,
  temaMercados:false, temaClima:false, temaGPS:false, temaAsociatividad:false, temaNutricion:false,
  comentariosProductor:"",
  confiabilidad:"", calidadGrano:"", potencialEstrategico:"", riesgoPerdida:"", accionFidelizacion:"", fechaSeguimiento:"", notasConfidenciales:"",
  firmaProductor:"", huellaProductor:"", firmaAcopiador:"", fechaLugar:"", declaracionJurada:false,
};

// ─── CREMA STYLE HELPERS ─────────────────────────────────────────────────────
const card = "bg-amber-50 border border-amber-200 rounded-xl shadow-sm p-5 md:p-6 overflow-hidden";
const inp  = "w-full px-3 py-2.5 bg-white border-2 border-amber-300 rounded-md text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all";
const inpErr = "w-full px-3 py-2.5 bg-white border-2 border-red-500 rounded-md text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all";
const lbl  = "block text-xs font-bold text-stone-700 uppercase tracking-widest mb-1.5";
const sublbl = "text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-2 pl-2 border-l-4 border-amber-500";
const reqStar = <span className="text-red-600 ml-0.5 font-black">*</span>;
const guide = "flex items-center gap-1.5 text-[11px] font-bold text-red-600 mb-2 animate-pulse";
const selectStyle = { background: 'white', color: '#1c1917' };

// ─── TOAST COMPONENT ─────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 max-w-sm w-full mx-4 animate-bounce-in">
      <div className="flex items-start gap-3 bg-red-600 text-white rounded-xl shadow-2xl px-5 py-4 border border-red-400">
        <i className="ri-error-warning-fill text-xl flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-black text-sm uppercase tracking-wide mb-0.5">¡Atención!</p>
          <p className="text-sm leading-snug">{msg}</p>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none cursor-pointer">✕</button>
      </div>
    </div>
  );
}

// ─── MEDIA UPLOAD ─────────────────────────────────────────────────────────────
function MediaUpload({ label, accept, value, onChange, required, icon, hint, capture }: {
  label: string; accept: string; value: string; onChange: (v: string) => void;
  required?: boolean; icon: string; hint: string; capture?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const isVideo = accept.includes("video");
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label className={lbl}>{label}{required && reqStar}</label>
      {!value && (
        <p className={guide}><i className="ri-arrow-down-line" /> 👆 Toca aquí para {isVideo ? "grabar o subir un video" : "tomar una foto o subir imagen"}</p>
      )}
      <div
        onClick={() => ref.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all min-h-[140px] ${value ? "border-green-500 bg-green-50" : "border-amber-400 bg-amber-50 hover:border-amber-600 hover:bg-amber-100"}`}
      >
        <input ref={ref} type="file" accept={accept} capture={capture as "environment" | "user" | undefined} onChange={handleFile} className="hidden" />
        {value ? (
          isVideo
            ? <video src={value} className="max-h-36 rounded-lg" controls />
            : <img src={value} alt="" className="max-h-36 rounded-lg object-cover" />
        ) : (
          <>
            <i className={`${icon} text-3xl text-amber-600`} />
            <div className="text-center">
              <p className="text-sm font-bold text-stone-700">Toca aquí para {isVideo ? "grabar / subir video" : "tomar foto / subir imagen"}</p>
              <p className="text-[11px] text-stone-500 mt-1">{hint}</p>
            </div>
          </>
        )}
        {value && (
          <button type="button" onClick={e => { e.stopPropagation(); onChange(""); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-red-600 text-xs hover:bg-red-200">
            <i className="ri-close-line" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CHECKBOX ────────────────────────────────────────────────────────────────
function Chk({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${checked ? "bg-amber-600 border-amber-500" : "bg-white border-amber-400 group-hover:border-amber-600"}`}>
        {checked && <i className="ri-check-line text-white text-[11px]" />}
      </div>
      <span className="text-sm font-medium text-stone-700">{label}</span>
    </label>
  );
}

// ─── TIER CARD ───────────────────────────────────────────────────────────────
function TierCard({ value, selected, badge, desc, color, onSelect }: {
  value: string; selected: boolean; badge: string; desc: string; color: string; onSelect: () => void;
}) {
  return (
    <div onClick={onSelect}
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selected ? "border-amber-600 bg-amber-100" : "border-amber-200 bg-white hover:border-amber-400"}`}>
      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 text-white" style={{ background: color }}>{badge}</span>
      <p className="text-xs text-stone-600">{desc}</p>
    </div>
  );
}

// ─── MONTH GRID ──────────────────────────────────────────────────────────────
function MonthGrid({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {MESES.map(m => {
        const sel = selected.includes(m);
        return (
          <button key={m} type="button"
            onClick={() => onChange(sel ? selected.filter(x => x !== m) : [...selected, m])}
            className={`py-1.5 text-[11px] font-bold rounded border-2 transition-all ${sel ? "bg-amber-600 border-amber-500 text-white" : "bg-white border-amber-300 text-stone-600 hover:border-amber-500"}`}>
            {m}
          </button>
        );
      })}
    </div>
  );
}

// ─── GPS ROWS ────────────────────────────────────────────────────────────────
function GPSRows({ rows, onChange }: { rows: FormData["gpsVertices"]; onChange: (v: FormData["gpsVertices"]) => void }) {
  const update = (i: number, k: keyof FormData["gpsVertices"][0], v: string) =>
    onChange(rows.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
          <div><label className={lbl}>Vértice</label><input className={inp} value={r.vertice} onChange={e => update(i, "vertice", e.target.value)} /></div>
          <div><label className={lbl}>Lat. (°S){reqStar}</label><input className={inp} placeholder="-12.XXXXX" value={r.lat} onChange={e => update(i, "lat", e.target.value)} /></div>
          <div><label className={lbl}>Long. (°W){reqStar}</label><input className={inp} placeholder="-73.XXXXX" value={r.lon} onChange={e => update(i, "lon", e.target.value)} /></div>
          <div><label className={lbl}>Alt. (msnm)</label><input className={inp} placeholder="msnm" value={r.alt} onChange={e => update(i, "alt", e.target.value)} /></div>
          <button type="button" onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
            className="py-2 px-3 rounded-md text-xs font-bold bg-red-100 border border-red-300 text-red-600 hover:bg-red-200 transition-all">✕ Quitar</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...rows, { vertice: `V${rows.length + 1}`, lat: "", lon: "", alt: "" }])}
        className="mt-1 px-4 py-2 rounded-md text-xs font-bold border-2 border-amber-400 text-amber-700 bg-white hover:bg-amber-50 transition-all">
        <i className="ri-add-line mr-1" /> Agregar vértice GPS
      </button>
    </div>
  );
}

// ─── FOLIO HELPERS ───────────────────────────────────────────────────────────
function getNextFolio(): string {
  const count = parseInt(localStorage.getItem("registro_folio_count") || "0", 10) + 1;
  return String(count).padStart(3, "0");
}
function incrementFolio(): string {
  const count = parseInt(localStorage.getItem("registro_folio_count") || "0", 10) + 1;
  localStorage.setItem("registro_folio_count", String(count));
  return String(count).padStart(3, "0");
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Registro() {
  const [data, setData] = useState<FormData>({ ...init, folio: getNextFolio() });
  const [active, setActive] = useState<SectionId>("identidad");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationModal, setValidationModal] = useState<{ section: string; num: string; id: SectionId; fields: string[] }[] | null>(null);

  const upd = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setData(d => ({ ...d, [k]: v }));
    setErrors(e => ({ ...e, [k]: false }));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  };

  const validateSection = (id: SectionId): boolean => {
    const sec = SECTIONS.find(s => s.id === id)!;
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    let ok = true;
    for (const field of sec.required) {
      const val = data[field];
      const empty = typeof val === "boolean" ? !val : !String(val).trim();
      if (empty) { newErrors[field] = true; ok = false; }
    }
    if (id === "parcela") {
      const hasVia = data.viasTrocha || data.viasAfirmada || data.viasAsfaltado || data.viasHerradura || data.viasFluvial || data.viasPie;
      if (!hasVia) { newErrors["viasTrocha"] = true; ok = false; }
    }
    setErrors(e => ({ ...e, ...newErrors }));
    return ok;
  };

  const goTo = (nextId: SectionId) => {
    setActive(nextId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    const idx = SECTIONS.findIndex(s => s.id === active);
    if (idx < SECTIONS.length - 1) goTo(SECTIONS[idx + 1].id);
  };

  const goPrev = () => {
    const idx = SECTIONS.findIndex(s => s.id === active);
    if (idx > 0) { setActive(SECTIONS[idx - 1].id); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const handleSubmit = () => {
    // Recopilar TODOS los errores de TODAS las secciones
    const allMissing: { section: string; num: string; id: SectionId; fields: string[] }[] = [];
    const allNewErrors: Partial<Record<keyof FormData, boolean>> = {};

    for (const sec of SECTIONS) {
      const missingFields: string[] = [];
      for (const field of sec.required) {
        const val = data[field];
        const empty = typeof val === "boolean" ? !val : !String(val).trim();
        if (empty) {
          allNewErrors[field] = true;
          missingFields.push(FIELD_LABELS[field] || String(field));
        }
      }
      // Validación especial de vías en parcela
      if (sec.id === "parcela") {
        const hasVia = data.viasTrocha || data.viasAfirmada || data.viasAsfaltado || data.viasHerradura || data.viasFluvial || data.viasPie;
        if (!hasVia) {
          allNewErrors["viasTrocha"] = true;
          missingFields.push(FIELD_LABELS["viasTrocha"] || "Vía de acceso");
        }
      }
      if (missingFields.length > 0) {
        allMissing.push({ section: sec.title, num: sec.num, id: sec.id, fields: missingFields });
      }
    }

    setErrors(e => ({ ...e, ...allNewErrors }));

    if (allMissing.length > 0) {
      setValidationModal(allMissing);
      return;
    }
    // Confirmar folio e incrementar contador
    const confirmedFolio = incrementFolio();
    const now = new Date();
    const fechaHora = now.toISOString().split("T")[0] + " " + now.toTimeString().slice(0, 5);
    setData(d => ({ ...d, folio: confirmedFolio, fecha: fechaHora }));
    setSubmitted(true);
  };

  const filled = SECTIONS.filter(s => !s.required.length || s.required.every(f => {
    const v = data[f]; return typeof v === "boolean" ? v : String(v).trim();
  })).length;
  const pct = Math.round((filled / SECTIONS.length) * 100);
  const isErr = (f: keyof FormData) => !!errors[f];
  const I = (f: keyof FormData) => isErr(f) ? inpErr : inp;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-600">
          <i className="ri-check-double-line text-4xl text-white" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>¡Registro Enviado!</h2>
        <p className="text-sm text-stone-600 max-w-sm">La ficha del productor fue completada y firmada. Los datos tienen validez de declaración jurada.</p>
        <button onClick={() => { setData({ ...init, folio: getNextFolio() }); setSubmitted(false); setActive("identidad"); }}
          className="mt-4 px-6 py-3 rounded-lg text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 transition-all">
          <i className="ri-add-line mr-2" /> Nuevo registro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* MODAL DE VALIDACIÓN — muestra todos los campos faltantes */}
      {validationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col border-4 border-red-500">
            {/* Header */}
            <div className="flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-t-xl">
              <i className="ri-error-warning-fill text-2xl flex-shrink-0" />
              <div className="flex-1">
                <p className="font-black text-base uppercase tracking-wide leading-tight">No se puede enviar el registro</p>
                <p className="text-sm text-red-100 mt-0.5">Faltan {validationModal.reduce((a, s) => a + s.fields.length, 0)} campo(s) obligatorio(s) en {validationModal.length} sección(es)</p>
              </div>
              <button onClick={() => setValidationModal(null)} className="text-white/70 hover:text-white text-2xl leading-none cursor-pointer ml-2">✕</button>
            </div>
            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
              {validationModal.map(sec => (
                <div key={sec.id} className="border-2 border-amber-300 rounded-xl overflow-hidden">
                  <div className="bg-amber-100 px-4 py-2 flex items-center gap-2">
                    <span className="text-xs font-black text-amber-800 bg-amber-700 text-white rounded-full px-2 py-0.5">{sec.num}</span>
                    <span className="text-sm font-bold text-amber-900">{sec.section}</span>
                  </div>
                  <ul className="px-4 py-3 space-y-1.5">
                    {sec.fields.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-stone-700">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-stone-200 flex gap-3">
              <button
                onClick={() => {
                  const first = validationModal[0];
                  setActive(first.id);
                  setValidationModal(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 transition-all cursor-pointer"
              >
                <i className="ri-arrow-go-back-line mr-1" /> Ir a la primera sección con errores
              </button>
              <button
                onClick={() => setValidationModal(null)}
                className="px-4 py-2.5 rounded-lg text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTADA */}
      <div className={card}>
        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.3em] mb-1">Ficha de Registro · Cacao Chuncho Orgánico</p>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          FICHA DE REGISTRO: NUESTRA GRAN FAMILIA
        </h2>
        <p className="text-xs text-red-600 font-bold mb-4">👉 Completa todos los campos marcados con <span className="text-red-600">*</span> — son obligatorios para enviar el registro.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* Folio — solo lectura, autoincremental */}
          <div>
            <label className={lbl}>Folio N.°</label>
            <div className="w-full px-3 py-2.5 bg-amber-100 border-2 border-amber-400 rounded-md text-sm font-black text-amber-900 tracking-widest select-none cursor-not-allowed">
              #{data.folio}
            </div>
            <p className="text-[10px] text-amber-600 mt-1">Asignado al enviar</p>
          </div>
          {[
            { label: "Nombre del acopiador", k: "nombreAcopiador" as const, ph: "Nombre completo" },
            { label: "Zona / ruta de acopio", k: "zonaRuta" as const, ph: "Ej. Ruta Quillabamba Norte" },
          ].map(f => (
            <div key={f.k} className="min-w-0">
              <label className={lbl}>{f.label}</label>
              <input type="text" className={inp + " w-full min-w-0"} placeholder={f.ph} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
            </div>
          ))}
          <div className="min-w-0">
            <label className={lbl}>Fecha</label>
            <input
              type="date"
              className={inp + " min-w-0"}
              value={String(data.fecha)}
              onChange={e => upd("fecha", e.target.value)}
              style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', display: 'block' }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide">Completitud del registro</span>
            <span className="text-[11px] font-bold text-amber-700">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-amber-100 border border-amber-200 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#92400e,#d97706,#92400e)' }} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 md:grid-cols-9 gap-1.5">
        {SECTIONS.map(s => {
          const isActive = active === s.id;
          const isDone = s.required.length > 0 && s.required.every(f => {
            const v = data[f]; return typeof v === "boolean" ? v : String(v).trim();
          });
          return (
            <button key={s.id} onClick={() => goTo(s.id)}
              className={`relative rounded-lg px-1.5 py-2.5 text-center transition-all cursor-pointer border-2 ${isActive ? "bg-amber-700 border-amber-600 scale-[1.03]" : "bg-amber-50 border-amber-200 hover:border-amber-500 hover:scale-[1.01]"}`}>
              {isDone && <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-green-500 border border-white" />}
              <div className={`text-[10px] font-black mb-0.5 ${isActive ? "text-amber-100" : "text-amber-700"}`}>{s.num}</div>
              <i className={`${s.icon} text-base ${isActive ? "text-white" : "text-amber-600"}`} />
            </button>
          );
        })}
      </div>
      {/* BODY */}
      <div className={card + " space-y-5"}>

        {/* ══ 1. IDENTIDAD ══ */}
        {active === "identidad" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>1. Identidad del Productor</h3>

            <div className={`p-3 rounded-lg border-2 border-red-400 bg-red-50`}>
              <p className="text-sm font-bold text-red-700">📋 INSTRUCCIONES — Lee antes de empezar:</p>
              <ul className="text-xs text-red-700 mt-1 space-y-0.5 list-disc pl-4">
                <li>Escribe el nombre completo tal como aparece en el DNI.</li>
                <li>El número de celular debe tener 9 dígitos.</li>
                <li>Toca el recuadro de foto para tomar la foto del productor — es OBLIGATORIA.</li>
                <li>Los campos con <strong>*</strong> son obligatorios.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MediaUpload label="Foto del productor" accept="image/*" value={data.fotoProductor}
                onChange={v => upd("fotoProductor", v)} required icon="ri-camera-line"
                hint="Toca aquí → toma la foto directamente. Rostro visible, buena luz." capture="environment" />
              <MediaUpload label="Video breve de presentación (opcional)" accept="video/*" value={data.videoProductor}
                onChange={v => upd("videoProductor", v)} icon="ri-video-line"
                hint="Graba un video corto donde el productor se presente con sus propias palabras." capture="environment" />
            </div>

            <p className={sublbl}>1.1 — Datos personales y de contacto</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Nombre completo del productor{reqStar}</label>
                <p className={guide}><i className="ri-pencil-line" /> Escribe exactamente como aparece en el DNI</p>
                <input className={I("nombre")} placeholder="Apellido Paterno · Apellido Materno · Nombres" value={data.nombre} onChange={e => upd("nombre", e.target.value)} />
                {isErr("nombre") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Este campo es obligatorio — escribe el nombre completo</p>}
              </div>
              <div>
                <label className={lbl}>Número de DNI{reqStar}</label>
                <p className={guide}><i className="ri-id-card-line" /> Escribe los 8 números del DNI</p>
                <input className={I("dni")} maxLength={8} placeholder="12345678" value={data.dni} onChange={e => upd("dni", e.target.value)} />
                {isErr("dni") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe el número de DNI</p>}
              </div>
              <div>
                <label className={lbl}>Número de Celular / WhatsApp{reqStar}</label>
                <p className={guide}><i className="ri-whatsapp-line" /> Escribe tu número de celular (9 dígitos)</p>
                <input className={I("telefono")} type="tel" placeholder="9XX XXX XXX" value={data.telefono} onChange={e => upd("telefono", e.target.value)} />
                {isErr("telefono") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe tu número de celular</p>}
              </div>
              <div>
                <label className={lbl}>Celular de familiar o vecino de confianza</label>
                <p className="text-[11px] text-stone-500 mb-1">En caso de no poder contactarte directamente</p>
                <input className={inp} type="tel" placeholder="Número de un familiar o vecino" value={data.telefonoFamiliar} onChange={e => upd("telefonoFamiliar", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Nombre del familiar o vecino</label>
                <input className={inp} placeholder="Nombre completo" value={data.nombreFamiliar} onChange={e => upd("nombreFamiliar", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Sector / Comunidad en Echarati{reqStar}</label>
                <p className={guide}><i className="ri-map-pin-line" /> Escribe el nombre de tu comunidad o sector</p>
                <input className={I("comunidad")} placeholder="Nombre de la comunidad campesina" value={data.comunidad} onChange={e => upd("comunidad", e.target.value)} />
                {isErr("comunidad") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe el nombre de tu comunidad</p>}
              </div>
              <div>
                <label className={lbl}>Distrito{reqStar}</label>
                <input className={I("distrito")} placeholder="Distrito exacto" value={data.distrito} onChange={e => upd("distrito", e.target.value)} />
                {isErr("distrito") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe el distrito</p>}
              </div>
            </div>

            <p className={sublbl}>1.2 — El corazón de la familia (carga familiar)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Personas en el hogar", k: "personasHogar" as const, ph: "Ej. 5" },
                { label: "Personas que trabajan la parcela", k: "personasTrabajan" as const, ph: "Ej. 3" },
                { label: "Años de experiencia como agricultor", k: "aniosExperiencia" as const, ph: "Ej. 12" },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  <input type="number" className={inp} placeholder={f.ph} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
                </div>
              ))}
              <div>
                <label className={lbl}>¿Con quién vive? (esposa/o, hijos)</label>
                <p className={guide}><i className="ri-arrow-down-s-line" /> Toca y selecciona una opción</p>
                <select className={inp} style={selectStyle} value={data.relacionLaboral} onChange={e => upd("relacionLaboral", e.target.value)}>
                  <option value="">👇 Selecciona una opción</option>
                  <option>Solo el titular</option>
                  <option>Titular + esposa/o</option>
                  <option>Titular + esposa/o + hijos</option>
                  <option>Titular + familia extensa</option>
                  <option>Titular + peones contratados</option>
                </select>
              </div>
            </div>

            <p className={sublbl}>1.3 — Situación financiera y comercial</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "¿Tiene cuenta bancaria o en caja rural?", k: "tieneCuenta" as const, opts: ["Sí — cuenta de ahorros activa","Sí — cuenta en caja rural / cooperativa","No tiene cuenta"] },
                { label: "¿Ha recibido crédito agrario?", k: "recibioCreditoAgrario" as const, opts: ["Sí — Agrobanco","Sí — Caja Rural","Sí — habilitación de comprador","No ha recibido crédito"] },
                { label: "¿Tiene deuda con otro comprador?", k: "tieneDeuda" as const, opts: ["No — libre de compromisos","Sí — deuda pendiente","Sí — habilitación con empresa","Prefiere no indicar"] },
                { label: "¿Por qué le vende a su comprador actual?", k: "razonComprador" as const, opts: ["Mejor precio","Pago al contado inmediato","Confianza y trato personal","Cercanía geográfica","Crédito o habilitación","Falta de otras opciones"] },
                { label: "Disposición a adoptar nuevas prácticas", k: "disposicion" as const, opts: ["5 — Muy dispuesto","4 — Bastante dispuesto","3 — Moderadamente dispuesto","2 — Poco dispuesto","1 — No dispuesto"] },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  <p className={guide}><i className="ri-arrow-down-s-line" /> Toca y selecciona una opción del desplegable</p>
                  <select className={inp} style={selectStyle} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)}>
                    <option value="">👇 Selecciona una opción</option>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <p className={sublbl}>1.4 — El sueño más grande para su familia</p>
            <div>
              <label className={lbl}>¿Cuál es el sueño más grande que quiere cumplir para su familia?</label>
              <p className="text-[11px] text-stone-500 mb-1">Escribe con tus propias palabras</p>
              <textarea rows={3} className={inp} placeholder="Ej: Construir mi casa, dar estudios a mis hijos, tener una chacra propia más grande..." value={data.justificacionTier} onChange={e => upd("justificacionTier", e.target.value)} />
            </div>
          </>
        )}

        {/* ══ 2. PARCELA ══ */}
        {active === "parcela" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>2. Datos de la Tierra y Producción</h3>
            <div className={`p-3 rounded-lg border-2 border-red-400 bg-red-50`}>
              <p className="text-sm font-bold text-red-700">📋 INSTRUCCIONES — Sección de la chacra:</p>
              <ul className="text-xs text-red-700 mt-1 space-y-0.5 list-disc pl-4">
                <li>Escribe el nombre con que conoces tu chacra o parcela.</li>
                <li>La altitud se mide en metros sobre el nivel del mar (msnm).</li>
                <li>Indica el tamaño total y cuánto está dedicado al cacao.</li>
                <li>Marca las casillas de cómo llegas a tu chacra (acceso).</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className={lbl}>¿Tiene título o constancia de propiedad? / Nombre de la parcela o chacra{reqStar}</label>
                <p className={guide}><i className="ri-pencil-line" /> Escribe el nombre con que conoces tu chacra</p>
                <input className={I("nombreParcela")} placeholder="Ej: La Esperanza, El Mirador, La Chacra de Don Juan..." value={data.nombreParcela} onChange={e => upd("nombreParcela", e.target.value)} />
                {isErr("nombreParcela") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe el nombre de tu parcela o chacra</p>}
              </div>
              <div>
                <label className={lbl}>Altitud (metros sobre el nivel del mar){reqStar}</label>
                <p className={guide}><i className="ri-arrow-up-line" /> Escribe la altura en metros (msnm)</p>
                <input className={I("altitud")} type="number" placeholder="Ej. 1100" value={data.altitud} onChange={e => upd("altitud", e.target.value)} />
                {isErr("altitud") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe la altitud en metros</p>}
              </div>
              <div>
                <label className={lbl}>Tamaño total de la chacra (hectáreas o topos){reqStar}</label>
                <input className={I("superficieTotal")} type="number" step="0.01" placeholder="Ej. 3.5 hectáreas" value={data.superficieTotal} onChange={e => upd("superficieTotal", e.target.value)} />
                {isErr("superficieTotal") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe el tamaño de tu chacra</p>}
              </div>
              <div>
                <label className={lbl}>Hectáreas dedicadas al Cacao Chuncho{reqStar}</label>
                <input className={I("areaCacao")} type="number" step="0.01" placeholder="Ej. 2.0 hectáreas" value={data.areaCacao} onChange={e => upd("areaCacao", e.target.value)} />
                {isErr("areaCacao") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe las hectáreas de cacao</p>}
              </div>
              <div>
                <label className={lbl}>Otros cultivos en la chacra</label>
                <input className={inp} placeholder="Ej. yuca, plátano, café, frutas..." value={data.otrosCultivos} onChange={e => upd("otrosCultivos", e.target.value)} />
              </div>
            </div>

            <p className={sublbl}>2.1 — Producción estimada al año</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Producción estimada al año (quintales o kilos de cacao)</label>
                <p className="text-[11px] text-stone-500 mb-1">Escribe cuánto cacao produces aproximadamente en un año</p>
                <input className={inp} placeholder="Ej. 500 kilos / 5 quintales de cacao seco" value={data.estimadoAnual} onChange={e => upd("estimadoAnual", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>¿Cómo procesa y seca su cacao en la chacra?</label>
                <p className={guide}><i className="ri-arrow-down-s-line" /> Toca y selecciona una opción</p>
                <select className={inp} style={selectStyle} value={data.practicasPostCosecha} onChange={e => upd("practicasPostCosecha", e.target.value)}>
                  <option value="">👇 Selecciona una opción</option>
                  <option>Entrega inmediata sin espera</option>
                  <option>Deja reposar en costal 6–12 horas</option>
                  <option>Deja reposar más de 12 horas</option>
                  <option>Inicia pre-fermentación artesanal en cajón</option>
                  <option>Seca al sol sobre manta o tarima</option>
                </select>
              </div>
            </div>

            <p className={sublbl}>2.2 — Vías de acceso a la chacra{reqStar}</p>
            <p className={guide}><i className="ri-check-line" /> Marca todas las formas de llegar a tu chacra</p>
            {isErr("viasTrocha") && <p className="text-xs text-red-600 -mt-2 mb-1 font-bold">⚠️ Selecciona al menos una vía de acceso</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Chk checked={data.viasTrocha} onChange={v => upd("viasTrocha", v)} label="Trocha carrozable" />
              <Chk checked={data.viasAfirmada} onChange={v => upd("viasAfirmada", v)} label="Carretera afirmada" />
              <Chk checked={data.viasAsfaltado} onChange={v => upd("viasAsfaltado", v)} label="Asfaltado" />
              <Chk checked={data.viasHerradura} onChange={v => upd("viasHerradura", v)} label="Camino de herradura" />
              <Chk checked={data.viasFluvial} onChange={v => upd("viasFluvial", v)} label="Fluvial (río o quebrada)" />
              <Chk checked={data.viasPie} onChange={v => upd("viasPie", v)} label="A pie únicamente" />
            </div>

            <p className={sublbl}>2.3 — Abonos o productos que usa en su tierra (Normas de Europa)</p>
            <div className={`p-3 rounded-lg border-2 border-amber-400 bg-amber-50`}>
              <p className="text-xs text-amber-800 font-bold">⚠️ IMPORTANTE — Para exportar a Europa (Unión Europea) tu cacao debe ser orgánico. Indica exactamente qué productos usas en tu chacra.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Abonos o productos químicos que utiliza en su tierra</label>
                <textarea rows={3} className={inp} placeholder="Ej: guano de isla, compost casero, urea, ninguno... Escribe todo lo que usas." value={data.productosControl} onChange={e => upd("productosControl", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Fuente de agua en la parcela{reqStar}</label>
                <p className={guide}><i className="ri-arrow-down-s-line" /> Toca y selecciona una opción</p>
                <select className={I("fuenteHidrica")} style={selectStyle} value={data.fuenteHidrica} onChange={e => upd("fuenteHidrica", e.target.value)}>
                  <option value="">👇 Selecciona una opción</option>
                  <option>Sí — río o quebrada permanente</option>
                  <option>Sí — manantial o puquio</option>
                  <option>Sí — canal de riego</option>
                  <option>No cuenta con fuente hídrica</option>
                </select>
                {isErr("fuenteHidrica") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Selecciona una opción</p>}
              </div>
            </div>

            <p className={sublbl}>2.4 — Coordenadas GPS de la parcela <span className="text-red-600 normal-case">(requerido por la Unión Europea)</span></p>
            <div className="p-3 rounded-lg border-2 border-blue-400 bg-blue-50 text-xs text-blue-800 mb-2">
              <i className="ri-map-2-line mr-1 font-bold" /> <strong>¿Por qué pedimos esto?</strong> La Unión Europea exige saber exactamente dónde está tu chacra para comprar tu cacao. Si no tienes GPS ahora, el técnico te ayudará a tomarlo en la próxima visita.
            </div>
            <GPSRows rows={data.gpsVertices} onChange={v => setData(d => ({ ...d, gpsVertices: v }))} />
          </>
        )}

        {/* ══ 3. CULTIVO ══ */}
        {active === "cultivo" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>3. Características del Cultivo</h3>
            <div className={`p-3 rounded-lg border-2 border-red-400 bg-red-50`}>
              <p className="text-sm font-bold text-red-700">📋 INSTRUCCIONES:</p>
              <ul className="text-xs text-red-700 mt-1 space-y-0.5 list-disc pl-4">
                <li>Indica la edad aproximada de tus plantas de cacao en años.</li>
                <li>El distanciamiento es cuánto espacio hay entre planta y planta.</li>
                <li>Grado brix es el nivel de azúcar del fruto — el técnico te ayudará si no sabes.</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Edad aprox. de plantas (años){reqStar}", k: "edadPlantas" as const, ph: "Ej. 18 años" },
                { label: "Distanciamiento entre plantas (metros)", k: "distanciamiento" as const, ph: "Ej. 3×3 metros" },
                { label: "N.° estimado de plantas de cacao", k: "numeroPlantas" as const, ph: "Ej. 800 plantas" },
                { label: "% plantas en producción activa", k: "pctProduccion" as const, ph: "Ej. 85%" },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label.replace("{reqStar}","")}{f.label.includes("reqStar") && reqStar}</label>
                  <input className={isErr(f.k) ? inpErr : inp} placeholder={f.ph} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
                  {isErr(f.k) && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Campo obligatorio</p>}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={lbl}>Grado brix (último muestreo){reqStar}</label>
                <p className="text-[11px] text-stone-500 mb-1">El técnico puede ayudarte a medir esto</p>
                <input className={I("gradosBrix")} type="number" step="0.1" placeholder="Ej. 14.5" value={data.gradosBrix} onChange={e => upd("gradosBrix", e.target.value)} />
                {isErr("gradosBrix") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe el valor brix</p>}
              </div>
              <div>
                <label className={lbl}>Herramienta de cosecha</label>
                <p className={guide}><i className="ri-arrow-down-s-line" /> Toca y selecciona</p>
                <select className={inp} style={selectStyle} value={data.herramientaCosecha} onChange={e => upd("herramientaCosecha", e.target.value)}>
                  <option value="">👇 Selecciona una opción</option>
                  <option>Tijera de podar — corte limpio</option>
                  <option>Machete con tiento</option>
                  <option>Machete directo</option>
                  <option>Combina tijera y machete</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Notas sensoriales del cacao</label>
                <input className={inp} placeholder="Ej. frutal, floral, nuez, cítrico..." value={data.notasSensoriales} onChange={e => upd("notasSensoriales", e.target.value)} />
              </div>
            </div>
          </>
        )}

        {/* ══ 4. PRODUCCIÓN ══ */}
        {active === "produccion" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>4. Producción y Cosecha</h3>
            <div className={`p-3 rounded-lg border-2 border-red-400 bg-red-50`}>
              <ul className="text-xs text-red-700 mt-1 space-y-0.5 list-disc pl-4">
                <li>Indica cuánto cacao produces al año en kilos de baba (fruto fresco).</li>
                <li>Marca los meses en que cosechas tocando cada mes en el calendario.</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Estimado anual (kg cacao baba){reqStar}", k: "estimadoAnual" as const, ph: "Ej. 2000 kg" },
                { label: "Rendimiento últimos 2 años", k: "rendimientoHistorico" as const, ph: "Ej. 2024: 1800kg" },
                { label: "Comprador actual", k: "compradorActual" as const, ph: "Nombre o empresa" },
                { label: "Precio recibido por kg (S/.)", k: "precioKg" as const, ph: "S/. por kg" },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label.replace("{reqStar}","")}{f.label.includes("reqStar") && reqStar}</label>
                  <input className={isErr(f.k) ? inpErr : inp} placeholder={f.ph} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
                  {isErr(f.k) && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Campo obligatorio</p>}
                </div>
              ))}
              <div>
                <label className={lbl}>Tipo de acopio{reqStar}</label>
                <p className={guide}><i className="ri-arrow-down-s-line" /> Toca y selecciona</p>
                <select className={I("tipoAcopio")} style={selectStyle} value={data.tipoAcopio} onChange={e => upd("tipoAcopio", e.target.value)}>
                  <option value="">👇 Selecciona una opción</option>
                  <option>Sí — tiene punto de acopio propio</option>
                  <option>No — entrega directamente al acopiador</option>
                  <option>Acopio comunal compartido</option>
                </select>
                {isErr("tipoAcopio") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Selecciona una opción</p>}
              </div>
            </div>
            <p className={sublbl}>Meses de cosecha — toca los meses en que cosechas</p>
            <p className={guide}><i className="ri-hand-coin-line" /> Toca cada mes para marcarlo o desmarcarlo</p>
            <MonthGrid selected={data.mesesCosecha} onChange={v => upd("mesesCosecha", v)} />
          </>
        )}

        {/* ══ 5. SANIDAD ══ */}
        {active === "sanidad" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>5. Cuidados del Cultivo (Normas de Europa)</h3>
            <div className={`p-3 rounded-lg border-2 border-red-400 bg-red-50`}>
              <p className="text-sm font-bold text-red-700">📋 INSTRUCCIONES — Enfermedades y cuidados:</p>
              <ul className="text-xs text-red-700 mt-1 space-y-0.5 list-disc pl-4">
                <li>Indica cuál es la enfermedad que más daña tu cacao.</li>
                <li>El porcentaje de afectación es cuántas plantas están enfermas de cada 100.</li>
                <li>Marca cómo controlas las plagas en tu chacra.</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={lbl}>Plaga o enfermedad más agresiva{reqStar}</label>
                <p className={guide}><i className="ri-arrow-down-s-line" /> Toca y selecciona la enfermedad principal</p>
                <select className={I("plagaPrincipal")} style={selectStyle} value={data.plagaPrincipal} onChange={e => upd("plagaPrincipal", e.target.value)}>
                  <option value="">👇 Selecciona una opción</option>
                  <option>Moniliasis (Moniliophthora roreri)</option>
                  <option>Escoba de bruja (M. perniciosa)</option>
                  <option>Phytophthora — mazorca negra</option>
                  <option>Barrenador del fruto</option>
                  <option>Chinche de la mazorca</option>
                  <option>Otra — especificar abajo</option>
                </select>
                {isErr("plagaPrincipal") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Selecciona la plaga principal</p>}
              </div>
              <div>
                <label className={lbl}>% de plantas afectadas por esa enfermedad{reqStar}</label>
                <p className="text-[11px] text-stone-500 mb-1">De cada 100 plantas, ¿cuántas están enfermas?</p>
                <input className={I("pctAfectacionPrincipal")} type="number" min="0" max="100" placeholder="Ej. 25 (significa 25 de cada 100)" value={data.pctAfectacionPrincipal} onChange={e => upd("pctAfectacionPrincipal", e.target.value)} />
                {isErr("pctAfectacionPrincipal") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Escribe el porcentaje</p>}
              </div>
              <div>
                <label className={lbl}>Plaga secundaria (si hay otra)</label>
                <input className={inp} placeholder="Nombre de la plaga" value={data.plagaSecundaria} onChange={e => upd("plagaSecundaria", e.target.value)} />
              </div>
            </div>
            <p className={sublbl}>¿Cómo controlas las plagas en tu chacra?</p>
            <p className={guide}><i className="ri-check-line" /> Marca todas las formas que usas</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Chk checked={data.controlEcologico} onChange={v => upd("controlEcologico", v)} label="Ecológico / cultural (poda sanitaria, limpieza)" />
              <Chk checked={data.controlBiologico} onChange={v => upd("controlBiologico", v)} label="Biológico (Trichoderma, Beauveria, hongos buenos)" />
              <Chk checked={data.controlQuimico} onChange={v => upd("controlQuimico", v)} label="Químico convencional (venenos, fungicidas)" />
              <Chk checked={data.controlNinguno} onChange={v => upd("controlNinguno", v)} label="No aplico ningún control" />
            </div>
          </>
        )}

        {/* ══ 6. CERTIFICACIÓN ══ */}
        {active === "certificacion" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>6. Historia de Vida y Certificación</h3>
            <div className={`p-3 rounded-lg border-2 border-blue-400 bg-blue-50`}>
              <p className="text-xs text-blue-800 font-bold">ℹ️ La certificación orgánica nos permite exportar el cacao a Europa con un precio mucho mejor. Si no tienes certificación aún, ¡no te preocupes! Nosotros te ayudamos a conseguirla.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Estado de certificación orgánica{reqStar}</label>
                <p className={guide}><i className="ri-arrow-down-s-line" /> Toca y selecciona tu situación actual</p>
                <select className={I("estadoCertificacion")} style={selectStyle} value={data.estadoCertificacion} onChange={e => upd("estadoCertificacion", e.target.value)}>
                  <option value="">👇 Selecciona una opción</option>
                  <option>Certificación activa y vigente</option>
                  <option>En proceso de conversión (1.° año)</option>
                  <option>En proceso de conversión (2.° año)</option>
                  <option>En proceso de conversión (3.° año)</option>
                  <option>Certificación vencida — en renovación</option>
                  <option>No tengo certificación</option>
                  <option>Me interesa iniciar el proceso</option>
                </select>
                {isErr("estadoCertificacion") && <p className="text-xs text-red-600 mt-1 font-bold">⚠️ Selecciona una opción</p>}
              </div>
              <div>
                <label className={lbl}>Entidad certificadora (si tienes)</label>
                <input className={inp} placeholder="Ej. KIWA BCS, Control Union, CERES..." value={data.entidadCertificadora} onChange={e => upd("entidadCertificadora", e.target.value)} />
              </div>
            </div>
            <p className={sublbl}>Historia de vida y sueños</p>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={lbl}>Años trabajando como agricultor en la zona</label>
                <input className={inp} type="number" placeholder="Ej. 20 años" value={data.aniosExperiencia} onChange={e => upd("aniosExperiencia", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Comentarios, aspiraciones y necesidades</label>
                <textarea rows={4} className={inp} placeholder="Escribe aquí libremente: qué necesitas, qué sueñas, qué te preocupa, qué te alegra de tu trabajo en la chacra..." value={data.comentariosProductor} onChange={e => upd("comentariosProductor", e.target.value)} />
              </div>
            </div>
          </>
        )}

        {/* ══ 7. CAPACITACIÓN ══ */}
        {active === "capacitacion" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>7. Capacitación y Asistencia Técnica</h3>
            <p className={sublbl}>¿Quién te ha capacitado en los últimos 2 años?</p>
            <p className={guide}><i className="ri-check-line" /> Marca todas las que correspondan</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Chk checked={data.capMunicipalidad} onChange={v => upd("capMunicipalidad", v)} label="Municipalidad distrital" />
              <Chk checked={data.capMIDGRI} onChange={v => upd("capMIDGRI", v)} label="MIDAGRI / Agrorural" />
              <Chk checked={data.capGORE} onChange={v => upd("capGORE", v)} label="GORE Cusco" />
              <Chk checked={data.capDEVIDA} onChange={v => upd("capDEVIDA", v)} label="DEVIDA" />
              <Chk checked={data.capONG} onChange={v => upd("capONG", v)} label="ONG (indica el nombre abajo)" />
              <Chk checked={data.capEmpresa} onChange={v => upd("capEmpresa", v)} label="Empresa compradora" />
              <Chk checked={data.capCooperativa} onChange={v => upd("capCooperativa", v)} label="Cooperativa o asociación" />
              <Chk checked={data.capNinguna} onChange={v => upd("capNinguna", v)} label="No he recibido capacitación" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <label className={lbl}>ONG o institución (nombre)</label>
                <input className={inp} placeholder="Nombre de la ONG o proyecto" value={data.nombreONG} onChange={e => upd("nombreONG", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Tema principal de la capacitación recibida</label>
                <input className={inp} placeholder="Ej. manejo del cacao, fermentación..." value={data.temaCapacitacion} onChange={e => upd("temaCapacitacion", e.target.value)} />
              </div>
            </div>
            <p className={sublbl}>¿En qué temas te gustaría capacitarte?</p>
            <p className={guide}><i className="ri-check-line" /> Marca los temas que te interesan</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Chk checked={data.temaManejo} onChange={v => upd("temaManejo", v)} label="Manejo del cacao (poda, fertilización, sombra)" />
              <Chk checked={data.temaFermentacion} onChange={v => upd("temaFermentacion", v)} label="Fermentación y secado — mejorar calidad" />
              <Chk checked={data.temaPlagas} onChange={v => upd("temaPlagas", v)} label="Control de plagas de forma natural" />
              <Chk checked={data.temaCertificacion} onChange={v => upd("temaCertificacion", v)} label="Certificación orgánica para exportar a Europa" />
              <Chk checked={data.temaFinanciero} onChange={v => upd("temaFinanciero", v)} label="Ahorro y manejo del dinero familiar" />
              <Chk checked={data.temaBuenasPracticas} onChange={v => upd("temaBuenasPracticas", v)} label="Buenas prácticas de cosecha" />
              <Chk checked={data.temaMercados} onChange={v => upd("temaMercados", v)} label="Cómo vender mejor mi cacao" />
              <Chk checked={data.temaGPS} onChange={v => upd("temaGPS", v)} label="Uso del GPS y trazabilidad" />
              <Chk checked={data.temaAsociatividad} onChange={v => upd("temaAsociatividad", v)} label="Trabajo en equipo y organización" />
            </div>
          </>
        )}

        {/* ══ 8. EVALUACIÓN ══ */}
        {active === "evaluacion" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>8. Evaluación del Acopiador</h3>
            <div className="p-3 rounded-lg border-2 border-stone-400 bg-stone-100 text-xs text-stone-700 mb-2">
              <i className="ri-lock-line mr-1 font-bold" /> <strong>SOLO PARA EL TÉCNICO ACOPIADOR.</strong> No mostrar al productor durante el levantamiento de la ficha.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Confiabilidad del productor (1–5)", k: "confiabilidad" as const, opts: ["5 — Muy confiable, cumple siempre","4 — Confiable con seguimiento","3 — Moderado, requiere monitoreo","2 — Poco confiable","1 — No confiable"] },
                { label: "Calidad promedio del grano", k: "calidadGrano" as const, opts: ["Excelente — grano uniforme","Buena — dentro del estándar","Regular — necesita mejora","Deficiente — inconsistente","Sin historial previo"] },
                { label: "Potencial estratégico", k: "potencialEstrategico" as const, opts: ["Alto — clave para el programa","Medio — contribuye regularmente","Bajo — volumen menor","Por evaluar — primer contacto"] },
                { label: "Riesgo de pérdida ante competencia", k: "riesgoPerdida" as const, opts: ["Bajo — muy fidelizado","Medio — puede cambiar por precio","Alto — contactado por otros","Crítico — deuda con otro comprador"] },
                { label: "Acción de fidelización recomendada", k: "accionFidelizacion" as const, opts: ["Precio preferencial + visita técnica","Incorporar al programa de capacitación","Ofrecer habilitación de insumos","Visita de refuerzo","Monitoreo pasivo"] },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  <select className={inp} style={selectStyle} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)}>
                    <option value="">👇 Selecciona una opción</option>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className={lbl}>Fecha de próximo seguimiento</label>
                <input className={inp} type="date" value={data.fechaSeguimiento} onChange={e => upd("fechaSeguimiento", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={lbl}>Notas confidenciales del acopiador</label>
              <textarea rows={4} className={inp} placeholder="Observaciones estratégicas, alertas, contexto familiar, situación con otros compradores..." value={data.notasConfidenciales} onChange={e => upd("notasConfidenciales", e.target.value)} />
            </div>
          </>
        )}

        {/* ══ 9. FIRMAS ══ */}
        {active === "firmas" && (
          <>
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>9. Firmas y Declaración Jurada</h3>
            <div className={`p-3 rounded-lg border-2 border-red-400 bg-red-50`}>
              <p className="text-sm font-bold text-red-700">📋 INSTRUCCIONES FINALES:</p>
              <ul className="text-xs text-red-700 mt-1 space-y-0.5 list-disc pl-4">
                <li>Toca el recuadro de firma del productor y toma foto de su firma en papel.</li>
                <li>Toca el recuadro de firma del acopiador y toma foto de tu firma.</li>
                <li>Marca la casilla de declaración jurada para confirmar que todo es verdadero.</li>
                <li>Luego toca el botón verde de enviar.</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <p className={sublbl}>Firma del productor</p>
                <MediaUpload label="Foto de la firma del productor" accept="image/*" value={data.firmaProductor}
                  onChange={v => upd("firmaProductor", v)} required icon="ri-pen-nib-line"
                  hint="Toma foto de la firma manuscrita sobre papel" />
                {isErr("firmaProductor") && <p className="text-xs text-red-600 font-bold">⚠️ La firma del productor es obligatoria</p>}
                <MediaUpload label="Foto de la huella digital (opcional)" accept="image/*" value={data.huellaProductor}
                  onChange={v => upd("huellaProductor", v)} icon="ri-fingerprint-line"
                  hint="Toma foto de la huella dactilar del productor" />
              </div>
              <div className="space-y-4">
                <p className={sublbl}>Firma del acopiador responsable</p>
                <MediaUpload label="Foto de la firma del acopiador" accept="image/*" value={data.firmaAcopiador}
                  onChange={v => upd("firmaAcopiador", v)} required icon="ri-pen-nib-line"
                  hint="Foto de la firma del acopiador que levantó la ficha" />
                {isErr("firmaAcopiador") && <p className="text-xs text-red-600 font-bold">⚠️ La firma del acopiador es obligatoria</p>}
                <div>
                  <label className={lbl}>Fecha y lugar del levantamiento</label>
                  <input className={inp} placeholder="Ej. Quillabamba, 12 de marzo de 2025" value={data.fechaLugar} onChange={e => upd("fechaLugar", e.target.value)} />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 transition-all ${data.declaracionJurada ? "border-green-500 bg-green-50" : isErr("declaracionJurada") ? "border-red-500 bg-red-50" : "border-amber-400 bg-amber-50"}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <div onClick={() => upd("declaracionJurada", !data.declaracionJurada)}
                  className={`mt-0.5 w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${data.declaracionJurada ? "bg-green-600 border-green-500" : "bg-white border-amber-400"}`}>
                  {data.declaracionJurada && <i className="ri-check-line text-white text-sm" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800 mb-1">✅ Declaración jurada{reqStar} — Toca aquí para confirmar</p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Al firmar esta ficha, el productor y el acopiador declaran bajo juramento que los datos son verídicos y han sido obtenidos con consentimiento informado. La información es reservada y su uso está restringido al programa de trazabilidad de cacao chuncho orgánico.
                  </p>
                </div>
              </label>
              {isErr("declaracionJurada") && <p className="text-xs text-red-600 mt-2 pl-9 font-bold">⚠️ Debes marcar esta casilla para enviar el registro</p>}
            </div>

            <button onClick={handleSubmit}
              className="w-full py-4 rounded-xl text-base font-bold cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.99] text-white"
              style={{ background: 'linear-gradient(135deg,#14532d,#16a34a)', border: '2px solid #15803d', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
              <i className="ri-check-double-line mr-2" />
              Enviar registro completo
            </button>
          </>
        )}

        {/* NAVEGACIÓN */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-amber-200">
          <button onClick={goPrev} disabled={active === SECTIONS[0].id}
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-stone-700 bg-white border-2 border-amber-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-amber-50 hover:border-amber-500 transition-all">
            <i className="ri-arrow-left-line mr-1" /> ← Anterior
          </button>
          <span className="text-xs text-stone-500 font-bold">
            Sección {SECTIONS.findIndex(s => s.id === active) + 1} de {SECTIONS.length}
          </span>
          {active !== "firmas" && (
            <button onClick={goNext}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white cursor-pointer hover:scale-[1.01] transition-all"
              style={{ background: 'linear-gradient(135deg,#92400e,#d97706)', border: '2px solid #d97706' }}>
              Siguiente → <i className="ri-arrow-right-line ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

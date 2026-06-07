import { useState, useRef } from "react";

// ─── TYPES ──────────────────────────────────────────────────────────────────

type SectionId =
  | "identidad" | "parcela" | "cultivo"
  | "produccion" | "sanidad" | "certificacion"
  | "capacitacion" | "evaluacion" | "firmas";

interface FormData {
  // PORTADA
  folio: string; fecha: string;
  nombreAcopiador: string; zonaRuta: string; totalProductores: string;
  // 1. IDENTIDAD
  nombre: string; dni: string; telefono: string; telefonoFamiliar: string;
  nombreFamiliar: string; comunidad: string; distrito: string;
  fotoProductor: string; videoProductor: string;
  personasHogar: string; personasTrabajan: string; relacionLaboral: string;
  aniosExperiencia: string;
  tieneCuenta: string; recibioCreditoAgrario: string; tieneDeuda: string;
  antiguedadComprador: string; razonComprador: string; disposicion: string;
  tier: string; justificacionTier: string;
  // 2. PARCELA
  nombreParcela: string; altitud: string; superficieTotal: string;
  areaCacao: string; otrosCultivos: string;
  viasTrocha: boolean; viasAfirmada: boolean; viasAsfaltado: boolean;
  viasHerradura: boolean; viasFluvial: boolean; viasPie: boolean;
  distanciaVia: string; tiempoFlete: string;
  tipoSuelo: string; sistemaSombra: string; fuenteHidrica: string;
  gpsVertices: { vertice: string; lat: string; lon: string; alt: string }[];
  codigoParcela: string;
  // 3. CULTIVO
  edadPlantas: string; distanciamiento: string; numeroPlantas: string;
  pctProduccion: string;
  gradosBrix: string; fechaMuestreoBrix: string; colorGrano: string;
  practicasPostCosecha: string; herramientaCosecha: string; notasSensoriales: string;
  // 4. PRODUCCIÓN
  estimadoAnual: string; rendimientoHistorico: string; compradorActual: string;
  precioKg: string; almacenamiento: string; tipoAcopio: string;
  transporte: string; costoFlete: string;
  mesesCosecha: string[];
  cosechaPrincipal1Meses: string; cosechaPrincipal1Baba: string; cosechaPrincipal1Seco: string; cosechaPrincipal1Pago: string; cosechaPrincipal1Obs: string;
  cosechaPrincipal2Meses: string; cosechaPrincipal2Baba: string; cosechaPrincipal2Seco: string; cosechaPrincipal2Pago: string; cosechaPrincipal2Obs: string;
  cosechaIntermediaMeses: string; cosechaIntermediaBaba: string; cosechaIntermediaSeco: string; cosechaIntermediaPago: string; cosechaIntermedaObs: string;
  totalAnualBaba: string; totalAnualSeco: string; totalAnualObs: string;
  // 5. SANIDAD
  plagaPrincipal: string; pctAfectacionPrincipal: string;
  plagaSecundaria: string; pctAfectacionSecundaria: string;
  mesesPresionPlaga: string; plagaOtra: string;
  controlEcologico: boolean; controlBiologico: boolean; controlQuimico: boolean; controlNinguno: boolean;
  productosControl: string; frecuenciaControl: string;
  // 6. CERTIFICACIÓN
  estadoCertificacion: string; entidadCertificadora: string;
  numeroCertificado: string; fechaVencimiento: string;
  certNOP: boolean; certEU: boolean; certJAS: boolean; certFairtrade: boolean; certRainforest: boolean;
  obsCertificacion: string;
  // 7. CAPACITACIÓN
  capMunicipalidad: boolean; capMIDGRI: boolean; capGORE: boolean; capDEVIDA: boolean;
  capONG: boolean; capEmpresa: boolean; capCooperativa: boolean; capNinguna: boolean;
  nombreONG: string; temaCapacitacion: string;
  temaManejo: boolean; temaFermentacion: boolean; temaPlagas: boolean;
  temaCertificacion: boolean; temaFinanciero: boolean; temaBuenasPracticas: boolean;
  temaMercados: boolean; temaClima: boolean; temaGPS: boolean;
  temaAsociatividad: boolean; temaNutricion: boolean;
  comentariosProductor: string;
  // 8. EVALUACIÓN
  confiabilidad: string; calidadGrano: string; potencialEstrategico: string;
  riesgoPerdida: string; accionFidelizacion: string; fechaSeguimiento: string;
  notasConfidenciales: string;
  // 9. FIRMAS
  firmaProductor: string; huellaProductor: string;
  firmaAcopiador: string; fechaLugar: string;
  declaracionJurada: boolean;
}

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const SECTIONS: { id: SectionId; num: string; title: string; icon: string; required: (keyof FormData)[] }[] = [
  { id: "identidad",    num: "01", title: "Identidad del Productor",        icon: "ri-user-line",
    required: ["nombre","dni","telefono","comunidad","distrito","fotoProductor","videoProductor"] },
  { id: "parcela",      num: "02", title: "Parcela y Georreferenciación",   icon: "ri-map-pin-line",
    required: ["nombreParcela","altitud","superficieTotal","areaCacao","fuenteHidrica"] },
  { id: "cultivo",      num: "03", title: "Características del Cultivo",    icon: "ri-plant-line",
    required: ["edadPlantas","distanciamiento","gradosBrix"] },
  { id: "produccion",   num: "04", title: "Producción y Cosecha",           icon: "ri-shopping-basket-line",
    required: ["estimadoAnual","tipoAcopio"] },
  { id: "sanidad",      num: "05", title: "Sanidad Vegetal",                icon: "ri-shield-line",
    required: ["plagaPrincipal","pctAfectacionPrincipal"] },
  { id: "certificacion",num: "06", title: "Certificación Orgánica",        icon: "ri-award-line",
    required: ["estadoCertificacion"] },
  { id: "capacitacion", num: "07", title: "Capacitación y Asistencia",     icon: "ri-book-open-line",
    required: [] },
  { id: "evaluacion",   num: "08", title: "Evaluación del Acopiador",      icon: "ri-file-list-line",
    required: [] },
  { id: "firmas",       num: "09", title: "Firmas y Declaración",          icon: "ri-pen-nib-line",
    required: ["firmaProductor","firmaAcopiador","declaracionJurada"] },
];

const init: FormData = {
  folio:"", fecha: new Date().toISOString().split("T")[0],
  nombreAcopiador:"", zonaRuta:"", totalProductores:"",
  nombre:"", dni:"", telefono:"", telefonoFamiliar:"", nombreFamiliar:"",
  comunidad:"", distrito:"", fotoProductor:"", videoProductor:"",
  personasHogar:"", personasTrabajan:"", relacionLaboral:"", aniosExperiencia:"",
  tieneCuenta:"", recibioCreditoAgrario:"", tieneDeuda:"", antiguedadComprador:"",
  razonComprador:"", disposicion:"", tier:"", justificacionTier:"",
  nombreParcela:"", altitud:"", superficieTotal:"", areaCacao:"", otrosCultivos:"",
  viasTrocha:false, viasAfirmada:false, viasAsfaltado:false,
  viasHerradura:false, viasFluvial:false, viasPie:false,
  distanciaVia:"", tiempoFlete:"",
  tipoSuelo:"", sistemaSombra:"", fuenteHidrica:"",
  gpsVertices:[{vertice:"V1",lat:"",lon:"",alt:""},{vertice:"V2",lat:"",lon:"",alt:""},{vertice:"V3",lat:"",lon:"",alt:""}],
  codigoParcela:"",
  edadPlantas:"", distanciamiento:"", numeroPlantas:"", pctProduccion:"",
  gradosBrix:"", fechaMuestreoBrix:"", colorGrano:"", practicasPostCosecha:"",
  herramientaCosecha:"", notasSensoriales:"",
  estimadoAnual:"", rendimientoHistorico:"", compradorActual:"", precioKg:"",
  almacenamiento:"", tipoAcopio:"", transporte:"", costoFlete:"",
  mesesCosecha:[],
  cosechaPrincipal1Meses:"", cosechaPrincipal1Baba:"", cosechaPrincipal1Seco:"", cosechaPrincipal1Pago:"", cosechaPrincipal1Obs:"",
  cosechaPrincipal2Meses:"", cosechaPrincipal2Baba:"", cosechaPrincipal2Seco:"", cosechaPrincipal2Pago:"", cosechaPrincipal2Obs:"",
  cosechaIntermediaMeses:"", cosechaIntermediaBaba:"", cosechaIntermediaSeco:"", cosechaIntermediaPago:"", cosechaIntermedaObs:"",
  totalAnualBaba:"", totalAnualSeco:"", totalAnualObs:"",
  plagaPrincipal:"", pctAfectacionPrincipal:"", plagaSecundaria:"", pctAfectacionSecundaria:"",
  mesesPresionPlaga:"", plagaOtra:"",
  controlEcologico:false, controlBiologico:false, controlQuimico:false, controlNinguno:false,
  productosControl:"", frecuenciaControl:"",
  estadoCertificacion:"", entidadCertificadora:"", numeroCertificado:"", fechaVencimiento:"",
  certNOP:false, certEU:false, certJAS:false, certFairtrade:false, certRainforest:false,
  obsCertificacion:"",
  capMunicipalidad:false, capMIDGRI:false, capGORE:false, capDEVIDA:false,
  capONG:false, capEmpresa:false, capCooperativa:false, capNinguna:false,
  nombreONG:"", temaCapacitacion:"",
  temaManejo:false, temaFermentacion:false, temaPlagas:false,
  temaCertificacion:false, temaFinanciero:false, temaBuenasPracticas:false,
  temaMercados:false, temaClima:false, temaGPS:false,
  temaAsociatividad:false, temaNutricion:false,
  comentariosProductor:"",
  confiabilidad:"", calidadGrano:"", potencialEstrategico:"",
  riesgoPerdida:"", accionFidelizacion:"", fechaSeguimiento:"",
  notasConfidenciales:"",
  firmaProductor:"", huellaProductor:"", firmaAcopiador:"", fechaLugar:"",
  declaracionJurada:false,
};

// ─── STYLE HELPERS ──────────────────────────────────────────────────────────

const inp = "w-full px-3 py-2.5 bg-black/40 backdrop-blur-sm border border-rose-300/35 rounded-md text-sm font-semibold text-rose-50 placeholder:text-rose-200/45 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300/60 transition-all";
const inpErr = "w-full px-3 py-2.5 bg-black/40 backdrop-blur-sm border border-red-400/70 rounded-md text-sm font-semibold text-rose-50 placeholder:text-rose-200/45 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-red-400/60 transition-all";
const lbl = "block text-[11px] font-bold text-rose-200 uppercase tracking-widest mb-1.5";
const sublbl = "text-[10px] font-bold text-rose-300/70 uppercase tracking-widest mb-2 pl-2 border-l-2 border-rose-400/50";
const reqStar = <span className="text-red-400 ml-0.5">*</span>;
const selectStyle = { background: 'rgba(0,0,0,0.5)', color: '#fff0f0' };

// ─── MEDIA UPLOAD FIELD ─────────────────────────────────────────────────────

function MediaUpload({
  label, accept, value, onChange, required, icon, hint, capture
}: {
  label: string; accept: string; value: string;
  onChange: (v: string) => void; required?: boolean;
  icon: string; hint: string; capture?: string;
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
      <div
        onClick={() => ref.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all min-h-[140px] ${value ? "border-rose-400/60 bg-rose-900/20" : "border-rose-300/30 bg-black/30 hover:border-rose-400/50 hover:bg-black/40"}`}
      >
        <input
          ref={ref} type="file" accept={accept}
          capture={capture as "environment" | "user" | undefined}
          onChange={handleFile} className="hidden"
        />
        {value ? (
          isVideo ? (
            <video src={value} className="max-h-36 rounded-lg" controls />
          ) : (
            <img src={value} alt="" className="max-h-36 rounded-lg object-cover" />
          )
        ) : (
          <>
            <i className={`${icon} text-3xl text-rose-300/60`} />
            <div className="text-center">
              <p className="text-sm font-bold text-rose-200/80">Toca para {isVideo ? "grabar / subir video" : "tomar foto / subir imagen"}</p>
              <p className="text-[11px] text-rose-300/50 mt-1">{hint}</p>
            </div>
          </>
        )}
        {value && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange(""); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-rose-300/40 flex items-center justify-center text-rose-300 text-xs hover:bg-red-900/60"
          >
            <i className="ri-close-line" />
          </button>
        )}
      </div>
      {!value && required && (
        <p className="text-[11px] text-red-400/80 mt-1 font-medium">Campo obligatorio</p>
      )}
    </div>
  );
}

// ─── CHECKBOX ITEM ──────────────────────────────────────────────────────────

function Chk({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${checked ? "bg-rose-600 border-rose-400" : "bg-black/40 border-rose-300/40 group-hover:border-rose-400/60"}`}
      >
        {checked && <i className="ri-check-line text-white text-[10px]" />}
      </div>
      <span className="text-sm font-medium text-rose-100/85">{label}</span>
    </label>
  );
}

// ─── TIER CARD ───────────────────────────────────────────────────────────────

function TierCard({ value, selected, badge, desc, color, onSelect }: {
  value: string; selected: boolean; badge: string; desc: string; color: string; onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${selected ? "border-rose-400/70 bg-rose-900/30" : "border-rose-300/20 bg-black/30 hover:border-rose-300/40"}`}
    >
      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2" style={{ background: color, color: '#fff' }}>{badge}</span>
      <p className="text-xs text-rose-200/80">{desc}</p>
    </div>
  );
}

// ─── MONTH TOGGLE ────────────────────────────────────────────────────────────

function MonthGrid({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {MESES.map(m => {
        const sel = selected.includes(m);
        return (
          <button
            key={m} type="button"
            onClick={() => onChange(sel ? selected.filter(x => x !== m) : [...selected, m])}
            className={`py-1.5 text-[11px] font-bold rounded border transition-all ${sel ? "bg-rose-700 border-rose-500 text-white" : "bg-black/30 border-rose-300/25 text-rose-300/70 hover:border-rose-400/50"}`}
          >{m}</button>
        );
      })}
    </div>
  );
}

// ─── GPS ROWS ────────────────────────────────────────────────────────────────

function GPSRows({ rows, onChange }: {
  rows: FormData["gpsVertices"];
  onChange: (v: FormData["gpsVertices"]) => void;
}) {
  const update = (i: number, k: keyof FormData["gpsVertices"][0], v: string) => {
    const next = rows.map((r, idx) => idx === i ? { ...r, [k]: v } : r);
    onChange(next);
  };
  const add = () => onChange([...rows, { vertice: `V${rows.length + 1}`, lat: "", lon: "", alt: "" }]);
  const del = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
          <div>
            <label className={lbl}>Vértice</label>
            <input className={inp} value={r.vertice} onChange={e => update(i, "vertice", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Lat. (°S){reqStar}</label>
            <input className={inp} placeholder="-12.XXXXX" value={r.lat} onChange={e => update(i, "lat", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Long. (°W){reqStar}</label>
            <input className={inp} placeholder="-73.XXXXX" value={r.lon} onChange={e => update(i, "lon", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Alt. (msnm)</label>
            <input className={inp} placeholder="msnm" value={r.alt} onChange={e => update(i, "alt", e.target.value)} />
          </div>
          <button type="button" onClick={() => del(i)} className="py-2 px-3 rounded-md text-xs font-bold bg-red-900/30 border border-red-400/30 text-red-400 hover:bg-red-900/50 transition-all">✕ Quitar</button>
        </div>
      ))}
      <button type="button" onClick={add} className="mt-1 px-4 py-2 rounded-md text-xs font-bold border border-rose-300/30 text-rose-200 bg-black/30 hover:bg-black/50 transition-all">
        <i className="ri-add-line mr-1" /> Agregar vértice GPS
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function Registro() {
  const [data, setData] = useState<FormData>(init);
  const [active, setActive] = useState<SectionId>("identidad");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const upd = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setData(d => ({ ...d, [k]: v }));
    setErrors(e => ({ ...e, [k]: false }));
  };

  // Validate current section before advancing
  const validateSection = (id: SectionId): boolean => {
    const sec = SECTIONS.find(s => s.id === id)!;
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    let ok = true;
    for (const field of sec.required) {
      const val = data[field];
      const empty = typeof val === "boolean" ? !val : !String(val).trim();
      if (empty) { newErrors[field] = true; ok = false; }
    }
    // GPS vias: at least one required for parcela
    if (id === "parcela") {
      const hasVia = data.viasTrocha || data.viasAfirmada || data.viasAsfaltado || data.viasHerradura || data.viasFluvial || data.viasPie;
      if (!hasVia) { newErrors["viasTrocha"] = true; ok = false; }
    }
    setErrors(e => ({ ...e, ...newErrors }));
    return ok;
  };

  const goTo = (nextId: SectionId) => {
    const curIdx = SECTIONS.findIndex(s => s.id === active);
    const nextIdx = SECTIONS.findIndex(s => s.id === nextId);
    if (nextIdx > curIdx) {
      if (!validateSection(active)) return;
    }
    setActive(nextId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    const idx = SECTIONS.findIndex(s => s.id === active);
    if (idx < SECTIONS.length - 1) goTo(SECTIONS[idx + 1].id);
  };

  const goPrev = () => {
    const idx = SECTIONS.findIndex(s => s.id === active);
    if (idx > 0) setActive(SECTIONS[idx - 1].id);
  };

  const handleSubmit = () => {
    let allOk = true;
    for (const sec of SECTIONS) {
      if (!validateSection(sec.id)) { allOk = false; setActive(sec.id); break; }
    }
    if (allOk) setSubmitted(true);
  };

  const filled = SECTIONS.filter(s => {
    if (!s.required.length) return true;
    return s.required.every(f => {
      const v = data[f];
      return typeof v === "boolean" ? v : String(v).trim();
    });
  }).length;
  const pct = Math.round((filled / SECTIONS.length) * 100);

  const isErr = (f: keyof FormData) => !!errors[f];
  const I = (f: keyof FormData) => isErr(f) ? inpErr : inp;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#14532d,#16a34a)' }}>
          <i className="ri-check-double-line text-4xl text-white" />
        </div>
        <h2 className="text-2xl font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Registro Enviado</h2>
        <p className="text-sm text-rose-200/70 max-w-sm">La ficha del productor fue completada y firmada. Los datos tienen validez de declaración jurada.</p>
        <button onClick={() => { setData(init); setSubmitted(false); setActive("identidad"); }}
          className="mt-4 px-6 py-3 rounded-lg text-sm font-bold text-white border border-rose-400/50 bg-rose-900/40 hover:bg-rose-900/60 transition-all">
          <i className="ri-add-line mr-2" /> Nuevo registro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">

      {/* ── PORTADA ── */}
      <div className="rounded-xl bg-black/45 backdrop-blur-md border border-rose-300/30 p-5 md:p-6">
        <p className="text-[10px] font-bold text-rose-300/70 uppercase tracking-[0.3em] mb-1">Ficha de Registro · Cacao Chuncho Orgánico</p>
        <h2 className="text-2xl md:text-3xl font-bold text-rose-50 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Registro de Productor
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Folio N.°", k: "folio" as const, ph: "0001" },
            { label: "Fecha", k: "fecha" as const, type: "date" },
            { label: "Nombre del acopiador", k: "nombreAcopiador" as const, ph: "Nombre completo" },
            { label: "Zona / ruta de acopio", k: "zonaRuta" as const, ph: "Ej. Ruta Quillabamba Norte" },
          ].map(f => (
            <div key={f.k}>
              <label className={lbl}>{f.label}</label>
              <input type={f.type || "text"} className={inp} placeholder={f.ph} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide">Completitud</span>
            <span className="text-[11px] font-bold text-rose-100">{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#C9A84C,#F0D38A,#C9A84C)' }} />
          </div>
        </div>
      </div>

      {/* ── SECTION TABS ── */}
      <div className="grid grid-cols-3 md:grid-cols-9 gap-1.5">
        {SECTIONS.map(s => {
          const isActive = active === s.id;
          const isDone = s.required.length > 0 && s.required.every(f => {
            const v = data[f]; return typeof v === "boolean" ? v : String(v).trim();
          });
          return (
            <button key={s.id} onClick={() => goTo(s.id)}
              className={`relative rounded-lg px-1.5 py-2.5 text-center transition-all cursor-pointer ${isActive ? "scale-[1.03]" : "hover:scale-[1.01]"}`}
              style={{
                background: isActive ? 'linear-gradient(135deg,#3F0D17,#7A1D2E,#3F0D17)' : 'rgba(20,12,8,0.55)',
                border: isActive ? '1px solid rgba(201,168,76,0.55)' : '1px solid rgba(244,114,182,0.15)',
                boxShadow: isActive ? '0 0 14px rgba(122,29,46,0.5)' : 'none',
              }}
            >
              {isDone && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400" />}
              <div className="text-[10px] font-black text-rose-300/60 mb-0.5">{s.num}</div>
              <i className={`${s.icon} text-base ${isActive ? "text-rose-200" : "text-rose-300/60"}`} />
            </button>
          );
        })}
      </div>
      <div className="text-center">
        <span className="text-xs font-bold text-rose-200/70 uppercase tracking-widest">
          {SECTIONS.find(s => s.id === active)?.title}
        </span>
      </div>

      {/* ── SECTION BODY ── */}
      <div className="rounded-xl bg-black/55 backdrop-blur-md border border-rose-300/30 p-5 md:p-7 space-y-5">

        {/* ══ 1. IDENTIDAD ══ */}
        {active === "identidad" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>
              Identidad del Productor
            </h3>

            {/* Foto y Video — obligatorios y prominentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MediaUpload
                label="Foto del productor"
                accept="image/*"
                value={data.fotoProductor}
                onChange={v => upd("fotoProductor", v)}
                required
                icon="ri-camera-line"
                hint="Toma la foto directamente o sube una imagen. Rostro visible, buena luz."
                capture="environment"
              />
              <MediaUpload
                label="Video breve de presentación"
                accept="video/*"
                value={data.videoProductor}
                onChange={v => upd("videoProductor", v)}
                required
                icon="ri-video-line"
                hint="Graba un video corto o sube uno. El productor se presenta en sus propias palabras."
                capture="environment"
              />
            </div>

            <p className={sublbl}>Datos personales y de contacto</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Nombre completo del productor{reqStar}</label>
                <input className={I("nombre")} placeholder="Apellido paterno · Apellido materno · Nombres" value={data.nombre} onChange={e => upd("nombre", e.target.value)} />
                {isErr("nombre") && <p className="text-[11px] text-red-400 mt-1">Campo obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>DNI{reqStar}</label>
                <input className={I("dni")} maxLength={8} placeholder="12345678" value={data.dni} onChange={e => upd("dni", e.target.value)} />
                {isErr("dni") && <p className="text-[11px] text-red-400 mt-1">Campo obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Número de celular{reqStar}</label>
                <input className={I("telefono")} type="tel" placeholder="9XX XXX XXX" value={data.telefono} onChange={e => upd("telefono", e.target.value)} />
                {isErr("telefono") && <p className="text-[11px] text-red-400 mt-1">Campo obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Celular de cónyuge / familiar responsable</label>
                <input className={inp} type="tel" placeholder="Segundo contacto" value={data.telefonoFamiliar} onChange={e => upd("telefonoFamiliar", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Nombre del cónyuge o familiar</label>
                <input className={inp} placeholder="Nombre completo" value={data.nombreFamiliar} onChange={e => upd("nombreFamiliar", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Comunidad{reqStar}</label>
                <input className={I("comunidad")} placeholder="Nombre de la comunidad campesina" value={data.comunidad} onChange={e => upd("comunidad", e.target.value)} />
                {isErr("comunidad") && <p className="text-[11px] text-red-400 mt-1">Campo obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Distrito{reqStar}</label>
                <input className={I("distrito")} placeholder="Distrito exacto" value={data.distrito} onChange={e => upd("distrito", e.target.value)} />
                {isErr("distrito") && <p className="text-[11px] text-red-400 mt-1">Campo obligatorio</p>}
              </div>
            </div>

            <p className={sublbl}>Composición familiar y capacidad operativa</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Personas en el hogar", k: "personasHogar" as const, ph: "Ej. 5" },
                { label: "Personas que trabajan la parcela", k: "personasTrabajan" as const, ph: "Ej. 3" },
                { label: "Años de experiencia en cacao", k: "aniosExperiencia" as const, ph: "Ej. 12" },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  <input type="number" className={inp} placeholder={f.ph} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
                </div>
              ))}
              <div>
                <label className={lbl}>Relación laboral</label>
                <select className={inp} style={selectStyle} value={data.relacionLaboral} onChange={e => upd("relacionLaboral", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Solo el titular</option>
                  <option>Titular + familia</option>
                  <option>Titular + peones contratados</option>
                  <option>Familiar + peones</option>
                </select>
              </div>
            </div>

            <p className={sublbl}>Situación financiera y comercial</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "¿Tiene cuenta bancaria o en caja rural?", k: "tieneCuenta" as const, opts: ["Sí — cuenta de ahorros activa","Sí — cuenta en caja rural / cooperativa","No tiene cuenta"] },
                { label: "¿Ha recibido crédito agrario?", k: "recibioCreditoAgrario" as const, opts: ["Sí — Agrobanco","Sí — Caja Rural","Sí — habilitación de comprador","No ha recibido crédito"] },
                { label: "¿Tiene deuda activa con otro comprador?*", k: "tieneDeuda" as const, opts: ["No — libre de compromisos","Sí — deuda pendiente con acopiador","Sí — habilitación con empresa","Prefiere no indicar"] },
                { label: "Antigüedad con comprador actual (años)", k: "antiguedadComprador" as const, opts: null },
                { label: "¿Por qué le vende a su comprador actual?", k: "razonComprador" as const, opts: ["Mejor precio","Pago al contado inmediato","Confianza y trato personal","Cercanía geográfica","Crédito o habilitación","Falta de otras opciones"] },
                { label: "Disposición a adoptar nuevas prácticas (1–5)*", k: "disposicion" as const, opts: ["5 — Muy dispuesto","4 — Bastante dispuesto","3 — Moderadamente dispuesto","2 — Poco dispuesto","1 — No dispuesto"] },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  {f.opts ? (
                    <select className={inp} style={selectStyle} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)}>
                      <option value="">— Seleccionar —</option>
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="number" className={inp} placeholder="Ej. 4 años" value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
                  )}
                </div>
              ))}
            </div>

            <p className={sublbl}>Segmentación estratégica del productor</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <TierCard value="A" selected={data.tier === "A"} onSelect={() => upd("tier","A")}
                badge="TIER A — Prioritario" color="#2c4a1e"
                desc="Alta producción · Buenas prácticas · Sin deuda con terceros · Abierto a capacitación." />
              <TierCard value="B" selected={data.tier === "B"} onSelect={() => upd("tier","B")}
                badge="TIER B — Desarrollo" color="#8b6914"
                desc="Producción media · Potencial de mejora · Puede tener compromisos parciales." />
              <TierCard value="C" selected={data.tier === "C"} onSelect={() => upd("tier","C")}
                badge="TIER C — Seguimiento" color="#6b6b6b"
                desc="Baja producción o alta dependencia de otro comprador. Monitoreo sin inversión directa." />
            </div>
            <div>
              <label className={lbl}>Justificación de la segmentación</label>
              <textarea rows={3} className={inp} placeholder="Razones para la clasificación en el tier correspondiente..." value={data.justificacionTier} onChange={e => upd("justificacionTier", e.target.value)} />
            </div>
          </>
        )}

        {/* ══ 2. PARCELA ══ */}
        {active === "parcela" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Parcela y Georreferenciación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className={lbl}>Nombre de la parcela o finca{reqStar}</label>
                <input className={I("nombreParcela")} placeholder="Nombre con que el productor identifica su parcela" value={data.nombreParcela} onChange={e => upd("nombreParcela", e.target.value)} />
                {isErr("nombreParcela") && <p className="text-[11px] text-red-400 mt-1">Campo obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Altitud (msnm){reqStar}</label>
                <input className={I("altitud")} type="number" placeholder="Ej. 1100" value={data.altitud} onChange={e => upd("altitud", e.target.value)} />
                {isErr("altitud") && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Superficie total de la parcela (ha){reqStar}</label>
                <input className={I("superficieTotal")} type="number" step="0.01" placeholder="0.00" value={data.superficieTotal} onChange={e => upd("superficieTotal", e.target.value)} />
                {isErr("superficieTotal") && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Área en cacao chuncho orgánico (ha){reqStar}</label>
                <input className={I("areaCacao")} type="number" step="0.01" placeholder="0.00" value={data.areaCacao} onChange={e => upd("areaCacao", e.target.value)} />
                {isErr("areaCacao") && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Otros cultivos presentes</label>
                <input className={inp} placeholder="Ej. café, plátano, cítricos..." value={data.otrosCultivos} onChange={e => upd("otrosCultivos", e.target.value)} />
              </div>
            </div>

            <p className={sublbl}>Vías de acceso y comunicación{reqStar}</p>
            {isErr("viasTrocha") && <p className="text-[11px] text-red-400 -mt-2 mb-1">Seleccione al menos una vía</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Chk checked={data.viasTrocha} onChange={v => upd("viasTrocha", v)} label="Trocha carrozable" />
              <Chk checked={data.viasAfirmada} onChange={v => upd("viasAfirmada", v)} label="Carretera afirmada" />
              <Chk checked={data.viasAsfaltado} onChange={v => upd("viasAsfaltado", v)} label="Asfaltado" />
              <Chk checked={data.viasHerradura} onChange={v => upd("viasHerradura", v)} label="Camino de herradura" />
              <Chk checked={data.viasFluvial} onChange={v => upd("viasFluvial", v)} label="Fluvial — río o quebrada" />
              <Chk checked={data.viasPie} onChange={v => upd("viasPie", v)} label="Acceso a pie únicamente" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Distancia a la vía principal (km)</label>
                <input className={inp} type="number" step="0.5" placeholder="Ej. 3.5" value={data.distanciaVia} onChange={e => upd("distanciaVia", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Tiempo estimado de carga a acopio (horas)</label>
                <input className={inp} type="number" step="0.5" placeholder="Ej. 2" value={data.tiempoFlete} onChange={e => upd("tiempoFlete", e.target.value)} />
              </div>
            </div>

            <p className={sublbl}>Características del suelo y sombra</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Tipo de suelo predominante", k: "tipoSuelo" as const, opts: ["Franco arcilloso","Franco arenoso","Arcilloso pesado","Franco limoso","No lo conoce"] },
                { label: "Sistema de sombra", k: "sistemaSombra" as const, opts: ["Sombra diversificada — árboles nativos múltiples","Sombra con guabo / guaba (Inga sp.)","Sombra con plátano o musáceas","Sombra combinada (nativo + plátano)","Sin sombra — monocultivo a pleno sol"] },
                { label: "Fuente hídrica en parcela*", k: "fuenteHidrica" as const, opts: ["Sí — río o quebrada permanente","Sí — manantial o puquio","Sí — canal de riego","No cuenta con fuente hídrica"] },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  <select className={isErr(f.k) ? inpErr : inp} style={selectStyle} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)}>
                    <option value="">— Seleccionar —</option>
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                  {isErr(f.k) && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
                </div>
              ))}
            </div>

            <p className={sublbl}>Polígono GPS de la parcela <span className="text-red-400 normal-case text-[10px]">REQUERIDO EUDR</span></p>
            <div className="p-3 rounded-lg border border-amber-400/30 bg-amber-900/10 text-xs text-amber-200/80 mb-2">
              <i className="ri-alert-line mr-1" /> El Reglamento EUDR (diciembre 2026) exige las coordenadas GPS de cada vértice del polígono para exportar a la UE.
            </div>
            <GPSRows rows={data.gpsVertices} onChange={v => setData(d => ({ ...d, gpsVertices: v }))} />
            <div>
              <label className={lbl}>Código de parcela en sistema de trazabilidad</label>
              <input className={inp} placeholder="Ej. CCC-QUI-0042" value={data.codigoParcela} onChange={e => upd("codigoParcela", e.target.value)} />
            </div>
          </>
        )}

        {/* ══ 3. CULTIVO ══ */}
        {active === "cultivo" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Características del Cultivo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Edad aprox. de plantas (años)*", k: "edadPlantas" as const, ph: "Ej. 18" },
                { label: "Distanciamiento entre plantas (m×m)*", k: "distanciamiento" as const, ph: "Ej. 3×3" },
                { label: "N.° estimado de plantas de cacao", k: "numeroPlantas" as const, ph: "Ej. 800" },
                { label: "% plantas en producción activa", k: "pctProduccion" as const, ph: "Ej. 85" },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  <input className={isErr(f.k) ? inpErr : inp} placeholder={f.ph} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
                  {isErr(f.k) && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
                </div>
              ))}
            </div>

            <p className={sublbl}>Calidad del grano y atributos de taza</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={lbl}>Grado brix (último muestreo){reqStar}</label>
                <input className={I("gradosBrix")} type="number" step="0.1" placeholder="Ej. 14.5" value={data.gradosBrix} onChange={e => upd("gradosBrix", e.target.value)} />
                {isErr("gradosBrix") && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Fecha del último muestreo brix</label>
                <input className={inp} type="date" value={data.fechaMuestreoBrix} onChange={e => upd("fechaMuestreoBrix", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Color predominante del grano en corte</label>
                <select className={inp} style={selectStyle} value={data.colorGrano} onChange={e => upd("colorGrano", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Violeta intenso — muy alta antocianina</option>
                  <option>Violeta medio</option>
                  <option>Violeta pálido / rosado</option>
                  <option>Blanco / crema — fino aromático</option>
                  <option>Mezcla violeta y blanco</option>
                  <option>No observado aún</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Prácticas de post-cosecha del productor</label>
                <select className={inp} style={selectStyle} value={data.practicasPostCosecha} onChange={e => upd("practicasPostCosecha", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Entrega inmediata sin espera</option>
                  <option>Deja reposar en costal 6–12 horas</option>
                  <option>Deja reposar más de 12 horas</option>
                  <option>Inicia pre-fermentación artesanal</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Herramienta de cosecha utilizada</label>
                <select className={inp} style={selectStyle} value={data.herramientaCosecha} onChange={e => upd("herramientaCosecha", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Tijera de podar — corte limpio</option>
                  <option>Machete con tiento</option>
                  <option>Machete directo</option>
                  <option>Combina tijera y machete</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Notas sensoriales percibidas</label>
                <input className={inp} placeholder="Ej. frutal, floral, nuez, cítrico..." value={data.notasSensoriales} onChange={e => upd("notasSensoriales", e.target.value)} />
              </div>
            </div>
          </>
        )}

        {/* ══ 4. PRODUCCIÓN ══ */}
        {active === "produccion" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Producción y Estimados de Cosecha</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Estimado anual — kg baba*", k: "estimadoAnual" as const, ph: "Kg baba / año" },
                { label: "Rendimiento real últimos 2 años", k: "rendimientoHistorico" as const, ph: "Ej. 2024: 1800 / 2023: 1600" },
                { label: "Principal comprador actual", k: "compradorActual" as const, ph: "Nombre o empresa" },
                { label: "Precio recibido por kg baba (S/.)", k: "precioKg" as const, ph: "S/. por kg" },
                { label: "Costo estimado de flete por kg (S/.)", k: "costoFlete" as const, ph: "S/. por kg" },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  <input className={isErr(f.k) ? inpErr : inp} placeholder={f.ph} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)} />
                  {isErr(f.k) && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
                </div>
              ))}
              <div>
                <label className={lbl}>Almacenamiento disponible</label>
                <select className={inp} style={selectStyle} value={data.almacenamiento} onChange={e => upd("almacenamiento", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Sí — almacén propio en parcela</option>
                  <option>Sí — almacén comunal</option>
                  <option>No dispone de almacén</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Tipo de acopio{reqStar}</label>
                <select className={isErr("tipoAcopio") ? inpErr : inp} style={selectStyle} value={data.tipoAcopio} onChange={e => upd("tipoAcopio", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Sí — tiene punto de acopio propio</option>
                  <option>No — entrega directamente al acopiador</option>
                  <option>Acopio comunal compartido</option>
                </select>
                {isErr("tipoAcopio") && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Forma de transporte hasta el acopio</label>
                <select className={inp} style={selectStyle} value={data.transporte} onChange={e => upd("transporte", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Acémila / mula</option>
                  <option>Mototaxi o moto carga</option>
                  <option>A pie</option>
                  <option>Camioneta propia o arrendada</option>
                  <option>El acopiador recoge en parcela</option>
                </select>
              </div>
            </div>

            <p className={sublbl}>Meses de disponibilidad de cosecha{reqStar}</p>
            <MonthGrid selected={data.mesesCosecha} onChange={v => upd("mesesCosecha", v)} />

            <p className={sublbl}>Calendario de entregas estimadas por época{reqStar}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b border-rose-300/20">
                    {["Época","Meses","Kg baba","Kg seco","Forma de pago","Observaciones"].map(h => (
                      <th key={h} className="text-left p-2 text-rose-300/60 font-bold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Cosecha principal 1", meses: "cosechaPrincipal1Meses" as const, baba: "cosechaPrincipal1Baba" as const, seco: "cosechaPrincipal1Seco" as const, pago: "cosechaPrincipal1Pago" as const, obs: "cosechaPrincipal1Obs" as const },
                    { label: "Cosecha principal 2", meses: "cosechaPrincipal2Meses" as const, baba: "cosechaPrincipal2Baba" as const, seco: "cosechaPrincipal2Seco" as const, pago: "cosechaPrincipal2Pago" as const, obs: "cosechaPrincipal2Obs" as const },
                    { label: "Cosecha intermedia", meses: "cosechaIntermediaMeses" as const, baba: "cosechaIntermediaBaba" as const, seco: "cosechaIntermediaSeco" as const, pago: "cosechaIntermediaPago" as const, obs: "cosechaIntermedaObs" as const },
                  ].map(row => (
                    <tr key={row.label} className="border-b border-rose-300/10">
                      <td className="p-2 font-bold text-rose-300/70 whitespace-nowrap">{row.label}</td>
                      <td className="p-1"><input className={`${inp} text-xs py-1.5`} placeholder="Ej. Mar–May" value={String(data[row.meses])} onChange={e => upd(row.meses, e.target.value)} /></td>
                      <td className="p-1"><input type="number" className={`${inp} text-xs py-1.5`} placeholder="kg" value={String(data[row.baba])} onChange={e => upd(row.baba, e.target.value)} /></td>
                      <td className="p-1"><input type="number" className={`${inp} text-xs py-1.5`} placeholder="kg" value={String(data[row.seco])} onChange={e => upd(row.seco, e.target.value)} /></td>
                      <td className="p-1">
                        <select className={`${inp} text-xs py-1.5`} style={selectStyle} value={String(data[row.pago])} onChange={e => upd(row.pago, e.target.value)}>
                          <option value="">—</option>
                          <option>Contado inmediato</option>
                          <option>Adelanto 50%</option>
                          <option>Contra entrega</option>
                        </select>
                      </td>
                      <td className="p-1"><input className={`${inp} text-xs py-1.5`} placeholder="Notas..." value={String(data[row.obs])} onChange={e => upd(row.obs, e.target.value)} /></td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-rose-400/30">
                    <td className="p-2 font-bold text-rose-200/90">Total anual proyectado</td>
                    <td className="p-1"><input className={`${inp} text-xs py-1.5`} placeholder="Resumen" value={data.totalAnualBaba} onChange={e => upd("totalAnualBaba", e.target.value)} /></td>
                    <td className="p-1"><input type="number" className={`${inp} text-xs py-1.5`} placeholder="Total kg baba" value={data.totalAnualSeco} onChange={e => upd("totalAnualSeco", e.target.value)} /></td>
                    <td className="p-1"><input type="number" className={`${inp} text-xs py-1.5`} placeholder="Total kg seco" value={data.totalAnualObs} onChange={e => upd("totalAnualObs", e.target.value)} /></td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ══ 5. SANIDAD ══ */}
        {active === "sanidad" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Sanidad Vegetal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={lbl}>Plaga o enfermedad más agresiva{reqStar}</label>
                <select className={I("plagaPrincipal")} style={selectStyle} value={data.plagaPrincipal} onChange={e => upd("plagaPrincipal", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Moniliasis (Moniliophthora roreri)</option>
                  <option>Escoba de bruja (M. perniciosa)</option>
                  <option>Phytophthora — mazorca negra</option>
                  <option>Barrenador del fruto (Carmenta sp.)</option>
                  <option>Chinche de la mazorca (Monalonion sp.)</option>
                  <option>Mosquilla del cacao (Ceratopogonidae)</option>
                  <option>Otra — especificar abajo</option>
                </select>
                {isErr("plagaPrincipal") && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>% afectación — plaga principal{reqStar}</label>
                <input className={I("pctAfectacionPrincipal")} type="number" min="0" max="100" placeholder="Ej. 25" value={data.pctAfectacionPrincipal} onChange={e => upd("pctAfectacionPrincipal", e.target.value)} />
                {isErr("pctAfectacionPrincipal") && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Plaga o enfermedad secundaria</label>
                <input className={inp} placeholder="Nombre de la plaga" value={data.plagaSecundaria} onChange={e => upd("plagaSecundaria", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>% afectación — plaga secundaria</label>
                <input className={inp} type="number" min="0" max="100" placeholder="%" value={data.pctAfectacionSecundaria} onChange={e => upd("pctAfectacionSecundaria", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Meses de mayor presión de plaga</label>
                <input className={inp} placeholder="Ej. Nov–Ene (lluvias)" value={data.mesesPresionPlaga} onChange={e => upd("mesesPresionPlaga", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Plaga especificada (si indicó «Otra»)</label>
                <input className={inp} placeholder="Nombre local o científico" value={data.plagaOtra} onChange={e => upd("plagaOtra", e.target.value)} />
              </div>
            </div>

            <p className={sublbl}>Tipo de control fitosanitario aplicado{reqStar}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Chk checked={data.controlEcologico} onChange={v => upd("controlEcologico", v)} label="Ecológico / cultural (poda sanitaria, chaleo)" />
              <Chk checked={data.controlBiologico} onChange={v => upd("controlBiologico", v)} label="Biológico (Trichoderma, Beauveria, etc.)" />
              <Chk checked={data.controlQuimico} onChange={v => upd("controlQuimico", v)} label="Químico convencional (fungicidas, insecticidas)" />
              <Chk checked={data.controlNinguno} onChange={v => upd("controlNinguno", v)} label="Sin ningún control aplicado" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Productos o insumos utilizados (nombre y dosis)</label>
                <textarea rows={3} className={inp} placeholder="Especificar: nombre del producto, dosis, frecuencia..." value={data.productosControl} onChange={e => upd("productosControl", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Frecuencia de aplicación de controles</label>
                <select className={inp} style={selectStyle} value={data.frecuenciaControl} onChange={e => upd("frecuenciaControl", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Preventivo — calendario fijo</option>
                  <option>Curativo — cuando aparece el problema</option>
                  <option>Mixto preventivo + curativo</option>
                  <option>No aplica ningún control</option>
                </select>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-rose-400/20 bg-rose-900/10 text-xs text-rose-200/70">
              <i className="ri-information-line mr-1" /> Para mantener la certificación orgánica, ningún producto químico de síntesis debe aplicarse. Verificar compatibilidad con el reglamento de la certificadora.
            </div>
          </>
        )}

        {/* ══ 6. CERTIFICACIÓN ══ */}
        {active === "certificacion" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Certificación Orgánica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Estado de certificación{reqStar}</label>
                <select className={I("estadoCertificacion")} style={selectStyle} value={data.estadoCertificacion} onChange={e => upd("estadoCertificacion", e.target.value)}>
                  <option value="">— Seleccionar —</option>
                  <option>Certificación activa y vigente</option>
                  <option>En proceso de conversión (1.° año)</option>
                  <option>En proceso de conversión (2.° año)</option>
                  <option>En proceso de conversión (3.° año)</option>
                  <option>Certificación vencida — en renovación</option>
                  <option>No cuenta con certificación</option>
                  <option>Interesado en iniciar el proceso</option>
                </select>
                {isErr("estadoCertificacion") && <p className="text-[11px] text-red-400 mt-1">Obligatorio</p>}
              </div>
              <div>
                <label className={lbl}>Entidad certificadora</label>
                <input className={inp} placeholder="Ej. KIWA BCS, Control Union, CERES, IMO..." value={data.entidadCertificadora} onChange={e => upd("entidadCertificadora", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>N.° de certificado o código de operador</label>
                <input className={inp} placeholder="Número de certificado vigente" value={data.numeroCertificado} onChange={e => upd("numeroCertificado", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Fecha de vencimiento del certificado</label>
                <input className={inp} type="date" value={data.fechaVencimiento} onChange={e => upd("fechaVencimiento", e.target.value)} />
              </div>
            </div>
            <p className={sublbl}>Estándares certificados</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Chk checked={data.certNOP} onChange={v => upd("certNOP", v)} label="NOP — USDA Organic (EE.UU.)" />
              <Chk checked={data.certEU} onChange={v => upd("certEU", v)} label="EU Organic — Regl. 848/2018" />
              <Chk checked={data.certJAS} onChange={v => upd("certJAS", v)} label="JAS — Japón" />
              <Chk checked={data.certFairtrade} onChange={v => upd("certFairtrade", v)} label="Fairtrade / Comercio Justo" />
              <Chk checked={data.certRainforest} onChange={v => upd("certRainforest", v)} label="Rainforest Alliance" />
            </div>
            <div>
              <label className={lbl}>Observaciones sobre la certificación</label>
              <textarea rows={3} className={inp} placeholder="Estado del proceso, observaciones del auditor, pendientes..." value={data.obsCertificacion} onChange={e => upd("obsCertificacion", e.target.value)} />
            </div>
            <div className="p-3 rounded-lg border border-amber-400/25 bg-amber-900/10 text-xs text-amber-200/70">
              <i className="ri-alert-line mr-1" /> La certificación orgánica EU es obligatoria para acceder al diferencial premium en el mercado europeo. Para el EUDR adicional, se requiere la trazabilidad de parcela y el polígono GPS.
            </div>
          </>
        )}

        {/* ══ 7. CAPACITACIÓN ══ */}
        {active === "capacitacion" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Capacitación y Asistencia Técnica</h3>
            <p className={sublbl}>Capacitación recibida en los últimos 2 años</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Chk checked={data.capMunicipalidad} onChange={v => upd("capMunicipalidad", v)} label="Municipalidad distrital" />
              <Chk checked={data.capMIDGRI} onChange={v => upd("capMIDGRI", v)} label="MIDAGRI / Agrorural" />
              <Chk checked={data.capGORE} onChange={v => upd("capGORE", v)} label="GORE Cusco" />
              <Chk checked={data.capDEVIDA} onChange={v => upd("capDEVIDA", v)} label="DEVIDA" />
              <Chk checked={data.capONG} onChange={v => upd("capONG", v)} label="ONG (especificar abajo)" />
              <Chk checked={data.capEmpresa} onChange={v => upd("capEmpresa", v)} label="Empresa compradora o exportadora" />
              <Chk checked={data.capCooperativa} onChange={v => upd("capCooperativa", v)} label="Cooperativa o asociación" />
              <Chk checked={data.capNinguna} onChange={v => upd("capNinguna", v)} label="No ha recibido ninguna capacitación" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <label className={lbl}>ONG o institución — especificar nombre</label>
                <input className={inp} placeholder="Nombre de la ONG o proyecto" value={data.nombreONG} onChange={e => upd("nombreONG", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Tema principal de la capacitación recibida</label>
                <input className={inp} placeholder="Ej. manejo agronómico, fermentación..." value={data.temaCapacitacion} onChange={e => upd("temaCapacitacion", e.target.value)} />
              </div>
            </div>

            <p className={sublbl}>Temas prioritarios en que desea capacitarse</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Chk checked={data.temaManejo} onChange={v => upd("temaManejo", v)} label="Manejo agronómico del cacao (poda, fertilización, sombra)" />
              <Chk checked={data.temaFermentacion} onChange={v => upd("temaFermentacion", v)} label="Fermentación y secado — calidad post-cosecha" />
              <Chk checked={data.temaPlagas} onChange={v => upd("temaPlagas", v)} label="Control de plagas — enfoque ecológico" />
              <Chk checked={data.temaCertificacion} onChange={v => upd("temaCertificacion", v)} label="Certificación orgánica — proceso y mantenimiento" />
              <Chk checked={data.temaFinanciero} onChange={v => upd("temaFinanciero", v)} label="Gestión financiera básica y ahorro familiar" />
              <Chk checked={data.temaBuenasPracticas} onChange={v => upd("temaBuenasPracticas", v)} label="Buenas prácticas de cosecha y calidad de grano" />
              <Chk checked={data.temaMercados} onChange={v => upd("temaMercados", v)} label="Acceso a mercados y cadena de valor" />
              <Chk checked={data.temaClima} onChange={v => upd("temaClima", v)} label="Adaptación al cambio climático" />
              <Chk checked={data.temaGPS} onChange={v => upd("temaGPS", v)} label="Uso del GPS — georreferenciación y trazabilidad" />
              <Chk checked={data.temaAsociatividad} onChange={v => upd("temaAsociatividad", v)} label="Asociatividad y organización de productores" />
              <Chk checked={data.temaNutricion} onChange={v => upd("temaNutricion", v)} label="Nutrición y salud familiar en zonas cacaoteras" />
            </div>
            <div>
              <label className={lbl}>Comentarios, aspiraciones y necesidades del productor</label>
              <textarea rows={4} className={inp} placeholder="Espacio libre para que el productor exprese sus necesidades, propuestas o aspiraciones..." value={data.comentariosProductor} onChange={e => upd("comentariosProductor", e.target.value)} />
            </div>
          </>
        )}

        {/* ══ 8. EVALUACIÓN ══ */}
        {active === "evaluacion" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Evaluación Interna del Acopiador</h3>
            <div className="p-3 rounded-lg border border-amber-400/30 bg-amber-900/10 text-xs text-amber-200/75 mb-2">
              <i className="ri-lock-line mr-1" /> Esta sección es de uso EXCLUSIVO del acopiador. No debe mostrarse al productor durante el levantamiento de la ficha.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Confiabilidad percibida del productor (1–5)", k: "confiabilidad" as const, opts: ["5 — Muy confiable, cumple siempre","4 — Confiable con seguimiento","3 — Moderado, requiere monitoreo","2 — Poco confiable","1 — No confiable"] },
                { label: "Calidad promedio del grano entregado", k: "calidadGrano" as const, opts: ["Excelente — grano uniforme, brix alto","Buena — dentro del estándar","Regular — necesita mejora","Deficiente — grano inconsistente","Sin historial previo"] },
                { label: "Potencial estratégico del productor", k: "potencialEstrategico" as const, opts: ["Alto — clave para el programa de origen","Medio — contribuye de manera regular","Bajo — volumen menor, zona marginal","Por evaluar — primer contacto"] },
                { label: "Riesgo de pérdida ante competencia", k: "riesgoPerdida" as const, opts: ["Bajo — muy fidelizado, relación sólida","Medio — puede cambiar por precio","Alto — activamente contactado por otros","Crítico — deuda con otro comprador"] },
                { label: "Acción de fidelización recomendada", k: "accionFidelizacion" as const, opts: ["Precio preferencial + visita técnica mensual","Incorporar al programa de capacitación","Ofrecer habilitación de insumos","Visita de refuerzo sin incentivo adicional","Monitoreo pasivo — no invertir aún"] },
              ].map(f => (
                <div key={f.k}>
                  <label className={lbl}>{f.label}</label>
                  <select className={inp} style={selectStyle} value={String(data[f.k])} onChange={e => upd(f.k, e.target.value)}>
                    <option value="">— Seleccionar —</option>
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
              <textarea rows={4} className={inp} placeholder="Observaciones estratégicas, alertas, contexto familiar, situación con otros compradores, notas de la visita de campo..." value={data.notasConfidenciales} onChange={e => upd("notasConfidenciales", e.target.value)} />
            </div>
          </>
        )}

        {/* ══ 9. FIRMAS ══ */}
        {active === "firmas" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>Firmas y Declaración Jurada</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <p className={sublbl}>Firma del productor</p>
                <MediaUpload
                  label="Foto de la firma del productor"
                  accept="image/*"
                  value={data.firmaProductor}
                  onChange={v => upd("firmaProductor", v)}
                  required
                  icon="ri-pen-nib-line"
                  hint="Toma foto de la firma manuscrita sobre papel o firma directamente"
                />
                {isErr("firmaProductor") && <p className="text-[11px] text-red-400">Campo obligatorio</p>}

                <MediaUpload
                  label="Foto de la huella digital del productor"
                  accept="image/*"
                  value={data.huellaProductor}
                  onChange={v => upd("huellaProductor", v)}
                  icon="ri-fingerprint-line"
                  hint="Toma foto de la huella dactilar del productor"
                />
              </div>

              <div className="space-y-4">
                <p className={sublbl}>Firma del acopiador responsable</p>
                <MediaUpload
                  label="Foto de la firma del acopiador"
                  accept="image/*"
                  value={data.firmaAcopiador}
                  onChange={v => upd("firmaAcopiador", v)}
                  required
                  icon="ri-pen-nib-line"
                  hint="Foto de la firma del acopiador que levantó la ficha"
                />
                {isErr("firmaAcopiador") && <p className="text-[11px] text-red-400">Campo obligatorio</p>}

                <div>
                  <label className={lbl}>Fecha y lugar del levantamiento</label>
                  <input className={inp} placeholder="Ej. Quillabamba, 12 de marzo de 2025" value={data.fechaLugar} onChange={e => upd("fechaLugar", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Declaración jurada */}
            <div className={`p-4 rounded-xl border transition-all ${data.declaracionJurada ? "border-rose-400/50 bg-rose-900/20" : isErr("declaracionJurada") ? "border-red-400/70 bg-red-900/10" : "border-rose-300/25 bg-black/30"}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => upd("declaracionJurada", !data.declaracionJurada)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${data.declaracionJurada ? "bg-rose-600 border-rose-400" : "bg-black/40 border-rose-300/40"}`}
                >
                  {data.declaracionJurada && <i className="ri-check-line text-white text-xs" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-100 mb-1">Declaración jurada{reqStar}</p>
                  <p className="text-xs text-rose-200/70 leading-relaxed">
                    Al suscribir esta ficha, el productor y el acopiador declaran bajo juramento que los datos consignados son verídicos, han sido obtenidos con consentimiento informado y tienen valor de <strong className="text-rose-200">declaración jurada</strong>. La información es de carácter reservado y su uso está restringido al programa de trazabilidad de cacao chuncho orgánico. <strong className="text-rose-200">Folio válido únicamente con fotografía adjunta del productor.</strong>
                  </p>
                </div>
              </label>
              {isErr("declaracionJurada") && <p className="text-[11px] text-red-400 mt-2 pl-8">Debe aceptar la declaración jurada para continuar</p>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl text-base font-bold cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #3F0D17 0%, #7A1D2E 50%, #3F0D17 100%)',
                color: '#fff8f0',
                border: '1px solid rgba(201,168,76,0.6)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.5), 0 0 18px rgba(122,29,46,0.45)',
              }}
            >
              <i className="ri-check-double-line mr-2" />
              Enviar registro completo
            </button>
          </>
        )}

        {/* ── NAVIGATION ── */}
        <div className="flex items-center justify-between pt-4 border-t border-rose-300/20">
          <button
            onClick={goPrev}
            disabled={active === SECTIONS[0].id}
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-rose-100 bg-black/40 border border-rose-300/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-black/55 transition-all"
          >
            <i className="ri-arrow-left-line mr-1" /> Anterior
          </button>
          <span className="text-xs text-rose-300/50 font-medium">
            {SECTIONS.findIndex(s => s.id === active) + 1} / {SECTIONS.length}
          </span>
          {active !== "firmas" && (
            <button
              onClick={goNext}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-rose-50 cursor-pointer hover:scale-[1.01] transition-all"
              style={{ background: 'linear-gradient(135deg,#3F0D17,#7A1D2E)', border: '1px solid rgba(201,168,76,0.4)' }}
            >
              Siguiente <i className="ri-arrow-right-line ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

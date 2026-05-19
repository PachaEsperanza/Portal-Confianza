import { useState, useEffect, useRef } from "react";

type SectionId = "identidad" | "familia" | "tierra" | "cultivo" | "historia";

interface FormData {
  // 1. Identidad y Contacto
  nombre: string;
  dni: string;
  telefono: string;
  telefonoFamiliar: string;
  sector: string;
  // 2. Familia
  cargaFamiliar: string;
  // 3. Tierra
  nombreParcela: string;
  tieneTitulo: string;
  tamanoTotal: string;
  hectareasCacao: string;
  produccionAnual: string;
  otrosCultivos: string;
  // 4. Cultivo
  procesoSecado: string;
  abonos: string;
  // 5. Historia
  aniosTrabajando: string;
  sueno: string;
  fotoProductor: string; // base64
}

const STORAGE_KEY = "confianza_registro_data";

const initialData: FormData = {
  nombre: "", dni: "", telefono: "", telefonoFamiliar: "", sector: "",
  cargaFamiliar: "",
  nombreParcela: "", tieneTitulo: "", tamanoTotal: "", hectareasCacao: "", produccionAnual: "", otrosCultivos: "",
  procesoSecado: "", abonos: "",
  aniosTrabajando: "", sueno: "", fotoProductor: "",
};

const SECTIONS: { id: SectionId; num: string; title: string; icon: string }[] = [
  { id: "identidad",  num: "01", title: "Datos de Identidad y Contacto", icon: "ri-user-line" },
  { id: "familia",    num: "02", title: "El Corazón de la Familia",      icon: "ri-heart-line" },
  { id: "tierra",     num: "03", title: "La Tierra y su Producción",     icon: "ri-plant-line" },
  { id: "cultivo",    num: "04", title: "Cuidados del Cultivo",          icon: "ri-leaf-line" },
  { id: "historia",   num: "05", title: "Historia de Vida y Sueños",     icon: "ri-sparkling-2-line" },
];

const inputCls = "w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-rose-300/35 rounded-md text-sm font-semibold text-rose-50 placeholder:text-rose-200/55 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-rose-400/60 focus:border-rose-300/60 transition-all";
const labelCls = "block text-xs font-bold text-rose-200 uppercase tracking-wide mb-1.5";

export default function Registro() {
  const [data, setData] = useState<FormData>(initialData);
  const [activeSection, setActiveSection] = useState<SectionId>("identidad");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Cargar de localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);

  const update = (k: keyof FormData, v: string) => setData(d => ({ ...d, [k]: v }));

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert("No se pudo guardar. Intente de nuevo.");
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("La foto es muy grande (máx 2 MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("fotoProductor", String(reader.result));
    reader.readAsDataURL(file);
  };

  // Calcular completitud
  const totalFields = Object.keys(initialData).length;
  const filledFields = Object.values(data).filter(v => v && v.trim()).length;
  const completitud = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-black/45 backdrop-blur-md border border-rose-300/30 p-6 md:p-7">
        <p className="text-xs font-bold text-rose-300 uppercase tracking-[0.25em] mb-2">Ficha de Registro</p>
        <h2 className="text-2xl md:text-3xl font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.02em' }}>
          Nuestra Gran Familia
        </h2>
        <p className="text-sm font-semibold text-rose-100/85 mt-2">
          Complete los datos del productor. Puede guardar y continuar en cualquier momento.
        </p>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-rose-200 uppercase tracking-wide">Completitud</span>
            <span className="text-xs font-bold text-rose-100">{completitud}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${completitud}%`,
                background: 'linear-gradient(90deg, #C9A84C 0%, #F0D38A 50%, #C9A84C 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs de sección */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {SECTIONS.map(s => {
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`relative overflow-hidden rounded-lg px-3 py-3 text-left transition-all duration-200 cursor-pointer ${active ? "shadow-lg scale-[1.02]" : "hover:scale-[1.01]"}`}
              style={{
                background: active
                  ? 'linear-gradient(135deg, #3F0D17 0%, #7A1D2E 50%, #3F0D17 100%)'
                  : 'rgba(20,12,8,0.55)',
                border: active ? '1px solid rgba(201,168,76,0.55)' : '1px solid rgba(244,114,182,0.18)',
                boxShadow: active ? '0 0 18px rgba(122,29,46,0.55), 0 0 10px rgba(255,255,255,0.18)' : 'none',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold flex-shrink-0"
                  style={{
                    background: active ? 'rgba(201,168,76,0.95)' : 'rgba(122,29,46,0.7)',
                    color: active ? '#3F0D17' : '#fff8f0',
                  }}
                >
                  {s.num}
                </span>
                <span className={`text-xs md:text-[13px] font-bold leading-tight ${active ? "text-rose-50" : "text-rose-200"}`}>
                  {s.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Card del formulario */}
      <div className="rounded-xl bg-black/55 backdrop-blur-md border border-rose-300/30 p-5 md:p-7 space-y-5">
        {activeSection === "identidad" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>
              Datos de Identidad y Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Nombre completo</label>
                <input type="text" className={inputCls} placeholder="Ej: Juan Carlos Pérez Mamani" value={data.nombre} onChange={e => update("nombre", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Número de DNI</label>
                <input type="text" className={inputCls} placeholder="Ej: 47123456" value={data.dni} onChange={e => update("dni", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Teléfono / WhatsApp</label>
                <input type="text" className={inputCls} placeholder="Ej: 987654321" value={data.telefono} onChange={e => update("telefono", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Teléfono de familiar o vecino de confianza</label>
                <input type="text" className={inputCls} placeholder="Ej: 912345678" value={data.telefonoFamiliar} onChange={e => update("telefonoFamiliar", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Sector / Comunidad en Echarati</label>
                <input type="text" className={inputCls} placeholder="Ej: Pacaypata, Saniriato..." value={data.sector} onChange={e => update("sector", e.target.value)} />
              </div>
            </div>
          </>
        )}

        {activeSection === "familia" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>
              El Corazón de la Familia
            </h3>
            <div>
              <label className={labelCls}>Con quién vive (carga familiar: esposo/a, hijos)</label>
              <textarea rows={4} className={inputCls} placeholder="Ej: Esposa María Quispe (38 años), 3 hijos: Carlos (12), Lucía (9), Mateo (5)..." value={data.cargaFamiliar} onChange={e => update("cargaFamiliar", e.target.value)} />
            </div>
          </>
        )}

        {activeSection === "tierra" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>
              La Tierra y su Producción
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Nombre de la parcela o chacra</label>
                <input type="text" className={inputCls} placeholder='Ej: "El Mirador"' value={data.nombreParcela} onChange={e => update("nombreParcela", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>¿Tiene título o constancia de propiedad?</label>
                <select className={inputCls} value={data.tieneTitulo} onChange={e => update("tieneTitulo", e.target.value)}>
                  <option value="">Seleccione...</option>
                  <option value="titulo">Sí, tiene título</option>
                  <option value="constancia">Sí, tiene constancia</option>
                  <option value="no">No tiene aún</option>
                  <option value="tramite">En trámite</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Tamaño total (hectáreas o topos)</label>
                <input type="text" className={inputCls} placeholder="Ej: 5 hectáreas" value={data.tamanoTotal} onChange={e => update("tamanoTotal", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Hectáreas dedicadas al cacao Chuncho</label>
                <input type="text" className={inputCls} placeholder="Ej: 2.5 ha" value={data.hectareasCacao} onChange={e => update("hectareasCacao", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Producción anual (quintales o kilos)</label>
                <input type="text" className={inputCls} placeholder="Ej: 8 quintales / 400 kg" value={data.produccionAnual} onChange={e => update("produccionAnual", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Otros cultivos en la chacra</label>
                <input type="text" className={inputCls} placeholder="Ej: Yuca, plátano, naranja..." value={data.otrosCultivos} onChange={e => update("otrosCultivos", e.target.value)} />
              </div>
            </div>
          </>
        )}

        {activeSection === "cultivo" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cuidados del Cultivo
            </h3>
            <p className="text-xs font-semibold text-rose-200/80 -mt-2 mb-2">(Normas de Europa)</p>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>¿Cómo procesa y seca su cacao en la chacra?</label>
                <textarea rows={4} className={inputCls} placeholder="Describa el proceso: fermentación, días de secado, dónde lo seca..." value={data.procesoSecado} onChange={e => update("procesoSecado", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Abonos o productos químicos que utiliza</label>
                <textarea rows={4} className={inputCls} placeholder="Liste todo lo que usa para abonar o controlar plagas..." value={data.abonos} onChange={e => update("abonos", e.target.value)} />
              </div>
            </div>
          </>
        )}

        {activeSection === "historia" && (
          <>
            <h3 className="text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>
              Historia de Vida y Sueños
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Años trabajando como agricultor en la zona</label>
                <input type="text" className={inputCls} placeholder="Ej: 25 años" value={data.aniosTrabajando} onChange={e => update("aniosTrabajando", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>El sueño más grande para su familia</label>
                <textarea rows={4} className={inputCls} placeholder="Comparta el sueño más grande que quiere cumplir..." value={data.sueno} onChange={e => update("sueno", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Foto del productor con su chacra</label>
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-4 py-3 rounded-md text-sm font-bold transition-all cursor-pointer flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #3F0D17 0%, #7A1D2E 50%, #3F0D17 100%)',
                      color: '#fff8f0',
                      border: '1px solid rgba(201,168,76,0.55)',
                    }}
                  >
                    <i className="ri-camera-line" />
                    {data.fotoProductor ? "Cambiar foto" : "Subir foto"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  {data.fotoProductor && (
                    <div className="w-24 h-24 rounded-md overflow-hidden border border-rose-300/40">
                      <img src={data.fotoProductor} alt="Productor" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-medium text-rose-200/60 mt-2">JPG o PNG. Máximo 2 MB.</p>
              </div>
            </div>
          </>
        )}

        {/* Navegación entre secciones */}
        <div className="flex items-center justify-between pt-4 border-t border-rose-300/20">
          <button
            onClick={() => {
              const idx = SECTIONS.findIndex(s => s.id === activeSection);
              if (idx > 0) setActiveSection(SECTIONS[idx - 1].id);
            }}
            disabled={activeSection === SECTIONS[0].id}
            className="px-4 py-2 rounded-md text-sm font-bold text-rose-100 bg-black/40 border border-rose-300/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-black/55"
          >
            <i className="ri-arrow-left-line mr-1" /> Anterior
          </button>
          <button
            onClick={() => {
              const idx = SECTIONS.findIndex(s => s.id === activeSection);
              if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1].id);
            }}
            disabled={activeSection === SECTIONS[SECTIONS.length - 1].id}
            className="px-4 py-2 rounded-md text-sm font-bold text-rose-100 bg-black/40 border border-rose-300/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-black/55"
          >
            Siguiente <i className="ri-arrow-right-line ml-1" />
          </button>
        </div>
      </div>

      {/* Botón guardar global */}
      <div className="sticky bottom-4 z-10">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl text-base font-bold cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.99]"
          style={{
            background: saved
              ? 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #14532d 100%)'
              : 'linear-gradient(135deg, #3F0D17 0%, #7A1D2E 50%, #3F0D17 100%)',
            color: '#fff8f0',
            border: '1px solid rgba(201,168,76,0.6)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.5), 0 0 18px rgba(122,29,46,0.45)',
          }}
        >
          <i className={saved ? "ri-check-line mr-2" : "ri-save-line mr-2"} />
          {saved ? "¡Guardado correctamente!" : "Guardar registro"}
        </button>
      </div>
    </div>
  );
}

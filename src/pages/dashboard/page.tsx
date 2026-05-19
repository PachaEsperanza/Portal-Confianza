import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface FormData {
  nombre: string; dni: string; telefono: string; telefonoFamiliar: string; sector: string;
  cargaFamiliar: string;
  nombreParcela: string; tieneTitulo: string; tamanoTotal: string; hectareasCacao: string;
  produccionAnual: string; otrosCultivos: string;
  procesoSecado: string; abonos: string;
  aniosTrabajando: string; sueno: string; fotoProductor: string;
}

const initial: FormData = {
  nombre: "", dni: "", telefono: "", telefonoFamiliar: "", sector: "",
  cargaFamiliar: "",
  nombreParcela: "", tieneTitulo: "", tamanoTotal: "", hectareasCacao: "",
  produccionAnual: "", otrosCultivos: "",
  procesoSecado: "", abonos: "",
  aniosTrabajando: "", sueno: "", fotoProductor: "",
};

const STORAGE_KEY = "confianza_registro_data";

const tituloMap: Record<string, string> = {
  titulo: "Sí, tiene título",
  constancia: "Sí, tiene constancia",
  no: "No tiene aún",
  tramite: "En trámite",
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 p-3 rounded-lg bg-black/35 border border-rose-300/20">
    <span className="text-[10px] font-bold uppercase tracking-wide text-rose-300">{label}</span>
    <span className="text-sm font-semibold text-rose-50 break-words">
      {value && value.trim() ? value : <span className="text-rose-200/40 italic">— sin datos —</span>}
    </span>
  </div>
);

const SectionCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div className="rounded-xl bg-black/50 backdrop-blur-md border border-rose-300/30 p-5 md:p-6">
    <div className="flex items-center gap-3 mb-4">
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ background: 'linear-gradient(135deg, #3F0D17 0%, #7A1D2E 50%, #3F0D17 100%)', border: '1px solid rgba(201,168,76,0.5)' }}>
        <i className={`${icon} text-base`} style={{ color: '#C9A84C' }} />
      </span>
      <h3 className="text-base md:text-lg font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default function Resumen() {
  const [data, setData] = useState<FormData>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const totalFields = Object.keys(initial).length;
  const filledFields = Object.values(data).filter(v => v && v.trim()).length;
  const completitud = Math.round((filledFields / totalFields) * 100);
  const noTieneDatos = filledFields === 0;

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-black/45 backdrop-blur-md border border-rose-300/30 p-6 md:p-7">
        <p className="text-xs font-bold text-rose-300 uppercase tracking-[0.25em] mb-2">Resumen</p>
        <h2 className="text-2xl md:text-3xl font-bold text-rose-50" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.02em' }}>
          {data.nombre || "Información del Registro"}
        </h2>
        <p className="text-sm font-semibold text-rose-100/85 mt-2">
          Consolidado de la ficha de registro de la gran familia.
        </p>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-rose-200 uppercase tracking-wide">Completitud</span>
            <span className="text-xs font-bold text-rose-100">{completitud}% — {filledFields}/{totalFields} campos</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${completitud}%`, background: 'linear-gradient(90deg, #C9A84C 0%, #F0D38A 50%, #C9A84C 100%)' }} />
          </div>
        </div>
      </div>

      {noTieneDatos ? (
        <div className="rounded-xl bg-black/45 backdrop-blur-md border border-rose-300/30 p-8 md:p-10 text-center">
          <i className="ri-file-list-3-line text-5xl text-rose-300/60" />
          <p className="text-base font-bold text-rose-50 mt-4">Aún no hay datos registrados</p>
          <p className="text-sm font-semibold text-rose-200/80 mt-2 mb-5">
            Complete la ficha en la sección <strong className="text-rose-100">Registro</strong> y vuelva aquí para ver el resumen.
          </p>
          <Link
            to="/dashboard/registro"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-bold cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #3F0D17 0%, #7A1D2E 50%, #3F0D17 100%)',
              color: '#fff8f0',
              border: '1px solid rgba(201,168,76,0.55)',
            }}
          >
            <i className="ri-edit-line" /> Ir a Registro
          </Link>
        </div>
      ) : (
        <>
          {/* Foto + datos principales */}
          {data.fotoProductor && (
            <div className="rounded-xl bg-black/50 backdrop-blur-md border border-rose-300/30 p-5 md:p-6 flex flex-col md:flex-row items-center gap-5">
              <img src={data.fotoProductor} alt={data.nombre} className="w-28 h-28 rounded-full object-cover" style={{ border: '3px solid rgba(201,168,76,0.65)', boxShadow: '0 0 18px rgba(201,168,76,0.35)' }} />
              <div className="text-center md:text-left flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-rose-300">Pilar de Nuestra Familia</p>
                <p className="text-xl md:text-2xl font-bold text-rose-50 mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {data.nombre || "—"}
                </p>
                <p className="text-sm font-semibold text-rose-200 mt-1">
                  {data.sector && <span><i className="ri-map-pin-line mr-1" />{data.sector}</span>}
                </p>
              </div>
            </div>
          )}

          {/* 1. Identidad */}
          <SectionCard title="Identidad y Contacto" icon="ri-user-line">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nombre completo" value={data.nombre} />
              <Field label="DNI" value={data.dni} />
              <Field label="Teléfono / WhatsApp" value={data.telefono} />
              <Field label="Familiar / Vecino" value={data.telefonoFamiliar} />
              <Field label="Sector / Comunidad" value={data.sector} />
            </div>
          </SectionCard>

          {/* 2. Familia */}
          <SectionCard title="El Corazón de la Familia" icon="ri-heart-line">
            <Field label="Carga familiar" value={data.cargaFamiliar} />
          </SectionCard>

          {/* 3. Tierra */}
          <SectionCard title="La Tierra y su Producción" icon="ri-plant-line">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nombre de la parcela" value={data.nombreParcela} />
              <Field label="Título / Constancia" value={tituloMap[data.tieneTitulo] || data.tieneTitulo} />
              <Field label="Tamaño total" value={data.tamanoTotal} />
              <Field label="Hectáreas de cacao Chuncho" value={data.hectareasCacao} />
              <Field label="Producción anual" value={data.produccionAnual} />
              <Field label="Otros cultivos" value={data.otrosCultivos} />
            </div>
          </SectionCard>

          {/* 4. Cultivo */}
          <SectionCard title="Cuidados del Cultivo" icon="ri-leaf-line">
            <div className="grid grid-cols-1 gap-3">
              <Field label="Proceso y secado" value={data.procesoSecado} />
              <Field label="Abonos y productos químicos" value={data.abonos} />
            </div>
          </SectionCard>

          {/* 5. Historia */}
          <SectionCard title="Historia de Vida y Sueños" icon="ri-sparkling-2-line">
            <div className="grid grid-cols-1 gap-3">
              <Field label="Años trabajando" value={data.aniosTrabajando} />
              <Field label="Su sueño más grande" value={data.sueno} />
            </div>
          </SectionCard>

          {/* Botón editar */}
          <Link
            to="/dashboard/registro"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-bold cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #3F0D17 0%, #7A1D2E 50%, #3F0D17 100%)',
              color: '#fff8f0',
              border: '1px solid rgba(201,168,76,0.55)',
            }}
          >
            <i className="ri-edit-line" /> Editar registro
          </Link>
        </>
      )}
    </div>
  );
}

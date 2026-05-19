import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { type Lot } from "@/mocks/suppliers";

const LOTS_STORAGE_KEY = "supplier_lots";

function getStoredLots(): Lot[] {
  const stored = localStorage.getItem(LOTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveLot(lot: Lot) {
  const all = getStoredLots();
  all.push(lot);
  localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(all));
}

const processOptions = [
  "Lavado / Washed",
  "Natural",
  "Honey",
  "Otro",
];

const packagingOptions = [
  "Sacos de yute",
  "Sacos de polipropileno",
  "Cajas de madera",
  "Bolsas de tela",
  "Granel",
  "Otro",
];

export default function NewLot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    product_type: "Cacao Chuncho",
    region: "Echarati, La Convención",
    gross_weight: "",
    process: "",
    process_other: "",
    packaging: "",
    packaging_other: "",
    harvest_date: "",
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handlePhotoUpload = () => {
    if (photos.length >= 10) {
      setError("Máximo 10 fotos permitidas.");
      return;
    }
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = 10 - photos.length;
    const toAdd = Math.min(files.length, remaining);

    if (toAdd <= 0) {
      setError("Máximo 10 fotos permitidas.");
      return;
    }

    const newPhotos: string[] = [];
    let processed = 0;

    for (let i = 0; i < toAdd; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        newPhotos.push(reader.result as string);
        processed++;
        if (processed === toAdd) {
          setPhotos((prev) => [...prev, ...newPhotos]);
          setError("");
        }
      };
      reader.readAsDataURL(files[i]);
    }

    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.product_type.trim()) {
      setError("Ingrese el tipo de producto.");
      return;
    }
    if (!form.region.trim()) {
      setError("Ingrese la región.");
      return;
    }
    if (!form.gross_weight || Number(form.gross_weight) <= 0) {
      setError("Ingrese un peso bruto válido en KG.");
      return;
    }
    if (!form.harvest_date) {
      setError("Seleccione la fecha de cosecha.");
      return;
    }

    setIsSubmitting(true);

    const processValue = "Artesanal";
    const packagingValue = "Sacos de yute";

    const newLot: Lot = {
      id: `LOT-${Date.now()}`,
      supplier_id: user?.supplier_id || "",
      product_type: form.product_type,
      region: form.region,
      gross_weight: Number(form.gross_weight),
      process: processValue,
      packaging: packagingValue,
      harvest_date: form.harvest_date,
      photos: photos,
      status: "registrado",
      created_at: new Date().toISOString().split("T")[0],
    };

    saveLot(newLot);

    setSuccess("Lote registrado exitosamente.");
    setIsSubmitting(false);

    // Reset form
    setForm({
      product_type: "Cacao Chuncho",
      region: "Echarati, La Convención",
      gross_weight: "",
      process: "",
      process_other: "",
      packaging: "",
      packaging_other: "",
      harvest_date: "",
    });
    setPhotos([]);

    setTimeout(() => {
      navigate("/dashboard/my-lots");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Nuevo Lote</h2>
        <p className="text-sm text-rose-200/70 mt-1">
          Registre un nuevo lote de Cacao Chuncho para envío
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 p-5 md:p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
            <i className="ri-error-warning-line text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-start gap-2">
            <i className="ri-check-line text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Product Type — fijo */}
          <div>
            <label className="block text-sm font-medium text-rose-200 mb-1.5">Tipo de Producto</label>
            <div className="w-full px-4 py-3 rounded-md border border-rose-300/40 bg-black/35 text-sm text-white font-medium flex items-center gap-2 select-none">
              <i className="ri-leaf-line text-rose-300" />
              Cacao Chuncho
            </div>
          </div>

          {/* Region — fijo */}
          <div>
            <label className="block text-sm font-medium text-rose-200 mb-1.5">Región</label>
            <div className="w-full px-4 py-3 rounded-md border border-rose-300/40 bg-black/35 text-sm text-white font-medium flex items-center gap-2 select-none">
              <i className="ri-map-pin-line text-rose-300" />
              Echarati, La Convención
            </div>
          </div>

          {/* Gross Weight */}
          <div>
            <label className="block text-sm font-medium text-rose-200 mb-1.5">Peso Bruto (KG)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.gross_weight}
              onChange={(e) => handleChange("gross_weight", e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 rounded-md border border-rose-300/40 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-sm font-medium text-rose-200 mb-1.5">Fecha de Cosecha</label>
            <input
              type="date"
              value={form.harvest_date}
              onChange={(e) => handleChange("harvest_date", e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-rose-300/40 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>



          {/* Packaging */}
          <div>
            <label className="block text-sm font-medium text-rose-200 mb-1.5">Empaque</label>
            <div className="w-full px-4 py-3 rounded-md border border-rose-300/40 text-sm text-white bg-rose-900/20/40">
              Sacos de yute
            </div>
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-rose-100/80 mb-2">
            Fotos del Lote <span className="text-rose-200/50 font-normal">(máx. 10)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFileChange}
            className="hidden font-bold"
          />

          <div className="flex flex-wrap gap-3">
            {photos.map((photo, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden border border-rose-300/40 group">
                <img src={photo} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            ))}
            {photos.length < 10 && (
              <button
                type="button"
                onClick={handlePhotoUpload}
                className="w-24 h-24 rounded-md border-2 border-dashed border-rose-300/50/70 flex flex-col items-center justify-center text-rose-200/50 hover:border-rose-600 hover:text-rose-100 transition-all cursor-pointer"
              >
                <i className="ri-camera-line text-xl" />
                <span className="text-xs mt-1">Agregar</span>
              </button>
            )}
          </div>
          <p className="text-xs text-rose-200/50 mt-1">{photos.length} / 10 fotos</p>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-800 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-rose-900 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {isSubmitting ? "Registrando..." : "Registrar Lote"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-lots")}
            className="px-6 py-2.5 rounded-md text-sm font-medium text-rose-100/80 border border-rose-300/50/70 hover:bg-black/55 transition-colors cursor-pointer whitespace-nowrap"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
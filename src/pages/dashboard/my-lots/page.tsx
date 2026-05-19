import { useAuth } from "@/hooks/useAuth";
import { lots as mockLots, type Lot } from "@/mocks/suppliers";
import { useState, useEffect } from "react";

const LOTS_STORAGE_KEY = "supplier_lots";

function getStoredLots(): Lot[] {
  const stored = localStorage.getItem(LOTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function getAllLots(): Lot[] {
  return [...mockLots, ...getStoredLots()];
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    recibido: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Recibido" },
    "en_evaluación": { bg: "bg-white", text: "text-rose-200", label: "En Evaluación" },
    registrado: { bg: "bg-rose-50/50", text: "text-rose-50", label: "Registrado" },
    rechazado: { bg: "bg-red-50", text: "text-red-700", label: "Rechazado" },
  };
  const s = map[status] || { bg: "bg-black/55", text: "text-rose-100", label: status };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default function MyLots() {
  const { user } = useAuth();
  const [allLots, setAllLots] = useState<Lot[]>([]);

  useEffect(() => {
    setAllLots(getAllLots());
  }, []);

  const myLots = allLots.filter((l) => l.supplier_id === user?.supplier_id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-50">Mis Lotes</h2>
        <p className="text-sm text-rose-200/70 mt-1">
          Lotes registrados bajo su código de proveedor
        </p>
      </div>

      <div className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/450 border-b border-rose-300/40">
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Tipo</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Región</th>
                <th className="text-right py-3 px-4 text-rose-100/80 font-semibold">Peso (KG)</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Proceso</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Fecha Cosecha</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Estado</th>
                <th className="text-center py-3 px-4 text-rose-100/80 font-semibold">Fotos</th>
              </tr>
            </thead>
            <tbody>
              {myLots.map((lot) => (
                <tr key={lot.id} className="border-b border-rose-50/60 hover:bg-black/55 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-rose-200/70">{lot.id}</td>
                  <td className="py-3 px-4 font-medium text-rose-50">{lot.product_type}</td>
                  <td className="py-3 px-4 text-rose-100/80">{lot.region}</td>
                  <td className="py-3 px-4 text-right font-medium text-rose-50">
                    {lot.gross_weight.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-rose-100/80">{lot.process}</td>
                  <td className="py-3 px-4 text-rose-100/80">{lot.harvest_date}</td>
                  <td className="py-3 px-4">{statusBadge(lot.status)}</td>
                  <td className="py-3 px-4 text-center text-rose-200/70">
                    {lot.photos.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs">
                        <i className="ri-image-line" />
                        {lot.photos.length}
                      </span>
                    ) : (
                      <span className="text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myLots.length === 0 && (
          <div className="text-center py-10 text-rose-200/40 text-sm">
            No tiene lotes registrados. Use "Nuevo Lote" para agregar uno.
          </div>
        )}
      </div>
    </div>
  );
}
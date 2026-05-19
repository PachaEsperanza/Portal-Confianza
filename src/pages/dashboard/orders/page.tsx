import { useAuth } from "@/hooks/useAuth";
import { orders } from "@/mocks/suppliers";

export default function Orders() {
  const { user } = useAuth();
  const myOrders = orders.filter((o) => o.supplier_id === user?.supplier_id);

  function statusBadge(status: string) {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      completada: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Completada" },
      en_proceso: { bg: "bg-white", text: "text-rose-200", label: "En Proceso" },
      pendiente: { bg: "bg-red-50", text: "text-red-700", label: "Pendiente" },
    };
    const s = map[status] || { bg: "bg-black/55", text: "text-rose-100", label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-50">Órdenes y Solicitudes</h2>
        <p className="text-sm text-rose-200/70 mt-1">
          Historial de órdenes asociadas a su proveedor
        </p>
      </div>

      <div className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/450 border-b border-rose-300/40">
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">ID Orden</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Fecha</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Estado</th>
                <th className="text-right py-3 px-4 text-rose-100/80 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order) => (
                <tr key={order.id} className="border-b border-rose-50/60 hover:bg-black/55 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-rose-200/70">{order.id}</td>
                  <td className="py-3 px-4 text-rose-100/80">{order.date}</td>
                  <td className="py-3 px-4">{statusBadge(order.status)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-rose-50">
                    ${order.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myOrders.length === 0 && (
          <div className="text-center py-10 text-rose-200/40 text-sm">
            No tiene órdenes registradas
          </div>
        )}
      </div>
    </div>
  );
}
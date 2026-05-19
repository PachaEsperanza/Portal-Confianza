import { useNavigate } from "react-router-dom";
import { type Order } from "@/mocks/suppliers";

interface RecentOrdersTableProps {
  orders: Order[];
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    completada: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Completada" },
    en_proceso: { bg: "bg-white", text: "text-rose-700", label: "En Proceso" },
    pendiente: { bg: "bg-red-50", text: "text-red-700", label: "Pendiente" },
  };
  const s = map[status] || { bg: "bg-white/40", text: "text-rose-900", label: status };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-rose-700/40 text-sm">
        No tiene órdenes registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-rose-50/60">
            <th className="text-left py-2.5 px-3 text-rose-800/60 font-medium">Orden</th>
            <th className="text-left py-2.5 px-3 text-rose-800/60 font-medium">Fecha</th>
            <th className="text-left py-2.5 px-3 text-rose-800/60 font-medium">Estado</th>
            <th className="text-right py-2.5 px-3 text-rose-800/60 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              onClick={() => navigate("/dashboard/orders")}
              className={`border-b border-white/40 hover:bg-white/60 transition-all duration-200 ease-out cursor-pointer hover:shadow-sm animate-row-stagger ${index > 0 && index <= 8 ? `stagger-${index}` : ""}`}
            >
              <td className="py-2.5 px-3 font-medium text-rose-950">{order.id}</td>
              <td className="py-2.5 px-3 text-rose-900/70">{order.date}</td>
              <td className="py-2.5 px-3">{statusBadge(order.status)}</td>
              <td className="py-2.5 px-3 text-right font-medium text-rose-950">
                ${order.total.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
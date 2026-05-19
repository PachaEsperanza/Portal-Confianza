import { useAuth } from "@/hooks/useAuth";
import { payments } from "@/mocks/suppliers";

export default function Payments() {
  const { user } = useAuth();
  const myPayments = payments.filter((p) => p.supplier_id === user?.supplier_id);

  const totalPending = myPayments
    .filter((p) => p.status === "pendiente")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = myPayments
    .filter((p) => p.status === "pagado")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalSent = myPayments
    .filter((p) => p.status === "enviado")
    .reduce((sum, p) => sum + p.amount, 0);

  function statusBadge(status: string) {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      enviado: { bg: "bg-white", text: "text-rose-200", label: "Enviado" },
      pagado: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Pagado" },
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
        <h2 className="text-xl font-semibold text-rose-50">Estado de Pagos</h2>
        <p className="text-sm text-rose-200/70 mt-1">
          Detalle de pagos asociados a sus lotes
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 p-5">
          <p className="text-sm text-rose-100/80">Total Pagado</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 p-5">
          <p className="text-sm text-rose-100/80">Enviados</p>
          <p className="text-2xl font-bold text-rose-200 mt-1">${totalSent.toLocaleString()}</p>
        </div>
        <div className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 p-5">
          <p className="text-sm text-rose-100/80">Pendientes</p>
          <p className="text-2xl font-bold text-red-700 mt-1">${totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/450 border-b border-rose-300/40">
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Lote</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Porcentaje</th>
                <th className="text-right py-3 px-4 text-rose-100/80 font-semibold">Monto</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Banco</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Fecha</th>
                <th className="text-left py-3 px-4 text-rose-100/80 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {myPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-rose-50/60 hover:bg-black/55 transition-colors">
                  <td className="py-3 px-4 font-medium text-rose-50">{payment.lot_name}</td>
                  <td className="py-3 px-4 text-rose-100/80">{payment.percentage}%</td>
                  <td className="py-3 px-4 text-right font-semibold text-rose-50">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-rose-100/80">{payment.bank}</td>
                  <td className="py-3 px-4 text-rose-100/80">{payment.date}</td>
                  <td className="py-3 px-4">{statusBadge(payment.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myPayments.length === 0 && (
          <div className="text-center py-10 text-rose-200/40 text-sm">
            No tiene pagos registrados
          </div>
        )}
      </div>
    </div>
  );
}
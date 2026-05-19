import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STORAGE_KEY = "supplier_auth_users_v2";

  function getStoredUsers() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    const users = getStoredUsers();
    const found = users.find((u: { supplier_id: string; password: string }) => u.supplier_id === user?.supplier_id);

    if (!found || found.password !== currentPassword) {
      setError("La contraseña actual es incorrecta.");
      setIsSubmitting(false);
      return;
    }

    const updated = users.map((u: { supplier_id: string }) =>
      u.supplier_id === user?.supplier_id ? { ...u, password: newPassword } : u,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setSuccess("Contraseña actualizada exitosamente.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-50">Configuración de Perfil</h2>
        <p className="text-sm text-rose-200/70 mt-1">
          Administre su información de acceso
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Info Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 p-5 space-y-5">
          <h3 className="text-base font-semibold text-rose-50">Información Personal</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-rose-700 uppercase tracking-wide mb-1.5">
                Código de Acceso
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-black/450 rounded-md border border-rose-300/40">
                <i className="ri-shield-keyhole-line text-rose-700/70" />
                <span className="text-sm font-mono font-bold text-rose-950">{user?.supplier_id}</span>
                <span className="ml-auto text-xs text-rose-200/70 bg-rose-900/20/50 px-2 py-0.5 rounded-full">
                  Solo lectura
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-700 uppercase tracking-wide mb-1.5">
                Nombre
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-black/450 rounded-md border border-rose-300/40">
                <i className="ri-user-line text-rose-700/70" />
                <span className="text-sm font-bold text-rose-950">{user?.name}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-700 uppercase tracking-wide mb-1.5">
                Categoría
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-black/450 rounded-md border border-rose-300/40">
                <i className="ri-folder-line text-rose-700/70" />
                <span className="text-sm font-bold text-rose-950 capitalize">{user?.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg border border-rose-300/40 p-5 space-y-5">
          <h3 className="text-base font-semibold text-rose-50">Cambiar Contraseña</h3>

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

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-rose-100/80 mb-1.5">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingrese su contraseña actual"
                className="w-full px-4 py-3 rounded-md border border-rose-300/40 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-100/80 mb-1.5">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-md border border-rose-300/40 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-rose-100/80 mb-1.5">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repita la nueva contraseña"
                className="w-full px-4 py-3 rounded-md border border-rose-300/40 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-800 text-white py-3 rounded-md text-sm font-medium hover:bg-rose-900 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
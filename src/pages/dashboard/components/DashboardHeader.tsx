import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="hidden lg:flex items-center justify-between bg-black/45 backdrop-blur-md border-b border-rose-300/30 px-6 py-3 animate-card-stagger stagger-1">
      {/* Left: Welcome + Date */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-rose-100 leading-tight">
            Bienvenido,{" "}
            <span className="text-rose-100 font-extrabold">{user?.name}</span>
          </h1>
          <p className="text-[11px] text-rose-100 font-bold mt-0.5 capitalize">{today}</p>
        </div>
        <span className="h-8 w-px bg-rose-200/40" />
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs text-emerald-300 font-bold">En línea</span>
        </div>
      </div>

      {/* Right: Supplier info + Avatar + Logout */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden xl:block">
          <p className="text-xs text-rose-100 font-bold">
            Código: <span className="font-mono font-bold text-rose-100">{user?.supplier_id}</span>
          </p>
          <p className="text-xs text-rose-100 font-bold capitalize">
            Categoría: <span className="font-bold text-rose-100">{user?.category}</span>
          </p>
        </div>

        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-sm font-bold text-rose-900 shadow-sm border border-rose-200/50">
          {user?.name?.charAt(0) || "P"}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-extrabold text-rose-100 hover:text-rose-50 hover:bg-rose-900/50 rounded-md transition-all duration-200 cursor-pointer whitespace-nowrap hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-logout-box-r-line" />
          </span>
          Salir
        </button>
      </div>
    </header>
  );
}

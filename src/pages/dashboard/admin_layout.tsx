import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

declare const __BASE_PATH__: string;
const basePath = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '/';

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      navigate("/auth", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user?.isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 z-0"
        style={{ backgroundImage: `url('${basePath}images/hero2.jpeg')`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/30" />
      </div>
      {/* Header admin */}
      <div className="relative z-20 flex items-center justify-between px-5 py-3 bg-amber-900/90 backdrop-blur-sm border-b border-amber-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
            <i className="ri-shield-user-line text-white text-sm" />
          </div>
          <div>
            <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Panel Administrador</p>
            <p className="text-xs text-amber-100 font-medium" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: '0.1em' }}>PΛCHΛ ESPERANZA</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate("/auth"); }}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-white transition-colors cursor-pointer">
          <i className="ri-logout-box-line" /> Cerrar sesión
        </button>
      </div>
      {/* Content */}
      <div className="relative z-10 flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
        <Outlet />
      </div>
    </div>
  );
}

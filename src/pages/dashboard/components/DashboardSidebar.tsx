import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

declare const __BASE_PATH__: string;

const menuItems = [
  { path: "/dashboard/registro", label: "Registro", icon: "ri-edit-line" },
  { path: "/dashboard/profile", label: "Perfil", icon: "ri-user-settings-line" },
];

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[70] bg-black/55 backdrop-blur-md border-b border-rose-300/40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={`${typeof __BASE_PATH__ !== "undefined" ? __BASE_PATH__ : "/"}images/hoja.png`}
            alt="Logo"
            className="h-7 w-auto"
          />
          <div className="flex flex-col">
            <span
              className="leading-none uppercase"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 100,
                color: '#FF1E1E',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
              }}
            >
              PΛCHΛ ESPERANZA
            </span>
            <span
              className="leading-none mt-0.5 uppercase"
              style={{
                color: '#C9A84C',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: '0.55rem',
                letterSpacing: '0.16em',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
              }}
            >
              Familia
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <i className={`ri-${mobileOpen ? "close" : "menu"}-line text-xl text-white`} />
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-black/55 backdrop-blur-md border-r border-rose-300/30 min-h-screen">
        {/* Logo area */}
        <div className="px-6 py-5 border-b border-rose-300/30">
          <div className="flex items-center gap-3">
            <img
              src={`${typeof __BASE_PATH__ !== "undefined" ? __BASE_PATH__ : "/"}images/hoja.png`}
              alt="Logo"
              className="h-8 w-auto"
            />
            <div className="flex flex-col">
              <span
                className="leading-none uppercase"
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 100,
                  color: '#FF1E1E',
                  fontSize: '0.95rem',
                  letterSpacing: '0.15em',
                }}
              >
                PΛCHΛ ESPERANZA
              </span>
              <span
                className="leading-none mt-1"
                style={{
                  color: '#FECDD3',
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  letterSpacing: '0.04em',
                  textShadow: '0 0 8px rgba(254,205,211,0.35), 0 1px 4px rgba(0,0,0,0.55)',
                }}
              >
                Familia
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-out cursor-pointer group relative overflow-hidden ${
                isActive(item.path)
                  ? "bg-rose-800 text-white shadow-sm"
                  : "text-rose-50 font-semibold hover:bg-rose-900/50 hover:text-white hover:translate-x-1.5 active:scale-[0.98]"
              }`}
            >
              {!isActive(item.path) && (
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-rose-50/40 to-transparent pointer-events-none" />
              )}
              <span className="w-5 h-5 flex items-center justify-center relative z-10 transition-transform duration-200 group-hover:scale-110">
                <i className={item.icon} />
              </span>
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-rose-300/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-sm font-semibold text-rose-800">
              {user?.name?.charAt(0) || "P"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-rose-50 truncate">{user?.name}</p>
              <p className="text-xs font-medium text-rose-200/80 truncate">{user?.supplier_id}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[80] bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-black/65 backdrop-blur-lg shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile sidebar header */}
            <div className="px-4 py-4 border-b border-rose-300/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={`${typeof __BASE_PATH__ !== "undefined" ? __BASE_PATH__ : "/"}images/hoja.png`}
                  alt="Logo"
                  className="h-7 w-auto"
                />
                <div className="flex flex-col">
            <span
              className="leading-none uppercase"
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontWeight: 100,
                color: '#FF1E1E',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
              }}
            >
              PΛCHΛ ESPERANZA
            </span>
            <span
              className="leading-none mt-0.5 uppercase"
              style={{
                color: '#C9A84C',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: '0.55rem',
                letterSpacing: '0.16em',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
              }}
            >
              Familia
            </span>
          </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 cursor-pointer">
                <i className="ri-close-line text-lg text-rose-700" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-out cursor-pointer group relative overflow-hidden ${
                    isActive(item.path)
                      ? "bg-rose-800 text-white"
                      : "text-rose-50 font-semibold hover:bg-rose-900/50 hover:text-white hover:translate-x-1.5 active:scale-[0.98]"
                  }`}
                >
                  {!isActive(item.path) && (
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-rose-50/40 to-transparent pointer-events-none" />
                  )}
                  <span className="w-5 h-5 flex items-center justify-center relative z-10 transition-transform duration-200 group-hover:scale-110">
                    <i className={item.icon} />
                  </span>
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="px-4 py-4 border-t border-rose-300/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-sm font-semibold text-rose-800">
                  {user?.name?.charAt(0) || "P"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-rose-50">{user?.name}</p>
                  <p className="text-xs font-medium text-rose-200/80">{user?.supplier_id}</p>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate("/auth"); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-bold text-rose-200 hover:bg-rose-900/50 hover:text-white transition-all cursor-pointer"
              >
                <i className="ri-logout-box-line" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
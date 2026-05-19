import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";
import PageTransition from "@/components/feature/PageTransition";

declare const __BASE_PATH__: string;
const basePath = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '/';

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/10">
        <div className="flex items-center gap-3 text-rose-800/60">
          <i className="ri-loader-4-line animate-spin text-xl" />
          <span className="text-sm">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Background andino fijo */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('${basePath}images/hero2.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
                  }}
      >
        {/* Overlay suave para legibilidad */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Sidebar */}
      <div className="relative z-10">
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 pt-20 lg:pt-0 p-4 md:p-6 lg:p-8 overflow-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

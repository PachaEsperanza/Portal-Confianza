import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Auth from "../pages/auth/page";
import DashboardLayout from "../pages/dashboard/layout";
import Registro from "../pages/dashboard/registro/page";
import Profile from "../pages/dashboard/profile/page";
import AdminPanel from "../pages/dashboard/registro/admin_page";
import AdminLayout from "../pages/dashboard/admin_layout";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/auth", element: <Auth /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <Registro /> },
      { path: "registro", element: <Registro /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/dashboard/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminPanel /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;

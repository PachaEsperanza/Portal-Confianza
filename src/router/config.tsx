import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Auth from "../pages/auth/page";
import DashboardLayout from "../pages/dashboard/layout";
import Resumen from "../pages/dashboard/page";
import Registro from "../pages/dashboard/registro/page";
import Profile from "../pages/dashboard/profile/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <Registro /> },
      { path: "resumen", element: <Resumen /> },
      { path: "registro", element: <Registro /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

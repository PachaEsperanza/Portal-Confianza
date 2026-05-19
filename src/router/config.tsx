import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Auth from "../pages/auth/page";
import DashboardLayout from "../pages/dashboard/layout";
import Dashboard from "../pages/dashboard/page";
import Products from "../pages/dashboard/products/page";
import Orders from "../pages/dashboard/orders/page";
import NewLot from "../pages/dashboard/new-lot/page";
import MyLots from "../pages/dashboard/my-lots/page";
import Payments from "../pages/dashboard/payments/page";
import Contract from "../pages/dashboard/contract/page";
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
      { path: "", element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "orders", element: <Orders /> },
      { path: "new-lot", element: <NewLot /> },
      { path: "my-lots", element: <MyLots /> },
      { path: "payments", element: <Payments /> },
      { path: "contract", element: <Contract /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

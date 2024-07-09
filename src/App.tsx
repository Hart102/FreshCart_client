import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import { routes } from "@/routes/route";

import Register from "./pages/Register";
import Login from "@/pages/Login";

// Client
import MainLayout from "@/layout/client";
import Home from "@/pages/Client/Home";
import Categories_page from "@/pages/Client/Categories";
import SingleProduct from "@/pages/Client/Single-product";
import Cart from "@/pages/Client/Cart";
import Checkout from "@/pages/Client/Checkout";

// Reused
import SingleOrder from "@/pages/Admin/SingleOrder";

// USER
import UserDasboardLayout from "@/layout/user";
import Address from "@/pages/User/Address";
import UserOrder from "@/layout/orders";
import Order from "@/pages/User/Orders";
import PaymentMethod from "@/pages/User/Profile";
import AccountSetting from "@/pages/User/Account-setting";

// Admin
import DashboardLayout from "@/layout/dashboard";
import AddProduct from "@/pages/Admin/Create-product";
import ProductsPage from "@/pages/Admin/Products";
import Orders from "@/pages/Admin/Orders";
import Customers from "@/pages/Admin/Customers";
import Categories from "@/pages/Admin/Categories";
import ProductView from "@/pages/Admin/ProductView";
import CreateAndEditCategory from "@/pages/Admin/CreateAndEditCategory";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: routes.home, element: <Home /> },
      { path: routes.login, element: <Login /> },
      { path: routes.register, element: <Register /> },

      { path: routes.cart, element: <Cart /> },
      { path: routes.checkout, element: <Checkout /> },
      { path: routes.single_product, element: <SingleProduct /> },
      { path: `${routes.categories}/:category`, element: <Categories_page /> },
    ],
  },
  {
    element: <UserDasboardLayout />,
    children: [
      {
        element: <UserOrder />,
        children: [
          { path: routes.user_address, element: <Address /> },
          { path: routes.user_profile, element: <PaymentMethod /> },
          { path: routes.user_setting, element: <AccountSetting /> },
          { path: routes.user_my_orders, element: <Order /> },
          {
            path: routes.user_single_order,
            element: <SingleOrder />,
          },
        ],
      },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: routes.dashboard_products, element: <ProductsPage /> },
      {
        path: `${routes.dashboard_create_edit_products}/:action`,
        element: <AddProduct />,
      },
      { path: routes.dashboard_orders, element: <Orders /> },
      { path: routes.dashboard_single_order, element: <SingleOrder /> },
      { path: routes.dashboard_categories, element: <Categories /> },
      { path: routes.dashboard_customers, element: <Customers /> },
      {
        path: `${routes.dashboard_create_edit_category}/:action`,
        element: <CreateAndEditCategory />,
      },
      { path: routes.dashboard_single_product, element: <ProductView /> },
    ],
  },
]);

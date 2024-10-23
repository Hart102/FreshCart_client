import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import { routes } from "@/routes/route";

import Register from "./pages/Register";
import Login from "@/pages/Login";

// Client
import MainLayout from "@/layout/client";
import Home from "@/pages/Home";
import Categories_page from "@/pages/Categories";
import SingleProduct from "@/pages/Single-product";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";

// Reused
import SingleOrder from "@/pages/SingleOrder";

// USER
import UserDasboardLayout from "@/layout/user";
import Address from "@/pages/User/Address";
import UserOrder from "@/layout/orders";
import Order from "@/pages/User/Orders";
import PaymentMethod from "@/pages/User/Profile";
import AccountSetting from "@/pages/User/Account-setting";

// Admin
import DashboardLayout from "@/layout/dashboard";
import AddProduct from "@/pages/Create_product";
import ProductsPage from "@/pages/Products";
import Orders from "@/pages/Orders";
import Customers from "@/pages/Customers";
import Categories from "@/pages/Dashboard_categories";
import ProductView from "@/pages/ProductView";
import CreateAndEditCategory from "@/pages/Create_and_edit_category";
import NotFoundPage from "./pages/NotFoud.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: routes.home, element: <Home /> },
      { path: routes.login, element: <Login /> },
      { path: routes.register, element: <Register /> },

      { path: routes.cart, element: <Cart /> },
      { path: routes.checkout, element: <Checkout /> },
      { path: "/shop/category/:categoryName/:productId", element: <SingleProduct /> },
      { path: `${routes.categories}/:category`, element: <Categories_page /> },
    ],
  },
  {
    element: <UserDasboardLayout />,
    errorElement: <NotFoundPage />,
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
    errorElement: <NotFoundPage />,
    children: [
      { path: routes.dashboard_products, element: <ProductsPage /> },
      {
        path: `${routes.dashboard_create_edit_products}/:id`,
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

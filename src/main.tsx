import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
import { RouterProvider } from "react-router-dom";
import { router } from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      {/* <NextThemesProvider attribute="class" defaultTheme="dark"> */}
      <RouterProvider router={router} />
      {/* </NextThemesProvider> */}
    </NextUIProvider>
  </React.StrictMode>
);

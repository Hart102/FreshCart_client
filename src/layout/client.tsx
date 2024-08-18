import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Footer";
import ModalLayout from "@/components/Modal_layout";

export default function MainLayout() {
  return (
    <>
      <div className="w-screen">
        <Navbar />
        <div className="w-full md:w-11/12 mx-auto py-8 md:py-6 px-4 md:px-14">
          <Outlet />
        </div>
        <Footer />
      </div>
      <ModalLayout />
    </>
  );
}

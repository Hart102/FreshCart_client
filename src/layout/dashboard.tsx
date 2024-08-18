import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  BiLogoProductHunt,
  BiUserPlus,
  BiCategoryAlt,
  BiCartAdd,
} from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import Header from "@/components/Navigation/Header";
import SideBar from "@/components/Navigation/SideBar";
import { routes } from "@/routes/route";
import ModalLayout from "@/components/Modal_layout";

const links = [
  {
    icon: BiLogoProductHunt,
    title: "Products",
    href: routes.dashboard_products,
  },
  {
    icon: BiCategoryAlt,
    title: "Categories",
    href: routes.dashboard_categories,
  },
  { icon: BiCartAdd, title: "Orders", href: routes.dashboard_orders },
  { icon: BiUserPlus, title: "Customers", href: routes.dashboard_customers },
];

export default function DashboardLayout() {
  const [toggleStatus, setToggleStatus] = useState<boolean>(false);
  const toggle = () =>
    !toggleStatus ? setToggleStatus(true) : setToggleStatus(false);

  return (
    <>
      <div className="w-screen min-h-screen bg-white">
        <div className="w-full flex flex-col px-2 md:px-5 mx-auto text-dark-gray-100">
          <div className="relative md:mt-5 pb-5 md:h-full">
            <div
              className={`w-full md:w-[22%] md:h-full md:px-3 bg-white md:border-r-2 border-dotted
           absolute md:fixed top-0 left-0 z-20 delay-150 duration-300 md:-translate-x-0 ${
             !toggleStatus ? "-translate-x-full" : "-translate-x-0"
           }`}
            >
              <div className="flex justify-end md:hidden m-4">
                <FaTimes size={23} onClick={toggle} />
              </div>
              <SideBar
                status={true}
                sidebarlinks={links}
                urlCount={16}
                closeMenu={() => toggle()}
              />
            </div>
            <div className="w-full md:w-[78%] mx-auto flex flex-col gap-10 md:absolute right-0 top-0 md:px-5 bg-white">
              <Header onclick={() => toggle()} />
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <ModalLayout />
    </>
  );
}

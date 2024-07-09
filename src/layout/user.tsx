import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDisclosure } from "@nextui-org/react";
import SideBar from "@/components/Navigation/SideBar";
import {
  BiBell,
  BiCreditCard,
  BiCartAdd,
  BiMenuAltRight,
} from "react-icons/bi";
import { FaMapMarkerAlt, FaToggleOn } from "react-icons/fa";
import NewNavBar from "@/components/Navigation/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { authentication_token } from "@/lib";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";
import { routes } from "@/routes/route";
import { ApiEndPoint, endpoints } from "@/routes/api";

const links = [
  {
    icon: BiCreditCard,
    title: "Profile",
    href: routes.user_profile,
  },
  {
    icon: BiCartAdd,
    title: "My Orders",
    href: routes.user_my_orders,
  },
  { icon: FaToggleOn, title: "Settings", href: routes.user_setting },
  { icon: FaMapMarkerAlt, title: "Address", href: routes.user_address },
  { icon: BiBell, title: "Notification", href: "" },
];

export default function UserDasboardLayout() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [response, setResponse] = useState({ isError: false, message: "" });
  const [toggleStatus, setToggleStatus] = useState<boolean>(false);

  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => console.log("clicked from dashboard layout"),
    confirmationMessage: "",
    response,
  });
  const handleChangeModalContent = (template: string) => {
    changeModalContent({
      template,
      templates,
      onOpen,
      setCurrentTemplate,
    });
  };
  const toggle = () =>
    !toggleStatus ? setToggleStatus(true) : setToggleStatus(false);

  const confirmPayment = async () => {
    onOpen();
    handleChangeModalContent("01");
    const { data } = await axios.get(
      ApiEndPoint(endpoints.confirm_payment, ""),
      {
        headers: { Authorization: authentication_token },
      }
    );
    handleChangeModalContent("03");
    setResponse({ ...response, isError: data.isError, message: data.message });
  };
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const { data } = await axios.get(
          ApiEndPoint(endpoints.fetch_uncompleted_transactions, ""),
          {
            headers: { Authorization: authentication_token },
          }
        );
        if (!data.isError && data.payload.length > 0) {
          setPaymentStatus(true);
        } else {
          setPaymentStatus(false);
        }
      } catch (error) {
        setPaymentStatus(false);
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <NewNavBar />
      <div className="w-full md:w-11/12 px-4 md:px-16 mx-auto md:py-8 text-dark-gray-100">
        {paymentStatus && (
          <div className="py-1 px-5 border-b flex justify-end">
            <Button
              size="sm"
              radius="none"
              type="button"
              onClick={confirmPayment}
              className="px-2 text-sm font-semibold text-deep-blue-100 hover:underline"
            >
              VERIFY PAYMENT
            </Button>
          </div>
        )}
        <div className="relative md:mt-5 md:flex gap-10 pb-10">
          <div
            className={`w-full md:w-3/12 h-screen md:h-fit md:pr-4 md:border-r border-dotted
           absolute md:relative top-0 left-0 z-20 bg-white delay-150 duration-300 md:-translate-x-0 ${
             !toggleStatus ? "-translate-x-full" : "-translate-x-0"
           }`}
          >
            <SideBar
              status={false}
              sidebarlinks={links}
              urlCount={11}
              closeMenu={() => toggle()}
            />
          </div>
          <div className="w-full md:w-9/12 mx-auto flex flex-col gap-3 p-1">
            <div className="flex justify-end md:hidden">
              <BiMenuAltRight size={23} onClick={toggle} />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout>
      <Footer />
    </>
  );
}

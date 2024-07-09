import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiGridAlt, BiLogOut } from "react-icons/bi";
import { Button, useDisclosure } from "@nextui-org/react";
import { authentication_token } from "@/lib";
import { FaTimes } from "react-icons/fa";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";
import { routes } from "@/routes/route";
import { ApiEndPoint, endpoints } from "@/routes/api";

const checkAuthentication = (
  token: string | undefined,
  navigation: (to: string) => void
) => {
  if (token === undefined) {
    navigation(routes.home);
  }
};

export default function SideBar({
  status,
  sidebarlinks,
  urlCount,
  closeMenu,
}: {
  status?: boolean;
  sidebarlinks: { icon: React.ElementType; title: string; href: string }[];
  urlCount: number;
  closeMenu?: () => void;
}) {
  const location = useLocation();
  const navigation = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [response, setResponse] = useState({ isError: false, message: "" });

  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => Logout(),
    confirmationMessage: "Are you sure you want to logout ?",
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
  const Logout = async () => {
    const { data } = await axios.post(ApiEndPoint(endpoints.logout, ""));
    if (!data.isError) {
      document.cookie =
        "online_store" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload();
    } else {
      setResponse({ isError: data.isError, message: data.message });
    }
  };

  useEffect(() => {
    checkAuthentication(authentication_token, navigation);
  }, [navigation]);

  return (
    <>
      <aside className="flex flex-col gap-8 px-4 md:px- md:py-5">
        <div
          className={`text-2xl font-bold first-letter:text-3xl md:ml-1${
            status ? "block" : "hidden"
          }`}
        >
          <Link
            to={""}
            className="font-bold text-3xl hidden md:flex items-center gap-2"
          >
            OnlineStore
          </Link>
        </div>
        {!status && (
          <div className="flex md:hidden items-center justify-end mt-4">
            <FaTimes onClick={closeMenu} />
          </div>
        )}
        <div className="flex flex-col gap-4 justify-between">
          <Link
            to={routes.dashboard_home}
            className={`items-center gap-2 px-2 py-3 rounded hover:bg-deep-gray-300 ${
              status ? "flex" : "hidden"
            }`}
          >
            <BiGridAlt size={18} />
            Dashboard
          </Link>
          <div className="flex flex-col justify-between gap-2">
            <div>
              <p className={`px-2 py-3 text-sm ${status ? "block" : "hidden"}`}>
                Store Management
              </p>
              <div className="flex flex-col gap-2">
                {sidebarlinks.map((link) => (
                  <Link
                    key={link?.title}
                    to={link?.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      location.pathname.slice(urlCount).replace("-", " ") ==
                        link?.title.toLowerCase() &&
                      "bg-deep-blue-100 text-white"
                    }`}
                  >
                    <link.icon size={18} />
                    {link?.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-b border-dotted bg-dark-gray-200 py-1 rounded"></div>
            <div className="py-10">
              <Button
                onClick={() => handleChangeModalContent("02")}
                className="flex items-center gap-2 rounded-lg border hover:border-deep-blue-100"
              >
                <BiLogOut />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </aside>
      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout>
    </>
  );
}

import { Link, useLocation } from "react-router-dom";
import { BiGridAlt, BiLogOut } from "react-icons/bi";
import { Button } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";
import { routes } from "@/routes/route";
import instance from "@/api";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/modal_actions";
import { ConfirmationModal } from "@/components/Templates/index";
import { showAlert } from "@/util/alert";
import { ProtectedRoute } from "../../api/auth";
import { useEffect } from "react";

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
  const dispatch = useDispatch();

  useEffect(() => {
    ProtectedRoute();
  }, []);

  const Logout = async () => {
    const { data } = await instance.post("/user/logout");
    if (!data.isError) {
      document.cookie =
        "online_store" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload();
    } else {
      showAlert("Error", data?.message, "error");
    }
  };

  const handleOpenModal = () => {
    dispatch(
      openModal(
        <ConfirmationModal
          onContinue={Logout}
          message="Are you sure you want to logout ?"
        />,
        "md"
      )
    );
  };

  return (
    <>
      <aside className="flex flex-col gap-8 px-4 md:px- md:py-5">
        <Link
          to={""}
          className={`${
            status
              ? "font-bold text-3xl hidden md:flex items-center gap-2"
              : "hidden"
          }`}
        >
          OnlineStore
        </Link>
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
                onClick={handleOpenModal}
                className="flex items-center gap-2 rounded-lg border hover:border-deep-blue-100"
              >
                <BiLogOut />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

import { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { BiGridAlt, BiShoppingBag } from "react-icons/bi";
import { FaBars } from "react-icons/fa6";
import { getCartCount } from "@/lib";
import { token } from "../../api/auth";
import { CategoryWithProductCount } from "@/types/index";
import { routes } from "@/routes/route";
import instance from "@/api/index";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/modal_actions";
import { ConfirmationModal } from "@/components/Templates/index";
import { showAlert } from "@/lib/alert";

export default function Navbar() {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [cartCount, setCartCount] = useState<string | number>();
  const [categories, setCategories] = useState<CategoryWithProductCount[]>([]);

  const confirmLogout = () => {
    dispatch(
      openModal(
        <ConfirmationModal
          onContinue={() => Logout()}
          message="Are you sure you want to logout ?"
        />,
        "1xl"
      )
    );
  };

  const fetchUserRole = async () => {
    if (token) {
      const { data } = await instance.get("/user/fetch-user-role");

      if (!data.isError) {
        setUserRole(data.payload);
      }
    }
  };

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

  useEffect(() => {
    const FetchCategories = async () => {
      const { data } = await instance.get("/categories/fetch-all-categorie");

      if (!data.isError) {
        setCategories(data.payload);
      }
    };
    FetchCategories();
    fetchUserRole();
  }, []);

  setInterval(() => {
    setCartCount(getCartCount());
  }, 3000);

  const Toggle = () => (!isMenuOpen ? setIsOpen(true) : setIsOpen(false));

  const ChangeCategory = (cat: string) => {
    navigation(`${routes.categories}/${cat}`);
  };

  const dropDownClass = "my-1 hover:bg-deep-gray-50 py-1 rounded-md";
  return (
    <>
      <nav className="w-screen relative md:sticky md:-top-[4.5rem] z-50 bg-white">
        <div className="mx-auto flex flex-col gap-2">
          <div className="border-b border-deep-gray-50">
            <div className="w-full md:w-11/12 px-5 py-3 md:py-4 md:px-14 mx-auto flex items-center justify-between">
              <Link
                to={routes.home}
                className="font-bold text-2xl md:text-3xl flex items-center gap-2"
              >
                <BiShoppingBag size={30} className="text-deep-blue-100" />
                <p className="hidden md:block">FreshCart</p>
              </Link>
              <div className="w-5/12 hidden md:flex items-center justify-between border rounded-lg px-4 bg-white">
                <input
                  type="text"
                  placeholder="Search for products"
                  className="py-2 w-96 text-dark-gray-100 outline-none text-sm"
                />
                <FaSearch className="text-deep-gray-100" />
              </div>
              <div className="flex items-center text-deep-gray-100 gap-8">
                <Link to={routes.cart} className="relative">
                  <span className="bg-deep-red-100 text-white text-xs px-1.5 py-0.5 rounded-full absolute -top-3 -right-3">
                    {cartCount}
                  </span>
                  <BiShoppingBag size={23} className="text-deep-gray-100" />
                </Link>
                {token !== undefined && (
                  <Button
                    onClick={confirmLogout}
                    className="hidden md:block bg-transparent text-deep-blue-100 py-2 hover:bg-deep-blue-100 hover:text-white self-end"
                  >
                    Log Out
                  </Button>
                )}
                <Button
                  onClick={Toggle}
                  size="sm"
                  className="px-0 flex justify-end md:hidden bg-transparent"
                >
                  <FaBars size={23} className="text-deep-gray-100" />
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-11/12 mx-auto md:px-14 px-5 hidden md:flex gap-8 items-center pb-2">
            <Dropdown className="shadow-none">
              <DropdownTrigger>
                <Button className="bg-deep-blue-100 text-white rounded-lg flex gap-2">
                  <BiGridAlt size={23} />
                  All Departments
                </Button>
              </DropdownTrigger>
              {categories && categories.length > 0 && (
                <DropdownMenu
                  aria-label="Static Actions"
                  className="bg-white capitalize text-dark-gray-100 text-sm shadow rounded mt-1 px-2 min-w-[200px]"
                >
                  {categories.map((category) => (
                    <DropdownItem
                      key={category._id}
                      onClick={() => {
                        ChangeCategory(category.name);
                      }}
                      className={`${dropDownClass} ${
                        category.status == "active" ? "block" : "hidden"
                      }`}
                    >
                      {category.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </Dropdown>

            {token !== undefined && (
              <div>
                {userRole !== "admin" && (
                  <Link
                    to={routes.user_profile}
                    className="text-dark-gray-100 hover:text-deep-blue-100 py-2"
                  >
                    My Account
                  </Link>
                )}
                {userRole == "admin" && (
                  <Link
                    to={routes.dashboard_products}
                    className="text-dark-gray-100 hover:text-deep-blue-100 py-2"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            )}

            {token == undefined && (
              <div className="flex gap-3">
                <Link
                  to={routes.login}
                  className="text-dark-gray-100 hover:text-deep-blue-100 py-2 border-r pr-3"
                >
                  Login
                </Link>
                <Link
                  to={routes.register}
                  className="text-dark-gray-100 hover:text-deep-blue-100 py-2"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
        {/*========================= Mobile =========================*/}
        <div
          className={`absolute top-0 left-0 duration-300 delay-300 w-[80%] min-h-[80vh] z-40 bg-white flex flex-col gap-5 ${
            !isMenuOpen ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="flex justify-between items-center p-4 text-default-500">
            <Link
              to={routes.home}
              onClick={Toggle}
              className="font-bold text-2xl md:text-3xl flex items-center gap-2"
            >
              <BiShoppingBag size={30} className="text-deep-blue-100" />
              <p>FreshCart</p>
            </Link>
            <FaTimes onClick={Toggle} />
          </div>
          <div className="px-5">
            <div className="flex flex-col gap-3 capitalize text-sm">
              {token !== undefined && (
                <div className="flex flex-col gap-3">
                  {userRole !== "admin" && (
                    <Link
                      to={routes.user_profile}
                      onClick={Toggle}
                      className="text-dark-gray-100 hover:text-deep-blue-100 py-2"
                    >
                      My Account
                    </Link>
                  )}
                  {userRole == "admin" && (
                    <Link
                      to={routes.dashboard_products}
                      onClick={Toggle}
                      className="text-dark-gray-100 hover:text-deep-blue-100 py-2"
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              )}
              {categories &&
                categories.length > 0 &&
                categories.map((category) => (
                  <Link
                    to={`${routes.categories}/${category.name}`}
                    key={category._id}
                    onClick={Toggle}
                    className="text-dark-gray-100 hover:text-deep-blue-100 py-2"
                  >
                    {category.name}
                  </Link>
                ))}

              {token == undefined && (
                <div className="flex flex-col gap-3">
                  <Link
                    to={routes.login}
                    onClick={Toggle}
                    className="text-dark-gray-100 hover:text-deep-blue-100 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to={routes.register}
                    onClick={Toggle}
                    className="text-dark-gray-100 hover:text-deep-blue-100 py-2"
                  >
                    Register
                  </Link>
                </div>
              )}
              {token !== undefined && (
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={confirmLogout}
                    className="border bg-transparent text-deep-blue-100 py-2 hover:bg-deep-blue-100 hover:text-white"
                  >
                    Log Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

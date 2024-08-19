import { Link } from "react-router-dom";
import { Image, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { CategoryWithProductCount } from "@/types/index";
import { routes } from "@/routes/route";
import amazonImg from "@/assets/payment/amazonpay.svg";
import americanExpress from "@/assets/payment/american-express.svg";
import masterCard from "@/assets/payment/mastercard.svg";
import payPal from "@/assets/payment/paypal.svg";
import visa from "@/assets/payment/visa.svg";
import appStore from "@/assets/appbutton/appstore-btn.svg";
import googlePlay from "@/assets/appbutton/googleplay-btn.svg";
import instance from "../../api";

const about = [
  { href: "#", title: "About" },
  { href: "#", title: "Blog" },
  { href: "#", title: "Help Center" },
  { href: "#", title: "Our Value" },
];

const consumers = [
  { href: "#", title: "Payments" },
  { href: "#", title: "Shipping" },
  { href: "#", title: "Product Returns" },
  { href: "#", title: "FAQ" },
  { href: "#", title: "Shop Checkout" },
];

const shoppers = [
  { href: "#", title: "Become a Shopper" },
  { href: "#", title: "Shopper Opportunities" },
  { href: "#", title: "Earnings" },
  { href: "#", title: "Ideas & Guides" },
  { href: "#", title: "New Retailers" },
];

const payments = [
  { img: amazonImg, alt: "amazon" },
  { img: americanExpress, alt: "american express" },
  { img: masterCard, alt: "master card" },
  { img: payPal, alt: "paypal" },
  { img: visa, alt: "visa" },
];

export default function Footer() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryWithProductCount[]>([]);

  useEffect(() => {
    const FetchCategories = async () => {
      setIsLoading(true);
      const { data } = await instance.get("/categories/fetch-all-categorie");

      setIsLoading(false);
      if (!data.isError) {
        setCategories(data.payload);
      }
    };
    FetchCategories();
  }, []);
  return (
    <footer className="px-4 py-10 flex flex-col gap-8 bg-deep-gray-200 text-dark-gray-100">
      <div className="w-full md:w-11/12 md:px-12 mx-auto [&_h2]:font-semibold grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        <div className="flex flex-col gap-3 text-sm capitalize">
          <h2>Categories</h2>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner size="sm" />
            </div>
          ) : (
            categories &&
            categories.length > 0 &&
            categories.map(
              (cat) =>
                cat.status == "active" && (
                  <ul key={cat.name}>
                    <li>
                      <Link to={`${routes.categories}/${cat.name}`}>
                        {cat.name}
                      </Link>
                    </li>
                  </ul>
                )
            )
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h2>Get to know us </h2>
          <ul className="text-sm flex flex-col gap-2">
            {about.map((item) => (
              <li key={item.title}>
                <Link to={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2>For Consumers</h2>
          <ul className="text-sm flex flex-col gap-2">
            {consumers.map((item) => (
              <li key={item.title}>
                <Link to={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2>Become a Shopper</h2>
          <ul className="text-sm flex flex-col gap-2">
            {shoppers.map((item) => (
              <li key={item.title}>
                <Link to={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full md:w-11/12 mx-auto flex flex-col gap-8">
        <div className="w-full border-t md:border-b py-4 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-black">Payment Partners</p>
            <div className="flex items-center gap-4">
              {payments.map((payment) => (
                <Image key={payment.alt} src={payment.img} alt={payment.alt} />
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-black">Get deliveries with FreshCart</p>
            <div className="flex gap-4">
              <Image width={130} src={appStore} alt="app store" />
              <Image width={130} src={googlePlay} alt="google play" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-center md:text-start">
            © 2022 - 2024 FreshCart eCommerce HTML Template. All rights
            reserved. Powered by <br className="hidden md:block" />{" "}
            <span className="text-deep-blue-100">Codescandy .</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>Follow us on</p>
            <div className="flex gap-4 items-center">
              <Link to="#">
                <FaFacebook size={23} />
              </Link>
              <Link to="#">
                <FaTwitter size={23} />
              </Link>
              <Link to="#">
                <FaInstagram size={23} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


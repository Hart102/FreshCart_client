import { Button, Image, Accordion, AccordionItem } from "@nextui-org/react";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ProductType, AddressType, ShoppingBagType } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { debitCardSchema } from "@/schema/DebitCardSchema";
import { imageUrl } from "@/lib";
import { routes } from "@/routes/route";
import { ProtectedRoute } from "@/api/auth";
import AddAddress from "@/components/Create-address";
import { openModal } from "@/redux/modal_actions";
import { useDispatch } from "react-redux";
import instance from "@/api";
import { showAlert } from "@/lib/alert";

export default function Shiipping() {
  const location = useLocation();
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [userAddress, setUserAddress] = useState<AddressType[]>([]);
  const [shoppingBag, setShoppingBag] = useState<ShoppingBagType>({
    addressId: "",
    totalPrice: 0,
    products: [],
  });

  const calculatedSum = useMemo(() => {
    let subTotal: number = 0;
    location.state.forEach((item: ProductType) => {
      subTotal += Number(item.price.slice(3)) * Number(item.quantity);
    });

    const total: number = subTotal;
    subTotal = Math.floor(subTotal);
    return { subTotal, total };
  }, [location.state]);

  const fetchUserAddress = useMemo(async () => {
    const { data } = await instance.get("/user/");
    console.log(data);

    if (!data.isError) setUserAddress(data?.payload?.addresses);
  }, []);

  const selectDeliveryAddress = (id: string) => {
    setShoppingBag({ ...shoppingBag, addressId: id });
  };

  useEffect(() => {
    ProtectedRoute();

    if (location.state == undefined) {
      return navigation(routes.login);
    }
    fetchUserAddress;
    // Set Products details For Checkout
    const products = location.state.map((item: ProductType) => ({
      productId: item._id,
      demandedQuantity: item.quantity,
      price: `${(Number(item.price.slice(3)) * item.quantity).toFixed(2)}`,
    }));
    const total = location.state.reduce(
      (acc: number, item: ProductType) =>
        acc + Number(item.price.slice(3)) * item.quantity,
      0
    );
    setShoppingBag({
      addressId: userAddress[0]?._id || "",
      totalPrice: total,
      products: products,
    });
  }, [
    location,
    navigation,
    fetchUserAddress,
    userAddress,
    calculatedSum.total,
  ]);

  const handleAddAddress = () => {
    dispatch(openModal(<AddAddress />, "3xl"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<debitCardSchema>({ resolver: yupResolver(debitCardSchema) });

  // const placeOrder = async () => {
  //   dispatch(openModal(<Loader />, "md"));
  //   const request = await instance.post("/transactions/accept-payment");
  //   const response = await request.data;
  //   if (response.isError) {
  //     showAlert("Error", response?.message, "error");
  //   } else {
  //     navigation(routes.user_profile);
  //     window.open(response.payment_url, "_blank");
  //   }
  // };

  const validateInput = async (data: debitCardSchema) => {
    console.log(data);
    showAlert("Info", "This feature is coming soon", "info");
  };

  const InputClass =
    "bg-default-100 rounded-lg w-full outline-none p-2 mt-1 border border-transparent focus:border-deep-blue-100";

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row justify-center gap-8 px-2 md:px-0">
        <div className="w-full md:w-8/12 flex flex-col gap-8">
          {/* Select Delivery Address */}
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="01. SHIPPING"
              title="01. SHIPPING"
              classNames={{
                heading: "text-lg",
                indicator: "-rotate-90 text-deep-blue-100",
              }}
            >
              <div className="flex justify-end pb-4">
                <Button
                  size="sm"
                  type="button"
                  onClick={handleAddAddress}
                  className="py-1 px-2 rounded font-medium flex items-center gap-1 bg-deep-blue-100 text-white"
                >
                  <FaMapMarkerAlt />
                  <p className="text-sm">ADD ADDRESS</p>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAddress?.length > 0 &&
                  userAddress?.map((address) => (
                    <label
                      key={address?._id}
                      htmlFor={`${address?._id}`}
                      className="bg-deep-gray-200 rounded p-5 cursor-pointer"
                    >
                      <FaMapMarkerAlt className="text-deep-red-100" />
                      <div className="flex flex-col gap-1 mt-4">
                        <p>{address?.address_line}</p>
                        <p>
                          {address?.city}, {address?.state}
                        </p>
                        <p>{address?.country}</p>
                        <p>{address?.phone_number}</p>
                      </div>
                      <div className="flex justify-end">
                        <input
                          type="radio"
                          name="location"
                          id={`${address?._id}`}
                          checked={
                            shoppingBag &&
                            address?._id == shoppingBag?.addressId
                          }
                          onChange={() => selectDeliveryAddress(address?._id)}
                        />
                      </div>
                    </label>
                  ))}
              </div>
            </AccordionItem>
          </Accordion>
          <div className="flex flex-col gap-10 md:w-8/12 md:ml-2">
            <h2 className="text-lg">Payment</h2>
            <div className="flex flex-col gap-2">
              <p>Credit / Debit Card</p>
              <p className="text-neutral-500">
                Safe money transfer using your bank accou k account. We support
                Mastercard tercard, Visa, Discover and Stripe.
              </p>
            </div>
            <form className="[&_span]:text-xs [&_span]:text-red-500 flex flex-col gap-5 [&_label]:text-sm">
              <div>
                <label htmlFor="card_number">Card number</label>
                <input
                  type="number"
                  id="card_number"
                  {...register("card_number")}
                  placeholder="123 4567 6789 4321"
                  className={InputClass}
                />
                <span>{errors?.card_number?.message}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="card_number">Name on card</label>
                  <input
                    type="text"
                    id="card_number"
                    {...register("card_name")}
                    placeholder="Enter your first name"
                    className={InputClass}
                  />
                  <span>{errors?.card_name?.message}</span>
                </div>
                <div>
                  <label htmlFor="expiry_date">Expiry date</label>
                  <input
                    type="date"
                    id="expiry_date"
                    {...register("expiry_date")}
                    className={InputClass}
                  />
                  <span>{errors?.expiry_date?.message}</span>
                </div>
                <div>
                  <label htmlFor="cvv">CVV code</label>
                  <input
                    type="number"
                    id="cvv"
                    {...register("cvv")}
                    placeholder="***"
                    className={InputClass}
                  />
                  <span>{errors?.cvv?.message}</span>
                </div>
              </div>
            </form>
          </div>
          <div className="flex mt-5 md:ml-2">
            <Button
              onClick={handleSubmit(validateInput)}
              className="bg-deep-blue-100 text-white rounded-lg px-8 hover:opacity-85"
            >
              PLACE ORDER
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full md:w-4/12">
          <p className="text-lg">SUMMARY</p>
          <div className="flex justify-between text-lg">
            <b>TOTAL</b>
            <b>NGN {calculatedSum?.total}</b>
          </div>
          <div className="w-full flex flex-col gap-4">
            <p className="text-lg">IN YOUR CART</p>
            <div className="flex flex-col gap-4 md:h-[400px] overflow-y-auto">
              {location.state.map((product: ProductType, index: number) => (
                <div
                  key={product?._id}
                  className={`flex items-center gap-5 ${
                    index + 1 < location.state?.length && "border-b pb-5"
                  }`}
                >
                  <div className="h-[100px] w-[80px] z-0">
                    <Image
                      src={imageUrl(product?.images[0])}
                      alt="product image"
                      className="object-contain w-full h-full rounded"
                    />
                  </div>
                  <div className="flex flex-col capitalize text-sm">
                    <p className="capitalize mb-1">{product?.name}</p>
                    <p className="text-dark-gray-100">
                      Qauntity: {product?.quantity}
                    </p>
                    <p className="mt-1 text-dark-gray-100">
                      NGN {product?.totalPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

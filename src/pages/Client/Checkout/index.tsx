import {
  Button,
  Image,
  Accordion,
  AccordionItem,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ProductType, AddressType } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { debitCardSchema } from "@/schema/DebitCardSchema";
import { imageUrl, authentication_token } from "@/lib";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";
import { routes } from "@/routes/route";
import { ApiEndPoint, endpoints } from "@/routes/api";

interface ShoppingBag {
  addressId: string;
  totalPrice: number;
  products: {
    productId: string;
    demandedQuantity: number;
  }[];
}

export default function Shiipping() {
  const location = useLocation();
  const navigation = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [response, setResponse] = useState({ isError: false, message: "" });
  const [userAddress, setUserAddress] = useState<AddressType[]>([]);
  const [shoppingBag, setShoppingBag] = useState<ShoppingBag>({
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
    const { data } = await axios.get(
      ApiEndPoint(endpoints.fetch_user_role_address, ""),
      {
        headers: { Authorization: authentication_token },
      }
    );
    if (!data.error) setUserAddress(data);
  }, []);

  const selectDeliveryAddress = (id: string) => {
    setShoppingBag({ ...shoppingBag, addressId: id });
  };

  useEffect(() => {
    if (location.state == undefined || authentication_token == undefined) {
      return navigation(routes.login);
    }
    fetchUserAddress;
    // Set Products details For Checkout
    const products = location.state.map((item: ProductType) => ({
      productId: item.id,
      demandedQuantity: item.quantity,
      price: `${(Number(item.price.slice(3)) * item.quantity).toFixed(2)}`,
    }));
    const total = location.state.reduce(
      (acc: number, item: ProductType) =>
        acc + Number(item.price.slice(3)) * item.quantity,
      0
    );
    setShoppingBag({
      addressId: userAddress[0]?.id || "",
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

  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => placeOrder(),
    confirmationMessage:
      "Please visit your dashboard to verify your payment after completing payment",
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

  const placeOrder = async () => {
    handleChangeModalContent("01");
    const request = await axios.post(
      ApiEndPoint(endpoints.accept_payment, ""),
      shoppingBag,
      {
        headers: { Authorization: authentication_token },
      }
    );
    const response = await request.data;
    if (response.isError) {
      setResponse({
        ...response,
        isError: response.isError,
        message: response.message,
      });
      handleChangeModalContent("03");
    } else {
      reset();
      navigation(routes.user_profile);
      window.open(response.payment_url, "_blank");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<debitCardSchema>({ resolver: yupResolver(debitCardSchema) });

  const validateInput = async (data: debitCardSchema) => {
    console.log(data);
    handleChangeModalContent("02");
  };

  const InputProps = {
    label: "mb-16",
    inputWrapper: "px-0 flex",
    input: "p-2 outline-none border rounded-lg",
    base: "text-sm text-neutral-500 mb-2 py-2",
  };
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
                indicator: "-rotate-90",
              }}
            >
              <div className="flex justify-end pb-4">
                <Button
                  size="sm"
                  type="button"
                  onPress={onOpen}
                  className="py-1 px-2 rounded flex items-center gap-1 border"
                >
                  <FaMapMarkerAlt className="text-deep-red-100" />
                  <p className="text-sm">ADD ADDRESS</p>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAddress.length > 0 &&
                  userAddress?.map((address) => (
                    <label
                      key={address?.id}
                      htmlFor={`${address?.id}`}
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
                          id={`${address?.id}`}
                          checked={
                            shoppingBag && address?.id == shoppingBag?.addressId
                          }
                          onChange={() => selectDeliveryAddress(address?.id)}
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
            <form className="[&_span]:text-xs [&_span]:text-red-500">
              <div>
                <Input
                  type="number"
                  label="Card number"
                  placeholder="123 4567 6789 4321"
                  classNames={InputProps}
                  {...register("card_number")}
                />
                <span>{errors?.card_number?.message}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Input
                    label="Name on card"
                    placeholder="Enter your first name"
                    classNames={InputProps}
                    {...register("card_name")}
                  />
                  <span>{errors?.card_name?.message}</span>
                </div>
                <div>
                  <Input
                    type="date"
                    label="Expiry date"
                    classNames={InputProps}
                    {...register("expiry_date")}
                  />
                  <span>{errors?.expiry_date?.message}</span>
                </div>
                <div>
                  <Input
                    type="number"
                    label="CVV code"
                    placeholder="***"
                    classNames={InputProps}
                    {...register("cvv")}
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
                  key={product?.id}
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
      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout>
    </>
  );
}

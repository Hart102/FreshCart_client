import { Button, Image, useMenu } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ProductType } from "@/types/index";
import { imageUrl, setCartCount } from "@/lib";
import { routes } from "@/routes/route";
import instance from "@/api";
import { formatPrice } from "@/lib/priceFormater";

export default function CheckoutSummary() {
  const navigation = useNavigate();
  const [cartItems, setCartItems] = useState<ProductType[]>([]);
  const [selectedItems, setSelectedItems] = useState<ProductType[]>([]);

  const handleSelectSingleItem = (id: string) => {
    const product = cartItems.find((item) => item._id === id);
    if (product !== undefined) {
      const selectedItem = selectedItems.find((item) => item._id === id);
      if (selectedItem == undefined) {
        setSelectedItems([...selectedItems, product]);
      } else {
        setSelectedItems(selectedItems.filter((item) => item._id !== id));
      }
    }
  };

  const calculateTotalPriceOfEachItem = (item: ProductType) => {
    const price = Number(item.price);
    console.log(price);
    return price;

    // const price = Number(item.price);

    // return price;
    // console.log((item.totalPrice = price * item.quantity));
    // return (item.totalPrice = price * item.quantity);
    // return (item.totalPrice = `${(
    //   priceWithoutDollarSign * item.quantity
    // ).toFixed(2)}`);
  };

  const calculateSum = () => {
    let subTotal: number = 0;
    cartItems.forEach((item) => {
      subTotal += Number(item.price);
    });
    const total: number = subTotal;
    return { subTotal, total };
  };
  const total = calculateSum();

  const deCreaseQty = (index: number) => {
    if (cartItems[index].quantity !== 1) {
      cartItems[index].quantity -= 1;
      calculateTotalPriceOfEachItem(cartItems[index]);
      setCartItems([...cartItems]);
    }
  };

  const increaseQty = (index: number) => {
    cartItems[index].quantity += 1;
    calculateTotalPriceOfEachItem(cartItems[index]);
    setCartItems([...cartItems]);
  };

  const removeItemFromCart = async (index: number) => {
    const { data } = await instance.delete(
      `/cart/remove-cart-item/${cartItems[index]._id}`
    );
    if (!data.isError) {
      cartItems.splice(index, 1);
      setCartItems([...cartItems]);
      setCartCount(data.total_items);
    }
  };

  const handleCheckout = () =>
    navigation(routes.checkout, { state: selectedItems });

  useEffect(() => {
    const fetchCartItems = async () => {
      const { data } = await instance.get("/cart/get-cart-items");
      if (!data.isError) {
        setCartItems(
          data.payload.map((product: ProductType) => ({
            ...product,
            quantity: product.demanded_quantity,
            isChecked: false,
            totalPrice: product.price.slice(3),
          }))
        );
      }
    };
    fetchCartItems();
  }, [navigation]);

  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-5 md:gap-2 px-2 mx:px-0">
      <div className="w-full flex flex-col">
        <p>CART ITEMS ({cartItems?.length})</p>
        {/* Desktop */}
        <div
          className={`w-full md:w-11/12 hidden md:flex flex-col gap-5 ${
            cartItems.length > 3 && "h-[450px] overflow-y-scroll pr-3"
          }`}
        >
          {cartItems &&
            cartItems?.map((product, index) => (
              <label
                key={index}
                htmlFor={`${product?._id}`}
                className="w-full pt-3 flex items-center gap-4 [&_p]:text-neutral-600 cursor-pointer"
              >
                <div className="w-full flex flex-col gap-4 text-black text-sm">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => removeItemFromCart(index)}
                      className="flex justify-end items-center gap-1 text-xs mb-2 bg-transparent text-deep-red-100 hover:underline"
                    >
                      <FaTrashAlt size={10} />
                      <p>Remove</p>
                    </Button>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="flex gap-5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`${product?._id}`}
                          className="cursor-pointer"
                          onClick={() => handleSelectSingleItem(product?._id)}
                        />
                        <Image
                          src={imageUrl(product?.images[0])}
                          alt="product image"
                          classNames={{
                            img: "rounded-lg w-[100px] h-[90px]",
                          }}
                        />
                      </div>
                      <div className="md:w-1/2 flex flex-col gap-2 capitalize">
                        <p>{product?.name}</p>
                        <h2 className="text-xl">
                          {formatPrice(Number(product?.price))}
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <div className="bg-deep-gray-200 rounded text-2xl">
                          <Button
                            size="sm"
                            onClick={() => deCreaseQty(index)}
                            className="bg-default-50 text-xl shadow-lg"
                          >
                            -
                          </Button>
                        </div>
                        <p className="border px-4 py-2">{product?.quantity}</p>
                        <div className="bg-deep-gray-200 rounded text-2xl">
                          <Button
                            size="sm"
                            onClick={() => increaseQty(index)}
                            className="bg-default-50 text-xl shadow-lg"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <h2 className="text-xl self-end">
                        NGN {Math.round(Number(product?.totalPrice))}
                      </h2>
                    </div>
                  </div>
                </div>
              </label>
            ))}
        </div>
      </div>
      <div
        className={`md:hidden flex flex-col gap-5 ${
          cartItems.length > 3 && "h-[450px] overflow-y-scroll"
        }`}
      >
        {cartItems &&
          cartItems?.map((product, index) => (
            <label
              htmlFor={`${product?._id}${index}`}
              key={product?._id}
              className="flex flex-col gap-4 cursor-pointer"
            >
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="flex items-center gap-2 text-xs bg-transparent p-0"
                  onClick={() => removeItemFromCart(index)}
                >
                  <FaTrashAlt className="text-deep-red-100" />
                  Remove
                </Button>
              </div>
              <div className="flex justify-between items-baseline">
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`${product?._id}${index}`}
                      onClick={() => handleSelectSingleItem(product?._id)}
                    />
                    <Image
                      src={imageUrl(product?.images[0])}
                      classNames={{
                        img: "w-[60px] md:w-[100px] h-[50px] md:h-[100px] rounded-lg",
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-5 text-center">
                  <div className="bg-deep-gray-200 rounded text-2xl">
                    <button
                      onClick={() => deCreaseQty(index)}
                      className="bg-deep-red-100 text-white shadow px-3"
                    >
                      -
                    </button>
                  </div>
                  <p className="font-medium">{product?.quantity}</p>
                  <div className="bg-deep-gray-200 rounded text-2xl">
                    <button
                      onClick={() => increaseQty(index)}
                      className="bg-deep-blue-100 text-white shadow px-2"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-lg font-medium">
                  {formatPrice(Number(product?.price))}
                </p>
                <p className="capitalize">{product?.name}</p>
              </div>
              {index % 2 == 0 && (
                <div className="bg-deep-gray-50 rounded-full py-[2px]"></div>
              )}
            </label>
          ))}
      </div>
      <div className="flex flex-col gap-8 w-full md:w-4/12 mt-10 md:mt-0">
        <h2 className="text-lg">SUMMARY</h2>

        <div className="flex justify-between text-lg">
          <b>TOTAL</b>
          <b className="text-xl">{formatPrice(total.total)}</b>
        </div>
        <div className="flex flex-col gap-8 justify-between h-full pb-10">
          <Button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
            className={`w-full rounded-lg font-bold bg-deep-blue-100 text-white mt-5 ${
              selectedItems.length === 0
                ? "cursor-not-allowed opacity-55"
                : "cursor-pointer"
            }`}
          >
            CHECK OUT
          </Button>
        </div>
      </div>
    </div>
  );
}

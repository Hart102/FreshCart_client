import { useState } from "react";
import { Button, Image, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { BiShoppingBag, BiStar } from "react-icons/bi";
import { getCartCount, imageUrl, setCartCount } from "@/lib";
import { ProductType } from "@/types/index";
import { routes } from "@/routes/route";
import instance from "../../api";
import { ProtectedRoute } from "../../api/auth";
import { formatPrice } from "@/lib/priceFormater";

export default function ProductTemplate({ product }: { product: ProductType }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigation = useNavigate();
  const ViewProduct = (cat: ProductType) => {
    navigation(routes?.single_product, { state: cat });
  };

  const AddToCart = async (productId: string) => {
    ProtectedRoute();
    setIsLoading(true);
    const { data } = await instance.put("/cart/add-to-cart", {
      product_id: productId,
      quantity: 1,
    });

    setIsLoading(false);
    if (data?.total_items) {
      setCartCount(data?.total_items);
      getCartCount();
    }
  };

  return (
    <div
      onClick={() => ViewProduct(product)}
      className="p-4 flex flex-col items-center gap-4 rounded-lg bg-white
        border border-deep-gray-300 hover:border-deep-blue-100 cursor-pointer"
    >
      <Image
        width={150}
        src={imageUrl(product?.images[0] || "")}
        className="rounded-lg h-[140px]"
      />
      <div className="w-full mt-2 z-10">
        <p className="text-sm text-deep-gray-100 capitalize">
          {product?.category_name}
        </p>
        <b className="capitalize text-xl1 font-bold">{product?.name}</b>
        <div className="flex flex-wrap items-center gap-2 md:gap-5">
          <div className="flex gap-2 text-yellow-500">
            <BiStar />
            <BiStar />
            <BiStar />
            <BiStar />
            <BiStar />
          </div>
          <p className="text-sm">4.5</p>
        </div>
      </div>
      <div className="w-full flex items-center justify-between z-10">
        <b>{formatPrice(Number(product?.price))}</b>
        <Button
          size="sm"
          onClick={() => AddToCart(product?._id)}
          className="bg-transparent text-sm font-semibold rounded outline-none"
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <BiShoppingBag size={24} className="text-deep-blue-100" />
          )}
        </Button>
      </div>
    </div>
  );
}

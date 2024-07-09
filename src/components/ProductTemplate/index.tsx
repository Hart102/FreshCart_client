import { Button, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { BiStar } from "react-icons/bi";
import axios from "axios";
import {
  authentication_token,
  getCartCount,
  imageUrl,
  setCartCount,
} from "@/lib";
import { ProductType } from "@/types/index";
import { routes } from "@/routes/route";
import { ApiEndPoint, endpoints } from "@/routes/api";

export default function ProductTemplate({ product }: { product: ProductType }) {
  const navigation = useNavigate();
  const ViewProduct = (cat: ProductType) =>
    navigation(routes?.single_product, { state: cat });

  const AddToCart = async (productId: string) => {
    const { data } = await axios.put(
      ApiEndPoint(endpoints?.add_to_cart, ""),
      {
        productId: productId,
        quantity: 1,
      },
      { headers: { Authorization: authentication_token } }
    );
    if (data?.total_items) {
      setCartCount(data?.total_items);
      getCartCount();
    }
  };

  return (
    <div
      onClick={() => ViewProduct(product)}
      className="p-4 flex flex-col items-center gap-5 rounded-lg shadow bg-white
         border border-deep-gray-200 hover:border-deep-blue-100 cursor-pointer"
    >
      <Image
        width={150}
        src={imageUrl(product?.images[0] || "")}
        className="rounded-lg h-[140px]"
      />
      <div className="w-full mt-2 z-10">
        <p className="text-sm text-deep-gray-100 capitalize">
          {product?.category}
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
        <b>{product?.price}</b>
        <Button
          size="sm"
          onClick={() => AddToCart(product?.id)}
          className="bg-deep-blue-100 text-white text-sm font-semibold rounded"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

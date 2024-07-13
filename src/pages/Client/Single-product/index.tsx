import axios from "axios";
import { Button, Image } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiStar, BiCartAdd } from "react-icons/bi";
import {
  imageUrl,
  authentication_token,
  setCartCount,
  getCartCount,
} from "@/lib";
import { ProductType } from "@/types/index";
import ProductTemplate from "@/components/ProductTemplate";
import { routes } from "@/routes/route";
import { ApiEndPoint, endpoints } from "@/routes/api";

export default function SingleProduct() {
  const location = useLocation();
  const navigation = useNavigate();
  const [product, setProduct] = useState<ProductType>();
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const selectImage = (imageIndex: number) => setSelectedImageIndex(imageIndex);
  const IncreaseQuntiy = () => setQuantity(quantity + 1);
  const DecreaseQuantity = () => quantity !== 0 && setQuantity(quantity - 1);

  const FetchRelatedProducts = useCallback(async () => {
    const { data } = await axios.get(
      ApiEndPoint(endpoints.fetch_related_products, location.state.category)
    );
    if (!data.isError) {
      setRelatedProducts(data.payload);
    }
    console.log(data);
  }, [location?.state?.category]);

  const AddToCart = async () => {
    const { data } = await axios.put(
      ApiEndPoint(endpoints.add_to_cart, ""),
      {
        product_id: product?._id,
        quantity: quantity,
      },
      { headers: { Authorization: authentication_token } }
    );
    if (data.total_items) {
      setCartCount(data.total_items);
      getCartCount();
    }
  };

  useEffect(() => {
    if (location.state == null || location.state == undefined) {
      return navigation(routes?.login);
    }
    setProduct(location?.state);
    FetchRelatedProducts();
  }, [location, navigation, FetchRelatedProducts]);

  return (
    <div>
      <div className="flex flex-col gap-28 text-dark-gray-100">
        <div className="flex flex-col md:flex-row gap-10 md:gap-20">
          <div className="w-full md:w-1/2 flex flex-col gap-8 md:px-10">
            <Image
              src={imageUrl(product?.images[selectedImageIndex] || "")}
              classNames={{
                img: "w-[510px] h-[250px] md:h-[320px]",
              }}
              className="rounded-lg overflow-h_idden"
            />
            <div className="flex gap-3">
              {product &&
                product?.images.map((image, index) => (
                  <div key={index}>
                    <Image
                      src={imageUrl(image)}
                      alt="product image"
                      classNames={{
                        img: "w-[120px] h-[70px] md:h-[90px] rounded-lg cursor-pointer",
                      }}
                      onClick={() => selectImage(index)}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <div className="w-full flex flex-col gap-5 border-b pb-5">
              <p className="text-sm text-deep-blue-100 capitalize">
                {product?.category}
              </p>
              <div className="flex flex-col gap-2">
                <h1 className="capitalize text-3xl font-bold">
                  {product?.name}
                </h1>
                <div className="flex items-center gap-5">
                  <div className="flex gap-2 text-yellow-500">
                    <BiStar />
                    <BiStar />
                    <BiStar />
                    <BiStar />
                    <BiStar />
                  </div>
                  <p className="text-sm text-deep-blue-100">(30 reviews)</p>
                </div>
              </div>
              <h2 className="font-bold text-2xl">{product?.price}</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Button onClick={DecreaseQuantity} className="bg-deep-gray-50">
                  -
                </Button>
                <div>{quantity}</div>
                <Button onClick={IncreaseQuntiy} className="bg-deep-gray-50">
                  +
                </Button>
              </div>
              <div>
                <Button
                  onClick={AddToCart}
                  className="flex items-center gap-4 bg-deep-blue-100 text-white font-semibold rounded-lg hover:opacity-75"
                >
                  <BiCartAdd />
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="md:px-10 py-10">
          <h2 className="font-bold text-2xl md:text-3xl mb-5 md:mb-10">
            Related Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {relatedProducts &&
              relatedProducts?.map((product) => (
                <ProductTemplate key={product._id} product={product} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

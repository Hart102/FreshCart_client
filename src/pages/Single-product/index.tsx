import { Button, Image, Spinner } from "@nextui-org/react";
import {  useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BiStar, BiCartAdd } from "react-icons/bi";
import { ProductType } from "@/types/index";
import ProductTemplate from "@/components/ProductTemplate";
import { imageUrl, setCartCount, getCartCount } from "@/lib";
import instance from "@/api";
import { ProtectedRoute } from "@/api/auth";
import { formatPrice } from "@/lib/priceFormater";

export default function SingleProduct() {
  const params = useParams();
  const [selectedProduct, setSelectedProduct] = useState<ProductType>();
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { categoryName, productId } = params
  const selectImage = (imageIndex: number) => setSelectedImageIndex(imageIndex);
  const IncreaseQuntiy = () => setQuantity(quantity + 1);
  const DecreaseQuantity = () => quantity !== 0 && setQuantity(quantity - 1);

  const AddToCart = async () => {
    ProtectedRoute();
    setIsLoading(true);
    const { data } = await instance.put("/cart/add", {
      product_id: selectedProduct?._id,
      quantity: quantity,
    });
    
    setIsLoading(false);
    if (!data.isError) {
      setCartCount(data.total_items);
      getCartCount();
    }
  };

  useEffect(() => {
    instance.get(`/products/category/${categoryName}`).then((res) => {
      const result = res.data;

      if (!result.isError) {
        setRelatedProducts(result.payload);
        setSelectedProduct(result.payload.find((product: ProductType) => product._id === productId));
      }
    });
  }, [categoryName, productId]);


  return (
    <div>
      <div className="flex flex-col gap-28 text-dark-gray-100">
        <div className="flex flex-col md:flex-row gap-10 md:gap-20">
          <div className="w-full md:w-1/2 flex flex-col gap-8 md:px-10">
            <img
              src={imageUrl(selectedProduct?.images[selectedImageIndex] || "")}
              className="w-[510px] h-[250px] md:h-[320px] rounded-lg"
            />
            <div className="flex gap-3">
              {selectedProduct &&
                selectedProduct?.images.map((image, index) => (
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
                {selectedProduct?.category}
              </p>
              <div className="flex flex-col gap-2">
                <h1 className="capitalize text-3xl font-bold">
                  {selectedProduct?.name}
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
              <h2 className="font-bold text-2xl">
                {formatPrice(selectedProduct?.price)}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  onClick={DecreaseQuantity}
                  className="bg-default-50 text-xl shadow-lg"
                >
                  -
                </Button>
                <div>{quantity}</div>
                <Button
                  size="sm"
                  onClick={IncreaseQuntiy}
                  className="bg-default-50 text-xl shadow-lg"
                >
                  +
                </Button>
              </div>
              <div>
                <Button
                  onClick={AddToCart}
                  className="bg-deep-blue-100 text-white font-semibold rounded-lg hover:opacity-75"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" color="white" />
                      <span className="text-xs">Adding to cart...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <BiCartAdd />
                      Add to cart
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="md:px-10 py-10">
          <h2 className="font-bold text-2xl md:text-3xl mb-5 md:mb-10">
            Related Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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

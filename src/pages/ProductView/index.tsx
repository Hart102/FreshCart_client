import { ProductType } from "@/types/index";
import { Image } from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { BiStar } from "react-icons/bi";
import { useEffect, useState } from "react";
import { imageUrl } from "@/lib";
import { formatPrice } from "@/lib/priceFormater";


export default function ProductView() {
  const location = useLocation();
  const [product, setProduct] = useState<ProductType>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const selectImage = (imageIndex: number) => setSelectedImageIndex(imageIndex);

  useEffect(() => {
    setProduct(location.state);
  }, [location]);

  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-20 md:p-20">
      <div className="w-full md:w-1/2 flex flex-col gap-8 md:px-10">
        <Image
          src={imageUrl(product?.images[selectedImageIndex] || "")}
          classNames={{
            img: "w-[510px] h-[250px] md:h-[300px]",
          }}
          className="rounded-lg overflow-hidden"
        />
        <div className="flex gap-3">
          {product &&
            product?.images.map((image, index) => (
              <div key={index}>
                <Image
                  src={imageUrl(image)}
                  alt="product image"
                  classNames={{
                    img: "w-[120px] h-[70px] rounded-lg cursor-pointer",
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
            <h1 className="capitalize text-3xl font-bold">{product?.name}</h1>
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
            {formatPrice(Number(product?.price))}
          </h2>
        </div>
      </div>
    </div>
  );
}

import { ApiEndPoint, endpoints } from "@/routes/api";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProductType } from "@/types";
import ProductTemplate from "@/components/ProductTemplate";
// import AliceCarousel from "react-alice-carousel";
// import "react-alice-carousel/lib/alice-carousel.css";

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);

  const handleApiCalls = async () => {
    const product_container = [];
    const { data } = await axios.get(
      ApiEndPoint(endpoints.fetch_all_products, "")
    );
    if (!data.isError) {
      if (data.payload.length < 8) {
        setProducts(data.payload);
      } else {
        for (let i = 0; i < 8; i++) {
          product_container.push(data.payload[i]);
        }
        setProducts(product_container);
      }
    }
  };

  useEffect(() => {
    handleApiCalls();
  }, []);

  return (
    <div className="flex flex-col gap-8 md:gap-10 text-dark-gray-100">
      <div className="bg-deep-gray-2001 rounded-xl py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3">
          {/* <div className="flex items-center justify-center">
          <div>
            <Image
              src={TVimg}
              alt="Hisense 43 Smart TV"
              classNames={{ img: "h-[300px] w-[300px]" }}
              className="object-cover rounded-lg"
            />
          </div>
        </div> */}
          <div className="flex flex-col justify-center gap-6">
            <h1 className="font-bold text-3xl md:text-5xl leading-10">
              Your Source for Everyday Essentials
            </h1>
            <p className="text-dark-gray-100">
              Explore a Collection of Top-Quality Products Designed to Enhance
              Your Daily Life, From Home and Office Essentials to Fashion and
              Technology.
            </p>
            <div>
              <Button className="bg-deep-blue-100 text-white rounded-lg">
                Shop now
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold">Daily Best Sells</h2>
        {products && products.length > 0 && (
          <AliceCarousel
            items={products.map((product) => (
              <div key={product._id} className="mx-3">
                <ProductTemplate product={product} />
              </div>
            ))}
            autoPlay={true}
            autoPlayInterval={2000}
            responsive={{
              0: { items: 1 },
              768: { items: 2 },
              1024: { items: 4 },
            }}
          />
        )}
      </div> */}
      <div className="flex flex-col gap-8 py-10">
        <h2 className="text-2xl font-semibold">Popular Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 text-dark-gray-100">
          {products &&
            products.length > 0 &&
            products?.map((product) => (
              <ProductTemplate key={product?._id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
}

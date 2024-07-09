import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { BiGridAlt, BiGrid, BiMenu } from "react-icons/bi";
import ProductTemplate from "@/components/ProductTemplate";
import { ProductType, CategoryWithProductCount } from "@/types/index";
import { routes } from "@/routes/route";
import { ApiEndPoint, endpoints } from "@/routes/api";

export default function Categories() {
  const params = useParams();
  const [products, setProduct] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryWithProductCount[]>([]);
  const [desktopGrid, setDesktopGrid] = useState<number>(3);
  const [mobileGrid, setMobileGrid] = useState<number>(1);

  const ChanDesktopGrid = (gridCoumns: number) => setDesktopGrid(gridCoumns);
  const ChangeMobileGrid = (gridColumns: number) => {
    setDesktopGrid(2);
    mobileGrid > 1 ? setMobileGrid(1) : setMobileGrid(gridColumns);
  };

  const FetchProductsByCategory = useMemo(async () => {
    const { data } = await axios.get(
      ApiEndPoint(endpoints.fetch_related_products, `${params.category}`)
    );
    if (!data.isError) {
      return setProduct(data.payload);
    }
  }, [params.category]);
  FetchProductsByCategory;

  useEffect(() => {
    const FetchCategoryList = async () => {
      const { data } = await axios.get(
        ApiEndPoint(endpoints.fetch_all_categories, "")
      );
      if (!data.isError) {
        setCategories(data.payload);
      }
    };
    FetchCategoryList();
  }, []);

  return (
    <div className="w-full flex gap-12 text-dark-gray-100 text-sm relative">
      <div className="w-3/12 hidden md:flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Categories</h1>
        <div className="flex flex-col gap-1">
          {categories &&
            categories.length > 0 &&
            categories.map(
              (category) =>
                category.status == "active" && (
                  <Link
                    key={category.name}
                    to={`${routes.categories}/${category.name}`}
                    className={`capitalize border rounded-lg  p-2 flex items-center justify-between hover:border-deep-blue-100 ${
                      params?.category == category.name &&
                      "bg-deep-blue-100 text-white"
                    }`}
                  >
                    {category.name}
                    <FaAngleRight />
                  </Link>
                )
            )}
        </div>
      </div>
      <div className="w-full md:w-9/12">
        <div className="flex flex-col gap-8">
          <div className="bg-deep-gray-50 rounded-lg px-4 md:px-10 p-10">
            <h2 className="text-3xl font-bold capitalize">{params.category}</h2>
          </div>
          <div className="flex items-center justify-between px-2">
            <div>
              <b>{products.length}</b> Products found
            </div>
            <div className="flex items-center gap-4">
              <BiMenu
                size={20}
                onClick={() => ChangeMobileGrid(2)}
                className={`cursor-pointer ${
                  desktopGrid == 2 && "text-deep-blue-100"
                }`}
              />
              <BiGrid
                size={20}
                onClick={() => ChanDesktopGrid(3)}
                className={`hidden md:block cursor-pointer ${
                  desktopGrid == 3 && "text-deep-blue-100"
                }`}
              />
              <BiGridAlt
                size={20}
                onClick={() => ChanDesktopGrid(4)}
                className={`hidden md:block cursor-pointer ${
                  desktopGrid == 4 && "text-deep-blue-100"
                }`}
              />
            </div>
          </div>
          <div
            className={`grid grid-cols-${mobileGrid} md:grid-cols-${desktopGrid} gap-4 pb-10`}
          >
            {products &&
              products?.map((product) => (
                <ProductTemplate key={product.id} product={product} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

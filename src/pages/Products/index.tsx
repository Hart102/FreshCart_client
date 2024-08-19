import { useEffect, useMemo, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
} from "@nextui-org/react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BiAddToQueue } from "react-icons/bi";
import { imageUrl, divideAndInsertBr } from "@/lib";
import { ProductType } from "@/types/index";
import { routes } from "@/routes/route";
import { closeModal, openModal } from "@/redux/modal_actions";
import { ConfirmationModal } from "@/components/Templates/index";
import { showAlert } from "@/util/alert";
import instance from "@/api";

export default function Products() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const FetchProducts = async () => {
    setIsLoading(true);
    const { data } = await instance.get("/products");
    setIsLoading(false);
    if (!data.isError) {
      setProducts(data.payload);
    }
  };

  useEffect(() => {
    FetchProducts();
  }, []);

  const searchResult = useMemo(() => {
    if (products.length > 0) {
      return products.filter((product: ProductType) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return products;
    }
  }, [products, query]);

  const DeleteProduct = async () => {
    const { data } = await instance.delete(
      `/products/delete/${products[index]._id}`
    );
    dispatch(closeModal());
    if (data?.isError) {
      showAlert("Error", data?.message, "error");
    } else {
      showAlert("Success", data?.message, "success");
      products.splice(index, 1);
      setProducts([...products]);
    }
  };

  const OpenDeleteProductModal = (index: number) => {
    setIndex(index);
    dispatch(
      openModal(
        <ConfirmationModal
          onContinue={() => DeleteProduct()}
          message="Are you sure you want to delete this product ?"
        />,
        "1xl"
      )
    );
  };
  const ViewProduct = (product: ProductType) =>
    navigation(routes.dashboard_single_product, { state: product });

  const EditProduct = (productId: string) => {
    navigation(`${routes.dashboard_create_edit_products}/${productId}`);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="px-4 flex flex-col gap-2 md:flex-row items-center justify-between">
          <input
            type="search"
            placeholder="Type to search..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            className="w-full md:w-1/2 text-sm outline-none border rounded bg-transparent p-2"
          />
          <div className="w-full md:w-fit">
            <Link
              to={`${routes.dashboard_create_edit_products}/create`}
              className="py-2 px-2 rounded-lg flex items-center justify-center gap-1 font-semibold bg-deep-blue-100 text-white"
            >
              <BiAddToQueue />
              <p className="text-sm">ADD PRODUCT</p>
            </Link>
          </div>
        </div>
        <Table
          classNames={{
            base: "overflow-x-scroll md:overflow-x-auto",
            th: "capitalize bg-dark-gray-200",
            tbody: "py-41 text-sm text-center",
            td: "first-letter:capitalize",
          }}
        >
          <TableHeader>
            <TableColumn>
              <div className="text-start">
                <b>Basic Info</b>
              </div>
            </TableColumn>
            <TableColumn>Category</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Qty</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          {products && products?.length > 0 ? (
            <TableBody
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." />}
            >
              {searchResult.map((product, index) => (
                <TableRow
                  key={product?._id}
                  className={`hover:bg-deep-gray-50 cursor-pointer ${
                    index % 2 == 0 ? "bg-white" : "bg-deep-gray-200"
                  }`}
                >
                  <TableCell>
                    <div className="md:flex gap-4 items-center">
                      {product?.images && product?.images?.length > 0 && (
                        <Image
                          src={imageUrl(product?.images[0])}
                          className="hidden md:block"
                          classNames={{
                            img: "h-[40px] w-[40px]",
                          }}
                          alt={product?.name}
                        />
                      )}
                      <div
                        className="first-letter:capitalize text-start"
                        dangerouslySetInnerHTML={{
                          __html: divideAndInsertBr(product?.name),
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{product?.category_name}</TableCell>
                  <TableCell
                    className={
                      product?.status.toLowerCase() == "available"
                        ? "text-deep-blue-100"
                        : "text-deep-red-100"
                    }
                  >
                    {product?.status}
                  </TableCell>
                  <TableCell>{product?.price}</TableCell>
                  <TableCell>{product?.quantity}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger className="cursor-pointer">
                        ...
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Dynamic Actions"
                        className="z-10 bg-white text-s"
                      >
                        <DropdownItem
                          className="py-1 my-1 rounded"
                          onClick={() => ViewProduct(product)}
                        >
                          View
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => EditProduct(product?._id)}
                          className="py-1 my-1 rounded"
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          className="py-1 my-1 rounded"
                          onClick={() => OpenDeleteProductModal(index)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
          )}
        </Table>
      </div>
    </>
  );
}

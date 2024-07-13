import { useEffect, useMemo, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BiAddToQueue } from "react-icons/bi";
import { authentication_token, imageUrl, divideAndInsertBr } from "@/lib";
import { ProductType } from "@/types/index";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";
import { routes } from "@/routes/route";
import { ApiEndPoint, endpoints } from "@/routes/api";

export default function Products() {
  const navigation = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [query, setQuery] = useState<string>("");
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [response, setResponse] = useState({ isError: false, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const FetchProducts = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      ApiEndPoint(endpoints.fetch_all_products, ""),
      {
        headers: { Authorization: authentication_token },
      }
    );
    if (data.isError) {
      setResponse({ isError: data.isError, message: data.message });
      setCurrentTemplate("03");
    } else {
      setProducts(data.payload);
    }
    setIsLoading(false);
  };

  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => DeleteProduct(),
    confirmationMessage: "Are you sure you want to delete this product ?",
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
    handleChangeModalContent("01");
    const request = await axios.delete(
      ApiEndPoint(
        endpoints.delete_product_using_products_id,
        `${products[index]._id}`
      ),
      {
        headers: { Authorization: authentication_token },
      }
    );
    const response = await request.data;
    if (response.isError) {
      setResponse({ isError: response.isError, message: response.message });
      handleChangeModalContent("03");
    } else {
      setResponse({ isError: response.isError, message: response.message });
      handleChangeModalContent("03");
      products.splice(index, 1);
      setProducts([...products]);
    }
  };

  const OpenDeleteProductModal = (index: number) => {
    setIndex(index);
    handleChangeModalContent("02");
  };
  const ViewProduct = (product: ProductType) =>
    navigation(routes.dashboard_single_product, { state: product });

  const EditProduct = (product: ProductType) => {
    navigation(`${routes.dashboard_create_edit_products}/edit`, {
      state: product,
    });
  };

  useEffect(() => {
    FetchProducts();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="px-4 flex flex-col gap-2 md:flex-row items-center justify-between">
          <form className="flex w-full md:w-1/2 items-center gap-2 border rounded-lg px-2">
            <Input
              size="sm"
              type="search"
              placeholder="Type to search..."
              classNames={{
                base: "h-10 outline-0",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal hover:border-01",
              }}
              style={{ outline: "0" }}
              onValueChange={setQuery}
            />
          </form>
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
            tbody: "py-4 text-sm text-center",
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
                            img: "h-[50px] w-[50px]",
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
                  <TableCell>{product?.category}</TableCell>
                  <TableCell
                    className={
                      product?.status == "active"
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
                        className="z-10 bg-white text-sm"
                      >
                        <DropdownItem
                          className="py-1 my-1 rounded hover:bg-deep-blue-100 hover:text-white"
                          onClick={() => ViewProduct(product)}
                        >
                          View
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => EditProduct(product)}
                          className="py-1 my-1 rounded hover:bg-deep-blue-100 hover:text-white"
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          className="py-1 my-1 rounded hover:bg-deep-blue-100 hover:text-white"
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
      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout>
    </>
  );
}

import { useState, ChangeEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Image, Spinner } from "@nextui-org/react";
import axios from "axios";
import { BiCloudUpload } from "react-icons/bi";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ProductSchema } from "@/schema/addProductSchema";
import { imageUrl } from "@/lib";
import { CategoryWithProductCount, ProductType } from "@/types/index";
import instance, { token, api } from "@/api";
import { showAlert } from "@/lib/alert";

export default function AddProduct() {
  const params = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [productImages, setproductImages] = useState<string[]>([]);
  const [replacedImages, setReplacedImages] = useState<string[]>([]);
  const filesLength: number[] = [0, 1, 2, 3];
  const [categories, setCategories] = useState<CategoryWithProductCount[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  console.log(selectedProduct);

  const FetchCategories = async () => {
    const { data } = await instance.get("/categories/fetch-all-categorie");
    if (!data.isError) {
      setCategories(data.payload);
    }
  };

  const fetctSelectedProduct = async () => {
    if (params?.id !== "create") {
      const { data } = await instance.get(`/products/${params.id}`);
      setSelectedProduct(data.payload.product);

      const { name, price, quantity, status, description, images } =
        data.payload.product;

      setValue("productName", name);
      setValue("category", data?.category_name);
      setValue("price", price.slice(3));
      setValue("quantity", quantity);
      setValue("status", status);
      setValue("description", description);
      setproductImages(images);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: yupResolver(ProductSchema),
    defaultValues: {
      productName: selectedProduct?.name,
      category: selectedProduct?.category_name,
      price: selectedProduct?.price?.toString().slice(3),
      quantity: selectedProduct?.quantity?.toString(),
      status: selectedProduct?.status,
      description: selectedProduct?.description,
    },
  });

  useEffect(() => {
    FetchCategories();
    fetctSelectedProduct();
  }, []);

  // Handle Image Selection
  const handleImage = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      const newFiles = [...files];
      const newPreviewImages = [...previewImages];

      newFiles[index] = selectedFile;
      newPreviewImages[index] = URL.createObjectURL(selectedFile);
      setFiles(newFiles);
      setPreviewImages(newPreviewImages);

      if (!replacedImages.includes(productImages[index])) {
        setReplacedImages([...replacedImages, productImages[index]]);
      }
    }
  };

  const endpoint = params.id == "create" ? "products/create" : "products/edit";

  const handleApiRequest = async (data: ProductSchema) => {
    setIsLoading(true);

    const price = params.id !== "create" ? `NGN ${data.price}` : data.price;
    const category =
      params.id == "create" ? data.category : selectedProduct?.category_id;

    const formData = new FormData();
    files.forEach((file: File) => formData.append("file", file));
    formData.append("name", data.productName);
    formData.append("category", `${category}`);
    formData.append("price", price);
    formData.append("quantity", data.quantity);
    formData.append("status", data.status);
    formData.append("description", data.description);
    //Edit
    if (params.id !== "create") {
      formData.append("id", `${params?.id}`);
      formData.append("replacedImageIds", JSON.stringify(replacedImages));
      if (files.length < 1) {
        formData.append("images", JSON.stringify(productImages));
      }
    }

    try {
      const request = await axios.put(`${api}/${endpoint}`, formData, {
        headers: { Authorization: token },
      });
      const response = await request.data;
      setIsLoading(false);
      if (response?.isError) {
        showAlert("Error", response?.message, "error");
      } else {
        showAlert("Success", response?.message, "success");
        reset();
        setFiles([]);
        setPreviewImages([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data: ProductSchema) => {
    handleApiRequest(data);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row text-sm md:p-0 p-4 justify-center">
        <form className="w-full md:w-10/12 flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-semibold">Product Information</p>
            <div className="flex flex-col gap-4 [&_span]:text-red-500 [&_span]:text-xs [&_span]:ml-31">
              <div>
                <input
                  type="text"
                  placeholder="Product Name"
                  className="w-full border rounded p-3 outline-none focus:border-deep-blue-100"
                  {...register("productName")}
                />
                <span>{errors?.productName?.message}</span>
              </div>
              <div>
                <select
                  className="border rounded w-full bg-transparent p-3 outline-none"
                  {...register("category")}
                >
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <span>{errors?.category?.message}</span>
              </div>
              <div>
                <div>
                  <textarea
                    placeholder="Product description"
                    className="resize-none w-full rounded h-32 p-3 border outline-none"
                    {...register("description")}
                  ></textarea>
                  <span>{errors?.description?.message}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-semibold">Product Images</p>
                <div className="grid grid-cols-2 gap-8 border rounded mt-5">
                  {filesLength.map((index) => (
                    <label
                      key={index}
                      htmlFor={`${index}`}
                      className="rounded h-36 cursor-pointer flex items-center justify-center my-2 py-2 relative"
                    >
                      <input
                        type="file"
                        id={`${index}`}
                        className="hidden"
                        onChange={(e) => handleImage(e, index)}
                      />
                      {(previewImages[index] !== undefined ||
                        productImages[index] !== undefined) && (
                        <Image
                          src={
                            previewImages[index] ||
                            imageUrl(productImages[index])
                          }
                          alt="Product Image"
                          classNames={{ img: "w-[130px] h-[120px]" }}
                        />
                      )}
                      <div className="absolute top-0 left-0 h-full w-full z-10 flex justify-center items-center">
                        <BiCloudUpload size={20} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
        <form className="flex flex-col gap-8 w-full md:w-4/12 md:px-5 md:pt-8 bg-white">
          <div className="flex flex-col gap-5 [&_span]:text-red-500 [&_span]:text-xs">
            <p className="text-xl font-semibold">Status</p>
            <div className="[&_label]:cursor-pointer flex items-center gap-8">
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  id="available"
                  value="available"
                  {...register("status")}
                />
                <label htmlFor="available" className="text-app-gray-200">
                  Available
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="radio"
                  id="out of stock"
                  value="out of stock"
                  {...register("status")}
                />
                <label htmlFor="out of stock" className="text-app-gray-200">
                  Out of stock
                </label>
              </div>
            </div>
            {errors?.status?.message && <span>{errors?.status?.message}</span>}
            <div>
              <input
                type="text"
                placeholder="Quantity Eg: 15"
                className="w-full border rounded p-3 outline-none focus:border-deep-blue-100"
                {...register("quantity")}
              />
              <span>{errors?.quantity?.message}</span>
            </div>
            <div>
              <div className="border rounded flex items-center pl-1">
                <p>NGN</p>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full py-3 px-1 outline-none"
                  {...register("price")}
                />
              </div>
              <span>{errors?.price?.message}</span>
            </div>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`bg-deep-blue-100 text-white py-2 px-3 rounded font-semibold text-sm hover:opacity-65 ${
                isLoading && "opacity-65"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="white" />
                  <p>Loading...</p>
                </div>
              ) : params.id == "create" ? (
                "CREATE PRODUCT"
              ) : (
                "EDIT PRODUCT"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

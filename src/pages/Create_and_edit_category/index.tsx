import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input, Button, Spinner } from "@nextui-org/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addCategorySchema } from "@/schema/addCategorySchema";
import instance from "@/api";
import { showAlert } from "@/lib/alert";

export default function EditAndEditCategory() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<addCategorySchema>({
    resolver: yupResolver(addCategorySchema),
    defaultValues: {
      name: location.state?.name || "",
      status: location.state?.status || "active",
    },
  });

  useEffect(() => {
    if (location.state !== null) {
      const { name, status } = location.state;
      setValue("name", name);
      setValue("status", status);
    }
  }, [location.state, setValue]);

  const endpoint =
    location.state == null
      ? "categories/create"
      : `categories/edit/${location.state._id}`;

  const handleApiRequest = async (data: addCategorySchema) => {
    setIsLoading(true);
    const request = await instance.post(endpoint, data);
    const response = request.data;
    setIsLoading(false);

    if (response.isError) {
      showAlert("Error", response.message, "error");
    } else {
      reset();
      showAlert("Success", response.message, "success");
    }
  };

  const onSubmit = async (data: addCategorySchema) => {
    handleApiRequest(data);
  };

  return (
    <>
      <form className="min-h-[80vh] flex1 items-center text-dark-gray-100 [&_span]:text-deep-red-100 [&_span]:text-xs">
        <div className="w-full md:w-7/12 mx-auto1 flex flex-col gap-8 rounded-lg py-10 px-5 text-sm">
          <h1 className="text-2xl font-semibold">Create Products Category</h1>
          <Input
            placeholder="Category Name"
            classNames={{
              inputWrapper: "px-0",
              input: "bg-white rounded-lg outline-none px-2",
            }}
            {...register("name")}
          />
          {errors?.name?.message && <span>{errors?.name?.message}</span>}

          <div className="flex items-center gap-4">
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                id="active"
                value="active"
                {...register("status")}
              />
              <label htmlFor="active">Active</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                id="inactive"
                value="inactive"
                {...register("status")}
              />
              <label htmlFor="inactive">Inactive</label>
            </div>
            {errors?.status?.message && <span>{errors?.status?.message}</span>}
          </div>
          <div>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`w-full md:w-1/2 rounded-lg font-semibold
              bg-deep-blue-100 text-white ${isLoading && "opacity-65"}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner color="white" size="sm" />
                  <span className="text-white">Please wait...</span>
                </div>
              ) : (
                "CREATE CATEGORY"
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

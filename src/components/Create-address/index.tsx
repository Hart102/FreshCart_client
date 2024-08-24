import { Button, Input, Spinner } from "@nextui-org/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addAddressSchema } from "@/schema/addressSchema";
import instance from "../../api";
import { showAlert } from "@/lib/alert";
import { useState } from "react";

export default function AddAddress() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<addAddressSchema>({ resolver: yupResolver(addAddressSchema) });

  const onSubmit = async (data: addAddressSchema) => {
    setIsLoading(true);
    const request = await instance.post("/user/add-address", data);
    const response = await request.data;
    setIsLoading(false);
    if (response.isError) {
      showAlert("Error", response?.message, "error");
    } else {
      showAlert("Success", response?.message, "success");
      reset();
    }
  };

  const InputProps = {
    label: "mb-16 text-base",
    inputWrapper: "px-0 flex",
    input: "p-2 outline-none bg-transparent rounded-lg",
    base: "my-4",
  };
  return (
    <>
      <div className="w-full text-dark-gray-100">
        <form className="flex flex-col gap-8 relative">
          <div>
            <div className="flex flex-col gap-1 text-start">
              <h1 className="text-xl font-bold">Shipping address</h1>
              <p className="text-sm">
                Add new shipping address for your order delivery.
              </p>
            </div>
          </div>
          <div className="md:py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&_span]:text-red-500 [&_span]:text-xs1">
              <div>
                <Input
                  label="Address"
                  placeholder="No, 7 aba oweri road"
                  classNames={InputProps}
                  {...register("address_line")}
                />
                <span>{errors?.address_line?.message}</span>
              </div>
              <div>
                <Input
                  label="City"
                  placeholder="Aba"
                  classNames={InputProps}
                  {...register("city")}
                />
                <span>{errors?.city?.message}</span>
              </div>
              <div>
                <Input
                  label="State"
                  placeholder="Abia state"
                  classNames={InputProps}
                  {...register("state")}
                />
                <span>{errors?.state?.message}</span>
              </div>
              <div>
                <Input
                  label="Country"
                  placeholder="Nigeria"
                  classNames={InputProps}
                  {...register("country")}
                />
                <span>{errors?.country?.message}</span>
              </div>
              <div>
                <Input
                  label="Zip Code"
                  placeholder="11400"
                  classNames={InputProps}
                  {...register("zipcode")}
                />
                <span>{errors?.zipcode?.message}</span>
              </div>
              <div>
                <Input
                  label="Phone Number"
                  placeholder="+234 456 789"
                  classNames={InputProps}
                  {...register("phone")}
                />
                <span>{errors?.phone?.message}</span>
              </div>
            </div>
            <div className="flex">
              <Button
                variant="light"
                onClick={handleSubmit(onSubmit)}
                className="bg-deep-blue-100 hover:text-black font-semibold text-white rounded-lg px-20 mt-5"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner color="white" /> Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

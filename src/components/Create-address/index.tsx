import { useState } from "react";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addAddressSchema } from "@/schema/addressSchema";
import { api, authentication_token } from "@/lib";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";

export default function AddAddress() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [response, setResponse] = useState({ isError: false, message: "" });

  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => console.log("clicked"),
    confirmationMessage: "",
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<addAddressSchema>({ resolver: yupResolver(addAddressSchema) });

  const onSubmit = async (data: addAddressSchema) => {
    handleChangeModalContent("01");
    const request = await axios.post(`${api}/user/add-address`, data, {
      headers: { Authorization: authentication_token },
    });
    const response = await request.data;
    setResponse({ isError: response.isError, message: response.message });
    handleChangeModalContent("03");
    if (!response.isEror) reset();
  };
  const InputProps = {
    label: "mb-16",
    inputWrapper: "px-0 flex",
    input: "p-2 outline-none bg-deep-gray-200 rounded-lg",
    base: "text-sm mb-2 py-2",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&_span]:text-red-500 [&_span]:text-xs">
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
                className="bg-deep-blue-100 font-semibold text-white rounded-lg px-20 mt-5"
              >
                SAVE
              </Button>
            </div>
          </div>
        </form>
      </div>

      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout>
    </>
  );
}

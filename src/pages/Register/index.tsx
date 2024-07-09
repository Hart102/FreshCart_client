import { useState } from "react";
import axios from "axios";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RegisterationSchema } from "@/schema/register_login_schema";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";
import { ApiEndPoint, endpoints } from "@/routes/api";
import { routes } from "@/routes/route";

export default function Register() {
  const navigation = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<{
    isError: boolean;
    message: string;
  }>({ isError: false, message: "" });

  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => console.log("Register"),
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
    formState: { errors },
  } = useForm<RegisterationSchema>({
    resolver: yupResolver(RegisterationSchema),
  });

  const onSubmit = async (data: RegisterationSchema) => {
    setIsLoading(true);
    const request = await axios.post(ApiEndPoint(endpoints.register, ""), data);
    const response = await request.data;
    setIsLoading(false);
    if (response.isError) {
      setResponse({
        ...response,
        isError: response.isError,
        message: response.message,
      });
      handleChangeModalContent("03");
    } else {
      navigation(routes.login);
    }
    console.log(response);
  };
  const InputProps = {
    label: "mb-16",
    inputWrapper: "px-0 flex",
    input: "p-2 outline-none",
    base: "text-sm text-dark-gray-100 mb-2 z-0 bg-deep-gray-200 rounded-lg",
  };
  return (
    <>
      <div className="w-full md:w-5/12 mx-auto p-4 md:p-10">
        <h1 className="text-2xl font-semibold mb-10">Register</h1>

        <form className="flex flex-col gap-8 [&_span]:text-xs [&_span]:text-deep-red-100">
          <div>
            <Input
              type="text"
              label="Firstname"
              labelPlacement="outside"
              placeholder="tim"
              classNames={InputProps}
              {...register("firstname")}
            />
            <span>{errors?.firstname?.message}</span>
          </div>
          <div>
            <Input
              type="text"
              label="Lastname"
              labelPlacement="outside"
              placeholder="brown"
              classNames={InputProps}
              {...register("lastname")}
            />
            <span>{errors?.lastname?.message}</span>
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              labelPlacement="outside"
              placeholder="tim@gmail.com"
              classNames={InputProps}
              {...register("email")}
            />
            <span>{errors?.email?.message}</span>
          </div>
          <div>
            <Input
              type="password"
              label="Password"
              labelPlacement="outside"
              placeholder="****"
              classNames={InputProps}
              {...register("password")}
            />
            <span>{errors?.password?.message}</span>
          </div>
        </form>
        <div className="py-5">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full bg-deep-blue-100 text-white rounded-lg"
          >
            {isLoading ? "Please wait" : "Register"}
          </Button>
        </div>
      </div>
      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout>
    </>
  );
}

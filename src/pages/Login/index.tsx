import { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schema/register_login_schema";
import { authentication_token } from "@/lib";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";
import { routes } from "@/routes/route";
import { ApiEndPoint, endpoints } from "@/routes/api";

interface CookieOptions {
  name: string;
  value: string;
  days?: number;
}

export default function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<{
    isError: boolean;
    message: string;
  }>({ isError: false, message: "" });
  const [currentTemplate, setCurrentTemplate] = useState<string>("");

  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => console.log("login"),
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
  } = useForm<LoginSchema>({ resolver: yupResolver(LoginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    const request = await axios.post(ApiEndPoint(endpoints.login, ""), data);
    const response = await request.data;
    setIsLoading(false);
    if (response.isError) {
      setResponse({
        ...response,
        isError: response.isError,
        message: response.message,
      });
      handleChangeModalContent("03");
      return;
    }
    // SET COOKIE FUNCTION
    const setCookie = (options: CookieOptions) => {
      let expires = "";
      if (options.days) {
        const date = new Date();
        date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie =
        options.name + "=" + (options.value || "") + expires + "; path=/";
    };
    setCookie({ name: "online_store", value: response.payload });

    if (response.user_role == "admin") {
      navigation(routes.dashboard_products);
    } else {
      navigation(routes.user_profile);
    }
    window.location.reload();
  };

  useEffect(() => {
    if (authentication_token !== undefined)
      return navigation(routes.user_profile);
  }, [navigation]);

  const InputProps = {
    label: "mb-16",
    inputWrapper: "px-0 flex",
    input: "p-2 outline-none",
    base: "text-sm text-dark-gray-100 mb-2 z-0 bg-deep-gray-200 rounded-lg",
  };

  return (
    <>
      <div className="p-5">
        <form className="w-full md:w-5/12 mx-auto p-5">
          <h1 className="text-2xl font-semibold mb-10">Welcome Back !</h1>

          <div className="flex flex-col gap-8 [&_span]:text-xs [&_span]:text-deep-red-100">
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
          </div>

          <div className="flex justify-end">
            <Link
              to="/register"
              className="text-sm text-deep-green-200 hover:underline"
            >
              Signup
            </Link>
          </div>
          <div className="py-5">
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full bg-deep-blue-100 text-white rounded-lg"
            >
              {!isLoading ? "LOGIN" : "PLEASE WAIT"}
            </Button>
          </div>
        </form>
      </div>
      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout>
    </>
  );
}

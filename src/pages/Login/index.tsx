import { useEffect, useState } from "react";
import { Input, Button, Spinner } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schema/register_login_schema";
import { routes } from "@/routes/route";
import { showAlert } from "@/lib/alert";
import instance, { token } from "@/api";

interface CookieOptions {
  name: string;
  value: string;
  days?: number;
}

export default function Login() {
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: yupResolver(LoginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    const request = await instance.post("/user/login", data);
    const response = await request.data;
    setIsLoading(false);
    if (response.isError) {
      showAlert("Error", response?.message, "error");
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
    setCookie({ name: "freshCart", value: response.payload });

    if (response?.user_role == "admin") {
      return (window.location.href = routes.dashboard_products);
    } else {
      window.location.href = routes.user_profile;
    }
  };

  useEffect(() => {
    if (token !== undefined) return navigation(routes.home);
  }, [navigation]);

  const InputProps = {
    label: "mb-16",
    inputWrapper: "px-0 flex",
    input: "p-2 outline-none",
    base: "text-sm text-dark-gray-100 mb-2 z-0 bg-deep-gray-200 rounded-lg",
  };

  return (
    <>
      <div className="md:p-5">
        <form className="w-full md:w-5/12 mx-auto p-5">
          <h1 className="text-2xl font-semibold mb-10">Welcome Back !</h1>
          <div className="flex flex-col gap-4 [&_span]:text-xs [&_span]:text-deep-red-100">
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
          <div className="flex gap-2 text-sm">
            Don't have an account yet ?{" "}
            <Link to={routes.register} className="text-deep-blue-100">
              Signup
            </Link>
          </div>
          <div className="py-5">
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`w-full bg-deep-blue-100 text-white rounded-lg ${
                isLoading && "opacity-65"
              }`}
            >
              {!isLoading ? (
                "LOGIN"
              ) : (
                <div className="flex items-center gap-2">
                  <Spinner color="white" />
                  PLEASE WAIT
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

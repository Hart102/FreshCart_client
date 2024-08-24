import { useState } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RegisterationSchema } from "@/schema/register_login_schema";
import { routes } from "@/routes/route";
import instance from "@/api";
import { showAlert } from "@/lib/alert";

export default function Register() {
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterationSchema>({
    resolver: yupResolver(RegisterationSchema),
  });

  const onSubmit = async (data: RegisterationSchema) => {
    setIsLoading(true);
    const request = await instance.post("/user/register", data);
    const response = await request.data;
    setIsLoading(false);
    if (response.isError) return showAlert("Error", response?.message, "error");
    navigation(routes.login);
  };

  const InputProps = {
    label: "mb-16",
    inputWrapper: "px-0 flex",
    input: "p-2 outline-none",
    base: "text-sm text-dark-gray-100 mb-2 z-0 bg-deep-gray-200 rounded-lg",
  };
  return (
    <>
      <div className="w-full md:w-7/12 mx-auto p-4 md:p-10">
        <h1 className="text-2xl font-semibold mb-10">Register</h1>

        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&_span]:text-xs [&_span]:text-deep-red-100">
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
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 text-sm">
              Already have an account ?{" "}
              <Link to={routes.login} className="text-deep-blue-100">
                Login
              </Link>
            </div>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`w-full bg-deep-blue-100 text-white rounded-lg font-medium ${
                isLoading && "opacity-65"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner color="white" />
                  Registering...
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

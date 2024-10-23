import { useEffect, useRef, useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { editDetailsSchema } from "@/schema/AccountSettingSchema";
import instance from "@/api";
import { showAlert } from "@/lib/alert";
import { UserType } from "@/types/index";

export default function AccountSetting() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<UserType>();
  const [password, setPassword] = useState<{
    oldPassword: string;
    newPassword: string;
  }>({
    oldPassword: "",
    newPassword: "",
  });
  const newPasswordRef = useRef(null);
  const oldPasswordRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<editDetailsSchema>({
    resolver: yupResolver(editDetailsSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await instance.get("/user/get-profile");
      if (!data.isError) setUser(data.payload);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setValue("firstname", user?.firstname || "");
    setValue("lastname", user?.lastname || "");
    setValue("email", user?.email || "");
  }, [setValue, user]);

  const EditProfile = async (data: editDetailsSchema) => {
    setIsLoading(true);
    const request = await instance.patch("/user/update-profile", data);
    const response = request.data;

    setIsLoading(false);
    if (response.isError) {
      showAlert("Error", response?.message, "error");
    } else {
      showAlert("Success", response?.message, "success");
    }
  };

  const setOldPassword = (e: string) => setPassword({ ...password, oldPassword: e });
  const setNewPassword = (e: string) => setPassword({ ...password, newPassword: e });

  const ResetPassword = async () => {
    setLoading(true);
    const { data } = await instance.patch("/user/reset-password", {
      oldPassword: password.oldPassword,
      newPassword: password.newPassword,
    });

    setLoading(false);
    if (data?.isError) return showAlert("Error", data?.message, "error");
    showAlert("Success", data?.message, "success");
  };

  const InputClass =
    "bg-default-100 rounded-lg w-full outline-none p-2 mt-2 border border-transparent focus:border-deep-blue-100";

  return (
    <>
      <div>
        <div className="flex flex-col gap-8 [&_span]:text-xs [&_span]:text-deep-red-100">
          <h1 className="text-xl md:text-3xl font-bold">Account Setting</h1>
          <form className="w-full md:w-1/2">
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="firstname">Firstname</label>
                <input
                  type="text"
                  id="firstname"
                  {...register("firstname")}
                  className={InputClass}
                />
                <span>{errors?.firstname?.message}</span>
              </div>
              <div>
                <label htmlFor="lastname">Lastname</label>
                <input
                  type="text"
                  id="lastname"
                  {...register("lastname")}
                  className={InputClass}
                />
                <span>{errors?.lastname?.message}</span>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  {...register("email")}
                  className={InputClass}
                />
                <span>{errors?.email?.message}</span>
              </div>
            </div>
            <Button
              onClick={handleSubmit(EditProfile)}
              disabled={isLoading}
              className={`bg-deep-blue-100 text-white rounded-lg mt-5 ${
                isLoading && "opacity-65"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner color="white" /> Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
          <form className="mt-10 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="oldPassword">Old Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  placeholder="*****"
                  ref={oldPasswordRef}
                  className={InputClass}
                  onChange={(event) => setOldPassword(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="*****"
                  ref={newPasswordRef}
                  className={InputClass}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
            </div>
            <div className="md:pr-4">
              <Button
                onClick={ResetPassword}
                disabled={loading}
                className={`w-1/2 bg-deep-blue-100 text-white rounded-lg ${
                  loading && "opacity-65"
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner color="white" /> Saving Password...
                  </div>
                ) : (
                  "Save Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

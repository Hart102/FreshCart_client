import { useRef, useState } from "react";
import axios from "axios";
import { Input, Button, useDisclosure } from "@nextui-org/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { editDetailsSchema } from "@/schema/AccountSettingSchema";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";
import { authentication_token } from "@/lib";
import { ApiEndPoint, endpoints } from "@/routes/api";

export default function AccountSetting() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [response, setResponse] = useState({ isError: false, message: "" });
  const [password, setPassword] = useState<{
    oldPassword: string;
    newPassword: string;
  }>({
    oldPassword: "",
    newPassword: "",
  });
  const newPasswordRef = useRef(null);
  const oldPasswordRef = useRef(null);

  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => console.log("clicked"),
    confirmationMessage: "Are you sure you want to delete this ?",
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
  } = useForm<editDetailsSchema>({ resolver: yupResolver(editDetailsSchema) });

  const EditProfile = async (data: editDetailsSchema) => {
    handleChangeModalContent("01");
    const request = await axios.patch(
      ApiEndPoint(endpoints.edit_profile, ""),
      data,
      {
        headers: { Authorization: authentication_token },
      }
    );
    const response = request.data;
    handleChangeModalContent("03");
    setResponse({ isError: response.isError, message: response.message });
    if (!response.isError) {
      reset();
    }
  };

  const setOldPassword = (e: string) =>
    setPassword({ ...password, oldPassword: e });
  const setNewPassword = (e: string) =>
    setPassword({ ...password, newPassword: e });

  const ResetPassword = async () => {
    const { data } = await axios.patch(
      ApiEndPoint(endpoints.reset_password, ""),
      { oldPassword: password.oldPassword, newPassword: password.newPassword },
      {
        headers: { Authorization: authentication_token },
      }
    );
    setResponse({ isError: data.isError, message: data.message });
    handleChangeModalContent("03");
    // if (data.isError) {
    // } else {
    //   setResponse({ isError: false, message: data.message });
    //   // if (oldPasswordRef.current && newPasswordRef.current) {
    //   //   oldPasswordRef.current.value = "";
    //   //   newPasswordRef.current.value = "";
    //   // }
    // }
  };

  const InputProps = {
    label: "mb-16",
    inputWrapper: "px-0 flex",
    input: "p-2 outline-none rounded-lg text-dark-gray-100 bg-deep-gray-200",
    base: "text-sm text-neutral-5001 mb-2 py-2 z-0",
  };

  return (
    <>
      <div>
        <div className="flex flex-col gap-8 [&_span]:text-xs [&_span]:text-deep-red-100">
          <h1 className="text-xl md:text-3xl font-bold">Account Setting</h1>
          <form className="w-full md:w-1/2">
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  label="First Name"
                  labelPlacement="outside"
                  placeholder="tim"
                  classNames={InputProps}
                  {...register("firstname")}
                />
                <span>{errors?.firstname?.message}</span>
              </div>
              <div>
                <Input
                  label="Last Name"
                  labelPlacement="outside"
                  placeholder="*****"
                  classNames={InputProps}
                  {...register("lastname")}
                />
                <span>{errors?.lastname?.message}</span>
              </div>
              <div>
                <Input
                  label="Email"
                  labelPlacement="outside"
                  placeholder="tim@gmail.com"
                  classNames={InputProps}
                  {...register("email")}
                />
                <span>{errors?.email?.message}</span>
              </div>
            </div>
            <Button
              onClick={handleSubmit(EditProfile)}
              className="bg-deep-blue-100 text-white rounded-lg mt-5"
            >
              Save Details
            </Button>
          </form>
          <form className="mt-10">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="password"
                  ref={oldPasswordRef}
                  label="Old Password"
                  labelPlacement="outside"
                  placeholder="*****"
                  classNames={InputProps}
                  onValueChange={setOldPassword}
                />
              </div>
              <div>
                <Input
                  type="password"
                  ref={newPasswordRef}
                  label="New Password"
                  labelPlacement="outside"
                  placeholder="*****"
                  classNames={InputProps}
                  onValueChange={setNewPassword}
                />
              </div>
            </div>
            <div className="md:pr-4">
              <Button
                onClick={ResetPassword}
                className="w-1/2 bg-deep-blue-100 text-white rounded-lg"
              >
                Save Password
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout>
    </>
  );
}

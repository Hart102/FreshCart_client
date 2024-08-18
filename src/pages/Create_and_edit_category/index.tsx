import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { addCategorySchema } from "@/schema/addCategorySchema";
// import { ModalLayout } from "@/components/Modal";
// import ModalTemplates, {
//   changeModalContent,
// } from "@/components/Modal/Complete-modal-templates";
import { authentication_token } from "@/lib";
import { ApiEndPoint, endpoints } from "@/routes/api";

export default function EditAndEditCategory() {
  const location = useLocation();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [currentTemplate, setCurrentTemplate] = useState<string>("");
  // const [response, setResponse] = useState({ isError: false, message: "" });

  // const templates = ModalTemplates({
  //   onCancle: onClose,
  //   onContinue: () => console.log("add category page"),
  //   confirmationMessage: "",
  //   response,
  // });
  // const handleChangeModalContent = (template: string) => {
  //   changeModalContent({
  //     template,
  //     templates,
  //     onOpen,
  //     setCurrentTemplate,
  //   });
  // };
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
      ? ApiEndPoint(endpoints.create_categories, "")
      : ApiEndPoint(endpoints.edit_category_using_id, location.state._id);

  const handleApiRequest = async (data: addCategorySchema) => {
    // handleChangeModalContent("01");
    const request = await axios.post(endpoint, data, {
      headers: { Authorization: authentication_token },
    });
    const response = request.data;
    if (response.isError) {
      // setResponse({ isError: response.isError, message: response.message });
      // handleChangeModalContent("03");
    } else {
      reset();
      // setResponse({ isError: response.isError, message: response.message });
      // handleChangeModalContent("03");
    }
  };
  const onSubmit = async (data: addCategorySchema) => {
    handleApiRequest(data);
  };

  return (
    <>
      <form className="min-h-[80vh] flex1 items-center text-dark-gray-100 [&_span]:text-deep-red-100 [&_span]:text-xs">
        <div className="w-full md:w-7/12 mx-auto1 flex flex-col gap-4 rounded-lg py-10 px-5 text-sm">
          <h1 className="text-2xl font-semibold">Create Products Category</h1>
          <Input
            placeholder="Category Name"
            classNames={{
              inputWrapper: "px-0",
              input: "bg-white rounded-lg outline-none px-2 border",
            }}
            {...register("name")}
          />
          {errors?.name?.message && <span>{errors?.name?.message}</span>}

          <div className="flex items-center gap-2">
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
              className="w-full md:w-1/2 rounded-lg font-semibold
               border border-deep-blue-100 hover:bg-deep-blue-100 hover:text-white"
            >
              CREATE
            </Button>
          </div>
        </div>
      </form>
      {/* <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templates[currentTemplate]}
      </ModalLayout> */}
    </>
  );
}

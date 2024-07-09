import { useEffect, useState } from "react";
import axios from "axios";
import { Button, useDisclosure } from "@nextui-org/react";
import { FaMapMarkerAlt, FaPencilAlt } from "react-icons/fa";
import { authentication_token } from "@/lib";
import { AddressType } from "@/types/index";
import { ModalLayout } from "@/components/Modal";
import ModalTemplates, {
  changeModalContent,
} from "@/components/Modal/Complete-modal-templates";
import AddAddress from "@/components/Create-address";
import { ApiEndPoint, endpoints } from "@/routes/api";

export default function Address() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [templateType, setTemplateType] = useState<string>("");
  const [response, setResponse] = useState({ isError: false, message: "" });
  const [userAddress, setUserAddress] = useState<AddressType[]>([]);
  const [index, setIndex] = useState<number>(0);


  const switchModal = (modalType: string) => {
    setTemplateType(modalType);
    onOpen();
  };
  const templates = ModalTemplates({
    onCancle: onClose,
    onContinue: () => deleteAddress(),
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
  useEffect(() => {
    const fetchUserAddress = async () => {
      const { data } = await axios.get(
        ApiEndPoint(endpoints.fetch_user_address, ""),
        {
          headers: { Authorization: authentication_token },
        }
      );
      if (data.isError) {
        setResponse({ isError: data.isError, message: data.message });
        handleChangeModalContent("03");
      } else {
        setUserAddress(data.payload);
      }
    };
    fetchUserAddress();
  }, []);

  const GetAddressIndex = (index: number) => {
    handleChangeModalContent("02");
    switchModal("");
    setIndex(index);
  };

  const deleteAddress = async () => {
    handleChangeModalContent("01");
    const { data } = await axios.delete(
      ApiEndPoint(endpoints.delete_address, userAddress[index]?.id),
      {
        headers: { Authorization: authentication_token },
      }
    );
    handleChangeModalContent("03");
    setResponse({ isError: data.isError, message: data.message });
    if (!data.isError) userAddress.splice(index, 1);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          size="sm"
          type="button"
          onClick={() => switchModal("add")}
          className="py-1 px-2 rounded flex items-center gap-1 border 
          border-deep-blue-100 hover:bg-deep-blue-100 hover:text-white"
        >
          <FaMapMarkerAlt />
          <p className="text-sm font-semibold">ADD ADDRESS</p>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userAddress &&
          userAddress[0]?.id !== null &&
          userAddress?.map((address, index) => (
            <div
              key={address?.id}
              className="border border-deep-gray-50 rounded-lg p-5"
            >
              <FaMapMarkerAlt className="text-deep-red-100" />
              <div className="flex flex-col gap-1 mt-4">
                <p>{address?.address_line}</p>
                <p>
                  {address?.city}, {address?.state}
                </p>
                <p>{address?.country}</p>
                <p>{address?.phone_number}</p>
              </div>
              <div className="flex gap-10 text-sm justify-between mt-4">
                <Button
                  onClick={() => GetAddressIndex(index)}
                  className="flex items-center gap-1 px-0 hover:underline font-semibold text-deep-red-100 "
                >
                  <FaPencilAlt />
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>
      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {templateType == "add" ? <AddAddress /> : templates[currentTemplate]}
      </ModalLayout>
    </>
  );
}

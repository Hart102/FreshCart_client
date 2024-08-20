import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { FaMapMarkerAlt, FaPencilAlt } from "react-icons/fa";
import { UserType } from "@/types/index";
import AddAddress from "@/components/Create-address";
import { useDispatch } from "react-redux";
import { closeModal, openModal } from "@/redux/modal_actions";
import instance from "@/api";
import { showAlert } from "@/util/alert";
import { ConfirmationModal, Loader } from "@/components/Templates/index";

export default function Address() {
  const dispatch = useDispatch();
  const [user, setUser] = useState<UserType | null>(null);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const fetchaddress = async () => {
      const { data } = await instance.get("/user//");
      if (!data.isError) {
        setUser(data.payload);
      }
    };
    fetchaddress();
  }, []);

  const handleAddAddressModal = () => {
    dispatch(openModal(<AddAddress />, "4xl"));
  };

  const handleDeleteModal = (index: number) => {
    dispatch(
      openModal(
        <ConfirmationModal
          message="Are you sure you want to Delete Address ?"
          onContinue={DeleteAddress}
        />,
        "md"
      )
    );
    setIndex(index);
  };

  const DeleteAddress = async () => {
    dispatch(openModal(<Loader />, "md"));

    const address_id = user && user?.addresses[index]?._id;
    const { data } = await instance.delete(
      `/user/delete-address/${address_id}`
    );
    if (data?.isError) {
      showAlert("Error", data?.message, "error");
    } else {
      user?.addresses?.splice(index, 1);
      showAlert("Success", data?.message, "success");
      dispatch(closeModal());
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          size="sm"
          type="button"
          onClick={handleAddAddressModal}
          className="py-1 px-2 rounded flex items-center gap-1 bg-deep-blue-100  text-white"
        >
          <FaMapMarkerAlt />
          <p className="text-sm font-semibold">ADD ADDRESS</p>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user &&
          user?.addresses?.length > 0 &&
          user?.addresses?.map((address, index) => (
            <div
              key={address?._id}
              className="border border-deep-gray-50 rounded-lg p-5"
            >
              <FaMapMarkerAlt className="text-deep-red-100" />
              <div className="flex flex-col gap-1 mt-4">
                <p>{address?.address_line}</p>
                <p>
                  {address?.city}, {address?.state}
                </p>
                <p>{address?.country}</p>
                <p>{address?.phone}</p>
              </div>
              <div className="flex gap-10 text-sm justify-between mt-4">
                <Button
                  onClick={() => handleDeleteModal(index)}
                  className="flex items-center gap-1 px-0 hover:underline font-semibold bg-transparent text-deep-red-100 "
                >
                  <FaPencilAlt />
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

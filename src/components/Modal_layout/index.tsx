import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeModal } from "@/redux/modal_actions";

type ModalState = {
  isOpen: boolean;
  size:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
    | undefined;
};

const ModalLayout = () => {
  const dispatch = useDispatch();
  const { isOpen, size } = useSelector(
    (state: RootState) => state.modal
  ) as ModalState;

  const { Template } = useSelector((state: RootState) => state.modal);

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  return (
    <>
      <Modal
        size={size}
        isOpen={isOpen}
        className="py-8"
        classNames={{ closeButton: "hidden" }}
        scrollBehavior="outside"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex justify-end">
              <FaTimes onClick={closeModalHandler} className="cursor-pointer" />
            </ModalHeader>
            <ModalBody className="text-center">{Template}</ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalLayout;

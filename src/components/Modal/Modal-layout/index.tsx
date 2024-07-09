import React from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { FaTimes } from "react-icons/fa";

export default function ModalLayout({
  isOpen,
  onClose,
  children,
}: React.PropsWithChildren<{
  isOpen: boolean;
  onClose?: () => void;
}>) {
  return (
    <Modal
      size={"2xl"}
      isOpen={isOpen}
      onClose={onClose}
      classNames={{ closeButton: "hidden" }}
      className="fixed -top-1 left-0 h-screen w-screen bg-overLay z-30 py-3 px-4"
    >
      <ModalContent className="py-20">
        {(onClose) => (
          <div className="w-full md:w-4/12 mx-auto text-center bg-deep-gray-300 text-dark-gray-100 rounded-xl p-5">
            <div className="flex justify-end">
              <FaTimes
                size={30}
                onClick={onClose}
                className="p-2 cursor-pointer text-deep-red-100"
              />
            </div>
            <ModalBody>{children}</ModalBody>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

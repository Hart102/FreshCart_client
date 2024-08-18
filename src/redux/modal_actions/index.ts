import { CLOSE_MODAL, OPEN_MODAL } from "@/redux/action_type";

export const openModal = (template: React.ReactNode, size: string) => {
  return {
    type: OPEN_MODAL,
    payload: {
      template,
      size,
    },
  };
};

export const closeModal = () => {
  return {
    type: CLOSE_MODAL,
    payload: false,
  };
};

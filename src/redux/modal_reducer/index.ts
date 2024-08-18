import React from "react";
import { CLOSE_MODAL, OPEN_MODAL } from "@/redux/action_type";

export interface State {
  Template: React.ReactNode | null;
  isOpen: boolean;
  size: string;
}

interface OpenModalAction {
  type: typeof OPEN_MODAL;
  payload: {
    template: React.ReactNode;
    size: string;
  };
}

interface CloseModalAction {
  type: typeof CLOSE_MODAL;
}

type ModalAction = OpenModalAction | CloseModalAction;

const initialState: State = {
  Template: null,
  isOpen: false,
  size: "",
};

const modalReducer = (state = initialState, action: ModalAction): State => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        Template: action.payload.template,
        size: action.payload.size,
        isOpen: true,
      };
    case CLOSE_MODAL:
      return {
        ...state,
        Template: null,
        isOpen: false,
      };
    default:
      return state;
  }
};

export default modalReducer;

import { combineReducers } from "redux";
import modalReducer from "@/redux/modal_reducer";

const rootReducer = combineReducers({ modal: modalReducer });

export default rootReducer;

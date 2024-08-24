// src/utils/alerts.ts
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showAlert = (
  title: string,
  text: string,
  icon: "success" | "error" | "warning" | "info" | "question"
) => {
  MySwal.fire({
    title,
    text,
    icon,
    confirmButtonText: "OK",
  });
};

export const showAlertWithCallback = (
  title: string,
  text: string,
  icon: "success" | "error" | "warning" | "info" | "question",
  callback: () => void
) => {
  MySwal.fire({
    title,
    text,
    icon,
    confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};

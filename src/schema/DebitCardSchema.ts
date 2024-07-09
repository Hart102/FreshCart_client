import * as yup from "yup";

export const debitCardSchema = yup.object().shape({
  card_number: yup.string().max(15).required("This field is required"),
  card_name: yup.string().required("This field is required"),
  cvv: yup.string().max(4).required("This field is required"),
  expiry_date: yup.string().required("This field is required"),
});

export type debitCardSchema = yup.InferType<typeof debitCardSchema>;

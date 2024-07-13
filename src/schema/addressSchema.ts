import * as yup from "yup";

export const addAddressSchema = yup.object().shape({
  address_line: yup.string().required("This field is required"),
  city: yup.string().required("This field is required"),
  state: yup.string().required("This field is required"),
  country: yup.string().required("This field is required"),
  zipcode: yup.string().required("This field is required"),
  phone: yup.string().required("This field is required"),
});

export type addAddressSchema = yup.InferType<typeof addAddressSchema>;

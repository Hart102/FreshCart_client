import * as yup from "yup";

export const ProductSchema = yup.object().shape({
  productName: yup.string().max(78).required("This field is required"),
  quantity: yup.string().required("This field is required"),
  category: yup.string().required("This field is required"),
  description: yup.string().required("This field is required"),
  status: yup.string().required("This field is required"),
  price: yup.string().required("This field is required"),
});

export type ProductSchema = yup.InferType<typeof ProductSchema>;

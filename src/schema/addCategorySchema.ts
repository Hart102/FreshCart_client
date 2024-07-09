import * as yup from "yup";

export const addCategorySchema = yup.object().shape({
  status: yup.string().required("This field is required"),
  name: yup.string().required("This field is required"),
});

export type addCategorySchema = yup.InferType<typeof addCategorySchema>;

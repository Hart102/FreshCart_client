import * as yup from "yup";

export const RegisterationSchema = yup.object().shape({
  firstname: yup.string().required("This field is required"),
  lastname: yup.string().required("This field is required"),
  email: yup.string().email().required("This field is required"),
  password: yup.string().min(4).required("This field is required"),
});

export const LoginSchema = yup.object().shape({
  email: yup.string().email().required("This field is required"),
  password: yup.string().required("This field is required"),
});

export type RegisterationSchema = yup.InferType<typeof RegisterationSchema>;
export type LoginSchema = yup.InferType<typeof LoginSchema>;


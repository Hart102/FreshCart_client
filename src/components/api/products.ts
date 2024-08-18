import axios from "axios";
import { authentication_token } from "@/lib";
const api = "http://localhost:5000/api";

export const fetchAllProducts = async () => {
  const { data } = await axios.get(`${api}/products`);
  return data;
};

export const fetchProductById = async (id: string | undefined) => {
  const { data } = await axios.get(`${api}/products/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await axios.get(`${api}/categories/fetch-all-categorie`);
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await axios.delete(`${api}/products/delete/${id}`, {
    headers: { Authorization: authentication_token },
  });
  return data;
};

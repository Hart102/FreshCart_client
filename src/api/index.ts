import axios from "axios";
// export const api = "http://localhost:5000/api";
export const api = "https://ecommerce-express-server-seven.vercel.app/api";

const getauthentication_tokenFromCookieStorage = () => {
  const cookies = document.cookie.split(";");
  const cookieMap: Record<string, string> = {};
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookieMap[name] = value;
  });
  return cookieMap;
};

export const token = getauthentication_tokenFromCookieStorage()["online_store"];

const instance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://ecommerce-express-server-seven.vercel.app/api", // API's base URL
  headers: {
    "Content-Type": "application/json",
    Authorization: token,
  },
});

export default instance;

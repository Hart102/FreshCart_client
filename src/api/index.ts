import axios from "axios";
// export const api = "http://localhost:5000/api";
export const api = "https://freshcart-api-6ivr.onrender.com/api";

const getauthentication_tokenFromCookieStorage = () => {
  const cookies = document.cookie.split(";");
  const cookieMap: Record<string, string> = {};
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookieMap[name] = value;
  });
  return cookieMap;
};

export const token = getauthentication_tokenFromCookieStorage()["freshCart"];

const instance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://freshcart-api-6ivr.onrender.com/api", // API's base URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default instance;

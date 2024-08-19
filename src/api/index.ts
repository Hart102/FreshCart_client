import axios from "axios";
export const api = "http://localhost:5000/api";

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
  //   baseURL: "https://api.revampevents.com", // API's base URL
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: token,
  },
});

export default instance;

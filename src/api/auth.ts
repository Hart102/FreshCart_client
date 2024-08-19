const getauthentication_tokenFromCookieStorage = () => {
  const cookies = document.cookie.split(";");
  const cookieMap: Record<string, string> = {};
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookieMap[name] = value;
  });
  return cookieMap;
};

const token = getauthentication_tokenFromCookieStorage()["online_store"];

const ProtectedRoute = () => {
  if (token == undefined) {
    return (window.location.href = "/login");
  }
};

export { token, ProtectedRoute };

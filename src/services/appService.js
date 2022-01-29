import Cookies from "universal-cookie";
import router, { routeNames } from "../router";
const cookies = new Cookies();

export const logoutUser = () => {
  cookies.remove("token");
  setTimeout(() => {
    router.push({ name: routeNames.ROOT });
  }, 5000);
};


export const getToken = () => {
  return cookies.get("token");
}

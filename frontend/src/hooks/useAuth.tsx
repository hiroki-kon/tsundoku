/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCookies } from "react-cookie";
import axios from "axios";

interface Response {
  isSignIn: boolean;
  userName: string;
  signOut: () => void;
}

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const useAuth = (): Response => {
  const [cookies] = useCookies(["expireAt", "userName", "token"]);

  console.log({ cookies });

  const isSignIn =
    cookies.expireAt !== undefined &&
    new Date(cookies.expireAt) > new Date(Date.now());

  console.log(isSignIn);

  const signOut = async () => {
    await axios.post(`${apiEndpoint}/signout`);
  };
  return { isSignIn, userName: cookies.userName, signOut };
};

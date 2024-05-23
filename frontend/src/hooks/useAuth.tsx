/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useCookies } from "react-cookie";

interface Response {
  isSignIn: boolean;
  userName: string;
}

export const useAuth = (): Response => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "expireAt",
    "userName",
  ]);

  const isSignIn =
    cookies.expireAt !== undefined &&
    new Date(cookies.expireAt) > new Date(Date.now());
  return { isSignIn, userName: cookies.userName };
};

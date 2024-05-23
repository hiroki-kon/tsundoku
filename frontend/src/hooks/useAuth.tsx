/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useCookies } from "react-cookie";

interface Response {
  isSignIn: boolean;
}

export const useAuth = (): Response => {
  const [cookies, setCookie, removeCookie] = useCookies(["expireAt"]);

  const isSignIn =
    cookies.expireAt !== undefined &&
    new Date(cookies.expireAt) > new Date(Date.now());
  return { isSignIn };
};

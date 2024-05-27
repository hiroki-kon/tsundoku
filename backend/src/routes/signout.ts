import { Router, Request, Response } from "express";
import { Methods as SignInMethod } from "../../../types/generated/api/signin";

export const signoutRouter = () => {
  const router = Router();

  router.post("/", (req: Request, res: Response) => {
    res.clearCookie("token");
    res.clearCookie("expireAt");

    res.send();
  });

  return router;
};

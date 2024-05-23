import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { Methods as SignInMethod } from "../../../types/generated/api/signin";
import passport from "../config/passport";
import jwt from "jsonwebtoken";

type SignInPostMethod = SignInMethod["post"];

export const signinRouter = (knex: Knex) => {
  const router = Router();

  router.post(
    "/",
    passport.authenticate("local", { session: false }),
    async (req: Request, res: Response<SignInPostMethod["resBody"]>) => {
      const subject = req.user;
      const foundUser = await knex<{ subject: string; name: string }>("users")
        .first("subject", "name")
        .where("subject", subject);

      const payload = {
        sub: req.user,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "24h",
      });
      const expire = 24 * 60 * 60 * 1000;

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: expire,
      });
      res.cookie("expireAt", new Date(Date.now() + expire).toISOString(), {
        maxAge: expire,
      });
      res.cookie("userName", foundUser?.name, { maxAge: expire });
      res.json({ token });
    }
  );

  return router;
};

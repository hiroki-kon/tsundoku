import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { Methods as SignInMethod } from "../../../types/generated/api/signin";
import passport from "../config/passport";
import jwt from "jsonwebtoken";
import { UUID } from "../util";

type SignInPostMethod = SignInMethod["post"];

export const signinRouter = (knex: Knex) => {
  const router = Router();

  router.post(
    "/",
    passport.authenticate("local", { session: false }),
    async (req: Request, res: Response<SignInPostMethod["resBody"]>) => {
      const subject = req.user;
      const foundUser = await knex<{ user_id: UUID; name: string }>("users")
        .first("user_id", "name")
        .where("user_id", subject);

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
        sameSite: "none",
        secure: true,
      });
      res.cookie("expireAt", new Date(Date.now() + expire).toISOString(), {
        maxAge: expire,
        sameSite: "none",
        secure: true,
      });
      res.cookie("userName", foundUser?.name, {
        maxAge: expire,
        sameSite: "none",
        secure: true,
      });
      res.json({ token });
    }
  );

  return router;
};

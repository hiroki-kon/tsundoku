import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { hash, genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import { Methods as SignUpMethod } from "../../../types/generated/api/signup";
import { UUID } from "../util";

type SignUpPostMethod = SignUpMethod["post"];

export const signupRouter = (knex: Knex) => {
  const router = Router();

  router.post(
    "/",
    async (
      req: Request<never, never, SignUpPostMethod["reqBody"]>,
      res: Response<SignUpPostMethod["resBody"]>
    ) => {
      const { email, password, name } = req.body;
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      // NOTE: 確認のためにselectは微妙かも
      const foundUser = await knex<{ user_id: UUID }>("users")
        .select()
        .where("email", email);
      console.log({ foundUser });

      const createdUser = await knex<{
        user_id: UUID;
        email: string;
        name: string;
        salt: string;
        password: string;
      }>("users").insert(
        {
          user_id: crypto.randomUUID(),
          email,
          name,
          salt,
          password: hashedPassword,
        },
        "*"
      );
      const payload = {
        sub: createdUser[0].user_id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "24m",
      });
      const expire = 24 * 60 * 60 * 1000;
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: expire,
      });
      res.cookie("expireAt", new Date(Date.now() + expire).toISOString(), {
        maxAge: expire,
      });
      res.cookie("userName", name, { maxAge: expire });
      res.json({ token });
    }
  );

  return router;
};

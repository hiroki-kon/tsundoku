import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { verify } from "jsonwebtoken";
import { knex } from "./knex";
import "dotenv/config";
import { compareSync } from "bcrypt";
import { type UUID, isUuidType } from "../util";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email: string, password: string, done: any) => {
      const findUser = await knex<{
        password: string;
        user_id: UUID;
        name: string;
      }>("users")
        .first()
        .where("email", email);

      if (findUser === undefined) {
        return done(null, false, {
          message: "Invalid User",
        });
      }

      if (compareSync(password, findUser.password)) {
        return done(null, findUser.user_id);
      } else {
        return done(null, false, {
          message: "Invalid User",
        });
      }
    }
  )
);
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JWTStrategy(opts, (jwt_payload: any, done: any) => {
    done(null, jwt_payload);
  })
);

export const authCheck = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { token } = request.cookies;

    if (!token) throw new Error();

    const { sub } = verify(token, process.env.JWT_SECRET as string);

    if (typeof sub === "string" && isUuidType(sub)) {
      request.signInUserSub = sub;
    }

    next();
  } catch {
    response.status(401).send("Authentication failed!");
  }
};

export default passport;

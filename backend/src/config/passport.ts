import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { knex } from "./knex";
import "dotenv/config";
import { compareSync } from "bcrypt";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email: string, password: string, done: any) => {
      const findUser = await knex<{ password: string; subject: string }>(
        "users"
      )
        .first()
        .where("email", email);

      if (findUser === undefined) {
        return done(null, false, {
          message: "Invalid User",
        });
      }

      if (compareSync(password, findUser.password)) {
        return done(null, findUser.subject);
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

export default passport;

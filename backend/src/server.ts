import express, { Express } from "express";
import cors from "cors";
const cookieParser = require("cookie-parser");
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { unreadBooksRouter } from "./routes/unread-books";
import { knex } from "./config/knex";
import passport, { authCheck } from "./config/passport";
import { statusRouter } from "./routes/status";
import { tagsRouter } from "./routes/tags";
import { signoutRouter } from "./routes/signout";
import path from "path";

export const createServer = (): Express => {
  const app = express();

  app.use(passport.initialize());
  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, "../../frontend", "dist")));

  app.use("/signout", signoutRouter());
  app.use("/signup", signupRouter(knex));
  app.use("/signin", signinRouter(knex));

  app.use("/status", statusRouter(knex));
  app.use("/unread-books", authCheck, unreadBooksRouter(knex));
  app.use("/tags", authCheck, tagsRouter(knex));

  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });

  return app;
};

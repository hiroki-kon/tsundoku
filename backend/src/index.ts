import express from "express";
import cors from "cors";
const cookieParser = require("cookie-parser");
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { unreadBooksRouter } from "./routes/unread-books";
import { knex } from "./config/knex";
import passport, { authCheck } from "./config/passport";

const app = express();
const port = 3000;
app.use(passport.initialize());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/signup", signupRouter(knex));
app.use("/signin", signinRouter(knex));

app.use("/unread-books", authCheck, unreadBooksRouter(knex));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

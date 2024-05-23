import express from "express";
import cors from "cors";

import { unreadBooksRouter } from "./routes/unread-books";
import { knex } from "./config/knex";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.use("/unread-books", unreadBooksRouter(knex));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

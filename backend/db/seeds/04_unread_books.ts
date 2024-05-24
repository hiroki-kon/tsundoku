import { Knex } from "knex";
import data from "./04_unread_books.json";

export async function seed(knex: Knex): Promise<void> {
  await knex("unread_books").del();
  await knex.raw(
    "SELECT SETVAL ('unread_books_unread_book_id_seq', 1, false);"
  );

  await knex("unread_books").insert(data);
}

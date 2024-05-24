import { Knex } from "knex";
import data from "./03_books.json";

export async function seed(knex: Knex): Promise<void> {
  await knex("books").del();
  await knex.raw("SELECT SETVAL ('books_book_id_seq', 1, false);");



  await knex("books").insert(data);
}

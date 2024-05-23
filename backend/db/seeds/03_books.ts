import { Knex } from "knex";
import data from "./03_books.json";

export async function seed(knex: Knex): Promise<void> {
  await knex("books").del();
  await knex("books_book_id_seq").del;

  await knex("books").insert(data);
}

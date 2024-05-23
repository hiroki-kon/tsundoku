import { Knex } from "knex";
import data from "./06_unreadBook_tags.json";

export async function seed(knex: Knex): Promise<void> {
  await knex("unreadBook_tags").del();

  await knex("unreadBook_tags").insert(data);
}

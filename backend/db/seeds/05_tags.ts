import { Knex } from "knex";
import data from "./05_tags.json";

export async function seed(knex: Knex): Promise<void> {
  await knex("tags").del();
  await knex.raw("SELECT SETVAL ('tags_tag_id_seq', 1, false);");


  await knex("tags").insert(data);
}

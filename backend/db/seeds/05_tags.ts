import { Knex } from "knex";
import data from "./05_tags.json";

export async function seed(knex: Knex): Promise<void> {
  await knex("tags").del();
  await knex("tags_tag_id_seq").del;

  await knex("tags").insert(data);
}

import { Knex } from "knex";
import data from "./01_status.json";

export async function seed(knex: Knex): Promise<void> {
  await knex.raw("TRUNCATE status CASCADE");
  await knex("status_status_id_seq").del;

  await knex("status").insert(data);
}

import { Knex } from "knex";
import data from "./01_status.json";

export async function seed(knex: Knex): Promise<void> {
  await knex.raw("TRUNCATE TABLE status CASCADE");
  await knex.raw("SELECT SETVAL ('status_status_id_seq', 1, false);");
 

  await knex("status").insert(data);
}

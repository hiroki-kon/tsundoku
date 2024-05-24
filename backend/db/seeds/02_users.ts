import { Knex } from "knex";
import data from "./02_users.json";

export async function seed(knex: Knex): Promise<void> {
  await knex.raw("TRUNCATE users CASCADE");

  await knex("users").insert(data);
}

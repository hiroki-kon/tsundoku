import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("unread_books", function (table) {
    table.date("piled_up_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("unread_books", function (table) {
    table.dropColumn("piled_up_at");
  });
}

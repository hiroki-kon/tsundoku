import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("user_id").primary();
      table.text("name");
      table.uuid("subject").unique();
      table.text("email").unique();
      table.string("salt");
      table.string("password");
      table.text("icon_url");
    })
    .createTable("books", function (table) {
      table.increments("book_id").primary();
      table.text("name");
      table.integer("price");
      table.text("author");
      table.text("book_cover_url");
      table.text("store_url");
    })
    .createTable("status", function (table) {
      table.increments("status_id").primary();
      table.text("status");
    })
    .createTable("unread_books", function (table) {
      table.increments("unread_book_id").primary();
      table.integer("user_id");
      table.foreign("user_id").references("users.user_id");
      table.integer("book_id");
      table.foreign("book_id").references("books.book_id");
      table.datetime("created_at");
      table.datetime("updated_at");
      table.integer("status_id");
      table.foreign("status_id").references("status.status_id");
    })
    .createTable("tags", function (table) {
      table.increments("tag_id").primary();
      table.text("tag_name");
      table.integer("user_id");
      table.foreign("user_id").references("users.user_id");
    })
    .createTable("unreadBook_tags", function (table) {
      table.integer("unread_book_id");
      table.integer("tag_id");
      table.primary(["unread_book_id", "tag_id"]);
      table.foreign("unread_book_id").references("unread_books.unread_book_id");
      table.foreign("tag_id").references("tags.tag_id");
    })
    .createTable("reading_plan_books", function (table) {
      table.increments("reading_plan_book_id").primary();
      table.integer("user_id");
      table.foreign("user_id").references("users.user_id");
      table.integer("book_id");
      table.foreign("book_id").references("books.book_id");
      table.datetime("created_at");
      table.datetime("updated_at");
      table.text("memo");
    })
    .createTable("readingPlanBook_tags", function (table) {
      table.integer("reading_plan_book_id");
      table.integer("tag_id");
      table.primary(["reading_plan_book_id", "tag_id"]);
      table
        .foreign("reading_plan_book_id")
        .references("reading_plan_books.reading_plan_book_id");
      table.foreign("tag_id").references("tags.tag_id");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("readingPlanBook_tags")
    .dropTable("unreadBook_tags")
    .dropTable("tags")
    .dropTable("unread_books")
    .dropTable("reading_plan_books")
    .dropTable("books")
    .dropTable("users")
    .dropTable("status");
}

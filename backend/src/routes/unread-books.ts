import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { Methods as UnreadBooksMethod } from "../../../types/generated/api/unread-books";

type UnreadBooksGetMethod = UnreadBooksMethod["get"];

export const unreadBooksRouter = (knex: Knex) => {
  const router = Router({ mergeParams: true });

  router.get(
    "/",
    async (
      req: Request<unknown, unknown, unknown,UnreadBooksGetMethod["query"]>,
      res: Response<UnreadBooksGetMethod["resBody"]>
    ) => {
      const userId = req.query?.userId     ;

      const result = await knex
        .select(
          "books.book_id",
          "books.name",
          "books.price",
          "books.author",
          "books.book_cover_url",
          "books.store_url",
          "status"
        )
        .from("unread_books")
        .join("users", "unread_books.user_id", "=", "users.user_id")
        .join("books", "unread_books.book_id", "=", "books.book_id")
        .join("status", "unread_books.status_id", "=", "status.status_id")
        .where("users.user_id", userId);
      res.send(
        result.map((elem) => ({
          bookId: elem.book_id,
          bookName: elem.name,
          bookPrice: elem.price,
          bookAuthor: elem.author,
          bookCoverUrl: elem.book_cover_url,
          bookStoreUrl: elem.store_url,
          status: elem.status,
        }))
      );
    }
  );

  return router;
};

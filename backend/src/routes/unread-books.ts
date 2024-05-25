import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { Methods as UnreadBooksMethod } from "../../../types/generated/api/unread-books";
import { getDateTImeWithTImezone } from "../util";
interface Book {
  book_id?: number;
  name: string;
  price?: number;
  author?: string;
  book_cover_url?: string;
  store_url?: string;
}

export const unreadBooksRouter = (knex: Knex) => {
  const router = Router({ mergeParams: true });

  router.get(
    "/",
    async (
      req: Request<
        unknown,
        unknown,
        unknown,
        UnreadBooksMethod["get"]["query"]
      >,
      res: Response<UnreadBooksMethod["get"]["resBody"]>
    ) => {
      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }

      const result = await knex
        .select(
          "books.book_id",
          "books.name",
          "books.price",
          "books.author",
          "books.book_cover_url",
          "books.store_url",
          "status",
          "unread_books.piled_up_at"
        )
        .from("unread_books")
        .join("users", "unread_books.user_id", "=", "users.user_id")
        .join("books", "unread_books.book_id", "=", "books.book_id")
        .join("status", "unread_books.status_id", "=", "status.status_id")
        .where("users.user_id", userSub);
      res.send(
        result.map((elem) => ({
          bookId: elem.book_id,
          bookName: elem.name,
          bookPrice: elem.price,
          bookAuthor: elem.author,
          bookCoverUrl: elem.book_cover_url,
          bookStoreUrl: elem.store_url,
          status: elem.status,
          piledUpAt: elem.piled_up_at,
        }))
      );
    }
  );

  router.post(
    "/",
    async (
      req: Request<
        unknown,
        unknown,
        UnreadBooksMethod["post"]["reqBody"],
        unknown
      >,
      res: Response<UnreadBooksMethod["post"]["resBody"]>
    ) => {
      const {
        bookName,
        bookPrice,
        bookAuthor,
        bookCoverUrl,
        bookStoreUrl,
        status,
        piledUpAt,
      } = req.body;

      // TODO:副問い合わせを使えばシンプルにできそう

      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }

      const foundStatus = await knex<{ status_id: number; status: string }>(
        "status"
      )
        .first()
        .where("status", status);
      if (foundStatus === undefined) {
        res.status(500);
      }

      const foundBook = await knex<{ book_id: number }>("books")
        .first()
        .where("name", bookName);

      const insertBook = async (book: Book): Promise<Book[]> => {
        return await knex("books").returning("*").insert({
          name: bookName,
          price: bookPrice,
          author: bookAuthor,
          book_cover_url: bookCoverUrl,
          store_url: bookStoreUrl,
        });
      };

      const bookId =
        foundBook === undefined
          ? (
              await insertBook({
                name: bookName,
                price: bookPrice,
                author: bookAuthor,
                book_cover_url: bookCoverUrl,
                store_url: bookStoreUrl,
              })
            )[0].book_id
          : foundBook.book_id;

      await knex("unread_books").insert({
        user_id: userSub,
        book_id: bookId,
        created_at: getDateTImeWithTImezone(),
        status_id: foundStatus?.status_id,
        piled_up_at: piledUpAt,
      });

      res.status(201).send();
    }
  );

  return router;
};

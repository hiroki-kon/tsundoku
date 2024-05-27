import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { Methods as UnreadBooksMethod } from "../../../types/generated/api/unread-books";
import { Methods as UnreadBookAmountMethod } from "../../../types/generated/api/unread-books/amount";
import { Methods as UnreadBookIdMethods } from "../../../types/generated/api/unread-books/_unreadBookId@number/status";
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
    "/amount",
    async (
      req: Request,
      res: Response<UnreadBookAmountMethod["get"]["resBody"]>
    ) => {
      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }

      const result = await knex("unread_books")
        .column(
          knex.raw(
            "to_char(piled_up_at, 'YYYY/MM') as date, sum(price) as amount"
          )
        )
        .select<{ date: string; amount: string }[]>()
        .join("books", "books.book_id", "unread_books.book_id")
        .where("unread_books.user_id", userSub)
        .groupBy("date")
        .orderBy("date");

      if (result.length === 0) {
        res.send();
        return;
      }

      res.send({
        data: result.map((elem) => ({
          date: elem.date,
          amount: Number(elem.amount),
        })),
        totalAmount: result.reduce((acc, crr) => acc + Number(crr.amount), 0),
        startPeriod: result[0].date,
        endPeriod: result[result.length - 1].date,
      });
    }
  );

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
          knex.raw(
            "unread_books.unread_book_id,books.name,author,books.price,book_cover_url,store_url,status,piled_up_at,array_to_string(array_agg(tag_name),',') as tagIds"
          )
        )
        .from("unread_books")
        .join("users", "unread_books.user_id", "=", "users.user_id")
        .join("books", "unread_books.book_id", "=", "books.book_id")
        .join("status", "unread_books.status_id", "=", "status.status_id")
        .leftOuterJoin(
          "unreadBook_tags",
          "unread_books.unread_book_id",
          "=",
          "unreadBook_tags.unread_book_id"
        )
        .leftOuterJoin("tags", "unreadBook_tags.tag_id", "=", "tags.tag_id")
        .where("users.user_id", userSub)
        .groupBy(
          "unread_books.unread_book_id",
          "books.name",
          "books.price",
          "books.author",
          "books.book_cover_url",
          "books.store_url",
          "status",
          "unread_books.piled_up_at"
        )
        .orderBy("created_at", "desc");

      res.send(
        result.map((elem) => ({
          unreadBookId: elem.unread_book_id,
          bookName: elem.name,
          bookPrice: elem.price,
          bookAuthor: elem.author,
          bookCoverUrl: elem.book_cover_url,
          bookStoreUrl: elem.store_url,
          status: elem.status,
          piledUpAt: elem.piled_up_at,
          tags: elem.tagids === "" ? [] : elem.tagids.split(","),
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
        tagIds,
      } = req.body;

      // TODO:副問い合わせを使えばシンプルにできそう
      // TODO:トランザクション処理にする

      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }

      const foundStatus = await knex<{ status_id: number; status: string }>(
        "status"
      )
        .first()
        .where("status", status);

      console.log(foundStatus);
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

      const unreadBookIDs = await knex("unread_books")
        .insert({
          user_id: userSub,
          book_id: bookId,
          created_at: getDateTImeWithTImezone(),
          status_id: foundStatus?.status_id,
          piled_up_at: piledUpAt,
        })
        .returning<{ unread_book_id: number }[]>("unread_book_id");

      if (tagIds?.length !== 0) {
        await knex("unreadBook_tags").insert(
          tagIds?.map((tag) => ({
            unread_book_id: unreadBookIDs[0].unread_book_id,
            tag_id: tag,
          }))
        );
      }

      res.status(201).send();
    }
  );

  router.delete(
    "/:unreadBookId",
    async (req: Request<{ unreadBookId: number }>, res: Response) => {
      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }
      const unreadBookId = req.params.unreadBookId;

      await knex("unreadBook_tags").where("unread_book_id", unreadBookId).del();

      await knex("unread_books")
        .where("user_id", userSub)
        .andWhere("unread_book_id", unreadBookId)
        .del();

      res.status(204).send();
    }
  );

  router.put(
    "/:unreadBookId/status",
    async (
      req: Request<
        { unreadBookId: number },
        unknown,
        UnreadBookIdMethods["put"]["reqBody"]
      >,
      res: Response
    ) => {
      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }

      await knex("unread_books")
        .update({
          status_id: knex("status")
            .select("status_id")
            .where("status", req.body.status),
        })
        .where("unread_book_id", req.body.unreadBookId);

      res.status(201).send();
    }
  );

  return router;
};

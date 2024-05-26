import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { Methods as TagsMethod } from "../../../types/generated/api/tags";

export const tagsRouter = (knex: Knex) => {
  const router = Router();

  router.get(
    "/",
    async (
      req: Request<never>,
      res: Response<TagsMethod["get"]["resBody"]>
    ) => {
      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }
      const result = await knex.select().from("tags").where("user_id", userSub);
      res.send(
        result?.map((item) => ({ tagId: item.tag_id, tagName: item.tag_name }))
      );
    }
  );

  router.post(
    "/",
    async (
      req: Request<unknown, unknown, TagsMethod["post"]["reqBody"], unknown>,
      res: Response<TagsMethod["post"]["resBody"]>
    ) => {
      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }

      const result = await knex<{
        tag_id: string;
        tag_name: string;
        user_id: string | undefined;
      }>("tags")
        .insert({
          tag_name: req.body.tagName,
          user_id: userSub,
        })
        .returning("*");

      res
        .status(201)
        .send({ tagId: Number(result[0].tag_id), tagName: result[0].tag_name });
    }
  );

  router.delete(
    "/:tagId",
    async (req: Request<{ tagId: string }>, res: Response) => {
      const userSub = req.signInUserSub;
      if (userSub === undefined) {
        res.status(401).send();
      }

      await knex("tags")
        .where("user_id", userSub)
        .andWhere("tag_id", req.params.tagId)
        .del();

      res.status(204).send();
    }
  );

  return router;
};

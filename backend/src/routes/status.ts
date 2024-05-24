import { Router, Request, Response } from "express";
import { Knex } from "knex";
import { Methods as StatusMethod } from "../../../types/generated/api/status";

export const statusRouter = (knex: Knex) => {
  const router = Router();

  router.get(
    "/",
    async (req: Request<never>, res: Response<StatusMethod["get"]["resBody"]>) => {
      const result = await knex.select().from("status");
      res.send(result);
    }
  );

  return router;
};

import Knex from "knex";
import config from "../../db/knexfile";

const environment = process.env.NODE_ENV || "development";
export const knex = Knex(config[environment]);

import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
import { createServer } from "../src/server";
import { knex } from "../src/config/knex";

describe("Test Status Endpoint", () => {
  let request: ChaiHttp.Agent;
  beforeEach(() => {
    const server = createServer();
    request = chai.request(server).keepOpen();
  });
  afterEach(() => {
    request.close();
  });

  before(async () => {
    try {
      await knex("status").insert([
        { status_id: 1, status: "積読" },
        { status_id: 2, status: "読了" },
      ]);
    } catch {
      console.log("already exists");
    }
  });

  describe("GET status", () => {
    it("statusが取得できる", (done) => {
      request.get("/status").end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res.body).to.deep.equal([
            { statusId: 1, status: "積読" },
            { statusId: 2, status: "読了" },
          ]);
        done();
      });
    });
  });
});

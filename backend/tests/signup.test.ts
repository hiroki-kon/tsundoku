import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
import { createServer } from "../src/server";
import { knex } from "../src/config/knex";

describe("Test Signup Endpoint", () => {
  let request: ChaiHttp.Agent;
  beforeEach(() => {
    const server = createServer();
    request = chai.request(server).keepOpen();
  });
  afterEach(() => {
    request.close();
  });

  after(async () => {
    await knex("users").where("email", "test").del();
  });

  describe("POST signup", () => {
    it("アカウント作成するとCookieにtokenが保存される", (done) => {
      request
        .post("/signup")
        .send({ email: "test", name: "test", password: "test" })
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res).to.have.cookie("token");
          done();
        });
    });

    it("すでに存在している場合はエラーを返す(409)", (done) => {
      request
        .post("/signup")
        .send({ email: "test", name: "test", password: "test" })
        .end((err, res) => {
          chai.expect(err).to.be.null;
          chai.expect(res).to.have.status(409);
          done();
        });
    });
  });
});

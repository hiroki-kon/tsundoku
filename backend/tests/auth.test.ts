import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
import { createServer } from "../src/server";
import { knex } from "../src/config/knex";

describe("Test Auth Endpoint", () => {
  let request: ChaiHttp.Agent;
  beforeEach(() => {
    const server = createServer();
    request = chai.request(server).keepOpen();
  });
  afterEach(async () => {
    request.close();
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

    it("すでに存在している場合はエラーを返す(409)", async () => {
      await request
        .post("/signup")
        .send({ email: "test", name: "test", password: "test" });

      const res = await request
        .post("/signup")
        .send({ email: "test", name: "test", password: "test" });
      chai.expect(res).to.have.status(409);
    });
  });

  describe("POST signin", () => {
    it("サインインするとCookieにtokenが保存される", async () => {
      await request
        .post("/signup")
        .send({ email: "test", name: "test", password: "test" });

      const res = await request
        .post("/signin")
        .send({ email: "test", password: "test" });
      chai.expect(res).to.have.cookie("token");
    });

    it("パスワードを間違えるとエラーを返す(401)", async () => {
      await request
        .post("/signup")
        .send({ email: "test", name: "test", password: "test" });

      const res = await request
        .post("/signin")
        .send({ email: "test", password: "hoge" });
      chai.expect(res).to.have.status(401);
    });
  });
});

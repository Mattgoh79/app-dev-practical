import { expect } from "chai";
import sinon from "sinon";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../../prisma/db.js";
import { register, login } from "../../controllers/auth.js";
import { mockReq, mockRes } from "../mocks/user.mock.js";

describe("Auth Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Register
  // -----------------------------------------------------------------------
  describe("register", () => {
    it("returns 201 and does not include a password field when the user is new", async () => {
         const person = {
       id: "abc-123",
       username: "matt",
       role: "ADMIN",
     };

     sinon.stub(prisma, "user").value({
       findUnique: sinon.stub().resolves(null),
       create: sinon.stub().resolves(person),
     });
     sinon.stub(bcryptjs, "genSalt").resolves("salt");
     sinon.stub(bcryptjs, "hash").resolves("hashed password");

     const req = mockReq({
       username: "matt",
       password: "matt321",
       role: "ADMIN",
     });
     const res = mockRes();

     await register(req, res);

     expect(res.status.calledWith(201)).to.be.true;
     expect(res.json.calledOnce).to.be.true;

     const body = res.json.firstCall.args[0];
     expect(body.data.username).to.equal("matt");
    });

    it("returns 409 when the username already exists", async () => {
     const person = {
       id: "abc-123",
       username: "matt",
       role: "ADMIN",
     };

     sinon.stub(prisma, "user").value({
       findUnique: sinon.stub().resolves(person)
     });

     const req = mockReq({
       username: "matt",
       password: "matt321",
       role: "ADMIN",
     });
     const res = mockRes();

     await register(req, res);

     expect(res.status.calledWith(409)).to.be.true;
     expect(res.json.calledOnce).to.be.true;

     const body = res.json.firstCall.args[0];
     expect(body.message).to.equal("User already exists");
        });
  });

  // -----------------------------------------------------------------------
  // Login
  // -----------------------------------------------------------------------
  describe("login", () => {
    it("returns 200 and a token when credentials are valid", async () => {
      const person = {
        id: "abc-123",
        username: "matt",
        password: "hashed password",
        role: "ADMIN",
      };

      sinon.stub(prisma, "user").value({
        findUnique: sinon.stub().resolves(person),
      });
      sinon.stub(bcryptjs, "compare").resolves(true);
      sinon.stub(jwt, "sign").returns("fake-jwt-token");

      const req = mockReq({
        username: "matt",
        password: "matt321",
      });
      const res = mockRes();

      await login(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("User successfully logged in");
      expect(body.token).to.equal("fake-jwt-token");   
    });

    it("returns 401 when the user is not found", async () => {
      sinon.stub(prisma, "user").value({
        findUnique: sinon.stub().resolves(null),
      });

      const req = mockReq({
        username: "ghost",
        password: "whatever123",
      });
      const res = mockRes();

      await login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("Invalid username");    });

    it("returns 401 when the password does not match", async () => {
      const person = {
        id: "abc-123",
        username: "matt",
        password: "hashed password",
        role: "ADMIN",
      };

      sinon.stub(prisma, "user").value({
        findUnique: sinon.stub().resolves(person),
      });
      sinon.stub(bcryptjs, "compare").resolves(false);

      const req = mockReq({
        username: "matt",
        password: "wrongpassword",
      });
      const res = mockRes();

      await login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("Invalid password");
        });
  });
});
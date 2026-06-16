import { expect } from "chai";
import sinon from "sinon";

import * as categoryController from "../../controllers/category.js";
import categoryRepository from "../../repositories/category.js";
import { mockReq, mockRes } from "../mocks/category.mock.js";


describe("Category Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  describe("createCategories", () => {
    it("returns 201 and the new categories when the repository resolves successfully", async () => {
      const created = {
        id: "1111",
        name: "Otago",
      };

      sinon.stub(categoryRepository, "createMany").resolves(created);

      const req = mockReq({
        id: "1111",
        name: "Otago",
      });
      const res = mockRes();

      await categoryController.createCategories(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data.name).to.equal("Otago");    });
  });

  // -----------------------------------------------------------------------
  // Read all
  // -----------------------------------------------------------------------
  describe("getCategories", () => {
    it("returns 200 and an array of categories when categories exist", async () => {
      // Write your test code here
    });

    it("returns 404 when no categories exist", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getCategory", () => {
    it("returns 200 and the category when it is found", async () => {
      // Write your test code here
    });

    it("returns 404 when the category is not found", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteCategory", () => {
    it("returns 200 when the category is found and deleted", async () => {
      // Write your test code here
    });

    it("returns 404 when the category to delete is not found", async () => {
      // Write your test code here
    });
  });
});

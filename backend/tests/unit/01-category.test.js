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
      const categories = [
        {
          id: "abc-123",
          name: "Otago Polytechnic",
        },
        {
          id: "def-456",
          name: "Southern Institute of Technology",
        },
      ];


      sinon.stub(categoryRepository, "findAll").resolves(categories);

      const req = mockReq({}, {}, {});
      const res = mockRes();

      await categoryController.getCategories(req, res);

      expect(res.status.calledWith(200)).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data).to.have.length(2);

    });

    it("returns 404 when no categories exist", async () => {

      sinon.stub(categoryRepository, "findById").resolves(null);


      const req = mockReq({}, {});
      const res = mockRes();

      await categoryController.getCategory(req, res);

      expect(res.status.calledWith(404)).to.be.true;

    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getCategory", () => {
    it("returns 200 and the category when it is found", async () => {
      const category = {
        id: "abc-123",
        name: "Otago Polytechnic",
      };

      sinon.stub(categoryRepository, "findById").resolves(category);

      const req = mockReq({}, { id: "abc-123" });
      const res = mockRes();

      await categoryController.getCategory(req, res);

      expect(res.status.calledWith(200)).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data.id).to.equal("abc-123");
    });

    it("returns 404 when the category is not found", async () => {
      sinon.stub(categoryRepository, "findById").resolves(null);

      const req = mockReq({}, { id: "does-not-exist" });
      const res = mockRes();

      await categoryController.getCategory(req, res);

      expect(res.status.calledWith(404)).to.be.true;    
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteCategory", () => {
    it("returns 200 when the category is found and deleted", async () => {
      const existing = {
        id: "abc-123",
        name: "Otago Polytechnic",
      };

      sinon.stub(categoryRepository, "findById").resolves(existing);
      sinon.stub(categoryRepository, "delete").resolves();

      const req = mockReq({}, { id: "abc-123" });
      const res = mockRes();

      await categoryController.deleteCategory(req, res);

      expect(res.status.calledWith(200)).to.be.true;    
    });

    it("returns 404 when the category to delete is not found", async () => {
      sinon.stub(categoryRepository, "findById").resolves(null);

      const req = mockReq({}, { id: "does-not-exist" });
      const res = mockRes();

      await categoryController.deleteCategory(req, res);

      expect(res.status.calledWith(404)).to.be.true;    
    });
  });
});

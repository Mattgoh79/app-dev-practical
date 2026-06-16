import sinon from "sinon";
import categoryRepository from "../../repositories/category.js";
import { expect } from "chai";

export const mockReq = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

export const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

export const stubSomeRepo = () => ({
  create: sinon.stub(categoryRepository, "create"),
  findAll: sinon.stub(categoryRepository, "findAll"),
  findById: sinon.stub(categoryRepository, "findById"),
  update: sinon.stub(categoryRepository, "update"),
  delete: sinon.stub(categoryRepository, "delete"),
});
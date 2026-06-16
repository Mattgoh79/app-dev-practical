import sinon from "sinon";
import questionRepository from "../../repositories/question.js";
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
  create: sinon.stub(questionRepository, "create"),
  findAll: sinon.stub(questionRepository, "findAll"),
  findById: sinon.stub(questionRepository, "findById"),
  update: sinon.stub(questionRepository, "update"),
  delete: sinon.stub(questionRepository, "delete"),
});
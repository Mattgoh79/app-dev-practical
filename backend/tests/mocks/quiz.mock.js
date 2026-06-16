import sinon from "sinon";
import quizRepository from "../../repositories/quiz.js";
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
  create: sinon.stub(quizRepository, "create"),
  findAll: sinon.stub(quizRepository, "findAll"),
  findById: sinon.stub(quizRepository, "findById"),
  update: sinon.stub(quizRepository, "update"),
  delete: sinon.stub(quizRepository, "delete"),
});
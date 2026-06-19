import sinon from "sinon";
import userRepository from "../../repositories/user.js";
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
  create: sinon.stub(userRepository, "create"),
  findAll: sinon.stub(userRepository, "findAll"),
  findById: sinon.stub(userRepository, "findById"),
  update: sinon.stub(userRepository, "update"),
  delete: sinon.stub(userRepository, "delete"),
});
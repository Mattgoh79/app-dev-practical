import { expect } from "chai";
import sinon from "sinon";

import * as quizController from "../../controllers/quiz.js";
import quizRepository from "../../repositories/quiz.js";
import categoryRepository from "../../repositories/category.js";
import questionRepository from "../../repositories/question.js";
import { mockReq, mockRes } from "../mocks/quiz.mock.js";


describe("Quiz Controller", () => {
  afterEach(() => sinon.restore());

  // -----------------------------------------------------------------------
  // Create
  // -----------------------------------------------------------------------
  describe("createQuiz", () => {
    it("returns 201 and the new quiz when the category exists and the repository resolves successfully", async () => {
      const createdQuiz = { 
        id: 1, 
        title: "quiz", 
        categoryId: 31312 
      };
      const quizWithQuestions = {
        id: 1,
        title: "quiz",
        categoryId: 31312,
        questions: [{ id: 1, text: "question" }],
      };

      sinon.stub(categoryRepository, "findById").resolves({ id: 31312, name: "Otago" });


      sinon.stub(global, "fetch").resolves({
        json: async () => ({
          results: Array.from({ length: 10 }, () => ({
            question: "Sample question?",
            correct_answer: "Correct",
            incorrect_answers: ["Wrong1", "Wrong2", "Wrong3"],
          })),
        }),
      });

      sinon.stub(quizRepository, "create").resolves(createdQuiz);
      sinon.stub(questionRepository, "createMany").resolves();
      sinon.stub(quizRepository, "findById").resolves(quizWithQuestions);

      const req = mockReq({
        title: "quiz",
        categoryId: "31312",
      });
      const res = mockRes();

      await quizController.createQuiz(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data.title).to.equal("quiz");
    });

    it("returns 404 when the specified category does not exist", async () => {
      sinon.stub(categoryRepository, "findById").resolves(null);

      const req = mockReq({
        title: "quiz",
        categoryId: "31312",
      });
      const res = mockRes();

      await quizController.createQuiz(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("No category with the id: 31312 found");
    });
  });

  // -----------------------------------------------------------------------
  // Read all
  // -----------------------------------------------------------------------
  describe("getQuizzes", () => {
    it("returns 200 and an array of quizzes when quizzes exist", async () => {
      const quizzes = [
        { id: 1, title: "quiz one", categoryId: 31312 },
        { id: 2, title: "quiz two", categoryId: 31313 },
      ];

      sinon.stub(quizRepository, "findAll").resolves(quizzes);

      const req = mockReq();
      const res = mockRes();

      await quizController.getQuizzes(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data).to.deep.equal(quizzes);
    });

    it("returns 404 when no quizzes exist", async () => {
      sinon.stub(quizRepository, "findAll").resolves([]);

      const req = mockReq();
      const res = mockRes();

      await quizController.getQuizzes(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("No quizzes found");
    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getQuiz", () => {
    it("returns 200 and the quiz when it is found", async () => {
      const quiz = { id: 1, title: "quiz", categoryId: 31312 };

      sinon.stub(quizRepository, "findById").resolves(quiz);

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await quizController.getQuiz(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.data).to.deep.equal(quiz);
    });

    it("returns 404 when the quiz is not found", async () => {
      sinon.stub(quizRepository, "findById").resolves(null);

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await quizController.getQuiz(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("No quiz with the id: 1 found");
    });
  });

  // -----------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------
  describe("updateQuiz", () => {
    it("returns 200 and the updated quiz when the quiz exists", async () => {
      const existingQuiz = { id: 1, title: "old", categoryId: 31312 };
      const updatedQuiz = { id: 1, title: "new", categoryId: 31312 };

      sinon.stub(quizRepository, "findById").resolves(existingQuiz);
      sinon.stub(quizRepository, "update").resolves(updatedQuiz);

      const req = mockReq({ title: "new title" }, { id: "1" });
      const res = mockRes();

      await quizController.updateQuiz(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("Quiz with the id: 1 successfully updated");
      expect(body.data).to.deep.equal(updatedQuiz);
    });

    it("returns 404 when the quiz to update is not found", async () => {
      sinon.stub(quizRepository, "findById").resolves(null);

      const req = mockReq({ title: "new title" }, { id: "1" });
      const res = mockRes();

      await quizController.updateQuiz(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("No quiz with the id: 1 found");
    });

    it("returns 400 when the new title matches the current title", async () => {
      const existingQuiz = { id: 1, title: "same title", categoryId: 31312 };

      sinon.stub(quizRepository, "findById").resolves(existingQuiz);
      const updateStub = sinon.stub(quizRepository, "update");

      const req = mockReq({ title: "same title" }, { id: "1" });
      const res = mockRes();

      await quizController.updateQuiz(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(updateStub.called).to.be.false;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("New title must be different from the current title");
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteQuiz", () => {
    it("returns 200 when the quiz is found and deleted", async () => {
      const existingQuiz = { id: 1, title: "quiz", categoryId: 31312 };

      sinon.stub(quizRepository, "findById").resolves(existingQuiz);
      const deleteStub = sinon.stub(quizRepository, "delete").resolves();

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await quizController.deleteQuiz(req, res);

      expect(deleteStub.calledWith(1)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("Quiz with the id: 1 successfully deleted");
    });

    it("returns 404 when the quiz to delete is not found", async () => {
      sinon.stub(quizRepository, "findById").resolves(null);

      const req = mockReq({}, { id: "1" });
      const res = mockRes();

      await quizController.deleteQuiz(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      const body = res.json.firstCall.args[0];
      expect(body.message).to.equal("No quiz with the id: 1 found");
    });
  });
});
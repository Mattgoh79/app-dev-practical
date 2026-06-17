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
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Read all
  // -----------------------------------------------------------------------
  describe("getQuizzes", () => {
    it("returns 200 and an array of quizzes when quizzes exist", async () => {
      // Write your test code here
    });

    it("returns 404 when no quizzes exist", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Read by ID
  // -----------------------------------------------------------------------
  describe("getQuiz", () => {
    it("returns 200 and the quiz when it is found", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz is not found", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------
  describe("updateQuiz", () => {
    it("returns 200 and the updated quiz when the quiz exists", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz to update is not found", async () => {
      // Write your test code here
    });
  });

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------
  describe("deleteQuiz", () => {
    it("returns 200 when the quiz is found and deleted", async () => {
      // Write your test code here
    });

    it("returns 404 when the quiz to delete is not found", async () => {
      // Write your test code here
    });
  });
});

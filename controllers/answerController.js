const client = require("../database");

const allAnswers = async (req, res) => {
  try {
    const insertQuery = `
            SELECT * FROM Answers
        `;

    const result = await client.query(insertQuery);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error getting answers:", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const byQuestion = async (req, res) => {
  try {
    const questions = req.body.questions.map((id) => parseInt(id));
    const placeholders = questions
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const selectQuery = `
            SELECT * FROM Answers
            WHERE question_id IN (${placeholders})
        `;

    const result = await client.query(selectQuery, questions);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error getting answers:", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const createQuestionWithAnswers = async (req, res) => {
  try {
    const allQsAndAs = req.body;

    allQsAndAs.map(async (QAndAs) => {
      const { question, category, explanation, answers } = QAndAs;

      const insertQuestionQuery = `
        INSERT INTO Questions (question, category, explanation) 
        VALUES ($1, $2, $3) 
        RETURNING id
      `;
      const questionValues = [question, category, explanation];
      const questionResult = await client.query(insertQuestionQuery, questionValues);
      const questionId = questionResult.rows[0].id;

      for (const answerData of answers) {
        const { answer, is_correct, points } = answerData;

        const insertAnswerQuery = `
          INSERT INTO Answers (answer, question_id, is_correct, points) 
          VALUES ($1, $2, $3, $4)
        `;
        const answerValues = [answer, questionId, is_correct, points];
        await client.query(insertAnswerQuery, answerValues);
      }
    });

    res.status(201).json({
      success: true,
      message: "Question and answers created successfully",
    });
  } catch (error) {
    console.error("Error creating question with answers:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

  

module.exports = {
  allAnswers,
  byQuestion,
  createQuestionWithAnswers,
};

const questions = require('./seedData');

// Inserts the starter questions when the Questions table is empty.
const seedQuestions = async (client) => {
  const { rows } = await client.query('SELECT COUNT(*) FROM Questions');
  if (parseInt(rows[0].count) > 0) return;

  for (const { question, category, explanation, answers } of questions) {
    const questionResult = await client.query(
      'INSERT INTO Questions (question, category, explanation) VALUES ($1, $2, $3) RETURNING id',
      [question, category, explanation]
    );
    const questionId = questionResult.rows[0].id;

    for (const { answer, is_correct, points } of answers) {
      await client.query(
        'INSERT INTO Answers (answer, question_id, is_correct, points) VALUES ($1, $2, $3, $4)',
        [answer, questionId, is_correct, points]
      );
    }
  }
  console.log(`Seeded ${questions.length} questions`);
};

module.exports = seedQuestions;

const createUserTable = `
CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password VARCHAR(100) NULL,
  level INTEGER DEFAULT 1,
  progress INTEGER DEFAULT 0
)
`;
const createQuestionTable = `
CREATE TABLE IF NOT EXISTS Questions (
  id SERIAL PRIMARY KEY,
  question VARCHAR(250) NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const createAnswerTable = `
CREATE TABLE IF NOT EXISTS Answers (
  id SERIAL PRIMARY KEY,
  answer VARCHAR(250) NOT NULL,
  question_id INTEGER REFERENCES Questions(id),
  is_correct BOOLEAN,
  points NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;


module.exports = {
    createUserTable, 
    createQuestionTable,
    createAnswerTable
}
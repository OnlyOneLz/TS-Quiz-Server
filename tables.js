const createUserTable = `
CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password VARCHAR(100) NULL
)
`;
const createHelloQuery = `
CREATE TABLE IF NOT EXISTS Goodbye (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password VARCHAR(100) NULL
)
`;



module.exports = {
    createUserTable, 
    createHelloQuery
}
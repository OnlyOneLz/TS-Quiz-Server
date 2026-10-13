const { Client } = require('pg');
const { createUserTable, createQuestionTable, createAnswerTable, createScoreboardTable } = require('./tables');
const seedQuestions = require('./seed');
require('dotenv').config();

// Connection details come from the environment (DATABASE_URL on Railway,
// or the standard PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT variables locally).
const client = new Client(
  process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {}
);

client.connect()
  .then(() => {
    console.log('Connected to the database');

    // Tables reference each other, so create them in order
    return client.query(createUserTable)
      .then(() => client.query(createQuestionTable))
      .then(() => client.query(createAnswerTable))
      .then(() => client.query(createScoreboardTable));
  })
  .then(() => {
    console.log('Tables created successfully');
    return seedQuestions(client);
  })
  .catch((err) => {
    console.error('Error creating tables:', err);
  });

module.exports = client;

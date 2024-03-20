const { Client } = require('pg');
const { createUserTable, createQuestionTable, createAnswerTable } = require('./tables');

const dbConfig = {
  user: 'postgres',
  host: 'monorail.proxy.rlwy.net',
  database: 'railway',
  password: 'SsOEKWqkEnvsfCtdvvUgnUcWzBZQBqoV', 
  port: 59815, 
};

const client = new Client(dbConfig);

client.connect()
  .then(() => {
    console.log('Connected to the database');
    
    // Execute the queries
    return Promise.all([
      client.query(createUserTable),
      client.query(createQuestionTable),
      client.query(createAnswerTable)
    ]);
  })
  .then(() => {
    console.log('Tables created successfully');
  })
  .catch((err) => {
    console.error('Error creating tables:', err);
  });

module.exports = client;

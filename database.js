const { Client } = require('pg');

const dbConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD, 
  port: process.env.PGPORT, 
};

const client = new Client(dbConfig);

client.connect()
  .then(() => {
    console.log('Connected to the database');
    
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      password VARCHAR(100) NULL
    )
  `;
    
    return client.query(createTableQuery);
  })
//   .then((result) => {
//     console.log('Table created successfully');
//   })
  .catch((err) => {
    console.error('Error creating table:', err);
  });

  module.exports = client 
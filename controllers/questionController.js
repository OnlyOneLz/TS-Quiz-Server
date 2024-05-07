const client = require("../database");

const allQuestions = async (req, res) => {
  try {
    const insertQuery = `
            SELECT * FROM Questions
        `;

    const result = await client.query(insertQuery);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const byCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const insertQuery = `
            SELECT * FROM Questions
            WHERE category = $1
            ORDER BY RANDOM()
            LIMIT 10
        `;

    const result = await client.query(insertQuery, [category]);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

const randomQuestions = async (req, res) => {
  try {
    let insertQuery;

    insertQuery = `
                SELECT * FROM Questions
                ORDER BY RANDOM()
                LIMIT 10
            `;
    const result = await client.query(insertQuery);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};

module.exports = {
  allQuestions,
  byCategory,
  randomQuestions,
};

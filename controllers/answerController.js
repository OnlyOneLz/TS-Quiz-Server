const client = require('../database');

const allAnswers = async (req, res) => {
    try {
        const insertQuery = `
            SELECT * FROM Answers
        `;
        
        const result = await client.query(insertQuery)
        res.status(200).json({ success: true, data: result.rows })
    } catch (error) {
        console.error("Error getting answers:", error)
        res.status(500).json({  success: false, error: 'internal server error'})
    }
}

const byQuestion = async (req, res) => {
    try {
        const question = req.params.question

        const insertQuery = `
            SELECT * FROM Answers
            WHERE question_id = $1
        `;
        
        const result = await client.query(insertQuery, [question])
        res.status(200).json({ success: true, data: result.rows })
    } catch (error) {
        console.error("Error getting answers:", error)
        res.status(500).json({  success: false, error: 'internal server error'})
    }
}

module.exports = {
    allAnswers,
    byQuestion
};
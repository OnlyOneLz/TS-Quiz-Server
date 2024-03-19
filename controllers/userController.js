const client = require('../database');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
      INSERT INTO Users (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
        const values = [username, email, hashedPassword];

        const result = await client.query(insertQuery, values);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const allUsers = async (req, res) => {
    try {
        const insertQuery = `
            SELECT * FROM Users
    `;
        const result = await client.query(insertQuery);
        res.status(200).json({ success: true, data: result.rows});
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const selectQuery = `
             SELECT * FROM Users
             WHERE username = $1 OR email = $1
    `;
        const userQueryResult = await client.query(selectQuery, [username]);

        if (userQueryResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const user = userQueryResult.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Invalid password' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const username = req.body.username;

        const deleteQuery = `
            DELETE FROM Users
            WHERE username = $1 OR email = $1
      `;
        const userQueryResult = await client.query(deleteQuery, [username]);
        if (userQueryResult) {
            res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

module.exports = {
    createUser,
    loginUser,
    deleteUser,
    allUsers
};
const client = require('../database');

const scoreboard = async (req, res, bool) => {
    try {
        const selectQuery = `
            SELECT * FROM Scoreboard
            ORDER BY score DESC
            LIMIT 3
        `;

        const result = await client.query(selectQuery);
        if (bool) {
            res.status(200).json({ success: true, data: result.rows });
        } else {
        return result.rows
        }
    } catch (error) {
        console.error("Error getting scoreboard:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const checkUserIds = (userId, userScores) => {

    try {
        for (let i = 0; i < userScores.length; i++) {
            if (userScores[i].user_id === userId) {
                return userId;
            }
        }
        return null;
    } catch (error) {
        console.error("Error checking user IDs:", error);
        return null;
    }
}

const deleteUserScore = async (userId) => {
    try {
        const deleteQuery = `
            DELETE FROM Scoreboard
            WHERE user_id = $1
        `;
        await client.query(deleteQuery, [userId]);
    } catch (error) {
        console.error("Error deleting user score:", error);
    }
}

const addUserScore = async (req, res) => {
    try {
        const userId = req.body.userId
        const userScore = req.body.userScore;
        const userScores = await scoreboard(req, res, false);
        const alreadyOnScoreboard = checkUserIds(userId, userScores);
        if (!alreadyOnScoreboard) {
            if (userScores.length > 2) {
                if (userScores[2].score > userScore) {
                    return res.status(200).json({ success: true, message: "User score not high enough for scoreboard" });
                } else {
                    await deleteUserScore(userScores[2].user_id);
                    const insertQuery = `
                    INSERT INTO Scoreboard(user_id, score)
                    VALUES ($1, $2)
                `;
                    await client.query(insertQuery, [userId, userScore]);
                }
            } else {
                const insertQuery = `
                    INSERT INTO Scoreboard(user_id, score)
                    VALUES ($1, $2)
                `;
                    await client.query(insertQuery, [userId, userScore]);
            }
        } else {
            const updateQuery = `
                UPDATE Scoreboard
                SET score = $1
                WHERE user_id = $2
            `;
            const values = [userScore, userId];
            await client.query(updateQuery, values);
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error adding user score:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    scoreboard,
    addUserScore
};

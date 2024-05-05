const client = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    console.log(result);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const allUsers = async (req, res) => {
  try {
    const insertQuery = `
            SELECT * FROM Users
    `;
    const result = await client.query(insertQuery);
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ success: true, data: result.rows, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
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
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = userQueryResult.rows[0];
    const token = jwt.sign({ userId: user.id }, "your-secret-key", {
      expiresIn: "1h",
    });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    const previousProgressNeeded = calculateProgressNeeded(user.level - 1);
    const progressNeeded = calculateProgressNeeded(user.level);

    res
      .status(200)
      .json({
        success: true,
        data: [
          { user: user },
          { previousProgressNeeded: previousProgressNeeded },
          { progressNeeded: progressNeeded },
        ],
        token,
      });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
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
    console.error("Error authenticating user:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const calculateProgressNeeded = (currentLevel) => {
  return Math.floor(100 * Math.pow(currentLevel, 2)) / 2;
};

const addProgress = async (req, res) => {
  try {
    const points = Number(req.body.userScore);
    const userId = req.body.userId;
    console.log(points);
    console.log(userId);

    const getUserQuery = `
            SELECT progress, level
            FROM Users
            WHERE id = $1
        `;

    const userResult = await client.query(getUserQuery, [userId]);
    const currentProgress = userResult.rows[0].progress;
    const currentLevel = userResult.rows[0].level;
    console.log("Current progress:", currentProgress);
    console.log("Current level:", currentLevel);

    const newProgress = currentProgress + points;
    console.log("New Progress:", newProgress);

    const progressNeededForNextLevel = calculateProgressNeeded(currentLevel);
    console.log(progressNeededForNextLevel);

    let newLevel = null;

    // Chec if new progress exceeeds progress needeed to level up
    if (newProgress >= progressNeededForNextLevel) {
      // Increment the user's level
      newLevel = currentLevel + 1;

      const updateLevelQuery = `
                UPDATE Users
                SET level = $1
                WHERE id = $2
                `;

      await client.query(updateLevelQuery, [newLevel, userId]);
      console.log("Level increased to:", newLevel);
    }

    const updateProgressQuery = `
            UPDATE Users
            SET progress = $1
            WHERE id = $2
        `;
    const previousProgressNeeded = calculateProgressNeeded(
      newLevel ? currentLevel : currentLevel - 1
    );
    const progressNeeded = calculateProgressNeeded(
      newLevel ? newLevel : currentLevel
    );
    await client.query(updateProgressQuery, [newProgress, userId]);
    res
      .status(200)
      .json({
        success: true,
        message: "Progress updated successfully",
        data: [
          { progressNeeded: progressNeeded },
          { previousProgressNeeded: previousProgressNeeded },
          { level: newLevel ? newLevel : currentLevel },
        ],
      });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const userInfo = async (req, res) => {
  try {
    const userId = req.params.userId;

    const getUserQuery = `
            SELECT progress, level
            FROM users
            WHERE id = $1
        `;

    const userResult = await client.query(getUserQuery, [userId]);
    const currentProgress = userResult.rows[0].progress;
    const currentLevel = userResult.rows[0].level;
    console.log("Current level:", currentLevel);
    console.log("Current progress:", currentProgress);

    const progressNeededForNextLevel = calculateProgressNeeded(currentLevel);
    const progressRemaining = progressNeededForNextLevel - currentProgress;
    console.log("Progress left:", progressRemaining);

    res
      .status(200)
      .json({ success: true, message: "User info obtained successfully" });
  } catch (error) {
    console.error("Error getting user info:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const getLeaderboardQuery = `
            SELECT *
            FROM Users
            ORDER BY progress DESC
            LIMIT 10
        `;

    const leaderboard = await client.query(getLeaderboardQuery);
    const data = leaderboard.rows;
    for (i = 0; i < data.length; i++) {
      console.log("User: ", data[i].username);
      console.log("Level: ", data[i].level);
      console.log("Progress: ", data[i].progress);
    }

    res
      .status(200)
      .json({ success: true, message: "Leaderboard obtained successfully" });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getOneUser = async (req, res) => {
  try {
    const getLeaderboardQuery = `
            SELECT *
            FROM Users
            WHERE id = $1
        `;
    const userQueryResult = await client.query(getLeaderboardQuery, [
      req.params.id,
    ]);

    if (userQueryResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = userQueryResult.rows[0];
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  deleteUser,
  allUsers,
  addProgress,
  userInfo,
  getLeaderboard,
  getOneUser,
};

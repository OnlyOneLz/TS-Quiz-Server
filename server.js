const express = require("express")
const cors = require("cors")
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes')
const answerRoutes = require('./routes/answerRoutes')
const scoreboardRoutes = require('./routes/scoreboardRoutes')
require('dotenv').config();

const app = express()

app.use(express.json())
app.use(cors())

app.use('/user', userRoutes);
app.use('/question', questionRoutes);
app.use('/answer', answerRoutes);
app.use('/scoreboard', scoreboardRoutes);

app.listen(4001, () => console.log("Server listening on port 4001"))
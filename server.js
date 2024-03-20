const express = require("express")
const cors = require("cors")
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes')
const answerRoutes = require('./routes/answerRoutes')
require('dotenv').config();

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api', userRoutes);
app.use('/question', questionRoutes);
app.use('/answer', answerRoutes);

app.listen(4001, () => console.log("Server listening on port 4001"))

const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

app.get("/addUser", (req, res) => {
    console.log(req.body)
    res.send("Response recieved: " + req.body)

})

app.listen(4001, () => console.log("Server listening on port 4000"))
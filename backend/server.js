const express = require ("express")
const app = express()
const cors = require("cors")

require("dotenv").config()
app.use(express.json())
app.use(cors())



const apiRoute = require("./router/apiroute")

app.use('/api', apiRoute)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

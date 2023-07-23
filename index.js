const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// Midleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('College is open')
})

app.listen(port, () => {
    console.log(`college is open in port : ${port}`);
})
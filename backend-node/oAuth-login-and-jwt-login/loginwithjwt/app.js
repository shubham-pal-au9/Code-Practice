const express = require('express');
const app = express();
const db = require('./db');
const port = 5000;
const cors = require('cors');
app.use(cors());

const AutController = require('./controller/authController');
app.use('/api/auth',AutController)

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})
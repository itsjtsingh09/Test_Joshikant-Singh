const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());




// Connect to MongoDB
mongoose.connect(process.env.DATABASEURL).then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port " + process.env.PORT);
    });
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

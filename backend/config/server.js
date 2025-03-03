const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const http = require('http');
const dotenv = require('dotenv').config();

const { connectDB } = require('./db.js');

// Environment variables
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.ENVIRONMENT || '';
process.env.TZ = "America/Mexico_City";

// Connection to database
connectDB();

// Server configuration
let app = express();
let server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true
}));

// Routes files
let auth = require('../routes/auth');
let home = require('../routes/home');

// Routes web
app.get('/', (req, res) => res.send(`API${ENVIRONMENT} de Fitco - Team`));
app.use('/auth', auth);
app.use('/home', home);

// Server init
server.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});
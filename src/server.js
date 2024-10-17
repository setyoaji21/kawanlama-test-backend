const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();
let corsOptions = {
    origin: [ 'http://localhost:3000' ],
    optionsSuccessStatus: 200
};
  
// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define Routes
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/me', require('./routes/users'));

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

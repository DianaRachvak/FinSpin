const nodemon = require('nodemon');
const path = require('path');
const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req,res) => res.send('API Running'));

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/expenses', require('./routes/api/expenses'));
app.use('/api/income', require('./routes/api/income'));
app.use('/api/savings', require('./routes/api/savings'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

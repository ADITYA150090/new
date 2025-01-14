const express = require('express');
const userRoutes = require('./routes/user.routes');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser')

const connectToDB = require('./config/db');
const indexRouter = require('./routes/index.routes')


connectToDB();

const app = express();

app.set('view engine', 'ejs');
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


app.use('/', indexRouter);

app.use('/user', userRoutes);



app.listen(3000)
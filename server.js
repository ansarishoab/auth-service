const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
const app = express();
connectDB()

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

const port = process.env.PORT || 5000;
app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})
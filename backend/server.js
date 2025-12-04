const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employee');


const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/hrdb';
mongoose.connect(mongoUri, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log('mongo connected'))
.catch(err=>console.error('mongo err',err));


app.use('/employees', employeeRoutes);


const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('server running on', port));

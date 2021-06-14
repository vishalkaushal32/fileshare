const exp = require('constants');
const express = require('express')
const app = express();
const path = require('path')

const cors=require('cors');
//cors

const corsOptions = {
    // origin:process.env.ALLOWED_CLIENTS.split(',')
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204

};
app.use(cors(corsOptions));

const connectDb= require('./config/db')
connectDb();

app.use(express.static('public'))
app.use(express.json())
//template engine
app.set('views', path.join(__dirname,'/views'));
app.set('view engine','ejs');

//routes
app.use("/api/files", require('./routes/files'));
app.use("/files", require('./routes/show'));
app.use("/files/download", require('./routes/download'));


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("running on port", PORT);
})
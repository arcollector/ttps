const express = require('express');
const pdfroute = require('./routes/pdf');

const corsHeaders= require('./middleware/cors');


const app=express();

app.options("*", corsHeaders);
app.use(corsHeaders);

app.use(express.json());

app.use("/api/pdf", pdfroute);

app.listen(8080, ()=>console.log("server is runnning"));

module.export = app;
const express = require('express');
const pdfroute = require('./routes/pdf');
const pdfroute2 = require('./routes/pdf2');


const corsHeaders= require('./middleware/cors');


const app=express();

app.options("*", corsHeaders);
app.use(corsHeaders);

app.use(express.json());
app.use("/pdf", pdfroute2);

app.use("/api/pdf", pdfroute);

app.listen(8080, ()=>console.log("server is runnning"));

module.export = app;
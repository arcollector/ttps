const cors= require("cors");


const whiteList= new Set("http://localhost:3000/")

const corsOptions= {
    optionsSuccessStatus: 200,
    origin: true,
    credentials:true

}

module.exports= cors(corsOptions);
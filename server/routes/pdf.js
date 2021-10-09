const router =require("express").Router();

const pdfCtrol= require('../controllers/pdfController');


router.get("/", async(req,res)=>{
    res.json({message:'Hello world'})
})

router.get("/getpdf", async(req,res)=>{
    console.log(req.query.webURL);
    console.log(req.query.paciente);
    console.log("estoy en el servidor!!!")
    try{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Vary", "Origin");
        pdfCtrol.createPDF(req,res);
    }catch(error){
        console.log(error);
    }
})

module.exports=router;



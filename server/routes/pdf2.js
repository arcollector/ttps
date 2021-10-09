


var ReactDOMServer = require('react-dom/server');
var React= require('react');
const router =require("express").Router();
const pdfCtrol= require('../controllers/pdfController');





router.get("/informe", async(req,res)=>{
    let usuario= req.query.usuario;
    console.log('llego el paciente por header');
    console.log(req.headers.paciente);
    let paciente=req.headers.paciente;
    console.log(usuario);
    console.log(paciente);
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    console.log('Entre al informe pdf!');

    


    res.send(`
        
        
        <h1>Datos del paciente: ${usuario}</h1>
        
        
    
    
    
    `
    );
    
    
   
})

module.exports=router;
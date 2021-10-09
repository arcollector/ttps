const puppeteer= require('puppeteer');

//const webURL="https://www.promiedos.com.ar/"; 

const optionsPDF="";


async function puppeteerPDF(webURL, optionsPDF){
    const browser= await puppeteer.launch({
        headless:true,
        args:['--no-sandbox', '--disable-setupid-sandbox']
    })

    const coverpage= await browser.newPage();
    await coverpage.goto(webURL, {waitUntil:'domcontentloaded'});

    const pdfBuffer=await coverpage.pdf({
        printBackground:true,
        width:optionsPDF.width,
        height:optionsPDF.height
    });
    return pdfBuffer;
}


async function createPDF(req,res){
    console.log(req.query.webURL);
    const webURL= req.query.webURL;
    await puppeteerPDF(webURL, optionsPDF).then(pdfData=>{
        res.set('Content-Type', 'application/pdf');
        res.status(201).send(Buffer.from(pdfData,'binary'));
    }).catch((error)=>{
        console.log('error');
    })
}

module.exports = {createPDF:createPDF};
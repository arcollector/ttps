const puppeteer= require('puppeteer');



const optionsPDF="";


async function puppeteerPDF(webURL, optionsPDF, paciente){
    const browser= await puppeteer.launch({
        headless:true,
        args:['--no-sandbox', '--disable-setupid-sandbox']
    })

    const coverpage= await browser.newPage();
    await coverpage.setExtraHTTPHeaders(
        {'paciente': paciente},
      );
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
    const paciente=req.query.paciente;
    await puppeteerPDF(webURL, optionsPDF, paciente).then(pdfData=>{
        res.set('Content-Type', 'application/pdf');
        res.status(201).send(Buffer.from(pdfData,'binary'));
    }).catch((error)=>{
        console.log('error');
    })
}

module.exports = {createPDF:createPDF};
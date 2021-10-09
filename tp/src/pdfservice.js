import http from './httpservices';

const apiURL=`http://localhost:8080/api/pdf/getpdf`;

const pdfService={
    downloadPDF:function(webURL){
        console.log(webURL);
        
        return http.get(apiURL,{
            responseType:'blob',
            params: { webURL: webURL },
            headers:{
                'Accept':'application/pdf',
                
            }
        })
    }
}

export default pdfService;
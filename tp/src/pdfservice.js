import http from './httpservices';

const apiURL=`http://localhost:8080/api/pdf/getpdf`;

const pdfService={
    downloadPDF:function(webURL,paciente){
        console.log(webURL);
        console.log(paciente);
        return http.get(apiURL,{
            responseType:'blob',
            params: { webURL: webURL, paciente:paciente },
            headers:{
                'Accept':'application/pdf',
                
            }
        })
    }
}

export default pdfService;
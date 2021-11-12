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
    },

    sendUsingSendgrid(to, subject, content) {
        const apiUrl = 'http://localhost:8080/pdf/enviar-email';
        http.post(
            apiUrl,
            {to, subject, content}
        );
    },
}

export default pdfService;
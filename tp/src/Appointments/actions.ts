import {toast} from 'react-toastify';

import { db } from '../shared/utils/Firebase';

export const searchPatientByDni = (dniToSearch: string) => {
  let pacienteBuscado: any[] =[];
  const refDoc = db
    .collection('patients')
    .where("dni","==",dniToSearch);
  return refDoc
    .get()
    .then((doc) => {
      if(!doc.empty){
        pacienteBuscado.push(doc.docs[0].data());
        pacienteBuscado[0].id=doc.docs[0].id;
        return Promise.resolve(pacienteBuscado[0]);
      }
      toast.warning("El paciente que ingreso no existe");
      return Promise.resolve(null);
    });
};

export const getPatientMedixExams = (patientId: string) => {
  const refMedicExams = db
    .collection("medicExams")
    .where("idPatient","==",patientId);
  return refMedicExams
    .get()
    .then(doc=>{
      let arrayExams: any[] =[]; 
      if(!doc.empty){
        doc.docs.forEach((docActual)=>{
          const data=docActual.data();
          data.id=docActual.id;
          arrayExams.push(data);
        })
        return Promise.resolve(arrayExams);
      }
    });
};

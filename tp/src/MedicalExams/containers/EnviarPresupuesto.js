import React from 'react';
import {toast} from 'react-toastify';
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { sendEmail } from '../../shared/helpers/emailSender';
import saveState from '../../shared/helpers/saveState';

const db= firebase.firestore(firebase);

export default function EnviarPresupuesto(props) {

   
    const {exam, user, setReloading}= props;

    var storage = firebase.storage();
    


    const handlerClick=()=>{
        

        storage.ref(`presupuestosPdf/${exam.id}.pdf`).getDownloadURL().then(url=>{
            
            const html=`<p>Acceda a esta direccion para descargar el presupuesto de su estudio medico ${url}</p>`;

            sendEmail('grupo11unlp@gmail.com', 'Presupuesto del estudio medico', html);

            
        })

        saveState("esperandoComprobante", user.displayName, exam.id).then(idState=>{
            console.log(exam.id);
            var refMedicExam = db.collection('medicExams').doc(exam.id);
            refMedicExam.update({
                idState:idState
            }).then(() => {
                setReloading((v) => !v);
                toast.success("El presupuesto fue enviado");
            });
        });

        

    }


    return (
        <button onClick={handlerClick} className="ui button">Enviar Presupuesto</button>
    )
}

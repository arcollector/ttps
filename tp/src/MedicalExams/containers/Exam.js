import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom';

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import '../styles/Exam.scss';

const db= firebase.firestore(firebase);




export default function Exam() {

    const { id : examId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [exam, setExam] = useState(null);
    const [patient, setPatient] = useState(null);
    const [state, setState] = useState(null);
    const[historial, setHistorial]=useState(null);
    
    useEffect(() => {

        let examen;
        let medico;
        let paciente;
        let estado;
        let estados=[];

        var refMedicExam = db.collection('medicExams').doc(examId);
        refMedicExam.get().then(doc=>{
            examen=(doc.data());
            examen.id=doc.id;
            setExam(examen);
            var refMedic= db.collection('doctors').doc(examen.idMedic);
            refMedic.get().then(doc=>{
                medico=(doc.data());
                setDoctor(medico);
            });
            var refPatient= db.collection('patients').doc(examen.idPatient);
            refPatient.get().then(doc=>{
                paciente=(doc.data());
                setPatient(paciente);
            });
            var refState= db.collection('states').doc(examen.idState);
            refState.get().then(doc=>{
                estado=(doc.data());
                setState(estado);
            });
            const refDocs= db.collection('states').where("idMedicExam","==",examen.id);
            refDocs.get().then(result=>{
                
                result.docs.map(doc=>{
                    estados[doc.data().name]=doc.data();
                    estados[doc.data().name].id=doc.id;
                    return{}
                })
                
                
            });
            setHistorial(estados);
        });
        
        

        return () => {
            
        }
    }, [])



console.log(historial);


    return (
        <div className="content-exam">
        {exam &&
                
                    <><h2>Datos del Paciente</h2>
                        
                        <p><strong>Nombre y Apellido:</strong><i> {patient?.nombre} {patient?.apellido} </i></p>
                        <p><strong>Dni:</strong><i> {patient?.dni} </i></p>
                        <p><strong>Telefono:</strong><i> {patient?.telefono} </i></p>
                        <p><strong>Email:</strong><i> {patient?.email} </i></p>
                        
                     <h2>Datos del estudio:</h2>
                        <p><strong>Medico derivante: </strong><i> {doctor?.nombre} {doctor?.apellido} </i></p>
                        <p><strong>Examen medico a realizar: </strong><i>{exam?.examSelected} </i></p>
                        <p><strong>Estado actual del estudio: </strong><i>{state?.name} </i></p>

                    <h2>Historial:</h2> 
                    {historial&&<><h5>Envio de presupuesto</h5><p><strong>Realizado por:</strong> {historial["enviarPresupuesto"]?.employee} <strong>fecha:</strong>{historial["enviarPresupuesto"]?.day}-</p></>}
                      
                    </>
                
               
        }
        </div>
    )
}

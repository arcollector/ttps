import React, { useEffect, useState } from 'react';
//import { v4 as uuidv4 } from 'uuid';

import firebase from '../../utils/Firebase';

import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import './Estudios.scss';


const db= firebase.firestore(firebase);


export default function Estudios() {


    const [exams, setExams] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [patients, setPatients] = useState(null);
    


    useEffect(() => {
        const refMedicExams= db.collection("medicExams");
        refMedicExams.get().then(doc=>{
            let arrayExams=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    data.id=docActual.id;
                    arrayExams.push(data);
                    return{}
                })
               
                setExams(arrayExams);
                
               
            }
        })
        return () => {
            
        }
    }, [])


    useEffect(() => {
        const refDocMedic= db.collection("doctors");
        refDocMedic.get().then(doc=>{
            
            let arrayDoctors=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    arrayDoctors[data.id]=`${data.nombre} ${data.apellido}`;
                    return {}
                    
                })
                setDoctors(arrayDoctors);
               
            }
        })
        return () => {
            
        }
    }, [])



    useEffect(() => {
        const refDocMedic= db.collection("patients");
        refDocMedic.get().then(doc=>{
            
            let arrayPatients=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    data.nombreCompleto=`${data.nombre} ${data.apellido}`;
                    arrayPatients[data.id]=data;
                    return {}
                    
                })
                setPatients(arrayPatients);
               
            }
        })
        return () => {
            
        }
    }, [])





    
    
    return (
        <div className="estudios-content">
            {exams?.map(exam=>{
               return( 
                <div className="contenedor-tarjeta">
               <div className="ui card">
                    
                        {patients &&<div className="header">{patients[exam.idPatient].nombreCompleto}</div>}
                    
                    
                    <div className="content">
                        <h4 className="ui sub header">Estudios</h4>
                        <ol className="ui list">
                           {exam.arraySelected==="true"&&( <li value="*" key="array">Array</li>)}
                           {exam.genomaSelected==="true"&&( <li value="*"key="genoma">Genoma</li>)}
                           {exam.cariotipoSelected==="true"&&( <li value="*" key="cariotipo">Cariotipo</li>)}
                           {exam.exomaSelected==="true"&&( <li value="*" key="exoma">Exoma</li>)}
                           {exam.carrierSelected==="true"&&( <li value="*" key="carrier">Carrier</li>)}
                            
                        </ol>
                        <h4 className="ui sub header">Medico Derivante:</h4>
                        <ol className="ui list">
                            {doctors && <li key="medic" value="*">{doctors[exam.idMedic]}</li>}
                        </ol>
                        
                        
                    </div>
                    <button className="ui button">Enviar Estudio</button>
            </div>
            
            </div>
            
            );


            })

            }
             
        </div>
    )
}

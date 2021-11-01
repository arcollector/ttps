import React, { useEffect, useState } from 'react';
//import { v4 as uuidv4 } from 'uuid';

import firebase from '../../shared/utils/Firebase';

import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import '../styles/MedicalExams.scss';


const db= firebase.firestore(firebase);


export function MedicalExams() {


    const [exams, setExams] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [patients, setPatients] = useState(null);
    const [states, setStates] = useState([]);
    const [filterStates, setFilterStates] = useState(null);



    useEffect(() => {
        const refDocStates= db.collection("states");
        let filters=[];
        let arrayStates=[]; 
        refDocStates.get().then(doc=>{
            
            
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    arrayStates[data.id]=data.name;
                    if(!filters.includes(data.name)){
                        filters.push(data.name);
                        filters[data.name]=[];
                       
                    }
                    return {}
                    
                })
                
                setStates(arrayStates);
                
               
            }
        })

        const refMedicExams= db.collection("medicExams");
        refMedicExams.get().then(doc=>{
            let arrayExams=[]; 
            
            if(!doc.empty ){

                
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    data.id=docActual.id;
                    arrayExams.push(data);
                    
                    filters[arrayStates[data.idState]]?.push(data);
                    
                    
                    return{}
                }) 

                
               
                setExams(arrayExams);
                setFilterStates(filters);
                
                   
               
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
            {filterStates&& filterStates?.map((exams, data)=>{
                
                return( 
                    <>
                      {exams==="enviarPresupuesto" && <h3>Estudios que requieren enviar presupuesto</h3>}
                      {exams==="enviarConsentimiento" && <h3>Estudios que requieren enviar consentimiento</h3>}
                      {exams==="esperandoComprobante" && <h3>Estudios impagos</h3>}
                      

                    <div class="section-state">

                            
                        
                            
                            {filterStates[exams].map(exam=>{
                            
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

                                                {exams==="enviarPresupuesto" && <button className="ui button">Enviar Presupuesto</button>}
                                                {exams==="enviarConsentimiento" && <button className="ui button">Enviar Consentimiento</button>}
                                                 {exams==="esperandoComprobante" && <button className="ui button">Subir comprobante</button>}
                                                
                                        </div>
                                        
                                        </div>
                                        
                                        );

                        })}
                </div>
                </>
            )
            })}
            
             
        </div>
    )
}

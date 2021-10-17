
//LIBRERIAS
import React, { useState, useEffect } from 'react';
import {Form, Button, } from 'semantic-ui-react';
import {toast} from 'react-toastify';
import DatePicker from "react-widgets/DatePicker";
import DropdownList from "react-widgets/DropdownList";
import twix from 'twix';
import moment from 'moment';

//BASE DE DATOS
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

//SCSS
import '../styles/AppointmentNewForm.scss'
import "react-widgets/scss/styles.scss";


//INICIALIZACIONES

moment.locale('es');

const now= moment().minutes(0).seconds(0).add(1,'hours');
// const nowPlus1=now.clone().add(1,'hours');
// const nowPlus7=now.clone().add(7,'hours');

const db= firebase.firestore(firebase);


export function AppointmentNewForm(props) {

    const {reserved, setReserved, setShowModal, setReloading}= props;
    const [dateStart, setDateStart] = useState(now.toDate());
    const [formData, setFormData] = useState(initialValues());
    const [paciente, setPaciente] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [exams, setExams] = useState(null);
    const [examSelected, setExamSelected] = useState("");

   

    const searchPatient=()=>{
        let pacienteBuscado=[];
        const refDoc= db.collection('patients').where("dni","==",formData.search.toString());
        refDoc.get().then(doc=>{
            if(!doc.empty){
                
                
                
                pacienteBuscado.push(doc.docs[0].data());
                pacienteBuscado[0].id=doc.docs[0].id;
                
                
            }else{
                toast.warning("El paciente que ingreso no existe");
            }
            setPaciente(pacienteBuscado[0]);
            
      })
    }

    useEffect(() => {
        if(paciente){
            
            const refMedicExams= db.collection("medicExams").where("idPatient","==",paciente.id.toString());
            refMedicExams.get().then(doc=>{
                let arrayExams=[]; 
                if(!doc.empty){
                    
                    doc.docs.map((docActual)=>{
                        const data=docActual.data();
                        data.id=docActual.id;
                        arrayExams.push(data);
                        return {}
                    })

                   
                    setExams(arrayExams);
                    setExamSelected(arrayExams[0].id);
                    
                   
                }
            })
        }
        return () => {
            
        }
    }, [paciente])


    

    const onChange=(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value});
        
    }

    const onSubmit=()=>{
        
        
        if(reserved[formData.hour+formData.date]){
            
            toast.warning('El turno elegido no esta disponible')
        }else{

            if(!paciente){
                toast.warning('Debe ingresar el dni de un paciente');
            }
            else{
                    if(!examSelected){
                        toast.warning('Debe seleccionar un estudio')
                    }else{
                        setIsLoading(true);
                        
                        db.collection("shifts").add({
                            idMedicExam:examSelected,
                            date:formData.date,
                            hour:formData.hour,
                            idPatient:paciente.id
    
                        }).then(()=>{
                            toast.success("El turno fue reservado")
                            let arrayReserved=reserved;
                            arrayReserved[formData.hour+formData.date]=true;
                            setReserved(arrayReserved);
                        }).catch(()=>{
                            toast.error("Hubo un error en la reserva del turno. Vuelva a intentarlo")
                        }).finally(()=>{
                            setIsLoading(false);
                            setShowModal(false);
                            setReloading(true);
                        })
                    }
            }
        }
            
    }
        
    


    const getTimeList=()=>{
        const horario= now.hours(8).minutes(0).twix(now.clone().add(7,'hours'));
        horario.format({hourFormat: "hh"})
        let iter=horario.iterate(15, 'minutes');
        let turnos=[];
        
        while(iter.hasNext()){
            
            turnos.push(iter.next().format('HH:mm'));
        }
        
        
        
        
        return turnos; 
    
    }

    const handleDateChange=(e)=>{
        
        setDateStart(e);
        setFormData({
            ...formData,
            date:e.toLocaleDateString()
        })
    }

    const handlerMedicExamSelected=(e)=>{
        
        setExamSelected(e.target.value);
        
    }

    const handleHourChange=(e)=>{
        setFormData({
            ...formData,
            hour:e
        })
    }

    


    return (
        <Form className="add-medic-exam-form" onSubmit={onSubmit}>

            <div className="ui search">
            <div className="ui icon input">
                <input className="prompt" name="search" type="text" onChange={onChange} placeholder="Dni del paciente..."/>
                <i className="search icon" onClick={searchPatient}></i>
                
            </div>
            <Button type="button" onClick={searchPatient}>Buscar</Button>
            <div className="results"></div>
            </div>

            <div className="header-section">
                <h4>Datos del paciente</h4>
            </div>

            <div className="two-columns">
            
            <Form.Field>
                <div>Nombre y apellido: {paciente?.nombre} {paciente?.apellido}</div> 
                

            </Form.Field>
            <Form.Field>
                <div>Obra social: {paciente?.nomsoc}</div> 
                

            </Form.Field>

            
            </div>
            
            <div className="three-columns">
                <Form.Field>
                    <div>Dni: {paciente?.dni}</div> 
                  

                </Form.Field>
                <Form.Field>
                    <div>Cod Area: {paciente?.code}</div> 
                   

                </Form.Field>
                <Form.Field>
                    <div>Telefono: {paciente?.telefono}</div> 
                   

                </Form.Field>
            </div>

            <div className="header-section">
                <h4>Estudios sin turno</h4>

                <Form.Field>

                        


                            <select multiple={false} onChange={handlerMedicExamSelected} name="exam" className="ui fluid normal dropdown">
                            {exams?.map(exam=>{
                                return <option  key={exam?.id} value={exam?.id}>{`${exam?.fechaCompleta} ${exam?.patology}`}</option>
                            })}
                            
                            
                            </select>
                </Form.Field>



            </div>

            <div className="header-section">
                <h4>Datos del turno</h4>
                <label>Fecha y hora del turno</label>
                            
                            <Form.Field>
                                <DatePicker
                                    onChange={handleDateChange}
                                    defaultValue={dateStart}
                                    
                                    
                                />
                            </Form.Field>
                            <Form.Field>
                                <DropdownList
                                    data={getTimeList()}
                                    onChange={handleHourChange}
                                    className="w-2/5 mt-0"
                                />
                            </Form.Field>
            </div>
            <Button type="submit" loading={isLoading}>Reservar Turno</Button>
        </Form>
    )
}


function initialValues(){
    return ({
        
        patologia:"",
        search:"",
        date:"",
        hour:""
        
        
    })
}


import React, { useState } from 'react';
import {Form, Input, Button, } from 'semantic-ui-react';
import {toast} from 'react-toastify';
//import { v4 as uuidv4 } from 'uuid';
import firebase from '../../shared/utils/Firebase';
import {validateEmail} from '../../shared/utils/Validations';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const db= firebase.firestore(firebase);

export function NewForm(props) {


    const {setShowModal}=props;

    const [formData, setFormData] = useState(initialValues());
    const [isLoading, setIsLoading] = useState(false);

    

    
    
    const onSubmit=async()=>{
        
        if(!formData.paciente && !formData.dni && !formData.code && !formData.telefono && !formData.email&& !formData.nomsoc && !formData.numsoc){
            toast.warning("Debe completar todos los datos");
        }else{
           if(!validateEmail(formData.email)){
                toast.warning("Ingrese una direccion de correo valida")
           }else{
                
                const refDoc= db.collection('patients').where("dni","==",formData.dni.toString());
                refDoc.get().then(doc=>{
                    if(!doc.empty){
                        
                        toast.warning("El paciente que intenta crear ya existe");
                    }else{
                        console.log(formData);
                        setIsLoading(true);
                        db.collection("patients").add({
                            nombre:formData.nompaciente,
                            apellido:formData.apellido,
                            dni:formData.dni,
                            code:formData.code,
                            telefono:formData.telefono,
                            email:formData.email,
                            nomsoc:formData.nomsoc,
                            numsoc:formData.numsoc,


                        }).then(()=>{
                            toast.success("El paciente fue cargado correctamente");
                        }).catch((error)=>{
                            toast.error("Error al guardar el paciente");
                            console.log(error);
                        }).finally(()=>{
                            setIsLoading(false);
                            setFormData(initialValues());
                            setShowModal(false);
                        })
                            }
                        })
               

                
           }
        } 
    }

    const onChange=(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value});
        
    }

    return (
        <Form className="add-medic-exam-form" onSubmit={onSubmit}>

           

            <div className="header-section">
                <h4>Datos del paciente</h4>
            </div>
            <div className="two-columns">
            <Form.Field>
                <div>Nombre:</div> 
                <Input name="nompaciente" placerholder="nombre del paciente" onChange={onChange}/>

            </Form.Field>
            <Form.Field>
                <div>Apellido:</div> 
                <Input name="apellido" placerholder="nombre del paciente" onChange={onChange}/>

            </Form.Field>
            </div>
            <div className="three-columns">
                <Form.Field>
                    <div>Dni:</div> 
                    <Input name="dni" placerholder="dni" onChange={onChange}/>

                </Form.Field>
                <Form.Field>
                    <div>Cod Area:</div> 
                    <Input name="code" placerholder="code" onChange={onChange}/>

                </Form.Field>
                <Form.Field>
                    <div>Telefono:</div> 
                    <Input name="telefono" placerholder="telefono" onChange={onChange}/>

                </Form.Field>
            </div>


            <Form.Field>
                <div>Correo Electronico:</div> 
                <Input name="email" placerholder="email" onChange={onChange}/>

            </Form.Field>

            <div className="two-columns">
                <Form.Field>
                    <div>Nombre de la obra social:</div> 
                    <Input name="nomsoc" placerholder="nomsoc" onChange={onChange}/>

                </Form.Field>
                
                <Form.Field>
                    <div>Numero de la obra social:</div> 
                    <Input name="numsoc" placerholder="numsoc" onChange={onChange}/>

                </Form.Field>
            </div>

            <Button type="submit" loading={isLoading}>Cargar Datos del Paciente</Button>
            
        </Form>
    )
}



function initialValues(){
    return ({
        nompaciente:"",
        apellido:"",
        dni:"",
        code:"",
        telefono:"",
        email:"",
        nomsoc:"",
        numsoc:"",
        
        
    })
}
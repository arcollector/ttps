
import React, { useState, useEffect } from 'react';
import {Form, Input, Button, Image, List, Icon, TextArea} from 'semantic-ui-react';
import {toast} from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../../utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import pdfService from '../../../pdfservice';

import examen from '../../../assets/jpg/virus1.jpg'
import examen2 from '../../../assets/jpg/virus2.jpg'
import examen3 from '../../../assets/jpg/virus3.jpg'
import examen4 from '../../../assets/jpg/virus4.jpg'
import examen5 from '../../../assets/jpg/virus5.jpg'



import './AddMedicalExamForm.scss';

const db= firebase.firestore(firebase);

export default function AddMedicalExamForm(props) {

    const {setShowModal, user}= props;

    

    console.log(user);
    
    const [presupuesto, setPresupuesto] = useState(0);
    const [formData, setFormData] = useState(initialValues());
    const [seleccionado, setSeleccionado] = useState(initialState());
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [paciente, setPaciente] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [prices, setPrices] = useState(null);
    const [doctorSelected, setDoctorSelected] = useState("");

    useEffect(() => {
        const refDocPrices= db.collection("pricesMedicExams");
        refDocPrices.get().then(doc=>{
            let arrayPrices=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    data.id=docActual.id;
                    arrayPrices[data.exam]=data.price;
                })
               
                setPrices(arrayPrices);
                
               
            }
        })
        return () => {
            
        }
    }, [])


    useEffect(() => {
        const refDocMedic= db.collection("doctors");
        refDocMedic.get().then(doc=>{
            setDoctorSelected(doc.docs[0].id);
            let arrayDoctors=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    arrayDoctors.push(data);
                })
                setDoctors(arrayDoctors);
               
            }
        })
        return () => {
            
        }
    }, [])
    

    const onSubmit=async()=>{
        
        if(!paciente){
            toast.warning("El examen debe incluir los datos del paciente");
        }else{
            if(!formData.patologia){
                toast.warning("El examen debe incluir una patologia");
            }else{
                if(seleccionado["exoma"]==="false" && seleccionado["genoma"]==="false" && seleccionado["carrier"]==="false" && seleccionado["cariotipo"]==="false"&& seleccionado["array"]==="false"){
                    toast.warning("Se debe seleccionar un examen medico");
                }else{
                    setIsLoading(true);
                    await setFile(MyDocument());
                    let fileName=uuidv4();
                    
                    fileName=fileName+".pdf";
                    uploadPdf(fileName)
                    .then((res)=>{
                        toast.success("El archivo se subio correctamente");
                        let id=uuidv4();
                        db.collection("medicExams").add({
                            id:id,
                            idPatient:paciente.id,
                            idEmployee:user.uid,
                            idMedic:doctorSelected,
                            patology:formData.patologia,
                            exomaSelected:seleccionado["exoma"],
                            genomaSelected:seleccionado["genoma"],
                            carrierSelected:seleccionado["carrier"],
                            cariotipoSelected:seleccionado["cariotipo"],
                            arraySelected:seleccionado["array"],
                            price:presupuesto,


                        }).then(()=>{
                            toast.success("El estudio fue cargado correctamente");
                        }).catch((error)=>{
                            toast.error("Error al guardar el estudio");
                            console.log(error);
                        }).finally(()=>{
                            setIsLoading(false);
                            setFormData(initialValues());
                        })



                        setShowModal(false);
                    })
                }
            }
        } 
    }

    const uploadPdf=async(fileName)=>{
        const metadata = {
            contentType: 'application/pdf',
          };
        const ref= firebase.storage().ref().child(`estudiospdf/${fileName}`);
        return await ref.put(file, metadata);
    }

    const MyDocument=async()=>{
        console.log('entre');
        try{
            pdfService.downloadPDF("https://www.iteramos.com/pregunta/19644/como-acceder-a-los-parametros-get-en-expressjs-o-nodejs").then((res)=>{

                //var file = new File([myBlob], "name");
                
                const file= new Blob([res.data], {type:'application/pdf'});
                //var file2 = new File([file], "holaname");
                
                console.log(file);
                const anchorLink= document.createElement('a');
                anchorLink.href=window.URL.createObjectURL(file);
                anchorLink.setAttribute('download','prueba5.pdf');
                anchorLink.click();
                let fd= new FormData();
                fd.set('a', file);
                return fd.get('a');
                //return file;
            })
        }catch(error){

            console.log(error);
        }
    }


    const calucularPresupuesto= (e)=>{
        
        switch (e.target.name) {
            
            case "exoma":
                if(seleccionado[e.target.name]==="false"){
                    
                    setPresupuesto(presupuesto+ prices[e.target.name]);
                    setSeleccionado({...seleccionado, exoma:"true"});
                    
                }else{
                    setPresupuesto(presupuesto-prices[e.target.name]);
                    setSeleccionado({...seleccionado, exoma:"false"});
                    
                }
                
                break;
            case "genoma":
                if(seleccionado[e.target.name]==="false"){
                    
                    setPresupuesto(presupuesto+prices[e.target.name]);
                    setSeleccionado({...seleccionado, genoma:"true"});
                    
                }else{
                    setPresupuesto(presupuesto-prices[e.target.name]);
                    setSeleccionado({...seleccionado, genoma:"false"});
                    
                }
                break;
            case "carrier":
                if(seleccionado[e.target.name]==="false"){
                    
                    setPresupuesto(presupuesto+prices[e.target.name]);
                    setSeleccionado({...seleccionado, carrier:"true"});
                    
                }else{
                    setPresupuesto(presupuesto-prices[e.target.name]);
                    setSeleccionado({...seleccionado, carrier:"false"});
                    
                }
                break;
                case "cariotipo":
                    if(seleccionado[e.target.name]==="false"){
                        
                        setPresupuesto(presupuesto+prices[e.target.name]);
                        setSeleccionado({...seleccionado, cariotipo:"true"});
                        
                    }else{
                        setPresupuesto(presupuesto-prices[e.target.name]);
                        setSeleccionado({...seleccionado, cariotipo:"false"});
                        
                    }
                    break;
                case "array":
                       if(seleccionado[e.target.name]==="false"){
                           
                        setPresupuesto(presupuesto+prices[e.target.name]);
                        setSeleccionado({...seleccionado, array:"true"});
                            
                      }else{
                         setPresupuesto(presupuesto-prices[e.target.name]);
                         setSeleccionado({...seleccionado, array:"false"});
                            
                      }
                      break;
            default:
                break;
        }
    }

    const onChange=(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value});
        
    }

    


      const searchPatient=()=>{
        let pacienteBuscado=[];
        const refDoc= db.collection('patients').where("dni","==",formData.search.toString());
        refDoc.get().then(doc=>{
            if(!doc.empty){
                
                
                
                pacienteBuscado.push(doc.docs[0].data());
                pacienteBuscado[0].id=doc.docs[0].id;
                console.log(pacienteBuscado);
                
            }else{
                toast.warning("El paciente que ingreso no existe");
            }
            setPaciente(pacienteBuscado[0]);
      })
    }

    const handlerDoctorSelected=(e)=>{
        setDoctorSelected(e.target.value);
        
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
                <div>Nombre del paciente:</div> 
                <Input name="nompaciente" disabled={true} value={paciente?.nombre} placerholder="nombre del paciente" />

            </Form.Field>

            <Form.Field>
                <div>Apellido:</div> 
                <Input name="apellido" disabled={true} value={paciente?.apellido} placerholder="nombre del paciente" />

            </Form.Field>
            </div>
            
            <div className="three-columns">
                <Form.Field>
                    <div>Dni:</div> 
                    <Input name="dni" disabled={true} value={paciente?.dni} placerholder="dni" />

                </Form.Field>
                <Form.Field>
                    <div>Cod Area:</div> 
                    <Input name="code" disabled={true} value={paciente?.code} placerholder="code" />

                </Form.Field>
                <Form.Field>
                    <div>Telefono:</div> 
                    <Input name="telefono" disabled={true} value={paciente?.telefono} placerholder="telefono" />

                </Form.Field>
            </div>


            <Form.Field>
                <div>Correo Electronico:</div> 
                <Input name="email" disabled={true} value={paciente?.email} placerholder="email" />

            </Form.Field>

            <div className="two-columns">
                <Form.Field>
                    <div>Nombre de la obra social:</div> 
                    <Input name="nomsoc" disabled={true} value={paciente?.nomsoc} placerholder="nomsoc" />

                </Form.Field>
                
                <Form.Field>
                    <div>Numero de la obra social:</div> 
                    <Input name="numsoc" disabled={true} value={paciente?.numsoc} placerholder="numsoc" />

                </Form.Field>
            </div>

            <div className="header-section">
                <h4>Datos del estudio</h4>
            </div>

            <Form.Field>

                <div>Medico Derivante:</div>

                
                    <select multiple={false} onChange={handlerDoctorSelected} name="medicodev" className="ui fluid normal dropdown">
                    {doctors?.map(doc=>{
                        return <option  key={doc?.id} value={doc?.id}>{`${doc?.nombre} ${doc?.apellido}`}</option>
                    })}
                    
                    
                    </select>
            </Form.Field>


            <Form.Field>
                <div>Patologia (diagnostico presuntivo):</div> 
                <TextArea name="patologia" placerholder="patologia" onChange={onChange}/>

            </Form.Field>
            
            Seleccionar Examen Medico
            <List className="patology">
                
                <List.Item>
                    <Image avatar src={examen} />
                    <List.Content>
                        <List.Header as='a' name="exoma" onClick={calucularPresupuesto}>Exoma</List.Header>
                        {seleccionado.exoma==="true"&&(<Icon name="chevron circle up"/>)}    
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={examen2} />
                    <List.Content>
                        <List.Header as='a' name="genoma" onClick={calucularPresupuesto}>Genoma Mitocondrial Completo</List.Header>
                        {seleccionado.genoma==="true"&&(<Icon name="chevron circle up"/>)} 
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={examen3} />
                    <List.Content>
                        <List.Header as='a' name="carrier" onClick={calucularPresupuesto}>Carrier de Enfermedades Monogenicas</List.Header>
                        {seleccionado.carrier==="true"&&(<Icon name="chevron circle up"/>)} 
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={examen4} />
                    <List.Content>
                        <List.Header as='a' name="cariotipo" onClick={calucularPresupuesto}>Cariotipo</List.Header>
                        {seleccionado.cariotipo==="true"&&(<Icon name="chevron circle up"/>)} 
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={examen5} />
                    <List.Content>
                        <List.Header as='a' name="array" onClick={calucularPresupuesto}>Array CGH</List.Header>
                        {seleccionado.array==="true"&&(<Icon name="chevron circle up"/>)} 
                    </List.Content>
                </List.Item>
            </List>
            <h2>Presupuesto: {presupuesto}</h2>
            <Button type="submit" loading={isLoading}>Crear Estudio Medico</Button>
            <Button onClick={MyDocument} >Descargar pdf</Button>
        </Form>
    )
}

function initialValues(){
    return ({
        
        patologia:"",
        search:""
        
        
    })
}

function initialState(){
    return({
    exoma:"false",
    genoma:"false",
    carrier:"false",
    cariotipo:"false",
    array:"false",
    })
}

// function initialValuesPrices(){
//     const prices={};
//     return prices;
// }


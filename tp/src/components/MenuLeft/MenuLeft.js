import React, {useState, useEffect} from 'react';
import './MenuLeft.scss';
import {Menu, Icon} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';

//import {isUserAdmin} from '../../utils/Api';
import BasicModal from '../Modal/BasicModal/BasicModal';
import AddMedicalExamForm from '../MedicalExams/AddMedicalExamForm';
import AddPatientForm from '../Patient/AddPatientForm';

 function MenuLeft(props) {

    const {user, location}= props;
    const [activeMenu, setActiveMenu] = useState(location.pathname);
   // const [userAdmin, setUserAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);


    // useEffect(() => {
        
    //     isUserAdmin(user.uid).then((response)=>{
    //         setUserAdmin(response);
    //     }).catch(err=>{
    //         console.log(err);
    //     });
    //     return () => {
            
    //     }
    // }, [user.uid])

    useEffect(() => {
        setActiveMenu(location.pathname);
        return () => {
            
        }
    }, [location])
   


    const handlerMenu=(event,menu)=>{
        
        setActiveMenu(menu.to);
    }

    const handlerModal= (type)=>{
        switch (type) {
            case "paciente":
                setTitleModal("Nuevo Paciente");
                setContentModal(<AddPatientForm  user={user} setShowModal={setShowModal}/>);
                setShowModal(true);
                break;
            case "estudio":
                setTitleModal("Nuevo Estudio");
                setContentModal(<AddMedicalExamForm user={user} setShowModal={setShowModal}/>);
                setShowModal(true);
                break;
            
        
            default:
                setTitleModal(null);
                setShowModal(false);
                setContentModal(null);
                break;
        }
    }


    return (

        <> 
        
        
        
            <Menu className="menu-left" vertical>
                <div className="top">
                    <Menu.Item 
                    as={Link} 
                    to="/"
                    active={activeMenu==="/"} 
                    onClick={handlerMenu}
                    >
                        <Icon name="home"/> Inicio
                    </Menu.Item>
                    <Menu.Item 
                        as={Link} 
                        to="/estudios"
                        active={activeMenu==="/estudios"} 
                        onClick={handlerMenu}
                    >
                        <Icon name="file outline"/> Estudios
                    </Menu.Item>

                    <Menu.Item 
                        as={Link} 
                        to="/turnos"
                        active={activeMenu==="/turnos"} 
                        onClick={handlerMenu}
                    >
                        <Icon name="calendar alternate outline"/> Turnos
                    </Menu.Item>

                    <div className="footer">
                    <Menu.Item as={Link} to="/crearestudio" onClick={()=>handlerModal("estudio")}>
                        <Icon name="plus square outline"/> Crear Nuevo Estudio
                    </Menu.Item>

                    <Menu.Item as={Link} to="/agregarpaciente" onClick={()=>handlerModal("paciente")}>
                        <Icon name="plus square outline"/> Agregar Nuevo Paciente
                    </Menu.Item>
                    
                    </div>

                </div>
                
                

            </Menu>
            <BasicModal
                show={showModal}
                setShow={setShowModal}
                title={titleModal}
            >
                {contentModal}
            </BasicModal>
        </>
        
    )
}


export default withRouter(MenuLeft);

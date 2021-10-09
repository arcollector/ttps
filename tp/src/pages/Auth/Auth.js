import React, {useState} from 'react';

import AuthOptions from '../../components/Auth/AuthOptions';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';

import BackgroundApp from '../../assets/jpg/background-medico.jpg';
import LogoAuth from '../../assets/png/logo.png';

import "./Auth.scss";





export default function Auth() {
    
   

    
     

    const [selectedForm, setSelectedForm] = useState(null);

    const handlerForm= ()=>{
        switch (selectedForm) {
            case "login":
                
                return <LoginForm setSelectedForm={setSelectedForm}/>;
            case "register":
                return <RegisterForm setSelectedForm={setSelectedForm}/>
            default:
                return <AuthOptions setSelectedForm={setSelectedForm}/>;
        }
    }

    return (
        <div className="auth" style={{backgroundImage: `url(${BackgroundApp})`}}>
            <div className="auth__dark" />
            <div className="auth__box">
                    <div className="auth__box__logo">
                        <img src={LogoAuth} alt="logo" />
                    </div>
                
                    {handlerForm()}
                    
            </div>
                
            
        </div>
    )
}
